<?php
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/session/start.php';
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/db.php';

// delete child
$types = [
	'eq' => 0,
	'inv' => 1,
	'bank' => 2
];
$type = $types[$_POST['dragType']];
$owner = $_POST['dragType'] === 'bank' ? $_SESSION['account'] : $_SESSION['row'];
$stmt = $db->prepare('delete from items where row=? and owner_id=? and slot_type=?');
$stmt->bind_param('iii', $_POST['row'], $owner, $type);
$stmt->execute();
error_log('row '. $_POST['row'] . ' type ' . $type . ' owner ' . $owner);