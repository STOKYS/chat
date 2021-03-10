const socket = io();

window.addEventListener("load", function () {
  socket.emit("profileLoad", document.cookie);
});

socket.on("userFound", (user) => {
  console.log(user);
  document.getElementById("yourname").innerText = user.name;
  document.getElementById("yourmail").innerText = user.mail;
});

document.getElementById("createRoom").addEventListener("click", function () {
  let x = prompt("Room code?");
  const div = document.createElement("div");
  div.classList.add("room");
  div.innerHTML = `<button class="roombtn" id="room${x}" onclick="goToRoom(${x})">Room: ${x}</button><button class="removeroom" id="remove${x}" onclick="removeBtn(${x})">Remove</button>`;
  document.getElementById("chatrooms").appendChild(div);
});
