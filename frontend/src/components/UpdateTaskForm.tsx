import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTasks } from "../context/TaskContext";
import { useAuth } from "../context/AuthContext";
import { updateTask, updateTaskSchema } from "../services/task.service";
import { getUsers } from "../services/auth.service";
import { useEffect, useState } from "react";

type UpdateTaskInput = z.infer<typeof updateTaskSchema>;

interface User {
  _id: string;
  name: string;
}

interface UpdateTaskFormProps {
  task: any;
  onUpdate: () => void;
}

const UpdateTaskForm = ({ task, onUpdate }: UpdateTaskFormProps) => {
  const { fetchTasks } = useTasks();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateTaskInput>({
    resolver: zodResolver(updateTaskSchema),
  });

  useEffect(() => {
    const fetchUsersAndResetForm = async () => {
      try {
        const users = await getUsers();
        setUsers(users);
        reset({
          ...task,
          dueDate: new Date(task.dueDate).toISOString().split("T")[0],
          assignedToId: task.assignedToId._id,
        });
      } catch (error) {
        console.error(error);
      }
    };
    fetchUsersAndResetForm();
  }, [task, reset]);

  const onSubmit = async (data: UpdateTaskInput) => {
    try {
      await updateTask({ id: task._id, ...data });
      await fetchTasks();

      // Show alert message when task is assigned to someone (only if assignment changed)
      if (task.assignedToId._id !== data.assignedToId) {
        const assignedUser = users.find(user => user._id === data.assignedToId);
        if (assignedUser) {
          // If current user is the one being assigned, show a personalized message
          if (currentUser && currentUser._id === data.assignedToId) {
            alert(`You have been assigned a new task: "${data.title || task.title}"`);
          } else {
            alert(`Task successfully assigned to ${assignedUser.name}!`);
          }
        }
      }

      onUpdate();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h2 className="text-2xl font-bold">Update Task</h2>
      <div>
        <label>Title</label>
        <input {...register("title")} className="w-full p-2 border rounded" />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}
      </div>
      <div>
        <label>Description</label>
        <textarea
          {...register("description")}
          className="w-full p-2 border rounded"
        ></textarea>
        {errors.description && (
          <p className="text-red-500">{errors.description.message}</p>
        )}
      </div>
      <div>
        <label>Due Date</label>
        <input
          type="date"
          {...register("dueDate")}
          className="w-full p-2 border rounded"
        />
        {errors.dueDate && (
          <p className="text-red-500">{errors.dueDate.message}</p>
        )}
      </div>
      <div>
        <label>Priority</label>
        <select {...register("priority")} className="w-full p-2 border rounded">
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Urgent">Urgent</option>
        </select>
      </div>
      <div>
        <label>Status</label>
        <select {...register("status")} className="w-full p-2 border rounded">
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Review">Review</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
      <div>
        <label>Assign To</label>
        <select
          {...register("assignedToId")}
          className="w-full p-2 border rounded"
        >
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="w-full p-2 text-white bg-blue-600 rounded"
      >
        Update
      </button>
    </form>
  );
};

export default UpdateTaskForm;
