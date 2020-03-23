loot.piercers = {
	base: {
		slots: ['primary', 'secondary'],
		weaponSkill: 'Piercing',
	},
	normal: [
		{
			name: 'Dagger',
			minDamage: 2,
			maxDamage: 4,
			speed: 2.1, // 2.85
			itemLevel: 1,
		}, {
			name: 'Dirk',
			minDamage: 3,
			maxDamage: 6,
			speed: 2, // 4.57
			itemLevel: 5,
		}, {
			name: 'Kris',
			minDamage: 4,
			maxDamage: 11,
			speed: 2.4, // 6.25
			itemLevel: 10,
		}, {
			name: 'Poignard',
			minDamage: 6,
			maxDamage: 13,
			speed: 2.2, // 8.94
			itemLevel: 15,
		}, {
			name: 'Rondel',
			minDamage: 9,
			maxDamage: 19,
			speed: 2.2, // 12.72
			itemLevel: 20,
		}, {
			name: 'Spear',
			minDamage: 14,
			maxDamage: 31,
			speed: 2.6, // 17.35
			itemLevel: 25,
		}, {
			name: 'Cinquedeas',
			minDamage: 17,
			maxDamage: 33,
			speed: 2.1, // 23.3
			itemLevel: 30,
		}, {
			name: 'Stiletto',
			minDamage: 21,
			maxDamage: 45,
			speed: 2.3, // 29.39
			itemLevel: 35,
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
	},
	rare: {
		addDamage: 10,
	},
	unique: [
		{
			name: 'Dagger',
			newName: 'Whimsical Dagger',
			enhancedDamage: [103, 133],
			attack: [4, 9],
			mp: [15, 25],
			mpKill: 3,
			hpKill: 5,
			sp: [12, 20],
			resistSilence: [8, 12],
			resistArcane: 25,
		}, {
			name: 'Dirk',
			newName: 'The Witch Doctor',
			enhancedDamage: [92, 125],
			attack: [7, 11],
			resistIce: 15,
			resistPoison: 15,
			enhancePoison: [2, 4],
			addPoison: [6, 9],
			intel: [15, 20],
			resistFear: [3, 5],
		}, {
			name: 'Kris',
			newName: 'Sacrificial Dagger',
			enhancedDamage: [80, 110],
			attack: [10, 15],
			mp: [20, 30],
			intel: 10,
			mpRegen: [2, 4],
			leech: [2, 3],
			wraith: [2, 3],
			hpKill: 5,
			piercing: [1, 2],
			addPoison: [3, 5],
		}, {
			name: 'Poignard',
			newName: 'Pugius',
			enhancedDamage: [114, 136],
			attack: [8, 12],
			magMit: 7,
			crit: 15,
			allSkills: 1,
			resistAll: [5, 8],
			addArcane: [7, 9],
			dex: [12, 16],
		}, {
			name: 'Rondel',
			newName: 'Shark Tooth',
			enhancedDamage: [90, 105],
			attack: [11, 15],
			offense: 3,
			piercing: 3,
			leech: [3, 5],
			resistPoison: 10,
			addIce: [3, 5],
			addBlood: [5, 7],
		}, {
			name: 'Spear',
			newName: 'Trident of Edenburg',
			enhancedDamage: [112, 138],
			attack: [12, 16],
			agi: 9,
			sta: 5,
			crit: 5,
			wraith: [3, 5],
			resistAll: 7,
			defense: 3,
			addIce: [7, 12],
		}, {
			name: 'Cinquedeas',
			newName: 'Serrated Bone Cinquedeas',
			enhancedDamage: [118, 145],
			attack: [13, 18],
			resistBlood: 15,
			agi: 15,
			dex: [18, 24],
			piercing: 3,
			crit: 6,
			addArcane: [7, 12],
		}, {
			name: 'Stiletto',
			newName: 'Fanged Skull Carver',
			enhancedDamage: [120, 150],
			attack: [20, 25],
			hpRegen: [2, 3],
			leech: [2, 3],
			resistFear: [8, 12],
			phyMit: [3, 5],
			crit: [9, 13],
			addPoison: [3, 7],
		},
	]
}