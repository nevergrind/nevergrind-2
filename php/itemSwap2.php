<?php
	require 'connect1.php';
	$name1 = $_POST['name1'];
	$name2 = $_POST['name2'];
	$data1 = $_POST['data1'];
	$data2 = $_POST['data2'];
	$itemDropType = $_POST['itemDropType'];
	$dropSlot = $_POST['dropSlot'];
	$itemDragType = $_POST['itemDragType'];
	$dragSlot = $_POST['dragSlot'];
	// drop the dragged item
	if($itemDragType==='bank'){
		$stmt = $link->prepare("update item set json=?,
			name=? 
			where email=? 
			and slotType='bank' 
			and slot=? 
			and hardcoreMode=?");
		$stmt->bind_param('sssis', $data1, $name1, $_SESSION['email'], $dragSlot, $_SESSION['hardcoreMode']);
	} else {
		$stmt = $link->prepare("update item set json=?, name=?
			where email=? 
			and characterName=? 
			and slotType=? 
			and slot=?");
		$stmt->bind_param('sssssi', $data1, $name1, $_SESSION['email'], $_POST['name'], $itemDragType, $dragSlot);
	}
	$stmt->execute();
	// drop the dropped item
	if($itemDropType==='bank'){
		$stmt = $link->prepare("update item set json=?,
			name=? 
			where email=? 
			and slotType='bank' 
			and slot=? 
			and hardcoreMode=?");
		$stmt->bind_param('sssis', 
			$data2,
			$name2,
			$_SESSION['email'], 
			$dropSlot, 
			$_SESSION['hardcoreMode']);
	}else{
		$stmt = $link->prepare("update item set json=?,
				name=? 
				where email=? 
				and characterName=? 
				and slotType=? 
				and slot=?");
		$stmt->bind_param('sssssi', 
			$data2,
			$name2, 
			$_SESSION['email'], 
			$_POST['name'], 
			$itemDropType, 
			$dropSlot);
	}
	$stmt->execute();
?>