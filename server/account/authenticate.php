<?php
$account = $_POST['account'];

// Get account name to set it
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/header.php';
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/db.php';
$query = "select account from `accounts` where account=? limit 1";
if ($stmt = $db->prepare($query)) {
	$stmt->bind_param('s', $account);
	$stmt->execute();
	$stmt->store_result();
	$count = $stmt->num_rows;
	if (!$count) {
		// nothing found
		header('HTTP/1.1 500 Login Failure');
		exit;
	}
}
else {
	header('HTTP/1.1 500 Login Failure');
	exit;
}
// login success
$_SESSION['account'] = $account;
$r['success'] = true;
$r['account'] = $_SESSION['account'];
echo json_encode($r);