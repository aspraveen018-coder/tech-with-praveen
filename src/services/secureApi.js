import axios from 'axios';
import { encryptData, decryptData, validateCSRFToken, generateCSRFToken, logSecurityEvent } from '../utils/security';

// Create axios instance with security defaults
const secureApi = axios.create({
  timeout: 10000,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'X-Content-Type-Options': 'nosniff'
  }
});

// Request interceptor for security
secureApi.interceptors.request.use(
  (config) => {
    // Add CSRF token
    const csrfToken = generateCSRFToken();
    config.headers['X-CSRF-Token'] = csrfToken;
    
    // Add session token
    const session = localStorage.getItem('session');
    if (session) {
      config.headers['Authorization'] = `Bearer ${session}`;
    }
    
    // Encrypt sensitive data
    if (config.data && config.encrypt) {
      config.data = { encrypted: encryptData(config.data) };
    }
    
    // Add request fingerprint
    config.headers['X-Request-Fingerprint'] = generateFingerprint();
    
    return config;
  },
  (error) => {
    logSecurityEvent('request_error', { error: error.message });
    return Promise.reject(error);
  }
);

// Response interceptor for security
secureApi.interceptors.response.use(
  (response) => {
    // Validate CSRF token on response
    const responseToken = response.headers['x-csrf-token'];
    if (responseToken && !validateCSRFToken(responseToken)) {
      logSecurityEvent('csrf_validation_failed');
      return Promise.reject(new Error('CSRF validation failed'));
    }
    
    // Decrypt response if needed
    if (response.data && response.data.encrypted) {
      response.data = decryptData(response.data.encrypted);
    }
    
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      logSecurityEvent('session_expired');
      // Handle session expiry
      localStorage.removeItem('auth');
      localStorage.removeItem('session');
      window.location.href = '/admin/login';
    } else if (error.response?.status === 429) {
      logSecurityEvent('rate_limited');
      // Handle rate limiting
    }
    
    logSecurityEvent('response_error', { 
      status: error.response?.status,
      message: error.message 
    });
    
    return Promise.reject(error);
  }
);

// Generate unique fingerprint for request
const generateFingerprint = () => {
  const components = [
    navigator.userAgent,
    navigator.language,
    typeof window !== 'undefined' && typeof window.screen !== 'undefined' ? window.screen.colorDepth : '',
    typeof window !== 'undefined' && typeof window.screen !== 'undefined' ? window.screen.width : '',
    typeof window !== 'undefined' && typeof window.screen !== 'undefined' ? window.screen.height : '',
    new Date().getTimezoneOffset()
  ];
  return btoa(components.join('|'));
};

export default secureApi;