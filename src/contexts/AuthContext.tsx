import React, { createContext, useContext, useEffect, useState } from 'react';
import { api, User } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Check if user is already logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const userData = await api.getProfile();
          setUser(userData);
        } catch (error) {
          console.error('Failed to get user profile:', error);
          localStorage.removeItem('authToken');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { user: userData, token } = await api.signIn(email, password);
      localStorage.setItem('authToken', token);
      setUser(userData);
      
      toast({
        title: "Success!",
        description: "You have been signed in successfully.",
      });
    } catch (error) {
      console.error('Login error:', error);
      
      let errorMessage = "Invalid credentials. Please try again.";
      
      if (error instanceof Error) {
        if (error.message.includes('Unable to connect to server')) {
          errorMessage = "Server is not responding. Please check if the backend is running.";
        } else if (error.message.includes('Invalid credentials')) {
          errorMessage = "Invalid email or password. Please try again.";
        } else if (error.message.includes('User with this email already exists')) {
          errorMessage = "An account with this email already exists.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 