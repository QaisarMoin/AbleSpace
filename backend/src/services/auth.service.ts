import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import { createUserSchema, loginUserSchema, updateUserSchema } from '../dto/user.dto';
import { z } from 'zod';

type CreateUserInput = z.infer<typeof createUserSchema>;
type LoginUserInput = z.infer<typeof loginUserSchema>;
type UpdateUserInput = z.infer<typeof updateUserSchema>;

export const registerUser = async (userData: CreateUserInput) => {
  const { name, email, password } = userData;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    name,
    email,
    password: hashedPassword,
  });

  await user.save();

  return user;
};

export const loginUser = async (userData: LoginUserInput) => {
  const { email, password } = userData;

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
    expiresIn: '1h',
  });

  return { user, token };
};

export const updateUser = async (userId: string, userData: UpdateUserInput) => {
  const user = await User.findByIdAndUpdate(userId, userData, { new: true }).select('-password');
  if (!user) {
    throw new Error('User not found');
  }
  return user;
}
