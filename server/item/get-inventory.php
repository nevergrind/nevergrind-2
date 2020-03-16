<?php
$stmt = $db->prepare('
	select inv.row, inv.i_id, inv.slot, item.name, item.data 
	FROM `items_inventory` inv 
	left join `items` item 
	on inv.i_id=item.row 
	where inv.c_id=?');

$stmt->bind_param('i', $_SESSION['row']);
$stmt->execute();
$stmt->bind_result($row, $i_id, $slot, $name, $data);

// assigned if exists
while($stmt->fetch()) {
	$r['inventory'][$slot] = [
		'row' => $row,
		'itemId' => $i_id,
		'name' => $name,
		'data' => $data
	];
}