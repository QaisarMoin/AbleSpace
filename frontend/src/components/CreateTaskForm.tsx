import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { createTask, createTaskSchema } from '../services/task.service';
import { getUsers } from '../services/auth.service';
import { z } from 'zod';

type CreateTaskFormValues = z.infer<typeof createTaskSchema>;

interface CreateTaskFormProps {
  onClose: () => void;
}

const CreateTaskForm = ({ onClose }: CreateTaskFormProps) => {
  const queryClient = useQueryClient();
  const { data: users } = useQuery('users', getUsers);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTaskFormValues>({
    resolver: zodResolver(createTaskSchema),
  });

  const mutation = useMutation(createTask, {
    onSuccess: () => {
      queryClient.invalidateQueries('tasks');
      onClose();
    },
    onError: (error: any) => {
      console.error('Failed to create task:', error.response.data.message);
    },
  });

  const onSubmit = (data: CreateTaskFormValues) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold mb-5">Create Task</h2>
      <input {...register('title')} placeholder="Title" className="p-2 border rounded" />
      {errors.title && <p className="text-red-500">{errors.title.message}</p>}

      <textarea {...register('description')} placeholder="Description" className="p-2 border rounded" />
      {errors.description && <p className="text-red-500">{errors.description.message}</p>}

      <input type="date" {...register('dueDate')} className="p-2 border rounded" />
      {errors.dueDate && <p className="text-red-500">{errors.dueDate.message}</p>}

      <select {...register('priority')} className="p-2 border rounded">
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
        <option value="Urgent">Urgent</option>
      </select>
      {errors.priority && <p className="text-red-500">{errors.priority.message}</p>}

      <select {...register('assignedToId')} className="p-2 border rounded">
        <option value="">Assign to...</option>
        {users?.map((user: any) => (
          <option key={user._id} value={user._id}>{user.name}</option>
        ))}
      </select>
      {errors.assignedToId && <p className="text-red-500">{errors.assignedToId.message}</p>}

      <button type="submit" disabled={mutation.isLoading} className="p-2 bg-blue-500 text-white rounded disabled:bg-gray-400">
        {mutation.isLoading ? 'Creating...' : 'Create Task'}
      </button>
    </form>
  );
};

export default CreateTaskForm;
