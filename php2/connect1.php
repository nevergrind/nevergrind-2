<?php
	if (session_status() === PHP_SESSION_NONE) {
		session_start();
		session_set_cookie_params(86400);
		ini_set('session.gc_maxlifetime', 86400);
	}
	if (!isset($link)){
		if($_SERVER["SERVER_NAME"] === "localhost"){
			$link = mysqli_connect('localhost:3306', 'root', '', 'nevergrind') or exit('Could not connect to the database!');
		} else {
			require $_SERVER['DOCUMENT_ROOT'] . '/php/values/dbpw.php';
			$link = mysqli_connect('localhost', 'nevergri_fw', $dbpw, 'nevergri_ngLocal') or exit('Could not connect to the database!');
		}
	}