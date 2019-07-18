<?php
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/header.php';
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/db.php';

if (!empty($_SESSION['guild']) &&
	isset($_SESSION['guild']['id']) ) {
	// check length
	$query = "select members from `guilds` where row=?";
	$stmt = $link->prepare($query);
	$stmt->bind_param('s', $_SESSION['guild']['id']);
	$stmt->execute();
	$stmt->bind_result($dbcount);
	$stmt->store_result();
	$totalMembers = 0;
    while($stmt->fetch()){
        $totalMembers = $dbcount;
    }

	if ($_SESSION['guild']['rank'] === 0) {
		if ($totalMembers > 1) {
			exit("You must promote another officer to Leader using /gleader first");
		}
	}
	// delete member from guild
	$stmt = $link->prepare('delete from `guild_members` where c_id=?');
	$stmt->bind_param('s', $_SESSION['row']);
	$stmt->execute();
	// if it has zero members delete the guild, too
	$totalMembers = $totalMembers - 1;
	if (!$totalMembers) {
		// delete the guild
		$stmt = $link->prepare('delete from `guilds` where row=?');
		$stmt->bind_param('s', $_SESSION['guild']['id']);
		$stmt->execute();
	}
	else {
		// subtract from member count
		$query = 'update `guilds` set members=members-1 where row=?';
		$stmt = $link->prepare($query);
		$stmt->bind_param('s', $_SESSION['guild']['id']);
		$stmt->execute();
	}

	// notify guild members
	require_once '../zmq.php';
	$zmq = new stdClass();
	if (!isset($_POST['action'])) {
		$zmq->msg = $_SESSION['name'] . ' has left '. $_SESSION['guild']['name'] .'.';
	}
	$zmq->route = 'guild->quit';
	$zmq->category = 'guild:'. $_SESSION['guild']['id'];
	$socket->send(json_encode($zmq));

	// set guild session values
	require '../session/init-guild.php';
	echo json_encode($r);
}
else {
	exit("You are not in a guild.");
}