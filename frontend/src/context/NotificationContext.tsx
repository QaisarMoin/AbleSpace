
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { connectSocket, disconnectSocket, listenForNotifications } from '../services/socket.service';

interface NotificationContextType {
  notifications: string[];
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<string[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // Connect to socket when user is logged in
      connectSocket(user._id);

      // Listen for notifications
      const cleanup = listenForNotifications((message) => {
        setNotifications(prev => [...prev, message]);
        // Also show an immediate alert
        alert(message);
      });

      return () => {
        cleanup();
        disconnectSocket();
      };
    }
  }, [user]);

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider value={{ notifications, clearNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
