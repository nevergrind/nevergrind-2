<?php
$ctx = new ZMQContext();
$socket = $ctx->getSocket(ZMQ::SOCKET_PUSH);
$socket->connect("tcp://127.0.0.1:5555");
$start = microtime(true);
$loops = 1e3;

for ($i=0; $i < $loops; $i++) {
	$socket->send(json_encode([
		'category' => 'test',
		'loop' => $i,
		'time' => microtime(true)
	]));
}

echo 'done with ' . $loops . ' loops in ' . (microtime(true) - $start) . '<br>';