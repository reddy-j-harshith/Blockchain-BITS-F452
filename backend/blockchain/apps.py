from django.apps import AppConfig
from .models import Block, Transaction

class BlockchainConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'blockchain'

    def ready(self):
        from . import blockchain

        # Fetch all blocks and add them to the blockchain instance
        for block in Block.objects.all().order_by('index'):
            transactions = Transaction.objects.filter(block=block)
            txn_list = [
                {'sender': txn.sender.public_key, 'recipient': txn.recipient.public_key, 'amount': txn.amount}
                for txn in transactions
            ]
            blockchain.chain.append({
                'index': block.index,
                'timestamp': block.timestamp,
                'transactions': txn_list,
                'proof': block.proof,
                'previous_hash': block.previous_hash,
                'current_hash': block.current_hash,
            })
