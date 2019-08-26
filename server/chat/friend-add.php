<?php
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/header.php';
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/db.php';
// is our friends list full?
$stmt = $db->prepare('select count(friend) from `friends` where account=?');
$stmt->bind_param('i', $_SESSION['id']);
$stmt->execute();
$stmt->bind_result($friend);
$count = 0;
while ($stmt->fetch()){
	$count = $friend;
}
if ($count < 20){
	// add
	$stmt = $db->prepare("insert into `friends` (`account`, `friend`) values (?, ?)");
	$stmt->bind_param('is', $_SESSION['id'], $_POST['friend']);
	$stmt->execute();
} else {
	// too many
	$r['error'] = 'You cannot have more than 20 friends!';
}
echo json_encode($r);
