<?php
	require_once '../session/start.php';
	require('prepare.php');
	
    require_once '../zmq.php';
	$zmq = [
		'msg' => $postMsg,
		'name' => $_SESSION['name'],
		'level' => $_SESSION['level'],
		'job' => $_SESSION['job'],
		'class' => $_POST['class'],
		'route' => 'chat->log'
	];

	if ($_POST['class'] === 'chat-whisper') {
		$zmq['action'] = $_POST['action'];
	}

	$zmq['category'] = $_POST['category'];
	$socket->send(json_encode($zmq));