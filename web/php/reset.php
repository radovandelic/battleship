
<?php
 header("Access-Control-Allow-Origin: *");
include 'db.php'; //contains $mysqli = new mysqli("localhost", "username", "password", "databasename");
/* check connection */
if (mysqli_connect_errno()) {
    echo "Connect failed: %s\n", mysqli_connect_error();
    exit();
}
// Check connection
if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}

$sql = "UPDATE gamedata SET active = 0, turn = 0, hits = 0, shipdata = '[]', gamestate = '[]';";

if ($mysqli->query($sql) === TRUE) {
    echo "Server succesfully reset.";
} else {
    echo "Error: " . $sql . "<br>" . $mysqli->error;
}

/* close connection */
$mysqli->close();
?> 