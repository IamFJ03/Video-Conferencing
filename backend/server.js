import express from "express";
import {connectDB} from "./connection.js";
import { Server } from "socket.io";
import auth from "./routes/auth.routes.js";
import person from './routes/user.routes.js';
import bodyParser from "body-parser";
import path from "path";
import cors from "cors";
const io = new Server({
   cors: true
})
const app = express()
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const emailToSocketMapping = new Map()
const socketToEmailMapping = new Map()
app.use(bodyParser.json())
io.on("connection", (socket) => {
   socket.on("join-room", (data) => {
      const { email, roomId } = data;
      console.log("User", email, "Joined ", roomId)
      emailToSocketMapping.set(email, socket.id)
      console.log("socket Id", socket.id)
      socketToEmailMapping.set(socket.id, email)
      console.log("Email:", email)
      socket.join(roomId)
      socket.emit("Joined-room", { email, roomId })
      socket.broadcast.to(roomId).emit("user-joined", { email })
   })

   socket.on("call-user", (data) => {
      const { email, offer } = data
      const fromEmail = socketToEmailMapping.get(socket.id)
      const socketId = emailToSocketMapping.get(email)
      console.log("call-user received from:", fromEmail, "to:", email, "socketId:", socketId, "offer:", offer);
      if (socketId) {
         console.log("Emitting incoming-call to:", socketId);
         console.log("Is target socket alive?", io.sockets.sockets.has(socketId));

         socket.to(socketId).emit("incoming-call", { from: fromEmail, offer });
         console.log("Emit executed");
      } else {
         console.log("No socket ID found for", email);
      }

   })

   socket.on("call-accepted", (data) => {
      const { email, ans } = data
      const socketId = emailToSocketMapping.get(email);
      socket.to(socketId).emit("call-accepted", { ans })
   })
})

app.use("/api/authentication", auth);
app.use("/api/user", person);
app.use('/profile-picture', express.static(path.join(process.cwd(), 'profile-picture')));

app.listen(8000, () => {
   connectDB()
   console.log("Server started at port 8000")
})
io.listen(8001)