<?php
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/header.php';
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/db.php';

// get online players
$result = mysqli_query($db,
	'select p.name, p.level, p.race, p.job, g.name guild 
	from `players` p
	left join `guild_members` m
	on p.id=m.c_id 
	left join `guilds` g
	on m.g_id=g.row
	where timestamp > date_sub(now(), interval 15 second) limit 50'
);
$r['players'] = [];
$i = 0;

if ($result->num_rows){
	while ($row = mysqli_fetch_assoc($result)){
		$r['players'][$i++] = (object)[
			'name' => $row['name'],
			'level' => $row['level'],
			'race' => $row['race'],
			'job' => $row['job'],
			'guild' => $row['guild']
		];
	}
}
// total
$result = mysqli_query(
	$db,
	'SELECT count(row) count FROM `players` where timestamp > date_sub(now(), interval 15 second)'
);
$r['len'] = 0;
while ($row = mysqli_fetch_assoc($result)){
	$r['len'] = $row['count'];
}

echo json_encode($r);