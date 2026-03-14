import React, { createContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Check for saved auth state on mount
    const initializeAuth = () => {
      try {
        const savedAuth = localStorage.getItem('auth');
        if (savedAuth) {
          const parsed = JSON.parse(savedAuth);
          const { user: savedUser, token: savedToken, expiresAt } = parsed;
          
          // Check if token has expired
          if (expiresAt && new Date().getTime() < expiresAt) {
            setUser(savedUser);
            setToken(savedToken);
            setIsAuthenticated(true);
          } else {
            // Token expired, clear storage
            localStorage.removeItem('auth');
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        localStorage.removeItem('auth');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Get stored password from localStorage (if changed by user)
      const storedPassword = localStorage.getItem('user_password') || 'admin123';
      
      // Get stored email from profile settings (if changed)
      let storedEmail = 'admin@techwithpraveen.com';
      const savedProfile = localStorage.getItem('profile_settings');
      if (savedProfile) {
        try {
          const profile = JSON.parse(savedProfile);
          if (profile.email) {
            storedEmail = profile.email;
          }
        } catch (e) {
          console.error('Error parsing profile:', e);
        }
      }

      // Also check if email was updated in auth
      const auth = localStorage.getItem('auth');
      if (auth) {
        try {
          const authData = JSON.parse(auth);
          if (authData.user?.email) {
            storedEmail = authData.user.email;
          }
        } catch (e) {
          console.error('Error parsing auth:', e);
        }
      }

      console.log('Login attempt - Email:', email, 'Stored email:', storedEmail);
      
      // Check if email matches stored email AND password matches stored password
      if (email === storedEmail && password === storedPassword) {
        // Load saved profile data
        let profileData = {};
        
        if (savedProfile) {
          try {
            profileData = JSON.parse(savedProfile);
          } catch (e) {
            console.error('Error parsing profile:', e);
          }
        }

        const userData = {
          id: 1,
          name: profileData.name || 'Praveen Kumar',
          email: storedEmail, // Use the stored email
          role: 'super_admin',
          avatar: null,
          bio: profileData.bio || 'Tech enthusiast and content creator',
          phone: profileData.phone || '+91 98765 43210',
          location: profileData.location || 'Bangalore, India',
          website: profileData.website || 'https://techwithpraveen.com',
          department: profileData.department || 'Technology',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          permissions: [
            'manage_resources',
            'manage_jobs',
            'manage_roadmaps',
            'manage_sessions',
            'manage_downloads',
            'manage_community',
            'manage_settings',
            'view_analytics'
          ]
        };

        // Generate a mock JWT token
        const mockToken = btoa(JSON.stringify({
          userId: userData.id,
          email: userData.email,
          exp: new Date().getTime() + 24 * 60 * 60 * 1000 // 24 hours
        }));

        // Set expiration to 24 hours from now
        const expiresAt = new Date().getTime() + 24 * 60 * 60 * 1000;

        const authData = {
          user: userData,
          token: mockToken,
          expiresAt
        };

        // Save to localStorage
        localStorage.setItem('auth', JSON.stringify(authData));
        
        // Update state
        setUser(userData);
        setToken(mockToken);
        setIsAuthenticated(true);

        // Log login activity
        console.log('User logged in:', { email, timestamp: new Date().toISOString() });

        toast.success('Login successful!');
        return true;
      } 
      // Editor login (always uses default email and password)
      else if (email === 'editor@techwithpraveen.com' && password === 'editor123') {
        const userData = {
          id: 2,
          name: 'Editor User',
          email: 'editor@techwithpraveen.com',
          role: 'editor',
          avatar: null,
          bio: 'Content editor',
          phone: '',
          location: '',
          website: '',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          permissions: [
            'manage_resources',
            'manage_jobs',
            'view_analytics'
          ]
        };

        const mockToken = btoa(JSON.stringify({
          userId: userData.id,
          email: userData.email,
          exp: new Date().getTime() + 24 * 60 * 60 * 1000
        }));

        const expiresAt = new Date().getTime() + 24 * 60 * 60 * 1000;

        localStorage.setItem('auth', JSON.stringify({
          user: userData,
          token: mockToken,
          expiresAt
        }));

        setUser(userData);
        setToken(mockToken);
        setIsAuthenticated(true);

        toast.success('Login successful!');
        return true;
      } 
      else {
        // Generic error message
        toast.error('Invalid credentials');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    try {
      // Clear localStorage
      localStorage.removeItem('auth');
      
      // Clear session storage if any
      sessionStorage.removeItem('auth');
      
      // Update state
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error during logout');
    }
  };

  const refreshToken = async () => {
    try {
      if (token && user) {
        const expiresAt = new Date().getTime() + 24 * 60 * 60 * 1000;
        
        const authData = {
          user,
          token,
          expiresAt
        };
        
        localStorage.setItem('auth', JSON.stringify(authData));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  };

  const hasPermission = (permission) => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission) || user.role === 'super_admin';
  };

  const hasRole = (role) => {
    if (!user) return false;
    return user.role === role;
  };

  const updateUserProfile = async (profileData) => {
    try {
      // Get current auth data
      const authData = JSON.parse(localStorage.getItem('auth'));
      
      // Update user object
      const updatedUser = {
        ...user,
        ...profileData,
        updatedAt: new Date().toISOString()
      };

      // Update in auth storage
      if (authData) {
        authData.user = updatedUser;
        localStorage.setItem('auth', JSON.stringify(authData));
      }

      // Also save profile settings separately for persistence
      const currentProfile = JSON.parse(localStorage.getItem('profile_settings') || '{}');
      const newProfile = {
        ...currentProfile,
        ...profileData
      };
      localStorage.setItem('profile_settings', JSON.stringify(newProfile));

      setUser(updatedUser);
      toast.success('Profile updated successfully');
      return true;
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile');
      return false;
    }
  };

  const updateUserPassword = async (newPassword) => {
    try {
      localStorage.setItem('user_password', newPassword);
      console.log('Password updated successfully');
      return true;
    } catch (error) {
      console.error('Password update error:', error);
      return false;
    }
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    token,
    login,
    logout,
    refreshToken,
    hasPermission,
    hasRole,
    updateUserProfile,
    updateUserPassword,
    getUserName: () => user?.name || 'Admin',
    getUserEmail: () => user?.email || '',
    getUserRole: () => user?.role || 'guest',
    getUserPermissions: () => user?.permissions || [],
    isSuperAdmin: () => user?.role === 'super_admin',
    isEditor: () => user?.role === 'editor'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};