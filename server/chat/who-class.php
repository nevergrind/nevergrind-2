<?php
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/header.php';
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/db.php';

// get online players of that class only
$query = 'select p.name, p.level, p.race, p.job, g.name guild 
from `players` p
left join `guild_members` m
on p.id=m.c_id 
left join `guilds` g
on m.g_id=g.row
where job=? 
and timestamp > date_sub(now(), interval 15 second)';
$stmt = $db->prepare($query);
$stmt->bind_param('s', $_POST['job']);
$stmt->execute();
$stmt->bind_result($name, $level, $race, $job, $guild);
$r['players'] = [];
$i = 0;
while ($stmt->fetch()) {
	$r['players'][$i++] = (object)[
		'name' => $name,
		'level' => $level,
		'race' => $race,
		'job' => $job,
		'guild' => $guild
	];
}

// get count of that class
$query = 'select count(row) len from `players` where job=? and timestamp > date_sub(now(), interval 15 second)';
$stmt = $db->prepare($query);
$stmt->bind_param('s', $_POST['job']);
$stmt->execute();
$stmt->bind_result($len);
$r['len'] = 0;
while ($stmt->fetch()) {
	$r['len'] = $len;
}

echo json_encode($r);