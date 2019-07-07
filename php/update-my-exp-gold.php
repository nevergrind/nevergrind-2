<?php
require 'connect1.php';
// my character
$json = $_POST['json'];
$Slot = $_POST['Slot']*1;
$name = $_POST['name'];
$gold = $_POST['gold']*1;
$exp = $_POST['exp']*1;
$mobExp = $_POST['mobExp']*1;

$stmt = $link->prepare('update characters set 
	json=?,
	title=?,
	difficulty=?,
	level=?,
	zone=?,
	zoneH=?,
	zoneN=?, 
	subzone=?,
	subzoneN=?,
	subzoneH=?
	where email=? 
	and name=?');
$stmt->bind_param('ssiisssiiiss',
	$json,
	$_POST['title'],
	$_POST['difficulty'],
	$_POST['level'],
	$_POST['zone'],
	$_POST['zoneH'],
	$_POST['zoneN'],
	$_POST['subzone'],
	$_POST['subzoneN'],
	$_POST['subzoneH'],
	$_SESSION['email'],
	$_POST['name']);
$stmt->execute();

// exp gold
if ($exp > 103835784) {
	$exp = 103835784;
}
$exp = $exp + $mobExp;

$stmt = $link->prepare('update characters set exp=?, gold=? where name=?');
$stmt->bind_param('iis', $exp, $gold, $name);
$stmt->execute();
echo $mobExp;