<?php
// skills that don't start the same for everyone
function addStartingSkills(&$hero){
	$v = [
		'keys' => [
			'offense',
			'defense',
			'oneHandSlash',
			'oneHandBlunt',
			'twoHandSlash',
			'twoHandBlunt',
			'piercing',
			'archery',
			'handToHand',
			'dodge',
			'parry',
			'riposte',
			'dualWield',
			'doubleAttack',
			'alteration',
			'conjuration',
			'evocation'
		],
		'jobs' => [
							//	 O,D,1,1,2,2,P,A,H,D,P,R,D,D,A,C,E
			'Warrior' => 		[1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0],
			'Crusader' => 		[1,1,1,1,1,1,0,1,1,0,0,0,0,0,1,1,1],
			'Shadow Knight' => 	[1,1,1,1,1,1,0,1,1,0,0,0,0,0,1,1,1],
			'Monk' => 			[1,1,0,1,0,1,0,0,1,1,0,0,1,0,0,0,0],
			'Rogue' => 			[1,1,1,1,0,0,1,1,1,0,0,0,0,0,0,0,0],
			'Ranger' => 		[1,1,1,1,1,1,1,1,1,0,0,0,0,0,1,1,1],
			'Bard' => 			[1,1,1,1,0,0,1,1,1,0,0,0,0,0,1,1,1],
			'Cleric' => 		[1,1,0,1,0,1,0,0,1,0,0,0,0,0,1,1,1],
			'Druid' => 			[1,1,1,1,0,1,0,0,1,0,0,0,0,0,1,1,1],
			'Shaman' => 		[1,1,0,1,0,1,1,0,1,0,0,0,0,0,1,1,1],
			'Necromancer' => 	[1,1,0,1,0,1,1,0,1,0,0,0,0,0,1,1,1],
			'Enchanter' => 		[1,1,0,1,0,1,1,0,1,0,0,0,0,0,1,1,1],
			'Templar' => 		[1,1,0,1,0,1,1,0,1,0,0,0,0,0,1,1,1],
			'Wizard' => 		[1,1,0,1,0,1,1,0,1,0,0,0,0,0,1,1,1]
		]
	];
	$i = 0;
	foreach ($v['keys'] as $value){
		$hero[$value] = $v['jobs'][$hero['job']][$i++];
	}
}