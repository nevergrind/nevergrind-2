<?php
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/header.php';
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/db.php';

// get targeted player.id and party id by name
$query = 'select p.id, g.c_id from `players` p left join `parties` g on p.id=g.c_id where p.name=? limit 1';
$stmt = $db->prepare($query);
$stmt->bind_param('s', $_POST['player']);
$stmt->execute();
$stmt->bind_result($id, $c_id);

error_log('name' . $_POST['player']);

$r['id'] = null;
$r['c_id'] = null;

while ($stmt->fetch()) {
	$r['id'] = $id;
	$r['c_id'] = $c_id;
}
$newParty = 0;

if (is_null($r['id']) ) {
	exit("Player not found.");
}

// notify if null (not in a party)
if (is_null($r['c_id'])) {

	// cannot send invites from dungeon
	if (!$_SESSION['zone']) {
		exit("You cannot invite adventurers from the depths of a dungeon.");
	}

	if ($_SESSION['party']['id']) {
		// party has been created
		if (!$_SESSION['party']['isLeader']) {
			// must be leader to invite
			exit ("Only the party leader can invite players to join.");
		}
	}
	else {
		// create new party with me as leader
		$newParty = 1;
		require '../session/init-party.php';
		$stmt = mysqli_query($db,
			'insert into `parties` (is_leader, c_id, hp, maxHp, mp, maxMp) VALUES (1, '. $_SESSION['row'] .', '.
			$_SESSION['hp'] .', '.
			$_SESSION['maxHp'] .', '.
			$_SESSION['mp'] .', '.
			$_SESSION['maxMp'] .')'
		);

		// last insert id is GET value
		$p_id = $_SESSION['party']['id'] = mysqli_insert_id($db);
		$_SESSION['party']['isLeader'] = 1;

		// update p_id with what I just inserted with
		$stmt = mysqli_query($db,
			'update `parties` set p_id='. $p_id .' where row='. $p_id
		);
	}
	// send invite
	$data = [
		'category' => 'name'. $_POST['player'],
		'row' => $_SESSION['party']['id'],
		'msg' => $_SESSION['name'] . ' has invited you to join his party.',
		'name' => $_SESSION['name'],
		'cId' => $_SESSION['row'],
		'action' => 'party-invite',
		'css' => 'prompt-party-invite'
	];
	error_log(print_r($data, true));
	require '../zmq.php';
	$socket->send(json_encode($data));

	$r['newParty'] = $newParty;
	$r['p_id'] = $_SESSION['party']['id'];
	echo json_encode($r);
}
else {
	exit("Player is already in a party.");
}