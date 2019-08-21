<?php
require '../session/init-guild.php';

$stmt = $db->prepare('select m.rank, 
	m.g_id, 
	n.motd,
	n.name 
	from `guild_members` m 
	left join `guilds` n 
	on m.g_id=n.row 
	where m.c_id=? 
	limit 1');
$stmt->bind_param('s', $_SESSION['row']);
$stmt->execute();
$stmt->bind_result($rank, $g_id, $motd, $name);

$r['guild'] = $_SESSION['guild'];
// assigned if exists
while($stmt->fetch()) {
	$r['guild'] = [
		'id' => $g_id,
		'rank' => $rank,
		'motd' => $motd,
		'name' => $name
	];
}
$_SESSION['guild']['id'] = $r['guild']['id'];
$_SESSION['guild']['rank'] = $r['guild']['rank'];
$_SESSION['guild']['name'] = $r['guild']['name'];
