<?php
if (!isset($db)) {
	$db = mysqli_connect('localhost', 'root', 'abc123', 'nevergrind', '3306');
	if (!$db) {
		die('Database connection failure: ');
	}
}
