from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action

import requests
from bs4 import BeautifulSoup

from .models import LiveNews, NewsFeedback
from .serializers import LiveNewsSerializer, LiveNewsDetailedSerializer, NewsFeedbackSerializer, NewsFeedbackCreateSerializer
# from News.model import load_models  # OLD MODEL - COMMENTED OUT

# NEW IMPORT - Import from separate model file
from News.fake_news_detector import predict_fake_news

import threading
import time

def get_new_news_from_api_and_update():
    # response = requests.get("https://content.guardianapis.com/search?api-key=e705adff-ca49-414e-89e2-7edede919e2e")
    response = requests.get("https://content.guardianapis.com/search?api-key=9252ee0a-c291-4039-8e09-7bfeb0a1e620")

    try:
        news_data = response.json()
    except Exception as e:
        print("Failed to parse JSON:", e)
        return
    
    # print("API Response:", news_data)

    if not news_data.get("response") or not news_data["response"].get("results"):
        print("API did not return results")
        return

    news_titles = [article["webTitle"] for article in news_data["response"]["results"]]
    news_publication_dates = [article["webPublicationDate"] for article in news_data["response"]["results"]]
    news_categories = []

    for article in news_data["response"]["results"]:
        try:
            news_categories.append(article["pillarName"])
        except KeyError:
            news_categories.append("Undefined")
    
    section_id = [article["sectionId"] for article in news_data["response"]["results"]]
    section_name = [article["sectionName"] for article in news_data["response"]["results"]]
    type = [article["type"] for article in news_data["response"]["results"]]
    web_url = [article["webUrl"] for article in news_data["response"]["results"]]

    # OLD MODEL LOADING - COMMENTED OUT
    # nb_model, vect_model = load_models()

    def scrap_img_from_web(url):
        print(url)
        r = requests.get(url)
        if r.status_code != 200:
            return "None"
        web_content = r.content
        soup = BeautifulSoup(web_content, 'html.parser')
        imgs = soup.find_all('article')[0].find_all('img', class_='dcr-evn1e9')
        img_urls = []
        for img in imgs:
            src = img.get("src")
            img_urls.append(src)
        
        if not img_urls:
            return "None"
        return img_urls[0]

    for i in range(len(news_titles)):
            title_ = news_titles[i]
            publication_date_ = news_publication_dates[i]
            category_ = news_categories[i]
            section_id_ = section_id[i]
            section_name_ = section_name[i]
            type_ = type[i]
            web_url_ = web_url[i]
            

            if not LiveNews.objects.filter(web_url=web_url_).exists():
                
                # OLD MODEL PREDICTION - COMMENTED OUT
                # vectorized_text = vect_model.transform([title_])
                # prediction = nb_model.predict(vectorized_text)
                # prediction_bool = True if prediction[0] == 1 else False

                # NEW MODEL PREDICTION - Using imported function
                prediction_bool = predict_fake_news(title_)

                img_url_ = scrap_img_from_web(web_url_)
                
                news_article = LiveNews(
                    title=title_,
                    publication_date=publication_date_,
                    news_category=category_,
                    prediction=prediction_bool,
                    section_id=section_id_,
                    section_name=section_name_,
                    type=type_,
                    web_url=web_url_,
                    img_url=img_url_,
                )

                news_article.save()

def auto_refresh_news():
    get_new_news_from_api_and_update()
    
    interval = 300
    while True:
        print("Thread running!")
        get_new_news_from_api_and_update()
        time.sleep(interval)

auto_refresh_thread = threading.Thread(target=auto_refresh_news)
auto_refresh_thread.daemon = True
auto_refresh_thread.start()

class LiveNewsPrediction(viewsets.ViewSet):
    http_method_names = ('get', 'post', )

    def list(self, request):
        """Handles GET request by displaying all newly retrieved in database."""
        all_live_news = LiveNews.objects.all().order_by('-id')[:20]

        serializer = LiveNewsDetailedSerializer(all_live_news, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def retrieve(self, request, pk=None):
        """Get's all data from a specific id in database."""
        try:
            news_prediction = LiveNews.objects.get(pk=pk)
        except LiveNews.DoesNotExist:
            return Response({"error": "News not found"}, status=404)
        
        serializer = LiveNewsDetailedSerializer(news_prediction)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request):
        """Check single news title for fake news detection"""
        title = request.data.get('title', '').strip()
        
        if not title:
            return Response(
                {"error": "Please provide a news title"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Use the imported model to predict with confidence
        result = predict_fake_news(title, return_confidence=True)
        
        response_data = {
            "title": title,
            "prediction": result["label"],
            "is_real": result["prediction"],
            "confidence": result["confidence"],
            "confidence_percentage": f"{result['confidence'] * 100:.1f}%"
        }
        
        return Response(response_data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated])
    def feedback_stats(self, request, pk=None):
        """Get feedback statistics for a specific news article"""
        try:
            news = LiveNews.objects.get(pk=pk)
        except LiveNews.DoesNotExist:
            return Response({"error": "News not found"}, status=404)
        
        feedbacks = NewsFeedback.objects.filter(news=news)
        total_feedbacks = feedbacks.count()
        
        stats = {
            'total_feedbacks': total_feedbacks,
            'correct_predictions': feedbacks.filter(feedback_type='correct').count(),
            'incorrect_predictions': feedbacks.filter(feedback_type='incorrect').count(),
            'unsure': feedbacks.filter(feedback_type='unsure').count(),
            'user_feedback': None
        }
        
        # Check if current user has given feedback
        user_feedback = feedbacks.filter(user=request.user).first()
        if user_feedback:
            stats['user_feedback'] = NewsFeedbackSerializer(user_feedback).data
        
        return Response(stats, status=status.HTTP_200_OK)


class LiveNewsByCategory(viewsets.ViewSet):
    def list(self, request, category=None):
        if category is not None:
            live_news = LiveNews.objects.filter(section_name=category).order_by('-id')
            serializer = LiveNewsDetailedSerializer(live_news, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Category not provided in the URL'}, status=status.HTTP_400_BAD_REQUEST)


class NewsFeedbackViewSet(viewsets.ModelViewSet):
    """ViewSet for handling news feedback"""
    permission_classes = [IsAuthenticated]
    serializer_class = NewsFeedbackSerializer
    
    def get_queryset(self):
        """Return feedbacks for the current user"""
        return NewsFeedback.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        """Use different serializer for creation"""
        if self.action == 'create':
            return NewsFeedbackCreateSerializer
        return NewsFeedbackSerializer
    
    def perform_create(self, serializer):
        """Automatically set the user when creating feedback"""
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def my_feedbacks(self, request):
        """Get all feedbacks given by the current user"""
        feedbacks = self.get_queryset()
        serializer = self.get_serializer(feedbacks, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'])
    def feedback_summary(self, request):
        """Get summary of user's feedback activity"""
        feedbacks = self.get_queryset()
        total_feedbacks = feedbacks.count()
        
        summary = {
            'total_feedbacks': total_feedbacks,
            'correct_predictions': feedbacks.filter(feedback_type='correct').count(),
            'incorrect_predictions': feedbacks.filter(feedback_type='incorrect').count(),
            'unsure': feedbacks.filter(feedback_type='unsure').count(),
            'recent_feedbacks': NewsFeedbackSerializer(feedbacks[:5], many=True).data
        }
        
        return Response(summary, status=status.HTTP_200_OK)
