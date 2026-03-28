from django.urls import path, include
from User import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


urlpatterns = [
    path('register/', views.UserRegistrationAPIView.as_view(), name='register-user'),
    path('login/', views.UserLoginAPIView.as_view(), name='login-user'),
    path('logout/', views.UserLogoutAPIView.as_view(), name='logout-user'),
    path('info/', views.UserInfoAPIView.as_view(), name='user-info'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('protected-view/', views.ProtectedView.as_view()),
]
