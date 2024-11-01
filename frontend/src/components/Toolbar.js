import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../components/AuthContext';
import './Toolbar.css';

function Toolbar() {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login'); // Navigate to login after logout
  };

  return (
    <div className="topnav">
      <Link to={user ? "/home" : "/login"} className="toolbar-link">Home</Link>
      <Link to="/profile" className="toolbar-link">Profile</Link>
      <Link to="/transfer" className="toolbar-link">Transfer</Link>

      <div className="topnav-right">
        {user ? (
          <button onClick={handleLogout} className="logout-button">Logout</button>
        ) : (
          <>
            <Link to="/login" className="toolbar-link">Login</Link>
            <Link to="/register" className="toolbar-link">Register</Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Toolbar;
