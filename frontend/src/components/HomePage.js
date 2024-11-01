import React, { useState, useEffect, useContext } from 'react';
import './HomePage.css';
import Toolbar from './Toolbar';
import Config from '../Config';
import AuthContext from './AuthContext';

function HomePage() {
  const { authTokens } = useContext(AuthContext);
  const [latestBlock, setLatestBlock] = useState(null);
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestBlock = async () => {
      try {
        const response = await fetch(`${Config.baseURL}/api/latest-block/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authTokens.access}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setLatestBlock(data);
        } else {
          console.error('Failed to fetch latest block:', response.status);
        }
      } catch (error) {
        console.error('Error fetching latest block:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchPendingTransactions = async () => {
      try {
        const response = await fetch(`${Config.baseURL}/api/pending-transactions/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authTokens.access}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setPendingTransactions(data);
        } else {
          console.error('Failed to fetch pending transactions:', response.status);
        }
      } catch (error) {
        console.error('Error fetching pending transactions:', error);
      }
    };

    fetchLatestBlock();
    fetchPendingTransactions();
  }, [authTokens]);

  return (
    <div className="home-container">
      <Toolbar />
      <div className="home-content">
        <h1>Blockchain Overview</h1>
        {loading ? (
          <p>Loading data...</p>
        ) : (
          <>
            <div className="latest-block">
              <h2>Latest Block</h2>
              {latestBlock ? (
                <div className="block-tile">
                  <h2>Block No. {latestBlock.index}</h2>
                  <p><strong>Timestamp:</strong> {new Date(latestBlock.timestamp).toLocaleString()}</p>
                  <p><strong>Hash:</strong> {latestBlock.current_hash}</p>
                  <p><strong>Previous Hash:</strong> {latestBlock.previous_hash === '1' ? 'null' : latestBlock.previous_hash}</p>
                </div>
              ) : (
                <p>No latest block data available.</p>
              )}
            </div>
            <div className="pending-transactions">
              <h2>Pending Transactions</h2>
              {pendingTransactions.length > 0 ? (
                <ul>
                  {pendingTransactions.map((tx, txIndex) => (
                    <li key={txIndex}>
                      From: {tx.sender} To: {tx.recipient} Amount: {tx.amount}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No pending transactions.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default HomePage;
