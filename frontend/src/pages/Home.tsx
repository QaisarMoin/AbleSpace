import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="text-center mt-20">
      <h1 className="text-4xl font-bold mb-5">Welcome to the Task Management App</h1>
      <p className="text-lg mb-10">
        Organize your work and life, finally.
      </p>
      <div className="flex justify-center gap-4">
        <Link to="/dashboard" className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Home;

