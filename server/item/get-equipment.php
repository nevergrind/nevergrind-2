<?php
$stmt = $db->prepare('
	select e.row, e.i_id, e.slot, i.name, i.data 
	FROM `items_equipment` e 
	left join `items` i 
	on e.i_id = i.row 
	where e.c_id=?');

$stmt->bind_param('i', $_SESSION['row']);
$stmt->execute();
$stmt->bind_result($row, $i_id, $slot, $name, $data);

// assigned if exists
while($stmt->fetch()) {
	$r['equipment'][$slot] = [
		'row' => $row,
		'itemId' => $i_id,
		'name' => $name,
		'data' => $data
	];
}