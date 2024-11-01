from django.urls import path
from .views import *
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    # Auth
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # User
    path('register/', register_user, name='register_user'),

    # Blockchain endpoints
    path('transaction/', add_transaction, name='add_transaction'),
    path('mine/', mine_block, name='mine_block'),
    path('validate/', validate_chain, name='validate_chain'),
    path('chain/', display_chain, name='display_chain'),
]
