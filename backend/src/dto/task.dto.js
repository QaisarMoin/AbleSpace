const z = require('zod');

const createTaskSchema = z.object({
  title: z.string().max(100),
  description: z.string(),
  dueDate: z.string().transform((str) => new Date(str)),
  priority: z.enum(['Low', 'Medium', 'High', 'Urgent']),
  assignedToId: z.string(),
});

const updateTaskSchema = z.object({
  title: z.string().max(100).optional(),
  description: z.string().optional(),
  dueDate: z.string().transform((str) => new Date(str)).optional(),
  priority: z.enum(['Low', 'Medium', 'High', 'Urgent']).optional(),
  status: z.enum(['To Do', 'In Progress', 'Review', 'Completed']).optional(),
  assignedToId: z.string().optional(),
});

module.exports = {
  createTaskSchema,
  updateTaskSchema
};
