<?php
	require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/header.php';
	
	$f['row'] = $_POST['row'];
	// name is not taken
	require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/db.php';
	$query = "select row from `characters` where row=? and account=?";
	$stmt = $link->prepare($query);
	$stmt->bind_param('ss', $f['row'], $_SESSION['account']);
	$stmt->execute();
	$stmt->bind_result($db_row);
	$stmt->store_result();
	if($stmt->num_rows){
		while($stmt->fetch()){
			$row = $db_row;
		}
		$query = 'update `characters` set deleted=1, name=NULL where row=?';
		$stmt = $link->prepare($query);
		$stmt->bind_param('i', $row);
		$stmt->execute();
	} 
	else {
		// error
		exit("Character data not found!");
	}
	$r['file'] = 'delete-character.php';
	$r['row'] = $f['row'];
	echo json_encode($r);