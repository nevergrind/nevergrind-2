<?php
	session_start();
	if ($_SESSION['account'] === 'maelfyn' || $_SERVER["SERVER_NAME"] === "localhost"){
		require 'connect1.php';
		$stmt = $link->prepare("insert into fwpaid (`account`) values (?)");
		$stmt->bind_param('s', $_POST['message']);
		$stmt->execute();
		echo $_POST['message'] .' added successfully!';
	}