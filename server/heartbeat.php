<?php
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/header.php';
if (!isset($_SESSION['account'])) {
	header('HTTP/1.1 500 Your session has expired.');
}
else {

	$now = time();
	if ($_SESSION['timer']['heartbeat']) {
		if ($now - $_SESSION['timer']['heartbeat'] >= 5) {
			$_SESSION['timer']['heartbeat'] = $now;
		}
		else {
			exit('Timing invalid');
		}
	}

	require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/db.php';
	// tick HP & MP
	$_SESSION['ng2']['hp'] += $_SESSION['ng2']['hpRegen'];
	if ($_SESSION['ng2']['hp'] > $_SESSION['ng2']['maxHp']) {
		$_SESSION['ng2']['hp'] = $_SESSION['ng2']['maxHp'];
	}
	$r['hp'] = $_SESSION['ng2']['hp'];

	$_SESSION['ng2']['mp'] += $_SESSION['ng2']['mpRegen'];
	if ($_SESSION['ng2']['mp'] > $_SESSION['ng2']['maxMp']) {
		$_SESSION['ng2']['mp'] = $_SESSION['ng2']['maxMp'];
	}
	$r['mp'] = $_SESSION['ng2']['mp'];

	$stmt = $db->prepare('update `players` set timestamp=now() where id=?');
	$stmt->bind_param('i', $_SESSION['ng2']['row']);
	$stmt->execute();

	// update `parties` hp/mp
	if ($_SESSION['party']['id']) {
		$stmt = $db->prepare('update `parties` set hp=?, mp=? where c_id=?');
		$stmt->bind_param('iii',
			$_SESSION['ng2']['hp'],
			$_SESSION['ng2']['mp'],
			$_SESSION['ng2']['row']);
		$stmt->execute();

		require_once 'zmq.php';
		$zmq = [
			'hp' => $_SESSION['ng2']['hp'],
			'mp' => $_SESSION['ng2']['mp'],
			'name' => $_SESSION['ng2']['name'],
			'route' => 'party->updateBars',
			'category' => 'party:'. $_SESSION['party']['id']
		];
		$socket->send(json_encode($zmq));
	}

	echo json_encode($r);
}
