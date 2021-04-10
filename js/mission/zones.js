
var zones = [{},
	{
		name: ZONES.salubrinHaven,
		level: 1,
		maxLevel: 8,
		id: 1,
		isOpen: 0,
		missions: quests.filter(q => q.zone === ZONES.salubrinHaven),
		mobs: mob.data[ZONES.salubrinHaven].reduce(mob.getMobImagesByZone, [])
	},
	{
		name: ZONES.tendolinPassage,
		level: 1,
		maxLevel: 8,
		id: 2,
		isOpen: 0,
		missions: quests.filter(q => q.zone === ZONES.tendolinPassage),
		mobs: mob.data[ZONES.tendolinPassage].reduce(mob.getMobImagesByZone, [])
	},
	{
		name: ZONES.greenthornCavern,
		level: 5,
		maxLevel: 20,
		id: 3,
		isOpen: 0,
		missions: quests.filter(q => q.zone === ZONES.greenthornCavern),
		mobs: mob.data[ZONES.greenthornCavern].reduce(mob.getMobImagesByZone, [])
	},
	{
		name: ZONES.lanfeldRefuge,
		level: 5,
		maxLevel: 20,
		id: 4,
		isOpen: 0,
		missions: quests.filter(q => q.zone === ZONES.lanfeldRefuge),
		mobs: mob.data[ZONES.lanfeldRefuge].reduce(mob.getMobImagesByZone, [])
	},
	{
		name: ZONES.rivenGrotto,
		level: 5,
		maxLevel: 20,
		id: 5,
		isOpen: 0,
		missions: quests.filter(q => q.zone === ZONES.rivenGrotto),
		mobs: mob.data[ZONES.rivenGrotto].reduce(mob.getMobImagesByZone, [])
	},
	{
		name: ZONES.bastilleCitadel,
		level: 8,
		maxLevel: 20,
		id: 6,
		isOpen: 0,
		missions: quests.filter(q => q.zone === ZONES.bastilleCitadel),
		mobs: mob.data[ZONES.bastilleCitadel].reduce(mob.getMobImagesByZone, [])
	},
	{
		name: ZONES.kordataCove,
		level: 12,
		maxLevel: 25,
		id: 7,
		isOpen: 0,
		missions: quests.filter(q => q.zone === ZONES.kordataCove),
		mobs: mob.data[ZONES.kordataCove].reduce(mob.getMobImagesByZone, [])
	},
	{
		name: ZONES.sylongSanctuary,
		level: 16,
		maxLevel: 30,
		id: 8,
		isOpen: 0,
		missions: quests.filter(q => q.zone === ZONES.sylongSanctuary),
		mobs: mob.data[ZONES.sylongSanctuary].reduce(mob.getMobImagesByZone, [])
	},
	{
		name: ZONES.thuleCrypt,
		level: 20,
		maxLevel: 35,
		id: 9,
		isOpen: 0,
		missions: quests.filter(q => q.zone === ZONES.thuleCrypt),
		mobs: mob.data[ZONES.thuleCrypt].reduce(mob.getMobImagesByZone, [])
	},
	{
		name: ZONES.templeOfPrenssor,
		level: 24,
		maxLevel: 40,
		id: 10,
		isOpen: 0,
		missions: quests.filter(q => q.zone === ZONES.templeOfPrenssor),
		mobs: mob.data[ZONES.templeOfPrenssor].reduce(mob.getMobImagesByZone, [])
	},
	{
		name: ZONES.fahlnirCitadel,
		level: 28,
		maxLevel: 45,
		id: 11,
		isOpen: 0,
		missions: quests.filter(q => q.zone === ZONES.fahlnirCitadel),
		mobs: mob.data[ZONES.fahlnirCitadel].reduce(mob.getMobImagesByZone, [])
	},
	{
		name: ZONES.anuranRuins,
		level: 32,
		maxLevel: 50,
		id: 12,
		isOpen: 0,
		missions: quests.filter(q => q.zone === ZONES.anuranRuins),
		mobs: mob.data[ZONES.anuranRuins].reduce(mob.getMobImagesByZone, [])
	},
	{
		name: ZONES.galeblastFortress,
		level: 35,
		maxLevel: 50,
		id: 13,
		isOpen: 0,
		missions: quests.filter(q => q.zone === ZONES.galeblastFortress),
		mobs: mob.data[ZONES.galeblastFortress].reduce(mob.getMobImagesByZone, [])
	},
	{
		name: ZONES.ashenflowPeak,
		level: 35,
		maxLevel: 50,
		id: 14,
		isOpen: 0,
		missions: quests.filter(q => q.zone === ZONES.ashenflowPeak),
		mobs: mob.data[ZONES.ashenflowPeak].reduce(mob.getMobImagesByZone, [])
	},
];