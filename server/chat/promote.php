<?php
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/header.php';
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/db.php';

// not leading a party yet
if ($_SESSION['party']['id']) {
	// set all to non-leader
	$stmt = $db->prepare('update `parties` set is_leader=0 where p_id=?');
	$stmt->bind_param('i', $_SESSION['party']['id']);
	$stmt->execute();

	// promote to leader by id
	$stmt = $db->prepare('update `parties` set is_leader=1 where c_id=?');
	$stmt->bind_param('s', $_POST['leaderId']);
	$stmt->execute();

	// notify party members
	require_once '../zmq.php';
	zmqSend('party'. $_SESSION['party']['id'], [
		'row' => $_SESSION['row'],
		'name' => $_POST['name'],
		'route' => 'party->promote'
	]);
	echo json_encode($r);
}
else {
	exit("You are not in a party.");
}