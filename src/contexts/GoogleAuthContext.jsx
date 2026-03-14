import React, { createContext, useState, useEffect, useContext } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import toast from 'react-hot-toast';

const GoogleAuthContext = createContext();

export const useGoogleAuth = () => {
  const context = useContext(GoogleAuthContext);
  if (!context) {
    throw new Error('useGoogleAuth must be used within GoogleAuthProvider');
  }
  return context;
};

export const GoogleAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [allUsers, setAllUsers] = useState([]); // Track all logged in users

  // Load users from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('google_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
    }

    // Load all users for admin tracking
    const savedUsers = localStorage.getItem('all_logged_in_users');
    if (savedUsers) {
      setAllUsers(JSON.parse(savedUsers));
    }
  }, []);

  // Save user to the tracking list
  const saveUserToTracking = (userData) => {
    const existingUsers = JSON.parse(localStorage.getItem('all_logged_in_users') || '[]');
    
    // Check if user already exists in tracking
    const userExists = existingUsers.find(u => u.email === userData.email);
    
    const userTrackingData = {
      ...userData,
      lastLogin: new Date().toISOString(),
      loginCount: userExists ? (userExists.loginCount || 1) + 1 : 1,
      deviceInfo: {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
      }
    };

    let updatedUsers;
    if (userExists) {
      // Update existing user
      updatedUsers = existingUsers.map(u => 
        u.email === userData.email ? { ...u, ...userTrackingData } : u
      );
    } else {
      // Add new user
      updatedUsers = [...existingUsers, userTrackingData];
    }

    localStorage.setItem('all_logged_in_users', JSON.stringify(updatedUsers));
    setAllUsers(updatedUsers);
  };

  // Update user profile
  const updateUserProfile = async (updatedData) => {
    try {
      const updatedUser = {
        ...user,
        ...updatedData,
        updatedAt: new Date().toISOString()
      };

      // Update in main user storage
      localStorage.setItem('google_user', JSON.stringify(updatedUser));
      
      // Update in tracking storage
      const existingUsers = JSON.parse(localStorage.getItem('all_logged_in_users') || '[]');
      const updatedUsers = existingUsers.map(u => 
        u.email === user.email ? { ...u, ...updatedData, updatedAt: new Date().toISOString() } : u
      );
      localStorage.setItem('all_logged_in_users', JSON.stringify(updatedUsers));
      setAllUsers(updatedUsers);
      
      setUser(updatedUser);
      toast.success('Profile updated successfully!');
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
      return false;
    }
  };

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        const userInfo = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
          }
        );

        const userData = {
          ...userInfo.data,
          access_token: tokenResponse.access_token,
          loginTime: new Date().toISOString(),
          preferences: {
            theme: 'dark',
            notifications: true,
            emailUpdates: true
          }
        };

        localStorage.setItem('google_user', JSON.stringify(userData));
        saveUserToTracking(userData);
        
        setUser(userData);
        setIsAuthenticated(true);
        toast.success(`Welcome, ${userData.name}!`);
        
      } catch (error) {
        console.error('Error fetching user info:', error);
        toast.error('Failed to get user information');
      } finally {
        setLoading(false);
      }
    },
    onError: (error) => {
      console.error('Login Failed:', error);
      toast.error('Google login failed. Please try again.');
    },
    flow: 'implicit',
    scope: 'openid profile email',
  });

  const logout = () => {
    localStorage.removeItem('google_user');
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
  };

  // Get all logged in users (for admin)
  const getAllUsers = () => {
    return allUsers;
  };

  // Get user by email
  const getUserByEmail = (email) => {
    return allUsers.find(u => u.email === email) || null;
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    updateUserProfile,
    getAllUsers,
    getUserByEmail
  };

  return (
    <GoogleAuthContext.Provider value={value}>
      {children}
    </GoogleAuthContext.Provider>
  );
};