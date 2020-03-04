<?php
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/header.php';
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/db.php';

// update with cached minutes
$stmt = $db->prepare('update `characters` set playtime=playtime+? where row=?');
$stmt->bind_param('ii', $_POST['minutes'], $_SESSION['row']);
$stmt->execute();

$query = 'select created, playtime from `characters` where row=? limit 1';
$stmt = $db->prepare($query);
$stmt->bind_param('s', $_SESSION['row']);
$stmt->execute();
$stmt->bind_result($created, $playtime);

$r['playtime'] = 0;

while ($stmt->fetch()) {
	$r['created'] = $created;
	$r['playtime'] = $playtime;
}
echo json_encode($r);