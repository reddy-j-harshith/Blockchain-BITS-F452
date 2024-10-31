import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from './AuthContext';
import './LoginPage.css';  


function LoginPage() {
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRegisterButtonClick = (e) => {
    e.preventDefault();
    navigate("/register");
  };

  return (
    <div className="login-form-container">
      <div className="row">
        <h2 style={{ textAlign: "center", color: 'white' }}>Login</h2>
        <div className="col">
          <form onSubmit={loginUser}>
            <input type="text" name="username" placeholder="Username" required />
            <input type="password" name="password" placeholder="Password" required />
            <input type="submit" value="Login" className="button" />
          </form>
          <div className="divider">
            <span className="divider-text">New User?</span>
          </div>
          <button onClick={handleRegisterButtonClick} className="button">Register</button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
