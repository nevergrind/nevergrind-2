<?php
	require($_SERVER['DOCUMENT_ROOT'] . "/php/connect1.php");
	$ID = (int) $_POST['ID']; // row, id, kills, name, race, job, level, ban
	$name = (string) $_POST['name'];
	$race = (string) $_POST['race'];
	$job = (string) $_POST['job'];
	$level = (int) $_POST['level'];
	$exp = (int) $_POST['experience'];
	$deaths = (int) $_POST['deaths'];
	if($level>99){ $level=99; }
	
	$query = "SELECT id,ban,deaths FROM hckills WHERE id='$ID'";
	if($stmt = mysqli_prepare($con, $query)){
		mysqli_stmt_execute($stmt);
		mysqli_stmt_store_result($stmt);
		mysqli_stmt_bind_result($stmt, $dID, $dBan, $dead);
		if(mysqli_stmt_fetch($stmt)){
			$dbID = $dID;
			$dbBan = $dBan;
			$dbDead = (int) $dead;
		}
		$rowCount = mysqli_stmt_num_rows($stmt);
		mysqli_stmt_close($stmt);
	}
	if($dbDead==0){ //still alive?
		if($rowCount===1&&$dbBan==0){ // found record - add 1
			if($dID==$ID){
				$stmt = $con->prepare("UPDATE hckills SET 
					kills=?, 
					name=?, 
					level=?,
					deaths=?
					WHERE id=?");
				$stmt->bind_param('isiii', $exp, $name, $level, $deaths, $ID);
				$stmt->execute();
				mysqli_stmt_close($stmt);
				echo "UPDATE";
			}
		}else if($rowCount===0){ // no record - insert starting at 1
			$stmt = $con->prepare("INSERT INTO hckills (
				`id`,
				`kills`,
				`name`,
				`race`,
				`job`, 
				`level`, 
				`deaths`
			) VALUES (?, ?, ?, ?, ?, ?, ?)");
			$stmt->bind_param('iisssii', $ID, $exp, $name, $race, $job, $level, $deaths);
			$stmt->execute();
			mysqli_stmt_close($stmt);
			echo "INSERT";
		}else{
			mysqli_stmt_close($stmt);
		}
	}
	
	mysqli_close($con);
?>