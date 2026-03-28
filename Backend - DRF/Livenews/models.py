from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class LiveNews(models.Model):
    title = models.CharField(max_length=2000)
    publication_date = models.DateTimeField()
    news_category = models.CharField(max_length=200)
    prediction = models.BooleanField(default=True)
    section_id = models.CharField(max_length=200)
    section_name = models.CharField(max_length=200)
    type = models.CharField(max_length=200)
    web_url = models.CharField(max_length=600)
    img_url = models.CharField(max_length=600)

    def __str__(self):
        return self.title

class NewsFeedback(models.Model):
    FEEDBACK_CHOICES = [
        ('correct', 'Correct Prediction'),
        ('incorrect', 'Incorrect Prediction'),
        ('unsure', 'Not Sure'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='news_feedbacks')
    news = models.ForeignKey(LiveNews, on_delete=models.CASCADE, related_name='feedbacks')
    feedback_type = models.CharField(max_length=20, choices=FEEDBACK_CHOICES)
    user_comment = models.TextField(blank=True, null=True, help_text="Optional comment from user")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['user', 'news']  # One feedback per user per news
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.email} - {self.news.title[:50]} - {self.feedback_type}"
