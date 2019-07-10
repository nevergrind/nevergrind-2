<?php
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/header.php';
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/db.php';

$r = [];

$empty = empty($_SESSION['account']);

$r['empty'] = $empty;
// data to reset sessionStorage.clear();
$r['resetSession'] = null;
if (isset($_SESSION['ng2']['name'])) {
	$r['resetSession'] = $_SESSION['ng2']['name'];
}
if ($empty) {
	// no account data
}
else {
	$r['account'] = $_SESSION['account']; // ?
	require 'create/loadAllCharacters.php';
}

require 'session/init-timers.php';

echo json_encode($r);