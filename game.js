var startScore = 5;
var lowScore = 2;

var redScore = startScore;
var greenScore = startScore;

/*
0 - start
1 - game
2 - green_won
3 - red_won
*/
var gameState = 0;

var redBlock = document.getElementById("red");
var greenBlock = document.getElementById("green");

var table = document.getElementById("table");
var startScreen = document.getElementById("start_screen");
var redWon = document.getElementById("red_won");
var greenWon = document.getElementById("green_won");

function hideAllViews() {
	startScreen.style.display = "none";
	table.style.display = "none";
	greenWon.style.display = "none";
	redWon.style.display = "none";
}

function updateView() {
	hideAllViews();
	redBlock.style.flexGrow = redScore;
	redBlock.style.WebkitFlexGrow = redScore;
	greenBlock.style.flexGrow = greenScore;
	greenBlock.style.WebkitFlexGrow = greenScore;
	if (gameState === 0) {
		startScreen.style.display = "block";
	}
	if (gameState === 1) {
		table.style.display = "block";
	}
	if (gameState === 2) {
		greenWon.style.display = "block";
	}
	if (gameState === 3) {
		redWon.style.display = "block";
	}
	table.innerHTML = greenScore + " - " + redScore;
}

function updateState(side) {
	if (gameState === 1) {
	//red
		if (side === 1) {
			redScore++;
			greenScore--;
			//
			if (redScore === startScore*2) gameState = 3;
		//green
		} else {
			redScore--;
			greenScore++;
			//
			if (greenScore === startScore*2) gameState = 2;
		}
		sendRes();
	}
	updateView();
}

function restart() {
	gameState = 1;
	greenScore = startScore;
	redScore = startScore;
	lastSent = "-1";
	updateView();
	sendRes();
}

function input(event) {
	if (event.keyCode == 112) {
		updateState(1);
	}
	if (event.keyCode == 113) {
		updateState(0);
	}
	if (event.keyCode == 114) {
		restart();
	}
}
document.addEventListener("keypress", input);
updateView();


//ESP
var eventSocket = new WebSocket("ws://yarik.eu-gb.mybluemix.net/ws/event");
eventSocket.addEventListener('message', function (event) {
		if (event.data === '0') {
			restart();
		}
		if (event.data === '1') {
			updateState(0);
		}
		if (event.data === '2') {
			updateState(1);
		}
});
/*
	0 - All disabled
	1 - Green blink
	2 - Red blink
	3 - Green light
	4 - Red light
*/
var resSocket = new WebSocket("ws://yarik.eu-gb.mybluemix.net/ws/res");
var lastSent = "-1";
function sendRes() {
	if (greenScore === 0) {
		if (lastSent !== "4") {
			resSocket.send("4");
			lastSent = "4";
		}
		return;
	}
	if (greenScore <= lowScore) {

		resSocket.send("2");
		lastSent = "2";

		return;
	}
	if (redScore === 0) {
		if (lastSent !== "3") {
			resSocket.send("3");
			lastSent = "3";
		}
		return;
	}
	if (redScore <= lowScore) {

		resSocket.send("1");
		lastSent = "1";

		return;
	}
	if (lastSent !== "0") {
		resSocket.send("0");
		lastSent = "0";
	}
}
