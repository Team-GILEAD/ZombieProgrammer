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

//Game Over image
var overImg = new Image();        
overImg.src = "images/mcDon.jpg"; 

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
var heroImageSrcRight = "images/heroRight.png";
var heroImageSrcLeft = "images/heroLeft.png";
heroImage.src = heroImageSrcRight;

// Invaders image
var invaderReady = false;
var invaderImage = new Image();
invaderImage.onload = function () {
	invaderReady = true;
};
invaderImage.src = "images/invader.png";

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
var register = new Audio("sounds/register.mp3");
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

// Invaders objects
var invaders = [];
var invadersNum = 20;

var Invader = (function() {
	function Invader(x,y,speed, img) {
		this.x = x;
		this.y = y;
		this.speed = speed;
		this.img = img;
	}
	return Invader;
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
// Release new invader
var throwNewInvader = function () {
    // Throw the invader somewhere on the screen randomly
	
	invaders.push(new Invader(
		canvas.width + (Math.floor((Math.random() * 900) + 1)), // X position
		15 + (Math.random() * (canvas.height - 64)), // Y position
		(Math.floor((Math.random() * 8) + 1)), // Speed
		(Math.floor((Math.random() * 3) + 1)) // Image
	));
};

// Filling invaders loops
for (var i = 0; i < invadersNum; i++) {
	throwNewInvader();
}

// Release new brain
var throwNewBrain = function () {
    // Throw the invader somewhere on the screen randomly
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
			heroImage.src = heroImageSrcRight;
		}
		if (40 in keysDown) { // Player holding down
			hero.y += hero.speed * modifier;
			heroImage.src = heroImageSrcRight;
		}
		if (37 in keysDown) { // Player holding left
			hero.x -= hero.speed * modifier;
			heroImage.src = heroImageSrcLeft;
		}
		if (39 in keysDown) { // Player holding right
			hero.x += hero.speed * modifier;
			heroImage.src = heroImageSrcRight;
		}
		if (80 in keysDown) {
			pause = true;
		}

		/* 
		~Check for collision~
		32 is pixel distance: center to edge of objects
		*/
		// Invaders collision
		for(var i = 0; i < invaders.length; i++) {
			if (
				hero.x <= (invaders[i].x + 34)
				&& invaders[i].x <= (hero.x + 48)
				&& hero.y <= (invaders[i].y + 34)
				&& invaders[i].y <= (hero.y + 48)
			) {
				playerLives--;
				invaders.splice(i,1);
				throwNewInvader();
				pain.currentTime = 0;
				pain.play();
			}
		}
		// Brains Collision
		for(var i = 0; i < brains.length; i++) {
			if (
				hero.x <= (brains[i].x + 48)
				&& brains[i].x <= (hero.x + 48)
				&& hero.y <= (brains[i].y + 34)
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
				&& hero.y <= (lives[i].y + 34)
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
		~Invaders related~
		Throw a invader condition
		*/
		for(var i = 0; i < invaders.length; i++) {
			invaders[i].x -= invaders[i].speed;
			if (invaders[i].x < 0) {
				points += 20;
				invaders.splice(i, 1); //remove invaders which are out of playground
				throwNewInvader();
			}
		}
		
		/* 
		~Brains related~
		Throw a brain condition
		*/
		for(var i = 0; i < brains.length; i++) {
			brains[i].x -= brains[i].speed;
			if (brains[i].x < 0) {
				brains.splice(i, 1); //remove invaders which are out of playground
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
				lives.splice(i, 1); //remove invaders which are out of playground
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
	if (invaderReady) {
		for(var i = 0; i < invaders.length; i++) {			
			ctx.drawImage(invaderImage, invaders[i].x, invaders[i].y);
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
		ctx.drawImage(overImg, 180, 0);
		ctx.font = "32px Helvetica";
		ctx.fillStyle = "#ff0000"; 
	    ctx.fillText("Game Over! Your score: " + points, 335, 220);
		pain.currentTime = 0;
		register.play();
		soundtrack.currentTime = 180;
	}
	else {
		ctx.fillText("Lives: " + playerLives + "   Points: " + points, 32, 32);	
	}
	
	if (points > 5000){
		heroImageSrcRight = "images/oldHeroRight.png";
		heroImageSrcLeft = "images/oldHeroLeft.png";	
	}
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;
	
	//Lives checker
	if (playerLives > 0) {
		update(delta/1000);
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