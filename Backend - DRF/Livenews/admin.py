from django.contrib import admin
from .models import LiveNews, NewsFeedback

@admin.register(LiveNews)
class LiveNewsAdmin(admin.ModelAdmin):
    list_display = ('title', 'news_category', 'prediction', 'publication_date', 'section_name')
    list_filter = ('prediction', 'news_category', 'section_name', 'publication_date')
    search_fields = ('title', 'news_category', 'section_name')
    readonly_fields = ('publication_date',)
    ordering = ('-publication_date',)

@admin.register(NewsFeedback)
class NewsFeedbackAdmin(admin.ModelAdmin):
    list_display = ('user', 'news_title', 'feedback_type', 'created_at')
    list_filter = ('feedback_type', 'created_at')
    search_fields = ('user__email', 'news__title', 'user_comment')
    readonly_fields = ('created_at', 'updated_at')
    ordering = ('-created_at',)
    
    def news_title(self, obj):
        return obj.news.title[:100] + "..." if len(obj.news.title) > 100 else obj.news.title
    news_title.short_description = 'News Title'