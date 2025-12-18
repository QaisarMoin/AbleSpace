import { Response } from 'express';
import * as taskService from '../services/task.service';
import { createTaskSchema, updateTaskSchema } from '../dto/task.dto';
import { AuthRequest } from '../middleware/auth.middleware';

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const validatedData = createTaskSchema.parse(req.body);
    const task = await taskService.createTask(validatedData, req.userId!);
    req.io.emit('task:created', { task, userId: req.userId });

    // Get assigned user details for notification
    const assignedUser = task.assignedToId as any;

    // Send notification to the assigned user
    const assignedToSocketId = req.userSockets.get(task.assignedToId.toString());
    if (assignedToSocketId) {
      req.io.to(assignedToSocketId).emit('notification', `You have been assigned a new task: ${task.title}`);
    }

    // Also send notification to the creator
    const creatorSocketId = req.userSockets.get(req.userId!);
    if (creatorSocketId) {
      req.io.to(creatorSocketId).emit('notification', `Task "${task.title}" has been successfully assigned to ${assignedUser.name}`);
    }

    res.status(201).json(task);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const tasks = await taskService.getTasks(req.userId!);
    res.json(tasks);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getTask = async (req: AuthRequest, res: Response) => {
  try {
    const task = await taskService.getTaskById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const validatedData = updateTaskSchema.parse(req.body);
    const task = await taskService.updateTask(req.params.id, validatedData, req.userId!);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    req.io.emit('task:updated', { task, userId: req.userId });

    if (validatedData.assignedToId) {
      // Get assigned user details for notification
      const assignedUser = task.assignedToId as any;

      // Send notification to the assigned user
      const assignedToSocketId = req.userSockets.get(validatedData.assignedToId);
      if (assignedToSocketId) {
        req.io.to(assignedToSocketId).emit('notification', `A task has been assigned to you: ${task.title}`);
      }

      // Also send notification to the creator/updater
      const creatorSocketId = req.userSockets.get(req.userId!);
      if (creatorSocketId) {
        req.io.to(creatorSocketId).emit('notification', `Task "${task.title}" has been successfully assigned to ${assignedUser.name}`);
      }
    }

    res.json(task);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const task = await taskService.deleteTask(req.params.id, req.userId!);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    req.io.emit('task:deleted', { id: req.params.id, userId: req.userId });
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ message: 'Server error' });
  }
};
