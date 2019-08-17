<?php
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/header.php';
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/db.php';
// limit to 18
$_POST['channel'] = substr($_POST['channel'], 0, 16);
$illegal = array("\\", "/", ":", "*", "?", ">", "<", "_", "`", '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '+', '=', '{', '}', '[' );
$_POST['channel'] = str_replace($illegal, "", $_POST['channel']);
if ($_POST['channel']) {
	$r['channel'] = $_POST['channel'];
	$newChannel = 'ng2' . $_POST['channel'];
	echo json_encode($r);
}
else {
	exit("Invalid channel name");
}
