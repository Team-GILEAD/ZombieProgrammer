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

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);



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

// Update game objects
var update = function (modifier) {
	if (38 in keysDown) { // Player holding up
	    hero.y -= hero.speed * modifier;	    
	}
	if (40 in keysDown) { // Player holding down
		hero.y += hero.speed * modifier;
	}
	if (37 in keysDown) { // Player holding left
		hero.x -= hero.speed * modifier;
	}
	if (39 in keysDown) { // Player holding right
		hero.x += hero.speed * modifier;
	}

	// Are they touching?
	if (
		hero.x <= (monster.x + 32)
		&& monster.x <= (hero.x + 32)
		&& hero.y <= (monster.y + 32)
		&& monster.y <= (hero.y + 32)
	) {
	    lives--;
		throwNewMonster();
	}

    // Monster Related
	monster.x -= 3;
	if (monster.x < 0) {
	    points += 20
	    throwNewMonster();
	}

    //player related
	if (hero.x < 0) {
	    hero.x = 0;
	}
	if (hero.x > 990) {
	    hero.x = 990;
	}
	if (hero.y < 0) {
	    hero.y = 0;
	}
	if (hero.y > 445) {
	    hero.y = 445;
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
	hero.x = canvas.width / 2;
    hero.y = canvas.height / 2;
    
	// Throw the monster somewhere on the screen randomly
    monster.x = 32 + (Math.random() * (canvas.width - 64));
    monster.y = 32 + (Math.random() * (canvas.height - 64));
}