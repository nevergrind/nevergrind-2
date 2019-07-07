<?php
	echo microtime(1);
	echo '<br>Test Results asdf:<br>';
	//if($_SERVER["SERVER_NAME"] === "localhost"){
	if (1){
		require('values.php');
		require('connect1.php');
		
		$f = new stdClass();
		$f->name = "abcdefghijklmnopqrstuvxyz";
		
		echo $f->name;
		
		
		exit;
	}
	