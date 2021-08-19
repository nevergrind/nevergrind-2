<?php
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/session/alive.php';
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/session/crypt.php';
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/db.php';

$stmt = $db->prepare('update `characters` set gold=gold+?, exp=exp+? where row=? and account=?');
$stmt->bind_param('iiii', $_POST['gold'], $_POST['exp'], $_SESSION['row'], $_SESSION['account']);
$stmt->execute();