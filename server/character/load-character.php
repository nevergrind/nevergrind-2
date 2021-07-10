<?php
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/header.php';
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/db.php';

// get my character data
$query = 'select row, name, face, gender, level, race, job, exp, gold, data from `characters` where row=? limit 1';
$stmt = $db->prepare($query);
$stmt->bind_param('s', $_POST['row']);
$stmt->execute();
$stmt->store_result();
$stmt->bind_result($row, $name, $face, $gender, $level, $race, $job, $exp, $gold, $data);

$r['characterData'] = [];
$r['eq'] = [];
$r['inv'] = [];
$i = 0;

while($stmt->fetch()){
	$r['characterData'] = [
		'row' => $row,
		'name' => $name,
		'face' => $face,
		'gender' => $gender,
		'level' => $level,
		'race' => $race,
		'job' => $job,
		'exp' => $exp,
		'gold' => $gold,
		'data' => $data
	];
	$i++;
}

if ($i) {
	// set hp
	require '../session/init-ng.php';

	// set session values for my character
	$_SESSION['row'] = $r['characterData']['row'];
	$_SESSION['name'] = $r['characterData']['name'];

	error_log('load-char: ' . $_SESSION['name']);
	// get equipment
	require '../item/get-player-items.php';

	// get guild info
	require '../guild/get-guild-data.php';

	// update login time
	$stmt = $db->prepare('update `characters` set last_login=now() where row=?');
	$stmt->bind_param('i', $r['characterData']['row']);
	$stmt->execute();

	echo json_encode($r);
}
else {
	exit('No character data found!');
}
