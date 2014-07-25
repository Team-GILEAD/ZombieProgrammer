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


var monsters = [];
var monstersNum = 20;

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "images/monster.png";

// Game objects
var hero = {
	speed: 256, // movement in pixels per second
	x: canvas.width / 4,
	y: canvas.height / 2
};
var Monster = (function() {
	function Monster(x,y, speed) {
		this.x = x;
		this.y = y;
		this.speed = speed;
	}
	
	return Monster;
}());

// Release new monster
var throwNewMonster = function () {
    // Throw the monster somewhere on the screen randomly
	monsters.push(new Monster(
		canvas.width + (Math.floor((Math.random() * 900) + 1)), // X position
		32 + (Math.random() * (canvas.height - 64)), // Y position
		(Math.floor((Math.random() * 8) + 1)) // Speed
	));
};

// Filling monsters loops
for (var i = 0; i < monstersNum; i++) {
	throwNewMonster();
}

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode]; //so the player stops after keyup
}, false);



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
	for(var i = 0; i < monsters.length; i++) {
		if (
			hero.x <= (monsters[i].x + 32)
			&& monsters[i].x <= (hero.x + 32)
			&& hero.y <= (monsters[i].y + 32)
			&& monsters[i].y <= (hero.y + 32)
		) {
			lives--;
			monsters.splice(i,1);
			throwNewMonster();
		}
	}
	
    /* 
	~Monster related~
	Throw a monster condition
	*/
	for(var i = 0; i < monsters.length; i++) {
		monsters[i].x -= monsters[i].speed;
		if (monsters[i].x < 0) {
			points += 20;
			monsters.splice(i, 1); //remove monsters which are out of playground
			throwNewMonster();
		}
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
		for(var i = 0; i < monsters.length; i++) {
			ctx.drawImage(monsterImage, monsters[i].x, monsters[i].y);
		}
	}
	
	// Score and Lives
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	
	
	if (lives === 0) {
	    ctx.font = "32px Helvetica";
	    ctx.fillText("Game Over! Your score: " + points, 335, 220);
	}
	else {
		ctx.fillText("Lives: " + lives + "   Points: " + points, 32, 32);	
	}
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;
	
	//Lives checker
	if (lives > 0) {
		update(delta / 1000);
		render();
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

main();