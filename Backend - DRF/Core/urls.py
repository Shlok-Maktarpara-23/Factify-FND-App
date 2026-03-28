from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/user/', include('API.urls')),
    path('api/news/', include(('News.routers', 'News'), namespace="news-api")),  
]
