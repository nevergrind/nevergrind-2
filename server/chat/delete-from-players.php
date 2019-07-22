<?php
require_once '../session/start.php';
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/db.php';
// from players log
$stmt = $db->prepare('delete from `players` where account=?');
$stmt->bind_param('s', $_SESSION['account']);
$stmt->execute();