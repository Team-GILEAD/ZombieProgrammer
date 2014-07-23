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

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/hero.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "images/monster.png";

// Game objects
var hero = {
	speed: 256 // movement in pixels per second
};
var monster = {};

// Draw everything
var render = function () {
	 if (bgReady) {
	  ctx.drawImage(bgImage, 0, 0);
	 }
 
 	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (monsterReady) {
		ctx.drawImage(monsterImage, monster.x, monster.y);
	}
};

// The main game loop
var main = function () {
 var now = Date.now();
 var delta = now - then;
 
 update(delta / 1000);

render();

 then = now;
 
 // Request to do this again ASAP
	requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Play the game
var then = Date.now();
startGame();
main();

function startGame() {

// here are the functions on the start of the game
    
}