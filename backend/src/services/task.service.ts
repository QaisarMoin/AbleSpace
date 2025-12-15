import { Task } from '../models/task.model';
import { createTaskSchema, updateTaskSchema } from '../dto/task.dto';
import { z } from 'zod';
import { AuthRequest } from '../middleware/auth.middleware';

type CreateTaskInput = z.infer<typeof createTaskSchema>;
type UpdateTaskInput = z.infer<typeof updateTaskSchema>;

export const createTask = async (data: CreateTaskInput, creatorId: string) => {
  const task = new Task({ ...data, creatorId });
  await task.save();
  return task;
};

export const getTasks = async (userId: string) => {
  return await Task.find({
    $or: [{ creatorId: userId }, { assignedToId: userId }],
  }).populate('creatorId assignedToId', 'name email');
};

export const getTaskById = async (id: string) => {
  return await Task.findById(id).populate('creatorId assignedToId', 'name email');
};

export const updateTask = async (id: string, data: UpdateTaskInput, userId: string) => {
  const task = await Task.findById(id);

  if (!task) {
    throw new Error('Task not found');
  }

  const isCreator = task.creatorId.toString() === userId;
  const isAssignee = task.assignedToId.toString() === userId;

  if (!isCreator && !isAssignee) {
    throw new Error('You are not authorized to update this task');
  }

  if (isAssignee && !isCreator) {
    if (Object.keys(data).length > 1 || !data.status) {
      throw new Error('You can only update the status of this task');
    }
    task.status = data.status;
  } else { // Is the creator
    Object.assign(task, data);
  }

  await task.save();
  return task;
};

export const deleteTask = async (id: string, userId: string) => {
  const task = await Task.findById(id);

  if (!task) {
    throw new Error('Task not found');
  }

  if (task.creatorId.toString() !== userId) {
    throw new Error('Only the task creator can delete the task');
  }

  return await Task.findByIdAndDelete(id);
};
