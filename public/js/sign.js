const socket = io();

document.getElementById("sign").addEventListener("click", () => {
  document.getElementById("create").style.display = "block";
});

socket.on("goTo", ({ link, id }) => {
  document.cookie = id;
  console.log(decodeURIComponent(document.cookie))
  window.open(`${window.location.href}${link}`);
});

document.getElementById("form_login").addEventListener("submit", function(e){
    e.preventDefault()
    let user = {
        mail: document.getElementById("mail").value,
        pwd: document.getElementById("pwd").value,
      };
    socket.emit("logUser", user);
})

document.getElementById("form_create").addEventListener("submit", function(e){
    e.preventDefault()
    let user = {
        name: document.getElementById("sname").value,
        mail: document.getElementById("smail").value,
        pwd: document.getElementById("spwd").value,
        room: ["rm_all"],
        friend: ["user_admin"],
        status: "Nothing"
      };
      document.getElementById("create").style.display = "none";
      socket.emit("createUser", user);
})