<?php
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/session/alive.php';
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/session/crypt.php';
require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/db.php';

// Update gold
if ($_POST['fromGold'] >= 0) {
	$stmt = $db->prepare('update `characters` set gold=? where row=?');
	$stmt->bind_param('ii', $_POST['fromGold'], $_SESSION['row']);
	$stmt->execute();
}
if ($_POST['toGold'] >= 0) {
	$stmt = $db->prepare('update `characters` set gold=? where row=?');
	$stmt->bind_param('ii', $_POST['toGold'], $_POST['toRow']);
	$stmt->execute();
}

// from items
if (isset($_POST['tradeFrom'])) {
	foreach ($_POST['tradeFrom'] as $item) {
		//error_log('$slot ' . print_r($item, true));
		$stmt = $db->prepare('update `items` set slot=?, owner_id=? where row=?');
		$stmt->bind_param('iii', $item['slot'], $_POST['toRow'], $item['row']);
		$stmt->execute();
	}
}

// to items
if (isset($_POST['tradeTo'])) {
	foreach ($_POST['tradeTo'] as $item) {
		//error_log('$slot ' . print_r($item, true));
		$stmt = $db->prepare('update `items` set slot=?, owner_id=? where row=?');
		$stmt->bind_param('iii', $item['slot'], $_SESSION['row'], $item['row']);
		$stmt->execute();
	}

}
