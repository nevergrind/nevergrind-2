<?php

	// initialize GLB
	$query = "insert into glb (
		`email`, `chatMyHit`, `hideMenu`, `tooltipMode`, `videoSetting`, `showCombatLog`, `debugMode`
	) values (
		?, 'Off', 'Off', 'Long', 'High', 'On', 'Off'
	)";
	$stmt = $link->prepare($query);
	$stmt->bind_param('s', $email);
	$stmt->execute();
	/*
	// initialize 10 bank slots
	$query = "insert into item (
		`email`, `slotType`, `name`, `slot`, `flavorText`, `itemSlot`, `proc`, `type`, `hardcoreMode`
	) VALUES 
	(?, 'bank', '', 0, '', '', '', '', 'false'),
	(?, 'bank', '', 1, '', '', '', '', 'false'),
	(?, 'bank', '', 2, '', '', '', '', 'false'),
	(?, 'bank', '', 3, '', '', '', '', 'false'),
	(?, 'bank', '', 4, '', '', '', '', 'false'),
	(?, 'bank', '', 5, '', '', '', '', 'false'),
	(?, 'bank', '', 6, '', '', '', '', 'false'),
	(?, 'bank', '', 7, '', '', '', '', 'false'),
	(?, 'bank', '', 8, '', '', '', '', 'false'),
	(?, 'bank', '', 9, '', '', '', '', 'false')";
	$stmt = $link->prepare($query);
	$stmt->bind_param('ssssssssss', $email, $email, $email, $email, $email, $email, $email, $email, $email, $email);
	$stmt->execute();
	// hardcore mode
	$query = "insert into item (
		`email`, `slotType`, `name`, `slot`, `flavorText`, `itemSlot`, `proc`, `type`, `hardcoreMode`
	) VALUES 
	(?, 'bank', '', 0, '', '', '', '', 'true'),
	(?, 'bank', '', 1, '', '', '', '', 'true'),
	(?, 'bank', '', 2, '', '', '', '', 'true'),
	(?, 'bank', '', 3, '', '', '', '', 'true'),
	(?, 'bank', '', 4, '', '', '', '', 'true'),
	(?, 'bank', '', 5, '', '', '', '', 'true'),
	(?, 'bank', '', 6, '', '', '', '', 'true'),
	(?, 'bank', '', 7, '', '', '', '', 'true'),
	(?, 'bank', '', 8, '', '', '', '', 'true'),
	(?, 'bank', '', 9, '', '', '', '', 'true')";
	$stmt = $link->prepare($query);
	$stmt->bind_param('ssssssssss', $email, $email, $email, $email, $email, $email, $email, $email, $email, $email);
	$stmt->execute();
	*/