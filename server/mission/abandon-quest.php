<?php

require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/header.php';
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/db.php';

require_once '../zmq.php';
if ($_SESSION['party']['id']) {
	zmqSend('party_' . $_SESSION['party']['id'], [
		'msg' => $_SESSION['name'] . ' has abandoned the mission.',
		'route' => 'chat->log',
		'class' => 'chat-quest'
	]);
}

if ($_SESSION['party']['id']) {

	if ($_SESSION['party']['isLeader']) {
		zmqSend('party_'. $_SESSION['party']['id'], [
			'msg' => 'Mission abandoned: ' . $_SESSION['quest']['title'],
			'route' => 'party->notifyMissionStatus',
			'action' => 'abandon'
		]);
	}
}
else {
	zmqSend('name_'. $_SESSION['name'], [
		'msg' => 'Mission abandoned: ' . $_SESSION['quest']['title'],
		'route' => 'party->notifyMissionStatus',
		'action' => 'abandon',
		'routeTo' => 'party'
	]);
}

require '../session/init-quest.php';

$r['success'] = 1;
echo json_encode($r);