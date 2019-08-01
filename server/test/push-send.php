<?php
$start = microtime(true);
require '../zmq.php';
$loops = 1e3;

for ($i=0; $i < $loops; $i++) {
	$socket->send(json_encode([
		'category' => 'test',
		'loop' => $i,
		'time' => microtime(true)
	]));
}

echo 'done with ' . $loops . ' loops in ' . (microtime(true) - $start) . '<br>';