from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.http import JsonResponse
from .models import CustomUser

User = get_user_model()

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['is_staff'] = user.is_staff
        token['public_key'] = user.public_key
        token['email'] = user.email
        token['currency'] = float(user.currency)
        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    username = request.data.get("username")
    password = request.data.get("password")
    email = request.data.get("email")

    user = CustomUser.objects.filter(username=username)

    if user.exists():
        return JsonResponse({"Message": "User name already exists"}, status=409)

    user = CustomUser.objects.create_user(username=username, password=password, email=email)
    
    # Generate keys and store public key
    private_key_pem = user.generate_keys()
    user.save()

    # Return the public key and private key (the user should securely store the private key)
    return JsonResponse({
        "Message": "User created successfully",
        "public_key": user.public_key,
        "private_key": private_key_pem  # WARNING: This should be handled securely
    }, status=201)
