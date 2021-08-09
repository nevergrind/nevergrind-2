<?php

require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/session/start.php';
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/db.php';

if ($_POST['dragType'] !== $_POST['dropType']) {
	// dragged item to empty slot to a new table
	$types = [
		'eq' => 0,
		'inv' => 1,
		'bank' => 2
	];
	$owner = $_POST['dragType'] === 'bank' ? $_SESSION['account'] : $_SESSION['row'];
	$oldOwner = $_POST['dropType'] === 'bank' ? $_SESSION['account'] : $_SESSION['row'];
	$type = $types[$_POST['dragType']];
	$stmt = $db->prepare('update `items` set owner_id=?, slot=?, slot_type='. $type .' where row=? and owner_id=?');
	$stmt->bind_param('iiii', $owner, $_POST['dragSlot'], $_POST['dragRow'], $oldOwner);
	$stmt->execute();
}
else {
	// dragged item to same table to an empty slot
	$stmt = $db->prepare('update `items` set slot=? where row=?');
	$stmt->bind_param('ii', $_POST['dragSlot'], $_POST['dragRow']);
	$stmt->execute();
}