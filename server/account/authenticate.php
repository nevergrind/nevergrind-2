<?php

// Get account name to set it
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/header.php';
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/db.php';

$account = $_POST['account'];
$row = 0;
$query = "select row, account 
	from `accounts` 
	where account=? limit 1";
if ($stmt = $db->prepare($query)) {
	$stmt->bind_param('s', $account);
	$stmt->execute();
	$stmt->store_result();
	$stmt->bind_result($dbRow, $dbAccount);
	$count = $stmt->num_rows;
	if (!$count) {
		// nothing found
		header('HTTP/1.1 500 Login Failure');
		exit;
	}
	while($stmt->fetch()){
		$row = $dbRow;
		$account = $dbAccount;
	}
}
else {
	header('HTTP/1.1 500 Login Failure');
	exit;
}
// update login time
$stmt = $db->prepare('update `accounts` set last_login=now() where row=?');
$stmt->bind_param('i', $row);
$stmt->execute();
// login success
$_SESSION['id'] = $row;
$r['success'] = true;
$r['account'] = $account;
echo json_encode($r);