<?php
	require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/header.php';
	require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/db.php';
	// delete all from `players` to clean up the table
	mysqli_query($db, 'delete from `players` where timestamp < date_sub(now(), interval 60 second)');

	// are they already logged in?
	if ($_SERVER["SERVER_NAME"] !== "localhost") {
		// prevent double login
		$query = 'SELECT count(row) count FROM `players` where account=? and timestamp > date_sub(now(), interval 15 second)';
		$stmt = $db->prepare($query);
		$stmt->bind_param('s', $_SESSION['account']);
		$stmt->execute();
		$stmt->bind_result($account);
		$iAmOnline = 0;

		while ($stmt->fetch()){
			$iAmOnline = $account;
		}

		if ($iAmOnline) {
			exit("One of your characters is already logged in or has not timed out yet.");
		}
	}

	// get my character data
	$query = 'select row, name, level, race, job, hp, maxHp, mp, maxMp,
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
	$stmt->bind_result($row, $name, $level, $race, $job, $hp, $maxHp, $mp, $maxMp,
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
		$cacheHp = -1;
		$cacheMp = -1;
		if (isset($_SESSION) &&
			isset($_SESSION['hp']) &&
			$_SESSION['hp'] > 0) {
			// pre-cache hp/mp values if they exist
			$cacheHp = $_SESSION['hp'];
			$cacheMp = $_SESSION['mp'];
		}
		require '../session/init-ng.php';
		// set session values for my character
		foreach ($r['characterData'] as $key => $val) {
			$_SESSION[$key] = $val;
		}
		// assign session hp/mp cache values if a non -1 value was found
		// this helps avoid relying on hp/mp value in `characters` AND parties table
		if ($cacheHp >= 0) {
			$_SESSION['hp'] = $cacheHp;
			$r['characterData']['hp'] = $cacheHp;
			$_SESSION['mp'] = $cacheMp;
			$r['characterData']['mp'] = $cacheMp;
		}

		// init or wipe all party data
		if (!isset($_SESSION['party'])) {
			require '../session/init-party.php';
		}
		else {
			require '../session/init-party.php';
			// delete from parties if player data is known
			mysqli_query($db, 'delete from `parties` where c_id='. $_SESSION['row']);
		}

		require '../session/init-quest.php';
		// init session values
		require '../session/init-guild.php';

		// set hp/mp regen, etc
		require 'setEquipmentValues.php';
		/*
		// update player heartbeat table
		$stmt = $db->prepare('insert into `players`
			(`id`, `account`, `name`, `level`, `race`, `job`, `zone`) 
			values (?, ?, ?, ?, ?, ?, ?) 
			on duplicate key update timestamp=now()');

		$stmt->bind_param('ississs',
			$_SESSION['row'],
			$_SESSION['account'],
			$_SESSION['name'],
			$_SESSION['level'],
			$_SESSION['race'],
			$_SESSION['job'],
			$_SESSION['zone']);
		*/

		// count active players
		$result = mysqli_query(
			$db,
			'SELECT count(row) count FROM `players` where timestamp > date_sub(now(), interval 15 second)'
		);
		$r['count'] = 0;
		while ($row = mysqli_fetch_assoc($result)){
			$r['count'] = $row['count'];
		}
		/*


		// get all players in chat room
		$result = mysqli_query(
			$db,
			'SELECT id, name, level, race, job FROM `players` where zone="ng2_town" and timestamp > date_sub(now(), interval 15 second)'
		);
		$r['players'] = [];
		$i = 0;
		if ($result->num_rows) {
			while ($row = mysqli_fetch_assoc($result)) {
				$r['players'][$i++] = (object)[
					'id' => $row['id'],
					'name' => $row['name'],
					'level' => $row['level'],
					'race' => $row['race'],
					'job' => $row['job'],
				];
			}
		}*/
		// get guild info
		require '../guild/get-guild-data.php';

		// get mission info
		$cacheQuest = '';
		$r['quest'] = [];
		if ($_SESSION['quest']['row']) {
			$cacheQuest = $_SESSION['quest']['zone'];
			$r['quest'] = $_SESSION['quest'];
			require '../mission/get-zone-mobs.php';
		};
		// set zone from session
		$r['dungeon'] = $cacheQuest;

		echo json_encode($r);
	}
	else {
		exit("No character data found!");
	}
	