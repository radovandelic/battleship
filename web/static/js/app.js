var dbactive = -1;

var init = [
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null]
];
var player = {
    id: -1,
    username: "",
    active: 1,
    turn: 0,
    hits: 0,
    score: 0,
    shipdata: JSON.parse(JSON.stringify(init)),
    gamestate: JSON.parse(JSON.stringify(init)),
    timeout: 0
};

var opponent = {
    id: -1,
    username: "",
    active: 0,
    turn: 0,
    hits: 0,
    score: 0,
    shipdata: JSON.parse(JSON.stringify(init)),
    gamestate: JSON.parse(JSON.stringify(init)),
    timeout: 0
};

/* Carrier - 5 hits
   Battleship - 4 hits
   Destroyer - 3 hits
   Submarine - 3 hits
   Patrol boat - 2 hits
*/


var ships = {
    C: {
        name: "Carrier",
        hits: 5
    },
    B: {
        name: "Battleship",
        hits: 3
    },
    S: {
        name: "Submarine",
        hits: 3
    },
    D: {
        name: "Destroyer",
        hits: 4
    },
    P: {
        name: "Patrol Boat",
        hits: 2
    }
};
function hasGameEnded(object) {
    if (object.hits >= 17) {
        resetData();
        message = (object.id == player.id) ?
            "Congrats, you win!" : "You lose!";
        alert(message);
        var tds = document.getElementsByTagName("td");
        for (var i = 0; i < tds.length; i++) {
            tds[i].onclick = function () {
                alert("The game has finished!");
            }
        }
    }
}
function createGameBoard(gameBoard, shipData) {
    var gameBoard = document.getElementById(gameBoard);
    gameBoard.innerHTML = "";
    for (var i = 0; i < 10; i++) {
        var tableRow = document.createElement("tr");
        tableRow.setAttribute("row", i);
        for (var j = 0; j < 10; j++) {
            var tableData = document.createElement("td");
            tableData.setAttribute("col", j);
            if (gameBoard.getAttribute("id") == "gameBoard2") { tableData.setAttribute("onclick", "play(this)"); }
            tableData.innerHTML = shipData[i][j];
            tableRow.appendChild(tableData);
        }
        gameBoard.appendChild(tableRow);
    }
}

function populateGameBoard(gameState, gameBoard) {
    var gameBoard = document.getElementById(gameBoard);
    for (var i = 0; i < gameState.length; i++) {
        var row = gameBoard.children[i];
        //console.log(row);
        for (var j = 0; j < gameState[i].length; j++) {
            var col = row.children[j];
            //console.log(col);
            if (gameBoard.getAttribute("id") == "gameBoard2"
                || (player.shipdata[i][j] == null && gameState[i][j] != null)) {
                col.innerHTML = gameState[i][j];
            }
            if (gameState[i][j] != null && gameState[i][j] != "~") { col.setAttribute("class", "hit"); col.innerHTML = "x"; }
            else if (gameState[i][j] == "~") { col.setAttribute("class", "miss"); }
        }
    }
}
function disconnected() {
    resetData();
    opponent.active = 0;
    label.innerHTML = "Opponent has disconnected.";
    alert("Opponent has disconnected.");
}

function KO() {
    if (opponent.active == 0) {
        opponent.timeout++;
        if (opponent.timeout >= 4) {
            disconnected();
        }
    } else {
        opponent.timeout = 0;
    }
    resetData(opponent.id);
}

function activityHandling() {
    writeData("active", player.id, 1);
    if (Math.random > 0.5) { readData(opponent.id, 'opponent', KO); }
}

function update() {
    if (opponent.active == 0) {
        readData(opponent.id, 'opponent', opponentJoin);
    } else {
        readData(opponent.id, 'opponent', writeGameProgress);
        readData(player.id, 'player', opponentMove);
    }
    writeData('timeout', player.id, 0);
    //activityHandling();
}
function opponentMove() {
    if ((player.turn + player.id) <= opponent.turn) { label.innerHTML = "Your turn"; }
    else { label.innerHTML = "Opponent's turn"; }
    populateGameBoard(player.gamestate, "gameBoard");
}
function calcScore() {
    opponent.score = opponent.hits * 5 + opponent.hits - opponent.turn;
}

function writeGameProgress() {
    readData(opponent.id, 'opponent', calcScore);
    score.innerHTML = player.score;
    hits.innerHTML = player.hits;
    turn.innerHTML = (player.turn + 1);
    opscore.innerHTML = opponent.score;
    ophits.innerHTML = opponent.hits;
    opturn.innerHTML = (opponent.turn + 1);
}

function play(cell) {
    var col = cell.getAttribute("col");
    var row = cell.parentElement.getAttribute("row");
    if ((player.turn + player.id) <= opponent.turn) {
        if (opponent.gamestate[row][col] == null && opponent.active == 1) {
            if (opponent.shipdata[row][col] !== null) {
                alert("Hit!");
                opponent.gamestate[row][col] = "x";
                cell.innerHTML = "x";
                cell.setAttribute("class", "hit");
                player.score += 5;
                player.hits += 1;

                var ship = ships[opponent.shipdata[row][col]];
                ship.hits--;
                if (ship.hits == 0) { alert("You sunk my " + ship.name + "!"); }

                hasGameEnded(opponent);
                hasGameEnded(player);
            } else {
                opponent.gamestate[row][col] = "~";
                cell.setAttribute("class", "miss");
                player.score -= 1;
            }
            player.turn++;
            label.innerHTML = "Opponent's turn.";
            writeData("turn", player.id, player.turn);
            writeData("gamestate", opponent.id, JSON.stringify(opponent.gamestate));
            writeData("hits", player.id, player.hits);
            writeGameProgress();
        }
        populateGameBoard(opponent.gamestate, "gameBoard2");
    } else {
        alert("Wait your turn!");
    }
}
function randomShipData() {
    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            player.shipdata[i][j] = null;
        }
    }
    randomShip("C", 5);
    randomShip("B", 4);
    randomShip("D", 3);
    randomShip("S", 3);
    randomShip("P", 2);
}

function randomShip(ship, size) {
    var x = 10; var y = 10;
    if (Math.random() > 0.5) { // randomizes vertical/horizontal axis
        y = Math.floor(Math.random() * 10);
        while (x + size > 9) { x = Math.floor(Math.random() * 10); } // makes sure the boats don't go outside of board
        for (var i = 0; i < size; i++) {
            if (player.shipdata[x + i][y] != null) { randomShip(ship, size); return; }
        }
        for (var i = 0; i < size; i++) {
            player.shipdata[x + i][y] = ship;
        }
    } else {
        x = Math.floor(Math.random() * 10);
        while (y + size > 9) { y = Math.floor(Math.random() * 10); }
        for (var i = 0; i < size; i++) {
            if (player.shipdata[x][y + i] != null) { randomShip(ship, size); return; }
        }
        for (var i = 0; i < size; i++) {
            player.shipdata[x][y + i] = ship;
        }
    }
}
function opponentJoin() {
    if (opponent.active == 1) {
        readData(opponent.id, 'opponent', cgb);
        alert("Opponent has joined the game. You have the first turn.");
        label.innerHTML = "Game has started";
    }
}

window.onload = function () {
    var label = document.getElementById("label");
    var turn = document.getElementById("turn");
    var score = document.getElementById("score");
    var hits = document.getElementById("hits");
    var turn = document.getElementById("turn");
    var opscore = document.getElementById("opscore");
    var ophits = document.getElementById("ophits");
    var opturn = document.getElementById("opturn");
    player.id = 0;
    createGameBoard("gameBoard", player.shipdata);
    writeData(player);
    getAll();


};
var randomButton = document.getElementById("randomButton");
randomButton.onclick = function () {
    randomShipData();
    createGameBoard("gameBoard", player.shipdata);
    if (player.id != -1) { writeData("shipdata", player.id, player.shipdata); }
}

var startButton = document.getElementById("startButton");
startButton.onclick = function () {
    document.getElementById("select-container").innerHTML = "";
    if (JSON.stringify(player.shipdata) == JSON.stringify(init)) { randomShipData(); }
    createGameBoard("gameBoard", player.shipdata);
    if (opponent.active == 1) { createGameBoard("gameBoard2", opponent.shipdata); }
    else { createGameBoard("gameBoard2", init); }
    populateGameBoard(opponent.gamestate, "gameBoard2");
    randomButton.setAttribute("disabled", "true");
    startButton.setAttribute("disabled", "true");
    writeData("shipdata", player.id, JSON.stringify(player.shipdata));
    readData(0, 'start', startGame);

    /*writeData("shipdata", 0, JSON.stringify(shipData));
    populateGameBoard(gameState, "gameBoard2");
    readData("shipdata", 0);
    setTimeout(writeLabel, 150);*/
    //label.innerHTML = displayText;
};

function startGame() {
    if (dbactive == 0) {
        player.id = 0;
        opponent.id = 1;
        label.innerHTML = "Waiting for Player 2";
        writeData("turn", player.id, 0);
        writeData("shipdata", player.id, JSON.stringify(player.shipdata));
        writeData("active", player.id, 1);
        writeData("gamestate", opponent.id, JSON.stringify(opponent.gamestate));
        var int = setInterval(update, 500);
    } else {
        startOpponentPresent();
    }
}
function cgb() {
    if (player.id == 1) readData(player.id, 'player', console.log);
    createGameBoard("gameBoard2", opponent.shipdata);
    populateGameBoard(init, "gameBoard2");
}
function startOpponentPresent() {
    if (dbactive == 1) {
        alert("Sorry, server is full. Check back later.");
        label.innerHTML = "Server full";
    } else {
        player.id = 1;
        opponent.id = 0;
        alert("Game has started. Opponent has first turn.")
        label.innerHTML = "Game has started.";
        writeData("turn", player.id, 0);
        writeData("shipdata", player.id, JSON.stringify(player.shipdata));
        writeData("active", player.id, 1);
        writeData("gamestate", opponent.id, JSON.stringify(opponent.gamestate));
        readData(opponent.id, 'opponent', cgb);
        opponent.active = 1;
        var int = setInterval(update, 500);
    }
}
