<?php
	header('Content-Type: application/json');
	require 'connect1.php';
	$o = new stdClass();
	$count = 1;
	$o->str = '';
	
	if ($_POST['type'] === 'FFA'){
		// free for all
		$o->str = '<h2 class="text-center header">Free For All Leaderboard</h2>
			<hr class="fancyhr">
		<table class="table tight">';
		$o->str .= '<tr>
				<th style="width: 100px">Rank</th>
				<th>Account</th>
				<th>Nation</th>
				<th style="width: 100px">Record</th>
			</tr>';
		$query = 'select account, country_name, nation, flag, rating, wins, losses from fwnations 
		where wins!=0 
		or losses!=0 
		order by wins desc, losses asc, row 
		limit 300';
		$result = mysqli_query($link, $query);
		if ($result->num_rows){
			while ($row = mysqli_fetch_assoc($result)){
				$arr = explode(".", $row['flag']);
				$nationClassName = str_replace(" ", "-", $arr[0]);
				
				$accountFlag = $row['country_name'] ? 
					'<div class="flag '. str_replace(" ", "-", $row['country_name']) .'"></div>' :
					'<div class="flag Player1"></div>';
				$o->str .= 
				'<tr>
					<td>'. $count++ .'</td>
					<td>'. $accountFlag . $row['account'] .'</td>
					<td><div class="flag '. $nationClassName .'"></div>'. $row['nation'] .'</td>
					<td>'. $row['wins'] .'-'. $row['losses'] .'</td>
				</tr>';
			}
		}
	} else if ($_POST['type'] === 'Ranked'){
		// ranked
		$o->str = '<h2 class="text-center header ranked">Ranked Leaderboard</h2>
		<table class="table tight">';
		$o->str .= '<tr>
				<th style="width: 100px">Rank</th>
				<th>Account</th>
				<th>Nation</th>
				<th style="width: 100px">Record</th>
				<th style="width: 100px">Rating</th>
			</tr>';
		
		$query = 'select account, country_name, nation, flag, rating, rankedWins, rankedLosses from fwnations 
			where rankedWins!=0 
			or rankedLosses!=0 
			order by rating desc, rankedWins desc, rankedLosses asc, row 
			limit 300'; 
		$result = mysqli_query($link, $query);
		if ($result->num_rows){
			while ($row = mysqli_fetch_assoc($result)){
				$arr = explode(".", $row['flag']);
				$className = str_replace(" ", "-", $arr[0]);
				
				$accountFlag = $row['country_name'] ? 
					'<div class="flag '. str_replace(" ", "-", $row['country_name']) .'"></div>' :
					'<div class="flag Player1"></div>';
				$o->str .= 
				'<tr>
					<td>'. $count++ .'</td>
					<td>'. $accountFlag . $row['account'] .'</td>
					<td><div class="flag '. $className .'"></div>'. $row['nation'] .'</td>
					<td>'. $row['rankedWins'] .'-'. $row['rankedLosses'] .'</td>
					<td>'. $row['rating'] .'</td>
				</tr>';
			}
		}
	} else if ($_POST['type'] === 'Team'){
		// team
		$o->str = '<h2 class="text-center header">Team Leaderboard</h2>
		<table class="table tight">';
		$o->str .= '<tr>
				<th style="width: 100px">Rank</th>
				<th>Account</th>
				<th>Nation</th>
				<th style="width: 100px">Record</th>
			</tr>';
		
		$query = 'select account, country_name, nation, flag, rating, teamWins, teamLosses from fwnations 
		where teamWins!=0 
		or teamLosses!=0 
		order by teamWins desc, teamLosses asc, row 
		limit 300';
		$result = mysqli_query($link, $query);
		if ($result->num_rows){
			while ($row = mysqli_fetch_assoc($result)){
				$arr = explode(".", $row['flag']);
				$className = str_replace(" ", "-", $arr[0]);
				
				$accountFlag = $row['country_name'] ? 
					'<div class="flag '. str_replace(" ", "-", $row['country_name']) .'"></div>' :
					'<div class="flag Player1"></div>';
				$o->str .= 
				'<tr><td>'. $count++ .'</td>
				<td>'. $accountFlag . $row['account'] .'</td>
				<td><div class="flag '. $className .'"></div>'. $row['nation'] .'</td>
				<td>'. $row['teamWins'] .'-'. $row['teamLosses'] .'</td></tr>';
			}
		}
	} else if ($_POST['type'] === 'Trips'){
		$o->str = '<h2 class="text-center header">Historic Trips</h2>
		<table class="table tight">';
		$o->str .= '<tr>
				<th style="width: 100px">Rank</th>
				<th>Account</th>
				<th style="width: 100px">Trips</th>
			</tr>';
		
		$query = 'select account, get from fwgetsonly 
		where getMessage="Sick ass trips" 
		or getMessage="Holy trips" 
		or getMessage="Satanic trips" 
		order by row desc
		limit 300';
		$result = mysqli_query($link, $query);
		if ($result->num_rows){
			while ($row = mysqli_fetch_assoc($result)){
				$o->str .= 
				'<tr><td>'. $count++ .'</td>
				<td>'. $row['account'] .'</td>
				<td>'. $row['get'] .'</td></tr>';
			}
		}
	} else if ($_POST['type'] === 'Quads'){
		$o->str = '<h2 class="text-center header">Historic Quads</h2>
		<table class="table tight">';
		$o->str .= '<tr>
				<th style="width: 100px">Rank</th>
				<th>Account</th>
				<th style="width: 100px">Quads</th>
			</tr>';
		
		$query = 'select account, get from fwgetsonly 
		where getMessage="Sweet quads"
		order by row desc
		limit 300';
		$result = mysqli_query($link, $query);
		if ($result->num_rows){
			while ($row = mysqli_fetch_assoc($result)){
				$o->str .= 
				'<tr><td>'. $count++ .'</td>
				<td>'. $row['account'] .'</td>
				<td>'. $row['get'] .'</td></tr>';
			}
		}
	} else if ($_POST['type'] === 'Pents'){
		$o->str = '<h2 class="text-center header">Historic Pents</h2>
		<table class="table tight">';
		$o->str .= '<tr>
				<th style="width: 100px">Rank</th>
				<th>Account</th>
				<th style="width: 100px">Pents</th>
			</tr>';
		
		$query = 'select account, get from fwgetsonly 
		where getMessage="Glorious pents"
		order by row desc
		limit 300';
		$result = mysqli_query($link, $query);
		if ($result->num_rows){
			while ($row = mysqli_fetch_assoc($result)){
				$o->str .= 
				'<tr><td>'. $count++ .'</td>
				<td>'. $row['account'] .'</td>
				<td>'. $row['get'] .'</td></tr>';
			}
		}
	}
	$o->str .= '</table>';
	echo json_encode($o);