<?php
	$query = 'select row, name, level, race, job, face, gender
		from `characters` 
		where account=? and deleted=0';
	$stmt = $db->prepare($query);
	$stmt->bind_param('i', $_SESSION['account']);
	$stmt->execute();
	$stmt->store_result();
	$stmt->bind_result($row, $name, $level, $race, $job, $face, $gender);
	$r['characterData'] = [];
	$i = 0;
	while($stmt->fetch()){
		$r['characterData'][$i++] = [
			'row' => $row,
			'name' => $name,
			'level' => $level,
			'race' => $race,
			'job' => $job,
			'face' => $face,
			'gender' => $gender
		];
	}
	