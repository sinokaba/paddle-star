var gameDifficulty, name, customization, canvas, canvasContext;
var ballSpeedX, ballSpeedY, playerPaddleHeight, cpuPaddleHeight;
var paddle1Y, paddle2Y, ballSize, cpuPaddleSpeed;
var player2Score = 0;
var player1Score = 0;
var life = 3;
var moreLife = false;
var usePowerUp = false;
var powerUp = Math.floor(Math.random() * 2);
var whichPowerUp = Math.random();
var powerUpLocation = Math.floor(Math.random() * 4);
var endGameScreen = false;
var highscore1 = 0;
var highscore2 = 0;
var highscore3 = 0;
var ballX = 400;
var ballY = 290;
var play = false;
var highscores = false;

//sounds effects
var background_music, hitSound, missSound, bounceSound, powerUpSound;
//other constant variables
const paddle1X = 10;
const paddle2X = 780;
const paddle_length = 10;

//loads the game when the page is done loading
window.onload = function() {
    background_music = createSoundEffects("sound/background_music_bensound.mp3", .6);
    background_music.play();    
    $("#startButton").click(function() {
        $(this).css("display", "none");
        $("#menuScreen").css("visibility", "visible");

    });
    $(document).keydown(function(event) {
        if (event.which == 13) {
            $("#startButton").trigger('click');
        }
    });
    $("#playButton").click(function() {
        background_music.pause();
        if (gameDifficulty == null || name == null || customization == null) {
            alert("You didn't hit confirm")
        } else {
            $("#menuScreen").css("visibility", "hidden");
            $("#playButton").css("display", "none");
            play = true;
        }
        startGame();
    });
    $("#instructionsButton").click(function() {
        $("#menuScreen").css("visibility", "hidden");
        $("#inst").css("visibility", "visible");
        $("#instruc").css("visibility", "visible");
        $("#goBack").css("visibility", "visible");

    });
    $("#goBack").click(function() {
        $("#inst").css("visibility", "hidden");
        $("#instruc").css("visibility", "hidden");
        $(this).css("visibility", "hidden");
        $("#menuScreen").css("visibility", "visible");
    })
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');
    //creates the canvas canvas
    createRect(0, 0, canvas.width, canvas.height, "black");
    //controls animation of drawn objects in canvas

    //drawing image
    //Loading of the home test image - img1
    var img1 = new Image();
    //drawing of the test image - img1
    img1.onload = function () {
        //draw background image
        canvasContext.drawImage(img1, 0, 0);
        //draw a box over the top
        //canvasContext.fillStyle = "rgba(200, 0, 0, 0.5)";
        //canvasContext.fillRect(0, 0, 500, 500);
    };
    img1.src = 'tennis_player.png';

    var gameTitle = canvasContext.createLinearGradient(0, 0, canvas.width, 0);
    gameTitle.addColorStop("1.0", "white");
    canvasContext.font = "italic bold 64px Courier New";
    canvasContext.fillStyle = gameTitle;
    canvasContext.fillText("Paddle Star", 200, 70);
    canvasContext.font = "64px Courier New";

    hitSound = createSoundEffects("sound/ball_hit.mp3", .7);
    missSound = createSoundEffects("sound/miss.mp3", .7);
    bounceSound = createSoundEffects("sound/ball_bounce.mp3", .3);
    powerUpSound = createSoundEffects("sound/powerUp.mp3", .3);
};

function startGame(){
    var fps = 30;
    setInterval(function() {
        moveEverything(), drawEverything()
    }, 1000 / fps);
    $("#playAgainButton").click(function() {
        mouseClickPlay();
    });
    //calls mousemove function so player can control the paddle with mouse
    canvas.addEventListener("mousemove", function(e) {
        var mousePos = calcMousePos(e);
        paddle1Y = mousePos.y - (playerPaddleHeight / 2);
    });
}

function level() {
    gameDifficulty = document.getElementById('difficulty').options[document.getElementById('difficulty').selectedIndex].text;
    console.log(gameDifficulty);
    setBallSpeed(gameDifficulty);
	if (gameDifficulty == "Easy") {
        playerPaddleHeight = 230;
        cpuPaddleHeight = 90;
        paddle1Y = (580 / 2) - (playerPaddleHeight / 2);
        paddle2Y = 290;
        ballSize = 25;
        cpuPaddleSpeed = 6;
    } else if (gameDifficulty == "Normal") {
        playerPaddleHeight = 120;
        cpuPaddleHeight = 120;
        paddle1Y = (580 / 2) - (playerPaddleHeight / 2);
        paddle2Y = (580 / 2) - (cpuPaddleHeight / 2);
        ballSize = 12;
        cpuPaddleSpeed = 9;
    } else if (gameDifficulty == "Hard") {
        playerPaddleHeight = 90;
        cpuPaddleHeight = 145;
        paddle1Y = (580 / 2) - (playerPaddleHeight / 2);
        paddle2Y = (580 / 2) - (cpuPaddleHeight / 2);
        ballSize = 8;
        cpuPaddleSpeed = 12.5;
    } else if (gameDifficulty == "Godmode") {
        playerPaddleHeight = 70;
        cpuPaddleHeight = 185;
        paddle1Y = (580 / 2) - (playerPaddleHeight / 2);
        paddle2Y = (580 / 2) - (cpuPaddleHeight / 2);
        ballSize = 5;
        cpuPaddleSpeed = 16.5;
    }
};

function setBallSpeed(gameDifficulty) {
    if (gameDifficulty == "Easy") {
        ballSpeedX = 5;
        ballSpeedY = 5;
    } else if (gameDifficulty == "Normal") {
        ballSpeedX = 9;
        ballSpeedY = 9;
    } else if (gameDifficulty == "Hard") {
        ballSpeedX = 16;
        ballSpeedY = 16;
    } else if (gameDifficulty == "Godmode") {
        ballSpeedX = 20;
        ballSpeedY = 20;
    }
};

function createSoundEffects(soundSrc, vol){
	var sound = document.createElement("audio");
	sound.src = soundSrc;
	sound.volume = vol;
	sound.autoPlay = false;
	sound.preLoad = true;
	return sound;
}

function custom() {
    customization = document.getElementById('customs').options[document.getElementById('customs').selectedIndex].text;
    console.log(customization);
};
//gets location of mouse
function calcMousePos(e) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = e.clientX - rect.left - root.scrollLeft;
    var mouseY = e.clientY - rect.top - (root.scrollTop);
    return {
        x: mouseX,
        y: mouseY
    };

};

function getName() {
    var x = document.forms["playerName"]["username"].value;
    if (x == null || x == "") {
        alert("Name must be filled out");
        return false;
    } else {
        name = (document.getElementById('userName').value).toUpperCase();
    }
};

function mouseClickPlay() {
    if (endGameScreen) {
        $('#playAgainButton').css("visibility", "hidden");
        $("#highscores").css("visibility", "hidden");
        $("#backMenuButton").css("visibility", "hidden");
        background_music.pause();
        player1Score = 0;
        player2Score = 0;
        life = 3;
        endGameScreen = false;
        if (gameDifficulty == "Normal") {
            playerPaddleHeight = 120;
        } else if (gameDifficulty == "Easy") {
            playerPaddleHeight = 250;
        } else if (gameDifficulty == "Hard") {
            playerPaddleHeight = 90;
        } else if (gameDifficulty == "Godmode") {
            playerPaddleHeight = 70;
        }
    }
};

//function that resets the ball
function ballReset(scored) {
    powerUp = Math.floor(Math.random() * 2);
    usePowerUp = false;
    whichPowerUp = Math.random();
    powerUpLocation = Math.floor(Math.random() * 4);
    setBallSpeed(gameDifficulty);
    if(scored){
    	ballSpeedX = -ballSpeedX;
    }
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
}
//function that creates the cpu ai, the cpu paddle moves depending on the location of the paddle relative to the location of the cpu paddle
function CPUMovement() {
    paddle2Center = paddle2Y + (cpuPaddleHeight / 2);
    if (paddle2Center < ballY - 40) {
        paddle2Y += cpuPaddleSpeed;
    } else if (paddle2Center > ballY + 40) {
        paddle2Y -= cpuPaddleSpeed;
    }
};

function moveEverything() {
    if (play == false) {
        return;
    }
    if (life == 0) {
        endGameScreen = true;
    }
    //stops game when player runs out of lives
    if (endGameScreen) {
        return;
    }
    //makes the ball bounce
    CPUMovement();
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    //determines if the ball reaches the start of the x plane, and if it comes into contact with the paddle, if it does it bounces off and it's speed is reversed
    if (ballX <= (15 + ballSize)) {
        if (ballY > (paddle1Y - ballSize) && ballY < (paddle1Y + playerPaddleHeight + ballSize)) {
            ballSpeedX = -ballSpeedX;
            hitSound.play();
            var deltaY = ballY - (paddle1Y + (playerPaddleHeight / 2))
            //changes the change in speed according to the size of the paddle, so the ball doesn't become too uncontrollable and fast when the player paddle becomes too big			
            if (playerPaddleHeight >= 150) {
                ballSpeedY = deltaY * 0.15;
            } else if (playerPaddleHeight >= 250) {
                ballSpeedY = deltaY * 0.09;
            } else {
                ballSpeedY = deltaY * 0.35;
            }
        } else {
            //if the player is unable to hit the ball with the paddle the cpu scores
            player2Score++;
            missSound.play();
            ballReset(1);
            life--;
        }
    } else if (ballX >= (canvas.width - (15 + ballSize))) {
        //determines if the ball is hit by the paddle, and changes it's speed in regards to where it hits the paddle(if it gets hit at the end it becomes fast, makes for easier scoring for highest skilled players)
        if (ballY > (paddle2Y - ballSize) && ballY < (paddle2Y + cpuPaddleHeight + ballSize)) {
            ballSpeedX = -ballSpeedX;
            hitSound.play();
            var deltaY = ballY - (paddle2Y + (cpuPaddleHeight / 2))
            if (playerPaddleHeight >= 150) {
                ballSpeedY = deltaY * 0.15;
            } else {
                ballSpeedY = deltaY * 0.35;
            }
        } else {
            //if the cpu is unable to return the ball, the player gets a score
            player1Score++;

            missSound.play();
            ballReset(0);
        }
    };
    //determines vertical(Y) position of the ball, and reverses it's speed, to make it bounce, if it reaches the lowest and highest boundary
    if (ballY <= 27) {
        ballSpeedY = -ballSpeedY;
        bounceSound.play();
    } else if (ballY >= canvas.height - 27) {
        ballSpeedY = -ballSpeedY;
        bounceSound.play();
    }
};
//function that draws net, uses for loop to equally seperate the triangles, at an interval of 40 px.
function drawNet() {
    for (var i = 0; i < canvas.height; i += 40) {
        if (customization == "Original") {
            createRect(canvas.width / 2 - 1, i, 4, 20, "white");
        } else if (customization == "Inverted") {
            createRect(canvas.width / 2 - 1, i, 4, 20, "black");

        } else if (customization == "Dangerous Red") {
            createRect(canvas.width / 2 - 1, i, 4, 20, "red");
        } else if (customization == "Cool Blue") {
            createRect(canvas.width / 2 - 1, i, 4, 20, "blue");

        }
    }
};

function drawEverything() {
    if(customization == "Original") {
        createRect(0, 0, canvas.width, canvas.height, "black");
    } 
    else if (customization == "Inverted") {
        createRect(0, 0, canvas.width, canvas.height, "white");
    }
    if(play == false) {
        return;
    }
    //determines if player ran out of lives and that the game is over, if it is it freezes everything and displays end game screen
    if(endGameScreen) {
        var gradient = canvasContext.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop("1.0", "red");
        canvasContext.font = "bold 72px Roboto";
        canvasContext.fillStyle = gradient;
        canvasContext.fillText("GAME OVER", 240, 470);

        background_music.play();
        $("#playAgainButton").css("visibility", "visible");
        $("#backMenuButton").css("visibility", "visible");
        canvasContext.font = "italic bold 36px Roboto";
        if(player1Score == 1) {
            canvasContext.fillText("WELL DONE! You scored " + player1Score + " time!", 240, 520);
        } 
        else{
            canvasContext.fillText("WELL DONE! You scored " + player1Score + " times!", 240, 520);
        }

        var highscoreColor = canvasContext.createLinearGradient(0, 0, canvas.width, 0);
        if(customization == "Inverted") {
            highscoreColor.addColorStop("1.0", "black");
        }
        else{
	        highscoreColor.addColorStop("1.0", "white");
        }
        //creating text for high scores in end game screen
        canvasContext.font = "italic bold 64px Courier New";
        canvasContext.fillStyle = highscoreColor;
        canvasContext.fillText("Highscores: ", 60, 50);
        canvasContext.font = "37px Courier New";
        if(player1Score >= highscore1) {
            highscore1 = player1Score;
        } 
        else if(player1Score >= highscore2) {
            highscore2 = player1Score;
        } 
        else if(player1Score >= highscore3) {
            highscore3 = player1Score;
        }
        canvasContext.fillText("1. " + name + " - " + highscore1 + " Points", 75, 130);
        canvasContext.fillText("2. " + name + " - " + highscore2 + " Points", 75, 175);
        canvasContext.fillText("3. " + name + " - " + highscore3 + " Points", 75, 220);
        return;
    }
    //creates left player paddle
    drawPaddles();

    //gives the current # of lvies and score of the cpu and player
    $("#playerScore").text(name + "'s Score: " + player1Score);
    $("#cpuScore").text("Cpu Score: " + player2Score);
    canvasContext.font = "bold 24px Roboto";
    canvasContext.fillText(name + "'S LIVES: " + life, 25, 40);
    canvasContext.font = "bold 20px Roboto";
    canvasContext.fillText("SCORE: " + player1Score, 25, 70);

    //PowerUps 
    if (player1Score != 0) {
        if (player1Score % 3 == 0 && usePowerUp == false && powerUp == 1) {
            //extra life powerup, rarer than increase length powerup
            //computes pseudo-random number from 0-3, 4 is excluded because it rounds down
            if (whichPowerUp <= 0.1) {
            	createExtraLifePU();
            }
            //increase length powerup
            else {
            	createPaddlePU();
            }

        }
    }

};

function drawPaddles(){
    if (customization == "Original") {
        createRect(paddle1X, paddle1Y, paddle_length, playerPaddleHeight, "white");
        //creates cpu paddle
        createRect(paddle2X, paddle2Y, paddle_length, cpuPaddleHeight, "white");
        //call function that creates net
        drawNet();
        //creates ball
        createCircle(ballX, ballY, ballSize, "white");
    } else if (customization == "Inverted") {
        createRect(paddle1X, paddle1Y, paddle_length, playerPaddleHeight, "black");
        createRect(paddle2X, paddle2Y, paddle_length, cpuPaddleHeight, "black");
        drawNet();
        createCircle(ballX, ballY, ballSize, "black");
    } else if (customization == "Dangerous Red") {
        createRect(paddle1X, paddle1Y, paddle_length, playerPaddleHeight, "red");
        createRect(paddle2X, paddle2Y, paddle_length, cpuPaddleHeight, "red");
        drawNet();
        createCircle(ballX, ballY, ballSize, "red");
    } else if (customization == "Cool Blue") {
        createRect(paddle1X, paddle1Y, paddle_length, playerPaddleHeight, "blue");
        createRect(paddle2X, paddle2Y, paddle_length, cpuPaddleHeight, "blue");
        drawNet();
        createCircle(ballX, ballY, ballSize, "blue");
    }
}

function createExtraLifePU(){
    canvasContext.beginPath();
    canvasContext.fillStyle = "red";
    canvasContext.font = "bold 18px Roboto";
    canvasContext.fillText("Power Up Available. Hit it and get an extra life!", 410, 40);
    canvasContext.fillText("It will dissapear once you score.", 410, 60);
    if (powerUpLocation == 0) {
        canvasContext.arc(450, 290, 23, 0, Math.PI * 2, true);
        canvasContext.fill();
        if (ballX >= 420 && ballX <= 480 && ballY >= 260 && ballY <= 320) {
            life++;
            usePowerUp = true;
            powerUpSound.play();
        }
    }
    if (powerUpLocation == 1) {
        canvasContext.arc(220, 200, 23, 0, Math.PI * 2, true);
        canvasContext.fill();
        if (ballX >= 190 && ballX <= 250 && ballY >= 170 && ballY <= 230) {
            life++;
            usePowerUp = true;
            powerUpSound.play();
        }
    }
    if (powerUpLocation == 2) {
        canvasContext.arc(665, 380, 23, 0, Math.PI * 2, true);
        canvasContext.fill();
        if (ballX >= 635 && ballX <= 695 && ballY >= 350 && ballY <= 410) {
            life++;
            usePowerUp = true;
            powerUpSound.play();
        }
    }
    if (powerUpLocation == 3) {
        canvasContext.arc(100, 290, 23, 0, Math.PI * 2, true);
        canvasContext.fill();
        if (ballX >= 70 && ballX <= 130 && ballY >= 260 && ballY <= 320) {
            life++;
            usePowerUp = true;
            powerUpSound.play();
        }
    }
}

function createPaddlePU(){
    canvasContext.fillStyle = "red";
    canvasContext.font = "bold 18px Roboto";
    canvasContext.fillText("Power Up Available. Hit it to increase paddle size!", 410, 40);
    canvasContext.fillText("It will dissapear once you score.", 410, 60);
    if (powerUpLocation == 0) {
        createRect(150, 450, 25, 25, "green");
        if (ballX >= 125 && ballX <= 170 && ballY >= 425 && ballY <= 470) {
            playerPaddleHeight += (playerPaddleHeight * .3);
            usePowerUp = true;
            powerUpSound.play();
        }
    }
    if (powerUpLocation == 1) {
        createRect(390, 75, 25, 25, "green");
        if (ballX >= 365 && ballX <= 410 && ballY >= 50 && ballY <= 95) {
            playerPaddleHeight += (playerPaddleHeight * .3);
            usePowerUp = true;
            powerUpSound.play();
        }
    }
    if (powerUpLocation == 2) {
        createRect(750, 260, 25, 25, "green");
        if (ballX >= 725 && ballX <= 770 && ballY >= 235 && ballY <= 280) {
            playerPaddleHeight += (playerPaddleHeight * .3);
            usePowerUp = true;
            powerUpSound.play();
        }
    }
    if (powerUpLocation == 3) {
        createRect(575, 310, 25, 25, "green");
        if (ballX >= 550 && ballX <= 595 && ballY >= 285 && ballY <= 330) {
            playerPaddleHeight += (playerPaddleHeight * .3);
            usePowerUp = true;
            powerUpSound.play();
        }
    }
}

//function for creating circles{
function createCircle(centerX, centerY, radius, drawColor) {
    canvasContext.beginPath();
    canvasContext.fillStyle = drawColor;
    //make circle (x,y,radius,start angle, end angle,(False)clockwise or (true)counterclockwise)
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    canvasContext.fill();

};
//function for creating rectangle images
function createRect(leftX, topY, width, height, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.fillRect(leftX, topY, width, height);
};