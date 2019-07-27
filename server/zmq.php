<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/thruway/vendor/voryx/thruway/Examples/bootstrap.php';

$GLOBALS['socket'] = new \Thruway\Connection([
	'realm' => 'realm1',
	'url' => $_SERVER['SERVER_NAME'] === 'localhost' ?
		'ws://127.0.0.1:9090' : 'ws://0.0.0.0:9090'
]);

require_once 'zmq-send.php';