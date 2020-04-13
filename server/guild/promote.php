<?php
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/header.php';

require 'is-in-guild.php';
if ($_SESSION['guildRank'] > 1) {
	exit("Only the guild leader or officers can promote members.");
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
if ($rank === 0) {
	exit('You cannot promote the guild leader.');
}
else if ($rank === 1) {
	exit($_POST['name'] . ' is already an officer.');
}
else if ($rank === 3) {
	exit($_POST['name'] . ' is not a guild member!');
}

// promote name
$stmt = $db->prepare('update `guild_members` set rank=1 where c_id=?');
$stmt->bind_param('s', $c_id);
$stmt->execute();

// notify guild members
require '../zmq.php';
$socket->send(json_encode([
	'category' => 'guild'. $_SESSION['guildId'],
	'name' => $_POST['name'],
	'msg' => $_POST['name'] . ' has been promoted to Officer by '. $_SESSION['name'] .'.',
	'route' => 'guild->promote'
]));