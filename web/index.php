<?php
header("Access-Control-Allow-Origin: *");
require '../vendor/autoload.php';
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

$app = new Silex\Application();
$app['debug'] = true;

$dbopts = parse_url(getenv('DATABASE_URL'));
$app->register(new Csanquer\Silex\PdoServiceProvider\Provider\PDOServiceProvider('pdo'),
    array(
        'pdo.server' => array(
            'driver' => 'pgsql',
            'user' => $dbopts["user"],
            'password' => $dbopts["pass"],
            'host' => $dbopts["host"],
            'port' => $dbopts["port"],
            'dbname' => ltrim($dbopts["path"], '/'),
        ),
    )
);

// Register the monolog logging service
$app->register(new Silex\Provider\MonologServiceProvider(), array(
    'monolog.logfile' => 'php://stderr',
));

// Register view rendering
$app->register(new Silex\Provider\TwigServiceProvider(), array(
    'twig.path' => __DIR__ . '/views',
));

// Our web handlers

$app->get('/', function () use ($app) {
    $app['monolog']->addDebug('logging output.');
    return $app['twig']->render('index.twig');
});

$app->get('/read/', function () use ($app) {
    $id = intval($_GET['id']);
    $query = "SELECT * from gamedata WHERE id = $id;";
    $st = $app['pdo']->prepare($query);
    $st->execute();
    $data = null;
    while ($row = $st->fetch(PDO::FETCH_ASSOC)) {
        $app['monolog']->addDebug('Row ' . $row['username']);
        $row['shipdata'] = json_decode($row['shipdata']);
        $row['gamestate'] = json_decode($row['gamestate']);
        $data = json_encode($row);
    }

    $response = new Response();
    $response->setContent($data);
    $response->setStatusCode(Response::HTTP_OK);

    // set a HTTP response header
    $response->headers->set('Content-Type', 'text/html');

    // print the HTTP headers followed by the content
    $response->send();
});

$app->get('/write/', function () use ($app) {
    $column = $_GET['column'];
    $id = intval($_GET['id']);
    $value = $_GET['value'];
    if (!is_numeric($value)) {$value = "'$value'";}

    $query = "UPDATE gamedata SET $column = $value WHERE id = $id;";

    $st = $app['pdo']->prepare($query);
    $st->execute();

    $response = new Response();
    $response->setContent("New record created successfully.");
    $response->setStatusCode(Response::HTTP_OK);

    // set a HTTP response header
    $response->headers->set('Content-Type', 'text/html');

    // print the HTTP headers followed by the content
    $response->send();
});

$app->get('/reset/', function () use ($app) {
    $init = "[
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
  ]";
    $query = $sql = "UPDATE gamedata SET active = 0, turn = 0, hits = 0, score = 0, shipdata = '$init', gamestate = '$init', timeout = 0;";

    $st = $app['pdo']->prepare($query);
    $st->execute();

    $response = new Response();
    $response->setContent("Server succesfully reset.");
    $response->setStatusCode(Response::HTTP_OK);

    // set a HTTP response header
    $response->headers->set('Content-Type', 'text/html');

    // print the HTTP headers followed by the content
    $response->send();
});

$app->post('/visit/', function () use ($app) {

    $request = Request::createFromGlobals();
    // the URI being requested (e.g. /about) minus any query parameters
    //$request->getPathInfo();

    // retrieve $_GET and $_POST variables respectively
    $content = $request->getContent();
    $content = str_replace('\\', '', $content);
    //$json = json_decode($content);

    /*$location = $_POST['location'];
    $page = $_POST['page'];
    $browser = $_POST['browser'];
    $time = $_POST['time'];*/

    /*$query = "INSERT INTO visitors (location, page, browser, time) VALUES";
    $query .= " ('$location', '$page', '$browser', '$time');";

    $st = $app['pdo']->prepare($query);
    $st->execute();*/

    $response = new Response();
    $response->setContent(json_encode($content));
    $response->setStatusCode(Response::HTTP_OK);

    // set a HTTP response header
    $response->headers->set('Content-Type', 'text/html');

    // print the HTTP headers followed by the content
    $response->send();
});

/* $app->get('/visitors/', function() use($app) {
$st = $app['pdo']->prepare('SELECT * FROM visitors;');
$st->execute();
$visitors = array();
while ($row = $st->fetch(PDO::FETCH_ASSOC)) {
$app['monolog']->addDebug('Row ' . $row['location']);
$visitors[] = $row;
}

return $app['twig']->render('visitors.twig', array(
'visitors' => $visitors
));
}); */

$app->run();
