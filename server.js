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

let game_rooms = {}

io.on("connection", (socket) => {


  // Chat
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
    socket.broadcast.to(user.room).emit("message", formatMessage(user.username, msg), true);
    socket.emit("message", formatMessage(user.username, msg), false);
  });




  // Login
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
      console.log(user)
    let old;
    fs.readFile("data/users.json", "utf8", (err, jsonString) => {
      if (err) {
        console.log("File read failed:", err);
        return;
      }
      if (jsonString) {
        old = JSON.parse(jsonString);
        console.log(old)
        for (let i = 0; i < old.length; i++) {
          if (old[i].pwd == user.pwd && old[i].mail == user.mail) {
              console.log(old[i].id)
            socket.emit("goTo", { link: `profile.html`, id: old[i].id });
          }
        }
      } else {
        console.log("false");
      }
    });
  });


  // Game
  socket.on("sendingInvite", ({ him, you, code })=>{
    socket.broadcast.to("profile").emit("gameInviteAcc", {t: him, f: you, c: code})
  })



  // Game ttt
  socket.on("gameLoad_ttt", (id) => {
    fs.readFile("data/users.json", "utf8", (err, jsonString) => {
      if (err) {
        console.log("File read failed:", err);
        return;
      }
      if (jsonString) {
        let old = JSON.parse(jsonString);
        for (let i = 0; i < old.length; i++) {
          if (old[i].id == id) {
            socket.emit("userGameFound_ttt", old[i]);
          }
        }
      } else {
        console.log("false");
      }
    });
  });

  socket.on("joinGameRoom_ttt", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);
    if (!game_rooms[user.room]){
        game_rooms[user.room] = 1
    } else {
        game_rooms[user.room]++
    }
    socket.emit("yourplace_ttt", game_rooms[user.room])
    io.to(user.room).emit("serverConsole_ttt", `${username} has joined the game`)
  })

  socket.on("gameStarted_ttt", (you)=>{
      const user = getCurrentUser(socket.id);
    io.to(user.room).emit("gameStartedClient_ttt", (you))
    io.to(user.room).emit("serverConsole_ttt", `${user.username} has started the game`)
  })

  socket.on("gameEnded_ttt", (you)=>{
    const user = getCurrentUser(socket.id);
  io.to(user.room).emit("gameEndedClient_ttt", (you))
  io.to(user.room).emit("serverConsole_ttt", `${user.username} has started the game`)
})

  socket.on("gameNewRound_ttt", (tiles)=>{
    const user = getCurrentUser(socket.id);
    socket.broadcast.to(user.room).emit("gameNewRoundClient_ttt", (tiles))
  })





  // Game check






  // Profile
  socket.on("profileLoad", (id) => {
    socket.join("profile");
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
  });

  socket.on("createRoom", (data) => {
    fs.readFile("data/users.json", "utf8", (err, jsonString) => {
      if (err) {
        console.log("File read failed:", err);
        return;
      }
      let old = JSON.parse(jsonString);
      for (let i = 0; i < old.length; i++) {
        if (old[i].id == data.user.id) {
          old[i].room.push(`rm_${data.code}`);
        }
      }
      let fin = JSON.stringify(old);
      fs.writeFile("data/users.json", fin, (err) => {
        if (err) {
          throw err;
        }
        console.log("JSON data is saved.");
      });
    });
  });

  socket.on("createFriend", (data) => {
    fs.readFile("data/users.json", "utf8", (err, jsonString) => {
      if (err) {
        console.log("File read failed:", err);
        return;
      }
      let old = JSON.parse(jsonString);
      for (let i = 0; i < old.length; i++) {
        if (old[i].id == data.user.id) {
          for (let j = 0; j < old.length; j++) {
            if (old[j].name == data.code) {
              old[i].friend.push(`user_${data.code}`);
            }
          }
        }
      }
      let fin = JSON.stringify(old);
      fs.writeFile("data/users.json", fin, (err) => {
        if (err) {
          throw err;
        }
        console.log("JSON data is saved.");
      });
    });
  });

  socket.on("removeRoom", (data) => {
    fs.readFile("data/users.json", "utf8", (err, jsonString) => {
      if (err) {
        console.log("File read failed:", err);
        return;
      }
      let old = JSON.parse(jsonString);
      for (let i = 0; i < old.length; i++) {
        if (old[i].id == data.user.id) {
          for (let j = 0; j < old[i].room.length; j++) {
            if (old[i].room[j] == `rm_${data.code}`) {
              old[i].room.splice(j, 1);
            }
          }
        }
      }
      let fin = JSON.stringify(old);
      fs.writeFile("data/users.json", fin, (err) => {
        if (err) {
          throw err;
        }
        console.log("JSON data is saved.");
      });
    });
  });

  socket.on("getFriendProfile", (data) => {
    fs.readFile("data/users.json", "utf8", (err, jsonString) => {
      if (err) {
        console.log("File read failed:", err);
        return;
      }
      let old = JSON.parse(jsonString);
      for (let i = 0; i < old.length; i++) {
        if (old[i].name == data) {
          socket.emit("showProfile", old[i]);
        }
      }
    });
  });

  socket.on("removeFriend", (data) => {
    fs.readFile("data/users.json", "utf8", (err, jsonString) => {
      if (err) {
        console.log("File read failed:", err);
        return;
      }
      let old = JSON.parse(jsonString);
      for (let i = 0; i < old.length; i++) {
        if (old[i].id == data.user.id) {
          for (let j = 0; j < old[i].friend.length; j++) {
            if (old[i].friend[j] == `user_${data.code}`) {
              old[i].friend.splice(j, 1);
            }
          }
        }
      }
      let fin = JSON.stringify(old);
      fs.writeFile("data/users.json", fin, (err) => {
        if (err) {
          throw err;
        }
        console.log("JSON data is saved.");
      });
    });
  });

  socket.on("postCreate", (data) => {
    let randId = idCreator();
    io.to("profile").emit("post", formatMessage(data.user, data.text), randId);
  });

  socket.on("postComment", (data) => {
    io.to("profile").emit("postCommented", data);
  });

  socket.on("updateBio", (data) => {
    data.value;
    data.user;
    fs.readFile("data/users.json", "utf8", (err, jsonString) => {
      if (err) {
        console.log("File read failed:", err);
        return;
      }
      if (jsonString) {
        let old = JSON.parse(jsonString);
        for (let i = 0; i < old.length; i++) {
          if (old[i].id == data.user) {
            old[i].status = data.value;
            fin = JSON.stringify(old);
            fs.writeFile("data/users.json", fin, (err) => {
              if (err) {
                throw err;
              }
              console.log("JSON data is saved.");
            });
          }
        }
      }
    });
  });

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
