import { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { getProfile, loginUser, logoutUser, registerUser, updateProfile as apiUpdateProfile, loginSchema, registerSchema, updateProfileSchema } from '../services/auth.service';
import { z } from 'zod';

interface User {
  _id: string;
  name: string;
  email: string;
}

type LoginInput = z.infer<typeof loginSchema>;
type RegisterInput = z.infer<typeof registerSchema>;
type UpdateProfileInput = z.infer<typeof updateProfileSchema>;


interface AuthContextType {
  user: User | null;
  login: (data: LoginInput) => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: UpdateProfileInput) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        const user = await getProfile();
        setUser(user);
      } catch (error) {
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkUser();
  }, []);

  const login = async (data: LoginInput) => {
    try {
      const response = await loginUser(data);
      console.log('Login response:', response);

      // Check if response has token directly or in data property
      const token = response.token || response.data?.token;
      const user = response.user || response.data?.user;

      if (user && token) {
        console.log('Storing token:', token);
        localStorage.setItem('token', token);
        setUser(user);
      } else {
        console.error('No token or user found in response');
        throw new Error('Invalid login response');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (data: RegisterInput) => {
    const { user } = await registerUser(data);
    setUser(user);
  };

  const logout = async () => {
    await logoutUser();
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateProfile = async (data: UpdateProfileInput) => {
    const user = await apiUpdateProfile(data);
    setUser(user);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, isLoading }}>
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
