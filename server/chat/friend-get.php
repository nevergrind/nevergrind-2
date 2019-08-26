<?php
	require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/header.php';
	require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/db.php';
	$query = 'select friend from `friends` where account=?';
	$stmt = $db->prepare($query);
	$stmt->bind_param('i', $_SESSION['id']);
	$stmt->execute();
	$stmt->bind_result($friend);

	$i = 0;
	while($stmt->fetch()){
		$r[$i++] = $friend;
	}
	echo json_encode($r);