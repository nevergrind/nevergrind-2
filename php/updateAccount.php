<?php
	require('connect1.php');
	$settings = $_POST['settings'];
	
	$query = "update accounts set subscribed=? where email=?";
	$stmt = $link->prepare($query);
	$stmt->bind_param('is', $settings['subscribed'], $_SESSION['email']);
	$stmt->execute();
?>