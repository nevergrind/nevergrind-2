<?php
function zmqSend($channel, $obj) {
	$channel = strtolower($channel);
	$GLOBALS['socket']->on('open', function (\Thruway\ClientSession $session) use ($channel, $obj) {
		$session->publish($channel, [], $obj, [
			'acknowledge' => true
		])->then(function () {
			$GLOBALS['socket']->close();
		});
	});
	$GLOBALS['socket']->open();
}