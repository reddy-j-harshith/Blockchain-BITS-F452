from django.contrib.auth.models import AbstractUser
from django.db import models
from django.contrib.auth import get_user_model
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import serialization

class CustomUser(AbstractUser):
    public_key = models.TextField(blank=True, null=True)
    currency = models.FloatField(default=1000.00)

    def generate_keys(self):

        private_key = rsa.generate_private_key(
            public_exponent=65537,
            key_size=2048,
            backend=default_backend()
        )
        public_key = private_key.public_key()

        self.public_key = public_key.public_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PublicFormat.SubjectPublicKeyInfo
        ).decode('utf-8')

        return private_key.private_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PrivateFormat.TraditionalOpenSSL,
            encryption_algorithm=serialization.NoEncryption()
        ).decode('utf-8')
    
User = get_user_model()

class Block(models.Model):
    index = models.IntegerField()
    timestamp = models.FloatField()
    proof = models.IntegerField()
    previous_hash = models.TextField()
    current_hash = models.TextField()

class Transaction(models.Model):
    sender = models.ForeignKey(User, related_name='sent_transactions', on_delete=models.CASCADE)
    recipient = models.ForeignKey(User, related_name='received_transactions', on_delete=models.CASCADE)
    amount = models.FloatField()
    block = models.ForeignKey(Block, related_name='transactions', null=True, blank=True, on_delete=models.SET_NULL)