<?php
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/header.php';

require 'is-in-guild.php';
if ($_SESSION['guild']['rank'] > 1) {
	exit("Only the guild leader or officers can boot members.");
}

require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/db.php';

// find player row by name
$stmt = $db->prepare('
	select g.rank 
	from `characters` c 
	join `guild_members` g 
	on c.row=g.c_id 
	where c.name=?
');
$stmt->bind_param('s', $_POST['name']);
$stmt->execute();
$stmt->bind_result($dbRank);

$rank = 3;
while ($stmt->fetch()) {
	$rank = $dbRank;
}
if ($rank === 3) {
	exit($_POST['name'] . ' is not a guild member.');
}
if ($rank <= $_SESSION['guild']['rank']) {
	exit('You may only boot members that you outrank.');
}

// notify party members
require '../zmq.php';
$socket->send(json_encode([
	'category' => 'guild'. $_SESSION['guild']['id'],
	'name' => $_POST['name'],
	'msg' => $_POST['name'] . ' has been booted by  '. $_SESSION['name'] .'!',
	'route' => 'guild->boot'
]));
echo json_encode($r);