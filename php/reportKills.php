<?php
	require($_SERVER['DOCUMENT_ROOT'] . "/php/connect1.php");
	
	$filter = $_POST['filter'];
	
	if($filter=="OVERALL"){
		$query = "SELECT name, job, race, level, kills FROM kills where ban=0 ORDER BY kills DESC, level DESC, id ASC LIMIT 300";
	}
	if($filter=="WAR"){ 
		$query = "SELECT name, job, race, level, kills FROM kills where job='Warrior' and ban=0 ORDER BY kills DESC, level DESC, id ASC LIMIT 300";
	}
	if($filter=="MNK"){ 
		$query = "SELECT name, job, race, level, kills FROM kills where job='Monk' and ban=0 ORDER BY kills DESC, level DESC, id ASC LIMIT 300";
	}
	if($filter=="ROG"){ 
		$query = "SELECT name, job, race, level, kills FROM kills where job='Rogue' and ban=0 ORDER BY kills DESC, level DESC, id ASC LIMIT 300";
	}
	if($filter=="PAL"){ 
		$query = "SELECT name, job, race, level, kills FROM kills where job='Paladin' and ban=0 ORDER BY kills DESC, level DESC, id ASC LIMIT 300";
	}
	if($filter=="SK"){ 
		$query = "SELECT name, job, race, level, kills FROM kills where job='Shadow Knight' and ban=0 ORDER BY kills DESC, level DESC, id ASC LIMIT 300";
	}
	if($filter=="RNG"){ 
		$query = "SELECT name, job, race, level, kills FROM kills where job='Ranger' and ban=0 ORDER BY kills DESC, level DESC, id ASC LIMIT 300";
	}
	if($filter=="BRD"){ 
		$query = "SELECT name, job, race, level, kills FROM kills where job='Bard' and ban=0 ORDER BY kills DESC, level DESC, id ASC LIMIT 300";
	}
	if($filter=="DRU"){ 
		$query = "SELECT name, job, race, level, kills FROM kills where job='Druid' and ban=0 ORDER BY kills DESC, level DESC, id ASC LIMIT 300";
	}
	if($filter=="CLR"){ 
		$query = "SELECT name, job, race, level, kills FROM kills where job='Cleric' and ban=0 ORDER BY kills DESC, level DESC, id ASC LIMIT 300";
	}
	if($filter=="SHM"){ 
		$query = "SELECT name, job, race, level, kills FROM kills where job='Shaman' and ban=0 ORDER BY kills DESC, level DESC, id ASC LIMIT 300";
	}
	if($filter=="NEC"){ 
		$query = "SELECT name, job, race, level, kills FROM kills where job='Necromancer' and ban=0 ORDER BY kills DESC, level DESC, id ASC LIMIT 300";
	}
	if($filter=="ENC"){ 
		$query = "SELECT name, job, race, level, kills FROM kills where job='Enchanter' and ban=0 ORDER BY kills DESC, level DESC, id ASC LIMIT 300";
	}
	if($filter=="MAG"){ 
		$query = "SELECT name, job, race, level, kills FROM kills where job='Magician' and ban=0 ORDER BY kills DESC, level DESC, id ASC LIMIT 300";
	}
	if($filter=="WIZ"){ 
		$query = "SELECT name, job, race, level, kills FROM kills where job='Wizard' and ban=0 ORDER BY kills DESC, level DESC, id ASC LIMIT 300";
	}
	
	$result = mysqli_query($con, $query);
	$string = '';
	while($row = mysqli_fetch_assoc($result)){
		$string.= $row['name']."|";
		$string.= $row['level']."|";
		$string.= $row['kills']."|";
		$string.= $row['job']."|";
		$string.= $row['race']."|";
	}
	echo $string;
	mysqli_close($con);
?>