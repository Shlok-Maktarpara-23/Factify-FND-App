from rest_framework import serializers
from .models import LiveNews, NewsFeedback


class LiveNewsSerializer(serializers.ModelSerializer):
    class Meta:
        model = LiveNews
        fields = (
                    'id', 'title', 'publication_date',
                    'news_category', 'prediction', 'img_url',
                 )


class LiveNewsDetailedSerializer(serializers.ModelSerializer):
    feedback_count = serializers.SerializerMethodField()
    user_feedback = serializers.SerializerMethodField()
    
    class Meta:
        model = LiveNews
        fields = (
                    'id', 'title', 'publication_date',
                    'news_category', 'prediction', 'section_id',
                    'section_name', 'type', 'web_url', 'img_url',
                    'feedback_count', 'user_feedback'
                 )
    
    def get_feedback_count(self, obj):
        return obj.feedbacks.count()
    
    def get_user_feedback(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            user_feedback = obj.feedbacks.filter(user=request.user).first()
            if user_feedback:
                return {
                    'feedback_type': user_feedback.feedback_type,
                    'user_comment': user_feedback.user_comment,
                    'created_at': user_feedback.created_at.isoformat() if user_feedback.created_at else None
                }
        return None


class NewsFeedbackSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)
    news_title = serializers.CharField(source='news.title', read_only=True)
    prediction = serializers.BooleanField(source='news.prediction', read_only=True)
    created_at = serializers.DateTimeField(format='%Y-%m-%dT%H:%M:%S.%fZ')
    updated_at = serializers.DateTimeField(format='%Y-%m-%dT%H:%M:%S.%fZ')
    
    class Meta:
        model = NewsFeedback
        fields = [
            'id', 'user_email', 'news_title', 'prediction',
            'feedback_type', 'user_comment', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user_email', 'news_title', 'prediction', 'created_at', 'updated_at']


class NewsFeedbackCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsFeedback
        fields = ['news', 'feedback_type', 'user_comment']
    
    def validate(self, data):
        # Check if user already gave feedback for this news
        user = self.context['request'].user
        news = data['news']
        
        if NewsFeedback.objects.filter(user=user, news=news).exists():
            raise serializers.ValidationError("You have already provided feedback for this news article.")
        
        return data
