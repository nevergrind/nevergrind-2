<?php
session_start();
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/db.php';

$account = strtolower($_POST['account']);

// all alphabetic?
if (!ctype_alnum(str_replace('_', '', $account))) {
	echo "Please use only letters, numbers, and underscores in your account name.";
	exit;
}
// check account name isn't too long or short
if (strlen($account) < 2) {
	echo "Your account name must be between 2-16 characters long.";
	exit;
}
if (strlen($account) > 16) {
	echo "Your account name must be between 2-16 characters long.";
	exit;
}
// check that account does not exist
$query = 'select account from `accounts` where account=?';
$stmt = $link->prepare($query);
$stmt->bind_param('s', $account);
$stmt->execute();
$stmt->store_result();
$count = $stmt->num_rows;
if ($count > 0) {
	// account exists
	echo "This account name is already taken!";
	exit;
}

// create account
$query = 'insert into `accounts` (`account`) VALUES (?)';
$stmt = $link->prepare($query);
$stmt->bind_param('s', $account);
$stmt->execute();

$_SESSION['account'] = $account;
echo 'Account Created!';