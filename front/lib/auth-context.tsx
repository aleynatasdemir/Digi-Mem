'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

interface User {
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = apiClient.getToken();
    if (token) {
      // TODO: Validate token with backend
      // For now, just assume valid if token exists
      setUser({ email: 'user@example.com' }); // You'd get this from JWT decode or API call
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await apiClient.login(email, password);
    
    if (response.data) {
      apiClient.saveToken(response.data.token);
      setUser({ email: response.data.email });
      return { success: true };
    }
    
    return { success: false, error: response.error };
  };

  const register = async (email: string, password: string) => {
    const response = await apiClient.register(email, password);
    
    if (response.data) {
      apiClient.saveToken(response.data.token);
      setUser({ email: response.data.email });
      return { success: true };
    }
    
    return { success: false, error: response.error };
  };

  const logout = () => {
    apiClient.removeToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
