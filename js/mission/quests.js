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
	quests = [{},
		{
			level: 1,
			title: 'Kill Himber',
			description: '',
			imgIndex: 1,
			type: QUEST_TYPES.kill,
			size: 'large',
		},
		{
			level: 2,
			title: 'Kill Fahesh',
			description: '',
			imgIndex: 2,
			type: QUEST_TYPES.kill,
			size: 'small',
		},
		{
			level: 3,
			title: 'Kill Umusaq',
			description: '',
			imgIndex: 1,
			type: QUEST_TYPES.kill,
			size: 'small',
		},
		{
			level: 5,
			title: 'Kill Aslan',
			description: '',
			imgIndex: 2,
			type: QUEST_TYPES.kill,
			size: 'small',
		},
		{
			level: 7,
			title: 'Kill Gaurav',
			description: '',
			imgIndex: 1,
			type: QUEST_TYPES.kill,
			size: 'small',
		},
	]
	///////////////////////////////////////////

}($, _, TweenMax);