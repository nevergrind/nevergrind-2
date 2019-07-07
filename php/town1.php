<?php
	require 'connect1.php';
	
	function addBankSlots(){
		global $link;
		$email = $_SESSION['email'];
		$mode = $_SESSION['hardcoreMode'];
		// check crystal balance
		if($mode=='false'){
			$query = "select crystals, bankSlots from accounts where email=?";
		}else{
			$query = "select crystals, hcBankSlots from accounts where email=?";
		}
		$stmt = $link->prepare($query);
		$stmt->bind_param('s', $_SESSION['email']);
		$stmt->execute();
		$stmt->store_result();
		$stmt->bind_result($dbcrystals, $dbchars);
		while($stmt->fetch()){
			$crystals = $dbcrystals*1;
			$totalBankSlots = $dbchars*1;
		}
		$Slot = $totalBankSlots;
		if($totalBankSlots>=1071){
			echo 'maxed';
		}else if($crystals < 40){
			echo 'buyCrystals';
		}else{
			$crystals = $crystals - 40;
			$totalBankSlots = $totalBankSlots + 10;
			echo 'pay40|'.$crystals.'|'.$totalBankSlots.'|'.$crystals;
			if($mode=='false'){
				$query = "update accounts set crystals=$crystals, bankSlots=$totalBankSlots where email=?";
			}else{
				$query = "update accounts set crystals=$crystals, hcBankSlots=$totalBankSlots where email=?";
			}
			$stmt = $link->prepare($query);
			$stmt->bind_param('s', $email);
			$stmt->execute();
			
			// create bank PAID FEATURE
			require 'itemJson.php';
			$noItem = json_encode(noItem());
			if($mode=='false'){
				$query = "insert into item (
					`email`, `slotType`, `name`, `slot`, `json`, `hardcoreMode`
				) VALUES 
				(?, 'bank', '', ".($Slot).", ?, 'false'),
				(?, 'bank', '', ".($Slot+1).", ?, 'false'),
				(?, 'bank', '', ".($Slot+2).", ?, 'false'),
				(?, 'bank', '', ".($Slot+3).", ?, 'false'),
				(?, 'bank', '', ".($Slot+4).", ?, 'false'),
				(?, 'bank', '', ".($Slot+5).", ?, 'false'),
				(?, 'bank', '', ".($Slot+6).", ?, 'false'),
				(?, 'bank', '', ".($Slot+7).", ?, 'false'),
				(?, 'bank', '', ".($Slot+8).", ?, 'false'),
				(?, 'bank', '', ".($Slot+9).", ?, 'false')";
				$stmt = $link->prepare($query);
				$stmt->bind_param('ssssssssssssssssssss', 
					$email, $noItem, 
					$email, $noItem, 
					$email, $noItem, 
					$email, $noItem, 
					$email, $noItem, 
					$email, $noItem, 
					$email, $noItem, 
					$email, $noItem, 
					$email, $noItem, 
					$email, $noItem);
				$stmt->execute();
			}
			else{
				// hardcore mode
				$query = "insert into item (
					`email`, `slotType`, `name`, `slot`, `json`, `hardcoreMode`
				) VALUES 
				(?, 'bank', '', ".($Slot).", ?, 'true'),
				(?, 'bank', '', ".($Slot+1).", ?, 'true'),
				(?, 'bank', '', ".($Slot+2).", ?, 'true'),
				(?, 'bank', '', ".($Slot+3).", ?, 'true'),
				(?, 'bank', '', ".($Slot+4).", ?, 'true'),
				(?, 'bank', '', ".($Slot+5).", ?, 'true'),
				(?, 'bank', '', ".($Slot+6).", ?, 'true'),
				(?, 'bank', '', ".($Slot+7).", ?, 'true'),
				(?, 'bank', '', ".($Slot+8).", ?, 'true'),
				(?, 'bank', '', ".($Slot+9).", ?, 'true')";
				$stmt = $link->prepare($query);
				$stmt->bind_param('ssssssssssssssssssss', 
					$email, $noItem, 
					$email, $noItem, 
					$email, $noItem, 
					$email, $noItem, 
					$email, $noItem, 
					$email, $noItem, 
					$email, $noItem, 
					$email, $noItem, 
					$email, $noItem, 
					$email, $noItem);
				$stmt->execute();
			}
		}
	}
	function setCrystals(){
		global $link;
		$query = "select crystals from accounts where email='".$_SESSION['email']."' limit 1";
		$result = $link->query($query);
		while($row = $result->fetch_assoc()){
			$str = $row['crystals'];
		}
		echo $str;
	}
	function depositGold(){
		global $link;
		$addToChar = $_POST['amount']*1;
		$email = $_SESSION['email'];
		$name = $_POST['name'];
		// check character balance
		$query = "select gold from characters where name=?";
		$stmt = $link->prepare($query);
		$stmt->bind_param('s', $name);
		$stmt->execute();
		$stmt->store_result();
		$stmt->bind_result($db_gold);
		while($stmt->fetch()){
			$my_gold = $db_gold*1;
		}
		if($addToChar <= $my_gold){
			// check bank balance
			if($_SESSION['hardcoreMode']=='false'){
				$query = "select gold from accounts where email=?";
			}else{
				$query = "select hcgold from accounts where email=?";
			}
			$stmt = $link->prepare($query);
			$stmt->bind_param('s', $email);
			$stmt->execute();
			$stmt->store_result();
			$stmt->bind_result($db_gold);
			while($stmt->fetch()){
				$bank_gold = $db_gold*1;
			}
			$my_new_gold = $my_gold - $addToChar;
			$bank_new_gold = $bank_gold + $addToChar;
			// update character gold
			$query = "update characters set gold=? where name=?";
			$stmt = $link->prepare($query);
			$stmt->bind_param('is', $my_new_gold, $name);
			$stmt->execute();
			// update account gold
			if($_SESSION['hardcoreMode']=='false'){
				$query = "update accounts set gold=? where email=?";
			}else{
				$query = "update accounts set hcgold=? where email=?";
			}
			$stmt = $link->prepare($query);
			$stmt->bind_param('is', $bank_new_gold, $email);
			$stmt->execute();
			echo $my_new_gold."|".$bank_new_gold;
		}else{
			echo "no";
		}
	}
	function withdrawGold(){
		global $link;
		$addToChar = $_POST['amount']*1;
		$email = $_SESSION['email'];
		$name = $_POST['name'];
		// check bank balance
		if($_SESSION['hardcoreMode']=='false'){
			$query = "select gold from accounts where email=?";
		}else{
			$query = "select hcgold from accounts where email=?";
		}
		$stmt = $link->prepare($query);
		$stmt->bind_param('s', $email);
		$stmt->execute();
		$stmt->store_result();
		$stmt->bind_result($db_gold);
		while($stmt->fetch()){
			$bank_gold = $db_gold*1;
		}
		if($addToChar <= $bank_gold){
			// check character balance
			$query = "select gold from characters where name=?";
			$stmt = $link->prepare($query);
			$stmt->bind_param('s', $name);
			$stmt->execute();
			$stmt->store_result();
			$stmt->bind_result($db_gold);
			while($stmt->fetch()){
				$my_gold = $db_gold*1;
			}
			
			$my_new_gold = $my_gold + $addToChar;
			$bank_new_gold = $bank_gold - $addToChar;
			// update character gold
			$query = "update characters set gold=? where name=?";
			$stmt = $link->prepare($query);
			$stmt->bind_param('is', $my_new_gold, $name);
			$stmt->execute();
			// update account gold
			if($_SESSION['hardcoreMode']=='false'){
				$query = "update accounts set gold=? where email=?";
			}else{
				$query = "update accounts set hcgold=? where email=?";
			}
			$stmt = $link->prepare($query);
			$stmt->bind_param('is', $bank_new_gold, $email);
			$stmt->execute();
			echo $my_new_gold."|".$bank_new_gold;
		}else{
			echo "no";
		}
	}
	function trainSkill(){
		global $link;
		$cost = $_POST['cost']*1;
		$name = $_POST['name'];
		$query = "select gold from characters where name=?";
		$stmt = $link->prepare($query);
		$stmt->bind_param('s', $name);
		$stmt->execute();
		$stmt->store_result();
		$stmt->bind_result($db_gold);
		while($stmt->fetch()){
			$my_gold = $db_gold;
		}
		if($cost < $my_gold){
			$my_gold = $my_gold - $cost;
			$query = "update characters set gold=? where name=?";
			$stmt = $link->prepare($query);
			$stmt->bind_param('is', $my_gold, $name);
			$stmt->execute();
		}
	}
	function buyUpgrade(){
		global $link;
		$cost = $_POST['cost']*1;
		$name = $_POST['name'];
		$query = "select gold from characters where name=?";
		$stmt = $link->prepare($query);
		$stmt->bind_param('s', $name);
		$stmt->execute();
		$stmt->store_result();
		$stmt->bind_result($db_gold);
		while($stmt->fetch()){
			$my_gold = $db_gold;
		}
		if($cost < $my_gold){
			$my_gold = $my_gold - $cost;
			$query = "update characters set gold=? where name=?";
			$stmt = $link->prepare($query);
			$stmt->bind_param('is', $my_gold, $name);
			$stmt->execute();
		}
	}
	function buyItem(){
		global $link;
		$cost = $_POST['cost']*1;
		$name = $_POST['name'];
		$query = "select gold from characters where name=?";
		$stmt = $link->prepare($query);
		$stmt->bind_param('s', $name);
		$stmt->execute();
		$stmt->store_result();
		$stmt->bind_result($db_gold);
		while($stmt->fetch()){
			$my_gold = $db_gold;
		}
		if($cost < $my_gold){
			$my_gold = $my_gold - $cost;
			$query = "update characters set gold=? where name=?";
			$stmt = $link->prepare($query);
			$stmt->bind_param('is', $my_gold, $name);
			$stmt->execute();
		}
	}
	function resetTalents(){
		global $link;
		// subtract gold
		$cost = $_POST['cost']*1;
		$name = $_POST['name'];
		$query = "select gold from characters where name=? and email=?";
		$stmt = $link->prepare($query);
		$stmt->bind_param('ss', $name, $_SESSION['email']);
		$stmt->execute();
		$stmt->store_result();
		$stmt->bind_result($db_gold);
		while($stmt->fetch()){
			$my_gold = $db_gold;
		}
		if($cost < $my_gold){
			$my_gold = $my_gold - $cost;
			$query = "update characters set gold=? where name=?";
			$stmt = $link->prepare($query);
			$stmt->bind_param('is', $my_gold, $name);
			$stmt->execute();
			echo "ok";
		}
	}
	function sellItem(){
		global $link;
		$gold = $_POST['cost']*1;
		$query = "select gold from characters where name=?";
		$stmt = $link->prepare($query);
		$stmt->bind_param('s', $_POST['name']);
		$stmt->execute();
		$stmt->store_result();
		$stmt->bind_result($db_gold);
		while($stmt->fetch()){
			$my_gold = $db_gold;
		}
		$my_gold = $my_gold + $gold;
		$query = "update characters set gold=? where name=?";
		$stmt = $link->prepare($query);
		$stmt->bind_param('is', $my_gold, $_POST['name']);
		$stmt->execute();
	}
	call_user_func($_POST['run']);
?>