<?php
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/session/start.php';
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/db.php';

if ($_POST['dragType'] !== $_POST['dropType']) {
	// swap items to different table
	// e.g. inv to bank; inv to eq; eq to inv
	$types = [
		'eq' => 0,
		'inv' => 1,
		'bank' => 2
	];

	$owner = $_POST['dragType'] === 'bank' ? $_SESSION['account'] : $_SESSION['row'];
	$type = $types[$_POST['dragType']];
	// item 1
	$stmt = $db->prepare('update `items` set owner_id=?, slot=?, slot_type='. $type .' where row=?');
	$stmt->bind_param('iii', $owner, $_POST['dragSlot'], $_POST['dragRow']);
	$stmt->execute();

	// item 2
	$owner = $_POST['dropType'] === 'bank' ? $_SESSION['account'] : $_SESSION['row'];
	$type = $types[$_POST['dropType']];

	$stmt = $db->prepare('update `items` set owner_id=?, slot=?, slot_type='. $type .' where row=?');
	$stmt->bind_param('iii', $owner, $_POST['dropSlot'], $_POST['dropRow']);
	$stmt->execute();
}
else {
	// swap items to same table
	// e.g. inv to empty inv; eq to empty eq; primary to secondary; ring to ring; bank to bank
	$stmt = $db->prepare('update `items` set slot=? where row=?');
	$stmt->bind_param('ii', $_POST['dragSlot'], $_POST['dragRow']);
	$stmt->execute();

	$stmt = $db->prepare('update `items` set slot=? where row=?');
	$stmt->bind_param('ii', $_POST['dropSlot'], $_POST['dropRow']);
	$stmt->execute();
}