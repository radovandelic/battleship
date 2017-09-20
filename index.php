<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible">
    <title>Battleship</title>
    <link rel="stylesheet" href="style.css">
    <<script src="ajax.js"></script>
</head>

<body>

<?php
$mysqli = new mysqli("localhost", "root", "jUhl6b9wbNmrtWL", "battleship");

/* check connection */
if (mysqli_connect_errno()) {
    echo "Connect failed: %s\n", mysqli_connect_error();
    exit();
}

$query = "SELECT * from test;";

if ($result = $mysqli->query($query)) {

    /* fetch object array */
    while ($row = $result->fetch_row()) {
        echo "$row[0]";
    }

    /* free result set */
    $result->close();
}

/* close connection */
$mysqli->close();
?>

    <header>
        <h1>Battleship</h1>
    </header>
    <p>Score: <span id="score">0</span></p>
    <p>Hits: <span id="hits">0</span></p>
    <div class="container">
        <table id="gameBoard">

        </table>
        <button id="startButton">Start</button>
    </div>
    <script src="app.js"></script>
</body>

</html>
