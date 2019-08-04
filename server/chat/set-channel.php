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

	// update my zone/channel
	/*$stmt = $db->prepare('update `players` set zone=? where id=?');
	$stmt->bind_param('ss', $newChannel, $_SESSION['row']);
	$stmt->execute();

	// get channel players
	$stmt = $db->prepare('select id, name, level, race, job from `players` where zone=? and timestamp > date_sub(now(), interval 15 second) order by row desc');
	$stmt->bind_param('s', $newChannel);
	$stmt->execute();
	$stmt->bind_result($id, $name, $level, $race, $job);

	$r['players'] = [];
	$i = 0;
	while ($stmt->fetch()) {
		$r['players'][$i++] = [
			'id' => $id,
			'name' => $name,
			'level' => $level,
			'race' => $race,
			'job' => $job
		];
	}*/

	$_SESSION['chatChannel'] = $newChannel;
	echo json_encode($r);
}
else {
	exit("Invalid channel name");
}
