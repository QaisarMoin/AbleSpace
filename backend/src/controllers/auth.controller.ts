import { Response } from 'express';
import { registerUser, loginUser, updateUser } from '../services/auth.service';
import { createUserSchema, loginUserSchema, updateUserSchema } from '../dto/user.dto';
import { AuthRequest } from '../middleware/auth.middleware';
import { User } from '../models/user.model';

export const register = async (req: AuthRequest, res: Response) => {
  try {
    const validatedData = createUserSchema.parse(req.body);
    const user = await registerUser(validatedData);
    res.status(201).json({ message: 'User created successfully', user });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req: AuthRequest, res: Response) => {
  try {
    const validatedData = loginUserSchema.parse(req.body);
    const { user, token } = await loginUser(validatedData);
    res.cookie('token', token, { httpOnly: true });
    res.status(200).json({ message: 'Logged in successfully', user });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const logout = (req: AuthRequest, res: Response) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = await User.find().select('name email');
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const validatedData = updateUserSchema.parse(req.body);
    const user = await updateUser(req.userId!, validatedData);
    res.json(user);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}
