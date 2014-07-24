var points = 0;
var lives = 3; //start lives

// Create the canvas on the body
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 1024;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
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

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode]; //so the player stops after keyup
}, false);

// Release new monster when player go thru previous one
var throwNewMonster = function () {
	
    // Throw the monster somewhere on the screen randomly
    monster.x = canvas.width;
    monster.y = 32 + (Math.random() * (canvas.height - 64));
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

	/* 
	~Check for collision~
	32 is pixel distance: center to edge of objects
	*/
	if (
		hero.x <= (monster.x + 32)
		&& monster.x <= (hero.x + 32)
		&& hero.y <= (monster.y + 32)
		&& monster.y <= (hero.y + 32)
	) {
		lives--;
		throwNewMonster();
	}

    /* 
	~Monster related~
	Throw a monster condition
	*/
	monster.x -= 3;
	if (monster.x < 0) {
		points += 20;
	    throwNewMonster();
	}

    /* 
	~Player related~
	Keeps the player in the playground
	*/
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

// Draw
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

	// Score and Lives
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Lives: " + lives + "   Points: " + points, 32, 32);	
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;
	
	//Lives checker
	if (lives >0) {
	update(delta / 1000);
	render();
	}	
	else if (lives === 0) {
	    ctx.fillStyle = "rgb(250, 250, 250)";
	    ctx.font = "32px Helvetica";
	    ctx.fillText("Game Over! Your score: " + points, 32,32);
	}
	
	
	then = now;

	// Request to do this again ASAP
	requestAnimationFrame(main);
};

// Cross-browser support
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