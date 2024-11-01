import React, { useState, useContext } from 'react';
import AuthContext from './AuthContext';
import Toolbar from './Toolbar';
import Config from '../Config';
import './TransferPage.css';

const baseURL = Config.baseURL;

const TransferPage = () => {
  const { authTokens, user } = useContext(AuthContext);
  const [recipientPublicKey, setRecipientPublicKey] = useState('');
  const [amount, setAmount] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [message, setMessage] = useState('');

  const handleTransfer = async (e) => {
    e.preventDefault();

    const response = await fetch(`${baseURL}/api/transaction/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authTokens.access}`,
      },
      body: JSON.stringify({
        recipient_public_key: recipientPublicKey,
        amount: parseFloat(amount),
        private_key: privateKey,
      }),
    });

    const data = await response.json();

    if (response.status === 201) {
      setMessage('Transaction successful');
    } else {
      setMessage(data.error || 'Transaction failed');
    }
  };

  return (
    <div>
        <Toolbar />
        <div className="transfer-container">
        <h1>Transfer Amount</h1>
        <form className="transfer-form" onSubmit={handleTransfer}>
            <div>
            <label>Recipient Public Key:</label>
            <input
                type="text"
                value={recipientPublicKey}
                onChange={(e) => setRecipientPublicKey(e.target.value)}
                required
            />
            </div>
            <div>
            <label>Amount:</label>
            <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
            />
            </div>
            <div>
            <label>Your Private Key:</label>
            <textarea
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
                required
            />
            </div>
            <button type="submit">Transfer</button>
        </form>
        {message && <p className={message.includes('successful') ? 'transfer-message' : 'transfer-error'}>{message}</p>}
        </div>
    </div>
  );
};

export default TransferPage;
