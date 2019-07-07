<?php
	require_once('connect1.php');
	require $_SERVER['DOCUMENT_ROOT'] . '/ng2/php/PHPMailer/PHPMailerAutoload.php';
	if (!isset($_SESSION['mailpw'])){
		echo "MAILPW NOT FOUND!";
		exit;
	}
	// send email
	$mail = new PHPMailer;
	$mail->isSMTP(); // Set mailer to use SMTP
	$mail->Host = 'smtp.gmail.com'; // Specify main and backup SMTP servers ;smtp2.example.com
	$mail->SMTPAuth = true; // Enable SMTP authentication
	$mail->Username = 'support@nevergrind.com'; // SMTP username
	$mail->Password = $_SESSION['mailpw']; // SMTP password
	$mail->SMTPSecure = 'tls'; // Enable TLS encryption, `ssl` also accepted
	$mail->Port = 587;  // TCP port to connect to 587 tls or 465 ssl
	$mail->From = 'support@nevergrind.com';
	$mail->FromName = 'Neverworks Games';
	
	$result = mysqli_query($link, "select email from accounts where emailNotified=0 and confirmed=1 limit 20");
	
	while ($row = mysqli_fetch_assoc($result)){
		$mail->addBCC($row["email"]);
		echo $row["email"] .'<br>';
		mysqli_query($link, 'update `accounts` set emailNotified=1 where email="'. $row['email'] .'"');
	}
	
	$mail->isHTML(true);
	$mail->Subject = 'Firmament Wars Kickstarter! HTML5 Multiplayer Realtime Strategy Game';
	$mail->AddEmbeddedImage('../images/neverworks_298x55_zealous.jpg', 'neverworks');
	
	$mail->Body = 
	'<div style="position: relative; left: 0; right: 0; margin: 0 auto; max-width: 640px; text-align: center; background: #f5f5f5; font-size: 1em">
		<div style="border: 2px ridge #b71616; background: #000">
			<img style="position: relative; left: 0; right: 0; margin: .5em auto" src="cid:neverworks" />
		</div>
		<h2 style="color: #000; padding: 0 1em">
			The Firmament Wars Kickstarter Campaign Has Launched!
		</h2>
		<p style="color: #666; font-size: 1.25em; font-weight: bold; padding: 0 1em">
			The developer of Nevergrind has been working on Firmament Wars, a Risk-like multiplayer realtime strategy game with free for all, team, and ranked modes! If you enjoyed strategy games like Risk, Civilization, or Starcraft, then definitely check out Firmament Wars!
		</p>
		<p style="font-size: 1.25em">
			<a style="text-decoration: none; font-weight: bold; padding: 10px 20px; color: #fff; background: #05b; display: inline-block; border-radius: 5px" href="https://www.kickstarter.com/projects/nevergrind/firmament-wars-multiplayer-realtime-grand-strategy">Back the project!</a>
		</p>
		<div style="color: #aaa; border: 2px ridge #b71616; background: #000; padding: .5em 1em">
			<div style="font-family: Tahoma, Calibri, sans-serif; font-size: 1em">
				<span style="color: #b71616;">NEVER</span><span style="color: #fff;">WORKS</span> Games
			</div>
			<div style="font-size: .75em">
				<div>
					<a href="//nevergrind.com">Nevergrind</a> | 
					<a href="//nevergrind.com/games/firmament-wars">Firmament Wars</a> | 
					<a href="//nevergrind.com/forums">Forums</a> | 
					<a href="//nevergrind.com/blog">Blog</a>
				</div>
				<div>Go to the <a href="//nevergrind.com/account">account management</a> page to unsubscribe.</div>
			</div>
		</div>
	</div>';
	
	$mail->altBody = 
	'The Firmament Wars kickstarter campaign</a> is live! Firmament Wars is a multiplayer realtime strategy game with free for all, team, and ranked modes of play! The goal is to raise $5,000 to improve the flag art and music in the game. If you enjoyed strategy games like Risk, Civilization, or Starcraft, then you might enjoy Firmament Wars!\n\n
	Kickstarter project: https://kickstarter.com/projects/nevergrind/1288184267?token=a3a5569b\n
	About Firmament Wars: https://nevergrind.com/blog/about-firmament-wars\n\n
	Unsubscribe: https://nevergrind.com/account';
	
	$mail->send();