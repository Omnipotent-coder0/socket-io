import express from "express";
import "dotenv/config";
import { Server } from "socket.io";
import { createServer } from "node:http";
import cors from "cors";

const port = process.env.PORT;

const app = express();
const server = new createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  },
});

// app.use(
//   cors({
//     origin: process.env.CLIENT_URL,
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
//     credentials: true,
//   })
// );

app.get("/", (req, res) => {
  res.status(200).send({ message: "hello world" });
});

io.on("connection", (socket) => {
  console.log("User Connected", socket.id);

  // socket.emit(
  //   "message",
  //   `welcome to the socket io tutorial, You are on socket : ${socket.id}`
  // );

  // io means whole circuit 
  // socket means particular one socket
  // io.emmit sends data to the whole circuit including the same socket 
  // socket.broadcast.emmit sends data to the whole circuit except for the same socket
  // we can create and listen to the function from both fronend and backend

  socket.on("message", ({message, room})=>{
    console.log({message, room});
    io.to(room).emit("recieved message",message);
  });

  socket.on("join room",(roomName)=>{
    socket.join(roomName);   // socket.join to join a particular room but 
    //  joining a room doesn't make the user to send messages only in that room, 
    //  instead it makes the user to recive messages sent to the room
    console.log(`${socket.id} has joined room ${roomName}`);
  })

  // socket.on("message", (data)=>{
  //   console.log(data);
  //   socket.broadcast.emit("recieved message",data);
  // });

  // socket.broadcast.emit(
  //   "message",
  //   `A new user is joined with socket id : ${socket.id}`
  // );
  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(port, () => {
  console.log(`Your server is running on port : ${port}`);
});
