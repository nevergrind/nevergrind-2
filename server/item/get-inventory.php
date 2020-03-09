<?php
$stmt = $db->prepare('
	select inv.slot, item.name, item.data 
	FROM `items_inventory` inv 
	left join `items` item 
	on inv.i_id=item.row 
	where inv.c_id=?');

$stmt->bind_param('i', $_SESSION['row']);
$stmt->execute();
$stmt->bind_result($slot, $name, $data);

// assigned if exists
while($stmt->fetch()) {
	$r['inventory'][$slot] = [
		'name' => $name,
		'data' => $data
	];
}