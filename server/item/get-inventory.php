<?php
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/header.php';
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/db.php';

$stmt = $db->prepare('select row, slot, name, data FROM `items` where owner_id=? and slot_type=1');

$stmt->bind_param('i', $_SESSION['row']);
$stmt->execute();
$stmt->bind_result($row, $slot, $name, $data);

// assigned if exists
while($stmt->fetch()) {
	$r['inv'][$slot] = [
		'row' => $row,
		'name' => $name,
		'data' => $data
	];
}

echo json_encode($r);