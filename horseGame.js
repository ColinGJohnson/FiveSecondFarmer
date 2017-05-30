// Global Vars
var canvas;
var ctx;
var W; // window width
var H; // Window's height
var horse = {}; // horse object
var mouse = {}; // Mouse object to store it's current position
var infoBar = {}; // bottom bar object
var points = 0; // Store points
var fps = 60; // Max FPS (frames per second)
var startBtn = {}; // Start button object
var restartBtn = {}; // Restart button object
var over = 1; // flag that is changed when the time runs out
var init; // variable to initialize animation

var menuBtn = {}; // temporary win button
var win = false; // true when the current mini game has been won
var winRound = true; // true when the current game has been completed

var lossType = -1; // determines the way the user lost for message

var currentGame = 0; // tracks the game currently being played 
var gameFinished = true;
var frameCount = 0; // tracks the number of frames passed 
var timeLeft = 0; // tracks the time left for the current mini game
var play = 0; // ensures that the timer and game selection does not run on the menu 
var clear; // stores the ID of the interval used for the timer

var appleOnePlaces = false;
var appleTwoPlaced = false;
var appleThreePlaced = false;

//position of the first apples
var apple1PosX = 0;
var apple1PosY = 0;

//positiong of apples
var apple2PosX = 0;
var apple2PosY = 0;
var apple3PosX = 0;
var apple3PosY = 0;

//unicorn head positioning
var horsePosX = 0;
var horsePosY = 0;

//to store the mouse position
var mouseX;
var mouseY;

//tracks the number of times each game 
var timesCalled1 = 1;
var timesCalled2 = 1;
var timesCalled3 = 1;
var timesCalled4 = 1;

// correct keys to press for game three
var keyGoals = ['A', 'S', 'D', 'F', 'A', 'F', 'S', 'F', 'S', 'A', 'D', 'D'];

// array to store what keys the user has pressed for game three
var keyResults = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

// stores the last pressed key for the user for game three
var keyAttempt = 'Z';

// stores the user's progress through the key array for game three
var keyProgress = 0;

//load images
var sky = new Image();
sky.src = 'Images/sky.jpg';

var logo = new Image();
logo.src = 'Images/logo.png';

var instructionsImg = new Image();
instructionsImg.src = 'Images/instructions.png';


// RequestAnimFrame: a browser API for getting smooth animations
window.requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback) {
            return window.setTimeout(callback, 1000 / 60);
        };
})();

window.cancelRequestAnimFrame = (function() {
    return window.cancelAnimationFrame ||
        window.webkitCancelRequestAnimationFrame ||
        window.mozCancelRequestAnimationFrame ||
        window.oCancelRequestAnimationFrame ||
        window.msCancelRequestAnimationFrame ||
        clearTimeout
})();

// initialize the game in canvas
function init() {

    canvas = document.getElementById("canvas");

    ctx = canvas.getContext("2d");
    W = (window.innerWidth);
    H = (window.innerHeight);

    //add mouse events
    canvas.addEventListener("mousemove", trackPosition, true);
    canvas.addEventListener("mousedown", btnClick, true);

    //make canvas full screen
    canvas.width = W;
    canvas.height = H;

    //Start button object
    startBtn = {
        w: 110,
        h: 50,
        x: parseInt(W / 2) - 155,
        y: parseInt(H / 4 + H / 8 - 30),

        //define draw function for this button
        draw: function() {

            //set font styles and draw play game text
            ctx.font = "22px Arial, sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseLine = "middle";
            ctx.fillStyle = "white";
            ctx.fillText("- Play Game -", W / 2 - 100, H / 4 + H / 8);
        }
    }

    //Instructions button object
    instructions = {
        w: 120,
        h: 50,
        x: parseInt(W / 2) + 40,
        y: parseInt(H / 4 + H / 8 - 30),

        //define draw function for this button
        draw: function() {
            ctx.font = "22px Arial, sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseLine = "middle";
            ctx.fillStyle = "white";
            ctx.fillText("- Instructions -", W / 2 + 100, H / 4 + H / 8);
        }
    }

    //restart button object
    restartBtn = {
        w: 100,
        h: 50,
        x: parseInt(W / 2) - 50,
        y: parseInt(H / 2) - 50,

        //define draw function for this button
        draw: function() {
            ctx.font = "20px Arial, sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseLine = "middle";
            ctx.fillStyle = "white";
            ctx.fillText("- Restart -", W / 2, H / 4 + 100);
        }
    }

    //win button object
    menuBtn = {
        w: 130,
        h: 50,
        x: parseInt(W / 2 - 65),
        y: H - (H / 16 + H / 32),

        //define draw function for this button
        draw: function() {

            ctx.font = "20px Arial, sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseLine = "middle";
            ctx.fillStyle = "white";
            ctx.fillText("- Return to Menu -", W / 2, H - H / 16);
        }
    }

    //horse head object
    horse = {
        x: 50,
        y: 50,
        r: 15,
        c: "rgba(255, 255, 255, 0)",
        vx: 5,
        vy: 5,
    }

    infoBar = {
        w: W,
        h: (H / 8),
        x: 0,
        y: (H - (H / 8)),

        //define draw function for this button
        draw: function() {
            ctx.rect(this.x, this.y, this.w, this.h);
            ctx.fillStyle = "grey";
            ctx.fill();
        }
    }

    startScreen();
} // init

// Function to paint canvas
function paintCanvas() {

    ctx.drawImage(sky, 0, 0);

    if (over == 1) {
        //ctx.drawImage(fence, -8, H - 105);
    }
}

// Draw everything on canvas
function draw() {

    // draw background
    paintCanvas();
    if (play == 1) {
        infoBar.draw();
    }
    update();
}

// Track the position of mouse cursor
function trackPosition(e) {

    mouse.x = e.pageX;
    mouse.y = e.pageY;

    mouseX = e.pageX;
    mouseY = e.pageY;
}

// Function to update positions, score and everything.
// Basically, the main game logic is defined here
function update() {

    //if the current game has been won, choose a new one and play
    if (play == 1) {
        if (over == 1 || winRound == true) {
            //hide apples and basket
            document.getElementById('basket').style.visibility = 'hidden';
            document.getElementById('apple1').style.visibility = 'hidden';
            document.getElementById('apple2').style.visibility = 'hidden';
            document.getElementById('apple3').style.visibility = 'hidden';

            chooseGame();
            winRound = false;
        }

        if (currentGame == 1) {
            gameOne();
        } else if (currentGame == 2) {
            gameTwo();
        } else if (currentGame == 3) {
            // Game three has many bugs, so it is commented out as requested.
			// if you want to look at it, remove line 272 and uncomment line 271
			
			//gameThree();
			gameTwo();	
        } else {
            gameFour();
        }

        displayInfo();
    } else if (play == 2) {

        //load and draw instructions
        ctx.drawImage(instructionsImg, W / 2 - 500, H / 2 - 305);

        //draw the button to return to menu
        menuBtn.draw();
    }
}

function increaseSpd() {
    //if(timesCalled2 % 2 == 0){ 
    //if (Math.abs(horse.vx) < 15){ 
    horse.vx += (horse.vx < 0) ? -1 : 1;
    horse.vy += (horse.vy < 0) ? -2 : 1;
    //}
    //}
}

// Function to run when the game ends
function gameOver() {
    //draw background
    paintCanvas();

    //reset type formatting
    ctx.fillStyle = "White";
    ctx.font = "40px Arial Black, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    //display game over info
    if (lossType == 0) {
        ctx.fillText("You ran out of time!", W / 2, H / 4 + 50);
    } else if (lossType == 1) {
        ctx.fillText("You fell off your horse!", W / 2, H / 4 + 50);
    }

    ctx.font = "20px Arial, sans-serif";
    ctx.fillText("Score: " + points, W / 2, H / 4);

    // Stop animation
    cancelRequestAnimFrame(init);

    //make the running horse gif invisible
    document.getElementById('runningGif').style.visibility = 'hidden';

    // Set the over flag
    over = 1;
    gameFinished = true;

    // Show the restart button
    restartBtn.draw();
} //gameOver

// Function for running the whole animation
function animloop() {

    //start animation loop
    init = requestAnimFrame(animloop);

    //draw everything
    draw();
}

// Function to execute at startup, it draws everything on the main menu
function startScreen() {

    // draw background, buttons, ect
    draw();
    startBtn.draw();
    instructions.draw();

    //set text style and draw date and author
    ctx.fillStyle = "White";
    ctx.font = "15px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Colin Johnson, 2015", W / 2, H - H / 8 - 30);

    //draw compatibility info onto menu in italics, 
    ctx.font = "italic 15px Arial, sans-serif";
    ctx.fillText("Note: This game is functional in Chrome, Firefox, Opera, and Safari", W / 2, H - H / 8 - 10);
    ctx.font = "15px Arial, sans-serif";

    // draw the "five second farmer" logo image
    var logo = document.getElementById("logo");
    ctx.drawImage(logo, (W / 2) - 337.5, H / 16);

    // draw the sub-par pitchfork pixel art
    var forksImg = document.getElementById("forks");
    ctx.drawImage(forksImg, W / 2 - 310, H / 2 - 100);
}

// On button click (Restart and start)
function btnClick(e) {

    //make mouse position variables
    var mx = e.pageX;
    var my = e.pageY;

    //click start 
    if (my >= startBtn.y && my <= (startBtn.y + startBtn.h) && play == 0) {
        if (mx >= startBtn.x && mx <= (startBtn.x + startBtn.w)) {

            //start the animaion loop
            animloop();
            startBtn = {};

            //start the timer
            timer();

            //change game display area to make space for btm bar
            H = (window.innerHeight - window.innerHeight / 8);

            //reset variables   
            timeLeft = 5;
            play = 1;
            over = 0;
        } // if
    } // if

    //click instructions
    if (my >= instructions.y && my <= (instructions.y + instructions.h)) {
        if (mx >= instructions.x && mx <= (instructions.x + instructions.w)) {

            // set the play stage to instructions
            play = 2;

            // start the animation loop
            animloop();
            instructions = {};
        } // if
    } // if

    //click restart 
    if (play == 1) {
        if (mx >= restartBtn.y && my <= (restartBtn.y + restartBtn.h)) {
            if (mx >= restartBtn.x && mx <= (restartBtn.x + restartBtn.w)) {

                //restart animation loop
                animloop();

                //reset logic variables for the next attempt
                timeLeft = 5;
                gameFinished = false;
                play = 1;
                over = 0;
                points = 0;

                //reset stage variables
                keyGoals = [65, 83, 68, 70, 83, 83, 70, 83];
                keyResults = [0, 0, 0, 0, 0, 0, 0, 0];
                keyProgress = 0;
                keyAttempt = 'Z';

                // reset the difficulties of all the games
                timesCalled1 = 1;
                timesCalled2 = 1;
                timesCalled3 = 1;
                timesCalled4 = 1;

                //restart the timer
                clearInterval(clear);
                timer();
            } // if
        } // if
    } // if

    //click back to menu
    if (play == 2) {
        if (my >= menuBtn.y && my <= (menuBtn.y + menuBtn.h)) {
            if (mx >= menuBtn.x && mx <= (menuBtn.x + menuBtn.w)) {

                // go back to menu by reloading the page (saves code space)
                location.reload();
            } // if
        } // if
    } // if

    //click the donkey head if in game #2
    if (currentGame == 2) {
        if (mx < horse.x + 50 && mx > horse.x - 50 && my < horse.y + 50 && my > horse.y - 50) {

            //add points, set winRound, get a new game     
            winRound = true;
            chooseGame();
            points++;

            //record that the game has been won once
            timesCalled2++;

            //restart time left
            clearInterval(clear);
            timeLeft = 5;
            timer();

            //increase horse speed
            increaseSpd();
        } // if
    } // if

    //click the unicorn if in game #4
    if (currentGame == 4) {
        if (mx < horsePosX + (horsePosX * 40) + 50 && mx > horsePosX + (horsePosX * 40) && my < horsePosY + (horsePosY * 40) + 50 && my > horsePosY + (horsePosY * 40) - 50) {

            //add points, set winRound, get a new game     
            winRound = true;
            chooseGame();
            points++;

            //record that the game has been won once
            timesCalled4++;

            //restart time left
            clearInterval(clear);
            timeLeft = 5;
            timer();

            //increase horse speed
            increaseSpd();
        } // if
    } // if

} // btnClick

//method to randomly seclect one of the four games
function chooseGame() {

    //make a variable to store the random number
    var random = 0;

    //generate random number from 1 - 4
    random = Math.floor(Math.random() * (4 - 1 + 1)) + 1;


    //if the current game has been won, select a different game
    if (winRound == true) {
        currentGame = random;
        gameFinished = false;
        over = 0;

        //randomize the position of the horse
        horsePosX = Math.floor((Math.random() * 30) + 1);
        horsePosY = Math.floor((Math.random() * 16) + 1);

        /*
        //randomize apple and basket positions
        document.getElementById('apple1').style.top = (Math.floor(Math.random() * (H - 0 + 1)) + 0) + 'px';
        document.getElementById('apple2').style.top = (Math.floor(Math.random() * (H - 0 + 1)) + 0) + 'px';
        document.getElementById('apple3').style.top = (Math.floor(Math.random() * (H - 0 + 1)) + 0) + 'px';
        document.getElementById('apple1').style.left = (Math.floor(Math.random() * (W - 0 + 1)) + 0) + 'px';
        document.getElementById('apple2').style.left = (Math.floor(Math.random() * (W - 0 + 1)) + 0) + 'px';
        document.getElementById('apple3').style.left = (Math.floor(Math.random() * (W - 0 + 1)) + 0) + 'px';
        */
    }
}


function gameOne() {

    //start the mouse events needed to drag the apple
    //loadMouseEvents()

    //make the apple and basket images visible
    document.getElementById('basket').style.visibility = 'visible';
    document.getElementById('apple1').style.visibility = 'visible';

    //when the mouse is clicked on the first apple
    document.getElementById("apple1").onmousedown = function() {

        //position the apple abosolute so that it can be positioned right
        this.style.position = 'absolute';

        var self = this;

        //when the mouse is moved, change the apple's css positioning to match the mouse location 
        document.onmousemove = function(e) {
            e = e || event;
            fixPageXY(e);

            //change css positioning for the apples
            self.style.left = e.pageX - 25 + 'px';
            self.style.top = e.pageY - 25 + 'px';

            //store the apple's position to see if it is in the basket later on
            apple1PosX = e.pageX;
            apple1PosY = e.pageY;
        }

        //when the mouse is unclicked...
        this.onmouseup = function() {
            document.onmousemove = null;
        }

        //when the user starts dragging the mouse...
        document.getElementById('apple1').ondragstart = function() {
            return false
        }
    }

    // compare the position of the apple(s) with the position of the basket, if close enough, the user wins
    if ((apple1PosX < 350 && apple1PosX > 300 && apple1PosY < 350 && apple1PosY > 300)) {

        //add points and set winRound to get a new game     
        winRound = true;
        chooseGame()
        points++;

        //record that the game has been won
        timesCalled1++;

        //restart time left
        clearInterval(clear);
        timeLeft = 5;
        timer();
    }
}

//make sure the page doesn't move while clicking or dragging
function fixPageXY(e) {
    if (e.pageX == null && e.clientX != null) {
        var html = document.documentElement;
        var body = document.body;

        e.pageX = e.clientX + (html.scrollLeft || body && body.scrollLeft || 0);
        e.pageX -= html.clientLeft || 0;

        e.pageY = e.clientY + (html.scrollTop || body && body.scrollTop || 0);
        e.pageY -= html.clientTop || 0;
    }
}


//Click and drag events for apples
function loadMouseEvents() {

    document.getElementById('apple1').onmousedown = function() {
        this.style.position = 'absolute';

        var self = this;

        document.onmousemove = function(e) {
            e = e || event;
            fixPageXY(e);

            self.style.left = e.pageX - 25 + 'px';
            self.style.top = e.pageY - 25 + 'px';

            document.getElementById("Xpos").innerHTML = e.pageX;
            document.getElementById("Ypos").innerHTML = e.pageY;
        }

        this.onmouseup = function() {
            document.onmousemove = null;
        }
    }

    document.getElementById('apple2').onmousedown = function() {
        this.style.position = 'absolute';

        var self = this;

        document.onmousemove = function(e) {
            e = e || event;
            fixPageXY(e);

            self.style.left = e.pageX - 25 + 'px';
            self.style.top = e.pageY - 25 + 'px';

            document.getElementById("Xpos").innerHTML = e.pageX;
            document.getElementById("Ypos").innerHTML = e.pageY;
        }

        this.onmouseup = function() {
            document.onmousemove = null;
        }
    }

    document.getElementById('apple3').onmousedown = function() {
        this.style.position = 'absolute';

        var self = this;

        document.onmousemove = function(e) {
            e = e || event;
            fixPageXY(e);

            self.style.left = e.pageX - 25 + 'px';
            self.style.top = e.pageY - 25 + 'px';

            document.getElementById("Xpos").innerHTML = e.pageX;
            document.getElementById("Ypos").innerHTML = e.pageY;
        }

        this.onmouseup = function() {
            document.onmousemove = null;
        }
    }
}

//code for playing the second game(catch the horse head)
function gameTwo() {

    //determine what color the timeLeft display should be (redder = less times left) 
    if (timeLeft == 0) {
        ctx.fillStyle = "#660000";
    } else if (timeLeft == 1) {
        ctx.fillStyle = "#CC0000";
    } else if (timeLeft == 2) {
        ctx.fillStyle = "#CC6600";
    } else if (timeLeft == 3) {
        ctx.fillStyle = "#CCCC00";
    }

    //display remaining time for mini game
    ctx.fillText(timeLeft, (W / 2), H + parseInt(window.innerHeight / 16 + window.innerHeight / 64));

    //reset fill style to white so it is not colored
    ctx.fillStyle = "white";

    //display the current difficulty level
    ctx.font = "20px Arial, sans-serif";
    ctx.fillText("Level Difficulty: " + timesCalled3, W - 100, H + (window.innerHeight / 16));

    //move the horse
    horse.x += horse.vx;
    horse.y += horse.vy;

    //wall collision (top/bottom)
    if (horse.y + horse.r > H) {
        //horse.y = H - horse.r;
        //gameOver();

        horse.vy = -horse.vy;
        horse.y = H - horse.r;
    } else if (horse.y < 0) {
        //horse.y = horse.r;
        //gameOver();

        horse.vy = -horse.vy;
        horse.y = horse.r;
    }

    //collides with vertical walls
    if (horse.x + horse.r > W) {
        horse.vx = -horse.vx;
        horse.x = W - horse.r;
    } else if ((horse.x - horse.r) < 0) {
        horse.vx = -horse.vx;
        horse.x = horse.r;
    }

    //load and overlay donkeyHead onto horse object
    var donkeyHeadImg = document.getElementById("donkeyHead");
    ctx.drawImage(donkeyHeadImg, horse.x - 100, horse.y - 100);
}

function gameThree() {

    //make the running horse gif visible
    document.getElementById('runningGif').style.visibility = 'visible';

    //position the running horse
    document.getElementById('runningGif').style.top = (H - 129) + 'px';
    document.getElementById('runningGif').style.left = (H / 2 + 30) + 'px';

    //fixes the positions of the keyboard instructions depending on the stage
    var instructionOffset = 90;

    //reset fill style to white so text is not colored
    ctx.fillStyle = "white";

    //display the instructions for this stage, the letters are colored differently after they have been pressed
    ctx.font = "24px Arial, sans-serif";
    ctx.fillText("Press Keys: ", W / 2 - instructionOffset, H - (H / 4));

    if (keyProgress >= 1) {
        ctx.fillStyle = "yellow";
    }
    ctx.fillText("A", (W / 2) + 100 - instructionOffset, H - (H / 4));
    ctx.fillStyle = "white";

    if (keyProgress >= 2) {
        ctx.fillStyle = "yellow";
    }
    ctx.fillText("S", (W / 2) + 150 - instructionOffset, H - (H / 4));
    ctx.fillStyle = "white";

    if (keyProgress >= 3) {
        ctx.fillStyle = "yellow";
    }
    ctx.fillText("D", (W / 2) + 200 - instructionOffset, H - (H / 4));
    ctx.fillStyle = "white";

    if (keyProgress >= 4) {
        ctx.fillStyle = "yellow";
    }
    ctx.fillText("F", (W / 2) + 250 - instructionOffset, H - (H / 4));
    ctx.fillStyle = "white";

    //listen for key presses
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);

    // if the game is not yet over, check if the typed key is correct
    if (over == 0 || gameFinished == false) {
        if (keyAttempt == keyGoals[keyProgress]) {

            //go to the next requested key if the current one 
            keyProgress++;

            //set the key off of what was typed
            keyAttempt = 'Z';

            //win situation
            if (keyProgress >= 4) {
                gameWin3();
            }

            // if the typed key was wrong, they lose
        } else if (keyAttempt != 'Z') {
            gameOver3();
        }
    }
} // gameThree  

//when a key is pressed, see if it is one of the used keys and store for use in gamerThree()
function keyDownHandler(event) {

    //make the returned number a letter for easier code reading
    var keyPressed = String.fromCharCode(event.keyCode);

    //check if it is currently the game that needs the keyboard
    if (currentGame == 3) {

        //assign key attempts to keyAttempt if they are valid
        if (keyPressed == "A") {
            keyAttempt = 'A';
        } else if (keyPressed == "S") {
            keyAttempt = 'S';
        } else if (keyPressed == "D") {
            keyAttempt = 'D';
        } else if (keyPressed == "F") {
            keyAttempt = 'F';
        } else {
            gameOver3();
        }
    }
} //keyDownHandler

//things to do when the player messes up game three
function gameOver3() {

    //set the loss type to decide what message will be shown in gameOver()
    lossType = 1;

    //show loss message
    gameOver();
}


//things to do when the player wins game three
function gameWin3() {

   //add points, set winRound, get a new game     
    winRound = true;
    chooseGame();
    points++;

    //record that the game has been won once
    timesCalled3++;

    //restart time left
    clearInterval(clear);
    timeLeft = 5;
    timer();

    //reset variables
    timeLeft = 5;
    gameFinished = true;
    play = 1;
    over = 0;

    keyGoals = [65, 83, 68, 70, 83, 83, 70, 83];
    keyResults = [0, 0, 0, 0, 0, 0, 0, 0];
    keyAttempt = 'Z';
    keyProgress = 0;

    //hide unicorn  
    document.getElementById('runningGif').style.visibility = 'hidden';
}

//register when keys are released for later functionality
function keyUpHandler(event) {
    var keyPressed = String.fromCharCode(event.keyCode);

}

function gameFour() {

    for (var y = 0; y < 16; y++) {
        for (var x = 0; x < 30; x++) {
            ctx.drawImage(donkey, (x + (x * 40)), y + (y * 40));
        }
    }

    //draw the unicorn
    ctx.drawImage(uniDonkey, horsePosX + (horsePosX * 40), horsePosY + (horsePosY * 40));

} //gameFour

//displays all info (score, time left, current game and difficulty) on the info bar 
function displayInfo() {
    //redraw info bar
    infoBar.draw();

    //set text styling to correct options
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    if (currentGame == 1) {
        ctx.fillText("Collect the apples!", W / 2, H + parseInt(window.innerHeight / 32));
    } else if (currentGame == 2) {
        ctx.fillText("Catch the horse!", W / 2, H + parseInt(window.innerHeight / 32));
    } else if (currentGame == 3) {
        ctx.fillText("Direct the Horse!", W / 2, H + parseInt(window.innerHeight / 32));
    } else {
        ctx.fillText("Find the unicorn!", W / 2, H + parseInt(window.innerHeight / 32));
    }

    //increase font size for timer
    ctx.font = "60px Arial Black, sans-serif";

    //determine what color the timeLeft display should be (redder = less times left) 
    if (timeLeft == 0) {
        ctx.fillStyle = "#660000";
    } else if (timeLeft == 1) {
        ctx.fillStyle = "#CC0000";
    } else if (timeLeft == 2) {
        ctx.fillStyle = "#CC6600";
    } else if (timeLeft == 3) {
        ctx.fillStyle = "#CCCC00";
    }

    //display remaining time for mini game
    ctx.fillText(timeLeft, (W / 2), H + parseInt(window.innerHeight / 16 + window.innerHeight / 64));

    //reset fill style to white so it is not colored
    ctx.fillStyle = "white";

    //display the current difficulty level
    ctx.font = "20px Arial, sans-serif";

    if (currentGame == 1) {
        ctx.fillText("Level Difficulty: " + timesCalled1, W - 100, H + (window.innerHeight / 16));
    } else if (currentGame == 2) {
        ctx.fillText("Level Difficulty: " + timesCalled2, W - 100, H + (window.innerHeight / 16));
    } else if (currentGame == 3) {
        ctx.fillText("Level Difficulty: " + timesCalled3, W - 100, H + (window.innerHeight / 16));
    } else {
        ctx.fillText("Level Difficulty: " + timesCalled4, W - 100, H + (window.innerHeight / 16));
    }

    //display current score
    ctx.fillText("Score: " + points, 50, H + window.innerHeight / 16);
}

function updateClock() {

    if (timeLeft != 0) {
        timeLeft--;

    } else {
        if (over != 1) {
            lossType = 0;
            gameOver(); // if the player runs out of time, they lose
            clearInterval(clear);
        }
    }
} // updateClock

function timer() {

    clear = setInterval(updateClock, 1000);
    gameFinished = false;
} // timer