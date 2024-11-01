from rest_framework import serializers
from .models import Block, Transaction

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['id', 'sender', 'recipient_public_key', 'amount', 'timestamp', 'signature']


class BlockSerializer(serializers.ModelSerializer):
    transactions = TransactionSerializer(many=True)

    class Meta:
        model = Block
        fields = ['index', 'timestamp', 'transactions', 'previous_hash', 'current_hash', 'proof']
