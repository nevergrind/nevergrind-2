<?php
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/header.php';
if (!isset($_SESSION['account'])) {
	header('HTTP/1.1 500 Your session has expired.');
}
else {
	/*$now = time();
	if ($_SESSION['timer']['heartbeat']) {
		if ($now - $_SESSION['timer']['heartbeat'] >= 5) {
			$_SESSION['timer']['heartbeat'] = $now;
		}
		else {
			exit('Timing invalid');
		}
	}*/

	//require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/db.php';
	// tick HP & MP
	$_SESSION['hp'] += $_SESSION['hpRegen'];
	if ($_SESSION['hp'] > $_SESSION['maxHp']) {
		$_SESSION['hp'] = $_SESSION['maxHp'];
	}
	$r['hp'] = $_SESSION['hp'];

	$_SESSION['mp'] += $_SESSION['mpRegen'];
	if ($_SESSION['mp'] > $_SESSION['maxMp']) {
		$_SESSION['mp'] = $_SESSION['maxMp'];
	}
	$r['mp'] = $_SESSION['mp'];

	/*$stmt = $db->prepare('update `players` set timestamp=now() where id=?');
	$stmt->bind_param('i', $_SESSION['row']);
	$stmt->execute();

	// update parties hp/mp
	if ($_SESSION['party']['id']) {
		$stmt = $db->prepare('update `parties` set hp=?, mp=? where c_id=?');
		$stmt->bind_param('iii',
			$_SESSION['hp'],
			$_SESSION['mp'],
			$_SESSION['row']);
		$stmt->execute();

		require 'zmq.php';
		$socket->send(json_encode([
			'category' => 'party'. $_SESSION['party']['id'],
			'hp' => $_SESSION['hp'],
			'mp' => $_SESSION['mp'],
			'name' => $_SESSION['name'],
			'route' => 'party->updateBars'
		]));
	}*/

	echo json_encode($r);
}
