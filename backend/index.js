const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/auth.routes");
const taskRoutes = require("./src/routes/task.routes");

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "https://able-space-nine.vercel.app"], // Allow specific origin
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const userSockets = new Map();

io.on("connection", (socket) => {
  console.log("a user connected");

  // Get userId and token from authentication data
  const { userId, token } = socket.handshake.auth;

  // Verify token if provided
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (userId && decoded.id === userId) {
        userSockets.set(userId, socket.id);
        console.log(`User ${userId} registered with socket ${socket.id}`);
      }
    } catch (error) {
      console.error("Invalid token provided for socket connection");
    }
  } else if (userId) {
    userSockets.set(userId, socket.id);
    console.log(`User ${userId} registered with socket ${socket.id}`);
  }

  socket.on("disconnect", () => {
    console.log("user disconnected");
    for (const [userId, id] of userSockets.entries()) {
      if (id === socket.id) {
        userSockets.delete(userId);
        break;
      }
    }
  });
});

// Middleware to attach io and userSockets to request
app.use((req, res, next) => {
  req.io = io;
  req.userSockets = userSockets;
  next();
});

app.use(
  cors({
    origin: ["http://localhost:3000"], // Allow specific origin
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
    ],
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
