<?php
	require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/header.php';
	
	$f = $_POST['form'];
	
	// validate name
	// length is not too long
	$f['name'] = substr($f['name'], 0, 16);
	if (strlen($f['name']) < 2){
		exit('This name is too short!');
	}
	// remove illegal characters - must be capitalized
	$illegal = array("\\", "/", ":", "*", "?", '"', "'", ">", "<", "1", "2", "3", "4", "5", "6", "7", "8", "9", "`", "0", "_", " ");
	$f['name'] = str_replace($illegal, "", $f['name']);
	$f['name'] = ucfirst(strtolower($f['name']));
	if (!ctype_alpha($f['name'])){
		exit('This name contains illegal characters!');
	}
	// name is not taken
	require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/db.php';
	$query = 'select name from `characters` where name=?';
	$stmt = $db->prepare($query);
	$stmt->bind_param('s', $f['name']);
	$stmt->execute();
	$stmt->store_result();
	$count = $stmt->num_rows;
	if ($count > 0){
		exit('This name is already taken!');
	}
	require '../enum/races.php';
	if (in_array($f['name'], $races, true)){
		exit('This name is not valid.');
	}
	require '../enum/jobs.php';
	if (in_array($f['name'], $jobs, true)){
		exit('This name is not valid.');
	}

	// how many characters do they have?
	$query = 'select row, deleted from `characters` where row=? and deleted=0';
	$stmt = $db->prepare($query);
	$stmt->bind_param('s', $_SESSION['account']);
	$stmt->execute();
	$stmt->store_result();
	$count = $stmt->num_rows;
	$totalCharacters = 0;
	if($count > 0){
		$totalCharacters = $count;
	}
	// max is 8
	if ($totalCharacters >= 8){
		exit('Eight is the maximum number of characters you can have!');
	}

	// validate and normalize gender
	$genders = ['Male', 'Female'];
	if (!in_array($f['gender'], $genders, true)){
		$f['gender'] = 'Male';
	}
	$f['gender'] = $f['gender'] === 'Male' ? 0 : 1;
	// validate race
	if (!in_array($f['race'], $races, true)){
		$f['race'] = 'Human';
	}
	// validate class
	if (!in_array($f['job'], $jobs, true)){
		$f['job'] = 'Warrior';
	}
	// ensure ability points spent using attributes + 10
	if ($f['left'] > 0){
		exit('You have not spent all of your ability points!');
	}
	// validate that the race can play that class
	require 'stat-map.php';
	if (!in_array($f['job'], $statMap[$f['race']]['jobs'], true)){
		exit('This class is not available to that race!');
	}
	// validate minimum attributes using race/class function that returns object with min values
	require '../enum/attrs.php';
	$bonusAttrTotal = 0;
	foreach ($attrs as $value) {
		$bonusAttrTotal += $f[$value];
	}
	if ($bonusAttrTotal !== 10) {
		exit('Those race/class values are not possible!');
	}
	// default skill values
	require 'add-starting-skills.php';
	addStartingSkills($f);

	// insert into character
	$fields = [
		'`account`',
		'`name`',
		'`gender`',
		'`race`',
		'`job`',
		'`str`',
		'`sta`',
		'`agi`',
		'`dex`',
		'`wis`',
		'`intel`',
		'`cha`',
		'`dualWield`',
		'`oneHandSlash`',
		'`twoHandSlash`',
		'`twoHandBlunt`',
		'`piercing`',
		'`dodge`',
		'`alteration`',
		'`evocation`',
		'`conjuration`'
	];
	$values = [];
	foreach ($fields as $value) {
		$values[] = '?';
	}
	$query = 'insert into `characters` (' .
		join(',', $fields)
	. ') VALUES (' .
		join(',', $values)
	.')';
	$stmt = $db->prepare($query);
	$stmt->bind_param('isissiiiiiiiiiiiiiiii',
		$_SESSION['account'], $f['name'], $f['gender'], $f['race'], $f['shortJob'],
		$f['str'], $f['sta'], $f['agi'], $f['dex'], $f['wis'],
		$f['intel'], $f['cha'], $f['dualWield'], $f['oneHandSlash'], $f['twoHandSlash'],
		$f['twoHandBlunt'], $f['piercing'], $f['dodge'], $f['alteration'], $f['evocation'],
		$f['conjuration']
	);
	$stmt->execute();
	$character_id = mysqli_insert_id($db);

	// add equipment data
	// chest
	if ($f['job'] === 'Necromancer' ||
		$f['job'] === 'Enchanter' ||
		$f['job'] === 'Magician' ||
		$f['job'] === 'Wizard') {
		$query = 'insert into `items_equipment` (c_id, slot, i_id) VALUES (?, "chest", 2)';
	}
	else {
		$query = 'insert into `items_equipment` (c_id, slot, i_id) VALUES (?, "chest", 1)';
	}
	$stmt = $db->prepare($query);
	$stmt->bind_param('i', $character_id);
	$stmt->execute();

	// weapon
	if ($f['job'] === 'Warrior' ||
		$f['job'] === 'Shadowknight' ||
		$f['job'] === 'Ranger' ||
		$f['job'] === 'Bard') {
		$query = 'insert into `items_equipment` (c_id, slot, i_id) VALUES (?, "primary", 3)';
	}
	else if (
		$f['job'] === 'Paladin' ||
		$f['job'] === 'Druid' ||
		$f['job'] === 'Cleric' ||
		$f['job'] === 'Shaman'
	) {
		$query = 'insert into `items_equipment` (c_id, slot, i_id) VALUES (?, "primary", 4)';
	}
	else if ($f['job'] !== 'Monk') {
		$query = 'insert into `items_equipment` (c_id, slot, i_id) VALUES (?, "primary", 5)';
	}
	$stmt = $db->prepare($query);
	$stmt->bind_param('i', $character_id);
	$stmt->execute();

	// bow
	if ($f['job'] === 'Ranger') {
		$query = 'insert into `items_equipment` (c_id, slot, i_id) VALUES (?, "range", 6)';
		$stmt = $db->prepare($query);
		$stmt->bind_param('i', $character_id);
		$stmt->execute();
	}

	// echo something for fun
	$r['hero'] = $f;
	echo json_encode($r);