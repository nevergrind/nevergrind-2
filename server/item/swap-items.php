<?php
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/header.php';
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/db.php';
/*
dragData: item.dragData,
dragSlot: item.dragSlot,
dragType: item.dragType,
dropData: item.dropData,
dropSlot: item.dropSlot,
dropSlot: item.dropType,
 */

error_log('///////// swap-items /////////');
error_log('dragRow ' . $_POST['dragRow']);
error_log('dragItemId ' . $_POST['dragItemId']);
error_log('dragSlot ' . $_POST['dragSlot']);
error_log('dragType ' . $_POST['dragType']);

error_log('dropRow ' . $_POST['dropRow']);
error_log('dropItemId ' . $_POST['dropItemId']);
error_log('dropSlot ' . $_POST['dropSlot']);
error_log('dropType ' . $_POST['dropType']);


echo json_encode($r);
// get targeted player.id and party id by name
/*$query = 'select
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
	if (!empty($_SESSION['guild']) ) {
		// party has been created
		if ($_SESSION['guild']['rank'] > 1) {
			// must be leader to invite
			exit ("Only the guild leader or officers can invite players to join the guild.");
		}
	}
	// send guild invite
	require '../zmq.php';
	$socket->send(json_encode([
		'category' => 'name'. $_POST['player'],
		'row' => $_SESSION['guild']['id'],
		'msg' => $_SESSION['name'] . ' has invited you to join the guild: '. $_SESSION['guild']['name'],
		'name' => $_SESSION['name'],
		'guildName' => $_SESSION['guild']['name'],
		'action' => 'guild-invite',
		'css' => 'prompt-guild-invite'
	]));
	echo json_encode($r);
}
else {
	exit("Player is already in a guild.");
}*/