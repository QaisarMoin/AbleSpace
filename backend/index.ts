// import express from 'express';
// import http from 'http';
// import { Server } from 'socket.io';
// import cors from 'cors';
// import cookieParser from 'cookie-parser';
// import dotenv from 'dotenv';
// import connectDB from './src/config/db';
// import authRoutes from './src/routes/auth.routes';
// import taskRoutes from './src/routes/task.routes';

// dotenv.config();
// connectDB();

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: 'https://ablespace-xyiu.onrender.com',
//     credentials: true,
//   },
// });

// const userSockets = new Map<string, string>();

// io.on('connection', (socket) => {
//   console.log('a user connected');

//   // Get userId from authentication data
//   const userId = socket.handshake.auth.userId;

//   if (userId) {
//     userSockets.set(userId, socket.id);
//     console.log(`User ${userId} registered with socket ${socket.id}`);
//   }

//   socket.on('disconnect', () => {
//     console.log('user disconnected');
//     for (const [userId, id] of userSockets.entries()) {
//       if (id === socket.id) {
//         userSockets.delete(userId);
//         break;
//       }
//     }
//   });
// });

// // Extend the Express Request type to include our custom properties
// declare global {
//   namespace Express {
//     interface Request {
//       io: Server;
//       userSockets: Map<string, string>;
//     }
//   }
// }

// app.use((req, res, next) => {
//   req.io = io;
//   req.userSockets = userSockets;
//   next();
// });

// app.use(cors({
//   origin: 'https://ablespace-xyiu.onrender.com',
//   credentials: true,
// }));
// app.use(express.json());
// app.use(cookieParser());

// app.use('/api/auth', authRoutes);
// app.use('/api/tasks', taskRoutes);

// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });

// const PORT = process.env.PORT || 4000;

// server.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
