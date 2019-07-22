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
		'route' => 'chat->log',
		'category' => $_POST['category']
	];

	if ($_POST['class'] === 'chat-whisper') {
		$zmq['action'] = $_POST['action'];
	}

	zmqSend($_POST['category'], $zmq);