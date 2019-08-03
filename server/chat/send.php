<?php
	require_once '../session/start.php';
	require('prepare.php');

	$zmq = [
		'msg' => $postMsg,
		'name' => $_SESSION['name'],
		'level' => $_SESSION['level'],
		'job' => $_SESSION['job'],
		'class' => $_POST['class'],
		'route' => 'chat->log',
		'category' => $_POST['category']
	];

	if ($_POST['class'] === 'chat-whisper') {
		$zmq['action'] = $_POST['action'];
	}
	$zmq['category'] = $_POST['category'];
	require '../zmq.php';
	$socket->send(json_encode($zmq));