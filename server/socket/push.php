<?php
// require $_SERVER['DOCUMENT_ROOT'] . '/thruway/vendor/autoload.php';
require '/jet/app/www/default/thruway/vendor/autoload.php';

echo 'Starting react/zmq loop... ';

$loop   = \React\EventLoop\Factory::create();
$pusher = new \Thruway\Peer\Client('realm1', $loop);
$entryData = [];

$pusher->on('open', function ($session) use ($loop, $entryData) {
	echo 'Socket opened...';
    $context = new React\ZMQ\Context($loop);
    $pull    = $context->getSocket(ZMQ::SOCKET_PULL);
    $pull->bind('tcp://0.0.0.0:5555');

    $pull->on('message', function ($entry) use ($session, $entryData) {
        $entryData = json_decode($entry, true);
        if (isset($entryData['category'])) {
            $session->publish($entryData['category'], [$entryData]);
        }
    });
	echo 'React ZMQ loop opened!';
});

$router = new Thruway\Peer\Router($loop);
$router->addInternalClient($pusher);
$router->addTransportProvider(new Thruway\Transport\RatchetTransportProvider('0.0.0.0', 9090));
$router->start();