<?php
if (!isset($db)) {
	$db = mysqli_connect('localhost', 'root', '2M@elsw6', 'nevergrind', '3306');
	if (!$db) { die('Database connection failure: '); }
}
