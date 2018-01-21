
<?php
 header("Access-Control-Allow-Origin: *");
include 'db.php'; //contains $mysqli = new mysqli("localhost", "username", "password", "databasename");
$column = $_GET['column'];
$id = intval($_GET['id']);

/* check connection */
if (mysqli_connect_errno()) {
    echo "Connect failed: %s\n", mysqli_connect_error();
    exit();
}

$query = "SELECT $column from gamedata WHERE id = $id;";

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