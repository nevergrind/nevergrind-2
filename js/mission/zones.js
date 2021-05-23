
var zones = [{
		id: 0,
		name: ZONES.salubrinHaven,
		level: 1,
		maxLevel: 8,
		isOpen: 0,
		missions: quests.filter(q => q.zone === ZONES.salubrinHaven),
		mobs: mob.data[ZONES.salubrinHaven].reduce(mob.getMobImagesByZone, [])
	},
	{
		id: 1,
		name: ZONES.tendolinPassage,
		level: 1,
		maxLevel: 8,
		isOpen: 0,
		missions: quests.filter(q => q.zone === ZONES.tendolinPassage),
		mobs: mob.data[ZONES.tendolinPassage].reduce(mob.getMobImagesByZone, [])
	},
	{
		id: 2,
		name: ZONES.greenthornCavern,
		level: 5,
		maxLevel: 20,
		isOpen: 0,
		missions: quests.filter(q => q.zone === ZONES.greenthornCavern),
		mobs: mob.data[ZONES.greenthornCavern].reduce(mob.getMobImagesByZone, [])
	},
	{
		id: 3,
		name: ZONES.lanfeldRefuge,
		level: 5,
		maxLevel: 20,
		isOpen: 0,
		missions: quests.filter(q => q.zone === ZONES.lanfeldRefuge),
		mobs: mob.data[ZONES.lanfeldRefuge].reduce(mob.getMobImagesByZone, [])
	},
	{
		id: 4,
		name: ZONES.rivenGrotto,
		level: 5,
		maxLevel: 20,
		isOpen: 0,
		missions: quests.filter(q => q.zone === ZONES.rivenGrotto),
		mobs: mob.data[ZONES.rivenGrotto].reduce(mob.getMobImagesByZone, [])
	},
	{
		id: 5,
		name: ZONES.bastilleCitadel,
		level: 8,
		maxLevel: 20,
		isOpen: 0,
		missions: quests.filter(q => q.zone === ZONES.bastilleCitadel),
		mobs: mob.data[ZONES.bastilleCitadel].reduce(mob.getMobImagesByZone, [])
	},
	{
		id: 6,
		name: ZONES.kordataCove,
		level: 12,
		maxLevel: 25,
		isOpen: 0,
		missions: quests.filter(q => q.zone === ZONES.kordataCove),
		mobs: mob.data[ZONES.kordataCove].reduce(mob.getMobImagesByZone, [])
	},
	{
		id: 7,
		name: ZONES.sylongSanctuary,
		level: 16,
		maxLevel: 30,
		isOpen: 0,
		missions: quests.filter(q => q.zone === ZONES.sylongSanctuary),
		mobs: mob.data[ZONES.sylongSanctuary].reduce(mob.getMobImagesByZone, [])
	},
	{
		id: 8,
		name: ZONES.thuleCrypt,
		level: 20,
		maxLevel: 35,
		isOpen: 0,
		missions: quests.filter(q => q.zone === ZONES.thuleCrypt),
		mobs: mob.data[ZONES.thuleCrypt].reduce(mob.getMobImagesByZone, [])
	},
	{
		id: 9,
		name: ZONES.templeOfPrenssor,
		level: 24,
		maxLevel: 40,
		isOpen: 0,
		missions: quests.filter(q => q.zone === ZONES.templeOfPrenssor),
		mobs: mob.data[ZONES.templeOfPrenssor].reduce(mob.getMobImagesByZone, [])
	},
	{
		id: 10,
		name: ZONES.fahlnirCitadel,
		level: 28,
		maxLevel: 45,
		isOpen: 0,
		missions: quests.filter(q => q.zone === ZONES.fahlnirCitadel),
		mobs: mob.data[ZONES.fahlnirCitadel].reduce(mob.getMobImagesByZone, [])
	},
	{
		id: 11,
		name: ZONES.anuranRuins,
		level: 32,
		maxLevel: 50,
		isOpen: 0,
		missions: quests.filter(q => q.zone === ZONES.anuranRuins),
		mobs: mob.data[ZONES.anuranRuins].reduce(mob.getMobImagesByZone, [])
	},
	{
		id: 12,
		name: ZONES.galeblastFortress,
		level: 35,
		maxLevel: 50,
		isOpen: 0,
		missions: quests.filter(q => q.zone === ZONES.galeblastFortress),
		mobs: mob.data[ZONES.galeblastFortress].reduce(mob.getMobImagesByZone, [])
	},
	{
		id: 13,
		name: ZONES.ashenflowPeak,
		level: 35,
		maxLevel: 50,
		isOpen: 0,
		missions: quests.filter(q => q.zone === ZONES.ashenflowPeak),
		mobs: mob.data[ZONES.ashenflowPeak].reduce(mob.getMobImagesByZone, [])
	},
];