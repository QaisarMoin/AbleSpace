import React from 'react';
import TaskCard from './TaskCard';

interface CalendarColumnProps {
  day: string;
  tasks: {
    id: number;
    title: string;
    time: string;
    color: 'green' | 'orange' | 'purple' | 'red';
    user: {
      avatar: string;
    };
  }[];
}

const CalendarColumn: React.FC<CalendarColumnProps> = ({ day, tasks }) => {
  const tasksByUser = tasks.reduce((acc, task) => {
    const userAvatar = task.user.avatar;
    if (!acc[userAvatar]) {
      acc[userAvatar] = [];
    }
    acc[userAvatar].push(task);
    return acc;
  }, {} as Record<string, typeof tasks>);

  return (
    <div className="p-4 rounded-lg">
      <h2 className="text-xl font-bold mb-4">{day}</h2>
      <div className="space-y-4">
        {Object.entries(tasksByUser).map(([avatar, userTasks]) => (
          <div key={avatar} className="flex items-start">
            <img
              className="h-8 w-8 rounded-full mr-4"
              src={avatar}
              alt="User avatar"
            />
            <div className="flex-1 space-y-2">
              {userTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  title={task.title}
                  time={task.time}
                  color={task.color}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarColumn;
