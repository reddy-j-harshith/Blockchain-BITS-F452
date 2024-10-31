import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../components/AuthContext';
import './Toolbar.css';

function Toolbar() {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
  };

  return (
    <nav className="toolbar">
      <ul className="toolbar-menu">
        <li>
          <Link to={user ? "/home" : "/login"} className="toolbar-link">Home</Link>
        </li>
        <li>
          <Link to="/profile" className="toolbar-link">Profile</Link>
        </li>
        {user ? (
          <li>
            <button onClick={handleLogout} className="toolbar-link">Logout</button>
          </li>
        ) : (
          <></>
        )}
      </ul>
    </nav>
  );
}

export default Toolbar;
