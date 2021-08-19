<?php
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/header.php';
require 'is-in-guild.php';
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/db.php';

if (isset($_SESSION['guildId']) ) {
	// check length
	$query = "select members from `guilds` where row=?";
	$stmt = $db->prepare($query);
	$stmt->bind_param('s', $_SESSION['guildId']);
	$stmt->execute();
	$stmt->bind_result($dbcount);
	$stmt->store_result();
	$totalMembers = 0;
    while($stmt->fetch()){
        $totalMembers = $dbcount;
    }

	if ($_SESSION['guildRank'] === 0) {
		if ($totalMembers > 1) {
			exit("You must promote another officer to leader using /gleader first");
		}
	}
	// delete member from guild
	$stmt = $db->prepare('delete from `guild_members` where c_id=?');
	$stmt->bind_param('i', $_SESSION['row']);
	$stmt->execute();

	// notify guild members
	if ($totalMembers > 1) {
		require '../zmq.php';
		$zmq = [];
		if (!isset($_POST['action'])) {
			$zmq['msg'] = $_SESSION['name'] . ' has left '. $_SESSION['guildName'] .'.';
		}
		$zmq['route'] = 'guild->quit';
		$zmq['category'] = 'guild'. $_SESSION['guildId'];
		$socket->send(json_encode($zmq));
	}
	else {
		// delete the guild!
		$stmt = $db->prepare('delete from `guilds` where row=?');
		$stmt->bind_param('i', $_SESSION['guildId']);
		$stmt->execute();
	}

	// set guild session values
	require '../session/init-guild.php';
	echo json_encode($r);
}
else {
	exit("You are not in a guild.");
}