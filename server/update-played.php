<?php
require_once 'session/start.php';
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/db.php';

$now = time();
if ($_SESSION['ng2']['played']) {
	if ($now - $_SESSION['ng2']['played'] >= 60) {
		$stmt = $db->prepare('update `characters` set playtime=playtime+1 where row=?');
		$stmt->bind_param('s', $_SESSION['ng2']['row']);
		$stmt->execute();
		$_SESSION['ng2']['played'] = $now;
	}
}
