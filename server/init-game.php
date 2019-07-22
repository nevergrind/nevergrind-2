<?php
require 'header.php';
require 'db.php';

$empty = empty($_SESSION['account']);

$r['empty'] = $empty;

$r['resetLocalSession'] = true;
if (isset($_SESSION['ng2']['name'])) {
	$r['resetLocalSession'] = false;
}
if (!$empty) {
	$r['account'] = $_SESSION['account'];
	require 'create/load-all-characters.php';
}

require 'session/init-timers.php';
$r['session'] = $_SESSION;
echo json_encode($r);