from rest_framework import routers
from UserCheckByTitle.views import UserCheckViewSet
from Livenews.views import LiveNewsPrediction, LiveNewsByCategory, NewsFeedbackViewSet
from NewsQuiz.views import NewsQuizViewSet

router = routers.SimpleRouter()

router.register(r'usercheck/title', UserCheckViewSet, basename='game')
router.register(r'live', LiveNewsPrediction, basename='live')
router.register(r'quiz', NewsQuizViewSet, basename='quiz')
router.register(r'category/(?P<category>[^/.]+)', LiveNewsByCategory, basename='livenews-by-category')
router.register(r'feedback', NewsFeedbackViewSet, basename='feedback')

urlpatterns = [
    *router.urls,
]