<?php
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/session/alive.php';
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/session/crypt.php';
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/db.php';

$stmt = $db->prepare('insert into `items` (`owner_id`, `slot_type`, `slot`, `name`, `data`) values (?, 1, ?, ?, ?)');
$stmt->bind_param('iiss', $_SESSION['row'], $_POST['slot'], $_POST['name'], $_POST['data']);
$stmt->execute();
$insertId = mysqli_insert_id($db);

echo $insertId;