from django.contrib.auth.models import AbstractUser
from django.db import models
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import serialization, hashes
from django.contrib.auth import get_user_model
import hashlib

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

class Transaction(models.Model):
    sender = models.TextField()  # Public key of the sender
    recipient_public_key = models.TextField()  # Recipient's public key
    amount = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)
    signature = models.TextField(blank=True, null=True)  # Field to store the signature

    def sign_transaction(self, private_key):
        """
        Signs the transaction using the sender's private key.
        """
        transaction_data = f"{self.sender}|{self.recipient_public_key}|{self.amount}".encode()
        self.signature = private_key.sign(
            transaction_data,
            padding.PSS(
                mgf=padding.MGF1(hashes.SHA256()),
                salt_length=padding.PSS.MAX_LENGTH
            ),
            hashes.SHA256()
        ).hex()  # Convert the signature to a hex string

    def is_valid(self, public_key):
        """
        Verifies the signature of the transaction.
        """
        transaction_data = f"{self.sender}|{self.recipient_public_key}|{self.amount}".encode()
        try:
            public_key.verify(
                bytes.fromhex(self.signature),  # Convert hex string back to bytes
                transaction_data,
                padding.PSS(
                    mgf=padding.MGF1(hashes.SHA256()),
                    salt_length=padding.PSS.MAX_LENGTH
                ),
                hashes.SHA256()
            )
            return True
        except Exception:
            return False


class Block(models.Model):
    index = models.IntegerField()
    proof = models.IntegerField() # Nonce
    previous_hash = models.CharField(max_length=64)
    current_hash = models.CharField(max_length=64, blank=True, null=True)
    transactions = models.ManyToManyField('Transaction', blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def hash_block(self):

        block_string = f'{self.index}{self.proof}{self.previous_hash}{self.timestamp}'
        return hashlib.sha256(block_string.encode()).hexdigest()
    