<?php
	require($_SERVER['DOCUMENT_ROOT'] . "/php/connect1.php");

	$stmt = $link->prepare('update accounts set timestamp=now() where account=?');
	$stmt->bind_param('s', $_SESSION['account']);
	$stmt->execute();
	/*
	require($_SERVER['DOCUMENT_ROOT'] . "/php/connect1.php");
	if (!$link) {
		echo 1337;
	}else if($_SESSION['email']==''){
		echo 1111;
	}else{
		$query = "select status from server_status";
		$stmt = mysqli_prepare($link, $query);
		mysqli_stmt_execute($stmt);
		mysqli_stmt_store_result($stmt);
		mysqli_stmt_bind_result($stmt, $db_status);
		if(mysqli_stmt_fetch($stmt)){
			$status = $db_status;
		}
		if($status=="down"){
			if($_SESSION['email']!='joemattleonard@gmail.com'){
				echo 2222;
				$_SESSION['email']=='';
			}
		}else{
			// update DB
			$my = $_POST['my'];
			$zone = $_POST['zone'];
			$query = "insert into ping (
				`email`,
				`account`,
				`name`,
				`ip_address`,
				`job`,
				`level`,
				`hardcoreMode`,
				`zone`
			) values (
				?, ?, ?, ?, ?, ?, ?, ?
			)";
			$stmt = $link->prepare($query);
			$stmt->bind_param('sssssiss', $_SESSION['email'], $_SESSION['account'], $my['name'], $_SERVER['REMOTE_ADDR'], $my['job'], $my['level'], $my['hardcoreMode'], $zone);
			$stmt->execute();
			// more than 2? 
			$query = "select account from ping where email=? and timestamp>date_sub(now(), interval 30 second)";
			$stmt = $link->prepare($query);
			$stmt->bind_param('s', $_SESSION['account']);
			$stmt->execute();
			$stmt->store_result();
			$count = $stmt->num_rows;
			if($count>=3){
				if($_SERVER["SERVER_NAME"] === "localhost"){
					$_SESSION['email'] = '';
					session_destroy();
				}else{
					echo 0;
				}
			}
			if($_SERVER["SERVER_NAME"] === "localhost"){
				echo 0;
			}else{
				echo $count;
			}
			
			$query = 'delete from ping where timestamp < date_sub(now(), interval 30 second)';
			$stmt = $link->prepare($query);
			$stmt->execute();
		}
	}
*/