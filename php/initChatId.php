<?php
	header('Content-Type: application/json');
	// this has kind of turned into the random initialize stuff I need call
	// no longer needed due to socket chat
	session_start();
	$x = new stdClass();
	$x->account = isset($_SESSION['account']) ? $_SESSION['account'] : '';
	$x->flag = isset($_SESSION['flag']) ? $_SESSION['flag'] : '';
	$x->rating = isset($_SESSION['rating']) ? $_SESSION['rating'] : 1500;
	echo json_encode($x);