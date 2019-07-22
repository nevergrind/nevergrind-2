<?php

// load all zone mob images and preload them client-side
 $stmt = $db->prepare('SELECT i.name
	FROM `mobs` m
	join `mob_img` i
	on m.img=i.row
	join `zones` z
	on m.zone=z.row
	where z.zone=?
	group by i.name');
$stmt->bind_param('s', $_SESSION['quest']['zone']);
$stmt->execute();
$stmt->bind_result($name);
$i = 0;
$r['zoneMobs'] = [];
while ($stmt->fetch()) {
	$r['zoneMobs'][$i++] = $name;
}