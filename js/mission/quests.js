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
			level: 2, // quest level (controls min/max mobs, ambush), max mob level for this mission
			bossName: 'Peon Hegug',
			description: '',
			type: QUEST_TYPES.kill,
			size: MAP_SIZES.medium,
			zone: ZONES.salubrinHaven,
		},
		{
			level: 4,
			bossName: 'Centurion Shiloh',
			description: '',
			type: QUEST_TYPES.kill,
			size: MAP_SIZES.medium,
			zone: ZONES.salubrinHaven,
		},
		{
			level: 6,
			bossName: 'Prophet Urzoth',
			description: '',
			type: QUEST_TYPES.kill,
			size: MAP_SIZES.medium,
			zone: ZONES.salubrinHaven,
		},
		{
			level: 8,
			bossName: 'Sergeant Grug',
			description: '',
			type: QUEST_TYPES.kill,
			size: MAP_SIZES.medium,
			zone: ZONES.salubrinHaven,
		},
		// Tendolin Passage Quests
		{
			level: 2,
			bossName: 'Fain the Mauler',
			description: '',
			type: QUEST_TYPES.kill,
			size: MAP_SIZES.medium,
			zone: ZONES.tendolinPassage,
		},
		{
			level: 4,
			bossName: 'Frizzle the Insane',
			description: '',
			type: QUEST_TYPES.kill,
			size: MAP_SIZES.medium,
			zone: ZONES.tendolinPassage,
		},
		{
			level: 6,
			bossName: 'Murglon Arcfist',
			description: '',
			type: QUEST_TYPES.kill,
			size: MAP_SIZES.medium,
			zone: ZONES.tendolinPassage,
		},
		{
			level: 8,
			bossName: 'Gelphon',
			description: '',
			type: QUEST_TYPES.kill,
			size: MAP_SIZES.medium,
			zone: ZONES.tendolinPassage,
		},
		// Greenthorn Cavern Quests
		{
			level: 6,
			bossName: 'Himber',
			description: '',
			type: QUEST_TYPES.kill,
			size: MAP_SIZES.medium,
			zone: ZONES.greenthornCavern,
		},
		{
			level: 8,
			bossName: 'Himber',
			description: '',
			type: QUEST_TYPES.kill,
			size: MAP_SIZES.medium,
			zone: ZONES.greenthornCavern,
		},
		{
			level: 10,
			bossName: 'Himber',
			description: '',
			type: QUEST_TYPES.kill,
			size: MAP_SIZES.medium,
			zone: ZONES.greenthornCavern,
		},
		{
			level: 12,
			bossName: 'Himber',
			description: '',
			type: QUEST_TYPES.kill,
			size: MAP_SIZES.medium,
			zone: ZONES.greenthornCavern,
		},
		{
			level: 14,
			bossName: 'Himber',
			description: '',
			type: QUEST_TYPES.kill,
			size: MAP_SIZES.medium,
			zone: ZONES.greenthornCavern,
		},
		{
			level: 16,
			bossName: 'Himber',
			description: '',
			type: QUEST_TYPES.kill,
			size: MAP_SIZES.medium,
			zone: ZONES.greenthornCavern,
		},
		// Lanfeld Refuge Quests
		{
			level: 1,
			bossName: 'Himber',
			description: '',
			type: QUEST_TYPES.kill,
			size: MAP_SIZES.medium,
			zone: ZONES.lanfeldRefuge,
		},
		// Riven Grotto Quests
		{
			level: 1,
			bossName: 'Himber',
			description: '',
			type: QUEST_TYPES.kill,
			size: MAP_SIZES.medium,
			zone: ZONES.rivenGrotto,
		},
		// Bastille Citadel Quests
		{
			level: 1,
			bossName: 'Himber',
			description: '',
			type: QUEST_TYPES.kill,
			size: MAP_SIZES.medium,
			zone: ZONES.bastilleCitadel,
		},
		// Kordata Cove Quests
		{
			level: 1,
			bossName: 'Himber',
			description: '',
			type: QUEST_TYPES.kill,
			size: MAP_SIZES.medium,
			zone: ZONES.kordataCove,
		},
		// Sylong Sanctuary Quests
		{
			level: 1,
			bossName: 'Himber',
			description: '',
			type: QUEST_TYPES.kill,
			size: MAP_SIZES.medium,
			zone: ZONES.sylongSanctuary,
		},
		// Thule Crypt Quests
		{
			level: 1,
			bossName: 'Himber',
			description: '',
			type: QUEST_TYPES.kill,
			size: MAP_SIZES.medium,
			zone: ZONES.thuleCrypt,
		},
		// Temple of Prenssor Quests
		{
			level: 1,
			bossName: 'Himber',
			description: '',
			type: QUEST_TYPES.kill,
			size: MAP_SIZES.medium,
			zone: ZONES.templeOfPrenssor,
		},
		// Fahnir Citadel Quests
		{
			level: 1,
			bossName: 'Himber',
			description: '',
			type: QUEST_TYPES.kill,
			size: MAP_SIZES.medium,
			zone: ZONES.fahlnirCitadel,
		},
		// Anuran Ruins Quests
		{
			level: 1,
			bossName: 'Himber',
			description: '',
			type: QUEST_TYPES.kill,
			size: MAP_SIZES.medium,
			zone: ZONES.anuranRuins,
		},
		// Galeblast Fortress Quests
		{
			level: 1,
			bossName: 'Himber',
			description: '',
			type: QUEST_TYPES.kill,
			size: MAP_SIZES.medium,
			zone: ZONES.galeblastFortress,
		},
		// Ashenflow Peak Quests
		{
			level: 1,
			bossName: 'Himber',
			description: '',
			type: QUEST_TYPES.kill,
			size: MAP_SIZES.medium,
			zone: ZONES.ashenflowPeak,
		},
	]
	///////////////////////////////////////////

}($, _, TweenMax);