<?php
require $_SERVER['DOCUMENT_ROOT'] . '/thruway/vendor/autoload.php';

$loop   = \React\EventLoop\Factory::create();
$pusher = new \Thruway\Peer\Client("realm1", $loop);

$pusher->on('open', function ($session) use ($loop) {
    $context = new React\ZMQ\Context($loop);
    $pull    = $context->getSocket(ZMQ::SOCKET_PULL);
    $pull->bind('tcp://127.0.0.1:5555');

    $pull->on('message', function ($entry) use ($session) {
        $entryData = json_decode($entry, true);
        if (isset($entryData['category'])) {
            $session->publish($entryData['category'], [$entryData]);
        }
    });
});

$router = new Thruway\Peer\Router($loop);
$router->addInternalClient($pusher);
$router->addTransportProvider(new Thruway\Transport\RatchetTransportProvider("127.0.0.1", 9090));
$router->start();