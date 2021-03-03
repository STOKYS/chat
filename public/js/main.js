const socket = io();

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

document.getElementById("yourname").innerText = `User: ${username}`;

socket.emit("joinRoom", { username, room });

socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

socket.on("message", (message) => {
  outputMessage(message);
});

document.getElementById("send").addEventListener("click", () => {
  let msg = document.getElementById("input").value;
  socket.emit("chatMessage", msg);
});

function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `
    <h1><b>${message.username}</b> ${message.time}</h1>`;
  if (message.text.substring(0, 24) == "https://www.youtube.com/") {
    div.innerHTML += `<iframe
        width="620"
        height="360"
        src="${url(message.text)}"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>`;
  } else {
    div.innerHTML += `<p>${message.text}</p>`;
  }
  document.getElementById("chat-space").appendChild(div);
  document.getElementById("chat-space").scroll(0, 999999);
  document.getElementById("input").value = "";
  document.getElementById("input").focus();
}

window.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    let msg = document.getElementById("input").value;
    socket.emit("chatMessage", msg);
  }
});

function outputRoomName(room) {
  document.getElementById("header").innerText = `ROOM CODE: ${room}`;
}

function outputUsers(users) {
  document.getElementById("users").innerHTML = `
    ${users.map((user) => `<li>${user.username}</li>`).join("")}`;
}

function url(text) {
  let fin = text.split("=").pop();
  return `https://www.youtube.com/embed/${fin}`;
}
