const awch = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

function idCreator() {
  let fin = "";
  for (let i = 0; i < 10; i++) {
    fin += awch.charAt(Math.floor(Math.random() * 52));
  }
  return fin
}

module.exports = idCreator;