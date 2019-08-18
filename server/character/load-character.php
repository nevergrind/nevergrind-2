<?php
	require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/header.php';
	require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/db.php';

	// get my character data
	$query = 'select row, name, lastName, gender, level, race, job, hp, maxHp, mp, maxMp,
		exp, gold,
	 	str, sta, agi, dex, wis, intel, cha,
	 	offense, defense, dualWield, doubleAttack, 
	 	oneHandSlash, twoHandSlash, oneHandBlunt, twoHandBlunt, piercing, handToHand,
	 	dodge, parry, riposte,
	 	alteration, conjuration, evocation
	 	from `characters` where account=? and row=? limit 1';
	$stmt = $db->prepare($query);
	$stmt->bind_param('ss', $_SESSION['account'], $_POST['row']);
	$stmt->execute();
	$stmt->store_result();
	$stmt->bind_result($row, $name, $lastName, $gender, $level, $race, $job, $hp, $maxHp, $mp, $maxMp,
		$exp, $gold,
		$str, $sta, $agi, $dex, $wis, $intel, $cha,
		$offense, $defense, $dualWield, $doubleAttack,
		$oneHandSlash, $twoHandSlash, $oneHandBlunt, $twoHandBlunt, $piercing, $handToHand,
		$dodge, $parry, $riposte,
		$alteration, $conjuration, $evocation);

	$r['characterData'] = [];
	$i = 0;

	while($stmt->fetch()){
		$r['characterData'] = [
			'row' => $row,
			'name' => $name,
			'lastName' => $lastName,
			'gender' => $gender,
			'level' => $level,
			'race' => $race,
			'job' => $job,
			'hp' => $hp,
			'maxHp' => $maxHp,
			'mp' => $mp,
			'maxMp' => $maxMp,
			'exp' => $exp,
			'gold' => $gold,
			'str' => $str,
			'sta' => $sta,
			'agi' => $agi,
			'dex' => $dex,
			'wis' => $wis,
			'intel' => $intel,
			'cha' => $cha,
			'offense' => $offense,
			'defense' => $defense,
			'dualWield' => $dualWield,
			'doubleAttack' => $doubleAttack,
			'oneHandSlash' => $oneHandSlash,
			'twoHandSlash' => $twoHandSlash,
			'oneHandBlunt' => $oneHandBlunt,
			'twoHandBlunt' => $twoHandBlunt,
			'piercing' => $piercing,
			'handToHand' => $handToHand,
			'dodge' => $dodge,
			'parry' => $parry,
			'riposte' => $riposte,
			'alteration' => $alteration,
			'conjuration' => $conjuration,
			'evocation' => $evocation
		];
		$i++;
	}

	if ($i) {
		if (isset($_SESSION) &&
			isset($_SESSION['hp']) &&
			$_SESSION['hp'] > 0) {
			// pre-cache hp/mp values if they exist
			$cacheHp = $_SESSION['hp'];
			$cacheMp = $_SESSION['mp'];
		}
		require '../session/init-ng.php';
		// set session values for my character
		$_SESSION['row'] = $r['characterData']['row'];
		$_SESSION['name'] = $r['characterData']['name'];
		$_SESSION['level'] = $r['characterData']['level'];
		$_SESSION['job'] = $r['characterData']['job'];

		// get guild info
		require '../guild/get-guild-data.php';

		echo json_encode($r);
	}
	else {
		exit("No character data found!");
	}
	