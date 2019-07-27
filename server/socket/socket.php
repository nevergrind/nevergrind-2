<?php
require $_SERVER['DOCUMENT_ROOT'] . '/thruway/vendor/voryx/thruway/Examples/bootstrap.php';

use Thruway\Peer\Router;
use Thruway\Transport\RatchetTransportProvider;
$router = new Router();
$transportProvider = new RatchetTransportProvider('127.0.0.1', 9090);
$router->addTransportProvider($transportProvider);
$router->start();