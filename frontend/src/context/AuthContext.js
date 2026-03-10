import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { userAPI } from '../services/ApiService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      // Try backend login first
      try {
        const response = await userAPI.login({ username, password });
        if (response.data && response.data.success) {
          const userData = {
            id: response.data.userId,
            username: response.data.username,
            role: response.data.userRole,
            email: `${username}@parentcare.com`,
          };
          
          const token = response.data.sessionId;
          
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(userData));
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          setUser(userData);
          
          // Navigate to new comprehensive dashboard
          navigate('/dashboard');
          
          return { 
            success: true, 
            user: userData,
            sessionId: token
          };
        }
      } catch (backendError) {
        console.log('Backend login failed, using mock:', backendError);
      }
      
      // Fallback to mock login
      const mockUser = {
        id: 1,
        username: username,
        role: username.includes('parent') ? 'PARENT' : 
              username.includes('admin') ? 'ADMIN' : 'GUARDIAN',
        email: `${username}@parentcare.com`,
      };
      
      const mockToken = 'mock-jwt-token-' + Date.now();
      
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      axios.defaults.headers.common['Authorization'] = `Bearer ${mockToken}`;
      
      setUser(mockUser);
      
      // Navigate to comprehensive dashboard
      navigate('/dashboard');
      
      return { 
        success: true,
        user: mockUser,
        sessionId: mockToken
      };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      // Call backend API to create user in Supabase
      const newUser = {
        username: userData.username,
        password: userData.password,
        email: userData.email,
        phoneNumber: userData.phone || null,
        role: userData.role,
        age: userData.age ? parseInt(userData.age) : null,
        active: true,
      };
      
      // Create user in backend (saves to Supabase)
      const response = await userAPI.create(newUser);
      
      if (response.data) {
        // After successful registration, log the user in
        const loginResult = await login(userData.username, userData.password);
        return loginResult;
      }
      
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      
      // Check if username already exists
      if (error.response?.status === 409 || error.response?.data?.message?.includes('already exists')) {
        return { success: false, error: 'Username already exists. Please choose a different username.' };
      }
      
      return { success: false, error: error.response?.data?.message || error.message || 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
