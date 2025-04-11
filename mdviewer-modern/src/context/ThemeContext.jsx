import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Check if user prefers dark mode
  const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Get theme from localStorage or use system preference
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('mdviewer-theme');
    return savedTheme || (prefersDarkMode ? 'dark' : 'light');
  });

  // Update localStorage when theme changes
  useEffect(() => {
    localStorage.setItem('mdviewer-theme', theme);
    // Add or remove dark class from body
    document.body.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      // Only change theme if user hasn't manually set it
      if (!localStorage.getItem('mdviewer-theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  // Toggle between light and dark themes
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
