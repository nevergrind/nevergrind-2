<?php
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/header.php';
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/db.php';

if ($_SESSION['party']['id']) {
	// delete from party
	$stmt = $db->prepare('delete from `parties` where c_id=?');
	$stmt->bind_param('s', $_POST['id']);
	$stmt->execute();

	// notify party members
	require '../zmq.php';
	$socket->send(json_encode([
		'category' => 'party'. $_SESSION['party']['id'],
		'row' => $_POST['id'],
		'name' => $_POST['name'],
		'route' => 'party->boot'
	]));
	echo json_encode($r);
}
else {
	exit("You are not in a party.");
}