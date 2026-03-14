import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import toast from 'react-hot-toast';
import { userTracking } from '../firebase';

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
  const [firebaseReady, setFirebaseReady] = useState(false);

  // Load users from Firebase on mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Load current user from localStorage (for session persistence)
        const savedUser = localStorage.getItem('google_user');
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
        }

        // Load all users from Firebase for admin tracking
        const users = await userTracking.getAllUsers();
        setAllUsers(users);
        setFirebaseReady(true);
        console.log('✅ Loaded users from Firebase:', users.length);
      } catch (error) {
        console.error('❌ Error loading initial data:', error);
        toast.error('Failed to load user data');
      }
    };

    loadInitialData();
  }, []);

  // Save user to Firebase tracking
  const saveUserToTracking = useCallback(async (userData) => {
    try {
      // Save to Firebase (cross-device storage)
      const savedUser = await userTracking.saveUser(userData);
      
      // Also save to localStorage for quick access (current device only)
      localStorage.setItem('google_user', JSON.stringify(userData));
      
      // Refresh the allUsers list from Firebase
      const updatedUsers = await userTracking.getAllUsers();
      setAllUsers(updatedUsers);
      
      console.log('✅ User saved to Firebase:', userData.email);
      return updatedUsers;
    } catch (error) {
      console.error('❌ Error saving user to tracking:', error);
      toast.error('Failed to save user data');
      return [];
    }
  }, []);

  // Update user profile
  const updateUserProfile = async (updatedData) => {
    try {
      if (!user) {
        throw new Error('No user logged in');
      }

      const updatedUser = {
        ...user,
        ...updatedData,
        updatedAt: new Date().toISOString()
      };

      // Update in Firebase (cross-device)
      await userTracking.updateUser(user.email, updatedData);
      
      // Update in localStorage (current device)
      localStorage.setItem('google_user', JSON.stringify(updatedUser));
      
      // Refresh the allUsers list from Firebase
      const updatedUsers = await userTracking.getAllUsers();
      setAllUsers(updatedUsers);
      setUser(updatedUser);
      
      toast.success('Profile updated successfully!');
      return true;
    } catch (error) {
      console.error('❌ Error updating profile:', error);
      toast.error('Failed to update profile');
      return false;
    }
  };

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        console.log('📱 Google login success, fetching user info...');
        
        const userInfo = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
          }
        );

        console.log('👤 User info received:', userInfo.data);

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

        // Save to Firebase (cross-device) and get updated users list
        const updatedUsers = await saveUserToTracking(userData);
        
        setUser(userData);
        setIsAuthenticated(true);
        toast.success(`Welcome, ${userData.name}!`);
        
        console.log('📊 Total tracked users:', updatedUsers.length);
        
      } catch (error) {
        console.error('❌ Error fetching user info:', error);
        toast.error('Failed to get user information');
      } finally {
        setLoading(false);
      }
    },
    onError: (error) => {
      console.error('❌ Login Failed:', error);
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
  const getAllUsers = useCallback(() => {
    console.log('📋 getAllUsers called, returning:', allUsers.length);
    return allUsers;
  }, [allUsers]);

  // Get user by email
  const getUserByEmail = useCallback((email) => {
    return allUsers.find(u => u.email === email) || null;
  }, [allUsers]);

  // Refresh users from Firebase (useful for admin panel)
  const refreshUsers = useCallback(async () => {
    try {
      const users = await userTracking.getAllUsers();
      setAllUsers(users);
      console.log('🔄 Refreshed users from Firebase:', users.length);
      toast.success('User data refreshed');
    } catch (error) {
      console.error('❌ Error refreshing users:', error);
      toast.error('Failed to refresh user data');
    }
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    updateUserProfile,
    getAllUsers,
    getUserByEmail,
    refreshUsers,
    allUsers, // Direct access to users array
    firebaseReady // Flag to check if Firebase is ready
  };

  return (
    <GoogleAuthContext.Provider value={value}>
      {children}
    </GoogleAuthContext.Provider>
  );
};