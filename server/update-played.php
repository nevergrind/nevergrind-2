<?php
require_once 'session/start.php';
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/db.php';

$stmt = $db->prepare('update `characters` set playtime=playtime+1 where row=?');
$stmt->bind_param('s', $_SESSION['row']);
$stmt->execute();