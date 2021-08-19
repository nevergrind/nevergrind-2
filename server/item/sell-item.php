<?php
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/session/alive.php';
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/session/crypt.php';
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/db.php';

// delete item
$type = $_POST['dragType'] === 'eq' ? 0 : 1;
$stmt = $db->prepare('delete from `items` where row=? and owner_id=? and slot_type=?');
$stmt->bind_param('iii', $_POST['row'], $_SESSION['row'], $type);
$stmt->execute();

// Update gold
$stmt = $db->prepare('update `characters` set gold=? where row=?');
$stmt->bind_param('ii', $_POST['gold'], $_SESSION['row']);
$stmt->execute();