<?php
	$charID = file_get_contents('characterID.txt');
	$charID++;
	print "$charID";
	file_put_contents('characterID.txt', $charID);
?>