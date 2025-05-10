import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "@/types";
import api from "@/services/api";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCurrentUser();
    setIsLoading(false);
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = localStorage.getItem('user');
      setUser(response ? JSON.parse(response) : null);
    } catch (err) {
      console.error('Failed to fetch user data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/auth/login', { email, password });
      const {id,...savedUser} = response.data.user;
      localStorage.setItem('user', JSON.stringify(savedUser));
      setUser(savedUser);
    } catch (err) {

      setError(err.response?.data?.error || 'Failed to login');
      throw new Error(err.response?.data?.error || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Call logout endpoint to clear the cookie on the server
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Set user to null regardless of API call success
      setUser(null);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/auth/register', { 
        email, 
        password, 
        name 
      });
      const {id,...savedUser} = response.data.user;
      localStorage.setItem('user', JSON.stringify(savedUser));
      setUser(savedUser);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to register');
      throw new Error(err.response?.data?.error || 'Failed to register');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, error, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};