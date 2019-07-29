<?php
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/header.php';
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/db.php';

// not leading a party yet
if ($_SESSION['party']['id']) {
	// delete from party
	$stmt = $db->prepare('delete from `parties` where c_id=?');
	$stmt->bind_param('s', $_SESSION['row']);
	$stmt->execute();

	// bars notify party members
	require '../zmq.php';

	$socket->send(json_encode([
		'category' => 'party'. $_SESSION['party']['id'],
		'row' => $_SESSION['row'],
		'route' => 'party->disband',
		'class' => 'chat-warning'
	]));

	// set party session values
	require '../session/init-party.php';
	if ($_POST['count'] > 1) {
		require '../session/init-quest.php';
		// from players log
		$stmt = $db->prepare('delete from `players` where account=?');
		$stmt->bind_param('s', $_SESSION['account']);
		$stmt->execute();
	}
}
echo json_encode($r);
