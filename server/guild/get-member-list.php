<?php
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/header.php';
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/db.php';

$query = 'select c.level, c.name, c.race, c.job 
from `characters` c
left join `guild_members` m
on c.row=m.c_id 
where m.g_id=?
order by c.level';
$stmt = $db->prepare($query);
$stmt->bind_param('s', $_SESSION['guild']['id']);
$stmt->execute();
$stmt->bind_result($level, $name, $race, $job);
$r['memberList'] = [];
$i = 0;
while ($stmt->fetch()) {
	$r['memberList'][$i++] = (object)[
		'level' => $level,
		'name' => $name,
		'race' => $race,
		'job' => $job
	];
}

echo json_encode($r);
