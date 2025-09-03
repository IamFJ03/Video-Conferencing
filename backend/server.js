const express = require("express")
const {Server} = require("socket.io")
const bodyParser = require("body-parser")
const io = new Server({
   cors: true
})
const app = express()


const emailToSocketMapping = new Map()
const socketToEmailMapping = new Map()
app.use(bodyParser.json())
io.on("connection", (socket)=>{
     socket.on("join-room",(data) => {
        const {email, roomId} = data;
        console.log("User", email, "Joined ", roomId)
        emailToSocketMapping.set(email, socket.id)
        socketToEmailMapping.set(socket.id, email)
        socket.join(roomId)
        socket.emit("Joined-room", {email, roomId})
        socket.broadcast.to(roomId).emit("user-joined",{ email})
     })

     socket.on("call-user", (data) => {
      const {email, offer} = data
      const fromEmail = socketToEmailMapping.get(socket.id)
      const socketId = emailToSocketMapping.get(email)
      console.log("call-user received from:", fromEmail, "to:", email, "socketId:", socketId);
  if (socketId) {
    socket.to(socketId).emit('incoming-call', { from: fromEmail, offer });
  } else {
    console.log("No socket ID found for", email);
  }

     })

     socket.on("call-accepted",(data) => {
      const {email, ans} = data
         const socketId = emailToSocketMapping.get(email);
         socket.to(socketId).emit("call-accepted", {ans})
     })
}) 
app.listen(8000, () => console.log("Server started at port 8000"))
io.listen(8001)