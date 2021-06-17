// toadlok ranks:
/*
urg 5-9
gluk 10-13
bog 14-17
rib 18-21
viz 22-25
gish 28-31
phin 32-35
gur 36-39
kel 40-43
thul 44-47
zog 48-51



 */
mob.data = {}
mob.data[ZONES.salubrinHaven] =
[
	{
		img: MOB_IMAGES.orc,
		name: 'orc pawn',
		minLevel: 1,
		maxLevel: 2,
		size: .65,
		job: JOB.WARRIOR,
	},
	{
		img: MOB_IMAGES.orc,
		name: 'orc trainee',
		minLevel: 2,
		maxLevel: 3,
		size: .7,
		job: JOB.WARRIOR,
	},
	{
		img: MOB_IMAGES.orc,
		name: 'orc initiate',
		minLevel: 3,
		maxLevel: 4,
		size: .8,
		job: JOB.WARRIOR,
	},
	{
		img: MOB_IMAGES.orc,
		name: 'orc trainer',
		minLevel: 5,
		maxLevel: 6,
		size: .75,
		job: JOB.WARRIOR,
	},
	{
		img: MOB_IMAGES.orc,
		name: 'orc shaman',
		minLevel: 3,
		maxLevel: 5,
		size: .75,
		job: JOB.SHAMAN,
	},
	{
		img: MOB_IMAGES.orc,
		name: 'orc centurion',
		minLevel: 3,
		maxLevel: 5,
		size: .8,
		job: JOB.WARRIOR,
	},
	{
		img: MOB_IMAGES.orc,
		name: 'orc legionnaire',
		minLevel: 6,
		maxLevel: 7,
		size: .9,
		job: JOB.WARRIOR,
	},
	{
		img: MOB_IMAGES.orc,
		name: 'orc shaman elder',
		minLevel: 6,
		maxLevel: 8,
		size: .8,
		job: JOB.SHAMAN,
	},
	{
		img: MOB_IMAGES.orc,
		name: 'orc shaman elder',
		minLevel: 6,
		maxLevel: 8,
		size: .8,
		job: JOB.SHAMAN,
	},
	{
		img: MOB_IMAGES.snake,
		name: 'snake',
		minLevel: 1,
		maxLevel: 2,
		size: .7,
		job: JOB.WARRIOR,
	},
	{
		img: MOB_IMAGES.snake,
		name: 'large snake',
		minLevel: 3,
		maxLevel: 4,
		size: .8,
		job: JOB.WARRIOR,
	},
	{
		img: MOB_IMAGES.snake,
		name: 'giant snake',
		minLevel: 5,
		maxLevel: 7,
		size: .9,
		job: JOB.WARRIOR,
	},
	{
		img: MOB_IMAGES.spider,
		name: 'cave spiderling',
		minLevel: 1,
		maxLevel: 2,
		size: .3,
		job: JOB.WARRIOR,
	},
	{
		img: MOB_IMAGES.spider,
		name: 'cave spider',
		minLevel: 3,
		maxLevel: 5,
		size: .5,
		job: JOB.WARRIOR,
	},
	{
		img: MOB_IMAGES.spider,
		name: 'giant cave spider',
		minLevel: 6,
		maxLevel: 8,
		size: .65,
		job: JOB.WARRIOR,
	},
	{
		img: MOB_IMAGES.wolf,
		name: 'wolf pup',
		minLevel: 1,
		maxLevel: 2,
		size: .65,
		job: JOB.WARRIOR,
	},
	{
		img: MOB_IMAGES.wolf,
		name: 'young wolf',
		minLevel: 3,
		maxLevel: 4,
		size: .8,
		job: JOB.WARRIOR,
	},
	{
		img: MOB_IMAGES.wolf,
		name: 'cave wolf',
		minLevel: 5,
		maxLevel: 7,
		size: .9,
		job: JOB.WARRIOR,
	},
	{
		img: MOB_IMAGES.scorpion,
		name: 'small scorpion',
		minLevel: 1,
		maxLevel: 2,
		size: .4,
		job: JOB.WARRIOR,
	},
	{
		img: MOB_IMAGES.scorpion,
		name: 'scorpion',
		minLevel: 3,
		maxLevel: 5,
		size: .6,
		job: JOB.WARRIOR,
	},
	{
		img: MOB_IMAGES.scorpion,
		name: 'large scorpion',
		minLevel: 6,
		maxLevel: 8,
		size: .8,
		job: JOB.WARRIOR,
	},
	// uniques
	{
		img: MOB_IMAGES.orc,
		name: 'Peon Snuffy',
		minLevel: 3,
		maxLevel: 3,
		size: .5,
		job: JOB.WARRIOR,
		tier: MOB_TIERS.unique,
		traits: { dauntless: true },
	},
	{
		img: MOB_IMAGES.snake,
		name: 'Slitherfang',
		minLevel: 4,
		maxLevel: 4,
		size: .8,
		job: JOB.ROGUE,
		tier: MOB_TIERS.unique,
		traits: { poisonEnchanted: true },
	},
	{
		img: MOB_IMAGES.spider,
		name: 'Twitchmaw',
		minLevel: 5,
		maxLevel: 5,
		size: .4,
		job: JOB.WARRIOR,
		tier: MOB_TIERS.unique,
		traits: { frenzied: true },
	},
	{
		img: MOB_IMAGES.wolf,
		name: 'Craven the Soulless',
		minLevel: 6,
		maxLevel: 6,
		size: .8,
		job: JOB.WARRIOR,
		tier: MOB_TIERS.unique,
		traits: { soulDrain: true },
	},
	{
		img: MOB_IMAGES.scorpion,
		name: 'Scithrax',
		minLevel: 5,
		maxLevel: 5,
		size: .8,
		job: JOB.ROGUE,
		tier: MOB_TIERS.unique,
		traits: { deadEye: true },
	},
	{
		img: MOB_IMAGES.orc,
		name: 'Grathule Frostreaver',
		minLevel: 7,
		maxLevel: 7,
		size: .8,
		job: JOB.SHAMAN,
		tier: MOB_TIERS.unique,
		traits: { iceEnchanted: true },
	},
	// quest mobs
	{
		img: MOB_IMAGES.orc,
		name: 'Peon Hegug',
		minLevel: 2,
		maxLevel: 2,
		size: .5,
		job: JOB.WARRIOR,
		tier: MOB_TIERS.unique,
		questOnly: true,
		traits: { dauntless: true },
	},
	{
		img: MOB_IMAGES.orc,
		name: 'Centurion Shiloh',
		minLevel: 4,
		maxLevel: 4,
		size: .75,
		job: JOB.SHADOW_KNIGHT,
		tier: MOB_TIERS.unique,
		questOnly: true,
		traits: { bloodlusted: true },
	},
	{
		img: MOB_IMAGES.orc,
		name: 'Prophet Urzoth',
		minLevel: 6,
		maxLevel: 6,
		size: .66,
		job: JOB.SHAMAN,
		tier: MOB_TIERS.unique,
		questOnly: true,
		traits: { magister: true },
	},
	{
		img: MOB_IMAGES.orc,
		name: 'Sergeant Grug',
		minLevel: 8,
		maxLevel: 8,
		size: .8,
		job: JOB.WARRIOR,
		tier: MOB_TIERS.unique,
		questOnly: true,
		traits: { brute: true },
	},
]
mob.data[ZONES.tendolinPassage] =
[
	{
		img: MOB_IMAGES.toadlok,
		name: 'toadlok tad',
		minLevel: 1,
		maxLevel: 2,
		size: .6,
		job: JOB.WARRIOR,
	},
	{
		img: MOB_IMAGES.toadlok,
		name: 'toadlok',
		minLevel: 3,
		maxLevel: 4,
		size: .66,
		job: JOB.WARRIOR,
	},
	{
		img: MOB_IMAGES.toadlok,
		name: 'toadlok sentry',
		minLevel: 3,
		maxLevel: 4,
		size: .7,
		job: JOB.WARRIOR,
	},
	{
		img: MOB_IMAGES.toadlok,
		name: 'toadlok urg knight',
		minLevel: 5,
		maxLevel: 6,
		size: .72,
		job: JOB.CRUSADER,
	},
	{
		img: MOB_IMAGES.toadlok,
		name: 'toadlok urg warrior',
		minLevel: 5,
		maxLevel: 6,
		size: .72,
		job: JOB.WARRIOR,
	},
	{
		img: MOB_IMAGES.toadlok,
		name: 'toadlok urg knight',
		minLevel: 7,
		maxLevel: 8,
		size: .8,
		job: JOB.CRUSADER,
	},
	{
		img: MOB_IMAGES.toadlok,
		name: 'toadlok urg warrior',
		minLevel: 7,
		maxLevel: 8,
		size: .8,
		job: JOB.WARRIOR,
	},
	{
		img: MOB_IMAGES.rat,
		name: 'young rat',
		minLevel: 1,
		maxLevel: 2,
		size: .5,
		job: JOB.WARRIOR,
	},
	{
		img: MOB_IMAGES.rat,
		name: 'rat',
		minLevel: 3,
		maxLevel: 4,
		size: .65,
		job: JOB.WARRIOR,
	},
	{
		img: MOB_IMAGES.rat,
		name: 'large rat',
		minLevel: 5,
		maxLevel: 6,
		size: .75,
		job: JOB.WARRIOR,
	},
	{
		img: MOB_IMAGES.rat,
		name: 'tunnel rat',
		minLevel: 7,
		maxLevel: 8,
		size: .8,
		job: JOB.WARRIOR,
	},
	{
		img: MOB_IMAGES.snake,
		name: 'garter snake',
		minLevel: 1,
		maxLevel: 2,
		size: .7,
		job: JOB.WARRIOR,
	},
	{
		img: MOB_IMAGES.snake,
		name: 'moss snake',
		minLevel: 3,
		maxLevel: 4,
		size: .7,
		job: JOB.WARRIOR,
	},
	{
		img: MOB_IMAGES.snake,
		name: 'large snake',
		minLevel: 5,
		maxLevel: 6,
		size: .7,
		job: JOB.WARRIOR,
	},
	{
		img: MOB_IMAGES.snake,
		name: 'rattlesnake',
		minLevel: 7,
		maxLevel: 8,
		size: .7,
		job: JOB.WARRIOR,
	},
	{
		img: MOB_IMAGES.beetle,
		name: 'beetle',
		minLevel: 1,
		maxLevel: 2,
		size: .4,
		job: JOB.WARRIOR,
	},
	{
		img: MOB_IMAGES.beetle,
		name: 'borer beetle',
		minLevel: 3,
		maxLevel: 4,
		size: .5,
		job: JOB.WARRIOR,
	},
	{
		img: MOB_IMAGES.beetle,
		name: 'dung beetle',
		minLevel: 5,
		maxLevel: 6,
		size: .6,
		job: JOB.WARRIOR,
	},
	{
		img: MOB_IMAGES.beetle,
		name: 'scarab beetle',
		minLevel: 7,
		maxLevel: 8,
		size: .7,
		job: JOB.WARRIOR,
	},
	// uniques
	{
		img: MOB_IMAGES.toadlok,
		name: 'Boggin Deepwater',
		minLevel: 4,
		maxLevel: 4,
		size: .6,
		job: JOB.SHAMAN,
		tier: MOB_TIERS.unique,
		traits: { poisonEnchanted: true },
	},
	{
		img: MOB_IMAGES.toadlok,
		name: 'Radamuh',
		minLevel: 6,
		maxLevel: 6,
		size: .7,
		job: JOB.WIZARD,
		tier: MOB_TIERS.unique,
		traits: { lightningEnchanted: true },
	},
	{
		img: MOB_IMAGES.toadlok,
		name: 'Voorg Gorefist',
		minLevel: 8,
		maxLevel: 8,
		size: .6,
		job: JOB.SHADOW_KNIGHT,
		tier: MOB_TIERS.unique,
		traits: { soulDrain: true },
	},
	{
		img: MOB_IMAGES.rat,
		name: 'Scruffy',
		minLevel: 6,
		maxLevel: 6,
		size: .8,
		job: JOB.WARRIOR,
		tier: MOB_TIERS.unique,
		traits: { dauntless: true },
	},
	{
		img: MOB_IMAGES.snake,
		name: 'Razorfang',
		minLevel: 5,
		maxLevel: 5,
		size: .8,
		job: JOB.ROGUE,
		tier: MOB_TIERS.unique,
		traits: { poisonEnchanted: true },
	},
	{
		img: MOB_IMAGES.beetle,
		name: 'Magmavore',
		minLevel: 7,
		maxLevel: 7,
		size: .8,
		job: JOB.WARRIOR,
		tier: MOB_TIERS.unique,
		traits: { fireEnchanted: true },
	},
	// quest mobs
	{
		img: MOB_IMAGES.toadlok,
		name: 'Fain the Mauler',
		minLevel: 2,
		maxLevel: 2,
		size: .8,
		job: JOB.WARRIOR,
		tier: MOB_TIERS.unique,
		questOnly: true,
		traits: { brute: true },
	},
	{
		img: MOB_IMAGES.toadlok,
		name: 'Frizzle the Insane',
		minLevel: 4,
		maxLevel: 4,
		size: .42,
		job: JOB.RANGER,
		tier: MOB_TIERS.unique,
		questOnly: true,
		traits: { frenzied: true },
	},
	{
		img: MOB_IMAGES.toadlok,
		name: 'Murglon Arcfist',
		minLevel: 6,
		maxLevel: 6,
		size: .7,
		job: JOB.WARRIOR,
		tier: MOB_TIERS.unique,
		questOnly: true,
		traits: { fireEnchanted: true },
	},
	{
		img: MOB_IMAGES.toadlok,
		name: 'Gelphon',
		minLevel: 8,
		maxLevel: 8,
		size: .75,
		job: JOB.WARRIOR,
		tier: MOB_TIERS.unique,
		questOnly: true,
		traits: { deadEye: true },
	},
]
mob.data[ZONES.greenthornCavern] =
[
	{
		img: MOB_IMAGES.hobgoblin,
		name: 'hobgoblin runt',
		minLevel: 5,
		maxLevel: 6,
		size: .62,
		job: JOB.WARRIOR,
	},
	{
		img: MOB_IMAGES.hobgoblin,
		name: 'scrawny hobgoblin',
		minLevel: 6,
		maxLevel: 8,
		size: .68,
		job: JOB.WARRIOR,
	},
	{
		img: MOB_IMAGES.hobgoblin,
		name: 'hobgoblin scout',
		minLevel: 7,
		maxLevel: 9,
		size: .72,
		job: JOB.WARRIOR,
	},
	{
		img: MOB_IMAGES.hobgoblin,
		name: 'hobgoblin shaman',
		minLevel: 8,
		maxLevel: 14,
		size: .72,
		job: JOB.SHAMAN,
	},
	{
		img: MOB_IMAGES.hobgoblin,
		name: 'hobgoblin',
		minLevel: 7,
		maxLevel: 11,
		size: .7,
		job: JOB.WARRIOR,
	},
	{
		img: MOB_IMAGES.hobgoblin,
		name: 'burly hobgoblin',
		minLevel: 9,
		maxLevel: 13,
		size: .75,
		job: JOB.WARRIOR,
	},
	{
		img: MOB_IMAGES.hobgoblin,
		name: 'hobgoblin guardsman',
		minLevel: 10,
		maxLevel: 14,
		size: .8,
		job: JOB.WARRIOR,
	},
	{
		img: MOB_IMAGES.hobgoblin,
		name: 'hobgoblin commander',
		minLevel: 14,
		maxLevel: 16,
		size: .85,
		job: JOB.WARRIOR,
	},
	{
		img: MOB_IMAGES.bear,
		name: 'bear cub',
		minLevel: 5,
		maxLevel: 6,
		size: .5,
		job: JOB.WARRIOR,
	},
	{
		img: MOB_IMAGES.bear,
		name: 'brown bear',
		minLevel: 10,
		maxLevel: 11,
		size: .7,
		job: JOB.WARRIOR,
	},
	{
		img: MOB_IMAGES.bear,
		name: 'grizzly bear',
		minLevel: 13,
		maxLevel: 14,
		size: .86,
		job: JOB.WARRIOR,
	},
	{
		img: MOB_IMAGES.crocodile,
		name: 'caiman',
		minLevel: 7,
		maxLevel: 8,
		size: .65,
		job: JOB.WARRIOR,
	},
	{
		img: MOB_IMAGES.crocodile,
		name: 'crocodile',
		minLevel: 9,
		maxLevel: 10,
		size: .75,
		job: JOB.WARRIOR,
	},
	{
		img: MOB_IMAGES.crocodile,
		name: 'deepwater caiman',
		minLevel: 12,
		maxLevel: 13,
		size: .72,
		job: JOB.WARRIOR,
	},
	{
		img: MOB_IMAGES.crocodile,
		name: 'deepwater crocodile',
		minLevel: 15,
		maxLevel: 16,
		size: .83,
		job: JOB.WARRIOR,
	},
	{
		img: MOB_IMAGES.scorpion,
		name: 'whiptail scorpion',
		minLevel: 6,
		maxLevel: 8,
		size: .66,
		job: JOB.WARRIOR,
	},
	{
		img: MOB_IMAGES.scorpion,
		name: 'tainted scorpion',
		minLevel: 10,
		maxLevel: 12,
		size: .77,
		job: JOB.ROGUE,
	},
	{
		img: MOB_IMAGES.scorpion,
		name: 'heartsting scorpion',
		minLevel: 14,
		maxLevel: 16,
		size: .83,
		job: JOB.ROGUE,
	},
	// uniques
	{
		img: MOB_IMAGES.hobgoblin,
		name: 'Chogarr Arpen',
		minLevel: 8,
		maxLevel: 8,
		size: .72,
		job: JOB.WARRIOR,
		tier: MOB_TIERS.unique,
		traits: { deadEye: true },
	},
	{
		img: MOB_IMAGES.hobgoblin,
		name: 'Hafex Tanaden',
		minLevel: 12,
		maxLevel: 12,
		size: .8,
		job: JOB.WARRIOR,
		tier: MOB_TIERS.unique,
		traits: { bloodlusted: true },
	},
	{
		img: MOB_IMAGES.hobgoblin,
		name: 'Rikolb Dygon',
		minLevel: 15,
		maxLevel: 15,
		size: .85,
		job: JOB.WARRIOR,
		tier: MOB_TIERS.unique,
		traits: { fireEnchanted: true },
	},
	{
		img: MOB_IMAGES.bear,
		name: 'Festerpaw',
		minLevel: 12,
		maxLevel: 12,
		size: .9,
		job: JOB.WARRIOR,
		tier: MOB_TIERS.unique,
		traits: { poisonEnchanted: true },
	},
	{
		img: MOB_IMAGES.scorpion,
		name: 'Krakator',
		minLevel: 16,
		maxLevel: 16,
		size: .9,
		job: JOB.WARLOCK,
		tier: MOB_TIERS.unique,
		traits: { magister: true },
	},
	// quest mobs
	{
		img: MOB_IMAGES.hobgoblin,
		name: 'Kyrgiarr Dreckhand',
		minLevel: 6,
		maxLevel: 6,
		size: .7,
		job: JOB.TEMPLAR,
		tier: MOB_TIERS.unique,
		questOnly: true,
		traits: { dauntless: true },
	},
	{
		img: MOB_IMAGES.hobgoblin,
		name: 'Gyz Tamebeam',
		minLevel: 8,
		maxLevel: 8,
		size: .75,
		job: JOB.WARRIOR,
		tier: MOB_TIERS.unique,
		questOnly: true,
		traits: { nimble: true },
	},
	{
		img: MOB_IMAGES.hobgoblin,
		name: 'Vyrg Dampclub',
		minLevel: 10,
		maxLevel: 10,
		size: .77,
		job: JOB.WARRIOR,
		tier: MOB_TIERS.unique,
		questOnly: true,
		traits: { soulDrain: true },
	},
	{
		img: MOB_IMAGES.hobgoblin,
		name: 'Brirger Dustfist',
		minLevel: 12,
		maxLevel: 12,
		size: .79,
		job: JOB.WARRIOR,
		tier: MOB_TIERS.unique,
		questOnly: true,
		traits: { tough: true },
	},
	{
		img: MOB_IMAGES.hobgoblin,
		name: 'Troto Rotgrinder',
		minLevel: 14,
		maxLevel: 14,
		size: .73,
		job: JOB.DRUID,
		tier: MOB_TIERS.unique,
		questOnly: true,
		traits: { lightningEnchanted: true },
	},
	{
		img: MOB_IMAGES.hobgoblin,
		name: 'Shiz Gorenail',
		minLevel: 16,
		maxLevel: 16,
		size: .84,
		job: JOB.SHADOW_KNIGHT,
		tier: MOB_TIERS.unique,
		questOnly: true,
		traits: { spiritDrain: true },
	},
]
mob.data[ZONES.lanfeldRefuge] =
[
	{
		img: MOB_IMAGES.orc,
		name: 'orc',
		minLevel: 5,
		maxLevel: 8,
		size: .7,
		job: JOB.WARRIOR,
	},
	{
		img: MOB_IMAGES.orc,
		name: 'orc',
		minLevel: 5,
		maxLevel: 8,
		size: .7,
		job: JOB.WARRIOR,
	},
	{
		img: MOB_IMAGES.orc,
		name: 'orc centurion',
		minLevel: 7,
		maxLevel: 12,
		size: .76,
		job: JOB.WARRIOR,
	},
	{
		img: MOB_IMAGES.orc,
		name: 'orc centurion',
		minLevel: 7,
		maxLevel: 12,
		size: .76,
		job: JOB.WARRIOR,
	},
	{
		img: MOB_IMAGES.orc,
		name: 'orc legionnaire',
		minLevel: 11,
		maxLevel: 17,
		size: .75,
		job: JOB.WARRIOR,
	},
	{
		img: MOB_IMAGES.orc,
		name: 'orc legionnaire',
		minLevel: 11,
		maxLevel: 17,
		size: .75,
		job: JOB.WARRIOR,
	},
	{
		img: MOB_IMAGES.orc,
		name: 'orc warlord',
		minLevel: 15,
		maxLevel: 20,
		size: .8,
		job: JOB.WARRIOR,
	},
	{
		img: MOB_IMAGES.orc,
		name: 'orc warlord',
		minLevel: 15,
		maxLevel: 20,
		size: .8,
		job: JOB.WARRIOR,
	},
	{
		img: MOB_IMAGES.orc,
		name: 'royal guard',
		minLevel: 13,
		maxLevel: 19,
		size: .68,
		job: JOB.ROGUE,
	},
	{
		img: MOB_IMAGES.orc,
		name: 'orc mystic',
		minLevel: 13,
		maxLevel: 17,
		size: .7,
		job: JOB.TEMPLAR,
	},
	{
		img: MOB_IMAGES.orc,
		name: 'orc wizard',
		minLevel: 16,
		maxLevel: 20,
		size: .7,
		job: JOB.WIZARD,
	},
	{
		img: MOB_IMAGES.orc,
		name: 'orc oracle',
		minLevel: 8,
		maxLevel: 13,
		size: .65,
		job: JOB.SHAMAN,
	},
	{
		img: MOB_IMAGES.orc,
		name: 'orc shaman',
		minLevel: 14,
		maxLevel: 16,
		size: .7,
		job: JOB.SHAMAN,
	},
	{
		img: MOB_IMAGES.orc,
		name: 'orc high shaman',
		minLevel: 18,
		maxLevel: 20,
		size: .75,
		job: JOB.SHAMAN,
	},
	{
		img: MOB_IMAGES.rat,
		name: 'giant rat',
		minLevel: 5,
		maxLevel: 9,
		size: .73,
		job: JOB.WARRIOR,
	},
	{
		img: MOB_IMAGES.wolf,
		name: 'black wolf',
		minLevel: 7,
		maxLevel: 9,
		size: .75,
		job: JOB.WARRIOR,
	},
	{
		img: MOB_IMAGES.wolf,
		name: 'young dire wolf',
		minLevel: 12,
		maxLevel: 14,
		size: .79,
		job: JOB.WARRIOR,
	},
	{
		img: MOB_IMAGES.wolf,
		name: 'dire wolf',
		minLevel: 16,
		maxLevel: 18,
		size: .84,
		job: JOB.WARRIOR,
	},
	{
		img: MOB_IMAGES.scorpion,
		name: 'heart scorpion',
		minLevel: 10,
		maxLevel: 12,
		size: .84,
		job: JOB.WARRIOR,
	},
	{
		img: MOB_IMAGES.scorpion,
		name: 'lurking scorpion',
		minLevel: 13,
		maxLevel: 15,
		size: .84,
		job: JOB.WARRIOR,
	},
	{
		img: MOB_IMAGES.scorpion,
		name: 'stone scorpion',
		minLevel: 17,
		maxLevel: 19,
		size: .84,
		job: JOB.WARRIOR,
	},
	// uniques
	{
		img: MOB_IMAGES.wolf,
		name: 'Ulfr',
		minLevel: 7,
		maxLevel: 7,
		size: .8,
		job: JOB.WARRIOR,
		tier: MOB_TIERS.unique,
		traits: { iceEnchanted: true },
	},
	{
		img: MOB_IMAGES.rat,
		name: 'Chuckie',
		minLevel: 12,
		maxLevel: 12,
		size: .95,
		job: JOB.WARRIOR,
		tier: MOB_TIERS.unique,
		traits: { frenzied: true },
	},
	{
		img: MOB_IMAGES.scorpion,
		name: 'Shrapnel',
		minLevel: 16,
		maxLevel: 16,
		size: .92,
		job: JOB.SHADOW_KNIGHT,
		tier: MOB_TIERS.unique,
		traits: { fireEnchanted: true },
	},
	{
		img: MOB_IMAGES.orc,
		name: 'Trainer Zalthu',
		minLevel: 9,
		maxLevel: 9,
		size: .74,
		job: JOB.CRUSADER,
		tier: MOB_TIERS.unique,
		traits: { dauntless: true },
	},
	{
		img: MOB_IMAGES.orc,
		name: 'Revenant Xegug',
		minLevel: 11,
		maxLevel: 11,
		size: .76,
		job: JOB.SHADOW_KNIGHT,
		tier: MOB_TIERS.unique,
		traits: { bloodlusted: true },
	},
	{
		img: MOB_IMAGES.orc,
		name: 'Acolyte Filge',
		minLevel: 14,
		maxLevel: 14,
		size: .7,
		job: JOB.WIZARD,
		tier: MOB_TIERS.unique,
		traits: { magister: true },
	},
	{
		img: MOB_IMAGES.orc,
		name: 'Gladiator Lagakh',
		minLevel: 17,
		maxLevel: 17,
		size: .92,
		job: JOB.CRUSADER,
		tier: MOB_TIERS.unique,
		traits: { brute: true },
	},
	{
		img: MOB_IMAGES.orc,
		name: 'Prophet Grazob',
		minLevel: 19,
		maxLevel: 19,
		size: .76,
		job: JOB.SHAMAN,
		tier: MOB_TIERS.unique,
		traits: { spiritDrain: true },
	},
	// quest mobs
	{
		img: MOB_IMAGES.orc,
		name: 'Disciple Bashag',
		minLevel: 6,
		maxLevel: 6,
		size: .7,
		job: JOB.MONK,
		tier: MOB_TIERS.unique,
		questOnly: true,
		traits: { nimble: true },
	},
	{
		img: MOB_IMAGES.orc,
		name: 'Sergeant Dumburz',
		minLevel: 8,
		maxLevel: 8,
		size: .75,
		job: JOB.WARRIOR,
		tier: MOB_TIERS.unique,
		questOnly: true,
		traits: { tough: true },
	},
	{
		img: MOB_IMAGES.orc,
		name: 'Warlord Turbag',
		minLevel: 10,
		maxLevel: 10,
		size: .75,
		job: JOB.WARRIOR,
		tier: MOB_TIERS.unique,
		questOnly: true,
		traits: { lightningEnchanted: true },
	},
	{
		img: MOB_IMAGES.orc,
		name: 'Soothsayer Bilge',
		minLevel: 12,
		maxLevel: 12,
		size: .75,
		job: JOB.SHAMAN,
		tier: MOB_TIERS.unique,
		questOnly: true,
		traits: { poisonEnchanted: true },
	},
	{
		img: MOB_IMAGES.orc,
		name: 'Oracle Xomath',
		minLevel: 14,
		maxLevel: 14,
		size: .75,
		job: JOB.CLERIC,
		tier: MOB_TIERS.unique,
		questOnly: true,
		traits: { magister: true },
	},
	{
		img: MOB_IMAGES.orc,
		name: 'Captain Urzoth',
		minLevel: 16,
		maxLevel: 16,
		size: .75,
		job: JOB.CRUSADER,
		tier: MOB_TIERS.unique,
		questOnly: true,
		traits: { dauntless: true },
	},
	{
		img: MOB_IMAGES.orc,
		name: 'Minstrel Baronk',
		minLevel: 18,
		maxLevel: 18,
		size: .75,
		job: JOB.BARD,
		tier: MOB_TIERS.unique,
		questOnly: true,
		traits: { deadEye: true },
	},
	{
		img: MOB_IMAGES.orc,
		name: 'Emperor Thresh',
		minLevel: 20,
		maxLevel: 20,
		size: .75,
		job: JOB.WARRIOR,
		tier: MOB_TIERS.unique,
		questOnly: true,
		traits: { tough: true },
	},
]
mob.data[ZONES.rivenGrotto] = [
	{
		img: MOB_IMAGES.beetle,
		name: 'death beetle',
		minLevel: 10,
		maxLevel: 14,
		size: .7,
		job: JOB.WARRIOR,
	},
	{
		img: MOB_IMAGES.beetle,
		name: 'pincer beetle',
		minLevel: 16,
		maxLevel: 18,
		size: .9,
		job: JOB.WARRIOR,
	},
	{
		img: MOB_IMAGES.ghoul,
		name: 'ghoul',
		minLevel: 11,
		maxLevel: 14,
		size: .75,
		job: JOB.WARRIOR,
	},
	{
		img: MOB_IMAGES.ghoul,
		name: 'carrion ghoul',
		minLevel: 16,
		maxLevel: 18,
		size: .75,
		job: JOB.WARRIOR,
	},
	{
		img: MOB_IMAGES.ghoul,
		name: 'crazed ghoul',
		minLevel: 20,
		maxLevel: 22,
		size: .75,
		job: JOB.WARRIOR,
	},
	{
		img: MOB_IMAGES.skeleton,
		name: 'greater skeleton',
		minLevel: 11,
		maxLevel: 14,
		size: .75,
		job: JOB.WARRIOR,
	},
	{
		img: MOB_IMAGES.skeleton,
		name: 'skeletal monk',
		minLevel: 15,
		maxLevel: 18,
		size: .8,
		job: JOB.MONK,
	},
	{
		img: MOB_IMAGES.skeleton,
		name: 'skeletal mage',
		minLevel: 14,
		maxLevel: 19,
		size: .7,
		job: JOB.TEMPLAR,
	},
	{
		img: MOB_IMAGES.skeleton,
		name: 'dry bone skeleton',
		minLevel: 20,
		maxLevel: 23,
		size: .8,
		job: JOB.WARRIOR,
	},
	{
		img: MOB_IMAGES.skeleton,
		name: 'skeletal sorcerer',
		minLevel: 19,
		maxLevel: 24,
		size: .66,
		job: JOB.WIZARD,
	},
	{
		img: MOB_IMAGES.mummy,
		name: 'mummy',
		minLevel: 13,
		maxLevel: 15,
		size: .75,
		job: JOB.WARRIOR,
	},
	{
		img: MOB_IMAGES.mummy,
		name: 'crypt mummy',
		minLevel: 17,
		maxLevel: 19,
		size: .8,
		job: JOB.WARRIOR,
	},
	{
		img: MOB_IMAGES.mummy,
		name: 'ancient mummy',
		minLevel: 17,
		maxLevel: 19,
		size: .85,
		job: JOB.WARRIOR,
	},
	{
		img: MOB_IMAGES.mummy,
		name: 'arcane mummy',
		minLevel: 14,
		maxLevel: 18,
		size: .72,
		job: JOB.WARLOCK,
	},
	{
		img: MOB_IMAGES.mummy,
		name: 'chaos mummy',
		minLevel: 19,
		maxLevel: 23,
		size: .72,
		job: JOB.WARLOCK,
	},
	{
		img: MOB_IMAGES.zombie,
		name: 'tormented zombie',
		minLevel: 10,
		maxLevel: 13,
		size: .75,
		job: JOB.WARRIOR,
	},
	{
		img: MOB_IMAGES.zombie,
		name: 'listless zombie',
		minLevel: 15,
		maxLevel: 18,
		size: .8,
		job: JOB.WARRIOR,
	},
	{
		img: MOB_IMAGES.zombie,
		name: 'rotting savant',
		minLevel: 12,
		maxLevel: 16,
		size: .73,
		job: JOB.WIZARD,
	},
	{
		img: MOB_IMAGES.zombie,
		name: 'festering bloke',
		minLevel: 19,
		maxLevel: 24,
		size: .76,
		job: JOB.WIZARD,
	},
	{
		img: MOB_IMAGES.zombie,
		name: 'haunted zombie',
		minLevel: 20,
		maxLevel: 22,
		size: .85,
		job: JOB.WARRIOR,
	},
	// uniques
	{
		img: MOB_IMAGES.beetle,
		name: 'Megadeath',
		minLevel: 13,
		maxLevel: 13,
		size: 1.1,
		job: JOB.SHADOW_KNIGHT,
		tier: MOB_TIERS.unique,
		traits: { bloodthirsty: true },
	},
	// quest mobs
	{
		img: MOB_IMAGES.toadlok,
		name: 'Gelphon',
		minLevel: 8,
		maxLevel: 8,
		size: .75,
		job: JOB.WARRIOR,
		tier: MOB_TIERS.unique,
		questOnly: true,
		traits: { deadEye: true },
	},
]
mob.data[ZONES.bastilleCitadel] = [
	{
		img: MOB_IMAGES.orc,
		name: 'orc pawn',
		minLevel: 1,
		maxLevel: 2,
		size: .65,
		job: JOB.WARRIOR,
	},
	// uniques
	{
		img: MOB_IMAGES.beetle,
		name: 'Magmavore',
		minLevel: 7,
		maxLevel: 7,
		size: .8,
		job: JOB.WARRIOR,
		tier: MOB_TIERS.unique,
		traits: { fireEnchanted: true },
	},
	// quest mobs
	{
		img: MOB_IMAGES.toadlok,
		name: 'Gelphon',
		minLevel: 8,
		maxLevel: 8,
		size: .75,
		job: JOB.WARRIOR,
		tier: MOB_TIERS.unique,
		questOnly: true,
		traits: { deadEye: true },
	},
]
mob.data[ZONES.kordataCove] = [
	{
		img: MOB_IMAGES.orc,
		name: 'orc pawn',
		minLevel: 1,
		maxLevel: 2,
		size: .65,
		job: JOB.WARRIOR,
	},
	// uniques
	{
		img: MOB_IMAGES.beetle,
		name: 'Magmavore',
		minLevel: 7,
		maxLevel: 7,
		size: .8,
		job: JOB.WARRIOR,
		tier: MOB_TIERS.unique,
		traits: { fireEnchanted: true },
	},
	// quest mobs
	{
		img: MOB_IMAGES.toadlok,
		name: 'Gelphon',
		minLevel: 8,
		maxLevel: 8,
		size: .75,
		job: JOB.WARRIOR,
		tier: MOB_TIERS.unique,
		questOnly: true,
		traits: { deadEye: true },
	},
]
mob.data[ZONES.sylongSanctuary] = [
	{
		img: MOB_IMAGES.orc,
		name: 'orc pawn',
		minLevel: 1,
		maxLevel: 2,
		size: .65,
		job: JOB.WARRIOR,
	},
	// uniques
	{
		img: MOB_IMAGES.beetle,
		name: 'Magmavore',
		minLevel: 7,
		maxLevel: 7,
		size: .8,
		job: JOB.WARRIOR,
		tier: MOB_TIERS.unique,
		traits: { fireEnchanted: true },
	},
	// quest mobs
	{
		img: MOB_IMAGES.toadlok,
		name: 'Gelphon',
		minLevel: 8,
		maxLevel: 8,
		size: .75,
		job: JOB.WARRIOR,
		tier: MOB_TIERS.unique,
		questOnly: true,
		traits: { deadEye: true },
	},
]
mob.data[ZONES.thuleCrypt] = [
	{
		img: MOB_IMAGES.orc,
		name: 'orc pawn',
		minLevel: 1,
		maxLevel: 2,
		size: .65,
		job: JOB.WARRIOR,
	},
	// uniques
	{
		img: MOB_IMAGES.beetle,
		name: 'Magmavore',
		minLevel: 7,
		maxLevel: 7,
		size: .8,
		job: JOB.WARRIOR,
		tier: MOB_TIERS.unique,
		traits: { fireEnchanted: true },
	},
	// quest mobs
	{
		img: MOB_IMAGES.toadlok,
		name: 'Gelphon',
		minLevel: 8,
		maxLevel: 8,
		size: .75,
		job: JOB.WARRIOR,
		tier: MOB_TIERS.unique,
		questOnly: true,
		traits: { deadEye: true },
	},
]
mob.data[ZONES.templeOfPrenssor] = [
	{
		img: MOB_IMAGES.orc,
		name: 'orc pawn',
		minLevel: 1,
		maxLevel: 2,
		size: .65,
		job: JOB.WARRIOR,
	},
	// uniques
	{
		img: MOB_IMAGES.beetle,
		name: 'Magmavore',
		minLevel: 7,
		maxLevel: 7,
		size: .8,
		job: JOB.WARRIOR,
		tier: MOB_TIERS.unique,
		traits: { fireEnchanted: true },
	},
	// quest mobs
	{
		img: MOB_IMAGES.toadlok,
		name: 'Gelphon',
		minLevel: 8,
		maxLevel: 8,
		size: .75,
		job: JOB.WARRIOR,
		tier: MOB_TIERS.unique,
		questOnly: true,
		traits: { deadEye: true },
	},
]
mob.data[ZONES.fahlnirCitadel] = [
	{
		img: MOB_IMAGES.orc,
		name: 'orc pawn',
		minLevel: 1,
		maxLevel: 2,
		size: .65,
		job: JOB.WARRIOR,
	},
	// uniques
	{
		img: MOB_IMAGES.beetle,
		name: 'Magmavore',
		minLevel: 7,
		maxLevel: 7,
		size: .8,
		job: JOB.WARRIOR,
		tier: MOB_TIERS.unique,
		traits: { fireEnchanted: true },
	},
	// quest mobs
	{
		img: MOB_IMAGES.toadlok,
		name: 'Gelphon',
		minLevel: 8,
		maxLevel: 8,
		size: .75,
		job: JOB.WARRIOR,
		tier: MOB_TIERS.unique,
		questOnly: true,
		traits: { deadEye: true },
	},
]
mob.data[ZONES.anuranRuins] = [
	{
		img: MOB_IMAGES.orc,
		name: 'orc pawn',
		minLevel: 1,
		maxLevel: 2,
		size: .65,
		job: JOB.WARRIOR,
	},
	// uniques
	{
		img: MOB_IMAGES.beetle,
		name: 'Magmavore',
		minLevel: 7,
		maxLevel: 7,
		size: .8,
		job: JOB.WARRIOR,
		tier: MOB_TIERS.unique,
		traits: { fireEnchanted: true },
	},
	// quest mobs
	{
		img: MOB_IMAGES.toadlok,
		name: 'Gelphon',
		minLevel: 8,
		maxLevel: 8,
		size: .75,
		job: JOB.WARRIOR,
		tier: MOB_TIERS.unique,
		questOnly: true,
		traits: { deadEye: true },
	},
]
mob.data[ZONES.galeblastFortress] = [
	{
		img: MOB_IMAGES.orc,
		name: 'orc pawn',
		minLevel: 1,
		maxLevel: 2,
		size: .65,
		job: JOB.WARRIOR,
	},
	// uniques
	{
		img: MOB_IMAGES.beetle,
		name: 'Magmavore',
		minLevel: 7,
		maxLevel: 7,
		size: .8,
		job: JOB.WARRIOR,
		tier: MOB_TIERS.unique,
		traits: { fireEnchanted: true },
	},
	// quest mobs
	{
		img: MOB_IMAGES.toadlok,
		name: 'Gelphon',
		minLevel: 8,
		maxLevel: 8,
		size: .75,
		job: JOB.WARRIOR,
		tier: MOB_TIERS.unique,
		questOnly: true,
		traits: { deadEye: true },
	},
]
mob.data[ZONES.ashenflowPeak] = [
	{
		img: MOB_IMAGES.orc,
		name: 'orc pawn',
		minLevel: 1,
		maxLevel: 2,
		size: .65,
		job: JOB.WARRIOR,
	},
	// uniques
	{
		img: MOB_IMAGES.beetle,
		name: 'Magmavore',
		minLevel: 7,
		maxLevel: 7,
		size: .8,
		job: JOB.WARRIOR,
		tier: MOB_TIERS.unique,
		traits: { fireEnchanted: true },
	},
	// quest mobs
	{
		img: MOB_IMAGES.toadlok,
		name: 'Gelphon',
		minLevel: 8,
		maxLevel: 8,
		size: .75,
		job: JOB.WARRIOR,
		tier: MOB_TIERS.unique,
		questOnly: true,
		traits: { deadEye: true },
	},
]