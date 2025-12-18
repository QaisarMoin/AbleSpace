import React from 'react';

interface TaskCardProps {
  title: string;
  time: string;
  color: 'green' | 'orange' | 'purple' | 'red';
}

const TaskCard: React.FC<TaskCardProps> = ({ title, time, color }) => {
  const colorClasses = {
    green: 'bg-green-200',
    orange: 'bg-orange-200',
    purple: 'bg-purple-200',
    red: 'bg-red-200',
  };

  return (
    <div className={`p-4 rounded-lg shadow-md ${colorClasses[color]}`}>
      <h3 className="font-bold">{title}</h3>
      <p className="text-sm">{time}</p>
    </div>
  );
};

export default TaskCard;
