<?php
	header('Content-Type: application/json');
	require('connect1.php');
	
if (isset($_SESSION['tempEmail'])){
	$resp = new stdClass();
	$account = strtolower($_POST['account']);
	
	// all alphanumeric?
	if (!ctype_alnum(str_replace('_', '', $account))){
		header('HTTP/1.1 500 Please use only letters and numbers in your account name.');
		exit;
	}
	// check account name isn't too long or short
	if(strlen($account)<2){
		header('HTTP/1.1 500 Your account name must be at least 2 characters.');
		exit;
	}
	if(strlen($account)>16){
		header('HTTP/1.1 500 Your account name cannot exceed 16 characters.');
		exit;
	}
	$query = "select account from accounts where account=?";
	$stmt = $link->prepare($query);
	$stmt->bind_param('s', $account);
	$stmt->execute();
	$stmt->store_result();
	$count = $stmt->num_rows;
	if($count>0){
		// account exists
		header('HTTP/1.1 500 This account name is already taken!');
		exit;
	}
	$email = $_SESSION['tempEmail'];
	
	$query = 'select count(row) from accounts where email=? and account IS NULL';
	$stmt = $link->prepare($query);
	$stmt->bind_param('s', $_SESSION['tempEmail']);
	$stmt->execute();
	$stmt->bind_result($dbcount);
	while($stmt->fetch()){
		$count = $dbcount;
	}
	if ($count){
		// found an email account with NULL value
		$stmt = $link->prepare("update accounts set  
			account=? 
			where email=?");
		$stmt->bind_param('ss', $account, $_SESSION['tempEmail']);
		$stmt->execute();
		
		$_SESSION['email'] = $_SESSION['tempEmail'];
		$_SESSION['account'] = $account;
		
		require 'initAccount.php';
		
		$email = $_SESSION['email'];
		// send confirmation email
		$msg1 = '<p>Hail, '. $account .'!</p><p>You have successfully registered for an account at Nevergrind. Here is your information:</p>'.
		'<div>Account: '. $account .'</div><div>Email: <a href="mailto:'. $email .'">'. $email .'</a></div>'.
		'<p>'.
			'<div>Neverworks Games offers the following games:</div>'.
			'<div><a href="https://nevergrind.com">Nevergrind - Single-Player RPG</a>.<div>'.
			'<div><a href="https://nevergrind.com/ng2-test-server">Nevergrind 2 - Multiplayer Cooperative Roguelike RPG - In Development (Coming to Steam in 2020!)</a>.<div>'.
			'<div><a href="https://store.steampowered.com/app/849790/Firmament_Wars">Firmament Wars - Multiplayer Strategy War Game</a> on Steam.<div>'.
		'</p>'.
		'<p><div>Discord Server:</div><div><a href="https://discord.gg/n2gp8rC">Neverworks Games Discord Server</a></div></p>'.
		'<p>Have a great day!</p>';
		$msg2 = 'Hail, '. $account .',\n\nYou have successfully registered for an account at Nevergrind. Here is your information:\n\nAccount: '. $account .'\nEmail: '. $email .'\n\nYou can access the site at https://nevergrind.com/\n\nDiscord Server:\n\nhttps://discord.gg/n2gp8rC\n\nHave a great day!';
		
		require $_SERVER['DOCUMENT_ROOT'] . '/ng2/php/values/mailpw.php';
		require 'PHPMailer/PHPMailerAutoload.php';
		$mail = new PHPMailer;
		$mail->isSMTP(); // Set mailer to use SMTP
		$mail->Host = 'smtp.gmail.com'; // Specify main and backup SMTP servers ;smtp2.example.com
		$mail->SMTPAuth = true; // Enable SMTP authentication
		$mail->Username = 'support@nevergrind.com'; // SMTP username
		$mail->Password = $mailpw; // SMTP password
		$mail->SMTPSecure = 'tls'; // Enable TLS encryption, `ssl` also accepted
		$mail->Port = 587;  // TCP port to connect to 587 tls or 465 ssl
		$mail->From = 'support@nevergrind.com';
		$mail->FromName = 'Neverworks Games';
		$mail->addAddress($email);
		$mail->Subject = 'Nevergrind Account Confirmation';
		$mail->isHTML(true);
		$mail->Body = $msg1;
		$mail->altBody = $msg2;
		$mail->send();
	} else {
		header('HTTP/1.1 500 Account data not found!');
		exit;
	}
	
	$resp->account = $account;
	
	echo json_encode($resp);
} else {
	header('HTTP/1.1 500 The server reported an error!');
}