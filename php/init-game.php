<?php
require 'connect1.php';
if (!empty($_SESSION['account'])) {
	// nothing
}
else {
	unset($_SESSION['email']);
	unset($_SESSION['account']);
	unset($_SESSION['customerId']);
}

require 'values.php';
$_SESSION['referPath'] = '/classic';

$_POST['app'] *= 1;
$s = new stdClass();
$s->email = '';
$s->chars = [];

if ($_POST['app'] === 0) {
	if (isset($_SESSION['email'])) {
		$email = $_SESSION['email'];
		$result = $link->query("select name, level, race, job, difficulty, zone, zoneN, zoneH, subzone, subzoneN, subzoneH, hardcoreMode, timestamp from characters where email='" . $email . "' order by row limit 16");

		$s->email = $email;
		$i = 0;
		require 'select/load-characters.php';
		header('Content-Type: json/application');
		echo json_encode($s);
	}
	else {

		header('Content-Type: json/application');
		echo json_encode($s);
	}
}
else {
	header('Content-Type: json/application');
	echo json_encode($s);
}