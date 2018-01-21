<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible">
    <title>Battleship</title>
    <link rel="stylesheet" href="static/css/style.css">
</head>

<body>
    <header>
        <h1>Battleship</h1>
    </header>
    <?php    
    require('../vendor/autoload.php');
    $app = new Silex\Application();
    $dbopts = parse_url(getenv('DATABASE_URL'));
    echo $dbopts["pass"];
    $app->register(new Csanquer\Silex\PdoServiceProvider\Provider\PDOServiceProvider('pdo'),
               array(
                'pdo.server' => array(
                   'driver'   => 'pgsql',
                   'user' => $dbopts["user"],
                   'password' => $dbopts["pass"],
                   'host' => $dbopts["host"],
                   'port' => $dbopts["port"],
                   'dbname' => ltrim($dbopts["path"],'/')
                   )
               )
    );

    $app->get('/db/', function() use($app) {
        $st = $app['pdo']->prepare('SELECT name FROM test_table');
        $st->execute();
      
        $names = array();
        while ($row = $st->fetch(PDO::FETCH_ASSOC)) {
          $app['monolog']->addDebug('Row ' . $row['name']);
          echo $row['name'];
          $names[] = $row;
        }
      });
      
    $app->run();
    ?>
    <div class="container">
        <div style="float: left" class="left">
            <p>Score: <span id="score"></span></p>
            <p>Hits: <span id="hits"></span></p>
            <p>Turn: <span id="turn"></span></p>
            <h4>Your board:</h4>
            <table id="gameBoard">

            </table> <br>
            <label id="label"></label> <br>
            <button id="startButton">Start</button>
            <button id="randomButton">Random Board</button>
        </div>
        <div style="float: right" class="right">
            <p>Score: <span id="opscore"></span></p>
            <p>Hits: <span id="ophits"></span></p>
            <p>Turn: <span id="opturn"></span></p>
            <h4>Opponent's board:</h4>
            <table id="gameBoard2">

            </table>
        </div>
    </div>
    <script src="static/js/app.js"></script>
    <script src="static/js/ajax.js"></script>
</body>

</html>