import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SignInPage from './components/SignInPage';
import HomePage from './components/HomePage';
import AdminPage from './components/AdminPage';
import QuestionPage from './components/QuestionPage';
import ProfilePage from './components/ProfilePage';
import CommentSection from './components/CommentSection';
import { AuthProvider } from './components/AuthContext';
import AuthContext from './components/AuthContext';

// ProtectedRoute component to restrict access based on role
const ProtectedRoute = ({ children, role }) => {
  const { admin, authTokens, loading } = useContext(AuthContext);

  if (loading) return null; // Or a loading spinner/component

  // If not authenticated, redirect to login page
  if (!authTokens) {
    return <Navigate to="/login" />;
  }


  // If a specific role is required and doesn't match, redirect to login page
  
  if (role === 'admin' && !admin) {
    return <Navigate to="/login" />;
  }



  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<SignInPage />} />

          {/* Protected routes */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
