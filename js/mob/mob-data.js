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
		minLevel: 1,
		maxLevel: 1,
		size: .5,
		job: JOB.WARRIOR,
		tier: MOB_TIERS.unique,
		traits: { dauntless: true },
	},
	{
		img: MOB_IMAGES.snake,
		name: 'Slitherfang',
		minLevel: 3,
		maxLevel: 3,
		size: .8,
		job: JOB.ROGUE,
		tier: MOB_TIERS.unique,
		traits: { poisonEnchanted: true },
	},
	{
		img: MOB_IMAGES.spider,
		name: 'Twitchmaw',
		minLevel: 2,
		maxLevel: 2,
		size: .4,
		job: JOB.WARRIOR,
		tier: MOB_TIERS.unique,
		traits: { frenzied: true },
	},
	{
		img: MOB_IMAGES.wolf,
		name: 'Craven the Soulless',
		minLevel: 4,
		maxLevel: 4,
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
		minLevel: 6,
		maxLevel: 6,
		size: .8,
		job: JOB.SHAMAN,
		tier: MOB_TIERS.unique,
		traits: { iceEnchanted: true },
	},
	// quest mobs
	{
		img: MOB_IMAGES.orc,
		name: 'Peon Hegug',
		minLevel: 1,
		maxLevel: 1,
		size: .5,
		job: JOB.WARRIOR,
		tier: MOB_TIERS.unique,
		questOnly: true,
		traits: { dauntless: true },
	},
	{
		img: MOB_IMAGES.orc,
		name: 'Centurion Shiloh',
		minLevel: 1,
		maxLevel: 1,
		size: .75,
		job: JOB.SHADOW_KNIGHT,
		tier: MOB_TIERS.unique,
		questOnly: true,
		traits: { bloodlusted: true },
	},
	{
		img: MOB_IMAGES.orc,
		name: 'Prophet Urzoth',
		minLevel: 1,
		maxLevel: 1,
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
		img: MOB_IMAGES.rat,
		name: 'rat',
		minLevel: 1,
		maxLevel: 2,
		size: .6,
		job: JOB.WARRIOR,
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
		img: MOB_IMAGES.beetle,
		name: 'beetle',
		minLevel: 1,
		maxLevel: 2,
		size: .6,
		job: JOB.WARRIOR,
	},
	// uniques
	// quest mobs
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