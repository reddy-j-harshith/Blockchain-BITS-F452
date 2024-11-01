import React, { useState, useEffect, useContext } from 'react';
import './BlockchainPage.css';
import Toolbar from './Toolbar';
import Config from '../Config';
import AuthContext from './AuthContext';

function BlockchainPage() {
  const { authTokens } = useContext(AuthContext);
  const [blockchain, setBlockchain] = useState([]);
  const [loadingBlockchain, setLoadingBlockchain] = useState(true);

  useEffect(() => {
    const fetchBlockchain = async () => {
      try {
        const response = await fetch(`${Config.baseURL}/api/chain/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authTokens.access}`,
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
    <div className="blockchain-container">
      <Toolbar />
      <div className="blockchain-content">
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BlockchainPage;
