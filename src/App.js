import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './contexts/AuthContext';
import { GoogleAuthProvider } from './contexts/GoogleAuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import SecurityHeaders from './components/common/SecurityHeaders';
import SecurityMonitor from './components/common/SecurityMonitor';
import SecureRoute from './components/common/SecureRoute';
import ErrorBoundary from './components/common/ErrorBoundary';
import LoadingSpinner from './components/common/LoadingSpinner';
import UserLayout from './components/user/UserLayout';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminLogin from './components/admin/AdminLogin';
import AdminResources from './components/admin/AdminResources';
import AdminJobs from './components/admin/AdminJobs';
import AdminRoadmaps from './components/admin/AdminRoadmaps';
import AdminSessions from './components/admin/AdminSessions';
import AdminDownloads from './components/admin/AdminDownloads';
import AdminRecentLinks from './components/admin/AdminRecentLinks';
import AdminCommunity from './components/admin/AdminCommunity';
import AdminSettings from './components/admin/AdminSettings';
import AdminUserTracking from './components/admin/AdminUserTracking';
import AdminAnalytics from './components/admin/AdminAnalytics';
import UserProfilePage from './pages/UserProfilePage';
import './styles/global.css';
import './styles/admin.css';

// Replace with your actual Google Client ID from Google Cloud Console
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || '1006758046369-74a0ggf840n8tacc33pjcskefmdpqa19.apps.googleusercontent.com';

function App() {
  return (
    <ErrorBoundary>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <GoogleAuthProvider>
          <AuthProvider>
            <ThemeProvider>
              <SecurityHeaders />
              <SecurityMonitor>
                <Routes>
                  {/* ===== PUBLIC USER ROUTES ===== */}
                  {/* No authentication required - accessible to everyone */}
                  <Route path="/" element={<UserLayout />} />
                  <Route path="/home" element={<Navigate to="/" replace />} />
                  
                  {/* ===== PROFILE ROUTE ===== */}
                  {/* Protected by Google Authentication - handled by UserProfilePage internally */}
                  <Route path="/profile" element={<UserProfilePage />} />
                  
                  {/* ===== ADMIN AUTH ROUTES ===== */}
                  {/* Admin login - public route */}
                  <Route path="/admin/login" element={<AdminLogin />} />
                  
                  {/* ===== PROTECTED ADMIN ROUTES ===== */}
                  {/* All routes under /admin are protected by SecureRoute */}
                  <Route
                    path="/admin"
                    element={
                      <SecureRoute>
                        <AdminLayout />
                      </SecureRoute>
                    }
                  >
                    {/* Dashboard */}
                    <Route index element={<AdminDashboard />} />
                    
                    {/* Content Management */}
                    <Route path="resources" element={<AdminResources />} />
                    <Route path="jobs" element={<AdminJobs />} />
                    <Route path="roadmaps" element={<AdminRoadmaps />} />
                    <Route path="sessions" element={<AdminSessions />} />
                    <Route path="downloads" element={<AdminDownloads />} />
                    <Route path="recent-links" element={<AdminRecentLinks />} />
                    <Route path="community" element={<AdminCommunity />} />
                    
                    {/* System */}
                    <Route path="settings" element={<AdminSettings />} />
                    
                    {/* Analytics */}
                    <Route path="users" element={<AdminUserTracking />} />
                    <Route path="analytics" element={<AdminAnalytics />} />
                    
                    {/* Catch any other admin routes - redirect to dashboard */}
                    <Route path="*" element={<Navigate to="/admin" replace />} />
                  </Route>
                  
                  {/* ===== CATCH ALL ROUTE ===== */}
                  {/* Any undefined routes redirect to home */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </SecurityMonitor>
            </ThemeProvider>
          </AuthProvider>
        </GoogleAuthProvider>
      </GoogleOAuthProvider>
    </ErrorBoundary>
  );
}

export default App;