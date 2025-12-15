import { updateTask } from './task.service';
import { Task } from '../models/task.model';

jest.mock('../models/task.model');

const mockedTask = Task as jest.Mocked<typeof Task>;

describe('Task Service - updateTask', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should allow the creator to update any field', async () => {
    const mockTaskInstance = {
      _id: 'task1',
      title: 'Original Title',
      creatorId: 'user1',
      assignedToId: 'user2',
      save: jest.fn().mockResolvedValue(true),
    };
    mockedTask.findById.mockResolvedValue(mockTaskInstance as any);

    const updateData = { title: 'New Title' };
    const userId = 'user1'; // The creator

    await updateTask('task1', updateData, userId);

    expect(mockTaskInstance.save).toHaveBeenCalled();
    expect(mockTaskInstance.title).toBe('New Title');
  });

  it('should allow the assignee to only update the status', async () => {
    const mockTaskInstance = {
      _id: 'task1',
      status: 'To Do',
      creatorId: 'user1',
      assignedToId: 'user2',
      save: jest.fn().mockResolvedValue(true),
    };
    mockedTask.findById.mockResolvedValue(mockTaskInstance as any);

    const updateData = { status: 'In Progress' } as const;
    const userId = 'user2'; // The assignee

    await updateTask('task1', updateData, userId);

    expect(mockTaskInstance.save).toHaveBeenCalled();
    expect(mockTaskInstance.status).toBe('In Progress');
  });

  it('should throw an error if an assignee tries to update a field other than status', async () => {
    const mockTaskInstance = {
      _id: 'task1',
      title: 'Original Title',
      creatorId: 'user1',
      assignedToId: 'user2',
      save: jest.fn(),
    };
    mockedTask.findById.mockResolvedValue(mockTaskInstance as any);

    const updateData = { title: 'New Title' };
    const userId = 'user2'; // The assignee

    await expect(updateTask('task1', updateData, userId)).rejects.toThrow(
      'You can only update the status of this task'
    );
    expect(mockTaskInstance.save).not.toHaveBeenCalled();
  });
});
