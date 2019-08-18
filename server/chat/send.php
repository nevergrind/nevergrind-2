<?php
	require_once '../session/start.php';
	require('prepare.php');

	$zmq = [
		'msg' => $postMsg,
		'name' => $_SESSION['name'],
		'level' => $_SESSION['level'],
		'job' => $_SESSION['job'],
		'class' => $_POST['class'],
		'route' => isset($route) ? $route : 'chat->log',
		'category' => isset($category) ? $category : $_POST['category']
	];

	if ($_POST['class'] === 'chat-whisper') {
		$zmq['action'] = $_POST['action'];
	}
	require '../zmq.php';
	$socket->send(json_encode($zmq));