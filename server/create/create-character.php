<?php
	require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/header.php';
	
	$f = $_POST['form'];
	
	// validate name
	// length is not too long
	$f['name'] = substr($f['name'], 0, 12);
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
	$query = 'select name from `characters` where name=? and deleted=0';
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
	$query = 'select count(row) from `characters` where account=? and deleted=0';
	$stmt = $db->prepare($query);
	$stmt->bind_param('s', $_SESSION['account']);
	$stmt->execute();
	$stmt->bind_result($charCount);
	$totalCharacters = 0;

	while ($stmt->fetch()) {
		$totalCharacters = $charCount;
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
	// validate face
	if ($f['face'] < 0 || $f['face'] > 3){
		$f['face'] = 0;
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
	// build data field
	$data = json_encode([
		'str' => $f['str'] * 1,
		'sta' => $f['sta'] * 1,
		'agi' => $f['agi'] * 1,
		'dex' => $f['dex'] * 1,
		'wis' => $f['wis'] * 1,
		'intel' => $f['intel'] * 1,
		'cha' => $f['cha'] * 1,
		'offense' => $f['offense'],
		'defense' => $f['defense'],
		'oneHandSlash' => $f['oneHandSlash'],
		'oneHandBlunt' => $f['oneHandBlunt'],
		'twoHandSlash' => $f['twoHandSlash'],
		'twoHandBlunt' => $f['twoHandBlunt'],
		'piercing' => $f['piercing'],
		'archery' => $f['archery'],
		'dodge' => $f['dodge'],
		'parry' => $f['parry'],
		'riposte' => $f['riposte'],
		'dualWield' => $f['dualWield'],
		'doubleAttack' => $f['doubleAttack'],
		'alteration' => $f['alteration'],
		'conjuration' => $f['conjuration'],
		'evocation' => $f['evocation']
	]);

	$query = 'insert into `characters` (`account`, `name`, `gender`, `face`, `race`, `job`, `data`) VALUES (?, ?, ?, ?, ?, ?, \'' . $data .'\')';
	$stmt = $db->prepare($query);
	$stmt->bind_param('isiiss', $_SESSION['account'], $f['name'], $f['gender'], $f['face'], $f['race'], $f['shortJob']);
	$stmt->execute();
	$character_id = mysqli_insert_id($db);

	// add equipment data
	// chest
	if ($f['job'] === 'Necromancer' ||
		$f['job'] === 'Enchanter' ||
		$f['job'] === 'Summoner' ||
		$f['job'] === 'Wizard') {
		$data = json_encode('{"slots":["chest"],"armorType":"cloth","armor":1,"rarity":"normal","itemLevel":1,"imgIndex":4,"itemType":"chests"}');
		$query = 'insert into `items` (owner_id, slot, name, data) VALUES (?, 6, "Training Robe", '. $data .')';
	}
	else {
		$data = json_encode('{"slots":["chest"],"armorType":"cloth","armor":1,"rarity":"normal","itemLevel":1,"imgIndex":1,"itemType":"chests"}');
		$query = 'insert into `items` (owner_id, slot, name, data) VALUES (?, 6, "Training Tunic", '. $data .')';
	}
	$stmt = $db->prepare($query);
	$stmt->bind_param('i', $character_id);
	$stmt->execute();

	// weapon
	if ($f['job'] === 'Warrior' ||
		$f['job'] === 'Shadow Knight' ||
		$f['job'] === 'Bard') {
		$data = json_encode('{"slots":["primary","secondary"],"weaponSkill":"One-hand Slash","minDamage":1,"maxDamage":4,"speed":2.8,"rarity":"normal","itemLevel":1,"imgIndex":0,"itemType":"oneHandSlashers"}');
		$query = 'insert into `items` (owner_id, slot, name, data) VALUES (?, 12, "Training Sword", '. $data .')';
	}
	else if (
		$f['job'] === 'Crusader' ||
		$f['job'] === 'Druid' ||
		$f['job'] === 'Cleric' ||
		$f['job'] === 'Shaman'
	) {
		$data = json_encode('{"slots":["primary","secondary"],"weaponSkill":"One-hand Blunt","minDamage":1,"maxDamage":5,"speed":3.2,"rarity":"normal","itemLevel":1,"imgIndex":0,"itemType":"oneHandBlunts"}');
		$query = 'insert into `items` (owner_id, slot, name, data) VALUES (?, 12, "Training Club", '. $data .')';
	}
	else if (
		$f['job'] === 'Necromancer' ||
		$f['job'] === 'Enchanter' ||
		$f['job'] === 'Summoner' ||
		$f['job'] === 'Wizard'
	) {
		$data = json_encode('{"slots":["primary","secondary"],"weaponSkill":"Piercing","minDamage":1,"maxDamage":3,"speed":2.2,"rarity":"normal","itemLevel":1,"imgIndex":0,"itemType":"piercers"}');
		$query = 'insert into `items` (owner_id, slot, name, data) VALUES (?, 12, "Training Dagger", '. $data .')';
	}
	else if ($f['job'] === 'Ranger') {
		$data = json_encode('{"slots":["primary"],"weaponSkill":"Archery","minDamage":3,"maxDamage":6,"speed":3,"rarity":"normal","itemLevel":1,"imgIndex":0,"itemType":"bows"}');
		$query = 'insert into `items` (owner_id, slot, name, data) VALUES (?, 12, "Training Bow", '. $data .')';
	}
	$stmt = $db->prepare($query);
	$stmt->bind_param('i', $character_id);
	$stmt->execute();

	// echo something for fun
	$r['hero'] = $f;
	echo json_encode($r);