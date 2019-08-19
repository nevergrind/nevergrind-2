<?php
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/header.php';
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/db.php';

// not leading a party yet
if (!empty($_SESSION['guild']) && $_SESSION['guild']['rank'] < 2) {
	// delete from party
	$stmt = $db->prepare('update `guilds` set motd=? where row=?');
	$stmt->bind_param('si', $_POST['msg'], $_SESSION['guild']['id']);
	$stmt->execute();

	// notify guild members
	require '../zmq.php';
	$socket->send(json_encode([
		'category' => 'guild'. $_SESSION['guild']['id'],
		'prefix' => $_SESSION['name'] . ' has set a new message of the day: ',
		'msg' => $_POST['msg'],
		'route' => 'guild->motd'
	]));

	echo json_encode($r);
}
else {
	exit("You must be a guild leader or officer to use this command.");
}