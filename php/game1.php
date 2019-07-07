<?php
	require 'connect1.php';
	function updateMy(){
		global $link;
		$json = $_POST['json'];
		$stmt = $link->prepare("update characters set 
			json=?,
			title=?,
			difficulty=?,
			level=?,
			zone=?,
			zoneH=?,
			zoneN=?, 
			subzone=?,
			subzoneN=?,
			subzoneH=?
			where email=? 
			and name=?");
		$stmt->bind_param('ssiisssiiiss',
			$json, $_POST['title'], $_POST['difficulty'], $_POST['level'], $_POST['zone'], $_POST['zoneH'], $_POST['zoneN'], $_POST['subzone'], $_POST['subzoneN'], $_POST['subzoneH'], $_SESSION['email'], $_POST['name']);

		$stmt->execute();
	}
	function updateExpGold(){
		global $link;
		$exp = $_POST['exp']*1;
		$mobExp = $_POST['mobExp']*1;
		$Slot = $_POST['Slot']*1;
		$gold = $_POST['gold']*1;
		$name = $_POST['name'];
		if($mobExp > 0){
			// was the value changed/hacked?
			if($mobExp != $_SESSION['mob'][$Slot]->exp){
				$exp = 0;
			}
		}
		// sanity check
		if($exp > 200000){
			$exp = 0;
		}
		// insert
		$query = 'select gold, exp from characters where name=?';
		$stmt = $link->prepare($query);
		$stmt->bind_param('s', $name);
		$stmt->execute();
		$stmt->store_result();
		$stmt->bind_result($db_gold, $db_exp);
		while($stmt->fetch()){
			$my_gold = $db_gold;
			$my_exp = $db_exp;
		}
		$my_gold = $my_gold + $gold;
		$my_exp = $my_exp + $exp;
		if($my_exp > 103835784){
			$my_exp = 103835784;
		}
		$query = 'update characters set exp=?, gold=? where name=?';
		$stmt = $link->prepare($query);
		$stmt->bind_param('iis', $my_exp, $my_gold, $name);
		$stmt->execute();
		echo $exp;
	}
	function updateCombo(){
		global $link;
		$rating = $_POST['rating']*1;
		$name = $_POST['name'];
		$query = "select comboOverall from characters where name=?";
		$stmt = $link->prepare($query);
		$stmt->bind_param('s', $name);
		$stmt->execute();
		$stmt->store_result();
		$stmt->bind_result($db_combo);
		while($stmt->fetch()){
			$combo = $db_combo*1;
		}
		if($rating > $combo){
			$query = "update characters set comboOverall=? where email=? and name=?";
			$stmt = $link->prepare($query);
			$stmt->bind_param('iss', $rating, $_SESSION['email'], $name);
			$stmt->execute();
		}
	}
	function updateQuests(){ 
		global $link;
		$Q = $_POST['Q'];
		$diff = $_POST['diff'];
		$name = $_POST['name'];
		$stmt = $link->prepare('update quests set json=? 
		where email=? 
		and name=? 
		and difficulty=?');
		$stmt->bind_param('sssi', $Q, $_SESSION['email'], $name, $diff);
		$stmt->execute();
	}
	function updateGLB(){
		global $link;
		$GLB = $_POST['GLB'];
		$query = "update glb set chatMyHit=?, hideMenu=?, musicStatus=?, soundStatus=?, tooltipMode=?, videoSetting=?, showCombatLog=?, debugMode=? where email=?;";
		$stmt = $link->prepare($query);
		$stmt->bind_param('ssiisssss', 
			$GLB['chatMyHit'], $GLB['hideMenu'], $GLB['musicStatus'], $GLB['soundStatus'], $GLB['tooltipMode'], $GLB['videoSetting'], $GLB['showCombatLog'], $GLB['debugMode'], $_SESSION['email']
		);
		$stmt->execute();
	}
	function updateItem(){
		global $link;
		$json = $_POST['json'];
		$Slot = $_POST['Slot'];
		$name = $_POST['name'];
		$itemName = $_POST['itemName'];
		$slotType = $_POST['slotType'];
		if($slotType=='bank'){
			$stmt = $link->prepare("update item set json=?,
			name=? 
			where email=? 
			and slotType=? 
			and slot=? 
			and hardcoreMode=?");
			$stmt->bind_param('ssssis', 
				$json,
				$itemName, 
				$_SESSION['email'], 
				$slotType, 
				$Slot, 
				$_SESSION['hardcoreMode']);
		}else{
			$stmt = $link->prepare("update item set json=?,
				name=? 
				where email=? 
				and characterName=? 
				and slotType=? 
				and slot=?");
			$stmt->bind_param('sssssi', 
				$json,
				$itemName,
				$_SESSION['email'], 
				$name, 
				$slotType, 
				$Slot);
		}
		$stmt->execute();
	}
	function camp(){
		global $link;
		$query = 'delete from ping where email=?';
		$stmt = $link->prepare($query);
		$stmt->bind_param('s', $_SESSION['email']);
		$stmt->execute();
	}
	call_user_func($_POST['run']);
?>