<?php
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/header.php';
if (!isset($_SESSION['account'])) {
	header('HTTP/1.1 500 Your session has expired.');
}
else {
	require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/db.php';

	$r['hp'] = $_SESSION['hp'];
	$r['mp'] = $_SESSION['mp'];

	$stmt = $db->prepare('insert into `players` 
		(`id`, `account`, `name`, `level`, `race`, `job`, `zone`) 
		values (?, ?, ?, ?, ?, ?, ?)');

	$stmt->bind_param('ississs',
		$_SESSION['row'],
		$_SESSION['account'],
		$_SESSION['name'],
		$_SESSION['level'],
		$_SESSION['race'],
		$_SESSION['job'],
		$_SESSION['chatChannel']);
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
			'hp' =>	$_SESSION['hp'],
			'mp' =>	$_SESSION['mp'],
			'name' =>	$_SESSION['name'],
			'route' =>	'party->updateBars'
		]));
	}

	echo json_encode($r);
}