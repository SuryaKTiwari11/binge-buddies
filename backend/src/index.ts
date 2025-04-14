import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { setupSocketHandlers } from "./socket.js";

// Create Express application
const app = express();
app.use(cors());
app.use(express.json());

// Create HTTP server and Socket.IO instance
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // In production, restrict this to your frontend domain
    methods: ["GET", "POST"],
  },
});

// Basic API route for health check
app.get("/", (req, res) => {
  res.send("BingeBuddies API is running");
});

// Initialize socket handlers
setupSocketHandlers(io);

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 BingeBuddies server running on port ${PORT}`);
});
