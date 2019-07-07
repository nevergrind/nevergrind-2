<?php
	require($_SERVER['DOCUMENT_ROOT'] . "/php/connect1.php");
	$ID = $_POST['ID'];
	$name = $_POST['name'];
	$race = $_POST['race'];
	$job = $_POST['job'];
	$level = $_POST['level'];
	$exp = $_POST['experience'];
	if($level>99){ $level=99; }
	$query = "SELECT id,ban FROM kills WHERE id='$ID'";
	if($stmt = mysqli_prepare($con, $query)){
		mysqli_stmt_execute($stmt);
		mysqli_stmt_store_result($stmt);
		mysqli_stmt_bind_result($stmt, $dID, $dBan);
		if(mysqli_stmt_fetch($stmt)){
			$dbID = $dID;
			$dbBan = $dBan;
		}
		$rowCount = mysqli_stmt_num_rows($stmt);
		mysqli_stmt_close($stmt);
	}
	echo $rowCount." ".$dbID." ".$dbBan;
	if($rowCount===1&&$dbBan==0){ // found record - add 1
		//echo "Found";
		if($dID==$ID){
			$stmt = $con->prepare("UPDATE kills SET 
				kills=?, 
				name=?, 
				level=? 
				WHERE id=?");
			$stmt->bind_param('isii', $exp, $name, $level, $ID);
			$stmt->execute();
			mysqli_stmt_close($stmt);
			echo "UPDATE";
		}
	}else if($rowCount===0){ // no record - insert starting at 1
		$stmt = $con->prepare("INSERT INTO kills (
			`id`,
			`kills`,
			`name`,
			`race`,
			`job`, 
			`level`
		) VALUES (?, ?, ?, ?, ?, ?)");
		$stmt->bind_param('iisssi', $ID, $exp, $name, $race, $job, $level);
		$stmt->execute();
		mysqli_stmt_close($stmt);
		echo "INSERT";
	}else{
		mysqli_stmt_close($stmt);
	}
	
	mysqli_close($con);
?>