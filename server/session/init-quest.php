<?php
if (session_status() === PHP_SESSION_NONE) {
	session_start();
}
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/db.php';
$_SESSION['quest'] = [
	'row' => 0,
	'zone' => '',
	'level' => 0,
	'mob_id' => 0,
	'title' => '',
	'description' => ''
];
$stmt = $link->prepare('update `players` set mission_id=0, zone="ng2:town" where id=?');
$stmt->bind_param('i', $_SESSION['row']);
$stmt->execute();