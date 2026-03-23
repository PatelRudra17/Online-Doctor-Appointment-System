/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { loginApi, getMeApi } from '../api/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    console.error('useAuth must be used within an AuthProvider');
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(null);

  // Helper function to check if token is expired
  const isTokenExpired = (token) => {
    if (!token) return true;

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      console.error('Error parsing token:', error);
      return true; // Assume expired if parsing fails
    }
  };

  // Check if user is logged in on app load
  useEffect(() => {
    const rehydrateUser = async () => {
      try {
        const savedToken = localStorage.getItem('kiviToken');
        
        if (savedToken) {
          // Check if token is expired
          if (isTokenExpired(savedToken)) {
            console.log('Token expired, clearing authentication');
            localStorage.removeItem('kiviUser');
            localStorage.removeItem('kiviToken');
            setIsAuthenticated(false);
            setUser(null);
            setToken(null);
          } else {
            // Get current user data from API
            try {
              const userData = await getMeApi();
              setUser(userData);
              setToken(savedToken);
              setIsAuthenticated(true);
              console.log('User rehydrated from API:', userData);
            } catch (error) {
              console.error('Error fetching user data:', error);
              // If API call fails, clear auth state
              localStorage.removeItem('kiviUser');
              localStorage.removeItem('kiviToken');
              setIsAuthenticated(false);
              setUser(null);
              setToken(null);
            }
          }
        }
      } catch (error) {
        console.error('Error during user rehydration:', error);
        localStorage.removeItem('kiviUser');
        localStorage.removeItem('kiviToken');
      } finally {
        setIsLoading(false);
      }
    };

    rehydrateUser();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await loginApi(email, password);
      
      // Store token and user data from server
      const { token, user } = response;
      
      setUser(user);
      setToken(token);
      setIsAuthenticated(true);
      localStorage.setItem('kiviUser', JSON.stringify(user));
      localStorage.setItem('kiviToken', token);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    try {
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      localStorage.removeItem('kiviUser');
      localStorage.removeItem('kiviToken');
      console.log('User logged out');
      window.location.href = '/auth/login';
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Note: completeRegistration removed - registration should use proper backend APIs
  // rather than calling login() with user object

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      token,
      isLoading,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};
