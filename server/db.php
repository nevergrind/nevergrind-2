<?php
if ($_SERVER["SERVER_NAME"] === "localhost") {
	$link = mysqli_connect("localhost:3306", "root", "", "nevergrind");
} else {
	$link = mysqli_connect("localhost", "nevergri_fw", 'Revelation2:9', "nevergri_ngLocal");
}
if (!$link) {
	exit('Could not connect to the database!');
}