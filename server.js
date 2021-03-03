const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utils/message.js");
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require("./utils/users.js");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    socket.emit("message", formatMessage("Server", `Welcome to the chat ${user.username}`));

    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage("Server", `${user.username} has joined the chat`)
      );
    
      io.to(user.room).emit('roomUsers', {
          room: user.room,
          users: getRoomUsers(user.room)
      })
  });

  socket.on("chatMessage", (msg) => {
      const user = getCurrentUser(socket.id)
    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

  socket.on("disconnect", () => {
      const user = userLeave(socket.id)
      if(user){
        io.to(user.room).emit("message", formatMessage("Server", `${user.username} is no longer with us`));

        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })
      }
  });
});

const PORT = 8080 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
