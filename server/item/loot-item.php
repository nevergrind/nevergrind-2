<?php
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/session/start.php';
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/db.php';

$stmt = $db->prepare('insert into `items` (`name`, `data`) values (?, ?)');
$stmt->bind_param('ss', $_POST['name'], $_POST['data']);
$stmt->execute();
$itemId = mysqli_insert_id($db);

$stmt = $db->prepare('insert into `item_rels` (`owner_id`, `slot_type`, `slot`, `i_id`) values (?, 1, ?, ?)');
$stmt->bind_param('iii', $_SESSION['row'], $_POST['slot'], $itemId);
$stmt->execute();