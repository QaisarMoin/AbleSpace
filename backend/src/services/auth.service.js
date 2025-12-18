const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models/user.model');

const registerUser = async (userData) => {
  const { name, email, password } = userData;
  console.log('Register attempt for email:', email);
  console.log('Password provided:', !!password);

  const existingUser = await User.findOne({ email });
  console.log('Existing user found:', !!existingUser);
  if (existingUser) {
    throw new Error('User already exists');
  }

  console.log('Original password:', password);
  console.log('Original password length:', password.length);

  const user = new User({
    name,
    email,
    password,
  });

  await user.save();

  // Generate token for the newly registered user
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  return { user, token };
};

const loginUser = async (userData) => {
  const { email, password } = userData;
  console.log('Login attempt for email:', email);
  console.log('Password provided:', !!password);

  const user = await User.findOne({ email });
  console.log('User found:', !!user);
  if (!user) {
    console.log('No user found with email:', email);
    throw new Error('Invalid credentials');
  }
  console.log('User ID:', user._id);
  console.log('User email:', user.email);

  console.log('User has password:', !!user.password);
  console.log('Input password length:', password.length);
  console.log('Stored password length:', user.password.length);
  console.log('Comparing passwords...');
  console.log('Input password:', password);
  console.log('Stored password hash:', user.password);
  
  // Test with fresh hash
  const freshHash = await bcrypt.hash(password, 10);
  console.log('Fresh hash test:', await bcrypt.compare(password, freshHash));
  
  const isMatch = await bcrypt.compare(password, user.password);
  console.log('Password match:', isMatch);
  if (!isMatch) {
    console.log('Password comparison failed');
  }
  if (!isMatch) {
    console.log('Password mismatch for user:', email);
    throw new Error('Invalid credentials');
  }

  console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
  console.log('JWT_SECRET value:', process.env.JWT_SECRET);

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  console.log('User ID for token:', user._id);
  console.log('Generated token:', token);
  console.log('Generated token length:', token.length);

  return { user, token };
};

const updateUser = async (userId, userData) => {
  const user = await User.findByIdAndUpdate(userId, userData, { new: true }).select('-password');
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

module.exports = {
  registerUser,
  loginUser,
  updateUser
};
