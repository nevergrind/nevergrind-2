<?php
$stmt = $db->prepare('
	select e.row, e.i_id, e.slot_type, e.slot, i.name, i.data 
	FROM `item_rels` e 
	left join `items` i 
	on e.i_id = i.row 
	where e.owner_id=?');

$stmt->bind_param('i', $_SESSION['row']);
$stmt->execute();
$stmt->bind_result($row, $i_id, $slot_type, $slot, $name, $data);

// assigned if exists
while($stmt->fetch()) {
	$r['items'][$slot] = [
		'row' => $row,
		'itemId' => $i_id,
		'slotType' => $slot_type,
		'name' => $name,
		'data' => $data
	];
}