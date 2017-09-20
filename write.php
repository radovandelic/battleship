
<?php
$q = intval($_GET['q']);

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