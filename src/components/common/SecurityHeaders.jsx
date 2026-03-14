import { useEffect } from 'react';

const SecurityHeaders = () => {
  useEffect(() => {
    // Add security headers via meta tags
    const addMetaTag = (name, content) => {
      let meta = document.querySelector(`meta[http-equiv="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.httpEquiv = name;
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Add security headers
    const headers = {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=(), payment=(), usb=()'
    };

    Object.entries(headers).forEach(([name, value]) => {
      addMetaTag(name, value);
    });

    // Generate and apply CSP
    const csp = {
      'default-src': ["'self'"],
      'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://apis.google.com", "https://accounts.google.com"],
      'style-src': ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      'img-src': ["'self'", "data:", "https:", "http:"],
      'font-src': ["'self'", "https://fonts.gstatic.com", "data:"],
      'connect-src': ["'self'", "https://accounts.google.com", "https://www.googleapis.com"],
      'frame-src': ["'self'", "https://accounts.google.com"],
      'object-src': ["'none'"],
      'base-uri': ["'self'"],
      'form-action': ["'self'"]
    };

    const cspString = Object.entries(csp)
      .map(([key, values]) => `${key} ${values.join(' ')}`)
      .join('; ');

    addMetaTag('Content-Security-Policy', cspString);

    // Add cache control
    addMetaTag('Cache-Control', 'no-cache, no-store, must-revalidate');
    addMetaTag('Pragma', 'no-cache');
    addMetaTag('Expires', '0');

    // Prevent browser from detecting and prompting for login credentials
    document.addEventListener('securitypolicyviolation', (e) => {
      console.warn('CSP Violation:', e.blockedURI);
    });

    // Clean up
    return () => {
      // Remove meta tags on unmount if needed
    };
  }, []);

  return null;
};

export default SecurityHeaders;