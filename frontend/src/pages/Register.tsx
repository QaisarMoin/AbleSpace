import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from 'react-query';
import { registerUser, registerSchema } from '../services/auth.service';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const mutation = useMutation(registerUser, {
    onSuccess: () => {
      navigate('/login');
    },
    onError: (error: any) => {
      console.error('Registration failed:', error.response.data.message);
    },
  });

  const onSubmit = (data: RegisterFormValues) => {
    mutation.mutate(data);
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-5">Register</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <input
          {...register('name')}
          placeholder="Name"
          className="p-2 border rounded"
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}

        <input
          {...register('email')}
          placeholder="Email"
          className="p-2 border rounded"
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}

        <input
          {...register('password')}
          type="password"
          placeholder="Password"
          className="p-2 border rounded"
        />
        {errors.password && (
          <p className="text-red-500">{errors.password.message}</p>
        )}

        <button
          type="submit"
          disabled={mutation.isLoading}
          className="p-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
        >
          {mutation.isLoading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default Register;


