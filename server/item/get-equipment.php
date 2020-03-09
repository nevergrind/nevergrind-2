<?php
$stmt = $db->prepare('
	select e.slot, i.name, i.data 
	FROM `items_equipment` e 
	left join `items` i 
	on e.i_id = i.row 
	where e.c_id=?');

$stmt->bind_param('i', $_SESSION['row']);
$stmt->execute();
$stmt->bind_result($slot, $name, $data);

// assigned if exists
while($stmt->fetch()) {
	$r['equipment'][$slot] = [
		'name' => $name,
		'data' => $data
	];
}