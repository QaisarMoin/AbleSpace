import { useEffect } from "react";
import { io } from "socket.io-client";
import { useQueryClient } from "react-query";
import { useAuth } from "../context/AuthContext";

const token = localStorage.getItem("token");
const socket = io("https://ablespace-xyiu.onrender.com", {
  auth: {
    token,
  },
});

export const useSocket = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      socket.emit("registerUser", user._id);
    }

    socket.on("task:created", (newTask) => {
      queryClient.setQueryData("tasks", (oldTasks: any) => [
        ...oldTasks,
        newTask,
      ]);
    });

    socket.on("task:updated", (updatedTask) => {
      queryClient.setQueryData("tasks", (oldTasks: any) =>
        oldTasks.map((task: any) =>
          task._id === updatedTask._id ? updatedTask : task
        )
      );
    });

    socket.on("task:deleted", ({ id }) => {
      queryClient.setQueryData("tasks", (oldTasks: any) =>
        oldTasks.filter((task: any) => task._id !== id)
      );
    });

    socket.on("notification", (message) => {
      alert(message);
    });

    return () => {
      socket.off("task:created");
      socket.off("task:updated");
      socket.off("task:deleted");
      socket.off("notification");
    };
  }, [queryClient, user]);
};
