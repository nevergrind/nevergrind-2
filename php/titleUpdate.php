<?php
	header('Content-Type: application/json');
	// connect1.php
	session_start();
	session_set_cookie_params(86400);
	ini_set('session.gc_maxlifetime', 86400);
	require('connect1.php');
	require('pingTitle.php');
	$x = new stdClass();
	$channel = $_SESSION['channel']; // possibly change channels later
	// get title players
	$query = 'select account, flag, rating from fwtitle where channel=? and timestamp > date_sub(now(), interval '. $_SESSION["long-lag"] .' second) order by row asc';
	$stmt = $link->prepare($query);
	$stmt->bind_param('s', $channel);
	$stmt->execute();
	$stmt->bind_result($account, $flag, $rating);
	
	$x = new stdClass();
	$count = 0;
	while($stmt->fetch()){
		$x->playerData[$count] = new stdClass();
		$x->playerData[$count]->account = $account;
		$x->playerData[$count]->rating = $rating;
		$x->playerData[$count++]->flag = $flag;
	}
	$x->account = $_SESSION['account'];
	// game data
	$query = 'select g.row row, 
		min(p.player) host, 
		count(p.game) players
		from fwgames g 
		join fwplayers p 
		on g.row=p.game 
		and p.timestamp > date_sub(now(), interval '. $_SESSION["long-lag"] .' second) 
		and p.startGame = 0 
		and g.password="" 
		group by p.game 
		having players > 0 
		and host=1';
	// game state sanity check
	$x->gameData = [];
	$result = mysqli_query($link, $query);
	$i = 0;
	if ($result->num_rows){
		while($row = mysqli_fetch_assoc($result)){
			$x->gameData[$i] = new stdClass();
			$x->gameData[$i++]->id = $row['row'];
		}
	}
	echo json_encode($x);