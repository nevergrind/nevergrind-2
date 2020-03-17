<?php
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/header.php';
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/db.php';

error_log('///////// swap-items /////////');
error_log('dragRow ' . $_POST['dragRow']);
error_log('dragItemId ' . $_POST['dragItemId']);
error_log('dragSlot ' . $_POST['dragSlot']);
error_log('dragType ' . $_POST['dragType']);

error_log('dropRow ' . $_POST['dropRow']);
error_log('dropItemId ' . $_POST['dropItemId']);
error_log('dropSlot ' . $_POST['dropSlot']);
error_log('dropType ' . $_POST['dropType']);

error_log('moveTable ' . $_POST['moveTable']);

$types = [
	'eq' => 0,
	'inv' => 1,
	'bank' => 2
];

if ($_POST['dragType'] !== $_POST['dropType']) {
	// dragged item to empty slot to a new table
	// e.g. inv to bank; inv to eq; eq to inv
	$owner = $_POST['dragType'] === 'bank' ? $_SESSION['account'] : $_SESSION['row'];
	$type = $types[$_POST['dragType']];

	$stmt = $db->prepare('update `item_rels` set owner_id=?, slot=?, slot_type=? where row=?');
	$stmt->bind_param('iiii', $owner, $_POST['dragSlot'], $type, $_POST['dragRow']);
	$stmt->execute();
}
else {
	// dragged item to same table to an empty slot
	// e.g. inv to empty inv; eq to empty eq; primary to secondary; ring to ring; bank to bank
	$stmt = $db->prepare('update `item_rels` set slot=? where row=?');
	$stmt->bind_param('ii', $_POST['dragSlot'], $_POST['dragRow']);
	$stmt->execute();
}