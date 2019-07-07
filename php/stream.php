<?php
	header('Content-Type: text/event-stream');
	header('Cache-Control: no-cache'); // recommended to prevent caching 
	header('Connection: keep-alive');

	function sendMsg($id, $msg) {
		echo "id: $id" . PHP_EOL;
		echo "data: $msg" . PHP_EOL;
		echo PHP_EOL;
		ob_flush();
		flush();
	}

	$serverTime = time();

	sendMsg($serverTime, 'server time: ' . date("h:i:s", time()));
?>