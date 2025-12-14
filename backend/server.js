import express from "express";
import { connectDB } from "./connection.js";
import { Server } from "socket.io";
import auth from "./routes/auth.routes.js";
import person from "./routes/user.routes.js";
import meet from "./routes/meet.routes.js";
import bodyParser from "body-parser";
import path from "path";
import cors from "cors";

const app = express();
const io = new Server({
  cors: {
    origin: "*",
  },
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

const emailToSocket = new Map();    
const socketToEmail = new Map();     
const roomUsers = new Map();         

io.on("connection", (socket) => {
  console.log("New socket connected:", socket.id);

  socket.on("join-room", ({ email, roomId }) => {
    console.log(`${email} joined room ${roomId}`);

    emailToSocket.set(email, socket.id);
    socketToEmail.set(socket.id, email);

    if (!roomUsers.has(roomId)) {
      roomUsers.set(roomId, new Set());
    }

    const existingUsers = Array.from(roomUsers.get(roomId));
    roomUsers.get(roomId).add(email);

    socket.join(roomId);

    socket.emit("room-users", existingUsers);

    socket.broadcast.to(roomId).emit("user-joined", { email });
  });

  socket.on("call-user", ({ email, offer }) => {
    const fromEmail = socketToEmail.get(socket.id);
    const targetSocket = emailToSocket.get(email);

    if (!targetSocket) return;

    socket.to(targetSocket).emit("incoming-call", {
      from: fromEmail,
      offer,
    });
  });

  socket.on("call-accepted", ({ email, ans }) => {
    const targetSocket = emailToSocket.get(email);
    if (!targetSocket) return;

    socket.to(targetSocket).emit("call-accepted", { ans });
  });

  socket.on("ice-candidate", ({ email, candidate }) => {
    const targetSocket = emailToSocket.get(email);
    if (!targetSocket) return;

    socket.to(targetSocket).emit("ice-candidate", {
      from: socketToEmail.get(socket.id),
      candidate,
    });
  });

  socket.on("disconnect", () => {
    const email = socketToEmail.get(socket.id);
    if (!email) return;

    console.log(`${email} disconnected`);

    emailToSocket.delete(email);
    socketToEmail.delete(socket.id);

    for (const [roomId, users] of roomUsers.entries()) {
      if (users.has(email)) {
        users.delete(email);
        socket.broadcast.to(roomId).emit("user-left", { email });

        if (users.size === 0) {
          roomUsers.delete(roomId);
        }
      }
    }
  });
});

app.use("/api/authentication", auth);
app.use("/api/user", person);
app.use("/api/meeting", meet);
app.use(
  "/profile-picture",
  express.static(path.join(process.cwd(), "profile-picture"))
);

app.listen(8000, () => {
  connectDB();
  console.log("HTTP server running on 8000");
});

io.listen(8001);
console.log("Socket server running on 8001");