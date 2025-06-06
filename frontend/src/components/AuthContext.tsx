import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { adminLogin, adminLogout, checkAdminAuth, AdminLoginCredentials, AdminUser, AdminAuthResponse } from '../lib/api';

interface AuthContextType {
  currentUser: AdminUser | null;
  isLoading: boolean;
  login: (credentials: AdminLoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start true for initial auth check
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyAuth = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response: AdminAuthResponse = await checkAdminAuth();
        if (response.is_authenticated && response.user) {
          setCurrentUser(response.user);
        }
      } catch (err) {
        // This catch is for network errors or unexpected issues with checkAdminAuth itself
        // Normal 'not authenticated' (401) is handled within checkAdminAuth
        console.error("Auth check failed:", err);
        // setError('Failed to verify authentication status.'); // Optional: set an error for display
      } finally {
        setIsLoading(false);
      }
    };
    verifyAuth();
  }, []);

  const login = async (credentials: AdminLoginCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const { user } = await adminLogin(credentials);
      setCurrentUser(user);
    } catch (err: any) {
      console.error("Login failed:", err);
      setError(err.message || 'Login failed. Please check your credentials.');
      throw err; // Re-throw to allow login page to handle it
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await adminLogout();
      setCurrentUser(null);
    } catch (err: any) {
      console.error("Logout failed:", err);
      setError(err.message || 'Logout failed.');
      // Even if server logout fails, clear client state
      setCurrentUser(null); 
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, isLoading, login, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
