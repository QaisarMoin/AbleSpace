import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";
import { getTasks } from "../services/task.service";
import { useAuth } from "../context/AuthContext";
import { io } from "socket.io-client";

interface Task {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
  status: "To Do" | "In Progress" | "Review" | "Completed";
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
      const token = localStorage.getItem("token");
      const socket = io("https://ablespace-xyiu.onrender.com", {
        auth: {
          userId: user._id,
          token,
        },
      });

      socket.emit("registerUser", user._id);

      socket.on("task:created", () => fetchTasks());
      socket.on("task:updated", () => fetchTasks());
      socket.on("task:deleted", () => fetchTasks());

      socket.on("notification", (message: string) => {
        alert(message);
      });

      return () => {
        socket.disconnect();
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
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
};
