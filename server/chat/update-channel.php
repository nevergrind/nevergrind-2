<?php

require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/header.php';
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/db.php';

// get channel players
$stmt = $db->prepare('select id, name, level, race, job from `players` where zone=? and timestamp > date_sub(now(), interval 15 second) order by row desc');
$stmt->bind_param('s', $_SESSION['chatChannel']);
$stmt->execute();
$stmt->bind_result($id, $name, $level, $race, $job);

$r['players'] = [];
$i = 0;
while ($stmt->fetch()) {
	$r['players'][$i++] = (object)[
		'id' => $id,
		'name' => $name,
		'level' => $level,
		'race' => $race,
		'job' => $job
	];
}

echo json_encode($r);