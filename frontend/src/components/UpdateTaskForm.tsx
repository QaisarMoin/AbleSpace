import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { updateTask, updateTaskSchema } from '../services/task.service';
import { getUsers } from '../services/auth.service';
import { z } from 'zod';

type UpdateTaskFormValues = z.infer<typeof updateTaskSchema>;

interface UpdateTaskFormProps {
  onClose: () => void;
  task: any;
  user: any;
}

const UpdateTaskForm = ({ onClose, task, user }: UpdateTaskFormProps) => {
  const queryClient = useQueryClient();
  const { data: users } = useQuery('users', getUsers);
  const isCreator = task.creatorId._id === user._id;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateTaskFormValues>({
    resolver: zodResolver(updateTaskSchema),
    defaultValues: {
      ...task,
      dueDate: task.dueDate.split('T')[0],
      assignedToId: task.assignedToId._id,
    },
  });

  const mutation = useMutation(updateTask, {
    onSuccess: () => {
      queryClient.invalidateQueries('tasks');
      onClose();
    },
    onError: (error: any) => {
      console.error('Failed to update task:', error.response.data.message);
    },
  });

  const onSubmit = (data: UpdateTaskFormValues) => {
    if (isCreator) {
      mutation.mutate({ id: task._id, ...data });
    } else {
      mutation.mutate({ id: task._id, status: data.status });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold mb-5">Update Task</h2>
      <input {...register('title')} placeholder="Title" className="p-2 border rounded" disabled={!isCreator} />
      {errors.title && <p className="text-red-500">{errors.title.message}</p>}

      <textarea {...register('description')} placeholder="Description" className="p-2 border rounded" disabled={!isCreator} />
      {errors.description && <p className="text-red-500">{errors.description.message}</p>}

      <input type="date" {...register('dueDate')} className="p-2 border rounded" disabled={!isCreator} />
      {errors.dueDate && <p className="text-red-500">{errors.dueDate.message}</p>}

      <select {...register('priority')} className="p-2 border rounded" disabled={!isCreator}>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
        <option value="Urgent">Urgent</option>
      </select>
      {errors.priority && <p className="text-red-500">{errors.priority.message}</p>}

      <select {...register('status')} className="p-2 border rounded">
        <option value="To Do">To Do</option>
        <option value="In Progress">In Progress</option>
        <option value="Review">Review</option>
        <option value="Completed">Completed</option>
      </select>
      {errors.status && <p className="text-red-500">{errors.status.message}</p>}

      <select {...register('assignedToId')} className="p-2 border rounded" disabled={!isCreator}>
        <option value="">Assign to...</option>
        {users?.map((user: any) => (
          <option key={user._id} value={user._id}>{user.name}</option>
        ))}
      </select>
      {errors.assignedToId && <p className="text-red-500">{errors.assignedToId.message}</p>}

      <button type="submit" disabled={mutation.isLoading} className="p-2 bg-blue-500 text-white rounded disabled:bg-gray-400">
        {mutation.isLoading ? 'Updating...' : 'Update Task'}
      </button>
    </form>
  );
};

export default UpdateTaskForm;

