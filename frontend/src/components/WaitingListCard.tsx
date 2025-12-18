import React from 'react';

interface WaitingListCardProps {
  title: string;
  duration: string;
  due: string;
  user: {
    avatar: string;
  };
  color: 'green' | 'orange' | 'purple' | 'red';
}

const WaitingListCard: React.FC<WaitingListCardProps> = ({ title, duration, due, user, color }) => {
  const colorClasses = {
    green: 'bg-green-100',
    orange: 'bg-orange-100',
    purple: 'bg-purple-100',
    red: 'bg-red-100',
  };
  return (
    <div className={`p-3 rounded-lg shadow-sm mb-4 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-sm">{title}</h3>
        <img
          className="h-6 w-6 rounded-full"
          src={user.avatar}
          alt="User avatar"
        />
      </div>
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{duration}</span>
        <span>{due}</span>
      </div>
    </div>
  );
};

export default WaitingListCard;
