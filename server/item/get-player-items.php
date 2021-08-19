<?php
$stmt = $db->prepare('select row, slot_type, slot, name, data FROM `items` where owner_id=? and slot_type<2');

$stmt->bind_param('i', $_SESSION['row']);
$stmt->execute();
$stmt->bind_result($row, $slot_type, $slot, $name, $data);

// assigned if exists
while($stmt->fetch()) {
	if (!$slot_type) {
		$r['eq'][$slot] = [
			'row' => $row,
			'slotType' => $slot_type,
			'name' => $name,
			'data' => $data
		];
	}
	else {
		$r['inv'][$slot] = [
			'row' => $row,
			'slotType' => $slot_type,
			'name' => $name,
			'data' => $data
		];
	}
}