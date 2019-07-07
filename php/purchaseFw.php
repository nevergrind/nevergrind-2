<?php
	header('Content-Type: application/json');
	require('connect1.php');
	require($_SERVER['DOCUMENT_ROOT'] . '/ng2/php/lib/Stripe.php');
	
	if ($_SESSION['fwpaid']){
		header('HTTP/1.1 500 You have already purchased Firmament Wars!');
		exit;
	} 
	
	$x = new stdClass();
	$x->error = '';
	
	$amount = 999;
	
	if($_SERVER["SERVER_NAME"] === "localhost"){
		$stripeKey = $_SESSION['STRIPE_TEST'];
	}else{
		$stripeKey = $_SESSION['STRIPE_LIVE'];
	}
	// validate POST data
	// create customer if necessary
	Stripe::setApiKey($stripeKey);
	if (isset($_POST['stripeToken']) && isset($_SESSION['email'])){
		$token = $_POST['stripeToken'];
		if(!isset($_SESSION['customerId'])){
			// Create a Customer
			$customer = Stripe_Customer::create(array(
				"card" => $token,
				"description" => $_SESSION['email']
			));
			$_SESSION['customerId'] = $customer->id;
		}
	} else {
		header('HTTP/1.1 500 The order cannot be processed. You have not been charged.');
		exit;
	}
	// charge card
	$x->error = '';
	try{
		// charge the customer, not the card
		$charge = Stripe_Charge::create(array(
			'amount' => $amount,
			'currency' => 'usd',
			'customer' => $_SESSION['customerId'],
			'description' => $_SESSION['email']
		));
	} catch (Stripe_ApiConnectionError $e) {
		// Network problem, perhaps try again.
		$x->error = "There appears to be a temporary network problem. Please try again later.";
	} catch (Stripe_InvalidRequestError $e) {
		// You screwed up in your programming. Shouldn't happen!
		$x->error = "There has been a server error. The administrator has been contacted to resolve this problem.";
	} catch (Stripe_ApiError $e) {
		// Stripe's servers are down!
		$x->error = "The payment processing servers are down. Please try again later.";
	} catch (Stripe_CardError $e) {
		// Card was declined.
		/*
		$e_json = $e->getJsonBody();
		$error = $e_json['error'];
		$x->error = "".$error['message'];
		*/
		$x->error = "Card was declined.";
	}
	
	if ($charge->paid){
		// insert purchase into db
		$stmt = $link->prepare("insert into fwpaid (`account`, `amount`) values (?, $amount)");
		$stmt->bind_param('s', $_SESSION['account']);
		$stmt->execute();
		$_SESSION['fwpaid'] = 1;
	} else {
		header('HTTP/1.1 500 Purchase failed to process! Please check your card and try again!');
		// send email
		require $_SERVER['DOCUMENT_ROOT'] . '/ng2/php/PHPMailer/PHPMailerAutoload.php';
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
		$mail->addAddress('joemattleonard@gmail.com');
		$mail->isHTML(true);
		$mail->Subject = 'Server Error';
		$mail->Body = $x->error;
		$mail->send();
	}
	echo json_encode($x);