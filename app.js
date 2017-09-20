var shipData = [
    [null, "x", null, null, null, null, null, null, null, null ],
    [null, "x", null, null, null, null, null, null, null, null ],
    [null, "x", null, null, null, null, null, null, null, null ],
    [null, "x", null, "x", "x", "x", "x", null, null, null ],
    [null, "x", null, null, null, null, null, "x", "x", null ],
    [null, null, null, "x", null, null, null, null, null, null ],
    [null, null, null, "x", null, null, null, null, "x", null ],
    [null, null, null, "x", null, null, null, null, "x", null ],
    [null, null, null, null, null, null, null, null, "x", null ],
    [null, null, null, null, null, null, null, null, null, null ]
];

var gameState = [
    [null, null, null, null, null, null, null, null, null, null ],
    [null, null, null, null, null, null, null, null, null, null ],
    [null, null, null, null, null, null, null, null, null, null ],
    [null, null, null, null, null, null, null, null, null, null ],
    [null, null, null, null, null, null, null, null, null, null ],
    [null, null, null, null, null, null, null, null, null, null ],
    [null, null, null, null, null, null, null, null, null, null ],
    [null, null, null, null, null, null, null, null, null, null ],
    [null, null, null, null, null, null, null, null, null, null ],
    [null, null, null, null, null, null, null, null, null, null ]
];
/* Carrier - 5 hits
   Battleship - 4 hits
   Destroyer - 3 hits
   Submarine - 3 hits
   Patrol boat - 2 hits
*/ 
function createGameBoard(){
    var gameBoard = document.getElementById("gameBoard");
    for (var i = 0; i < 10; i++) {
        var tableRow = document.createElement("tr");
        tableRow.setAttribute("row", i);
        for (var j = 0; j < 10; j++) {
            var tableData = document.createElement("td");
            tableData.setAttribute("col", j);
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
        console.log(row);
        for (var j= 0; j < gameState[i].length; j++) {
            var col = row.children[j];
            console.log(col);
            col.innerHTML = gameState[i][j];
        }
    }
}
window.onload = function (){
    createGameBoard();
};

var startButton = document.getElementById("startButton");
startButton.onclick = function(){
    populateGameBoard(gameState);
};