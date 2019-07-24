<?php
require $_SERVER['DOCUMENT_ROOT'] . '/thruway/vendor/voryx/thruway/Examples/bootstrap.php';

$GLOBALS['socket'] = new \Thruway\Connection([
	'realm' => 'realm1',
	'url' => $_SERVER['SERVER_NAME'] === 'localhost' ?
		'ws://127.0.0.1:9090' : 'ws://0.0.0.0:9090'
]);

function testPush($channel, $obj) {
	$GLOBALS['channel'] = $channel;
	$GLOBALS['obj'] = $obj;
	$GLOBALS['socket']->on('open', function (\Thruway\ClientSession $session) {
		$session->publish($GLOBALS['channel'], [], $GLOBALS['obj'], [
			'acknowledge' => true
		])->then(function () {
			$GLOBALS['socket']->close();
			echo '<pre>Published to channel: ' . $GLOBALS['channel'] . '</pre>';
		});
	});
	$GLOBALS['socket']->open();
}

$channel = 'testqqqq1234';
testPush($channel, [
	'time' => microtime(true)
]);
/*
require_once '../zmq.php';
zmqSend('ng2town', [
	'testing' => time()
]);
 */