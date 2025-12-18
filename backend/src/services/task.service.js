const { Task } = require('../models/task.model');

const createTask = async (data, creatorId) => {
  const task = new Task({ ...data, creatorId });
  await task.save();
  return await task.populate('creatorId assignedToId', 'name email');
};

const getTasks = async (userId) => {
  return await Task.find({
    $or: [{ creatorId: userId }, { assignedToId: userId }],
  }).populate('creatorId assignedToId', 'name email');
};

const getTaskById = async (id) => {
  return await Task.findById(id).populate('creatorId assignedToId', 'name email');
};

const updateTask = async (id, data, userId) => {
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
  return await task.populate('creatorId assignedToId', 'name email');
};

const deleteTask = async (id, userId) => {
  const task = await Task.findById(id);

  if (!task) {
    throw new Error('Task not found');
  }

  if (task.creatorId.toString() !== userId) {
    throw new Error('Only the task creator can delete the task');
  }

  return await Task.findByIdAndDelete(id);
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask
};
