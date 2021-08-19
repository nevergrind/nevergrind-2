<?php
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/session/alive.php';
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/session/crypt.php';
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/db.php';

$stmt = $db->prepare('update `characters` set level=? where row=?');
$stmt->bind_param('ii', $_POST['level'], $_SESSION['row']);
$stmt->execute();