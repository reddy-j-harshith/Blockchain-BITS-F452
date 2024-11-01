from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.http import JsonResponse
from .models import *
from .serializers import *
from hashlib import sha256
from cryptography.hazmat.primitives import serialization

User = get_user_model()

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

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        
        self.initialize_genesis_block(request.user)
        
        return response

    def initialize_genesis_block(self, user):
        request = self.request
        view = initialize_genesis_block
        response = view(request)
        return response

def initialize_genesis_block(request):
    # Check if the genesis block already exists
    if Block.objects.count() == 0:
        # Create the genesis block without transactions
        genesis_block = Block.objects.create(
            id=1,  # This is typically set to 1
            index=1,
            proof=1,  # This is typically a predefined proof for the genesis block
            previous_hash='1'  # Typically set to '1' or '0'
        )
        
        # Now that the genesis block is saved, it has an ID
        # Optionally compute its hash if you need to update it explicitly (depends on how you want to manage it)
        genesis_block.save()  # This will set the current_hash correctly

        return JsonResponse({"message": "Genesis block created successfully."}, status=201)
    
    return JsonResponse({"message": "Genesis block already exists."}, status=200)


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

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_transaction(request):
    sender_public_key = request.user.public_key
    recipient_public_key = request.data.get("recipient_public_key")
    amount = request.data.get("amount")
    private_key_pem = request.data.get("private_key")  # Get the private key from request

    if not recipient_public_key or not amount or not private_key_pem:
        return JsonResponse({"error": "Recipient public key, amount, and private key are required"}, status=400)

    # Load the private key for signing
    private_key = serialization.load_pem_private_key(
        private_key_pem.encode(),
        password=None,
    )

    # Create transaction
    transaction = Transaction(sender=sender_public_key, recipient_public_key=recipient_public_key, amount=amount)
    transaction.sign_transaction(private_key)  # Sign the transaction
    transaction.save()  # Save the transaction

    return JsonResponse(TransactionSerializer(transaction).data, status=201)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mine_block(request):
    last_block = Block.objects.last()
    last_proof = last_block.proof if last_block else 0
    index = last_block.index + 1 if last_block else 1
    previous_hash = last_block.current_hash if last_block else '1'

    proof = 0
    while sha256(f'{last_proof}{proof}'.encode()).hexdigest()[:2] != "00":
        proof += 1

    block = Block.objects.create(
        index=index,
        proof=proof,
        previous_hash=previous_hash,
    )

    # Add pending transactions to the block
    pending_transactions = Transaction.objects.filter(block__isnull=True)
    block.transactions.set(pending_transactions)
    block.current_hash = block.hash_block()
    block.save()

    return JsonResponse(BlockSerializer(block).data, status=201)

@api_view(['GET'])
@permission_classes([AllowAny])
def display_chain(request):
    chain = Block.objects.all()
    serializer = BlockSerializer(chain, many=True)
    return JsonResponse(serializer.data, safe=False)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def validate_chain(request):
    blocks = Block.objects.all().order_by('index')
    is_valid = True
    previous_block = None

    for block in blocks:
        if previous_block and block.previous_hash != previous_block.current_hash:
            is_valid = False
            break
        if sha256(f'{previous_block.proof}{block.proof}'.encode()).hexdigest()[:2] != "00":
            is_valid = False
            break
        previous_block = block

    return JsonResponse({"is_valid": is_valid})

