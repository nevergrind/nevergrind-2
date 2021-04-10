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
	quests = [{
			level: 1,
			title: 'Kill Himber',
			bossName: 'Himber',
			description: '',
			imgIndex: 1,
			maxLevel: 2,
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
	]
	///////////////////////////////////////////

}($, _, TweenMax);