import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);

    // Handle online/offline status
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const login = async (email, password) => {
    try {
      // In a real app, this would make an API call to your backend
      // For demo purposes, we'll just simulate a successful login
      const user = { email, id: Date.now() };
      
      // Store user data in localStorage for offline access
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('lastSync', new Date().toISOString());
      
      setCurrentUser(user);
    } catch (error) {
      throw new Error('Login failed');
    }
  };

  const register = async (email, password) => {
    try {
      // In a real app, this would make an API call to your backend
      // For demo purposes, we'll just simulate a successful registration
      const user = { email, id: Date.now() };
      
      // Store user data in localStorage for offline access
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('lastSync', new Date().toISOString());
      
      setCurrentUser(user);
    } catch (error) {
      throw new Error('Registration failed');
    }
  };

  const googleLogin = async (credential) => {
    try {
      // In a real app, you would verify the credential with your backend
      // For demo purposes, we'll just simulate a successful login
      const user = { 
        email: 'google_user@example.com', // In real app, decode JWT to get email
        id: Date.now(),
        provider: 'google'
      };
      
      // Store user data in localStorage for offline access
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('lastSync', new Date().toISOString());
      
      setCurrentUser(user);
    } catch (error) {
      throw new Error('Google login failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('lastSync');
    setCurrentUser(null);
  };

  const syncData = async () => {
    if (!isOffline) {
      try {
        // In a real app, this would sync local data with the server
        const lastSync = localStorage.getItem('lastSync');
        console.log('Syncing data since:', lastSync);
        
        // Update last sync time
        localStorage.setItem('lastSync', new Date().toISOString());
      } catch (error) {
        console.error('Sync failed:', error);
      }
    }
  };

  const value = {
    currentUser,
    login,
    register,
    googleLogin,
    logout,
    loading,
    isOffline,
    syncData
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 