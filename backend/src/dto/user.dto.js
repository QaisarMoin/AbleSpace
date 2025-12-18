const z = require('zod');

const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

const loginUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

const updateUserSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
});

module.exports = {
  createUserSchema,
  loginUserSchema,
  updateUserSchema
};
