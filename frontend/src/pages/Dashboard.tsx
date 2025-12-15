import { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getTasks, deleteTask } from '../services/task.service';
import Modal from '../components/Modal';
import CreateTaskForm from '../components/CreateTaskForm';
import UpdateTaskForm from '../components/UpdateTaskForm';
import { useSocket } from '../hooks/useSocket';

const Dashboard = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: tasks, isLoading, error } = useQuery('tasks', getTasks);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('asc');

  useSocket();

  const deleteMutation = useMutation(deleteTask, {
    onSuccess: () => {
      queryClient.invalidateQueries('tasks');
    },
  });

  const filteredAndSortedTasks = useMemo(() => {
    if (!tasks) return [];
    let filtered = tasks;
    if (statusFilter !== 'All') {
      filtered = filtered.filter((task: any) => task.status === statusFilter);
    }
    if (priorityFilter !== 'All') {
      filtered = filtered.filter((task: any) => task.priority === priorityFilter);
    }
    filtered.sort((a: any, b: any) => {
      const dateA = new Date(a.dueDate).getTime();
      const dateB = new Date(b.dueDate).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
    return filtered;
  }, [tasks, statusFilter, priorityFilter, sortOrder]);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteMutation.mutate(id);
    }
  };

  const openUpdateModal = (task: any) => {
    setSelectedTask(task);
    setIsUpdateModalOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="p-2 bg-blue-500 text-white rounded"
        >
          Create Task
        </button>
      </div>
      <p className="mb-5">Welcome, {user?.name}!</p>

      <div className="flex gap-4 mb-5">
        <div>
          <label htmlFor="status-filter" className="mr-2">Filter by Status:</label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="All">All</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Review">Review</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <div>
          <label htmlFor="priority-filter" className="mr-2">Filter by Priority:</label>
          <select
            id="priority-filter"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="All">All</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>
        </div>
        <div>
          <label className="mr-2">Sort by Due Date:</label>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="p-2 bg-gray-200 rounded"
          >
            {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
          </button>
        </div>
      </div>

      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)}>
        <CreateTaskForm onClose={() => setIsCreateModalOpen(false)} />
      </Modal>

      {selectedTask && (
        <Modal isOpen={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)}>
          <UpdateTaskForm
            task={selectedTask}
            user={user}
            onClose={() => setIsUpdateModalOpen(false)}
          />
        </Modal>
      )}

      {isLoading && <p>Loading tasks...</p>}
      {error && <p className="text-red-500">Error fetching tasks</p>}

      {filteredAndSortedTasks && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAndSortedTasks.map((task: any) => (
            <div key={task._id} className="p-4 border rounded">
              <h3 className="font-bold">{task.title}</h3>
              <p>{task.description}</p>
              <p>Status: {task.status}</p>
              <p>Priority: {task.priority}</p>
              <p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>
              <p>Assigned to: {task.assignedToId.name}</p>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => openUpdateModal(task)}
                  className="p-1 bg-yellow-500 text-white rounded"
                >
                  Edit
                </button>
                {task.creatorId._id === user?._id && (
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="p-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;





