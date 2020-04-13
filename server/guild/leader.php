<?php
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/header.php';

require 'is-in-guild.php';
if ($_SESSION['guildRank'] !== 0) {
	exit("Only the guild leader can assign a new guild leader.");
}

require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/db.php';

// find player row by name
$stmt = $db->prepare('
	select c.row, g.rank 
	from `characters` c 
	join `guild_members` g 
	on c.row=g.c_id 
	where c.name=?
');
$stmt->bind_param('s', $_POST['name']);
$stmt->execute();
$stmt->bind_result($dbId, $dbRank);

$c_id = 0;
$rank = 3;
while ($stmt->fetch()) {
	$c_id = $dbId;
	$rank = $dbRank;
}
if ($rank === 3) {
	exit($_POST['name'] . ' is not a guild member.');
}
if ($rank === 0) {
	exit('You are already the guild leader!');
}

// promote name
$stmt = $db->prepare('update `guild_members` set rank=0 where c_id=?');
$stmt->bind_param('s', $c_id);
$stmt->execute();

// demote self
$stmt = $db->prepare('update `guild_members` set rank=1 where c_id=?');
$stmt->bind_param('i', $_SESSION['row']);
$stmt->execute();

$_SESSION['guildRank'] = 1;

// notify guild members
require '../zmq.php';
$socket->send(json_encode([
	'category' => 'guild'. $_SESSION['guildId'],
	'name' => $_POST['name'],
	'msg' => $_POST['name'] . ' has been promoted to guild leader by '. $_SESSION['name'] .'.',
	'route' => 'guild->leader'
]));
echo json_encode($r);