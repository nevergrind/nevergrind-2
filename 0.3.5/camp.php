<?php
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/header.php';
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/db.php';
// update with cached minutes
$stmt = $db->prepare('update `characters` set playtime=playtime+? where row=?');
$stmt->bind_param('ii', $_POST['minutes'], $_SESSION['row']);
$stmt->execute();
$r = [
	'success' => true
];
echo json_encode($r);
