import { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { getTasks, createTaskSchema, updateTaskSchema } from '../services/task.service';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import { io, Socket } from 'socket.io-client';

interface Task {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'To Do' | 'In Progress' | 'Review' | 'Completed';
  creatorId: {
    _id: string;
    name: string;
    email: string;
  };
  assignedToId: {
    _id: string;
    name: string;
    email: string;
  };
}

type CreateTaskInput = z.infer<typeof createTaskSchema>;
type UpdateTaskInput = z.infer<typeof updateTaskSchema>;

interface TaskContextType {
  tasks: Task[];
  isLoading: boolean;
  fetchTasks: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const tasks = await getTasks();
      setTasks(tasks);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      const newSocket = io('http://localhost:4000');
      setSocket(newSocket);

      newSocket.emit('registerUser', user._id);

      newSocket.on('task:created', () => fetchTasks());
      newSocket.on('task:updated', () => fetchTasks());
      newSocket.on('task:deleted', () => fetchTasks());

      newSocket.on('notification', (message: string) => {
        alert(message);
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        isLoading,
        fetchTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
