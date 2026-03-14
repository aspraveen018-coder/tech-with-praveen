import CryptoJS from 'crypto-js';
import DOMPurify from 'dompurify';

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Encryption key (store in environment variable)
const ENCRYPTION_KEY = process.env.REACT_APP_ENCRYPTION_KEY || 'your-secret-key-min-32-chars-long!!';

// Rate limiting storage (only in browser)
let rateLimitStore;
let cleanupInterval;

if (isBrowser) {
  rateLimitStore = new Map();
  // Clean up rate limit store every hour
  cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [key, value] of rateLimitStore.entries()) {
      if (now - value.firstAttempt > 3600000) { // 1 hour
        rateLimitStore.delete(key);
      }
    }
  }, 3600000);
}

// XSS Prevention
export const sanitizeInput = (input) => {
  if (!isBrowser) return input;
  if (typeof input === 'string') {
    return DOMPurify.sanitize(input.trim(), {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li'], // Only allow basic formatting
      ALLOWED_ATTR: ['href', 'target', 'rel'],
      ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|blob):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
    });
  }
  return input;
};

export const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  
  const sanitized = Array.isArray(obj) ? [] : {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
};

// CSRF Protection (only in browser)
export const generateCSRFToken = () => {
  if (!isBrowser) return '';
  
  try {
    const token = CryptoJS.lib.WordArray.random(32).toString();
    sessionStorage.setItem('csrf_token', token);
    // Also set a cookie for server-side validation
    document.cookie = `XSRF-TOKEN=${token}; path=/; SameSite=Strict; Secure`;
    return token;
  } catch (error) {
    console.error('CSRF token generation error:', error);
    return '';
  }
};

export const validateCSRFToken = (token) => {
  if (!isBrowser) return false;
  
  try {
    const storedToken = sessionStorage.getItem('csrf_token');
    return storedToken === token;
  } catch (error) {
    console.error('CSRF token validation error:', error);
    return false;
  }
};

// Encryption
export const encryptData = (data) => {
  try {
    if (!data) return null;
    if (!isBrowser) return JSON.stringify(data); // Fallback for SSR
    
    const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString();
    return ciphertext;
  } catch (error) {
    console.error('Encryption error:', error);
    return null;
  }
};

export const decryptData = (ciphertext) => {
  try {
    if (!ciphertext) return null;
    if (!isBrowser) return JSON.parse(ciphertext); // Fallback for SSR
    
    const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};

// Rate Limiting with cleanup
export const checkRateLimit = (identifier, action, limit = 5, windowMs = 60000) => {
  if (!isBrowser || !rateLimitStore) {
    return { allowed: true, remaining: limit, resetAfter: 0 };
  }
  
  try {
    const key = `${identifier}:${action}`;
    const now = Date.now();
    
    // Clean up old entries periodically
    if (Math.random() < 0.01) { // 1% chance to trigger cleanup
      for (const [k, v] of rateLimitStore.entries()) {
        if (now - v.firstAttempt > windowMs * 2) {
          rateLimitStore.delete(k);
        }
      }
    }
    
    if (!rateLimitStore.has(key)) {
      rateLimitStore.set(key, { count: 1, firstAttempt: now });
      return { allowed: true, remaining: limit - 1, resetAfter: 0 };
    }
    
    const record = rateLimitStore.get(key);
    
    // Reset if window has passed
    if (now - record.firstAttempt > windowMs) {
      rateLimitStore.set(key, { count: 1, firstAttempt: now });
      return { allowed: true, remaining: limit - 1, resetAfter: 0 };
    }
    
    // Check limit
    if (record.count >= limit) {
      const resetAfter = Math.ceil((windowMs - (now - record.firstAttempt)) / 1000);
      return { 
        allowed: false, 
        remaining: 0,
        resetAfter: resetAfter
      };
    }
    
    // Increment count
    record.count++;
    rateLimitStore.set(key, record);
    return { allowed: true, remaining: limit - record.count, resetAfter: 0 };
  } catch (error) {
    console.error('Rate limit check error:', error);
    return { allowed: true, remaining: limit, resetAfter: 0 };
  }
};

// Password Strength Checker
export const checkPasswordStrength = (password) => {
  if (!password) return { score: 0, isStrong: false, checks: {}, feedback: [] };
  
  try {
    const checks = {
      length: password.length >= 12,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      numbers: /[0-9]/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
      noCommon: !isCommonPassword(password),
      noSequential: !hasSequentialChars(password),
      noRepeating: !hasRepeatingChars(password)
    };
    
    const score = Object.values(checks).filter(Boolean).length;
    
    return {
      score,
      isStrong: score >= 6,
      checks,
      feedback: getPasswordFeedback(checks)
    };
  } catch (error) {
    console.error('Password strength check error:', error);
    return { score: 0, isStrong: false, checks: {}, feedback: ['Error checking password'] };
  }
};

const commonPasswords = [
  'password123', 'admin123', '12345678', 'qwerty123', 'letmein',
  'welcome123', 'monkey123', 'dragon123', 'baseball123', 'football123',
  'password', '123456789', '12345678', '12345', 'qwerty', 'abc123'
];

const isCommonPassword = (password) => {
  return commonPasswords.includes(password.toLowerCase());
};

const hasSequentialChars = (password) => {
  const sequential = /(?:abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789)/i;
  return sequential.test(password);
};

const hasRepeatingChars = (password) => {
  return /(.)\1{2,}/.test(password);
};

const getPasswordFeedback = (checks) => {
  const feedback = [];
  if (!checks.length) feedback.push('Use at least 12 characters');
  if (!checks.uppercase) feedback.push('Add uppercase letters');
  if (!checks.lowercase) feedback.push('Add lowercase letters');
  if (!checks.numbers) feedback.push('Add numbers');
  if (!checks.special) feedback.push('Add special characters');
  if (!checks.noCommon) feedback.push('Avoid common passwords');
  if (!checks.noSequential) feedback.push('Avoid sequential characters (abc, 123)');
  if (!checks.noRepeating) feedback.push('Avoid repeating characters (aaa)');
  return feedback;
};

// Session Management
export const createSession = (userId, userData) => {
  if (!isBrowser) return '';
  
  try {
    const sessionId = CryptoJS.lib.WordArray.random(16).toString();
    const session = {
      userId,
      userData: encryptData(userData),
      createdAt: Date.now(),
      expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
      sessionId: sessionId
    };
    
    localStorage.setItem('session', encryptData(session));
    sessionStorage.setItem('session_id', sessionId);
    return sessionId;
  } catch (error) {
    console.error('Session creation error:', error);
    return '';
  }
};

export const validateSession = () => {
  if (!isBrowser) return null;
  
  try {
    const encryptedSession = localStorage.getItem('session');
    if (!encryptedSession) return null;
    
    const session = decryptData(encryptedSession);
    if (!session) return null;
    
    // Check expiration
    if (Date.now() > session.expiresAt) {
      localStorage.removeItem('session');
      sessionStorage.removeItem('session_id');
      return null;
    }
    
    // Verify session ID matches
    const storedSessionId = sessionStorage.getItem('session_id');
    if (storedSessionId && storedSessionId !== session.sessionId) {
      localStorage.removeItem('session');
      sessionStorage.removeItem('session_id');
      return null;
    }
    
    return session;
  } catch (error) {
    console.error('Session validation error:', error);
    return null;
  }
};

export const clearSession = () => {
  if (!isBrowser) return;
  
  try {
    localStorage.removeItem('session');
    sessionStorage.removeItem('session_id');
    sessionStorage.removeItem('csrf_token');
  } catch (error) {
    console.error('Session clear error:', error);
  }
};

// Audit Logging with batching
const logQueue = [];
let logTimer = null;

export const logSecurityEvent = (event, details = {}) => {
  if (!isBrowser) return;
  
  try {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      details: encryptData(details),
      userId: (() => {
        try {
          const auth = JSON.parse(localStorage.getItem('auth') || '{}');
          return auth.user?.id || 'anonymous';
        } catch {
          return 'anonymous';
        }
      })(),
      sessionId: sessionStorage.getItem('session_id') || 'none',
      url: window.location.href,
      referrer: document.referrer || 'direct',
      userAgent: navigator.userAgent,
      screenSize: window.screen ? `${window.screen.width}x${window.screen.height}` : 'unknown',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
    
    // Add to queue
    logQueue.push(logEntry);
    
    // Keep only last 1000 in localStorage
    const logs = JSON.parse(localStorage.getItem('security_audit_log') || '[]');
    logs.push(logEntry);
    localStorage.setItem('security_audit_log', JSON.stringify(logs.slice(-1000)));
    
    // Batch send to server
    if (process.env.NODE_ENV === 'production') {
      if (logTimer) clearTimeout(logTimer);
      logTimer = setTimeout(() => {
        if (logQueue.length > 0) {
          const batch = [...logQueue];
          logQueue.length = 0;
          
          fetch('/api/security/log', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ logs: batch }),
            keepalive: true
          }).catch(() => {
            // Re-queue on failure
            logQueue.unshift(...batch);
          });
        }
      }, 5000); // Batch every 5 seconds
    }
  } catch (error) {
    console.error('Security logging error:', error);
  }
};

// SQL Injection Prevention (for any raw queries)
export const escapeSQL = (input) => {
  if (typeof input !== 'string') return input;
  
  try {
    return input
      .replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, (char) => {
        switch (char) {
          case "\0": return "\\0";
          case "\x08": return "\\b";
          case "\x09": return "\\t";
          case "\x1a": return "\\z";
          case "\n": return "\\n";
          case "\r": return "\\r";
          case "\"": return "\\\"";
          case "'": return "\\'";
          case "\\": return "\\\\";
          case "%": return "\\%";
          default: return char;
        }
      });
  } catch (error) {
    console.error('SQL escape error:', error);
    return input;
  }
};

// Content Security Policy Generator
export const generateCSP = (nonce) => {
  const nonceStr = nonce ? `'nonce-${nonce}'` : '';
  
  return {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://apis.google.com", "https://accounts.google.com", nonceStr].filter(Boolean),
    'style-src': ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    'img-src': ["'self'", "data:", "https:", "http:", "https://*.googleusercontent.com"],
    'font-src': ["'self'", "https://fonts.gstatic.com", "data:"],
    'connect-src': ["'self'", "https://accounts.google.com", "https://www.googleapis.com", "https://*.googleapis.com"],
    'frame-src': ["'self'", "https://accounts.google.com"],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"]
  };
};

// HTTP Headers for security
export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), accelerometer=()'
};

// Generate random nonce for CSP
export const generateNonce = () => {
  if (!isBrowser) return '';
  
  try {
    return CryptoJS.lib.WordArray.random(16).toString();
  } catch (error) {
    console.error('Nonce generation error:', error);
    return '';
  }
};

// Secure compare to prevent timing attacks
export const secureCompare = (a, b) => {
  if (!a || !b) return false;
  if (a.length !== b.length) return false;
  
  try {
    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return result === 0;
  } catch (error) {
    console.error('Secure compare error:', error);
    return a === b; // Fallback to normal comparison
  }
};

// Detect if running in iframe
export const isInIframe = () => {
  if (!isBrowser) return false;
  
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
};

// Prevent clickjacking
export const preventClickjacking = () => {
  if (!isBrowser) return;
  
  try {
    if (isInIframe()) {
      if (window.top) {
        window.top.location = window.self.location;
      }
    }
  } catch (error) {
    console.error('Clickjacking prevention error:', error);
  }
};

// Get client fingerprint
export const getClientFingerprint = () => {
  if (!isBrowser) return '';
  
  try {
    const components = [
      navigator.userAgent,
      navigator.language,
      window.screen ? window.screen.colorDepth : 'unknown',
      window.screen ? window.screen.width : 'unknown',
      window.screen ? window.screen.height : 'unknown',
      new Date().getTimezoneOffset(),
      navigator.hardwareConcurrency || 'unknown',
      navigator.deviceMemory || 'unknown'
    ];
    
    const fingerprint = components.join('|');
    return CryptoJS.SHA256(fingerprint).toString();
  } catch (error) {
    console.error('Fingerprint generation error:', error);
    return '';
  }
};

// Check for suspicious activity
export const checkSuspiciousActivity = () => {
  if (!isBrowser) return [];
  
  const issues = [];
  
  try {
    // Check if in iframe
    if (isInIframe()) {
      issues.push('PAGE_LOADED_IN_IFRAME');
    }
    
    // Check for automation tools
    if (navigator.webdriver) {
      issues.push('WEBDRIVER_DETECTED');
    }
    
    // Check for headless browsers
    if (!navigator.plugins || navigator.plugins.length === 0) {
      issues.push('HEADLESS_BROWSER_DETECTED');
    }
    
    // Check for unusual screen size (bot detection)
    if (window.screen && (window.screen.width < 200 || window.screen.height < 200)) {
      issues.push('UNUSUAL_SCREEN_SIZE');
    }
  } catch (error) {
    console.error('Suspicious activity check error:', error);
  }
  
  return issues;
};

// Sanitize URL
export const sanitizeUrl = (url) => {
  if (!url) return '';
  
  try {
    const parsed = new URL(url);
    // Only allow http and https protocols
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return '';
    }
    return parsed.toString();
  } catch {
    return '';
  }
};

// Clean up function (call when app unmounts)
export const cleanup = () => {
  if (cleanupInterval) {
    clearInterval(cleanupInterval);
  }
  if (logTimer) {
    clearTimeout(logTimer);
  }
};

export default {
  sanitizeInput,
  sanitizeObject,
  generateCSRFToken,
  validateCSRFToken,
  encryptData,
  decryptData,
  checkRateLimit,
  checkPasswordStrength,
  createSession,
  validateSession,
  clearSession,
  logSecurityEvent,
  escapeSQL,
  generateCSP,
  securityHeaders,
  generateNonce,
  secureCompare,
  isInIframe,
  preventClickjacking,
  getClientFingerprint,
  checkSuspiciousActivity,
  sanitizeUrl,
  cleanup
};