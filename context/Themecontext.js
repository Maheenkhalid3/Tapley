import React, { createContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemTheme = useColorScheme();
  const [theme, setTheme] = useState('light');

  // Load saved theme preference
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('appTheme');
        setTheme(savedTheme || systemTheme || 'light');
      } catch (error) {
        console.error('Failed to load theme', error);
      }
    };
    loadTheme();
  }, [systemTheme]);

  // Theme configuration
  const themeColors = {
    light: {
      background: '#f8f9fa',
      card: '#ffffff',
      text: '#333333',
      border: '#e0e0e0',
      primary: '#FF8C00',
    },
    dark: {
      background: '#121212',
      card: '#1e1e1e',
      text: '#ffffff',
      border: '#444444',
      primary: '#FF8C00',
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    AsyncStorage.setItem('appTheme', newTheme);
  };

  const contextValue = {
    theme,
    colors: themeColors[theme],
    toggleTheme,
    isDark: theme === 'dark'
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};