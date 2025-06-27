// context/AuthContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { validateApiKey } from '../services/aiService';

interface AuthContextType {
  isAuthenticated: boolean;
  apikey: (token: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('aiToken');
  });

  const apikey = async (token: string) => {
    const isValid = await validateApiKey(token);
    if (!isValid) {
      throw new Error('Invalid token');
    }
    localStorage.setItem('aiToken', token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('aiToken');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, apikey, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};