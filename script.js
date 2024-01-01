var board = [];
var rows=9 ;
var col =9;
var height =360;
var width =360;
var minesCount=10;
var minesLoc = [];   //"2-2","1-2"
var tilesClicked = 0;  // the goal of the game is to click all the tiles except the bomb ones
var flagEnabled = false;   // toggling flag button
var flagCount = 0;
var gameOver = false;

var timer;
var time = 0;

document.querySelector("#level").addEventListener("change",getLevel);
function getLevel() {
    
    var selected = document.querySelector("#level").value;
    console.log(selected);
    if (selected === 'beginner') {
        rows = 9;
        col = 9;
        minesCount = 10;
       
    }
    else if (selected === 'intermediate') {
        rows = 16;
        col = 16;
        minesCount = 44;
       
    }
    else if (selected === 'hard') {
        rows = 16;
        col = 30;
        minesCount = 99;
       
    }
    height = rows * 40;
    width = col* 40;
    reset();
}


window.onload = function () {
    startGame();
}

function reset() {
    // Clear game state
    board = [];
    minesLoc = [];
    tilesClicked = 0;
    flagEnabled = false;
    gameOver = false;
    flagCount = 0;
    
    // Reset UI elements
    document.querySelector(".grid").innerHTML = "";
    document.querySelector("#newGame").innerText = "🙂";
    
    document.querySelector("#mines-count").innerText = minesCount;
    document.querySelector("#flag").style.backgroundColor = "lightgray";

    clearInterval(timer);
    time = 0;
    updateTimer();

    // Start a new game
    startGame();
}

function updateTimer() {
    if (gameOver || time > 999) {
        return;
    }
    if (time < 10) { document.querySelector("#timer").innerText = "00" + time; }
    else if (time < 100) { document.querySelector("#timer").innerText = "0" + time; }
    else {
        document.querySelector("#timer").innerText = time;
    }
}

function setMines() {
    let minesLeft = minesCount;
    while (minesLeft > 0) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * col);
        let id = r.toString() + "-" + c.toString();

        if (!minesLoc.includes(id)) {
            minesLoc.push(id);
            minesLeft--;
        }
    }
}

function startGame() {
    document.querySelector("#newGame").addEventListener("click", reset);
    document.querySelector("#flag").addEventListener("click", setFlag);
    document.querySelector("#mines-count").textContent = minesCount;
    setMines();
   
    timer = setInterval(function () {
        time++;
        updateTimer();
    }, 1000);
    
    document.querySelector(".grid").style.height = `${height}px`;
    document.querySelector(".grid").style.width = `${width}px`;
    //populate board
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < col; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.addEventListener("click", clickTile)
            document.querySelector(".grid").append(tile);
            row.push(tile);
        }
        board.push(row);
    }
}

function setFlag() {
    if (flagEnabled) {
        flagEnabled = false;
        document.querySelector("#flag").style.backgroundColor = "lightgray";
    }
    else {
        flagEnabled = true;
        document.querySelector("#flag").style.backgroundColor = "darkgray";
    }
}
function clickTile() {

    if (gameOver || this.classList.contains("tiles-clicked")) {
        return;
    }
    let tile = this;
    if (flagEnabled) {
        if (tile.innerText == "") {
            tile.innerText = "🚩";
            flagCount++;
            document.querySelector("#mines-count").innerText = minesCount - flagCount;

        }
        else if (tile.innerText == "🚩") {
            tile.innerText = "";
            flagCount--;
            document.querySelector("#mines-count").innerText = minesCount - flagCount;
        }
        return;
    }
    if (minesLoc.includes(tile.id)) {

        gameOver = true;
        document.querySelector("#newGame").innerText = "☹️";
        revealMines();
        return;
    }

    let coords = tile.id.split("-");  // "0-0" ->  ["0","0"]
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);
    checkMine(r, c);

}

function revealMines() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < col; c++) {
            let tile = board[r][c];
            if (minesLoc.includes(tile.id)) {
                tile.innerText = "💣";
                // tile.style.backgroundColor = "red";
            }
        }
    }
}

function checkMine(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= col) {
        return;
    }
    if (board[r][c].classList.contains("tiles-clicked")) {
        return;
    }

    board[r][c].classList.add("tiles-clicked");
    tilesClicked++;
    let minesFound = 0;

    //top 3;
    minesFound += checkTile(r - 1, c - 1);  //top-left
    minesFound += checkTile(r - 1, c);    //top
    minesFound += checkTile(r - 1, c + 1);  //top-right;

    //left and rigth
    minesFound += checkTile(r, c - 1);  //left
    minesFound += checkTile(r, c + 1);   //right

    //bottom 3 
    minesFound += checkTile(r + 1, c - 1); //bottom-left
    minesFound += checkTile(r + 1, c);  //bottom
    minesFound += checkTile(r + 1, c + 1);  //bottom-right

    if (minesFound > 0) {
        board[r][c].innerText = minesFound;
        board[r][c].classList.add("x" + minesFound.toString());
    }
    else {

        checkMine(r - 1, c - 1);
        checkMine(r - 1, c);
        checkMine(r - 1, c + 1);
        checkMine(r + 1, c - 1);
        checkMine(r + 1, c);
        checkMine(r + 1, c + 1);
        checkMine(r, c - 1);
        checkMine(r, c + 1);

    }

    if (tilesClicked == rows * col - minesCount) {
        gameOver = true;
        document.querySelector("#mines-count").innerText = "Cleared";
    }


}

function checkTile(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= col) {
        return 0;
    }
    if (minesLoc.includes(r.toString() + "-" + c.toString())) {
        return 1;
    }
    return 0;
}
