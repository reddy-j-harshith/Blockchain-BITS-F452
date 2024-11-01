from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.http import JsonResponse
from .models import *
from .blockchain import Blockchain
from .serializers import BlockSerializer

User = get_user_model()
blockchain = Blockchain()

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['is_staff'] = user.is_staff
        token['public_key'] = user.public_key
        token['email'] = user.email
        token['currency'] = user.currency
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
    
    private_key_pem = user.generate_keys()
    user.save()

    return JsonResponse({
        "Message": "User created successfully",
        "public_key": user.public_key,
        "private_key": private_key_pem  # WARNING: This should be handled securely
    }, status=201)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_transaction(request):
    sender = request.user
    recipient_public_key = request.data.get("recipient_public_key")
    amount = request.data.get("amount")

    try:
        recipient = CustomUser.objects.get(public_key=recipient_public_key)
    except CustomUser.DoesNotExist:
        return JsonResponse({"error": "Recipient not found"}, status=404)

    blockchain.new_transaction(sender=sender.public_key, recipient=recipient.public_key, amount=amount)

    Transaction.objects.create(sender=sender, recipient=recipient, amount=amount)
    return JsonResponse({"message": "Transaction added successfully"}, status=201)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mine_block(request):
    mined_block = blockchain.mine_block()

    block = Block.objects.create(
        index=mined_block['index'],
        timestamp=mined_block['timestamp'],
        proof=mined_block['proof'],
        previous_hash=mined_block['previous_hash'],
        current_hash=mined_block['current_hash']
    )

    for txn in mined_block['transactions']:
        sender = CustomUser.objects.get(public_key=txn['sender'])
        recipient = CustomUser.objects.get(public_key=txn['recipient'])
        Transaction.objects.create(sender=sender, recipient=recipient, amount=txn['amount'])

    return JsonResponse({"message": "New block mined!", "block": mined_block}, status=201)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def validate_chain(request):
    is_valid = blockchain.valid_chain()
    message = "Blockchain is valid." if is_valid else "Blockchain is invalid!"
    return JsonResponse({"message": message}, status=200)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def display_chain(request):
    blocks = Block.objects.all()
    serializer = BlockSerializer(blocks, many=True)
    return JsonResponse(serializer.data, status=200)