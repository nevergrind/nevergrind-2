<?php
if (!isset($db)) {
	require $_SERVER['DOCUMENT_ROOT'] . '/ng2/config.php';
	$db = mysqli_connect('localhost', $config['db']['user'], $config['db']['pw'], $config['db']['database'], $config['db']['port']);
	if (!$db) { die('Database connection failure: '); }
}
