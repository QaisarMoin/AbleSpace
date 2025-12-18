import api from './api';
import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const updateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
});

type RegisterInput = z.infer<typeof registerSchema>;
type LoginInput = z.infer<typeof loginSchema>;
type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const registerUser = async (data: RegisterInput) => {
  try {
    const response = await api.post('/auth/register', data);
    console.log('Register API response:', response);
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    console.log('Response data:', response.data);
    return response; // Return the full response instead of just response.data
  } catch (error: any) {
    console.error('Register service error:', error);
    if (error.response) {
      console.error('Error response data:', error.response.data);
    }
    throw error;
  }
};

export const loginUser = async (data: LoginInput) => {
  console.log('Login service data:', data);
  try {
    const response = await api.post('/auth/login', data);
    console.log('Login API response:', response);
    console.log('Response data:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Login service error:', error);
    if (error.response) {
      console.error('Error response data:', error.response.data);
    }
    throw error;
  }
};

export const logoutUser = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
}

export const getProfile = async () => {
  const response = await api.get('/auth/profile');
  return response.data;
}

export const updateProfile = async (data: UpdateProfileInput) => {
  const response = await api.put('/auth/profile', data);
  return response.data;
}

export const getUsers = async () => {
  const { data } = await api.get('/auth/users');
  return data;
};
