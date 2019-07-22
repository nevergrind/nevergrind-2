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
// increment guild member count
$query = 'update `guilds` set members=members+1, member_number=member_number+1 where row=?';
$stmt = $db->prepare($query);
$stmt->bind_param('s', $_POST['row']);
$stmt->execute();

// get guild number
$query = 'SELECT member_number FROM `guilds` where row=?';
$stmt = $db->prepare($query);
$stmt->bind_param('s', $_POST['row']);
$stmt->execute();
$stmt->bind_result($dbCount);
$memberNumber = 0;
while ($stmt->fetch()){
	$memberNumber = $dbCount * 1;
}

// insert into member table
$stmt = $db->prepare('insert into `guild_members` (
	rank, c_id, g_id, member_number
	) values (
	2, ?, ?, '. $memberNumber .')');

$stmt->bind_param('is', $_SESSION['row'], $_POST['row']);
$stmt->execute();

// get guild info
require '../guild/get-guild-data.php';

// notify party
require_once '../zmq.php';
$zmq = [
	'msg' => $_SESSION['name'] . ' has joined ' . $_POST['guildName'] .'.',
	'route' => 'guild->hasJoined',
	'category' => 'guild:'. $_POST['row']
];
$socket->send(json_encode($zmq));

echo json_encode($r);
