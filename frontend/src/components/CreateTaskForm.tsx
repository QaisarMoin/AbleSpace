import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import { createTask, createTaskSchema } from '../services/task.service';
import { getUsers } from '../services/auth.service';
import { useEffect, useState } from 'react';

type CreateTaskInput = z.infer<typeof createTaskSchema>;

interface User {
  _id: string;
  name: string;
}

interface CreateTaskFormProps {
  onClose: () => void;
}

const CreateTaskForm = ({ onClose }: CreateTaskFormProps) => {
  const { fetchTasks } = useTasks();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskSchema),
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getUsers();
        setUsers(users);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUsers();
  }, []);

  const onSubmit = async (data: CreateTaskInput) => {
    try {
      await createTask(data);
      await fetchTasks();

      // Show alert message when task is created and assigned
      const assignedUser = users.find(user => user._id === data.assignedToId);
      if (assignedUser) {
        // If current user is the one being assigned, show a personalized message
        if (currentUser && currentUser._id === data.assignedToId) {
          alert(`You have been assigned a new task: "${data.title}"`);
        } else {
          alert(`Task successfully created and assigned to ${assignedUser.name}!`);
        }
      }

      reset();
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h2 className="text-2xl font-bold">Create Task</h2>
      <div>
        <label>Title</label>
        <input {...register('title')} className="w-full p-2 border rounded" />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}
      </div>
      <div>
        <label>Description</label>
        <textarea
          {...register('description')}
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
          {...register('dueDate')}
          className="w-full p-2 border rounded"
        />
        {errors.dueDate && (
          <p className="text-red-500">{errors.dueDate.message}</p>
        )}
      </div>
      <div>
        <label>Priority</label>
        <select {...register('priority')} className="w-full p-2 border rounded">
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Urgent">Urgent</option>
        </select>
      </div>
      <div>
        <label>Assign To</label>
        <select
          {...register('assignedToId')}
          className="w-full p-2 border rounded"
        >
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" className="w-full p-2 text-white bg-blue-600 rounded">
        Create
      </button>
    </form>
  );
};

export default CreateTaskForm;