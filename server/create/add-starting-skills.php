<?php
// skills that don't start the same for everyone
function addStartingSkills(&$hero){
	$v = [
		'keys' => [
			'oneHandSlash',
			'twoHandSlash',
			'twoHandBlunt',
			'piercing',
			'archery',
			'dodge',
			'dualWield',
			'alteration',
			'conjuration',
			'evocation'
		],
		'jobs' => [
			'Warrior' => 		[1,1,1,1,1,0,0,0,0,0],
			'Paladin' => 		[1,1,1,0,1,0,0,0,0,0],
			'Shadow Knight' => 	[1,1,1,0,1,0,0,0,0,0],
			'Monk' => 			[0,0,1,0,0,1,0,0,0,0],
			'Rogue' => 			[1,0,0,1,1,0,0,0,0,0],
			'Ranger' => 		[1,1,1,1,1,0,0,0,0,0],
			'Bard' => 			[1,0,0,1,1,0,0,0,0,0],
			'Cleric' => 		[0,0,1,0,0,0,0,1,1,1],
			'Druid' => 			[1,0,1,0,0,0,0,1,1,1],
			'Shaman' => 		[0,0,1,1,0,0,0,1,1,1],
			'Necromancer' => 	[0,0,1,1,0,0,0,1,1,1],
			'Enchanter' => 		[0,0,1,1,0,0,0,1,1,1],
			'Magician' => 		[0,0,1,1,0,0,0,1,1,1],
			'Wizard' => 		[0,0,1,1,0,0,0,1,1,1]
		]
	];
	$i = 0;
	foreach ($v['keys'] as $value){
		$hero[$value] = $v['jobs'][$hero['job']][$i++];
	}
}