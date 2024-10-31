import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignInPage.css';
import Config from '../Config'; // Import your configuration if needed

function SignInPage() {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
  });

  const [error, setError] = useState(""); // Error state for error messages
  const navigate = useNavigate(); // For navigation after successful registration

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

      if (response.ok) { // Check for successful response
        alert('Registration successful');
        navigate('/login');
      } else {
        const errorData = await response.json(); // Get error details if available
        setError(errorData.message || 'Registration failed. Please check your input.');
      }
    } catch (error) {
      setError('An error occurred during registration.');
    }
  };

  return (
    <div className="login-container">
      <div className="left-section">
        <div className="login-box">
          <h1 className="login-heading">Sign In</h1>
          {error && <p className="error-message">{error}</p>} {/* Display error message if exists */}
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
      
    </div>
  );
}

export default SignInPage;
