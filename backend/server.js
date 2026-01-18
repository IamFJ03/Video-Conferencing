import express from "express";
import { connectDB } from "./connection.js";
import { Server } from "socket.io";
import auth from "./routes/auth.routes.js";
import person from "./routes/user.routes.js";
import meet from "./routes/meet.routes.js";
import bodyParser from "body-parser";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

const io = new Server({
  cors: {
    origin: "http://localhost:5173",
    credentials: true
  },
});

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

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

    const usersInRoom = roomUsers.get(roomId);
    const existingUsers = Array.from(usersInRoom);

    usersInRoom.add(email);
    socket.join(roomId);

    socket.emit("room-users", existingUsers);

    socket.broadcast.to(roomId).emit("user-joined", { email });

    socket.emit("joined-room", { roomId });
  });

  socket.on("call-user", ({ email, offer }) => {
    const fromEmail = socketToEmail.get(socket.id);
    const targetSocket = emailToSocket.get(email);


    console.log("call-user backend →", email, "to:", targetSocket);

    socket.to(targetSocket).emit("incoming-call", {
      from: fromEmail,
      offer,
    });
  });

  socket.on("call-accepted", ({ email, ans }) => {
    const fromEmail = socketToEmail.get(socket.id);
    const targetSocket = emailToSocket.get(email);

    if (!targetSocket) return;

    console.log("call-accepted backend →", email);

    socket.to(targetSocket).emit("call-accepted", {
      from: fromEmail,
      ans,
    });
  });

  socket.on("user-left", ({ email }) => {
    socket.broadcast.emit("userLeft", email)
  })

  socket.on("ice-candidate", ({ to, candidate }) => {
    const fromEmail = socketToEmail.get(socket.id);
    const targetSocket = emailToSocket.get(to);

    if (!targetSocket) return;

    socket.to(targetSocket).emit("ice-candidate", {
      from: fromEmail,
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

        socket.broadcast.to(roomId).emit("user-left", {
          email,
        });

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

app.use("/profile-picture", express.static(path.join(process.cwd(), "profile-picture")));

app.listen(8000, () => {
  connectDB();
  console.log("HTTP server running on 8000");
});

io.listen(8001);
console.log("Socket server running on 8001");
