<?php
if (!isset($_POST['password'])) {
	echo 'Password not sent';
	exit;
}
$account = $_POST['account'];
$password = $_POST['password'];
$dbPassword = '';

/*$account = 'chrome9';
$password = '123456';*/
// Get account name to set it
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/db.php';
$query = "select password from accounts where account=? limit 1";
if ($stmt = $link->prepare($query)) {
	$stmt->bind_param('s', $account);
	$stmt->execute();
	$stmt->store_result();
	$count = $stmt->num_rows;
	if ($count == 0) {
		// nothing found
		echo "Login Not Successful.";
		exit;
	}
	$stmt->bind_result($stmtPassword);
	while ($stmt->fetch()) {
		$dbPassword = $stmtPassword;
	}
}
else {
	header('HTTP/1.1 500 Login Failure');
	exit;
}
// compare database value to input - does it match?
if ($dbPassword !== $password) {
	$errorMsg = 'Bad password! Please try again.';
	header('HTTP/1.1 500 ' . $errorMsg);
	exit;
}
// login success
session_start();
$_SESSION['account'] = $account;

echo "Login successful!";