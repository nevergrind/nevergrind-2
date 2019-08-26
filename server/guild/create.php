<?php
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/header.php';

if ($_SESSION['guild']['name']) {
	exit('You are already in a guild!');
}
// standardize the name

// length is not too long
$name = $_POST['name'];
require 'filter-name.php';

$illegal = array("'", " ");
$nameCheck = str_replace($illegal, "", $name);
if (!ctype_alpha($nameCheck)){
	exit('This name contains illegal characters!');
}
// name is not taken
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/db.php';

// check if this guild name is taken
$stmt = $db->prepare('select name from `guilds` where name=?');
$stmt->bind_param('s', $name);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows) {
	exit("This guild name is already taken!");
}

// make sure I'm not in a guild
$stmt = $db->prepare('select row from `guild_members` where c_id=?');
$stmt->bind_param('s', $_SESSION['row']);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows) {
	exit("You are already in a guild!");
}
// add to `guilds`
$stmt = $db->prepare("insert into `guilds` (`name`) values (?)");
$stmt->bind_param('s', $name);
$stmt->execute();
$g_id = mysqli_insert_id($db);

// add to `guild_members`
$stmt = $db->prepare("insert into `guild_members` (rank, c_id, g_id) values (0, ?, ?)");
$stmt->bind_param('si', $_SESSION['row'], $g_id);
$stmt->execute();
// get guild id
$lastInsert = mysqli_insert_id($db);


// return to client
require 'get-guild-data.php';
echo json_encode($r);
