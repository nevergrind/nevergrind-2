<?php
require 'header.php';
require 'db.php';

// steam data if applicable
$version = '2020.1.1';
if ($_POST['version'] !== $version) {
	exit("Firmament Wars is currently being upgraded. We'll be right back!");
}


// game data
if (isset($_SESSION['account'])) {
	$r['id'] = $_SESSION['account'];
	require 'create/load-all-characters.php';
}

echo json_encode($r);