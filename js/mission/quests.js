var quests;
!function($, _, TweenMax, undefined) {
	/**
	 * Types of missions:
	 * cleanse - Win 100% of battles
	 * target - Checks type of mob killed (orc, toadlok, etc)
	 * kill (the BOSS) - checks mob name (typically a boss or champion type)
	 * explore - check room id after cleared and check how many unique rooms have been cleared
	 * gather - retrieve # lost relics
	 * investigate - record ancient writings,
	 */
	quests = [
		// Salubrin Haven Quests
		{
			level: 1, // quest level (controls min/max mobs, ambush), max mob level for this mission
			bossName: QUEST_MOBS.peonHegug,
			description: '',
			type: QUEST_TYPES.kill,
			size: MAP_SIZES.small,
			zone: ZONES.salubrinHaven,
		},
		{
			level: 3,
			bossName: QUEST_MOBS.centurionShiloh,
			description: '',
			type: QUEST_TYPES.kill,
			size: MAP_SIZES.small,
			zone: ZONES.salubrinHaven,
		},
		{
			level: 5,
			bossName: QUEST_MOBS.prophetUrzoth,
			description: '',
			type: QUEST_TYPES.kill,
			size: MAP_SIZES.small,
			zone: ZONES.salubrinHaven,
		},
		{
			level: 7,
			bossName: QUEST_MOBS.sergeantGrug,
			description: '',
			type: QUEST_TYPES.kill,
			size: MAP_SIZES.small,
			zone: ZONES.salubrinHaven,
		},
		{
			level: 7,
			bossName: 'Sergeant Boggun',
			description: '',
			type: QUEST_TYPES.kill,
			size: MAP_SIZES.small,
			zone: ZONES.salubrinHaven,
		},
		// Tendolin Passage Quests
		{
			level: 1,
			bossName: 'Himber',
			description: '',
			type: QUEST_TYPES.kill,
			size: MAP_SIZES.small,
			zone: ZONES.tendolinPassage,
		},
		// Greenthorn Cavern Quests
		{
			level: 1,
			bossName: 'Himber',
			description: '',
			type: QUEST_TYPES.kill,
			size: MAP_SIZES.large,
			zone: ZONES.greenthornCavern,
		},
		// Lanfeld Refuge Quests
		{
			level: 1,
			bossName: 'Himber',
			description: '',
			type: QUEST_TYPES.kill,
			size: MAP_SIZES.large,
			zone: ZONES.lanfeldRefuge,
		},
		// Riven Grotto Quests
		{
			level: 1,
			bossName: 'Himber',
			description: '',
			type: QUEST_TYPES.kill,
			size: MAP_SIZES.large,
			zone: ZONES.rivenGrotto,
		},
		// Bastille Citadel Quests
		{
			level: 1,
			bossName: 'Himber',
			description: '',
			type: QUEST_TYPES.kill,
			size: MAP_SIZES.large,
			zone: ZONES.bastilleCitadel,
		},
		// Kordata Cove Quests
		{
			level: 1,
			bossName: 'Himber',
			description: '',
			type: QUEST_TYPES.kill,
			size: MAP_SIZES.large,
			zone: ZONES.kordataCove,
		},
		// Sylong Sanctuary Quests
		{
			level: 1,
			bossName: 'Himber',
			description: '',
			type: QUEST_TYPES.kill,
			size: MAP_SIZES.large,
			zone: ZONES.sylongSanctuary,
		},
		// Thule Crypt Quests
		{
			level: 1,
			bossName: 'Himber',
			description: '',
			type: QUEST_TYPES.kill,
			size: MAP_SIZES.large,
			zone: ZONES.thuleCrypt,
		},
		// Temple of Prenssor Quests
		{
			level: 1,
			bossName: 'Himber',
			description: '',
			type: QUEST_TYPES.kill,
			size: MAP_SIZES.large,
			zone: ZONES.templeOfPrenssor,
		},
		// Fahnir Citadel Quests
		{
			level: 1,
			bossName: 'Himber',
			description: '',
			type: QUEST_TYPES.kill,
			size: MAP_SIZES.large,
			zone: ZONES.fahlnirCitadel,
		},
		// Anuran Ruins Quests
		{
			level: 1,
			bossName: 'Himber',
			description: '',
			type: QUEST_TYPES.kill,
			size: MAP_SIZES.large,
			zone: ZONES.anuranRuins,
		},
		// Galeblast Fortress Quests
		{
			level: 1,
			bossName: 'Himber',
			description: '',
			type: QUEST_TYPES.kill,
			size: MAP_SIZES.large,
			zone: ZONES.galeblastFortress,
		},
		// Ashenflow Peak Quests
		{
			level: 1,
			bossName: 'Himber',
			description: '',
			type: QUEST_TYPES.kill,
			size: MAP_SIZES.large,
			zone: ZONES.ashenflowPeak,
		},
	]
	///////////////////////////////////////////

}($, _, TweenMax);