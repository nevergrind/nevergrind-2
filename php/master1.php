<?php
	require_once('connect1.php');
	
	// generate random string
	function rand_str($length, $charset='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'){
		$str = '';
		$count = strlen($charset);
		while($length--){
			$str .= $charset[mt_rand(0, $count-1)];
		}
		return $str;
	}
	function createAccount(){
		global $link;
		
		$email = strtolower($_POST['email']);
		$account = strtolower($_POST['account']);
		$password = $_POST['password'];
		$promo = $_POST['promo'];
		
		//validate email address
		if(!filter_var($email, FILTER_VALIDATE_EMAIL)){
			echo "The server reported an error. Please use a valid email address.";
			exit;
		}
		// all alphabetic?
		if (!ctype_alnum(str_replace('_', '', $account))){
			echo "Please use only letters, numbers, and underscores in your account name.";
			exit;
		}
		// check account name isn't too long or short
		if(strlen($account)<2){
			echo "Your account name must be between 2-16 characters long.";
			exit;
		}
		if(strlen($account)>16){
			echo "Your account name must be between 2-16 characters long.";
			exit;
		}
		//check password length
		if(strlen($password)<6){
			echo "Your password must be six characters long";
			exit;
		}
		// check that email does not exist
		$query = "select email from accounts where email=?";
		$stmt = $link->prepare($query);
		$stmt->bind_param('s', $email);
		$stmt->execute();
		$stmt->store_result();
		$count = $stmt->num_rows;
		if($count>0){
			// email address exists
			echo "This email address has already registered an account!";
			exit;
		}
		// check that account does not exist
		$query = "select account from accounts where account=?";
		$stmt = $link->prepare($query);
		$stmt->bind_param('s', $account);
		$stmt->execute();
		$stmt->store_result();
		$count = $stmt->num_rows;
		if($count>0){
			// account exists
			echo "This account name is already taken!";
			exit;
		}
		$status = 'active';
		
		$hash = '';
		if(isset($_POST['password']) && !empty($_POST['password']) && is_string($_POST['password'])){
			$salt = rand_str(rand(100,200));
			// generate hashed password using random salt
			$hash = crypt($_POST['password'], '$2a$07$'.$salt.'$'); // blowfish
			$password = crypt($_POST['password'], $hash);
			//echo "Posted Password:".$_POST['password']."\nSALT: ".$salt."\nHASH: ".$hash."\nPASSWORD: ".$password;
		}
		// create account
		$crystals = 0;
		$kstier = 0;
		// promo codes
		$confirmCode = rand_str(rand(35, 45));
		// set all data in the DB
		$query = "insert into `accounts` (`email`, `account`, `password`, `salt`, `status`, `paid`, `created`, `crystals`, `totalCrystals`, `kstier`, `promo`, `confirmCode`) VALUES (?, ?, ?, ?, ?, 'false', now(), $crystals, $crystals, $kstier, ?, ?)";
		$stmt = $link->prepare($query);
		$stmt->bind_param('sssssss', $email, $account, $password, $salt, $status, $promo, $confirmCode);
		$stmt->execute();
		$_SESSION['email'] = $email;
		$_SESSION['account'] = $account;
		
		require 'initAccount.php';
		
		echo "Account Created!";
		// send confirmation email
		$msg1 = '<p>Hail, '. $account .'!</p><p>You have requested an account confirmation email. Here is your information:</p><div>Account: '. $account .'</div><div>Email: <a href="mailto:'. $email .'">'. $email .'</a></div>'.
		'<p>'.
			'<div>Neverworks Games offers the following games:</div>'.
			'<div><a href="https://nevergrind.com">Nevergrind - Single-Player RPG</a>.<div>'.
			'<div><a href="https://nevergrind.com/ng2-test-server">Nevergrind 2 - Multiplayer Cooperative Roguelike RPG - In Development (Coming to Steam in 2020!)</a>.<div>'.
			'<div><a href="https://store.steampowered.com/app/849790/Firmament_Wars">Firmament Wars - Multiplayer Strategy War Game</a> on Steam.<div>'.
		'</p>'.
		'<p><div>Discord Server:</div><div><a href="https://discord.gg/n2gp8rC">Neverworks Games Discord Server</a></div></p>'.
		'<p><div>Please confirm your email address to continue:</div><div><a href="https://nevergrind.com/confirmemail/index.php?email='. $email .'&code='. $confirmCode .'">https://nevergrind.com/confirmemail/index.php?email='. $email .'&code='. $confirmCode .'</a></div></p>'.
		'<p>Have a great day!</p>';
		$msg2 = 'Hail, '. $account .',\n\nYou have requested an account confirmation email. Here is your information:\n\nAccount: '. $account .'\nEmail: '. $email .'\n\nYou can access the site at https://nevergrind.com/\n\nDiscord Server:\n\nhttps://discord.gg/n2gp8rC\n\nPlease confirm your email address to continue:\n\nhttps://nevergrind.com/confirmemail/index.php?email='. $email .'&code='. $confirmCode .'\n\nHave a great day!';
		
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
	}
	
	function sendEmailConfirmation(){
		// send email to session email
		global $link;
		$email = $_SESSION['email'];
		$account = $_SESSION['account'];
		$confirmCode = rand_str(rand(35, 45));
		
		$query = 'update accounts set confirmCode=? where email=?';
		$stmt = $link->prepare($query);
		$stmt->bind_param('ss', $confirmCode, $email);
		$stmt->execute();
		
		$msg1 = '<p>Hail, '. $account .'!</p><p>You have requested an account confirmation email. Here is your information:</p><div>Account: '. $account .'</div><div>Email: <a href="mailto:'. $email .'">'. $email .'</a></div>'.
		'<p>'.
			'<div>Neverworks Games offers the following games:</div>'.
			'<div><a href="https://nevergrind.com">Nevergrind - Single-Player RPG</a>.<div>'.
			'<div><a href="https://nevergrind.com/ng2-test-server">Nevergrind 2 - Multiplayer Cooperative Roguelike RPG - In Development (Coming to Steam in 2020)</a>.<div>'.
			'<div><a href="https://store.steampowered.com/app/849790/Firmament_Wars">Firmament Wars - Multiplayer Strategy War Game</a> on Steam.<div>'.
		'</p>'.
		'<p><div>Discord Server:</div><div><a href="https://discord.gg/n2gp8rC">Neverworks Games Discord Server</a></div></p>'.
		'<div>Please confirm your email address to continue:</div><div><a href="https://nevergrind.com/confirmemail/index.php?email='. $email .'&code='. $confirmCode .'">https://nevergrind.com/confirmemail/index.php?email='. $email .'&code='. $confirmCode .'</a></div><p>Have a great day!</p>';

		$msg2 = 'Hail, '. $account .',\n\nYou have requested an account confirmation email. Here is your information:\n\nAccount: '. $account .'\nEmail: '. $email .'\n\nYou can access the site at https://nevergrind.com/\n\nDiscord Server:\n\nhttps://discord.gg/n2gp8rC\n\nPlease confirm your email address to continue:\n\nhttps://nevergrind.com/confirmemail/index.php?email='. $email .'&code='. $confirmCode .'\n\nHave a great day!';
		
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
		echo "Email sent!";
	}
	
	function authenticate(){
		global $link;
		if (!isset($_POST['password'])){
			//exit;
		}
		$email = $_POST['email'];
		$password = $_POST['password'];
		// non-SSO login
		$account = '';
		// Get account name to set it
		if (strpos($email, '@')){
			// email
			$query = "select account from accounts where email=?";
			$stmt = $link->prepare($query);
			$stmt->bind_param('s', $email);
			$stmt->execute();
			$stmt->store_result();
			$stmt->bind_result($data);
			while($stmt->fetch()){
				$account = $data;
			}
		}
		else {
			// account
			$query = "select email from accounts where account=?";
			$stmt = $link->prepare($query);
			$stmt->bind_param('s', $email);
			$stmt->execute();
			$stmt->store_result();
			$stmt->bind_result($data);
			while($stmt->fetch()){
				$email = $data;
			}
			$account = $_POST['email'];
		}

		$query = "select salt, password, status from accounts where email=? limit 1";
		if($stmt = $link->prepare($query)){
			$stmt->bind_param('s', $email);
			$stmt->execute();
			$stmt->store_result();
			$count = $stmt->num_rows;
			if($count==0){
				// nothing found
				echo "Login Not Successful.";
				exit;
			}
			$stmt->bind_result($stmtSalt, $stmtPassword, $stmtStatus);
			while($stmt->fetch()){
				$dbSalt = $stmtSalt;
				$dbPassword = $stmtPassword;
				$dbStatus = $stmtStatus;
			}
			$stmt->close();
		}else{
			header('HTTP/1.1 500 Login Failure');
			exit;
		}
		if($dbStatus=="suspended"){
			header('HTTP/1.1 500 Account has been suspended');
			exit;
		}
		if($dbStatus=="banned"){
			header('HTTP/1.1 500 Account has been banned');
			exit;
		}
		// check if account is locked
		$query = "select row from accountloginfailure where email=? and timestamp > date_sub(now(), interval 5 minute)";
		$stmt = $link->prepare($query);
		$stmt->bind_param('s', $email);
		$stmt->execute();
		$stmt->store_result();
		$count = $stmt->num_rows;
		if($count>4){
			header('HTTP/1.1 500 Your account is temporarily locked. Try again in 5 minutes');
			exit;
		}
		// compare database value to input - does it match?
		$hash = crypt($password, '$2a$07$'.$dbSalt.'$');
		$verify = crypt($password, $hash);

		if($dbPassword!=$verify){
			$errorMsg = 'Bad password! Please try again.';
			// login failure
			$query = "insert into accountloginfailure (`email`) VALUES (?)";
			$stmt = $link->prepare($query);
			$stmt->bind_param('s', $email);
			$stmt->execute();
			$count++;
			if($count==4){
				$errorMsg .= '<br>One more failure and your account will be temporarily locked!';
			}else if($count>4){
				$errorMsg .=  '<br>Your account has been temporarily locked. Try again in 5 minutes.';
			}
			header('HTTP/1.1 500 '. $errorMsg);
			exit;
		}
		// login success
		$_SESSION['email'] = $email;
		$_SESSION['account'] = $account;
		// continue
		$query = "insert into accountloginsuccess (`email`) VALUES (?)";
		$stmt = $link->prepare($query);
		$stmt->bind_param('s', $email);
		$stmt->execute();

		echo "Login successful!";
	}
	function logout(){
		global $link;
		$_SESSION = array();
		if (ini_get("session.use_cookies")) {
			$params = session_get_cookie_params();
			setcookie(session_name(), '', time() - 42000,
				$params["path"], $params["domain"],
				$params["secure"], $params["httponly"]
			);
		}
		session_destroy();
	}
	function submitCC(){
		global $link;
		$amount = $_POST['amount']*1;
		$oldcard = $_POST['oldcard'];
		require('lib/Stripe.php');
		
		if($_SERVER["SERVER_NAME"] === "localhost"){
			$stripeKey = $_SESSION['STRIPE_TEST'];
		}else{
			$stripeKey = $_SESSION['STRIPE_LIVE'];
		}
		// validate POST data
		$validPost = "true";
		if($amount==100 || $amount==500 || $amount==1000){
			echo "OK!";
		}else{
			exit;
		}
		if($oldcard=="true" || $oldcard=="false"){
			echo "OK!";
		}else{
			exit;
		}
		// create customer if necessary
		Stripe::setApiKey($stripeKey);
		if (isset($_POST['stripeToken']) && isset($_SESSION['email'])){
			if($oldcard=="false"){
				$token = $_POST['stripeToken'];
				if($_SESSION['customerId']==''){
					// Create a Customer
					$customer = Stripe_Customer::create(array(
						"card" => $token,
						"description" => $_SESSION['email']
					));
					$_SESSION['customerId'] = $customer->id;
				}
			}
		}else{
			echo 'The order cannot be processed. You have not been charged.';
			exit;
		}
		//record last four if rememberMe
		$rememberMe = $_POST['rememberMe'];
		if($rememberMe=="true"){
			$lastFour = $_POST['lastFour'];
			$query = "insert into lastfour (`email`, `digits`, `customerId`) values (?, ?, ?);";
			$stmt = $link->prepare($query);
			$stmt->bind_param('sss', $_SESSION['email'], $lastFour, $_SESSION['customerId']);
			$stmt->execute();
		}
		// charge card
		$errorMessage='';
		try{
			// charge the customer, not the card
			$charge = Stripe_Charge::create(array(
				'amount' => $amount,
				'currency' => 'usd',
				'customer' => $_SESSION['customerId'],
				'description' => $_SESSION['email']
			));
		}
		catch (Stripe_ApiConnectionError $e) {
			// Network problem, perhaps try again.
			$errorMessage = "There appears to be a temporary network problem. Please try again later.";
			echo $errorMessage;
		}
		catch (Stripe_InvalidRequestError $e) {
			// You screwed up in your programming. Shouldn't happen!
			$errorMessage = "There has been a server error. The administrator has been contacted to resolve this problem.";
			echo $errorMessage;
		}
		catch (Stripe_ApiError $e) {
			// Stripe's servers are down!
			$errorMessage = "The payment processing servers are down. Please try again later.";
			echo $errorMessage;
		}
		catch (Stripe_CardError $e) {
			// Card was declined.
			$e_json = $e->getJsonBody();
			$error = $e_json['error'];
			$errorMessage = "".$error['message'];
			echo $errorMessage;
		}
		if($errorMessage==''){
			if($charge->paid==true){
				// insert purchase into db
				$query = "insert into purchases (`email`, `amount`) VALUES (
				?, ?)";
				$stmt = $link->prepare($query);
				$stmt->bind_param('si', $_SESSION['email'], $amount);
				$stmt->execute();
				// increment two fields: total and current crystals	
				$query = "select crystals, totalCrystals from accounts where email='".$_SESSION['email']."'";
				if($stmt = mysqli_prepare($link, $query)){
					mysqli_stmt_execute($stmt);
					mysqli_stmt_store_result($stmt);
					mysqli_stmt_bind_result($stmt, $db1, $db2);
					if(mysqli_stmt_fetch($stmt)){
						$crystals = $db1;
						$totalCrystals = $db2;
					}
					$crystals+=$_POST['crystals'];
					$totalCrystals+=$_POST['crystals'];
					$stmt = $link->prepare("update accounts set  
						crystals=?, 
						totalCrystals=? 
						where email=?");
					$stmt->bind_param('iis', $crystals, $totalCrystals, $_SESSION['email']);
					$stmt->execute();
				}
			}
		}
		else{
			// errors
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
			$mail->addAddress('joemattleonard@gmail.com');
			$mail->Subject = 'Server Error';
			$mail->isHTML(true);
			$mail->Body = $errorMessage;
			$mail->send();
			header('HTTP/1.1 500 Please use only letters and numbers in your account name.');
		}
	}
	function forgotPassword(){
		global $link;
		$email = $_POST['email'];
		if(!filter_var($email, FILTER_VALIDATE_EMAIL)){
			echo "That is not a valid email address!";
			exit;
		}
		// check email exists at all
		$query = "select email, accountType from accounts where email=?";
		$stmt = $link->prepare($query);
		$stmt->bind_param("s", $email);
		$stmt->execute();
		$stmt->bind_result($dbEmail, $dbType);
		$stmt->store_result();
		if(!$stmt->num_rows){
			// email address exists
			echo "That email address does not exist!";
			exit;
		}
		$type = '';
		while($stmt->fetch()){
			$type = $dbType;
		}
		if ($type && $type === 'NW'){
			// user can reset!
		} else {
			echo "This email address authenticates using single sign on, not with a Neverworks account.";
			exit;
		}
		
		// 1-hour valid token check
		$query = "select email from resetpassword where email=? and timestamp>date_sub(now(), interval 1 hour)";
		$stmt = $link->prepare($query);
		$stmt->bind_param("s", $email);
		$stmt->execute();
		$stmt->store_result();
		if($stmt->num_rows>0){
			// email address exists
			echo "A token has already been emailed to you.";
			exit;
		}
		
		if($_SERVER["SERVER_NAME"] === "localhost"){
			$host="localhost";
			$email="joemattleonard@gmail.com";
		}else{
			$host="nevergrind.com";
		}
		
		$plainReset = rand_str(rand(35, 45));
		$hash = crypt($plainReset, '$2a$07$'.$_SESSION['salt'].'$'); // blowfish
		$dbReset = crypt($plainReset, $hash);
		
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
		$mail->addAddress($email); // $email
		$mail->Subject = 'Reset Your Password';
		$mail->isHTML(true);
		$mail->Body = "<style>p{color:#111;}</style><p>This password reset request originated from https://nevergrind.com. Please click the link below to reset your account's password:</p><p><a class='neverworksReset' href='https://".$host."/reset.php?reset=".$plainReset."'>Reset Your Password</a></p><p>Neverworks Games</p>";
		$mail->altBody = "This password reset request originated from https://nevergrind.com. Please click the link below to reset your account's password:\n\nhttps://".$host."/reset.php?reset=".$plainReset." \n\nNeverworks Games";
		$mail->send();
		
		// insert into database
		$query = "insert into resetpassword (`email`, `reset`) values (?, '$plainReset')";
		$stmt = $link->prepare($query);
		$stmt->bind_param('s', $email);
		$stmt->execute();
		
		$query = 'update accounts set hashedReset="'.$dbReset.'" where email=?';
		$stmt = $link->prepare($query);
		$stmt->bind_param('s', $email);
		$stmt->execute();
		echo "Please check your email. The link is valid for one hour.";
	}
	function resetPW(){
		global $link;
		$password = $_POST['password'];
		$verify = $_POST['verify'];
		//check password length
		if(strlen($password)<6){
			echo "The server reported an error. Please try again. Code: 11";
			exit;
		}
		if($password!=$verify){
			echo "The server reported an error. Please try again. Code: 12";
			exit;
		}
		$hash = '';
		if(isset($password) && !empty($password) && is_string($password)){
			$salt = rand_str(rand(100,200));
			$hash = crypt($password, '$2a$07$'.$salt.'$'); // blowfish
			$hashedPW = crypt($password, $hash);
			// set new password and salt
			$query = "update accounts set password='$hashedPW', salt='$salt' where email=?;";
			$stmt = $link->prepare($query);
			$stmt->bind_param('s', $_SESSION['tempEmail']);
			$stmt->execute();
			// delete token
			$query = "delete from resetpassword where email=?;";
			$stmt = $link->prepare($query);
			$stmt->bind_param('s', $_SESSION['tempEmail']);
			$stmt->execute();
			$_SESSION['email'] = $_SESSION['tempEmail'];
			unset($_SESSION['tempEmail']);
			echo "Password Reset Successful.";
		}
	}
	function checkCC(){
		global $link;
		$query = "select digits, customerId from lastfour where email=? order by timestamp desc limit 1";
		$stmt = $link->prepare($query);
		$stmt->bind_param('s', $_SESSION['email']);
		$stmt->execute();
		$stmt->store_result();
		if($stmt->num_rows>0){
			$stmt->bind_result($lastFour, $customerId);
			while($stmt->fetch()){
				$four = $lastFour;
				$_SESSION['customerId'] = $customerId;
			}
			echo $four;
		}else{
			echo "cardNotFound";
		}
	}
	function deleteCards(){
		global $link;
		$query = "delete from lastfour where email=?;";
		$stmt = $link->prepare($query);
		$stmt->bind_param('s', $_SESSION['email']);
		$stmt->execute();
		$_SESSION['customerId']='';
	}
	
	function checkSessionActive(){
		echo isset($_SESSION['email']) ? 1 : '';
	}
	if (isset($_POST['run'])) {
		call_user_func($_POST['run']);
	}
	else {
		exit("Function call not specified");
	}
?>