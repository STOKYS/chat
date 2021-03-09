const socket = io();

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

document.getElementById("yourname").innerText = `User: ${username}`;

socket.emit("joinRoom", {
  username,
  room,
});

socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

socket.on("message", (message, toAll) => {
  outputMessage(message, toAll);
});

document.getElementById("chat-input").addEventListener("submit", (event) => {
  let msg = document.getElementById("input").value;
  socket.emit("chatMessage", msg);
  document.getElementById("chat-input").reset();
  event.preventDefault();
});

function outputMessage(message, toAll) {
  const div = document.createElement("div");
  div.classList.add("message");
  if (toAll === false) {
    div.classList.add("yours_message");
  }
  div.innerHTML = `
    <h1><b>${message.username}</b> ${message.time}</h1>`;
  console.log(
    `${
      message.text.substring(0, 17) == "https://youtu.be/"
    }, ${message.text.substring(0, 17)}`
  );
  if (
    message.text.substring(0, 24) == "https://www.youtube.com/" ||
    message.text.substring(0, 17) == "https://youtu.be/"
  ) {
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
  document.getElementById("input").focus();
}

function outputRoomName(room) {
  document.getElementById("header").innerText = `ROOM CODE: ${room}`;
}

function outputUsers(users) {
  document.getElementById("users").innerHTML = `
    ${users.map((user) => `<li>${user.username}</li>`).join("")}`;
}

function url(text) {
  let fin = "";
  console.log(
    `${text}, ${text.substring(0, 18)}, ${
      text.substring(0, 18) == "https://www.youtub"
    }`
  );
  if (text.substring(0, 18) == "https://www.youtub") {
    fin = text.split("=").pop();
  } else {
    fin = text.split("be/").pop();
  }
  return `https://www.youtube.com/embed/${fin}`;
}
