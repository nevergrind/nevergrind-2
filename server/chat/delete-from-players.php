<?php
session_start();
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/db.php';
// from players log
$stmt = $link->prepare('delete from `players` where account=?');
$stmt->bind_param('s', $_SESSION['account']);
$stmt->execute();