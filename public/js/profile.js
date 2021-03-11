const socket = io();
const awch = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
let you = "";

window.addEventListener("load", function () {
  socket.emit("profileLoad", document.cookie);
});

socket.on("userFound", (user) => {
  you = user;
  document.getElementById("yourname").innerText = user.name;
  document.getElementById("yourmail").innerText = user.mail;
  document.getElementById("yourstatus").innerHTML = user.status;
  for (let i = 0; i < user.friend.length; i++) {
    createFriend(user.friend[i].substring(5));
  }
  for (let i = 0; i < user.room.length; i++) {
    createRoom(user.room[i].substring(3), false);
  }
});

document.getElementById("createRoom").addEventListener("click", function () {
  let x = prompt("Room code?");
  createRoom(x, true);
});

function createRoom(x, newRm) {
  const div = document.createElement("div");
  div.classList.add("room");
  div.setAttribute("id", `rm_${x}`);
  div.innerHTML = `<button class="roombtn" onclick="goToRoom('${x}')">Room: ${x}</button><button class="removeroom" onclick="removeBtn('${x}')">Remove</button>`;
  document.getElementById("chatrooms").appendChild(div);
  if (newRm) socket.emit("createRoom", { code: x, user: you });
}

function goToRoom(room) {
  window.open(`${window.location.href.slice(0, -12)}chat.html?room=${room}`);
}

function removeBtn(room) {
  if (room != "all") {
    document.getElementById(`rm_${room}`).outerHTML = "";
    socket.emit("removeRoom", { code: room, user: you });
  }
}

function createFriend(x) {
  const div = document.createElement("div");
  div.classList.add("room");
  div.setAttribute("id", `user_${x}`);
  div.innerHTML = `<button class="roombtn">${x}</button><button class="removeroom">Remove</button>`;
  document.getElementById("friends").appendChild(div);
}

document.getElementById("createPost").addEventListener("click", function () {
  let x = prompt("What do you wanna say?");
  socket.emit("postCreate", { text: x, user: you.name });
});

socket.on("post", (data) => {
  outputPost(data);
});

function outputPost(data) {
  const div = document.createElement("div");
  div.classList.add("post");
  div.innerHTML = `
      <div class="post_heading"><h1>${data.username}</h1> <h2>${data.time}</h2></div><div class="post_content"><p>${data.text}</p></div><div id="comments_${data.id}" class="post_comments"><h3>Comments</h3><button onclick="createCommentik('${data.id}')">Post comment</button></div>`; /*  */
  document.getElementById("postspace").appendChild(div);
}

function createCommentik(id){
    console.log("hello")
    let x = prompt("What do you wanna comment?");
    socket.emit("postComment", { text: x, user: you.name, id: id});
}

socket.on("postCommented", (data) => {
    outputComment(data)
})

function outputComment(data) {
    const div = document.createElement("div");
    div.classList.add("post_comment");
    div.innerHTML = `
        <div class="post_comment_heading"><h1>${data.user}</h1></div><div class="post_comment_content"><p>${data.text}</p></div>`;
    document.getElementById(`comments_${data.id}`).appendChild(div);
}

function updateBio(){
    let value = document.getElementById("yourstatus").value
    socket.emit("updateBio", { value: value, user: you.id})
}