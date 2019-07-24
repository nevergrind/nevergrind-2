<?php
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/header.php';
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/db.php';

// not leading a party yet
if (!empty($_SESSION['guild']) &&
	$_SESSION['guild']['rank'] < 1) {
	// find player row by name
	$stmt = $db->prepare('select row from `characters` where name=?');
	$stmt->bind_param('s', $_POST['name']);
	$stmt->execute();
	$stmt->bind_result($dbId);

	$c_id = 0;
	while ($stmt->fetch()) {
		$c_id = $dbId;
	}

	// promote name
	$stmt = $db->prepare('update `guild_members` set rank=0 where c_id=?');
	$stmt->bind_param('s', $c_id);
	$stmt->execute();

	// demote self
	$stmt = $db->prepare('update `guild_members` set rank=1 where c_id=?');
	$stmt->bind_param('s', $_SESSION['row']);
	$stmt->execute();

	$_SESSION['guild']['rank'] = 1;

	// notify guild members
	require_once '../zmq.php';
	zmqSend('guild'. $_SESSION['guild']['id'], [
		'name' => $_POST['name'],
		'msg' => $_POST['name'] . ' has been promoted to guild Leader by '. $_SESSION['name'] .'.',
		'route' => 'guild->leader'
	]);
	echo json_encode($r);
}
else {
	exit("You are not in a guild.");
}