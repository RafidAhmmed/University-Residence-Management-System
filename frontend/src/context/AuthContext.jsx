import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const initAuth = async () => {
      // Mock authentication - always logged in as admin
      const mockUser = {
        id: 1,
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin'
      };
      setUser(mockUser);
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    // Mock login - always successful
    const mockUser = {
      id: 1,
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin'
    };
    const mockToken = 'mock-jwt-token';
    
    localStorage.setItem('token', mockToken);
    setToken(mockToken);
    setUser(mockUser);
    
    return { data: { user: mockUser, token: mockToken } };
  };

  const logout = async () => {
    // Mock logout
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const isAuthenticated = () => {
    return !!user && !!token;
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAdmin,
    isAuthenticated,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
