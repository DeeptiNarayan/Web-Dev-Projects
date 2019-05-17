var numOfSquares = 6;
var colors = generateRandomColor(numOfSquares);

var squares = document.querySelectorAll(".square");
var pickedColor = pickOneColor();
var pickColor = document.querySelector("#pickColor");
var msgDisplay = document.querySelector("#message");
var h1 = document.querySelector("h1");
var Resetbtn = document.querySelector("#newColor");
var modeBtns = document.querySelectorAll(".mode");


Resetbtn.addEventListener("click", reset);


for(var i = 0; i < squares.length; i++) {
	squares[i].style.backgroundColor = colors[i];
	squares[i].addEventListener("click", recolorSquare);		//add event listener to all blocks
}
					//event listener to new color btn

for( var i = 0; i < modeBtns.length; i++ ) {
	modeBtns[i].addEventListener("click", changeMode);
}

pickColor.textContent = pickedColor;							//set h1 rgb display to picked color

function recolorSquare() {										//if picked clicked color is same, then black otherwise change all to same color
	var clickedColor = this.style.backgroundColor; 				//clicked color = the one you clicked
	if(clickedColor === pickedColor) {							//picked color = the one in h1 (created by pickOneColor())
		h1.style.backgroundColor = clickedColor;
		msgDisplay.textContent = "Correct!";					
		for(var j = 0; j < squares.length; j++) {
			squares[j].style.backgroundColor = clickedColor;		//change all to same color
		}
		Resetbtn.textContent = "Play Again?";
	}
	else {
		this.style.backgroundColor = "#232323";
		msgDisplay.textContent = "Try again";
	}
}

function pickOneColor() {
	var index = Math.floor(Math.random() * colors.length);				//picks one color out of 6 colors
	return colors[index];
}

function generateRandomColor(num) {									//creates array of 6 rgb 
	var arr = [];
	for ( var i = 0; i < num ; i++) {
		arr.push(randomColor());
	}
	return arr;
}

function randomColor() { 												//create 1 random rgb color
	var r = Math.floor(Math.random() * 256);
	var g = Math.floor(Math.random() * 256);
	var b = Math.floor(Math.random() * 256);
	var col = "rgb(" + r + ", " + g + ", " + b + ")";
	return col;
}

function changeMode() {
	modeBtns[0].classList.remove("selected");
	modeBtns[1].classList.remove("selected");
	this.classList.add("selected");
	if(this.textContent === "Easy") {
		numOfSquares = 3;
	}
	else {
		numOfSquares = 6;  
	}
	reset();
}

function reset() {
	colors = generateRandomColor(numOfSquares);
	pickedColor = pickOneColor();
	pickColor.textContent = pickedColor;
	for(var i = 0; i < squares.length; i++) {
		if(colors[i]) {
			squares[i].style.display = "block";
			squares[i].style.backgroundColor = colors[i];
		}
		else {
			squares[i].style.display = "none";
		}
	}
	h1.style.backgroundColor = "steelBlue";
	msgDisplay.textContent = "";
	Resetbtn.textContent = "New Colors";
}
