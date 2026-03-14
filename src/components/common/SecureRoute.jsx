import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useGoogleAuth } from '../../contexts/GoogleAuthContext';
import LoadingSpinner from './LoadingSpinner';
import PropTypes from 'prop-types';

/**
 * SecureRoute Component
 * Protects routes based on authentication status
 * - Admin routes: Require admin authentication
 * - Profile routes: Require Google authentication
 * - Public routes: Always accessible
 */
const SecureRoute = ({ children, requireAdmin = false, requireGoogleAuth = false }) => {
  const { isAuthenticated: isAdminAuthenticated, loading: adminLoading } = useAuth();
  const { isAuthenticated: isGoogleAuthenticated, loading: googleLoading } = useGoogleAuth();
  const location = useLocation();

  // Determine route type
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isProfileRoute = location.pathname === '/profile';

  // Show loading spinner while checking authentication
  if (adminLoading || googleLoading) {
    return <LoadingSpinner message="Checking authentication..." />;
  }

  // Admin route protection
  if (isAdminRoute || requireAdmin) {
    if (!isAdminAuthenticated) {
      // Redirect to admin login, saving the attempted location
      return (
        <Navigate 
          to="/admin/login" 
          state={{ 
            from: location.pathname,
            message: 'Please login to access the admin area'
          }} 
          replace 
        />
      );
    }
    return children;
  }

  // Profile route protection (Google Auth)
  if (isProfileRoute || requireGoogleAuth) {
    if (!isGoogleAuthenticated) {
      // Redirect to home with message
      return (
        <Navigate 
          to="/" 
          state={{ 
            message: 'Please login with Google to view your profile'
          }} 
          replace 
        />
      );
    }
    return children;
  }

  // Public routes - always accessible
  return children;
};

// PropTypes for better documentation
SecureRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requireAdmin: PropTypes.bool,
  requireGoogleAuth: PropTypes.bool
};

// Default props
SecureRoute.defaultProps = {
  requireAdmin: false,
  requireGoogleAuth: false
};

export default SecureRoute;