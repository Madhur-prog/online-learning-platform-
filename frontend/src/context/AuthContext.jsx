import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('learnsphere_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('learnsphere_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success && res.data.user) {
            setUser(res.data.user);
            localStorage.setItem('learnsphere_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.error('[AuthContext] Session expired or invalid');
          logout();
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      const { token: newToken, user: newUser } = res.data;
      setToken(newToken);
      setUser(newUser);
      localStorage.setItem('learnsphere_token', newToken);
      localStorage.setItem('learnsphere_user', JSON.stringify(newUser));
      return newUser;
    }
    throw new Error(res.data.message || 'Login failed');
  };

  const register = async (name, email, password, role) => {
    const res = await api.post('/auth/register', { name, email, password, role });
    if (res.data.success) {
      const { token: newToken, user: newUser } = res.data;
      setToken(newToken);
      setUser(newUser);
      localStorage.setItem('learnsphere_token', newToken);
      localStorage.setItem('learnsphere_user', JSON.stringify(newUser));
      return newUser;
    }
    throw new Error(res.data.message || 'Registration failed');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('learnsphere_token');
    localStorage.removeItem('learnsphere_user');
  };

  const updateProfileState = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('learnsphere_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        isInstructor: user?.role === 'instructor',
        isStudent: user?.role === 'student',
        login,
        register,
        logout,
        updateProfileState
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
