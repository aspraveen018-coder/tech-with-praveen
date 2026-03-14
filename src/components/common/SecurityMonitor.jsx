import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { logSecurityEvent } from '../../utils/security';

const SecurityMonitor = ({ children }) => {
  const location = useLocation();
  const sensitiveFieldsRef = useRef([]);

  useEffect(() => {
    // Only run security checks on admin routes
    const isAdminRoute = location.pathname.startsWith('/admin');
    
    if (!isAdminRoute) {
      return; // Skip all security checks for non-admin routes
    }

    // Clean up function to remove event listeners
    const cleanupSensitiveFields = () => {
      sensitiveFieldsRef.current.forEach(({ field, handlers }) => {
        if (field) {
          field.removeEventListener('copy', handlers.copy);
          field.removeEventListener('cut', handlers.cut);
          field.removeEventListener('paste', handlers.paste);
        }
      });
      sensitiveFieldsRef.current = [];
    };

    // Monitor sensitive fields (only on admin pages)
    const monitorSensitiveFields = () => {
      // Clean up previous listeners
      cleanupSensitiveFields();

      const sensitiveFields = document.querySelectorAll('input[type="password"], input[name="creditcard"], input[name="cvv"], input[autocomplete="cc-number"]');
      
      sensitiveFields.forEach(field => {
        // Create handler functions
        const copyHandler = (e) => {
          e.preventDefault();
          logSecurityEvent('sensitive_data_copied', { 
            field: field.name || field.id || 'unknown',
            type: 'copy'
          });
          return false;
        };

        const cutHandler = (e) => {
          e.preventDefault();
          logSecurityEvent('sensitive_data_cut', { 
            field: field.name || field.id || 'unknown',
            type: 'cut'
          });
          return false;
        };

        const pasteHandler = (e) => {
          // Allow paste but log it
          logSecurityEvent('sensitive_data_pasted', { 
            field: field.name || field.id || 'unknown',
            type: 'paste'
          });
          // Don't prevent default - allow paste for user convenience
        };

        // Add event listeners
        field.addEventListener('copy', copyHandler);
        field.addEventListener('cut', cutHandler);
        field.addEventListener('paste', pasteHandler);

        // Store for cleanup
        sensitiveFieldsRef.current.push({
          field,
          handlers: {
            copy: copyHandler,
            cut: cutHandler,
            paste: pasteHandler
          }
        });

        // Add visual indicator for sensitive fields (optional)
        field.style.border = '2px solid #ff6b6b';
      });
    };

    // Monitor for console tampering (only on admin routes)
    const monitorConsole = () => {
      try {
        // Detect if console is being used excessively
        let consoleCounter = 0;
        const originalLog = console.log;
        console.log = function(...args) {
          consoleCounter++;
          if (consoleCounter > 100) {
            logSecurityEvent('excessive_console_usage');
          }
          originalLog.apply(console, args);
        };
      } catch (error) {
        // Silent fail
      }
    };

    // Monitor for tab visibility changes (only on admin routes)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        logSecurityEvent('admin_tab_hidden');
      } else {
        logSecurityEvent('admin_tab_visible');
      }
    };

    // Monitor for window focus/blur (only on admin routes)
    const handleBlur = () => {
      logSecurityEvent('admin_window_blur');
    };

    const handleFocus = () => {
      logSecurityEvent('admin_window_focus');
    };

    // Check for iframe embedding
    const checkIframe = () => {
      try {
        if (window.self !== window.top) {
          logSecurityEvent('iframe_embedding_detected', {
            url: document.referrer || 'unknown'
          });
        }
      } catch (e) {
        // Cross-origin iframe, definitely embedded
        logSecurityEvent('iframe_embedding_detected_cross_origin');
      }
    };

    // Run initial checks
    monitorSensitiveFields();
    monitorConsole();
    checkIframe();

    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    // Set up periodic check for new sensitive fields (every 5 seconds)
    const interval = setInterval(monitorSensitiveFields, 5000);

    // Cleanup function
    return () => {
      cleanupSensitiveFields();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
      
      // Restore console.log (optional)
      try {
        if (console.log !== console.log) {
          // Restore logic if needed
        }
      } catch (error) {
        // Silent fail
      }
    };

  }, [location.pathname]); // Re-run when route changes

  // Also check for suspicious activity periodically (only on admin routes)
  useEffect(() => {
    const isAdminRoute = location.pathname.startsWith('/admin');
    
    if (!isAdminRoute) {
      return;
    }

    const checkSuspiciousActivity = () => {
      // Check for automation tools
      if (window.navigator && window.navigator.webdriver) {
        logSecurityEvent('automation_tool_detected');
      }

      // Check for headless browser
      if (!window.navigator.plugins || window.navigator.plugins.length === 0) {
        logSecurityEvent('headless_browser_detected');
      }

      // Check for unusual screen size (bot detection)
      if (window.screen) {
        if (window.screen.width < 200 || window.screen.height < 200) {
          logSecurityEvent('unusual_screen_size_detected', {
            width: window.screen.width,
            height: window.screen.height
          });
        }
      }

      // Check for multiple tabs with same admin session
      const tabId = sessionStorage.getItem('admin_tab_id');
      if (!tabId) {
        const newTabId = Math.random().toString(36).substring(2) + Date.now().toString(36);
        sessionStorage.setItem('admin_tab_id', newTabId);
      } else {
        // Could implement tab synchronization here
        logSecurityEvent('admin_tab_active', { tabId });
      }
    };

    // Run suspicious activity check
    checkSuspiciousActivity();

    // Check every minute
    const suspiciousInterval = setInterval(checkSuspiciousActivity, 60000);

    return () => clearInterval(suspiciousInterval);
  }, [location.pathname]);

  // Render children without any modifications
  return <>{children}</>;
};

export default SecurityMonitor;