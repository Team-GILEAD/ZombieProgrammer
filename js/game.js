// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 1024;
canvas.height = 480;
document.body.appendChild(canvas);

//Insert background images
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
 bgReady = true;
};
bgImage.src = "images/bg.jpg";

// Draw everything
var render = function () {
 if (bgReady) {
  ctx.drawImage(bgImage, 0, 0);
 }
};

// The main game loop
var main = function () {
 var now = Date.now();
 var delta = now - then;
 
 update(delta / 1000);

render();

 then = now;
};

// Play the game
var then = Date.now();
startGame();
main();

function startGame() {

// here are the functions on the start of the game
    
}