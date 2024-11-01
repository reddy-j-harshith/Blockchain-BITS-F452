import React, { useContext } from 'react';
import './ProfilePage.css';
import Toolbar from './Toolbar';
import AuthContext from './AuthContext';

function ProfilePage() {
  const { user, publicKey, currency } = useContext(AuthContext);

  const userDetails = {
    username: user?.username || '',
    email: user?.email || '',
    publicKey: publicKey,
    currency: currency
  };

  return (
    <div className="profile-page-wrapper">
      <Toolbar />
      <div className="profile-page-container">
        <div className="profile-header">
          <h1>Profile Page</h1>
        </div>
        <div className="profile-details">
          <div className="profile-item">
            <label>Username:</label>
            <div className="profile-text">{userDetails.username}</div>
          </div>
          <div className="profile-item">
            <label>Email:</label>
            <div className="profile-text">{userDetails.email}</div>
          </div>
          <div className="profile-item">
            <label>Public Key:</label>
            <div className="profile-text profile-key">{userDetails.publicKey}</div>
          </div>
          <div className="profile-item">
            <label>Currency:</label>
            <div className="profile-text profile-key">$ {userDetails.currency}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
