<?php
require 'header.php';
require 'db.php';

if (isset($_SESSION['account'])) {
	$r['account'] = $_SESSION['account'];
	require 'create/load-all-characters.php';
}

echo json_encode($r);