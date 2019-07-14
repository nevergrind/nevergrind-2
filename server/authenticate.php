<?php
session_start();
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/db.php';

if (!isset($_POST['password'])) {
	exit;
}
$email = $_POST['email'];
$password = $_POST['password'];

// non-SSO login
$account = '';
// Get account name to set it
if (strpos($email, '@')) {
	// email
	$query = "select account from accounts where email=?";
	$stmt = $link->prepare($query);
	$stmt->bind_param('s', $email);
	$stmt->execute();
	$stmt->store_result();
	$stmt->bind_result($data);
	while ($stmt->fetch()) {
		$account = $data;
	}
} else {
	// account
	$query = "select email from accounts where account=?";
	$stmt = $link->prepare($query);
	$stmt->bind_param('s', $email);
	$stmt->execute();
	$stmt->store_result();
	$stmt->bind_result($data);
	while ($stmt->fetch()) {
		$email = $data;
	}
	$account = $_POST['email'];
}

$query = "select salt, password, status from accounts where email=? limit 1";
if ($stmt = $link->prepare($query)) {
	$stmt->bind_param('s', $email);
	$stmt->execute();
	$stmt->store_result();
	$count = $stmt->num_rows;
	if ($count == 0) {
		// nothing found
		echo "Login Not Successful.";
		exit;
	}
	$stmt->bind_result($stmtSalt, $stmtPassword, $stmtStatus);
	while ($stmt->fetch()) {
		$dbSalt = $stmtSalt;
		$dbPassword = $stmtPassword;
		$dbStatus = $stmtStatus;
	}
	$stmt->close();
} else {
	header('HTTP/1.1 500 Login Failure');
	exit;
}
if ($dbStatus == "suspended") {
	header('HTTP/1.1 500 Account has been suspended');
	exit;
}
if ($dbStatus == "banned") {
	header('HTTP/1.1 500 Account has been banned');
	exit;
}
// compare database value to input - does it match?
$hash = crypt($password, '$2a$07$' . $dbSalt . '$');
$verify = crypt($password, $hash);

if ($dbPassword != $verify) {
	$errorMsg = 'Bad password! Please try again.';
	header('HTTP/1.1 500 ' . $errorMsg);
	exit;
}
// login success
$_SESSION['email'] = $email;
$_SESSION['account'] = $account;

echo "Login successful!";