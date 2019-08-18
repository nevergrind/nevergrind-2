<?php
require_once '../session/start.php';

require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/db.php';
$_SESSION['quest'] = [
	'row' => 0,
	'zone' => '',
	'level' => 0,
	'mob_id' => 0,
	'title' => '',
	'description' => ''
];