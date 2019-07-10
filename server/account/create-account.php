<?php
session_start();
require '../db.php';

function getRandomString($length)
{
	$charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	$str = '';
	$count = strlen($charset);
	while ($length--) {
		$str .= $charset[mt_rand(0, $count - 1)];
	}
	return $str;
}

$email = strtolower($_POST['email']);
$account = strtolower($_POST['account']);
$password = $_POST['password'];

//validate email address
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
	echo "The server reported an error. Please use a valid email address.";
	exit;
}
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
//check password length
if (strlen($password) < 6) {
	echo "Your password must be six characters long";
	exit;
}
// check that email does not exist
$query = "select email from accounts where email=?";
$stmt = $link->prepare($query);
$stmt->bind_param('s', $email);
$stmt->execute();
$stmt->store_result();
$count = $stmt->num_rows;
if ($count > 0) {
	// email address exists
	echo "This email address has already registered an account!";
	exit;
}
// check that account does not exist
$query = "select account from accounts where account=?";
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
$status = 'active';

$hash = '';
if (
	isset($_POST['password']) &&
	!empty($_POST['password']) &&
	is_string($_POST['password'])
) {
	$salt = getRandomString(rand(100, 200));
	// generate hashed password using random salt
	$hash = crypt($_POST['password'], '$2a$07$' . $salt . '$'); // blowfish
	$password = crypt($_POST['password'], $hash);
	//echo "Posted Password:".$_POST['password']."\nSALT: ".$salt."\nHASH: ".$hash."\nPASSWORD: ".$password;
}
// create account
$crystals = 0;
$kstier = 0;
// promo codes
$confirmCode = getRandomString(rand(35, 45));
// set all data in the DB
$query = "insert into `accounts` (`email`, `account`, `password`, `salt`, `status`, `paid`, `created`, `crystals`, `totalCrystals`, `kstier`, `confirmCode`) VALUES (?, ?, ?, ?, ?, 'false', now(), $crystals, $crystals, $kstier, ?)";
$stmt = $link->prepare($query);
$stmt->bind_param('ssssss', $email, $account, $password, $salt, $status, $confirmCode);
$stmt->execute();
$_SESSION['email'] = $email;
$_SESSION['account'] = $account;

echo 'Account Created!';