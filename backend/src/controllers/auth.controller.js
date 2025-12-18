const { registerUser, loginUser, updateUser } = require('../services/auth.service');
const { createUserSchema, loginUserSchema, updateUserSchema } = require('../dto/user.dto');
const { User } = require('../models/user.model');

const register = async (req, res) => {
  try {
    const validatedData = createUserSchema.parse(req.body);
    const user = await registerUser(validatedData);
    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const validatedData = loginUserSchema.parse(req.body);
    const { user, token } = await loginUser(validatedData);
    console.log('Generated token for user:', user._id);
    console.log('Token value:', token);

    res.cookie('token', token, { 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none'
    });

    console.log('Cookie set with token');

    // Create response object
    const responseObj = {
      success: true,
      message: 'Logged in successfully', 
      user,
      token
    };

    console.log('Response object:', responseObj);
    console.log('Response object stringified:', JSON.stringify(responseObj));

    res.status(200).json(responseObj);
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({ 
      success: false,
      message: error.message 
    });
  }
};

const logout = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('name email');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const validatedData = updateUserSchema.parse(req.body);
    const user = await updateUser(req.userId, validatedData);
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  logout,
  getProfile,
  getUsers,
  updateProfile
};
