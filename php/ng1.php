<?php
	require 'connect1.php';
	if (!isset($_SESSION['email'])) {
		exit;
	}
	function createCharacter(){
		global $link;
		if(!isset($_SESSION['email'])){
			echo "Session has timed out! Try logging in again.";
			exit;
		}
		if($_SESSION['email']==''){
			echo "You must login to create a character.";
			exit;
		}
		$my = $_POST['my'];
		$illegal = array("\\", "/", ":", "*", "?", '"', "'", ">", "<", "1", "2", "3", "4", "5", "6", "7", "8", "9", "`", "0");
		$my['name'] = str_replace($illegal, "", $my['name']);
		// Check name constraint
		$query = 'select count(row) from characters where name=?';
		$stmt = $link->prepare($query);
		$stmt->bind_param('s', $my['name']);
		$stmt->execute();
		$stmt->store_result();
		$stmt->bind_result($dbcount);
		while($stmt->fetch()){
			$count = $dbcount;
		}
		if($count>0){
			echo "This character name is already taken!";
			exit;
		}
		// Check max characters on this account
		$query = "select characters from accounts where email=?";
		$stmt = $link->prepare($query);
		$stmt->bind_param('s', $_SESSION['email']);
		$stmt->execute();
		$stmt->store_result();
		$stmt->bind_result($characters);
		while($stmt->fetch()){
			$maxCharacters = $characters;
		}
		
		// Check current active characters
		$query = 'select count(row) from characters where email=?';
		$stmt = $link->prepare($query);
		$stmt->bind_param('s', $_SESSION['email']);
		$stmt->execute();
		$stmt->store_result();
		$stmt->bind_result($count);
		while($stmt->fetch()){
			$activeCharacters = $count;
		}
		if($activeCharacters === 16){
			echo "You cannot create anymore characters on this account.";
			exit;
		}
		// my character data created first
		require 'myJson.php';
		$json = myJson();
		foreach ($json as $key => $value){
			if ($key === 'story' || $key === 'gender'){
				$json->{$key} = $my[$key];
			} else {
				$json->{$key} = $my[$key] * 1;
			}
		}
		
		$json = json_encode($json);
		
		$query = "insert into characters (
			`created`, 
			`email`, 
			`account`, 
			`name`, 
			`hardcoreMode`, 
			`job`, 
			`race`, 
			`subzone`, 
			`subzoneN`, 
			`subzoneH`, 
			`zone`, 
			`zoneH`, 
			`zoneN`, 
			`json`
		) VALUES (
			now(), ?, ?, ?, ?, 
			?, ?, ?, ?, ?, 
			?, ?, ?, ?)";
		$stmt = $link->prepare($query);
		$stmt->bind_param('ssssssiiissss', 
			$_SESSION['email'], $_SESSION['account'], $my['name'], $my['hardcoreMode'], 
			$my['job'], $my['race'], $my['subzone'], $my['subzoneN'], $my['subzoneH'], 
			$my['zone'], $my['zoneH'], $my['zoneN'], $json);
		$stmt->execute();
		
		require 'itemJson.php';
		$noItem = json_encode(noItem());
		// 24 items
		$query = 'insert into item (
			email, 
			slotType, 
			characterName, 
			name, 
			slot, 
			json
		) VALUES 
		(?, "item", ?, "", 0, ?),
		(?, "item", ?, "", 1, ?),
		(?, "item", ?, "", 2, ?),
		(?, "item", ?, "", 3, ?),
		(?, "item", ?, "", 4, ?),
		(?, "item", ?, "", 5, ?),
		(?, "item", ?, "", 6, ?),
		(?, "item", ?, "", 7, ?),
		(?, "item", ?, "", 8, ?),
		(?, "item", ?, "", 9, ?),
		(?, "item", ?, "", 10, ?),
		(?, "item", ?, "", 11, ?),
		(?, "item", ?, "", 12, ?),
		(?, "item", ?, "", 13, ?),
		(?, "item", ?, "", 14, ?),
		(?, "item", ?, "", 15, ?),
		(?, "item", ?, "", 16, ?),
		(?, "item", ?, "", 17, ?),
		(?, "item", ?, "", 18, ?),
		(?, "item", ?, "", 19, ?),
		(?, "item", ?, "", 20, ?),
		(?, "item", ?, "", 21, ?),
		(?, "item", ?, "", 22, ?),
		(?, "item", ?, "", 23, ?)';
		
		$stmt = $link->prepare($query);
		$stmt->bind_param('ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss', 
			$_SESSION['email'], 
			$my['name'], 
			$noItem,
			$_SESSION['email'], 
			$my['name'], 
			$noItem,
			$_SESSION['email'], 
			$my['name'], 
			$noItem,
			$_SESSION['email'], 
			$my['name'], 
			$noItem,
			$_SESSION['email'], 
			$my['name'], 
			$noItem,
			$_SESSION['email'], 
			$my['name'], 
			$noItem,
			$_SESSION['email'], 
			$my['name'], 
			$noItem,
			$_SESSION['email'], 
			$my['name'], 
			$noItem,
			$_SESSION['email'], 
			$my['name'], 
			$noItem,
			$_SESSION['email'], 
			$my['name'], 
			$noItem,
			$_SESSION['email'], 
			$my['name'], 
			$noItem,
			$_SESSION['email'], 
			$my['name'], 
			$noItem,
			$_SESSION['email'], 
			$my['name'], 
			$noItem,
			$_SESSION['email'], 
			$my['name'], 
			$noItem,
			$_SESSION['email'], 
			$my['name'], 
			$noItem,
			$_SESSION['email'], 
			$my['name'], 
			$noItem,
			$_SESSION['email'], 
			$my['name'], 
			$noItem,
			$_SESSION['email'], 
			$my['name'], 
			$noItem,
			$_SESSION['email'], 
			$my['name'], 
			$noItem,
			$_SESSION['email'], 
			$my['name'], 
			$noItem,
			$_SESSION['email'], 
			$my['name'], 
			$noItem,
			$_SESSION['email'], 
			$my['name'], 
			$noItem,
			$_SESSION['email'], 
			$my['name'], 
			$noItem,
			$_SESSION['email'], 
			$my['name'],
			$noItem);
		$stmt->execute();
		
		$eq12 = noItem();
		$eq13 = noItem();
		
		// SLOT 12, 13
		if($my['job']!="Monk"){
			$eq12->damage = 3;
			$eq12->delay = 3600;
			$eq12->type = "slashed";
			$eq12->itemSlot = "weapons";
			$eq12->xPos = -576;
			$eq12->name = "Rusty Blade";
		}else{
			$eq12->damage = 1;
			$eq12->delay = 3000;
			$eq12->type = "punched";
			$eq12->itemSlot = "";
			$eq12->xPos = 0;
			$eq12->yPos = 0;
			$eq12->name = "";
		}		
		$eq13->damage = 0;
		$eq13->delay = 0;
		$eq13->type = "shield";
		$eq13->itemSlot = "shield";
		$eq13->xPos = -768;
		$eq13->name = "Wooden Shield";
		$eq13->armor = 1;
		if($my['job']=="Necromancer" ||
		$my['job']=="Enchanter" ||
		$my['job']=="Magician" ||
		$my['job']=="Wizard" ||
		$my['job']=="Rogue")
		{
			$eq12->damage = 2;
			$eq12->delay = 2600;
			$eq12->type = "pierced";
			$eq12->xPos = -704;
			$eq12->name = "Rusty Dagger";
		}
		if($my['job']=="Cleric" ||
		$my['job']=="Druid" ||
		$my['job']=="Shaman")
		{
			$eq12->damage = 4;
			$eq12->delay = 4400;
			$eq12->type = "crushed";
			$eq12->xPos = -640;
			$eq12->name = "Rusty Mace";
		}
		$eq12 = json_encode($eq12);
		$eq13 = json_encode($eq13);
		// SLOT 12
		$query = "insert into item 
		(`email`, `slotType`, `characterName`, `name`, `slot`, `json`) 
		VALUES 
		(?, 'eq', ?, '', 12, ?)";
		$stmt = $link->prepare($query);
		$stmt->bind_param('sss', $_SESSION['email'], $my['name'], $eq12);
		$stmt->execute();
		// SLOT 13
		$query = "insert into item 
		(`email`, `slotType`, `characterName`, `name`, `slot`, `json`) 
		VALUES 
		(?, 'eq', ?, '', 13, ?)";
		$stmt = $link->prepare($query);
		$stmt->bind_param('sss', $_SESSION['email'], $my['name'], $eq13);
		$stmt->execute();
		// SLOT 6
		$eq6 = noItem();
		
		$eq6->type = "cloth";
		$eq6->itemSlot = "chest";
		$eq6->xPos = -256;
		$eq6->yPos = -256;
		$eq6->name = "Training Tunic";
		$eq6->armor = 1;
		
		if($my['job']=="Necromancer" ||
		$my['job']=="Enchanter" ||
		$my['job']=="Magician" ||
		$my['job']=="Wizard")
		{
			$eq6->yPos = -64;
			$eq6->name = "Apprentice Robe";
		}
		$eq6 = json_encode($eq6);
		$query = "insert into item 
		(`email`, `slotType`, `characterName`, `name`, `slot`, `json`) 
		VALUES 
		(?, 'eq', ?, '', 6, ?)";
		$stmt = $link->prepare($query);
		$stmt->bind_param('sss', $_SESSION['email'], $my['name'], $eq6);
		$stmt->execute();
		// SLOT 14
		$eq14 = noItem();
		
		if($my['job']=="Ranger")
		{
			$eq14->damage = 4;
			$eq14->delay = 4500;
			$eq14->type = "range";
			$eq14->itemSlot = "range";
			$eq14->xPos = -704;
			$eq14->yPos = -512;
			$eq14->name = "Cracked Bow";
		} else {
			$eq14->damage = 1;
			$eq14->delay = 30000;
			$eq14->type = "";
			$eq14->itemSlot = "";
			$eq14->xPos = 0;
			$eq14->yPos = 0;
			$eq14->name = "";
		}
		$eq14 = json_encode($eq14);
		$query = "insert into item 
		(`email`, `slotType`, `characterName`, `name`, `slot`, `json`) 
		VALUES (?, 'eq', ?, '', 14, ?)";
		$stmt = $link->prepare($query);
		$stmt->bind_param('sss', $_SESSION['email'], $my['name'], $eq14);
		$stmt->execute();
		// REST OF EQ SLOTS
		$noItem = json_encode(noItem());
		
		$query = "insert into item (`email`, `slotType`, `characterName`, `name`, `slot`, `json`) VALUES 
		(?, 'eq', ?, '', 0, ?),
		(?, 'eq', ?, '', 1, ?),
		(?, 'eq', ?, '', 2, ?),
		(?, 'eq', ?, '', 3, ?),
		(?, 'eq', ?, '', 4, ?),
		(?, 'eq', ?, '', 5, ?),
		(?, 'eq', ?, '', 7, ?),
		(?, 'eq', ?, '', 8, ?),
		(?, 'eq', ?, '', 9, ?),
		(?, 'eq', ?, '', 10, ?),
		(?, 'eq', ?, '', 11, ?)";
		$stmt = $link->prepare($query);
		$stmt->bind_param('sssssssssssssssssssssssssssssssss', 
			$_SESSION['email'], 
			$my['name'], 
			$noItem, 
			$_SESSION['email'], 
			$my['name'], 
			$noItem, 
			$_SESSION['email'], 
			$my['name'], 
			$noItem, 
			$_SESSION['email'], 
			$my['name'], 
			$noItem, 
			$_SESSION['email'], 
			$my['name'], 
			$noItem, 
			$_SESSION['email'], 
			$my['name'], 
			$noItem, 
			$_SESSION['email'], 
			$my['name'], 
			$noItem, 
			$_SESSION['email'], 
			$my['name'], 
			$noItem, 
			$_SESSION['email'], 
			$my['name'], 
			$noItem, 
			$_SESSION['email'], 
			$my['name'], 
			$noItem, 
			$_SESSION['email'], 
			$my['name'],
			$noItem);
		$stmt->execute();
		// init Q
		require 'qJson.php';
		$json = json_encode(qJson());
		
		$query = "insert into quests (`email`, `name`, `difficulty`, `json`
		) VALUES 
		(?, ?, 0, ?),
		(?, ?, 1, ?),
		(?, ?, 2, ?)";
		$stmt = $link->prepare($query);
		$stmt->bind_param('sssssssss', $_SESSION['email'], $my['name'], $json, $_SESSION['email'], $my['name'], $json, $_SESSION['email'], $my['name'], $json);
		$stmt->execute();
	}
	function deleteCharacter(){
		global $link;
		$email = $_SESSION['email'];
		$name = $_POST['name'];
		if($name=='*'||$name==''){
			exit;
		}
		// character
		$query = 'delete from characters where name=? and email=?';
		$stmt = $link->prepare($query);
		$stmt->bind_param('ss', $name, $email);
		$stmt->execute();
		// quests
		$query = 'delete from quests where name=? and email=?';
		$stmt = $link->prepare($query);
		$stmt->bind_param('ss', $name, $email);
		$stmt->execute();
		// items
		$query = 'delete from item where characterName=? and email=?';
		$stmt = $link->prepare($query);
		$stmt->bind_param('ss', $name, $email);
		$stmt->execute();
	}

	function checkDifficulty(){
		header('Content-Type: application/json');
		global $link;
		$query = "select json from quests where email=? and difficulty < 2 order by row, difficulty";
		$stmt = $link->prepare($query);
		$stmt->bind_param('s', $_SESSION['email']);
		$stmt->execute();
		$stmt->bind_result($data);
		$o = [];
		$loop = 0;
		$i = 0;
		while($stmt->fetch()){
			if ($loop % 2 === 0){
				$o[$i] = new stdClass();
				$o[$i]->nightmare = $data ? $data : '';
			} else {
				$o[$i]->hell = $data ? $data : '';
				$i++;
			}
			$loop++;
		}
		
		echo json_encode($o);
	}
	function addCharacterSlot(){
		global $link;
		// check current total characters
		$stmt = $link->prepare('select count(row) from characters where email=?;');
		$stmt->bind_param('s', $_SESSION['email']);
		$stmt->execute();
		$stmt->bind_result($count);

		$activeCharacters = 0;
		while ($stmt->fetch()) {
			$activeCharacters = $count;
		}

		if ($activeCharacters === 16){
			echo 'maxed';
		}
		else {
			echo 'create';
		}
	}
	
	function logout(){
		$_SESSION = array();
		if (ini_get("session.use_cookies")) {
			$params = session_get_cookie_params();
			setcookie(session_name(), '', time() - 42000,
				$params["path"], $params["domain"],
				$params["secure"], $params["httponly"]
			);
		}
		session_destroy();
	}
	
	call_user_func($_POST['run']);
?>