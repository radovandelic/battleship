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

$app->get('/getall/', function () use ($app) {
    $query = "SELECT * from gamedata";
    $query .= $_GET['id'] ? " WHERE id !=" . $_GET['id'] : "";
    $query .= " ORDER BY id;";
    $st = $app['pdo']->prepare($query);
    $st->execute();
    $data = null;
    while ($row = $st->fetch(PDO::FETCH_ASSOC)) {
        $app['monolog']->addDebug('Row ' . $row['username']);
        $row['shipdata'] = json_decode($row['shipdata']);
        $row['gamestate'] = json_decode($row['gamestate']);
        $data[] = $row;
    }

    $response = new Response();
    $response->setContent(json_encode($data));
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
    $query = "UPDATE gamedata SET active = 0, username = NULL, turn = -1, hits = 0, score = 0,";
    $query .= " shipdata = '$init', gamestate = '$init', timeout = 0";
    $query .= $_GET['id'] ? " WHERE id !=" . $_GET['id'] . ";" : ";";

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

    $content = $request->getContent();
    $json = json_decode($content);

    $location = $json->location;
    $page = $json->page;
    $browser = $json->browser;
    $time = $json->time;
    $ip = $json->ip;

    $query = "INSERT INTO visits (location, page, browser, ip, time) VALUES";
    $query .= " ('$location', '$page', '$browser', '$ip', '$time');";

    $st = $app['pdo']->prepare($query);
    $st->execute();

    $response = new Response();
    $response->setContent("New record created successfully.\n" . json_encode($json));
    $response->setStatusCode(Response::HTTP_OK);

    // set a HTTP response header
    $response->headers->set('Content-Type', 'text/html');

    // print the HTTP headers followed by the content
    $response->send();
});

$app->get('/visits/', function () use ($app) {
    $st = $app['pdo']->prepare('SELECT * FROM visits;');
    $st->execute();
    $visits = array();
    while ($row = $st->fetch(PDO::FETCH_ASSOC)) {
        $app['monolog']->addDebug('Row ' . $row['ip']);
        $visits[] = $row;
    }
    return $app['twig']->render('visits.twig', array(
        'visits' => $visits,
    ));
});

$app->run();
