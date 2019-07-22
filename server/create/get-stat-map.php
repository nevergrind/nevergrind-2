<?php
	header('Content-Type: application/json');
	$r = [];
	require '../stat-map.php';
	// success
	$r['statMap'] = $statMap;
	echo json_encode($r);