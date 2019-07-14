<?php
if ($_SERVER['SERVER_NAME'] === 'localhost') {
	$link = mysqli_connect('localhost', 'root', '', 'nevergrind');
}
else {
	$link = mysqli_connect('localhost', 'root', 'ng2', 'nevergrind');
}
if (!$link) {
	die('Database connection failure: ' . mysqli_error($link));
}