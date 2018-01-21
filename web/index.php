<?php

require('../vendor/autoload.php');
use Symfony\Component\HttpFoundation\Response;

$app = new Silex\Application();
$app['debug'] = true;

$dbopts = parse_url(getenv('DATABASE_URL'));
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

// Register the monolog logging service
$app->register(new Silex\Provider\MonologServiceProvider(), array(
  'monolog.logfile' => 'php://stderr',
));

// Register view rendering
$app->register(new Silex\Provider\TwigServiceProvider(), array(
    'twig.path' => __DIR__.'/views',
));

// Our web handlers

$app->get('/', function() use($app) {
  $app['monolog']->addDebug('logging output.');
  return $app['twig']->render('index.twig');
});

$app->get('/read/', function() use($app) {
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

$app->get('/write/', function() use($app) {
    $column = $_GET['column'];
    $id = intval($_GET['id']);
    $value = $_GET['value'];
    if(!is_numeric($value)) { $value = "'$value'"; }

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

$app->get('/reset/', function() use($app) {
    $query = $sql = "UPDATE gamedata SET active = 0, turn = 0, hits = 0, shipdata = '[]', gamestate = '[]';";

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

$app->get('/db/', function() use($app) {
  $st = $app['pdo']->prepare('SELECT name FROM test_table');
  $st->execute();
  $names = array();
  while ($row = $st->fetch(PDO::FETCH_ASSOC)) {
    $app['monolog']->addDebug('Row ' . $row['name']);
    $names[] = $row;
  }

  return $app['twig']->render('db.twig', array(
    'names' => $names
  ));
});

$app->run();
