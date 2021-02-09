
var zones = [{},
	{
		name: 'Salubrin Den',
		level: 1,
		maxLevel: 8,
		id: 1,
		isOpen: 0,
		missions: [1,2],
		mobs: mob.data['Salubrin Den'].reduce(mob.getMobTypesByZone, [])
	},
	{
		name: 'Tendolin Hollow',
		level: 1,
		maxLevel: 8,
		id: 2,
		isOpen: 0,
		missions: [1,2,3,4,5],
		mobs: mob.data['Tendolin Hollow'].reduce(mob.getMobTypesByZone, [])
		/*mobs: [
			'rat',
			'snake',
			'beetle',
			'lioness',
			'rhino',
		]*/
	},
	{
		name: 'Greenthorn Cavern',
		level: 5,
		maxLevel: 20,
		id: 3,
		isOpen: 0,
		missions: [1,2,3,4,5],
		mobs: mob.data['Greenthorn Cavern'].reduce(mob.getMobTypesByZone, [])
		/*mobs: [
			'hobgoblin',
			'bear',
			'crocodile',
			'scorpion',
		]*/
	},
	{
		name: 'Lanfeld Refuge',
		level: 5,
		maxLevel: 20,
		id: 4,
		isOpen: 0,
		missions: [1,2,3,4,5],
		mobs: mob.data['Lanfeld Refuge'].reduce(mob.getMobTypesByZone, [])
		/*mobs: [
			'orc',
			'rat',
			'wolf',
			'scorpion',
		]*/
	},
	{
		name: 'Riven Grotto',
		level: 5,
		maxLevel: 20,
		id: 5,
		isOpen: 0,
		missions: [1,2,3,4,5],
		mobs: mob.data['Riven Grotto'].reduce(mob.getMobTypesByZone, [])
		/*mobs: [
			'ghoul',
			'mummy',
			'skeleton',
			'evil eye',
			'zombie',
		]*/
	},
	{
		name: "Babel's Bastille",
		level: 8,
		maxLevel: 20,
		id: 6,
		isOpen: 0,
		missions: [1,2,3,4,5],
		mobs: mob.data["Babel's Bastille"].reduce(mob.getMobTypesByZone, [])
		/*mobs: [
			'goblin',
			'hobgoblin',
			'evil eye',
			'iron golem',
		]*/
	},
	{
		name: 'Kordata Cove',
		level: 12,
		maxLevel: 25,
		id: 7,
		isOpen: 0,
		missions: [1,2,3,4,5],
		mobs: mob.data['Kordata Cove'].reduce(mob.getMobTypesByZone, [])
		/*mobs: [
			'angler',
			'fungoid',
			'treant',
			'stone golem',
		]*/
	},
	{
		name: 'Sylong Mausoleum',
		level: 16,
		maxLevel: 30,
		id: 8,
		isOpen: 0,
		missions: [1,2,3,4,5],
		mobs: mob.data['Sylong Mausoleum'].reduce(mob.getMobTypesByZone, [])
		/*mobs: [
			'minotaur',
			'centaur',
			'aviak',
			'griffon',
			'harpy',
			'skeleton',
			'unicorn',
		]*/
	},
	{
		name: "Arcturin's Crypt",
		level: 20,
		maxLevel: 35,
		id: 9,
		isOpen: 0,
		missions: [1,2,3,4,5],
		mobs: mob.data["Arcturin's Crypt"].reduce(mob.getMobTypesByZone, [])
		/*mobs: [
			'skeleton',
			'ghoul',
			'mummy',
			'spectre',
			'fungoid',
		]*/
	},
	{
		name: 'Temple of Prenssor',
		level: 24,
		maxLevel: 40,
		id: 10,
		isOpen: 0,
		missions: [1,2,3,4,5],
		mobs: mob.data['Temple of Prenssor'].reduce(mob.getMobTypesByZone, [])
		/*mobs: [
			'lizardman',
			'dragonkin',
			'crocodile',
			'stone golem',
			'iron golem',
			'griffon',
			MOB_TYPE.GIANT,
		]*/
	},
	{
		name: 'Fahlnir Citadel',
		level: 28,
		maxLevel: 45,
		id: 11,
		isOpen: 0,
		missions: [1,2,3,4,5],
		mobs: mob.data['Fahlnir Citadel'].reduce(mob.getMobTypesByZone, [])
		/*mobs: [
			'vampire',
			'gargoyle',
			'werewolf',
			'ghoul',
			MOB_TYPE.GIANT,
			'zombie',
		]*/
	},
	{
		name: 'Anuran Ruins',
		level: 32,
		maxLevel: 50,
		id: 12,
		isOpen: 0,
		missions: [1,2,3,4,5],
		mobs: mob.data['Anuran Ruins'].reduce(mob.getMobTypesByZone, [])
		/*mobs: [
			'toadlok',
			'minotaur',
			'aviak',
			'fungoid',
			'spider',
			'skeleton',
		]*/
	},
	{
		name: 'Galeblast Fortress',
		level: 35,
		maxLevel: 50,
		id: 13,
		isOpen: 0,
		missions: [1,2,3,4,5],
		mobs: mob.data['Galeblast Fortress'].reduce(mob.getMobTypesByZone, [])
		/*mobs: [
			'ice goblin',
			'polar bear',
			'ice wolf',
			'ice golem',
			'ice giant',
			'ice dragon',
		]*/
	},
	{
		name: 'Ashenflow Peak',
		level: 35,
		maxLevel: 50,
		id: 14,
		isOpen: 0,
		missions: [1,2,3,4,5],
		mobs: mob.data['Ashenflow Peak'].reduce(mob.getMobTypesByZone, [])
		/*mobs: [
			'kobold',
			'imp',
			'balrog',
			'cerberus',
			'fire giant',
			'dragon',
		]*/
	},
];