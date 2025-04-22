import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

// Create a custom axios instance with specific config for auth requests
const authAxios = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest' // This helps some servers identify AJAX requests
  }
});

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      // Log attempt details
      console.log('Attempting login with username:', username);
      
      // Use the custom axios instance
      const response = await authAxios.post('/api/auth/login', { 
        username, 
        password 
      });
      
      console.log('Login response:', response.data);
      
      // Create a user object from the response
      const user = {
        id: response.data.user_id,
        username: response.data.username
      };
      
      setCurrentUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      return { success: true };
    } catch (error) {
      // Enhanced error logging
      console.error('Login error:', {
        message: error.message,
        response: error.response ? error.response.data : 'No response data',
        status: error.response ? error.response.status : 'No status code'
      });
      
      return { 
        success: false, 
        message: error.response?.data?.error || 'Login failed. Check your credentials and try again.'
      };
    }
  };

  const register = async (username, email, password) => {
    try {
      // Log attempt details
      console.log('Attempting registration with username:', username, 'and email:', email);
      
      // Make a direct fetch request to bypass potential axios issues
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password
        })
      });
      
      const data = await response.json();
      console.log('Register response:', data);
      
      if (response.ok) {
        return { success: true, message: data.message };
      } else {
        return { 
          success: false, 
          message: data.error || 'Registration failed. Please try again with different credentials.'
        };
      }
    } catch (error) {
      // Enhanced error logging
      console.error('Registration error:', {
        message: error.message,
        type: error.name,
        stack: error.stack
      });
      
      return { 
        success: false, 
        message: 'Registration failed. Please check your network connection and try again.'
      };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 