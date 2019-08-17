<?php
require 'header.php';
require 'db.php';

$empty = empty($_SESSION['account']);
$r['resetLocalSession'] = isset($_SESSION['name']) ? true : false;

if (!$empty) {
	$r['account'] = $_SESSION['account'];
	require 'create/load-all-characters.php';
}

echo json_encode($r);