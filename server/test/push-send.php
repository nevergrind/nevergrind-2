<?php
$ctx = new ZMQContext();
$socket = $ctx->getSocket(ZMQ::SOCKET_PUSH);
$socket->connect("tcp://localhost:5555");
$start = microtime(true);
$loops = 10000;

for ($i=0; $i < $loops; $i++) {
	$socket->send(json_encode([
		'category' => 'test',
		'time' => $start
	]));
}

echo 'done with ' . $loops . ' loops in ' . (microtime(true) - $start) . '<br>';