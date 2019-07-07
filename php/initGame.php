<?php
	require_once('connect1.php');
	
	$query = "select game from fwPlayers where account=? and timestamp > date_sub(now(), interval {$_SESSION['lag']} second)";
	$stmt = $link->prepare($query);
	$stmt->bind_param('s', $_SESSION['account']);
	$stmt->execute();
	$stmt->store_result();
	$count = $stmt->num_rows;
	if ($count > 0){
		if (!isset($_SESSION['gameName'])){
			require('unsetSession.php');
		} else {
			$stmt->bind_result($gameId);
			while($stmt->fetch()){
				echo $gameId;
			}
		}
	} else {
		echo "";
	}
?>