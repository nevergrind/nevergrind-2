<?php
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/header.php';
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/db.php';

$empty = empty($_SESSION['account']);

$r['empty'] = $empty;

$r['resetLocalSession'] = true;
if (isset($_SESSION['ng2']['name'])) {
	$r['resetLocalSession'] = false;
}
if (!$empty) {
	$r['account'] = $_SESSION['account'];
	require 'create/loadAllCharacters.php';
}

require 'session/init-timers.php';
$r['session'] = $_SESSION;
echo json_encode($r);