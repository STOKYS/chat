const socket = io();
const awch = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
let you = "";

window.addEventListener("load", function () {
  console.log(document.cookie);
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
  document.getElementById("popup_room").style.display = "inline";
});

document
  .getElementById("popup_room_submit")
  .addEventListener("click", function () {
    let x = document.getElementById("popup_room_input").value;
    createRoom(x, true);
    document.getElementById("popup_room").style.display = "none";
    document.getElementById("popup_room_input").value = "";
  });

document
  .getElementById("popup_room_close")
  .addEventListener("click", function () {
    document.getElementById("popup_room").style.display = "none";
    document.getElementById("popup_room_input").value = "";
  });

function createRoom(x, newRm) {
  const div = document.createElement("div");
  div.classList.add("room");
  div.setAttribute("id", `rm_${x}`);
  div.innerHTML = `<button class="roombtn" onclick="goToRoom('${x}')">Room: ${x}</button><button class="removeroom" onclick="removeRm('${x}')">Remove</button>`;
  document.getElementById("chatrooms").appendChild(div);
  if (newRm) socket.emit("createRoom", { code: x, user: you });
}

function goToRoom(room) {
  window.open(`${window.location.href.slice(0, -12)}chat.html?room=${room}`);
}

function removeRm(room) {
  if (room != "all") {
    document.getElementById(`rm_${room}`).outerHTML = "";
    socket.emit("removeRoom", { code: room, user: you });
  }
}

function removeFr(room) {
  if (room != "admin") {
    document.getElementById(`user_${room}`).outerHTML = "";
    socket.emit("removeFriend", { code: room, user: you });
  }
}

function createFriend(x, newFr) {
  const div = document.createElement("div");
  div.classList.add("room");
  div.setAttribute("id", `user_${x}`);
  div.innerHTML = `<button class="friendbtn" onclick="showFrProfile('${x}')">Friend: ${x}</button><button class="invitefriend" onclick="gameInvite('${x}')">Invite</button><button class="removeroom" onclick="removeFr('${x}')">Remove</button>`;
  document.getElementById("friends").appendChild(div);
  if (newFr) socket.emit("createFriend", { code: x, user: you });
}

document.getElementById("createPost").addEventListener("click", function () {
  document.getElementById("popup_post").style.display = "inline";
});

document
  .getElementById("popup_post_submit")
  .addEventListener("click", function () {
    if (document.getElementById("popup_post_input").value != ''){
        let x = document.getElementById("popup_post_input").value;
        socket.emit("postCreate", { text: x, user: you.name });
        document.getElementById("popup_post").style.display = "none";
        document.getElementById("popup_post_input").value = "";
    }
  });

document
  .getElementById("popup_post_close")
  .addEventListener("click", function () {
    document.getElementById("popup_post").style.display = "none";
    document.getElementById("popup_post_input").value = "";
  });

socket.on("post", (data, id) => {
  console.log(data);
  outputPost(data, id);
});

function outputPost(data, id) {
  const div = document.createElement("div");
  div.classList.add("post");
  div.innerHTML = `
      <div class="post_heading"><h1>${data.username}</h1><h2>${data.time}</h2></div><div class="post_content"><p>${data.text}</p></div><div id="comments_${id}" class="post_comments"><h3>Comments</h3><div><input type="text" placeholder="Type your comment" id="inputcomm_${id}"><button onclick="createCommentik('${id}')">Post comment</button></div></div>`;
  document.getElementById("postspace").appendChild(div);
}

function createCommentik(id) {
    if ( document.getElementById(`inputcomm_${id}`).value != ''){
        let x = document.getElementById(`inputcomm_${id}`).value;
        document.getElementById(`inputcomm_${id}`).value = "";
        socket.emit("postComment", { text: x, user: you.name, id: id });
    }
}

socket.on("postCommented", (data) => {
  outputComment(data);
});

function outputComment(data) {
  const div = document.createElement("div");
  div.classList.add("post_comment");
  div.innerHTML = `
        <div class="post_comment_heading"><h1>${data.user}</h1></div><div class="post_comment_content"><p>${data.text}</p></div>`;
  document.getElementById(`comments_${data.id}`).appendChild(div);
}

function updateBio() {
  let value = document.getElementById("yourstatus").value;
  socket.emit("updateBio", { value: value, user: you.id });
}

document.getElementById("createFriend").addEventListener("click", function () {
  document.getElementById("popup_friend").style.display = "inline";
});

document
  .getElementById("popup_friend_submit")
  .addEventListener("click", function () {
    let x = document.getElementById("popup_friend_input").value;
    createFriend(x, true);
    document.getElementById("popup_friend").style.display = "none";
    document.getElementById("popup_friend_input").value = "";
  });

document
  .getElementById("popup_friend_close")
  .addEventListener("click", function () {
    document.getElementById("popup_friend").style.display = "none";
    document.getElementById("popup_friend_input").value = "";
  });

function showFrProfile(x) {
  socket.emit("getFriendProfile", x);
}

socket.on("showProfile", (data) => {
  document.getElementById("hisname").innerText = data.name;
  document.getElementById("hismail").innerText = `E-mail: ${data.mail}`;
  document.getElementById("hisstatus").innerText = `Bio: "${data.status}"`;
  document.getElementById("popup_friend_profile").style.display = "inline";
});

document
  .getElementById("popup_friend_profile_close")
  .addEventListener("click", function () {
    document.getElementById("popup_friend_profile").style.display = "none";
  });

function gameInvite(him) {
  let fin = "game_";
  for (let i = 0; i < 4; i++) {
    fin += awch.charAt(Math.floor(Math.random() * 52));
  }
  socket.emit("sendingInvite", { him: him, you: you.name, code: fin });
  window.open(`${window.location.href.slice(0, -12)}game_ttt.html?room=${fin}`);
  //window.open(`${window.location.href.slice(0, -12)}game_check.html?room=${fin}`);
}

socket.on("gameInviteAcc", ({t, f, c}) => {
    if (t == you.name){
        if (confirm(`${f} invited you to a game, will you accept?`)) {
            window.open(`${window.location.href.slice(0, -12)}game_ttt.html?room=${c}`);
            //window.open(`${window.location.href.slice(0, -12)}game_check.html?room=${fin}`);
          }
    }
})