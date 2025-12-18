import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import { useState, useMemo } from 'react';
import { updateTask, deleteTask } from '../services/task.service';
import Skeleton from './Skeleton';
import UpdateTaskForm from './UpdateTaskForm';
import Modal from './Modal';

const TaskList = ({ filter }: { filter: string }) => {
  const { tasks, isLoading, fetchTasks } = useTasks();
  const { user } = useAuth();
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [editingTask, setEditingTask] = useState<any>(null);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Low':
        return '#34D399'; // green-400
      case 'Medium':
        return '#FBBF24'; // amber-400
      case 'High':
        return '#F97316'; // orange-500
      case 'Urgent':
        return '#EF4444'; // red-500
      default:
        return '#6B7280'; // gray-500
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="p-4 border rounded shadow">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full mb-4" />
            <Skeleton className="h-4 w-1/2 mb-2" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        ))}
      </div>
    );
  }

  const filteredTasks = tasks
    .filter((task) => {
      if (filter === 'my_tasks' && task.assignedToId._id !== user?._id) {
        return false;
      }
      if (filter === 'created_by_me' && task.creatorId._id !== user?._id) {
        return false;
      }
      if (filter === 'overdue' && (new Date(task.dueDate) >= new Date() || task.status === 'Completed')) {
        return false;
      }
      if (filterStatus && task.status !== filterStatus) {
        return false;
      }
      if (filterPriority && task.priority !== filterPriority) {
        return false;
      }
      return true;
    });

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateTask({ id, status });
      await fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTask(id);
      await fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <div>
          <label>Status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="ml-2 p-2 border rounded"
          >
            <option value="">All</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Review">Review</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <div>
          <label>Priority:</label>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="ml-2 p-2 border rounded"
          >
            <option value="">All</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTasks.map((task) => (
          <div
            key={task._id}
            className="p-4 border-l-8 rounded-lg shadow-lg bg-white"
            style={{ borderLeftColor: getPriorityColor(task.priority) }}
          >
            <h3 className="text-lg font-bold">{task.title}</h3>
            <p className="text-gray-600">{task.description}</p>
            <p className="text-sm text-gray-500">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
            <p className="text-sm font-semibold" style={{ color: getPriorityColor(task.priority) }}>Priority: {task.priority}</p>
            <div>
              <label className="text-sm font-medium text-gray-700">Status:</label>
              <select
                value={task.status}
                onChange={(e) => handleStatusChange(task._id, e.target.value)}
                className="ml-2 p-1 border rounded"
                disabled={user?._id !== task.creatorId._id && user?._id !== task.assignedToId._id}
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Review">Review</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <p className="text-sm text-gray-500">Created by: {task.creatorId.name}</p>
            <p className="text-sm text-gray-500">Assigned to: {task.assignedToId.name}</p>
            {user?._id === task.creatorId._id && (
              <div className="flex justify-end mt-2">
                <button onClick={() => setEditingTask(task)} className="px-4 py-2 mr-2 text-white bg-blue-600 rounded">Edit</button>
                <button onClick={() => handleDelete(task._id)} className="px-4 py-2 text-white bg-red-600 rounded">Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>
      {editingTask && (
        <Modal onClose={() => setEditingTask(null)}>
          <UpdateTaskForm task={editingTask} onUpdate={() => setEditingTask(null)} />
        </Modal>
      )}
    </div>
  );
};

export default TaskList;