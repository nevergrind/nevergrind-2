<?php
require $_SERVER['DOCUMENT_ROOT'] . '/thruway/vendor/voryx/thruway/Examples/bootstrap.php';

$GLOBALS['socket'] = new \Thruway\Connection([
	'realm' => 'realm1',
	'url' => $_SERVER['SERVER_NAME'] === 'localhost' ?
		'ws://127.0.0.1:9090' : 'ws://0.0.0.0:9090'
]);

function zmqSend($channel, $obj) {
	$GLOBALS['channel'] = strtolower($channel);
	$GLOBALS['obj'] = $obj;
	$GLOBALS['socket']->on('open', function (\Thruway\ClientSession $session) {
		$session->publish($GLOBALS['channel'], [], $GLOBALS['obj'], [
			'acknowledge' => true
		])->then(function () {
			$GLOBALS['socket']->close();
		});
	});
	$GLOBALS['socket']->open();
}