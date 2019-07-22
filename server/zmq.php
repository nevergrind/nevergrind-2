<?php
require $_SERVER['DOCUMENT_ROOT'] . '/thruway/vendor/voryx/thruway/Examples/bootstrap.php';

$socket = new \Thruway\Connection([
	'realm' => 'realm1',
	'url' => $_SERVER['SERVER_NAME'] === 'localhost' ?
		'ws://127.0.0.1:9090' : 'ws://0.0.0.0:9090'
]);

function zmqSend($channel, $obj) {
	global $socket;
	$socket->on('open', function (\Thruway\ClientSession $session) use ($socket) {
		global $channel, $obj;
		$session->publish($channel, [], $obj, [
			'acknowledge' => true
		])->then(function () use ($socket) {
			$socket->close();
		});
	});
	$socket->open();
}