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