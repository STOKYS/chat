'use strict';
const fs = require('fs');

document.getElementById("sign").addEventListener("click", ()=>{
    document.getElementById("create").style.display = "block"
})

document.getElementById("created").addEventListener("click", ()=>{
    let user = {
        name: document.getElementById("sname").value,
        mail: document.getElementById("smail").value,
        pwd: document.getElementById("spwd").value
    }
    let success = check_valid(user)
    document.getElementById("create").style.display = "none"
    new_acc(user)
})

function new_acc(user){
    let data = JSON.stringify(user)
    fs.writeFileSync('student-2.json', data);
}

function check_valid(){

}