<?php
	require_once('connect1.php');
	function leaderboardNormal(){
		global $link;
		$filter = $_POST['filter'];
		if($filter=="OVERALL"){
			$query = "SELECT title, name, lastName, level, exp, job, race from characters where hardcoreMode='false' ORDER BY exp DESC, row asc LIMIT 300";
		}else{ 
			$query = "SELECT title, name, lastName, level, exp, job, race from characters where job='".$filter."' and hardcoreMode='false' ORDER BY exp DESC, row asc LIMIT 100";
		}
		
		$result = mysqli_query($link, $query);
		$string = '';
		while($row = mysqli_fetch_assoc($result)){
			$string.= $row['title']."|";
			$string.= $row['name']."|";
			$string.= $row['lastName']."|";
			$string.= $row['level']."|";
			$string.= $row['exp']."|";
			$string.= $row['job']."|";
			$string.= $row['race']."|";
		}
		echo $string;
	}
	function leaderboardNormalCombos(){
		global $link;
		$filter = $_POST['filter'];
		if($filter=="OVERALL"){
			$query = "SELECT title, name, lastName, level, comboOverall, job, race from characters where hardcoreMode='false' ORDER BY comboOverall DESC, row asc LIMIT 300";
		}else{ 
			$query = "SELECT title, name, lastName, level, comboOverall, job, race from characters where hardcoreMode='false' and job='".$filter."' ORDER BY comboOverall DESC, row asc LIMIT 100";
		}
		
		$result = mysqli_query($link, $query);
		$string = '';
		while($row = mysqli_fetch_assoc($result)){
			$string.= $row['title']."|";
			$string.= $row['name']."|";
			$string.= $row['lastName']."|";
			$string.= $row['level']."|";
			$string.= $row['comboOverall']."|";
			$string.= $row['job']."|";
			$string.= $row['race']."|";
		}
		echo $string;
	}
	function leaderboardHardcore(){
		global $link;
		$filter = $_POST['filter'];
		if($filter=="OVERALL"){
			$query = "SELECT title, name, lastName, level, exp, job, race from characters where hardcoreMode='true' ORDER BY exp DESC, row asc LIMIT 300";
		}else{ 
			$query = "SELECT title, name, lastName, level, exp, job, race from characters where job='".$filter."' and hardcoreMode='true' ORDER BY exp DESC, row asc LIMIT 100";
		}
		
		$result = mysqli_query($link, $query);
		$string = '';
		while($row = mysqli_fetch_assoc($result)){
			$string.= $row['title']."|";
			$string.= $row['name']."|";
			$string.= $row['lastName']."|";
			$string.= $row['level']."|";
			$string.= $row['exp']."|";
			$string.= $row['job']."|";
			$string.= $row['race']."|";
		}
		echo $string;
	}
	function leaderboardHardcoreCombos(){
		global $link;
		$filter = $_POST['filter'];
		if($filter=="OVERALL"){
			$query = "SELECT title, name, lastName, level, comboOverall, job, race from characters where hardcoreMode='true' ORDER BY comboOverall DESC, row asc LIMIT 300";
		}else{ 
			$query = "SELECT title, name, lastName, level, comboOverall, job, race from characters where hardcoreMode=true' and job='".$filter."' ORDER BY comboOverall DESC, row asc LIMIT 100";
		}
		
		$result = mysqli_query($link, $query);
		$string = '';
		while($row = mysqli_fetch_assoc($result)){
			$string.= $row['title']."|";
			$string.= $row['name']."|";
			$string.= $row['lastName']."|";
			$string.= $row['level']."|";
			$string.= $row['comboOverall']."|";
			$string.= $row['job']."|";
			$string.= $row['race']."|";
		}
		echo $string;
	}
	call_user_func($_POST['run']);	
?>