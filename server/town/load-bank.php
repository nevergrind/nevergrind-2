<?php
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/header.php';
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/db.php';
$r['bank'] = [];

$stmt = $db->prepare('select row, slot_type, slot, name, data FROM `items` where owner_id=? and slot_type=2');
$stmt->bind_param('i', $_SESSION['account']);
$stmt->execute();
$stmt->bind_result($row, $slot_type, $slot, $name, $data);

// assigned if exists
while($stmt->fetch()) {
	$r['bank'][$slot] = [
		'row' => $row,
		'slotType' => $slot_type,
		'name' => $name,
		'data' => $data
	];
}
echo json_encode($r);