<?php
if ($_SERVER["SERVER_NAME"] === "localhost"){
	require $_SERVER['DOCUMENT_ROOT'] . '/ng2/server/db.php';

	$name = "Cobalt Boots";
	$armor = 10;
	$itemLevel = 33;
	$yPos = 15;
	$getEquipJobs = 'plate';

	$xPos = 7;
	$equipSlots = 'feet';

	$query = "insert into ng2_loot (
			name, itemLevel, damage, delay, armor, hp, mp, str, sta, agi, dex, wis, intel, cha, bleed, poison, arcane,
			lightning, cold, fire, xPos, yPos, effect, rarityType, equipSlots, equipJobs, req ) VALUES (
			'$name',
			$itemLevel, "./*itemLevel*/"
			0, "./*damage*/"
			0, "./*delay*/"
			$armor, "./*armor*/"
			0,"./*hp*/"
			0, "./*mp*/"
			0, "./*str*/"
			0, "./*sta*/"
			0, "./*agi*/"
			0, "./*dex*/"
			0, "./*wis*/"
			0, "./*intel*/"
			0, "./*cha*/"
			0, "./*bleed*/"
			0, "./*poison*/"
			0, "./*arcane*/"
			0, "./*lightning*/"
			0, "./*fire*/"
			0, "./*cold*/"
			$xPos, "./*xPos*/"
			$yPos, "./*yPos*/"
			'', "./*effect*/"
			0,"./*rarityType*/"
			'$equipSlots', "./*equipSlots*/"
			'". $getEquipJobs ."',
			0 "./*req*/"
		)";
	mysqli_query($link, $query);
	echo 'Inserted '. $name .'! '. microtime(1);
}
