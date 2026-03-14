import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState({
    mode: 'dark',
    accentColor: '#00d2ff',
    sidebarCollapsed: false,
    animationsEnabled: true
  });

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('admin_theme');
    if (savedTheme) {
      try {
        const parsed = JSON.parse(savedTheme);
        setTheme(parsed);
        applyTheme(parsed);
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    }
  }, []);

  // Apply theme to document
  const applyTheme = (themeData) => {
    const root = document.documentElement;
    
    // Set color scheme based on mode
    if (themeData.mode === 'dark') {
      root.style.setProperty('--bg-primary', '#030614');
      root.style.setProperty('--bg-secondary', '#0a0f1f');
      root.style.setProperty('--bg-card', 'rgba(10, 20, 40, 0.6)');
      root.style.setProperty('--text-primary', '#ffffff');
      root.style.setProperty('--text-secondary', '#a0aec0');
      root.style.setProperty('--border-color', 'rgba(0, 210, 255, 0.1)');
    } else {
      root.style.setProperty('--bg-primary', '#f7f9fc');
      root.style.setProperty('--bg-secondary', '#ffffff');
      root.style.setProperty('--bg-card', 'rgba(255, 255, 255, 0.9)');
      root.style.setProperty('--text-primary', '#1a202c');
      root.style.setProperty('--text-secondary', '#4a5568');
      root.style.setProperty('--border-color', 'rgba(0, 210, 255, 0.2)');
    }

    // Set accent color
    root.style.setProperty('--accent-color', themeData.accentColor);
    root.style.setProperty('--accent-gradient', `linear-gradient(135deg, ${themeData.accentColor}, ${adjustColor(themeData.accentColor, 20)})`);

    // Set animation preference
    if (!themeData.animationsEnabled) {
      root.style.setProperty('--animation-speed', '0s');
    } else {
      root.style.setProperty('--animation-speed', '0.3s');
    }

    // Set sidebar state
    if (themeData.sidebarCollapsed) {
      root.style.setProperty('--sidebar-width', '80px');
    } else {
      root.style.setProperty('--sidebar-width', '280px');
    }
  };

  // Helper function to adjust color brightness
  const adjustColor = (color, percent) => {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  };

  const updateTheme = (newTheme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
    localStorage.setItem('admin_theme', JSON.stringify(newTheme));
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};