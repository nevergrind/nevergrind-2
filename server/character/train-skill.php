<?php
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/session/alive.php';
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/session/crypt.php';
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/db.php';

$stmt = $db->prepare('update `characters` set gold=?, data=? where row=?');
$stmt->bind_param('isi', $_POST['gold'], $_POST['data'], $_SESSION['row']);
$stmt->execute();