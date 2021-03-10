
var zones = [{},
	{
		name: 'Salubrin Haven',
		level: 1,
		maxLevel: 8,
		id: 1,
		isOpen: 0,
		missions: [1,2],
		mobs: mob.data['Salubrin Haven'].reduce(mob.getMobTypesByZone, [])
	},
	{
		name: 'Tendolin Passage',
		level: 1,
		maxLevel: 8,
		id: 2,
		isOpen: 0,
		missions: [1,2,3,4,5],
		mobs: mob.data['Tendolin Passage'].reduce(mob.getMobTypesByZone, [])
	},
	{
		name: 'Greenthorn Cavern',
		level: 5,
		maxLevel: 20,
		id: 3,
		isOpen: 0,
		missions: [1,2,3,4,5],
		mobs: mob.data['Greenthorn Cavern'].reduce(mob.getMobTypesByZone, [])
	},
	{
		name: 'Lanfeld Refuge',
		level: 5,
		maxLevel: 20,
		id: 4,
		isOpen: 0,
		missions: [1,2,3,4,5],
		mobs: mob.data['Lanfeld Refuge'].reduce(mob.getMobTypesByZone, [])
	},
	{
		name: 'Riven Grotto',
		level: 5,
		maxLevel: 20,
		id: 5,
		isOpen: 0,
		missions: [1,2,3,4,5],
		mobs: mob.data['Riven Grotto'].reduce(mob.getMobTypesByZone, [])
	},
	{
		name: "Bastille Citadel",
		level: 8,
		maxLevel: 20,
		id: 6,
		isOpen: 0,
		missions: [1,2,3,4,5],
		mobs: mob.data["Bastille Citadel"].reduce(mob.getMobTypesByZone, [])
	},
	{
		name: 'Kordata Cove',
		level: 12,
		maxLevel: 25,
		id: 7,
		isOpen: 0,
		missions: [1,2,3,4,5],
		mobs: mob.data['Kordata Cove'].reduce(mob.getMobTypesByZone, [])
	},
	{
		name: 'Sylong Sanctuary',
		level: 16,
		maxLevel: 30,
		id: 8,
		isOpen: 0,
		missions: [1,2,3,4,5],
		mobs: mob.data['Sylong Sanctuary'].reduce(mob.getMobTypesByZone, [])
	},
	{
		name: "Thule Crypt",
		level: 20,
		maxLevel: 35,
		id: 9,
		isOpen: 0,
		missions: [1,2,3,4,5],
		mobs: mob.data["Thule Crypt"].reduce(mob.getMobTypesByZone, [])
	},
	{
		name: 'Temple of Prenssor',
		level: 24,
		maxLevel: 40,
		id: 10,
		isOpen: 0,
		missions: [1,2,3,4,5],
		mobs: mob.data['Temple of Prenssor'].reduce(mob.getMobTypesByZone, [])
	},
	{
		name: 'Fahlnir Citadel',
		level: 28,
		maxLevel: 45,
		id: 11,
		isOpen: 0,
		missions: [1,2,3,4,5],
		mobs: mob.data['Fahlnir Citadel'].reduce(mob.getMobTypesByZone, [])
	},
	{
		name: 'Anuran Ruins',
		level: 32,
		maxLevel: 50,
		id: 12,
		isOpen: 0,
		missions: [1,2,3,4,5],
		mobs: mob.data['Anuran Ruins'].reduce(mob.getMobTypesByZone, [])
	},
	{
		name: 'Galeblast Fortress',
		level: 35,
		maxLevel: 50,
		id: 13,
		isOpen: 0,
		missions: [1,2,3,4,5],
		mobs: mob.data['Galeblast Fortress'].reduce(mob.getMobTypesByZone, [])
	},
	{
		name: 'Ashenflow Peak',
		level: 35,
		maxLevel: 50,
		id: 14,
		isOpen: 0,
		missions: [1,2,3,4,5],
		mobs: mob.data['Ashenflow Peak'].reduce(mob.getMobTypesByZone, [])
	},
];