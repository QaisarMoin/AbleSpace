import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="text-center mt-20">
      <h1 className="text-4xl font-bold mb-5">Welcome to the Task Management App</h1>
      <p className="text-lg mb-10">
        Organize your work and life, finally.
      </p>
      <div className="flex justify-center gap-4">
        <Link to="/login" className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Login
        </Link>
        <Link to="/register" className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
          Register
        </Link>
      </div>
    </div>
  );
};

export default Home;

