<?php
	global $link;
	$email = $_POST['email'];
	$account = '';
	$password = isset($_POST['password']) ? $_POST['password'] : '';
	$token = isset($_POST['token']) ? $_POST['token'] : '';
	// is server up?
	$query = "select status from server_status order by row desc limit 1";
	$stmt = mysqli_prepare($link, $query);
	mysqli_stmt_execute($stmt);
	mysqli_stmt_store_result($stmt);
	mysqli_stmt_bind_result($stmt, $db_status);
	if(mysqli_stmt_fetch($stmt)){
		$status = $db_status;
	}
	if($email==='joemattleonard@gmail.com' || $email==='maelfyn'){
	} else {
		if($status=="down"){
			echo "The server is down for maintenance. Please try again later.";
			exit;
		}
	}
	// Get account name to set it
	if (strpos($email, '@')){
		// get account using email
		$query = "select account from accounts where email=?";
		$stmt = $link->prepare($query);
		$stmt->bind_param('s', $email);
		$stmt->execute();
		$stmt->store_result();
		$stmt->bind_result($dbAccount);
		while($stmt->fetch()){
			$account = $dbAccount;
		}
	} else {
		// get email using account
		$query = "select email from accounts where account=?";
		$stmt = $link->prepare($query);
		$stmt->bind_param('s', $email);
		$stmt->execute();
		$stmt->store_result();
		$stmt->bind_result($dbEmail);
		while($stmt->fetch()){
			$account = $email;
			$email = $dbEmail;
		}
	}