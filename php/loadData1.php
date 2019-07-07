<?php
	require_once('connect1.php');
	
	function loadGlb(){
		global $link;
		$query = "select 
			chatMyHit, 
			hideMenu, 
			musicStatus, 
			soundStatus, 
			tooltipMode, 
			videoSetting, 
			showCombatLog, 
			debugMode from glb where email='".$_SESSION['email']."' limit 1";
		$result = $link->query($query);
		$str = '';
		while($row = $result->fetch_assoc()){
			$str .= $row['chatMyHit'] ."|";
			$str .= $row['hideMenu'] ."|";
			$str .= $row['musicStatus'] ."|";
			$str .= $row['soundStatus'] ."|";
			$str .= $row['tooltipMode'] ."|";
			$str .= $row['videoSetting'] ."|";
			$str .= $row['showCombatLog'] ."|";
			$str .= $row['debugMode'] ."|";
		}

		// gold, crystals, etc
		$query = "select gold, hcgold, bankSlots, hcBankSlots, characters, crystals, kstier, account, confirmed from accounts where email='".$_SESSION['email']."' limit 1";
		$result = $link->query($query);
		while($row = $result->fetch_assoc()){
			$_SESSION['characterSlots'] = $row['characters']*1;
			$str .= $row['gold']."|";
			$str .= $row['hcgold']."|";
			$str .= $row['bankSlots']."|";
			$str .= $row['hcBankSlots']."|";
			$str .= $_SESSION['characterSlots']."|";
			$str .= $row['crystals']."|";
			$str .= $row['kstier']."|";
			$str .= $row['account']."|";
			$str .= $row['confirmed']."|";
		}
		echo $str;
	}
	function loadMy(){
		global $link;
		header('Content-Type: json/application');
		// Nevergrounds uses this - use $ng to avoid use of $_SESSION!
		$ng = $_POST['ng'];
		
		if(strlen($_POST['name'])<1 && is_string($_POST['name'])){
			echo '';
			exit;
		}
		if($ng=='false'){
			$query = "select status from accounts where email=? limit 1";
			$stmt = $link->prepare($query);
			$stmt->bind_param('s', $_SESSION['email']);
			$stmt->execute();
			$stmt->bind_result($stmtStatus);
			while($stmt->fetch()){
				$dbStatus = $stmtStatus;
			}
			if($dbStatus=="suspended"){
				echo "Account has been suspended.";
				exit;
			}
			if($dbStatus=="banned"){
				echo "Account has been banned.";
				exit;
			}
			
			if($_SESSION['email']==''){
				echo "Your session has expired.";
				exit;
			}
		}
		$query = "select json, title, name, lastName, exp, gold, hardcoreMode, job, level, race, difficulty, subzone, subzoneN, subzoneH, zone, zoneH, zoneN, comboOverall, views 
		from characters where name=? order by row";
		$stmt = $link->prepare($query);
		$stmt->bind_param('s', $_POST['name']);
		$stmt->execute();
		$stmt->bind_result($json, $title, $name, $lastName, $exp, $gold, 
		$hardcoreMode, $job, $level, $race, $difficulty, 
		$subzone, $subzoneN, $subzoneH, $zone, $zoneH, 
		$zoneN, $comboOverall, $views);
		$s = new stdClass();
		while($stmt->fetch()){
			if($ng == 'false'){
				$_SESSION['hardcoreMode'] = $hardcoreMode;
				$_SESSION['difficulty'] = $difficulty;
			}
			$s = (object)array(
				'json' => $json,
				'title' => $title,
				'name' => $name,
				'lastName' => $lastName,
				'exp' => $exp,
				'gold' => $gold,
				'hardcoreMode' => $hardcoreMode,
				'job' => $job,
				'level' => $level,
				'race' => $race,
				'difficulty' => $difficulty,
				'subzone' => $subzone,
				'subzoneN' => $subzoneN,
				'subzoneH' => $subzoneH,
				'zone' => $zone,
				'zoneH' => $zoneH,
				'zoneN' => $zoneN,
				'comboOverall' => $comboOverall,
				'views' => $views
			);
		}
		if($ng == 'false'){
			// in game
			$s->testHardcoreMode = $_SESSION['hardcoreMode'];
			if($_SESSION['hardcoreMode'] == 'true'){
				$zig = json_decode($s->json);
				if(($zig->deaths) > 0){
					$s->dead = 1;
				}
			};
			$query = "update characters set timestamp=now() where name=?";
			$stmt = $link->prepare($query);
			$stmt->bind_param('s', $_POST['name']);
			$stmt->execute();
		}
		$s->json = json_decode($s->json);
		echo json_encode($s);
	}
	function loadItem(){
		global $link;
		$_SESSION['mob'] = array();
		for($i=0;$i<=4;$i++){
			$_SESSION['mob'][$i] = new STDClass();
		}
		if(strlen($_POST['name'])<1 && is_string($_POST['name'])){
			echo '';
			exit;
		}
		// check if server is up - only I am allowed to enter while down
		$query = "select status from server_status order by row desc limit 1";
		$stmt = mysqli_prepare($link, $query);
		mysqli_stmt_execute($stmt);
		mysqli_stmt_store_result($stmt);
		mysqli_stmt_bind_result($stmt, $db_status);
		if(mysqli_stmt_fetch($stmt)){
			$status = $db_status;
		}
		if($_SESSION['email']!='joemattleonard@gmail.com'){
			if($status=="down"){
				echo "down";
				exit;
			}
		}
		$query = "select json, name from item where email='".$_SESSION['email']."' and characterName=? and slotType='item' order by slot limit 24";
		$stmt = $link->prepare($query);
		$stmt->bind_param('s', $_POST['name']);
		$stmt->execute();
		$stmt->bind_result($json, $name);
		$s = [];
		$i = 0;
		while($stmt->fetch()){
			$s[$i] = new stdClass();
			$s[$i]->name = $name;
			$s[$i]->json = $json;
			$i++;
		}
		
		header('Content-Type: application/json');
		echo json_encode($s);
		// server
		/*
		$query = "select email from ping where email=? and timestamp>date_sub(now(), interval 20 second)";
		$stmt = $link->prepare($query);
		$stmt->bind_param('s', $_SESSION['email']);
		$stmt->execute();
		$stmt->store_result();
		$count = $stmt->num_rows;
		if($count>0){
			echo 'false';
		}else{
			header('Content-Type: application/json');
			echo json_encode($s);
		}
		*/
	}
	function loadBank(){
		global $link;
		// check crystal balance
		$mode = $_SESSION['hardcoreMode'];
		if($mode=='false'){
			$query = "select bankSlots from accounts where email=?";
		}else{
			$query = "select hcBankSlots from accounts where email=?";
		}
		
		$stmt = $link->prepare($query);
		$stmt->bind_param('s', $_SESSION['email']);
		$stmt->execute();
		$stmt->store_result();
		$stmt->bind_result($slots);
		while($stmt->fetch()){
			$totalBankSlots = $slots*1;
		}
		// check gold balance
		if($mode=='false'){
			$query = "select gold from accounts where email=?";
		}else{
			$query = "select hcgold from accounts where email=?";
		}
		$stmt = $link->prepare($query);
		$stmt->bind_param('s', $_SESSION['email']);
		$stmt->execute();
		$stmt->store_result();
		$stmt->bind_result($dbGold);
		while($stmt->fetch()){
			$totalGold = $dbGold * 1;
		}
		$s = new stdClass();
		$s->gold = $totalGold;
		$s->totalBankSlots = $totalBankSlots;
		
		$query = "select json, name from item where 
			email='".$_SESSION['email']."' 
			and hardcoreMode='".$_SESSION['hardcoreMode']."' 
			and slotType='bank' 
			order by slot";
		
		$stmt = $link->prepare($query);
		$stmt->bind_result($json, $name);
		$stmt->execute();
		// parse
		$s->bank = [];
		$i = 0;
		while($stmt->fetch()){
			$s->bank[$i] = new stdClass();
			$s->bank[$i]->name = $name;
			$s->bank[$i]->json = $json;
			$i++;
		}
		header('Content-Type: application/json');
		echo json_encode($s);
	}
	function loadEq(){
		global $link;
		// Nevergrounds uses this - use $ng to avoid use of $_SESSION!
		$query = "select json, name from item where characterName=? and slotType='eq' order by slot limit 15";
		$stmt = $link->prepare($query);
		$stmt->bind_param('s', $_POST['name']);
		$stmt->execute();
		$stmt->bind_result($json, $name);
		$s = [];
		$i = 0;
		while($stmt->fetch()){
			$s[$i] = new stdClass();
			$s[$i]->name = $name;
			$s[$i]->json = $json;
			$i++;
		}
		header('Content-Type: application/json');
		echo json_encode($s);
	}
	function loadQ(){
		header('Content-Type: application/json');
		global $link;
		$email = $_SESSION['email'];
		$name = $_POST['name'];
		$query = "select json from quests where email=? and name=? order by difficulty";
		$stmt = $link->prepare($query);
		$stmt->bind_param('ss', $_SESSION['email'], $_POST['name']);
		$stmt->execute();
		$stmt->bind_result($json);
		$o = [];
		$i = 0;
		while($stmt->fetch()){
			$o[$i] = $json;
			$i++;
		}
		echo json_encode($o);
	}
	call_user_func($_POST['run']);
?>