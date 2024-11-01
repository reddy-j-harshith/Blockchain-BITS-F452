from rest_framework import serializers
from .models import CustomUser, Transaction, Block

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'public_key', 'currency']

class TransactionSerializer(serializers.ModelSerializer):
    sender = UserSerializer()
    recipient = UserSerializer()

    class Meta:
        model = Transaction
        fields = ['sender', 'recipient', 'amount', 'timestamp']

class BlockSerializer(serializers.ModelSerializer):
    transactions = TransactionSerializer(many=True)

    class Meta:
        model = Block
        fields = ['index', 'timestamp', 'proof', 'previous_hash', 'current_hash', 'transactions']
