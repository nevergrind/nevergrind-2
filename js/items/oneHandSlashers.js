loot.oneHandSlashers = {
	base: {
		slots: ['primary', 'secondary'],
		weaponSkill: 'One-hand Slash',
	},
	normal: [
		{
			name: 'Sword',
			minDamage: 2,
			maxDamage: 6,
			speed: 2.7, // 2.96 - 1.48
			itemLevel: 1,
			imgIndex: 0,
		}, {
			name: 'Scimitar',
			minDamage: 3,
			maxDamage: 8,
			speed: 2.5, // 4.4
			itemLevel: 5,
			imgIndex: 1,
		}, {
			name: 'Axe',
			minDamage: 5,
			maxDamage: 12,
			speed: 2.9, // 5.86
			itemLevel: 10,
			imgIndex: 2,
		}, {
			name: 'Claws',
			minDamage: 7,
			maxDamage: 14,
			speed: 2.4, // 8.75
			itemLevel: 15,
			imgIndex: 3,
		}, {
			name: 'Long Sword',
			minDamage: 9,
			maxDamage: 26,
			speed: 2.8, // 12.5
			itemLevel: 20,
			imgIndex: 4,
		}, {
			name: 'Chokuto',
			minDamage: 11,
			maxDamage: 34,
			speed: 2.6, // 17.3
			itemLevel: 25,
			imgIndex: 5,
		}, {
			name: 'War Axe',
			minDamage: 18,
			maxDamage: 54,
			speed: 3.2, // 22.5
			itemLevel: 30,
			imgIndex: 6,
		}, {
			name: 'Kusanagi',
			minDamage: 20,
			maxDamage: 58,
			speed: 2.7, // 28.88 (this is the unique's DPS)
			itemLevel: 35, // 42.04 - max 63 min 50.4 vs 1hs: 28.8 - max 57.6 min 50.6
			imgIndex: 7,
		},
	],
	prefix: {
		enhancedDamage: 100,
		skills: 3,
		attack: 100,
	},
	suffix: {
		stats: 15,
		points: 40,
		crit: 20,
		leech: 5,
		wraith: 5,
		haste: 40,
		ease: 2,
	},
	rare: {
		addDamage: 10,
	},
	unique: [
		{
			name: 'Sword',
			newName: 'Gladius',
			enhancedDamage: [100, 125],
			attack: [4, 8],
			str: [7, 10],
			agi: 5,
			dex: 5,
			sta: 5,
			crit: 10,
			oneHandSlash: [1, 2],
			addBlood: [5, 7],
		}, {
			name: 'Scimitar',
			newName: 'Iceshard Scimitar',
			enhancedDamage: [115, 130],
			attack: [6, 8],
			hp: 15,
			allStats: [3, 5],
			sp: [10, 20],
			mpKill: 4,
			resistIce: [20, 30],
			addIce: [4, 7],
		}, {
			name: 'Axe',
			newName: 'Minotaur Battle Axe',
			enhancedDamage: [120, 140],
			attack: [5, 10],
			str: 12,
			sta: 8,
			oneHandSlash: [2, 3],
			addBlood: [2, 4],
			addLightning: [2, 4],
		}, {
			name: 'Claws',
			newName: 'Bladed Prenssor Claws',
			enhancedDamage: [80, 120],
			attack: [6, 15],
			dex: [7, 11],
			agi: 13,
			leech: [3, 4],
			crit: [8, 15],
			addPoison: [4, 6],
			allSkills: 1,
			enhancedDamageToDragonkin: [4, 6],
		}, {
			name: 'Long Sword',
			newName: 'Razormaw Cutlass',
			enhancedDamage: [100, 130],
			attack: [8, 14],
			sta: [11, 15],
			magMit: 3,
			leech: [2, 3],
			wraith: [2, 3],
			crit: 7,
			parry: [2, 3],
			riposte: [2, 3],
			addIce: 7,
		}, {
			name: 'Chokuto',
			newName: 'Short Sword of the Crokyn',
			enhancedDamage: [90, 125],
			attack: [12, 16],
			hpKill: 4,
			leech: 3,
			riposte: 3,
			resistAll: [5, 7],
			addArcane: [8, 12],
			enhancedDamageToHumanoids: [3, 5],
		}, {
			name: 'War Axe',
			newName: 'Silvery War Axe',
			enhancedDamage: [80, 120],
			attack: [14, 18],
			crit: [15, 20],
			allStats: [4, 7],
			wraith: [4, 6],
			spRegen: 3,
			allSkills: 1,
			addLightning: [5, 9],
		}, {
			name: 'Kusanagi',
			newName: 'Chromium-Bladed Masamune',
			enhancedDamage: [85, 115], // 20-58 37 - 124 29.9dps
			attack: [16, 20],
			crit: 10,
			allStats: 5,
			wraith: 3,
			allSkills: [1, 2],
			enhancedDamageToDemons: [7, 10],
			addLightning: [6, 10],
			addIce: [6, 10],
		},
	]
}