<?php
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/session/alive.php';
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/session/crypt.php';
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/db.php';
// dragged item to same table to an empty slot
$stmt = $db->prepare('update `items` set data=? where row=? and owner_id=?');
$stmt->bind_param('sii', $_POST['data'], $_POST['itemRow'], $_SESSION['row']);
$stmt->execute();

// item has been identified - delete scroll
$stmt = $db->prepare('delete from `items` where row=? and owner_id=?');
$stmt->bind_param('ii', $_POST['scrollRow'], $_SESSION['row']);
$stmt->execute();