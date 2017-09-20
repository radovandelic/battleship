var shipData = [
    [null, "C", null, null, null, null, null, null, null, null],
    [null, "C", null, null, null, null, null, null, null, null],
    [null, "C", null, null, null, null, null, null, null, null],
    [null, "C", null, "B", "B", "B", "B", null, null, null],
    [null, "C", null, null, null, null, null, "P", "P", null],
    [null, null, null, "D", null, null, null, null, null, null],
    [null, null, null, "D", null, null, null, null, "S", null],
    [null, null, null, "D", null, null, null, null, "S", null],
    [null, null, null, null, null, null, null, null, "S", null],
    [null, null, null, null, null, null, null, null, null, null]
];

var gameState = [
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
function hasGameEnded(hits) {
    if (hits === 17) {
        alert("Congrats, you won!");
        var tds = document.getElementsByTagName("td");
        for (var i = 0; i < tds.length; i++) {
            tds[i].onclick = function () {
                alert("The game has finished!");
            }
        }
    }
}
function createGameBoard() {
    var gameBoard = document.getElementById("gameBoard");
    for (var i = 0; i < 10; i++) {
        var tableRow = document.createElement("tr");
        tableRow.setAttribute("row", i);
        for (var j = 0; j < 10; j++) {
            var tableData = document.createElement("td");
            tableData.setAttribute("col", j);
            tableData.setAttribute("onclick", "play(this)");
            tableData.innerHTML = shipData[i][j];
            tableRow.appendChild(tableData);
        }
        gameBoard.appendChild(tableRow);
    }
}

function populateGameBoard(gameState) {
    var gameBoard = document.getElementById("gameBoard");
    for (var i = 0; i < gameState.length; i++) {
        var row = gameBoard.children[i];
        //console.log(row);
        for (var j = 0; j < gameState[i].length; j++) {
            var col = row.children[j];
            //console.log(col);
            col.innerHTML = gameState[i][j];
        }
    }
}

function play(cell) {
    var score = Number(document.getElementById("score").innerHTML);
    var hits = Number(document.getElementById("hits").innerHTML);
    var col = cell.getAttribute("col");
    var row = cell.parentElement.getAttribute("row");
    if (gameState[row][col] == null) {
        if (shipData[row][col] !== null) {
            alert("Hit!");
            gameState[row][col] = "x";
            cell.innerHTML = "x";
            score += 5;
            hits += 1;

            var ship = ships[shipData[row][col]];
            ship.hits--;
            if (ship.hits == 0) { alert("You sunk my " + ship.name + "!"); }

            hasGameEnded(hits);
        } else {
            gameState[row][col] = "_";
            score -= 1;
        }
    } else {

    }
    populateGameBoard(gameState);
    document.getElementById("score").innerHTML = score;
    document.getElementById("hits").innerHTML = hits;
}

window.onload = function () {
    createGameBoard();
};

var startButton = document.getElementById("startButton");
startButton.onclick = function () {
    writeData("hello");
    //populateGameBoard(gameState);
};