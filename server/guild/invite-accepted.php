<?php
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/header.php';
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/db.php';

// Count number of players in the party already
$query = 'SELECT row count FROM `guild_members` where c_id=?';
$stmt = $db->prepare($query);
$stmt->bind_param('s', $_POST['row']);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows) exit("You are already in a guild.");

// insert into member table
$stmt = $db->prepare('insert into `guild_members` (
	rank, c_id, g_id
	) values (
	2, ?, ?)');

$stmt->bind_param('is', $_SESSION['row'], $_POST['row']);
$stmt->execute();

// get guild info
require '../guild/get-guild-data.php';

// notify party
require '../zmq.php';
$socket->send(json_encode([
	'category' => 'guild'. $_POST['row'],
	'msg' => $_SESSION['name'] . ' has joined ' . $_POST['guildName'] .'.',
	'route' => 'guild->hasJoined'
]));

echo json_encode($r);
