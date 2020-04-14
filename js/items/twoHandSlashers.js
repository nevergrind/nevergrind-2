loot.twoHandSlashers = {
	base: {
		slots: ['primary'],
		weaponSkill: 'Two-hand Slash',
	},
	normal: [
		{
			name: 'Giant Sword',
			minDamage: 7,
			maxDamage: 13,
			speed: 4.2, // 4.76
			itemLevel: 1,
			imgIndex: 0,
		}, {
			name: 'Giant Axe',
			minDamage: 10,
			maxDamage: 19,
			speed: 4.4, // 6.59
			itemLevel: 5,
			imgIndex: 1,
		}, {
			name: 'Champion Sword',
			minDamage: 14,
			maxDamage: 26,
			speed: 4.5, // 8.88
			itemLevel: 10,
			imgIndex: 2,
		}, {
			name: 'Bastard Sword',
			minDamage: 18,
			maxDamage: 39,
			speed: 4.2, // 13.2
			itemLevel: 15,
			imgIndex: 3,
		}, {
			name: 'Gothic Axe',
			minDamage: 27,
			maxDamage: 53,
			speed: 4.2, // 18.97
			itemLevel: 20,
			imgIndex: 4,
		}, {
			name: 'Katana',
			minDamage: 34,
			maxDamage: 67,
			speed: 3.9, // 25.89
			itemLevel: 25,
			imgIndex: 5,
		}, {
			name: 'Colossus Sword',
			minDamage: 49,
			maxDamage: 92,
			speed: 4.2, // 33.57
			itemLevel: 30,
			imgIndex: 6,
		}, {
			name: 'Mythical Sword',
			minDamage: 67,
			maxDamage: 118,
			speed: 4.4, // 42.04
			itemLevel: 35,
			imgIndex: 7,
		},
	],
	prefix: {
		enhancedDamage: 100,
		skills: 6,
		attack: 200,
	},
	suffix: {
		stats: 30,
		points: 80,
		crit: 40,
		leech: 10,
		wraith: 10,
		haste: 40,
	},
	rare: {
		addDamage: 20,
	},
	unique: [
		{
			name: 'Giant Sword',
			newName: 'Obsidian Flamberge',
			enhancedDamage: [110, 125],
			attack: [10, 15],
			allStats: [5, 8],
			leech: [4, 5],
			crit: [10, 15],
			twoHandSlash: [3, 4],
			addFire: [8, 12],
			evocation: 3,
			parry: 5,
			spRegen: [5, 7],
			enhanceFire: [3, 5],
		}, {
			name: 'Giant Axe',
			newName: 'Silvery Two-handed Axe',
			enhancedDamage: [85, 120],
			attack: [17, 24],
			mp: [30, 40],
			hp: [15, 25],
			allStats: 5,
			resistAll: [8, 12],
			allSkills: 1,
			addIce: [24, 32],
			mpRegen: [4, 6],
			enhancedDamageToDemons: [8, 14],
			magMit: [4, 6],
		}, {
			name: 'Champion Sword',
			newName: 'Blackened Iron Bastard Sword',
			enhancedDamage: [105, 124],
			attack: [15, 26],
			hp: [20, 40],
			defense: [3, 5],
			parry: [3, 5],
			riposte: [3, 5],
			dodge: [2, 4],
			twoHandSlash: [2, 4],
			enhancedDamageToBeasts: [7, 14],
			resistStun: 12,
			reduceHealing: [12, 16],
		}, {
			name: 'Bastard Sword',
			newName: 'Gigantic Frostreaper',
			enhancedDamage: [103, 127],
			attack: [16, 24],
			hp: 45,
			leech: [5, 7],
			allStats: [8, 12],
			addSpellIce: [12, 16],
			resistIce: 50,
			parry: [4, 5],
			restInPeace: true,
		}, {
			name: 'Gothic Axe',
			newName: 'Executioner\'s Axe',
			enhancedDamage: [120, 150],
			attack: [20, 26],
			mp: 35,
			str: 30,
			crit: [25, 32],
			resistFear: 8,
			twoHandSlash: [3, 5],
			leech: 7,
			resistAll: [6, 12],
			enhanceArcane: [3, 5],
			addIce: [20, 25],
			enhancedDamageToUndead: [12, 16],
		}, {
			name: 'Katana',
			newName: 'Mithril Two-handed Sword',
			enhancedDamage: [113, 131],
			attack: [26, 33],
			addFire: [8, 12],
			addLightning: [4, 16],
			resistAll: [10, 15],
			wraith: [6, 8],
			crit: [10, 20],
			offense: [3, 5],
			spRegen: [5, 8],
			resistSilence: [12, 20],
		}, {
			name: 'Colossus Sword',
			newName: 'Lamentation Blade',
			enhancedDamage: [100, 125],
			attack: [28, 36],
			str: [30, 35],
			sta: [20, 25],
			leech: [5, 7],
			wraith: [5, 7],
			resistAll: [12, 16],
			addIce: [15, 22],
			enhancePoison: [4, 6],
			enhancedDamageToHumanoids: [3, 5],
			enhancedDamageToEldritch: [6, 8],
			resistFrozen: [15, 20],
		}, {
			name: 'Mythical Sword',
			newName: 'Razing Sword of Carthenage',
			enhancedDamage: [105, 120],
			attack: [33, 42],
			addSpellFire: [18, 25],
			crit: [35, 45],
			allStats: [12, 15],
			allSkills: [1, 2],
			resistFire: [25, 35],
			resistArcane: [25, 35],
			enhancedDamageToDragonkin: [7, 12],
			resistStun: [12, 16],
			resistFear: [12, 16],
		},
	]
}