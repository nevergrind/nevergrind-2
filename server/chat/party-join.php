<?php
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/header.php';
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/db.php';

// Count number of players in the party already
$query = 'SELECT count(row) count FROM `parties` where p_id=?';
$stmt = $db->prepare($query);
$stmt->bind_param('s', $_POST['row']);
$stmt->execute();
$stmt->bind_result($dbCount);
$partyCount = 0;

while ($stmt->fetch()){
	$partyCount = $dbCount;
}
$r['partyCount'] = $partyCount;
// if between 1 and 6 allow to join
if ($partyCount >= 1 && $partyCount < 6) {
	// valid!
	if (!$_SESSION['party']['id']) {
		// not leading a party yet
		require '../session/init-party.php';

		$stmt = $db->prepare('insert into `parties` (c_id, p_id, hp, maxHp, mp, maxMp) values (?, ?, ?, ?, ?, ?)');

		$stmt->bind_param('ssiiii',
			$_SESSION['row'],
			$_POST['row'],
			$_SESSION['hp'],
			$_SESSION['maxHp'],
			$_SESSION['mp'],
			$_SESSION['maxMp']);

		$stmt->execute();

		// update session quest
		$c_id = $_POST['cId'] * 1;
		$stmt = $db->prepare(
			'select m.row, m.zone, m.level, m.mob_id, m.title, m.description 
			from `players` p 
			join `mission_list` m 
			on p.mission_id=m.row
			where p.id=?'
		);
		$stmt->bind_param('i', $c_id);
		$stmt->execute();
		$stmt->bind_result($row, $zone, $level, $mob_id, $title, $description);

		while ($stmt->fetch()) {
			$_SESSION['quest'] = [
				'row' => $row,
				'zone' => $zone,
				'level' => $level,
				'mob_id' => $mob_id,
				'title' => $title,
				'description' => $description
			];
		}
		// update db
		$stmt = $db->prepare('update `players` set mission_id=? where id=?');
		$stmt->bind_param('ii', $mission_id, $_SESSION['row']);
		$stmt->execute();

		$_SESSION['party'] = [
			'id' => $_POST['row'] * 1,
			'isLeader' => false,
			'mission_id' => $mission_id
		];

		if ($c_id) {
		}

		// notify party
		require '../zmq.php';
		$socket->send(json_encode([
			'category' => 'party'. $_POST['row'],
			'msg' => $_SESSION['name'] . ' has joined the party.',
			'route' => 'party->join'
		]));
		echo json_encode($r);
	}
	else {
		exit("You must disband your party before joining another.");
	}
}
else {
	exit("You cannot join this party.");
}