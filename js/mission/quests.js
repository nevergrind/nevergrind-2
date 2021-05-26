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
			level: 1, // quest level
			title: 'Kill Himber',
			bossName: 'Himber',
			description: '',
			imgIndex: 1,
			maxLevel: 1, // max mob level
			type: QUEST_TYPES.kill,
			size: MAP_SIZES.large,
			zone: ZONES.salubrinHaven,
		},
		{
			level: 2,
			title: 'Kill Fahesh',
			bossName: 'Fahesh',
			description: '',
			imgIndex: 2,
			maxLevel: 2,
			type: QUEST_TYPES.kill,
			size: MAP_SIZES.small,
			zone: ZONES.salubrinHaven,
		},
		{
			level: 3,
			title: 'Kill Umusaq',
			bossName: 'Umusaq',
			description: '',
			imgIndex: 1,
			maxLevel: 2,
			type: QUEST_TYPES.kill,
			size: MAP_SIZES.small,
			zone: ZONES.salubrinHaven,
		},
		{
			level: 5,
			title: 'Kill Aslan',
			bossName: 'Aslan',
			description: '',
			imgIndex: 2,
			maxLevel: 2,
			type: QUEST_TYPES.kill,
			size: MAP_SIZES.small,
			zone: ZONES.salubrinHaven,
		},
		{
			level: 7,
			title: 'Kill Gaurav',
			bossName: 'Gaurav',
			description: '',
			imgIndex: 1,
			maxLevel: 2,
			type: QUEST_TYPES.kill,
			size: MAP_SIZES.small,
			zone: ZONES.salubrinHaven,
		},
		// Tendolin Passage Quests
		{
			level: 1,
			title: 'Kill Himber',
			bossName: 'Himber',
			description: '',
			imgIndex: 1,
			maxLevel: 1,
			type: QUEST_TYPES.kill,
			size: MAP_SIZES.large,
			zone: ZONES.tendolinPassage,
		},
		// Greenthorn Cavern Quests
		{
			level: 1,
			title: 'Kill Himber',
			bossName: 'Himber',
			description: '',
			imgIndex: 1,
			maxLevel: 2,
			type: QUEST_TYPES.kill,
			size: MAP_SIZES.large,
			zone: ZONES.greenthornCavern,
		},
		// Lanfeld Refuge Quests
		{
			level: 1,
			title: 'Kill Himber',
			bossName: 'Himber',
			description: '',
			imgIndex: 1,
			maxLevel: 2,
			type: QUEST_TYPES.kill,
			size: MAP_SIZES.large,
			zone: ZONES.lanfeldRefuge,
		},
		// Riven Grotto Quests
		{
			level: 1,
			title: 'Kill Himber',
			bossName: 'Himber',
			description: '',
			imgIndex: 1,
			maxLevel: 2,
			type: QUEST_TYPES.kill,
			size: MAP_SIZES.large,
			zone: ZONES.rivenGrotto,
		},
		// Bastille Citadel Quests
		{
			level: 1,
			title: 'Kill Himber',
			bossName: 'Himber',
			description: '',
			imgIndex: 1,
			maxLevel: 2,
			type: QUEST_TYPES.kill,
			size: MAP_SIZES.large,
			zone: ZONES.bastilleCitadel,
		},
		// Kordata Cove Quests
		{
			level: 1,
			title: 'Kill Himber',
			bossName: 'Himber',
			description: '',
			imgIndex: 1,
			maxLevel: 2,
			type: QUEST_TYPES.kill,
			size: MAP_SIZES.large,
			zone: ZONES.kordataCove,
		},
		// Sylong Sanctuary Quests
		{
			level: 1,
			title: 'Kill Himber',
			bossName: 'Himber',
			description: '',
			imgIndex: 1,
			maxLevel: 2,
			type: QUEST_TYPES.kill,
			size: MAP_SIZES.large,
			zone: ZONES.sylongSanctuary,
		},
		// Thule Crypt Quests
		{
			level: 1,
			title: 'Kill Himber',
			bossName: 'Himber',
			description: '',
			imgIndex: 1,
			maxLevel: 2,
			type: QUEST_TYPES.kill,
			size: MAP_SIZES.large,
			zone: ZONES.thuleCrypt,
		},
		// Temple of Prenssor Quests
		{
			level: 1,
			title: 'Kill Himber',
			bossName: 'Himber',
			description: '',
			imgIndex: 1,
			maxLevel: 2,
			type: QUEST_TYPES.kill,
			size: MAP_SIZES.large,
			zone: ZONES.templeOfPrenssor,
		},
		// Fahnir Citadel Quests
		{
			level: 1,
			title: 'Kill Himber',
			bossName: 'Himber',
			description: '',
			imgIndex: 1,
			maxLevel: 2,
			type: QUEST_TYPES.kill,
			size: MAP_SIZES.large,
			zone: ZONES.fahlnirCitadel,
		},
		// Anuran Ruins Quests
		{
			level: 1,
			title: 'Kill Himber',
			bossName: 'Himber',
			description: '',
			imgIndex: 1,
			maxLevel: 2,
			type: QUEST_TYPES.kill,
			size: MAP_SIZES.large,
			zone: ZONES.anuranRuins,
		},
		// Galeblast Fortress Quests
		{
			level: 1,
			title: 'Kill Himber',
			bossName: 'Himber',
			description: '',
			imgIndex: 1,
			maxLevel: 2,
			type: QUEST_TYPES.kill,
			size: MAP_SIZES.large,
			zone: ZONES.galeblastFortress,
		},
		// Ashenflow Peak Quests
		{
			level: 1,
			title: 'Kill Himber',
			bossName: 'Himber',
			description: '',
			imgIndex: 1,
			maxLevel: 2,
			type: QUEST_TYPES.kill,
			size: MAP_SIZES.large,
			zone: ZONES.ashenflowPeak,
		},
	]
	///////////////////////////////////////////

}($, _, TweenMax);