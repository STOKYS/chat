const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utils/message.js");
const idCreator = require("./utils/coder.js");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users.js");
const fs = require("fs");
const { stringify } = require("querystring");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  console.log("connected");
  console.log(socket.id);
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    socket.emit(
      "message",
      formatMessage("Server BOT", `Welcome to the chat ${user.username}`)
    );

    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage("Server BOT", `${user.username} has joined the chat`)
      );

    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    socket.broadcast
      .to(user.room)
      .emit("message", formatMessage(user.username, msg), true);
    socket.emit("message", formatMessage(user.username, msg), false);
  });

  socket.on("createUser", (user) => {
    let old;
    let valid = true;
    fs.readFile("data/users.json", "utf8", (err, jsonString) => {
      if (err) {
        console.log("File read failed:", err);
        return;
      }
      if (jsonString) {
        old = JSON.parse(jsonString);
      } else {
        old = "";
      }
      let arr = [];
      let fin;
      if (old == "") {
        user.id = idCreator();
        console.log(user);
        arr.push(user);
        fin = JSON.stringify(arr);
        fs.writeFile("data/users.json", fin, (err) => {
          if (err) {
            throw err;
          }
          console.log("JSON data is saved.");
        });
      } else {
        for (let i = 0; i < old.length; i++) {
          if (old[i].name == user.name || old[i].mail == user.mail) {
            valid = false;
          }
        }
        if (valid) {
          let validity = true;
          do {
            user.id = idCreator();
            for (let i = 0; i < old.length; i++) {
              if (old[i].id == user.id) {
                validity = false;
                break;
              }
            }
          } while (!validity);
          console.log(user);
          old.push(user);
          fin = JSON.stringify(old);
          fs.writeFile("data/users.json", fin, (err) => {
            if (err) {
              throw err;
            }
            console.log("JSON data is saved.");
          });
        }
      }
    });
  });

  socket.on("logUser", (user) => {
    let old;
    fs.readFile("data/users.json", "utf8", (err, jsonString) => {
      if (err) {
        console.log("File read failed:", err);
        return;
      }
      if (jsonString) {
        old = JSON.parse(jsonString);
        console.log(old);
        for (let i = 0; i < old.length; i++) {
          if (old[i].pwd == user.pwd && old[i].mail == user.mail) {
            socket.emit("goTo", {link: `profile.html`, id: old[i].id});
          }
        }
      } else {
        console.log("false");
      }
    });
  });

  socket.on("profileLoad", (id) => {
    fs.readFile("data/users.json", "utf8", (err, jsonString) => {
      if (err) {
        console.log("File read failed:", err);
        return;
      }
      if (jsonString) {
        let old = JSON.parse(jsonString);
        for (let i = 0; i < old.length; i++) {
          if (old[i].id == id) {
            socket.emit("userFound", old[i]);
          }
        }
      } else {
        console.log("false");
      }
    });
  })

  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage("Server BOT", `${user.username} is no longer with us`)
      );

      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

const PORT = 8080 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
