
<?php
 header("Access-Control-Allow-Origin: *");
include 'db.php'; //contains $mysqli = new mysqli("localhost", "username", "password", "databasename");
$column = $_GET['column'];
$id = intval($_GET['id']);
$value = $_GET['value'];
if(!is_numeric($value)) { $value = "'$value'"; }

/* check connection */
if (mysqli_connect_errno()) {
    echo "Connect failed: %s\n", mysqli_connect_error();
    exit();
}
// Check connection
if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}

$sql = "UPDATE gamedata SET $column = $value WHERE id = $id;";

if ($mysqli->query($sql) === TRUE) {
    echo "New record created successfully.";
} else {
    echo "Error: " . $sql . "<br>" . $mysqli->error;
}

/* close connection */
$mysqli->close();
?> 