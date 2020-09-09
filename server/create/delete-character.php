<?php
	require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/header.php';
	
	$f['row'] = $_POST['row'];
	// name is not taken
	require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/db.php';
	$query = "select row from `characters` where row=? and account=?";
	$stmt = $db->prepare($query);
	$stmt->bind_param('si', $f['row'], $_SESSION['account']);
	$stmt->execute();
	$stmt->bind_result($db_row);
	$stmt->store_result();
	if($stmt->num_rows){
		while($stmt->fetch()){
			$row = $db_row;
		}
		$query = 'update `characters` set deleted=1 where row=?';
		$stmt = $db->prepare($query);
		$stmt->bind_param('i', $row);
		$stmt->execute();
	} 
	else {
		// error
		exit("Character data not found!");
	}
	$r['row'] = $f['row'];
	echo json_encode($r);