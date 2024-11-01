import hashlib
import json
from time import time

class Blockchain:
    def __init__(self):
        self.current_transactions = []
        self.chain = []

        # Create the genesis block
        self.new_block(proof=self.proof_of_work({'index': 0, 'previous_hash': '1'}), previous_hash='1')

    def new_block(self, proof, previous_hash=None):
        """
        Create a new Block in the Blockchain
        :param proof: The proof given by the Proof of Work algorithm (nonce)
        :param previous_hash: Hash of previous Block
        :return: New Block
        """
        block = {
            'index': len(self.chain) + 1,
            'timestamp': time(),
            'transactions': self.current_transactions,
            'previous_hash': previous_hash or self.hash(self.chain[-1]),  # Hash of the previous block
            'current_hash': None,  # Placeholder for the current hash
            'proof': proof  # This is the nonce
        }

        # Calculate and store the current block's hash
        block['current_hash'] = self.hash(block)

        # Reset the current list of transactions
        self.current_transactions = []

        # Add the new block to the chain
        self.chain.append(block)
        return block

    def new_transaction(self, sender, recipient, amount):
        """
        Creates a new transaction to go into the next mined Block
        :param sender: Address of the Sender
        :param recipient: Address of the Recipient
        :param amount: Amount
        :return: The index of the Block that will hold this transaction
        """
        self.current_transactions.append({
            'sender': sender,
            'recipient': recipient,
            'amount': amount,
        })

        print(f"Transaction added: {sender} -> {recipient} : {amount}")
        return self.last_block['index'] + 1

    @property
    def last_block(self):
        """
        Returns the last block in the chain
        """
        return self.chain[-1]

    @staticmethod
    def hash(block):
        """
        Creates a SHA-256 hash of a Block
        :param block: Block
        :return: <str> Hash of the block
        """
        block_string = json.dumps(block, sort_keys=True).encode()
        return hashlib.sha256(block_string).hexdigest()

    def proof_of_work(self, last_block):
        """
        Proof of Work Algorithm:
        - Find a number p' (nonce) such that hash(last_block + p') contains leading 2 zeros
        - p is the previous proof, and p' is the new proof
        """
        last_hash = self.hash(last_block)
        proof = 0

        while not self.valid_proof(last_hash, proof):
            proof += 1

        return proof

    @staticmethod
    def valid_proof(last_hash, proof):
        """
        Validates the Proof by checking if hash(last_hash + proof) starts with '00'.
        :param last_hash: <str> The hash of the last block
        :param proof: <int> The current proof
        :return: <bool> True if correct, False if not.
        """
        guess = f'{last_hash}{proof}'.encode()
        guess_hash = hashlib.sha256(guess).hexdigest()
        return guess_hash[:2] == "00"

    def valid_chain(self):
        """
        Determine if the current blockchain is valid by checking:
        1. The previous_hash of each block matches the hash of the previous block.
        2. The proof of work for each block is valid.
        :return: True if the chain is valid, False otherwise
        """
        last_block = self.chain[0]  # Genesis block
        current_index = 1

        while current_index < len(self.chain):
            block = self.chain[current_index]

            # Check if the 'previous_hash' matches the hash of the last block
            if block['previous_hash'] != self.hash(last_block):
                print(f"Invalid block at index {current_index}: Previous hash does not match.")
                return False

            # Check if the proof of work is valid for this block
            if not self.valid_proof(self.hash(last_block), block['proof']):
                print(f"Invalid proof of work at block {current_index}.")
                return False

            # Move to the next block
            last_block = block
            current_index += 1

        return True

    def mine_block(self):
        """
        Mines a new block by finding a valid proof of work for the last block and creating a new block.
        """
        last_block = self.last_block
        proof = self.proof_of_work(last_block)
        block = self.new_block(proof)

        print(f"New block mined! Block index: {block['index']}")
        return block

    def simulate_race_attack(self, sender, recipient1, recipient2, amount):
        """
        Simulates a Race Attack by creating two conflicting transactions from the same sender to two different recipients.
        """
        print(f"Simulating Race Attack: Creating two conflicting transactions from {sender} to {recipient1} and {recipient2} with the same amount {amount}.")
        
        # Transaction 1: Sender -> Recipient1
        self.new_transaction(sender, recipient1, amount)
        block1 = self.new_block(self.proof_of_work(self.last_block))
        
        # Transaction 2: Sender -> Recipient2
        self.new_transaction(sender, recipient2, amount)
        block2 = self.new_block(self.proof_of_work(self.last_block))
        
        # Simulate network accepting only one of the blocks (race resolution)
        if block1['proof'] < block2['proof']:  # Simulating which block gets accepted
            self.chain.append(block1)
            print(f"Race Attack Outcome: Block with transaction {sender} -> {recipient1} accepted.")
        else:
            self.chain.append(block2)
            print(f"Race Attack Outcome: Block with transaction {sender} -> {recipient2} accepted.")
        
        print("Race attack simulated. Only one transaction remains valid in the chain.")

    def simulate_finney_attack(self, sender, recipient, amount):
        """
        Simulates a Finney Attack by pre-mining a block with a transaction, and then attempting to double spend.
        """
        print(f"Simulating Finney Attack: Pre-mining a block with transaction {sender} -> {recipient} : {amount}.")
        
        # Step 1: Pre-mine a block with the intended transaction
        self.new_transaction(sender, recipient, amount)
        pre_mined_block = self.new_block(self.proof_of_work(self.last_block))
        
        # Step 2: Victim believes they received the amount, but this transaction isn't on the blockchain yet
        print(f"Finney Attack: Pre-mined block with transaction {sender} -> {recipient} is created but not broadcasted.")
        
        # Step 3: Attacker spends the same amount elsewhere, convincing the victim the funds were sent
        victim_transaction_amount = amount
        self.new_transaction(sender, recipient, victim_transaction_amount)
        print(f"Victim believes the transaction is valid: {sender} -> {recipient} : {victim_transaction_amount}")
        
        # Step 4: Broadcast the pre-mined block, invalidating the victim's transaction
        self.chain[-1] = pre_mined_block
        print("Finney attack succeeded: The victim's transaction is invalidated as the pre-mined block is broadcasted.")