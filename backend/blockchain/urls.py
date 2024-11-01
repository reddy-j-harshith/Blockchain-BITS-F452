from django.urls import path
from .views import MyTokenObtainPairView, register_user
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    # Auth
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # User
    path('register/', register_user, name='register_user'),
]
