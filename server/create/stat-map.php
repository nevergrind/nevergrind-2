<?php
$statMap = [
	// job bonuses
	'jobs' => [
		'Bard' => [0,2,2,2,0,0,4],
		'Cleric' => [0,2,2,0,4,2,0],
		'Druid' => [0,2,2,0,4,2,0],
		'Enchanter' => [0,0,0,0,2,4,4],
		'Summoner' => [0,2,0,0,4,4,0],
		'Monk' => [4,2,2,2,0,0,0],
		'Necromancer' => [0,2,0,0,4,4,0],
		'Crusader' => [2,4,0,2,2,0,0],
		'Ranger' => [2,2,2,2,2,0,0],
		'Rogue' => [4,0,4,2,0,0,0],
		'Shadow Knight' => [4,2,0,2,0,2,0],
		'Shaman' => [0,2,2,0,4,2,0],
		'Warrior' => [4,4,0,2,0,0,0],
		'Wizard' => [0,2,0,0,4,4,0]
	],
	// race base values and possible classes
	'Barbarian' => [
		'attrs' => [22,20,17,14,14,11,10],
		'jobs' => [
			'Monk',
			'Rogue',
			'Shaman',
			'Warrior'
		]
	],
	'Dark Elf' => [
		'attrs' => [11,13,19,15,17,21,11],
		'jobs' => [
			'Cleric',
			'Enchanter',
			'Summoner',
			'Necromancer',
			'Ranger',
			'Rogue',
			'Shadow Knight',
			'Warrior',
			'Wizard'
		]
	],
	'Dwarf' => [
		'attrs' => [19,19,14,19,17,11,9],
		'jobs' => [
			'Cleric',
			'Crusader',
			'Rogue',
			'Warrior'
		]
	],
	'Seraph' => [
		'attrs' => [11,14,14,14,17,23,14],
		'jobs' => [
			'Cleric',
			'Enchanter',
			'Summoner',
			'Necromancer',
			'Crusader',
			'Shadow Knight',
			'Wizard'
		]
	],
	'Gnome' => [
		'attrs' => [11,14,18,18,13,21,11],
		'jobs' => [
			'Cleric',
			'Enchanter',
			'Summoner',
			'Necromancer',
			'Rogue',
			'Shadow Knight',
			'Warrior',
			'Wizard'
		]
	],
	'Half Elf' => [
		'attrs' => [14,14,19,18,11,15,15],
		'jobs' => [
			'Bard',
			'Druid',
			'Monk',
			'Crusader',
			'Ranger',
			'Rogue',
			'Warrior'
		]
	],
	'Halfling' => [
		'attrs' => [14,15,20,19,16,9,9],
		'jobs' => [
			'Cleric',
			'Druid',
			'Monk',
			'Ranger',
			'Rogue',
			'Warrior'
		]
	],
	'High Elf' => [
		'attrs' => [10,13,18,14,20,19,16],
		'jobs' => [
			'Cleric',
			'Enchanter',
			'Summoner',
			'Crusader',
			'Wizard'
		]
	],
	'Human' => [
		'attrs' => [15,15,15,15,15,15,15],
		'jobs' => [
			'Bard',
			'Cleric',
			'Druid',
			'Enchanter',
			'Summoner',
			'Monk',
			'Necromancer',
			'Crusader',
			'Ranger',
			'Rogue',
			'Shadow Knight',
			'Shaman',
			'Warrior',
			'Wizard'
		]
	],
	'Orc' => [
		'attrs' => [27,22,13,14,13,11,8],
		'jobs' => [
			'Monk',
			'Shadow Knight',
			'Shaman',
			'Warrior'
		]
	],
	'Troll' => [
		'attrs' => [22,24,18,15,11,9,6],
		'jobs' => [
			'Rogue',
			'Shadow Knight',
			'Shaman',
			'Warrior'
		]
	],
	'Wood Elf' => [
		'attrs' => [13,13,20,16,15,15,15],
		'jobs' => [
			'Bard',
			'Druid',
			'Ranger',
			'Rogue',
			'Warrior'
		]
	]
];