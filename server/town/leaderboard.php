<?php
header('Content-Type: application/json');
$r = [];
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/db.php';
$r['leaderboard'] = [];

if (isset($_GET['job'])) {
	$stmt = $db->prepare('select name, job, level, exp 
		from `characters` 
		where job=? and deleted=0
		order by exp desc, row
		limit 300');
	$stmt->bind_param('s', $_GET['job']);
	$stmt->execute();
	$stmt->store_result();
	$stmt->bind_result($name, $job, $level, $exp);

	while ($stmt->fetch()){
		$r['leaderboard'][] = [
			'name' => $name,
			'job' => $job,
			'level' => $level,
			'exp' => $exp
		];
	}
}
else {
	$result = mysqli_query($db, 'select name, job, level, exp 
		from `characters` 
		where deleted=0 
		order by exp desc, row
		limit 100');
	while ($obj = $result->fetch_object()) {
		$r['leaderboard'][] = $obj;
	}
}

echo json_encode($r);