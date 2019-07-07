<?php
require 'connect1.php';
require('lib/Stripe.php');
$amount = $_POST['amount']*1;
$oldcard = $_POST['oldcard'];

if ($_SERVER["SERVER_NAME"] === "localhost"){
	$stripeKey = $_SESSION['STRIPE_TEST'];
}
else{
	$stripeKey = $_SESSION['STRIPE_LIVE'];
}
// validate POST data
$validPost = "true";
if ($amount==100 ||
	$amount==500 ||
	$amount==1000){
}
else {
	header('HTTP/1.1 500 Invalid amount selected!');
	exit;
}

if ($oldcard=="true" ||
	$oldcard=="false"){
}
else {
	header('HTTP/1.1 500 Invalid data sent to server');
	exit;
}
// create customer if necessary
Stripe::setApiKey($stripeKey);
if (isset($_POST['stripeToken']) && isset($_SESSION['email'])){
	if ($oldcard == "false"){
		$token = $_POST['stripeToken'];
		if ($_SESSION['customerId'] == ''){
			// Create a Customer
			$customer = Stripe_Customer::create(array(
				"card" => $token,
				"description" => $_SESSION['email']
			));
			$_SESSION['customerId'] = $customer->id;
		}
	}
}
else {
	header('HTTP/1.1 500 The order cannot be processed. You have not been charged');
	exit;
}
//record last four if rememberMe
$rememberMe = $_POST['rememberMe'];
if ($rememberMe == "true"){
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

if ($errorMessage == ''){
	if ($charge->paid == true){
		// insert purchase into db
		$stmt = $link->prepare('insert into purchases (`email`, `amount`) VALUES (?, ?)');
		$stmt->bind_param('si', $_SESSION['email'], $amount);
		$stmt->execute();

		// new stuffs
		$email = $_SESSION['email'];
		$mode = $_SESSION['hardcoreMode'];
		// check crystal balance
		if ($mode == 'false'){
			$query = "select bankSlots from accounts where email=?";
		}
		else {
			$query = "select hcBankSlots from accounts where email=?";
		}
		$stmt = $link->prepare($query);
		$stmt->bind_param('s', $_SESSION['email']);
		$stmt->execute();
		$stmt->bind_result($dbSlots);
		$totalBankSlots = 0;
		while ($stmt->fetch()){
			$totalBankSlots = $dbSlots*1;
		}
		$startSlot = $totalBankSlots;
		$addingSlots = 10;
		if ($amount === 500) {
			$addingSlots = 90;
		}
		if ($amount === 1000) {
			$addingSlots = 270;
		}
		if ($totalBankSlots + $addingSlots > 1080){
			header('HTTP/1.1 500 You cannot make this purchase because it would exceed the maximum possible number of bank slots (1080)!');
			exit;
		}
		else {
			$totalBankSlots = $totalBankSlots + $addingSlots;
			echo $totalBankSlots; // displayed by client
			if ($mode=='false'){
				$query = "update accounts set bankSlots=$totalBankSlots where email=?";
			}
			else{
				$query = "update accounts set hcBankSlots=$totalBankSlots where email=?";
			}
			$stmt = $link->prepare($query);
			$stmt->bind_param('s', $email);
			$stmt->execute();


			require $_SERVER['DOCUMENT_ROOT'] . '/classic/php/itemJson.php';
			$noItem = json_encode(noItem());

			// create bank PAID FEATURE
			if ($mode=='false'){
				if ($amount === 100) {
					$query = "insert into item (`email`, `slotType`, `name`, `slot`, `json`, `hardcoreMode`) VALUES ";
					$stopSlot = $startSlot + $addingSlots;
					$values = [];
					for ($i=$startSlot; $i<$stopSlot; $i++) {
						$values[] = "(?, 'bank', '', $i, ?, 'false')";
					}
					$query .= join(',', $values);

					$stmt = $link->prepare($query);
					$stmt->bind_param('ssssssssssssssssssss',
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem
					);
					$stmt->execute();
				}
				else if ($amount === 500) {
					$query = "insert into item (`email`, `slotType`, `name`, `slot`, `json`, `hardcoreMode`) VALUES ";
					$stopSlot = $startSlot + $addingSlots;
					$values = [];
					for ($i=$startSlot; $i<$stopSlot; $i++) {
						$values[] = "(?, 'bank', '', $i, ?, 'false')";
					}
					$query .= join(',', $values);

					$stmt = $link->prepare($query);
					$stmt->bind_param('ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss',
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem
					);
					$stmt->execute();
				}
				else if ($amount === 1000) {
					$query = "insert into item (`email`, `slotType`, `name`, `slot`, `json`, `hardcoreMode`) VALUES ";
					$stopSlot = $startSlot + $addingSlots;
					$values = [];
					for ($i=$startSlot; $i<$stopSlot; $i++) {
						$values[] = "(?, 'bank', '', $i, ?, 'false')";
					}
					$query .= join(',', $values);

					$stmt = $link->prepare($query);
					$stmt->bind_param('ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss',
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem
					);
					$stmt->execute();
				}
			}
			else {
				// hardcore mode
				if ($amount === 100) {
					$query = "insert into item (`email`, `slotType`, `name`, `slot`, `json`, `hardcoreMode`) VALUES ";
					$stopSlot = $startSlot + $addingSlots;
					$values = [];
					for ($i=$startSlot; $i<$stopSlot; $i++) {
						$values[] = "(?, 'bank', '', $i, ?, 'true')";
					}
					$query .= join(',', $values);

					$stmt = $link->prepare($query);
					$stmt->bind_param('ssssssssssssssssssss',
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem
					);
					$stmt->execute();
				}
				else if ($amount === 500) {
					$query = "insert into item (`email`, `slotType`, `name`, `slot`, `json`, `hardcoreMode`) VALUES ";
					$stopSlot = $startSlot + $addingSlots;
					$values = [];
					for ($i=$startSlot; $i<$stopSlot; $i++) {
						$values[] = "(?, 'bank', '', $i, ?, 'true')";
					}
					$query .= join(',', $values);

					$stmt = $link->prepare($query);
					$stmt->bind_param('ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss',
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem
					);
					$stmt->execute();
				}
				else if ($amount === 1000) {
					$query = "insert into item (`email`, `slotType`, `name`, `slot`, `json`, `hardcoreMode`) VALUES ";
					$stopSlot = $startSlot + $addingSlots;
					$values = [];
					for ($i=$startSlot; $i<$stopSlot; $i++) {
						$values[] = "(?, 'bank', '', $i, ?, 'true')";
					}
					$query .= join(',', $values);

					$stmt = $link->prepare($query);
					$stmt->bind_param('ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss',
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem,
						$email, $noItem
					);
					$stmt->execute();
				}
			}
		}
	}
}
else {
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