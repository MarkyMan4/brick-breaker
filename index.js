var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

var ballX = canvas.width / 2;
var ballY = canvas.height - 50;
var padX = canvas.width / 2;
var padY = canvas.height - 30;
var dx = 4;
var dy = -4;
var ballRadius = 10

var leftPressed = false;
var rightPressed = false;

var bricks = [];
var brickWidth = 58;
var brickHeight = 25;

var gameOver = false;

// listen for button presses
document.addEventListener('keydown', function(event) {
	if(event.keyCode == 65) {
		leftPressed = true;
	}
	else if(event.keyCode == 68) {
		rightPressed = true;
	}
});

document.addEventListener('keyup', function(event) {
	if(event.keyCode == 65) {
		leftPressed = false;
	}
	else if(event.keyCode == 68) {
		rightPressed = false;
	}
});

function drawBall() {
	ctx.beginPath();
	ctx.arc(ballX, ballY, ballRadius, 0, Math.PI*2);
	ctx.fillStyle = "blue";
	ctx.fill();
	ctx.closePath();
}

function drawPaddle() {
	ctx.beginPath();
	ctx.rect(padX, padY, 100, 10);
	ctx.fillStyle = "black";	
	ctx.fill();
	ctx.closePath();
}

function initBricks() {
	var brickX = 0;
	var brickY = 0;

	for(var i = 0; i < 30; i++) {
		if(i != 0 && i % 10 == 0) {
			brickY += brickHeight + 2;
			brickX = 0;
		}
		var brick = {x: brickX * 60, y: brickY, broken: false};
		bricks.push(brick);
		brickX++;
	}
}

function updateBricks() {
	for(var i = 0; i < bricks.length; i++) {
		var brick = bricks[i];
		if(!brick.broken) {
			ctx.beginPath();
			ctx.rect(brick.x, brick.y, brickWidth, brickHeight);
			ctx.fillStyle = "red";	
			ctx.fill();
			ctx.closePath();
		}
	}
}

function checkBrickCollision() {
	for(var i = 0; i < bricks.length; i++) {
		var brick = bricks[i];
		
		if(!brick.broken) {
			if(ballX >= brick.x && ballX <= brick.x + brickWidth 
				&& ballY - ballRadius <= brick.y + brickHeight && ballY + ballRadius >= brick.y) {
				if(ballY < brick.y + (brickHeight - 5)) {
					dx *= -1;
				}

				brick.broken = true;
				dy *= -1;
			}
		}
	}
}

function gameOverScreen() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.font = "30px Arial";
	ctx.fillText("Game Over", 10, 50);
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	drawPaddle();
	drawBall();
	updateBricks();

	ballX += dx;
	ballY += dy;

	// ball collides with left or right wall
	if (ballX >= canvas.width || ballX <= 0) {
		dx *= -1;
	}

	// ball collides with top or bottom wall
	if (ballY <= 0) {
		dy *= -1;
	}

	if(ballY > canvas.height) {
		gameOver = true;
		gameOverScreen();
	}

	// ball collides with paddle
	if(ballX <= padX + 50 && ballX >= padX && ballY >= padY) {
		if(dx > 0) {
			dx *= -1;
		}
		dy *= -1;
	}
	
	if(ballX > padX + 50 && ballX <= padX + 100 && ballY >= padY) {
		if(dx < 0) {
			dx *= -1;
		}
		dy *= -1;
	}

	if(leftPressed) {
		padX -= 10;
	}
	else if(rightPressed) {
		padX += 10;
	}

	checkBrickCollision();

	// game loop
	if(!gameOver){
		requestAnimationFrame(draw);
	}
}

initBricks();

