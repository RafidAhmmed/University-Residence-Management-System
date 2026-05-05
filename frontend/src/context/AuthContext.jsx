import React, { createContext, useState, useEffect } from 'react';
import { authAPI } from '../api/authApi';
import { userAPI } from '../api/userApi';

const AuthContext = createContext();

export { AuthContext };
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    let isMounted = true;

    const hydrateAuthState = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (!storedToken || !storedUser) {
        if (isMounted) {
          setLoading(false);
        }
        return;
      }

      try {
        const parsedUser = JSON.parse(storedUser);
        if (isMounted) {
          setToken(storedToken);
          setUser(parsedUser);
        }

        if (parsedUser?.id) {
          const response = await userAPI.getUser(parsedUser.id);
          if (isMounted) {
            setUser(response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
          }
        }
      } catch (error) {
        console.error('Failed to hydrate stored auth state:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    hydrateAuthState();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const data = response.data;
      let userData = data.user;

      if (userData?.id) {
        try {
          const profileResponse = await userAPI.getUser(userData.id);
          userData = profileResponse.data;
        } catch (profileError) {
          console.error('Failed to hydrate user profile after login:', profileError);
        }
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(userData));
      setToken(data.token);
      setUser(userData);
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      const data = response.data;
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Registration failed');
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
    }
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const isAuthenticated = () => {
    return !!user && !!token;
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const fetchUserProfile = async () => {
    try {
      if (user && user.id) {
        const response = await userAPI.getUser(user.id);
        const fullUserData = response.data;
        setUser(fullUserData);
        localStorage.setItem('user', JSON.stringify(fullUserData));
        return fullUserData;
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      throw error;
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAdmin,
    isAuthenticated,
    updateUser,
    fetchUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
