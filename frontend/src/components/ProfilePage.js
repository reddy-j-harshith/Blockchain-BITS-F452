import React, { useState, useContext } from 'react';
import './ProfilePage.css';
import Toolbar from './Toolbar';
import AuthContext from './AuthContext';

function ProfilePage() {
  const { user, publicKey } = useContext(AuthContext);

  const [userDetails, setUserDetails] = useState({
    username: user?.username || '',
    email: user?.email || '',
    PublicKey: publicKey,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({
      ...userDetails,
      [name]: value,
    });
  };

  return (
    <div className="profile-page-container">
      <Toolbar />
      <h1>Profile Page</h1>
      <form className="profile-form">
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={userDetails.username}
            onChange={handleChange}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={userDetails.email}
            onChange={handleChange}
          />
        </label>
        <label>
          Public Key:
          <input
            name="password"
            value={userDetails.PublicKey}
            onChange={handleChange}
          />
        </label>
      </form>
    </div>
  );
}

export default ProfilePage;
