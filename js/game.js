var points = 0;
var playerLives = 3; //start lives
var pause = false;

// Create the canvas on the body
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 1024;
canvas.height = 480;
document.body.appendChild(canvas);

/*
----------------------
---- Game Images -----
----------------------
*/
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
heroImage.src = "images/heroRight.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "images/monster.png";

// Brain image
var brainReady = false;
var brainImage = new Image();
brainImage.onload = function () {
	brainReady = true;
};
brainImage.src = "images/brain.png";

// Life image 
var lifeReady = false;
var lifeImage = new Image();
lifeImage.onload = function () {
	lifeReady = true;
};
lifeImage.src = "images/life.png";

/*
----------------------
---- Game sounds ----
----------------------
*/

var blop = new Audio("sounds/blop.mp3");
var gong = new Audio("sounds/gong.mp3");
var pain = new Audio("sounds/pain.mp3");
var soundtrack = new Audio("sounds/soundtrack.mp3");

/*
----------------------
---- Game objects ----
----------------------
*/
// Hero object
var hero = {
	speed: 256, // movement in pixels per second
	x: canvas.width / 4,
	y: canvas.height / 2
};

// Monsters objects
var monsters = [];
var monstersNum = 20;

var Monster = (function() {
	function Monster(x,y,speed) {
		this.x = x;
		this.y = y;
		this.speed = speed;
	}
	return Monster;
}());

// Brains objects
var brains = [];
var brainsNum = 3;

var Brain = (function(){
	function Brain(x,y,speed) {
		this.x = x;
		this.y = y;
		this.speed = speed
	}
	return Brain;
}())

// Lives objects
var lives = [];
var livesNum = 1;

var Life = (function(){
	function Life(x,y,speed) {
		this.x = x;
		this.y = y;
		this.speed = speed
	}
	return Life;
}())

/* 
-------------------
--Release objects--
-------------------
*/
// Release new monster
var throwNewMonster = function () {
    // Throw the monster somewhere on the screen randomly
	monsters.push(new Monster(
		canvas.width + (Math.floor((Math.random() * 900) + 1)), // X position
		15 + (Math.random() * (canvas.height - 64)), // Y position
		(Math.floor((Math.random() * 8) + 1)) // Speed
	));
};

// Filling monsters loops
for (var i = 0; i < monstersNum; i++) {
	throwNewMonster();
}

// Release new brain
var throwNewBrain = function () {
    // Throw the monster somewhere on the screen randomly
	brains.push(new Brain(
		canvas.width + (Math.floor((Math.random() * 900) + 1)), // X position
		15 + (Math.random() * (canvas.height - 64)), // Y position
		(Math.floor((Math.random() * 8) + 5)) // Speed
	));
};

// Filling brains loops
for (var i = 0; i < brainsNum; i++) {
	throwNewBrain();
}

// Release new life
var throwNewLife = function () {
    // Throw the life somewhere on the screen randomly
	lives.push(new Life(
		canvas.width + (Math.floor((Math.random() * 900) + 1)), // X position
		15 + (Math.random() * (canvas.height - 64)), // Y position
		(Math.floor((Math.random() * 8) + 5)) // Speed
	));
};

// Filling lives loops
for (var i = 0; i < livesNum; i++) {
	throwNewLife();
}


// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function(e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function(e) {
	delete keysDown[e.keyCode]; //so the player stops after keyup
}, false);

// Update game objects
var update = function (modifier) {
	if (pause === false) {
			
		if (38 in keysDown) { // Player holding up
			hero.y -= hero.speed * modifier;	
			heroImage.src = "images/heroRight.png";
		}
		if (40 in keysDown) { // Player holding down
			hero.y += hero.speed * modifier;
			heroImage.src = "images/heroRight.png";
		}
		if (37 in keysDown) { // Player holding left
			hero.x -= hero.speed * modifier;
			heroImage.src = "images/heroLeft.png";
		}
		if (39 in keysDown) { // Player holding right
			hero.x += hero.speed * modifier;
			heroImage.src = "images/heroRight.png";
		}
		if (80 in keysDown) {
			pause = true;
		}

		/* 
		~Check for collision~
		32 is pixel distance: center to edge of objects
		*/
		// Monsters collision
		for(var i = 0; i < monsters.length; i++) {
			if (
				hero.x <= (monsters[i].x + 48)
				&& monsters[i].x <= (hero.x + 48)
				&& hero.y <= (monsters[i].y + 48)
				&& monsters[i].y <= (hero.y + 48)
			) {
				playerLives--;
				monsters.splice(i,1);
				throwNewMonster();
				pain.currentTime = 0;
				pain.play();
			}
		}
		// Brains Collision
		for(var i = 0; i < brains.length; i++) {
			if (
				hero.x <= (brains[i].x + 48)
				&& brains[i].x <= (hero.x + 48)
				&& hero.y <= (brains[i].y + 48)
				&& brains[i].y <= (hero.y + 48)
			) {
				points += 1000;
				brains.splice(i,1);
				throwNewBrain();
				blop.currentTime = 0;
				blop.play();
			}
		}
		// Lives Collision
		for(var i = 0; i < lives.length; i++) {
			if (
				hero.x <= (lives[i].x + 48)
				&& lives[i].x <= (hero.x + 48)
				&& hero.y <= (lives[i].y + 48)
				&& lives[i].y <= (hero.y + 48)
			) {
				playerLives++;
				lives.splice(i,1);
				throwNewLife();
				blop.currentTime = 0;
				blop.play();
			}
		}
		
		
		/* 
		~Monsters related~
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
		~Brains related~
		Throw a brain condition
		*/
		for(var i = 0; i < brains.length; i++) {
			brains[i].x -= brains[i].speed;
			if (brains[i].x < 0) {
				brains.splice(i, 1); //remove monsters which are out of playground
				throwNewBrain();
			}
		}
		
		/* 
		~Lives related~
		Throw a life condition
		*/
		for(var i = 0; i < lives.length; i++) {
			lives[i].x -= lives[i].speed;
			if (lives[i].x < 0) {
				lives.splice(i, 1); //remove monsters which are out of playground
				throwNewLife();
			}
		}

		/* 
		~Player related~
		Keeps the player in the playground
		*/
		if (hero.x < 0) {
			hero.x = 0;
		}
		if (hero.x > 976) {
			hero.x = 976;
		}
		if (hero.y < 0) {
			hero.y = 0;
		}
		if (hero.y > 432) {
			hero.y = 432;
		}
	}
	else {
		if (80 in keysDown) {
			pause = false;
		}
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
	if (brainReady) {
		for(var i = 0; i < brains.length; i++) {
			ctx.drawImage(brainImage, brains[i].x, brains[i].y);
		}
	}
	if (lifeReady) {
		for(var i = 0; i < lives.length; i++) {
			ctx.drawImage(lifeImage, lives[i].x, lives[i].y);
		}
	}
	
	// Score and Lives
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	
	
	if (playerLives === 0) {
	    ctx.font = "32px Helvetica";
	    ctx.fillText("Game Over! Your score: " + points, 335, 220);
		pain.currentTime = 0;
		gong.play();
		soundtrack.currentTime = 180;
	}
	else {
		ctx.fillText("Lives: " + playerLives + "   Points: " + points, 32, 32);	
	}
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;
	
	//Lives checker
	if (playerLives > 0) {
		update(delta / 1000);
		render();
		soundtrack.play();
		
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