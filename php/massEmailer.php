<?php
	session_start();
	require 'PHPMailer/PHPMailerAutoload.php';
	session_set_cookie_params(86400);
	ini_set('session.gc_maxlifetime', 86400);
	require $_SERVER['DOCUMENT_ROOT'] . '/ng2/php/values/dbpw.php';
	$_SESSION['link'] = mysqli_connect("localhost", "nevergri_ng", $dbpw, "nevergri_ngLocal");
	function rand_str($length, $charset='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'){
		$str = '';
		$count = strlen($charset);
		while($length--){
			$str .= $charset[mt_rand(0, $count-1)];
		}
		return $str;
	}
	
	$query = "select email, account from accounts where confirmed=0 and emailNotified=0 order by row";
	$result = $_SESSION['link']->query($query);
	$str = '';
	$count = 0;
	while($row = $result->fetch_assoc()){
		if ($count < 10){
			$email = $row['email'];
			$account = $row['account'];
			$confirmCode = rand_str(rand(35, 45));
			$str .= "Sent email to: {$email}, account: {$account}, code: {$confirmCode}<br>";
			
			$query = 'update accounts set confirmCode=?, emailNotified=1 where email=?';
			$stmt = $_SESSION['link']->prepare($query);
			$stmt->bind_param('ss', $confirmCode, $email);
			$stmt->execute();
			
			$msg1 = "<p>Hail, $account!</p><p>This is a one-time email to notify you that accounts at Nevergrind can now be confirmed via email for 75 free Never Crystals. Here is your information:</p><div>Username: $account</div><div>Email: <a href='mailto:$email'>$email</a></div><p>You can access the site at <a href='https://nevergrind.com/'>https://nevergrind.com/</a>.</p><div>Please confirm your email address to continue:</div><div><a href='https://nevergrind.com/confirmemail/index.php?email=$email&code=$confirmCode'>https://nevergrind.com/confirmemail/index.php?email=$email&code=$confirmCode</a></div><p>Have a great day!</p>";
			$msg2 = "Hail, $account,\n\nThis is a one-time email to notify you that accounts at Nevergrind can now be confirmed via email for 75 free Never Crystals. Here is your information:\n\nUsername: $account\nEmail: $email\n\nYou can access the site at https://nevergrind.com/\n\nPlease confirm your email address to continue:\n\nhttps://nevergrind.com/confirmemail/index.php?email=$email&code=$confirmCode\n\nHave a great day!";
			
			require $_SERVER['DOCUMENT_ROOT'] . '/ng2/php/values/mailpw.php';
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
			$count++;
		}
	}
	echo $str;
?>