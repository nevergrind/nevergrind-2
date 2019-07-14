<?php
$link = $_SERVER['SERVER_NAME'] === 'localhost' ?
	mysqli_connect('localhost:3306', 'root', '', 'nevergrind') :
	mysqli_connect('localhost', 'ng2', 'ng2', 'nevergrind');
if (!$link) {
	die('Database connection failure: ');
}