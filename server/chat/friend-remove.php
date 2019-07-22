<?php
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/header.php';
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/db.php';
// are they even there
$stmt = $db->prepare('select friend from `friends` where friend=? and account=?');
$stmt->bind_param('ss', $_POST['friend'], $_SESSION['account']);
$stmt->execute();
$stmt->bind_result($friend);
$stmt->store_result();

if ($stmt->num_rows){
	$stmt = $db->prepare('delete from `friends` where friend=? and account=?');
	$stmt->bind_param('ss', $_POST['friend'], $_SESSION['account']);
	$stmt->execute();
}
else {
	$r['error'] = $_POST['friend'] . " isn't your friend!";
}
echo json_encode($r);
