<?php
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/header.php';
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/db.php';

// get targeted player.id and party id by name
$query = 'select 
	p.id, 
	g.c_id 
	from `players` p 
	left join `guild_members` g 
	on p.id=g.c_id 
	where p.name=? limit 1';

$stmt = $db->prepare($query);
$stmt->bind_param('s', $_POST['player']);
$stmt->execute();
$stmt->bind_result($id, $c_id);

$r['id'] = null;
$r['c_id'] = null;

while ($stmt->fetch()) {
	$r['id'] = $id;
	$r['c_id'] = $c_id;
}

if (is_null($r['id']) ) {
	exit("Player not found.");
}

// are they in a guild?
if (is_null($r['c_id'])) {

	// not leading a party yet
	if ($_SESSION['guildRank'] > 1) {
		// must be leader to invite
		exit ("Only the guild leader or officers can invite players to join the guild.");
	}
	// send guild invite
	require '../zmq.php';
	$socket->send(json_encode([
		'category' => 'name'. $_POST['player'],
		'row' => $_SESSION['guildId'],
		'msg' => $_SESSION['name'] . ' has invited you to join the guild: '. $_SESSION['guildName'],
		'name' => $_SESSION['name'],
		'guildName' => $_SESSION['guildName'],
		'action' => 'guild-invite',
		'css' => 'prompt-guild-invite'
	]));
	echo json_encode($r);
}
else {
	exit("Player is already in a guild.");
}