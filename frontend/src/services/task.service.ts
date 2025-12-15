import api from './api';
import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  priority: z.enum(['Low', 'Medium', 'High', 'Urgent']),
  assignedToId: z.string().min(1, 'Assigned to is required'),
});

export const updateTaskSchema = createTaskSchema.partial().extend({
  status: z.enum(['To Do', 'In Progress', 'Review', 'Completed']).optional(),
});

type CreateTaskInput = z.infer<typeof createTaskSchema>;
type UpdateTaskInput = z.infer<typeof updateTaskSchema>;

export const getTasks = async () => {
  const { data } = await api.get('/tasks');
  return data;
};

export const createTask = async (task: CreateTaskInput) => {
  const { data } = await api.post('/tasks', task);
  return data;
};

export const updateTask = async ({ id, ...task }: { id: string } & UpdateTaskInput) => {
  const { data } = await api.put(`/tasks/${id}`, task);
  return data;
};

export const deleteTask = async (id: string) => {
  await api.delete(`/tasks/${id}`);
};
