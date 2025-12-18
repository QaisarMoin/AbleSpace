import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import { updateProfileSchema } from '../services/auth.service';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import NotificationDisplay from '../components/NotificationDisplay';

type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

const Profile = () => {
  const { user, updateProfile, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
  });

  useEffect(() => {
    if (user) {
      reset({ name: user.name });
    }
  }, [user, reset]);

  const onSubmit = async (data: UpdateProfileInput) => {
    try {
      await updateProfile(data);
      alert('Profile updated successfully');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <NotificationDisplay />
      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black opacity-50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-800 text-white shadow-md transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0`}
      >
        <div className="p-4">
          <h1 className="text-3xl font-bold mb-8 text-center border-b border-gray-700 pb-4">Task Manager</h1>
          <nav>
            <ul>
              <li className="mb-4">
                <Link to="/dashboard" className="flex items-center p-2 text-gray-300 hover:bg-gray-700 rounded-md">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                  Dashboard
                </Link>
              </li>
              <li className="mb-4">
                <Link to="/profile" className="flex items-center p-2 text-gray-300 hover:bg-gray-700 rounded-md">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                  Profile
                </Link>
              </li>
            </ul>
          </nav>
          <button
            onClick={logout}
            className="w-full mt-4 px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between p-4 bg-white border-b">
          <div className="flex items-center">
            <button
              className="text-gray-500 focus:outline-none lg:hidden"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                ></path>
              </svg>
            </button>
            <h1 className="text-2xl font-bold ml-2 lg:ml-0">Profile</h1>
          </div>
          <div className="flex items-center">
            <div className="mr-4">Welcome, {user?.name}</div>
            <img className="w-10 h-10 rounded-full" src="https://i.pravatar.cc/150" alt="user avatar" />
          </div>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  {...register('name')}
                  className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="block w-full px-3 py-2 mt-1 bg-gray-100 border border-gray-300 rounded-md shadow-sm sm:text-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Update Profile
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
