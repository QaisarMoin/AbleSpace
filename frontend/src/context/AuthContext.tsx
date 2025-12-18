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
    const token = localStorage.getItem('token');
    if (token) {
      setUser(JSON.parse(localStorage.getItem('user') || 'null'));
    }
    setIsLoading(false);
  }, []);

  const login = async (data: LoginInput) => {
    console.log('AuthContext login data:', data);
    try {
      const response = await loginUser(data);
      console.log('Login response:', response);
      console.log('Response structure:', JSON.stringify(response, null, 2));

      // Handle both direct response and axios wrapped response
      const responseData = response.data || response;
      const { user, token } = responseData;

      if (user && token) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
      } else {
        console.error('No user or token found in response');
        console.error('Response data:', responseData);
        throw new Error('Invalid login response');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
      throw error;
    }
  };

  const register = async (data: RegisterInput) => {
    try {
      const response = await registerUser(data);
      console.log('Full axios response:', response);
      console.log('Response data:', response.data);
      console.log('Response structure:', JSON.stringify(response, null, 2));

      // Get the actual response data
      const responseData = response.data;
      console.log('Parsed response data:', responseData);

      const user = responseData.user;

      console.log('Extracted user:', user);

      if (user) {
        setUser(user);
      } else {
        console.error('No user found in response');
        console.error('Response data:', responseData);
        throw new Error('Invalid register response');
      }
    } catch (error) {
      console.error('Register error:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
      throw error;
    }
  };

  const logout = async () => {
    await logoutUser();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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
