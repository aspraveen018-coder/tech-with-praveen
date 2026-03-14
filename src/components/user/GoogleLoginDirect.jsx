import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaGoogle } from 'react-icons/fa';
import styled from 'styled-components';

const GoogleButton = styled(motion.button)`
  width: 100%;
  background: white;
  border: none;
  padding: 15px;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #333;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const GoogleLoginDirect = ({ onSuccess, onError }) => {
  const [loading, setLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    // Load Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      setScriptLoaded(true);
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleGoogleLogin = () => {
    if (!scriptLoaded) {
      alert('Google Sign-In is still loading. Please try again.');
      return;
    }

    setLoading(true);

    const client = window.google.accounts.id;

    client.initialize({
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
      auto_select: false,
      cancel_on_tap_outside: true,
    });

    client.prompt(); // One-tap sign-in
  };

  const handleCredentialResponse = async (response) => {
    try {
      // Send the credential to your backend or decode it
      const responsePayload = decodeJwtResponse(response.credential);
      
      // Here you would typically send the token to your backend
      // const result = await fetch('/api/auth/google', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ token: response.credential })
      // });
      
      onSuccess({
        ...responsePayload,
        credential: response.credential
      });
    } catch (error) {
      console.error('Google login error:', error);
      onError(error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to decode JWT
  const decodeJwtResponse = (token) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  };

  return (
    <GoogleButton
      onClick={handleGoogleLogin}
      disabled={loading || !scriptLoaded}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {loading ? (
        'Loading...'
      ) : (
        <>
          <FaGoogle /> Continue with Google
        </>
      )}
    </GoogleButton>
  );
};

export default GoogleLoginDirect;