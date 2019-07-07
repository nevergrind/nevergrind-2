<?php
	// Set your secret key: remember to change this to your live secret key in production
	// See your keys here https://dashboard.stripe.com/account
	Stripe::setApiKey("sk_test_YLMUtYOaCNPSqBWP0IyPqT1w");

	// Get the credit card details submitted by the form
	$token = $_POST['stripeToken'];
	$email = $_POST['stripeEmail'];
	echo "Congratulations! You have purchased 750 Never Crystals.";
	echo "ID: ".$token;
	echo "EMAIL: ".$email;
	// Create the charge on Stripe's servers - this will charge the user's card
	try {
		$charge = Stripe_Charge::create(array(
		  "amount" => 2000, // amount in cents, again
		  "currency" => "usd",
		  "card" => $token,
		  "description" => "joemattleonard@gmail.com")
		);
	} catch(Stripe_CardError $e) {
	  // The card has been declined
	}
?>