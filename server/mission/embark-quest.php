<?php

require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/header.php';
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/db.php';
$mobId = isset($_POST['quest']['mobId']) ?
	$_POST['quest']['mobId'] * 1 : $_POST['quest']['mob_id'] * 1;

$mission_id = $_POST['quest']['row'] * 1;

$_SESSION['quest'] = [
	'row' => $mission_id,
	'zone' => $_POST['quest']['zone'],
	'level' => $_POST['quest']['level'] * 1,
	'mob_id' => $mobId,
	'title' => $_POST['quest']['title'],
	'description' => $_POST['quest']['description']
];
$dungeon = 'dng:' . $_POST['quest']['zone'];
$stmt = $db->prepare('update `players` set mission_id=?, zone=? where id=?');
$stmt->bind_param('isi', $mission_id, $dungeon, $_SESSION['row']);
$stmt->execute();

$_SESSION['zone'] = '';

require 'get-zone-mobs.php';

require_once '../zmq.php';

$_SESSION['party']['mission_id'] = $_POST['quest']['row'] * 1;
if (!$_SESSION['party']['id'] || $_SESSION['party']['isLeader']) {
	// solo/leader broadcasts mission update to party
	// my.quest updates
	zmqSend('party_'. $_SESSION['party']['id'], [
		'quest' => $_SESSION['quest'],
		'zoneMobs' => $r['zoneMobs'],
		'route' => 'party->missionUpdate'
	]);
}
if ($_SESSION['party']['id']) {
	zmqSend('party_'. $_SESSION['party']['id'], [
		'msg' => $_SESSION['name'] . ' has embarked into ' . $_SESSION['quest']['zone'],
		'route' => 'chat->log',
		'class' => 'chat-quest'
	]);
}

if ($_SESSION['party']['isLeader']) {
	$zmq = [
		'msg' => 'Mission started: ' . $_SESSION['quest']['title'],
		'route' => 'party->notifyMissionStatus',
		'category' => 'party_'. $_SESSION['party']['id']
	];
}
else {
	$zmq = [
		'msg' => 'Mission started: ' . $_SESSION['quest']['title'],
		'route' => 'party->notifyMissionStatus',
		'routeTo' => 'party',
		'category' => 'name_'. $_SESSION['name']
	];
}
zmqSend($zmq['category'], $zmq);


$r['quest'] = $_SESSION['quest']['row'];

echo json_encode($r);