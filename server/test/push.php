<?php
require $_SERVER['DOCUMENT_ROOT'] . '/thruway/vendor/voryx/thruway/Examples/bootstrap.php';

$connection = new \Thruway\Connection([
	'realm' => 'realm1',
	'url' => $_SERVER['SERVER_NAME'] === 'localhost' ?
		'ws://127.0.0.1:9090' : 'ws://0.0.0.0:9090'
]);

$channel = 'test';
$msg = 'Hello, server!';

$connection->on('open', function (\Thruway\ClientSession $session) use ($connection) {
	global $channel, $msg;
	$session->publish($channel, [ $msg ], [ 'time' => microtime(true) ], [
		'acknowledge' => true
	])->then(function () use ($connection) {
		global $channel, $msg;
		$connection->close();
		echo 'Published "' . $msg . '" to channel: ' . $channel;
	});
});
$connection->open();