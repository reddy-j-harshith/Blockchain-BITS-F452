import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignInPage.css';
import Config from '../Config';

function SignInPage() {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
  });
  const [error, setError] = useState("");
  const [keyData, setKeyData] = useState(null); // Store public and private keys
  const [showModal, setShowModal] = useState(false); // Control modal visibility
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${Config.baseURL}/api/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setKeyData(data); // Store the keys
        setShowModal(true); // Show the modal with keys
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Registration failed. Please check your input.');
      }
    } catch (error) {
      setError('An error occurred during registration.');
    }
  };

  const downloadKey = (key, filename) => {
    const blob = new Blob([key], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  return (
    <div className="login-container">
      <div className="left-section">
        <div className="login-box">
          <h1 className="login-heading">Sign In</h1>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="email" className="input-label">Email</label>
              <input
                type="email"
                id="email"
                className="input-field"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="username" className="input-label">Username</label>
              <input
                type="text"
                id="username"
                className="input-field"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="password" className="input-label">Password</label>
              <input
                type="password"
                id="password"
                className="input-field"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="login-btn">Register</button>
          </form>
          <div className="register-box">
            <p className="no-account-text">Already have an account?</p>
            <a href="/login" className="create-account-link">Login here</a>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Your Keys Are Ready</h2>
            <p>Download and securely store your public and private keys.</p>
            <button
              onClick={() => downloadKey(keyData.public_key, 'public_key.pem')}
              className="download-btn"
            >
              Download Public Key
            </button>
            <button
              onClick={() => downloadKey(keyData.private_key, 'private_key.pem')}
              className="download-btn"
            >
              Download Private Key
            </button>
            <button
              onClick={() => {
                setShowModal(false);
                navigate('/login');
              }}
              className="close-btn"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SignInPage;
