<?php
require 'header.php';
require 'db.php';

if (isset($_SESSION['id'])) {
	$r['id'] = $_SESSION['id'];
	require 'create/load-all-characters.php';
}

echo json_encode($r);