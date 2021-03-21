const socket = io();

const gridShow = document.getElementById("side_grid")
const voice = document.getElementById("side_voice")
const startBtn = document.getElementById("start")
const endBtn = document.getElementById("end")
const gridSld = document.getElementById("slider_grid")
const winSld = document.getElementById("slider_win")
const gridText = document.getElementById("gridText")
const winText = document.getElementById("winText")
let you={}

const room = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});
  
socket.emit("gameLoad_ttt", document.cookie);
  
socket.on("userGameFound_ttt", (user) => {
    socket.emit("joinGameRoom_ttt", {
      username: user.name,
      room: room.room,
    });
});

socket.on("yourplace_ttt", (player) => {
    you.player = player
})

let opt_grid = false
let opt_voice = false
let gamermode = false
let folder = "nongamer"
let game_started = false
let gridNum = 28;
let gridSize = 32;
let pointsToWin = 5;
let canvasX = null
let canvasY = null
let gridX = null
let gridY = null
let tiles = []
let wins = -1

canvas = document.getElementById("cvgame")
ctx = canvas.getContext("2d")

const cross = new Image()
cross.src = "img/cross.png"
const circle = new Image()
circle.src = "img/circle.png"
const blue = new Image()
blue.src = "img/blue.png"
const red = new Image()
red.src = "img/red.png"

// main buttons

startBtn.addEventListener("click", function () {
    socket.emit("gameStarted_ttt", you)
})

socket.on("gameStartedClient_ttt", (user)=>{
    startBtn.disabled = true
    endBtn.disabled = false
    game_started = true
    if (opt_voice) {
        let audio = new Audio(`audio/${folder}/start.mp3`);
        audio.play();
    }
    gridSld.disabled = true
    winSld.disabled = true
})

endBtn.addEventListener("click", function () {
    socket.emit("gameEnded_ttt", you)
})

socket.on("gameEndedClient_ttt", (user)=>{
    startBtn.disabled = false
    endBtn.disabled = true
    game_started = false
    game.gameStart()
    if (opt_voice) {
        let audio = new Audio(`audio/${folder}/end.mp3`);
        audio.play();
    }
    //gridSld.disabled = false
    //winSld.disabled = false
})

// side buttons

gridShow.addEventListener("click", function () {
    opt_grid = !opt_grid
    gridShow.innerText = `Helping grid: ${(opt_grid == true) ? "on" : "off"}`
    message(`Grid was turned ${(opt_grid == true) ? "on" : "off"}`)
    if (opt_grid && opt_voice) {
        let audio = new Audio(`audio/${folder}/grid.mp3`);
        audio.play();
    }
})

voice.addEventListener("click", function () {
    if (gamermode != true) {
        opt_voice = !opt_voice
        voice.innerText = `Voiceover: ${(opt_voice == true) ? "on" : "off"}`
        message(`Voiceover ${(opt_voice == true) ? "activated" : "deactivated"}`)
    } else {
        if (opt_voice) {
            let audio = new Audio(`audio/${folder}/voiceover_0${fnc_rand(1, 2)}.mp3`);
            audio.play();
        }
    }
})

// side sliders

gridSld.addEventListener("input", function () {
    gridNum = gridSld.value
    gridSize = (896 / gridNum)
    gridText.innerText = `Grid size: ${gridNum}`
    game.update()
})

winSld.addEventListener("input", function () {
    pointsToWin = winSld.value
    winText.innerText = `Points to win: ${pointsToWin}`
})

// just for fun

document.getElementById("gamer_mode").addEventListener("click", function () {
    gamermode = true
    folder = "gamer"
    document.getElementsByTagName("LINK")[1].setAttribute("href", "css/gamer.css")
    let audio = new Audio('audio/gamer/gamermode.mp3');
    audio.play();
    message(`GAMER MODE ACTIVATED`)
    opt_voice = true
    voice.disabled = false
    voice.innerText = `Voiceover: on`
    message(`Voiceover activated`)
})