import React, { useState, useEffect, useContext } from 'react';
import './HomePage.css';
import Toolbar from './Toolbar';
import Config from '../Config'; // Import your configuration for the baseURL
import AuthContext from './AuthContext'; // Adjust the import based on your context structure

function HomePage() {
  const { authTokens } = useContext(AuthContext); // Destructure context data
  const [blockchain, setBlockchain] = useState([]);
  const [loadingBlockchain, setLoadingBlockchain] = useState(true);

  useEffect(() => {
    // Fetch the blockchain data when the component mounts
    const fetchBlockchain = async () => {
      try {
        const response = await fetch(`${Config.baseURL}/api/chain/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${authTokens}`, // Use the auth token for authorization
          },
        });

        if (response.ok) {
          const data = await response.json();
          setBlockchain(data);
        } else {
          console.error('Failed to fetch blockchain:', response.status);
        }
      } catch (error) {
        console.error('Error fetching blockchain:', error);
      } finally {
        setLoadingBlockchain(false);
      }
    };

    fetchBlockchain();
  }, [authTokens]);

  return (
    <div className="home-container">
      <Toolbar />
      <div className="home-content">
        <h1>Blockchain Data</h1>
        {loadingBlockchain ? (
          <p>Loading blockchain data...</p>
        ) : (
          <div className="blockchain-tiles">
            {blockchain.map((block) => (
              <div key={block.block_number} className="block-tile">
                <h2>Block #{block.block_number}</h2>
                <p><strong>Timestamp:</strong> {new Date(block.timestamp).toLocaleString()}</p>
                <p><strong>Hash:</strong> {block.current_hash}</p>
                <p><strong>Previous Hash:</strong> {block.previous_hash === '1' ? 'null' : block.previous_hash}</p>
                <h3>Transactions:</h3>
                <ul>
                  {block.transactions.map((tx, txIndex) => (
                    <li key={txIndex}>
                      From: {tx.sender} To: {tx.recipient} Amount: {tx.amount}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
