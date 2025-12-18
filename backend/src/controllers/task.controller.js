const taskService = require('../services/task.service');
const { createTaskSchema, updateTaskSchema } = require('../dto/task.dto');

const createTask = async (req, res) => {
  try {
    const validatedData = createTaskSchema.parse(req.body);
    const task = await taskService.createTask(validatedData, req.userId);
    req.io.emit('task:created', { task, userId: req.userId });

    // Get assigned user details for notification
    const assignedUser = task.assignedToId;

    // Send notification to the assigned user
    const assignedToSocketId = req.userSockets.get(task.assignedToId.toString());
    if (assignedToSocketId) {
      req.io.to(assignedToSocketId).emit('notification', `You have been assigned a new task: ${task.title}`);
    }

    // Also send notification to the creator
    const creatorSocketId = req.userSockets.get(req.userId);
    if (creatorSocketId) {
      req.io.to(creatorSocketId).emit('notification', `Task "${task.title}" has been successfully assigned to ${assignedUser.name}`);
    }

    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getTasks = async (req, res) => {
  try {
    const tasks = await taskService.getTasks(req.userId);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getTask = async (req, res) => {
  try {
    const task = await taskService.getTaskById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateTask = async (req, res) => {
  try {
    const validatedData = updateTaskSchema.parse(req.body);
    const task = await taskService.updateTask(req.params.id, validatedData, req.userId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    req.io.emit('task:updated', { task, userId: req.userId });

    if (validatedData.assignedToId) {
      // Get assigned user details for notification
      const assignedUser = task.assignedToId;

      // Send notification to the assigned user
      const assignedToSocketId = req.userSockets.get(validatedData.assignedToId);
      if (assignedToSocketId) {
        req.io.to(assignedToSocketId).emit('notification', `A task has been assigned to you: ${task.title}`);
      }

      // Also send notification to the creator/updater
      const creatorSocketId = req.userSockets.get(req.userId);
      if (creatorSocketId) {
        req.io.to(creatorSocketId).emit('notification', `Task "${task.title}" has been successfully assigned to ${assignedUser.name}`);
      }
    }

    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await taskService.deleteTask(req.params.id, req.userId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    req.io.emit('task:deleted', { id: req.params.id, userId: req.userId });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask
};
