<?php
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/session/alive.php';
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/db.php';

// get owner id's account id
$account_id = 0;
$stmt = $db->prepare('select distinct i.owner_id, c.account 
	from `items` i
	join `characters` c 
	on i.owner_id=c.row 
	where i.account_id=?'
);
$stmt->bind_param('i', $account_id);
$stmt->execute();
$stmt->store_result();
$stmt->bind_result($character_id, $account);

while ($stmt->fetch()){
	echo '<div>Setting items with character id '. $character_id .' to account ' . $account . '<div>';
	// update item with account
	$stmt = $db->prepare('update `items` set account_id=? where owner_id=?');
	$stmt->bind_param('ii', $account, $character_id);
	$stmt->execute();
}


// 	$stmt = $db->prepare('update `items` set owner_id=?, slot=?, slot_type='. $type .' where row=?');