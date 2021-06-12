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
		img: MOB_IMAGES.orc,
		name: 'orc pawn',
		minLevel: 1,
		maxLevel: 2,
		size: .65,
		job: JOB.WARRIOR,
	},
	// uniques
	// quest mobs
]
mob.data[ZONES.lanfeldRefuge] =
[
	{
		img: MOB_IMAGES.orc,
		name: 'orc pawn',
		minLevel: 1,
		maxLevel: 2,
		size: .65,
		job: JOB.WARRIOR,
	},
	// uniques
	// quest mobs
]
mob.data[ZONES.rivenGrotto] = [
	{
		img: MOB_IMAGES.orc,
		name: 'orc pawn',
		minLevel: 1,
		maxLevel: 2,
		size: .65,
		job: JOB.WARRIOR,
	},
	// uniques
	// quest mobs
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
	// quest mobs
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
	// quest mobs
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
	// quest mobs
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
	// quest mobs
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
	// quest mobs
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
	// quest mobs
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
	// quest mobs
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
	// quest mobs
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
	// quest mobs
]