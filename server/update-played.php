<?php
$now = microtime(true);
require 'session/start.php';
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/db.php';

$stmt = $db->prepare('update `characters` set playtime=playtime+1 where row=?');
$stmt->bind_param('s', $_POST['row']);
$stmt->execute();
error_log('time: ' . (microtime(true) - $now));