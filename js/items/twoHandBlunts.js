loot.twoHandBlunts = {
	base: {
		slots: ['primary'],
		weaponSkill: 'Two-hand Blunt',
	},
	normal: [
		{
			name: 'Giant Mace',
			minDamage: 6,
			maxDamage: 15,
			speed: 4.4, // 4.77
			itemLevel: 1,
			imgIndex: 0,
		}, {
			name: 'Maul',
			minDamage: 7,
			maxDamage: 23,
			speed: 4.6, // 6.52
			itemLevel: 5,
			imgIndex: 1,
		}, {
			name: 'Mallet',
			minDamage: 11,
			maxDamage: 32,
			speed: 4.7, // 9.15
			itemLevel: 10,
			imgIndex: 2,
		}, {
			name: 'War Hammer',
			minDamage: 16,
			maxDamage: 46,
			speed: 4.4, // 14.1
			itemLevel: 15,
			imgIndex: 3,
		}, {
			name: 'Great Maul',
			minDamage: 23,
			maxDamage: 66,
			speed: 4.4, // 20.22
			itemLevel: 20,
			imgIndex: 4,
		}, {
			name: 'Sledgehammer',
			minDamage: 30,
			maxDamage: 78,
			speed: 4.1, // 26.34
			itemLevel: 25,
			imgIndex: 5,
		}, {
			name: 'Giant Hammer',
			minDamage: 45,
			maxDamage: 106,
			speed: 4.4, // 34.32
			itemLevel: 30,
			imgIndex: 6,
		}, {
			name: 'Thunder Hammer',
			minDamage: 63,
			maxDamage: 133,
			speed: 4.4, // 44.54
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
			name: 'Giant Mace',
			newName: 'Crushflange',
			enhancedDamage: [80, 110],
			attack: [10, 15],
			addArcane: [6, 9],
			str: [10, 15],
			sta: [6, 8],
			sp: [25, 30],
			resistStun: [7, 10],
			resistFire: 15,
			resistArcane: 15,
			damageTakenToMana: [6, 10],
		}, {
			name: 'Maul',
			newName: 'Runic Warhammer',
			enhancedDamage: [100, 124],
			attack: [13, 16],
			hpRegen: [3, 5],
			crit: 5,
			sta: [16, 20],
			wis: [12, 16],
			intel: [12, 16],
			magMit: 8,
			addArcane: [8, 12],
			slowsTarget: 15,
			spKill: [7, 10],
		}, {
			name: 'Mallet',
			newName: 'Midnight Mallet',
			enhancedDamage: [115, 140],
			attack: [18, 24],
			wraith: [5, 7],
			phyMit: 8,
			allSkills: 1,
			defense: [2, 4],
			addIce: [7, 11],
			resistSilence: 10,
			enhancedDamageToUndead: [5, 8],
			ignoreTargetArmor: true,
		}, {
			name: 'War Hammer',
			newName: 'Ogre War Maul',
			enhancedDamage: [125, 150],
			attack: [20, 25],
			leech: [5, 7],
			str: 30,
			sta: 30,
			addBlood: [9, 12],
			resistStun: 10,
			crit: [20, 30],
			addSpellPoison: [4, 8],
			addSpellIce: [3, 5],
		}, {
			name: 'Great Maul',
			newName: 'Bonesnap',
			enhancedDamage: [102, 118],
			attack: [23, 28],
			str: 25,
			dex: 15,
			leech: [5, 8],
			resistFire: 25,
			resistIce: 25,
			allSkills: 2,
			reduceTargetArmor: [5, 8],
			resistParalyze: 12,
		}, {
			name: 'Sledgehammer',
			newName: 'Blighthammer',
			enhancedDamage: [110, 127],
			attack: [20, 25],
			crit: 25,
			allStats: [8, 12],
			leech: [5, 8],
			wraith: [5, 8],
			resistFear: [10, 15],
			alteration: [3, 5],
			conjuration: [3, 5],
			addPoison: [12, 15],
		}, {
			name: 'Giant Hammer',
			newName: 'Steeldriver',
			enhancedDamage: [100, 120],
			attack: [27, 33],
			crit: [28, 35],
			leech: 7,
			twoHandBlunt: [4, 6],
			riposte: [3, 5],
			enhancedDamageToUndead: [6, 10],
			addIce: [8, 10],
			addLightning: [5, 9],
			addSpellLightning: [5, 9],
			addSpellIce: [8, 10],
		}, {
			name: 'Thunder Hammer',
			newName: 'Gerke\'s Toy',
			enhancedDamage: [100, 150],
			attack: [20, 40],
			allStats: [5, 15],
			wraith: 9,
			hpRegen: 5,
			spRegen: 5,
			crit: 50,
			twoHandBlunt: 5,
			enhanceBlood: [3, 5],
			enhancePoison: [3, 5],
			resistStun: 25,
			increaseHpPercent: [2, 10],
		},
	]
}