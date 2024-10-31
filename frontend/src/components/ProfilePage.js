import React, { useState, useContext } from 'react';
import './ProfilePage.css';
import Toolbar from './Toolbar';
import AuthContext from './AuthContext';

function ProfilePage() {
  const { user, updateUserProfile } = useContext(AuthContext);

  const [userDetails, setUserDetails] = useState({
    username: user?.username || '',
    email: user?.email || '',
    password: '', // Password will not be pre-filled for security reasons
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({
      ...userDetails,
      [name]: value,
    });
  };

  const handleSave = async () => {
    try {
      await updateUserProfile(userDetails);
      alert('Profile updated!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
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
          Password:
          <input
            type="password"
            name="password"
            value={userDetails.password}
            onChange={handleChange}
          />
        </label>
        <button type="button" onClick={handleSave}>Save Changes</button>
      </form>
    </div>
  );
}

export default ProfilePage;
