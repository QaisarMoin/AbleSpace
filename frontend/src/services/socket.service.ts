
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const connectSocket = (userId?: string) => {
  if (!socket) {
    const token = localStorage.getItem('token');
    socket = io('https://ablespace-xyiu.onrender.com', {
      withCredentials: true,
      auth: {
        userId,
        token
      }
    });

    // User is now automatically registered on connection using auth data
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = (userId?: string) => {
  if (!socket) {
    return connectSocket(userId);
  }
  return socket;
};

export const listenForNotifications = (callback: (message: string) => void) => {
  const socket = getSocket();
  socket.on('notification', callback);
  return () => socket.off('notification', callback);
};
