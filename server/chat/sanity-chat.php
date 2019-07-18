<?php

require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/header.php';
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/db.php';
// get all players in chat room
$stmt = $link->prepare('select id from `players` where zone=? and timestamp > date_sub(now(), interval 15 second)');
$stmt->bind_param('s', $_SESSION['zone']);
$stmt->execute();
$stmt->bind_result($id);

$r['players'] = [];
$i = 0;
while ($stmt->fetch()) {
	$r['players'][$i++] = $id;
}

echo json_encode($r);