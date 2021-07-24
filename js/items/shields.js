loot.shields = {
	base: {
		slots: ['secondary'],
	},
	normal: [
		{
			name: 'Buckler',
			minArmor: 4,
			maxArmor: 12,
			blockRate: 10,
			itemLevel: 1,
			imgIndex: 0,
		}, {
			name: 'Small Shield',
			minArmor: 10,
			maxArmor: 20,
			blockRate: 12,
			itemLevel: 5,
			imgIndex: 1,
		}, {
			name: 'Kite Shield',
			minArmor: 24,
			maxArmor: 36,
			blockRate: 14,
			itemLevel: 10,
			imgIndex: 2,
		}, {
			name: 'Round Shield',
			minArmor: 35,
			maxArmor: 48,
			blockRate: 16,
			itemLevel: 15,
			imgIndex: 3,
		}, {
			name: 'Gothic Shield',
			minArmor: 53,
			maxArmor: 66,
			blockRate: 18,
			itemLevel: 20,
			imgIndex: 4,
		}, {
			name: 'Crown Shield',
			minArmor: 67,
			maxArmor: 78,
			blockRate: 20,
			itemLevel: 25,
			imgIndex: 5,
		}, {
			name: 'Aegis',
			minArmor: 75,
			maxArmor: 90,
			blockRate: 22,
			itemLevel: 30,
			imgIndex: 6,
		}, {
			name: 'Monarch',
			minArmor: 87,
			maxArmor: 100,
			blockRate: 24,
			itemLevel: 35,
			imgIndex: 7,
		},
	],
	prefix: {
		resists: 40,
		resistAll: 15,
		enhancedArmor: 100,
	},
	suffix: {
		stats: 15,
		points: 50,
		increasedBlock: 20,
		ease: 2,
	},
	rare: {
		skills: 3,
		allSkills: 2,
		regen: 5,
	},
	unique: [
		{
			name: 'Buckler',
			newName: 'Bark Shield',
			enhancedArmor: [10, 21],
			mp: [15, 20],
			agi: 8,
			wis: 8,
			sta: 5,
			resistLightning: [12, 20].map(util.divideBy4),
			leech: [2, 4],
			damageTakenToSpirit: [3, 5],
			alteration: [1, 2],
		}, {
			name: 'Small Shield',
			newName: 'Shiny Brass Shield',
			enhancedArmor: [23, 36],
			hp: 20,
			wis: [5, 10],
			intel: [5, 10],
			phyMit: [3, 5],
			magMit: [3, 5],
			leech: [3, 5],
			hpKill: [5, 7],
			resistArcane: 6,
		}, {
			name: 'Kite Shield',
			newName: 'Shiny Brass Shield',
			enhancedArmor: [31, 45],
			mp: 20,
			wis: [8, 12],
			resistArcane: [10, 15].map(util.divideBy4),
			resistLightning: [10, 15].map(util.divideBy4),
			resistFire: [10, 15].map(util.divideBy4),
			hpKill: [5, 8],
			alteration: [1, 2],
			conjuration: [1, 2],
		}, {
			name: 'Round Shield',
			newName: 'Scute Shield',
			enhancedArmor: [38, 50],
			sta: [9, 12],
			sp: [24, 32],
			oneHandBlunt: [2, 3],
			defense: [2, 3],
			resistParalyze: 15,
			hpKill: 5,
			resistCold: 30,
			resistBlood: 3,
		}, {
			name: 'Gothic Shield',
			newName: 'Crested Viston Shield',
			enhancedArmor: [51, 64],
			hp: [25, 30],
			dex: 12,
			hpKill: 5,
			resistFear: [7, 10],
			leech: [3, 5],
			addSpellArcane: [8, 12],
			resistPoison: 3,
			resistArcane: 3,
			resistLightning: 3,
		}, {
			name: 'Crown Shield',
			newName: 'Chitin Shell Shield',
			enhancedArmor: [65, 77],
			hp: 30,
			mp: 30,
			crit: 5,
			resistPoison: 12,
			resistParalyze: 8,
			resistSilence: 5,
			addPoison: [4, 6],
			spRegen: [2, 4],
		}, {
			name: 'Aegis',
			newName: 'The Bulwark',
			enhancedArmor: [78, 92],
			defense: [4, 5],
			str: 15,
			sp: [30, 40],
			oneHandBlunt: [3, 5],
			leech: [3, 5],
			magMit: [7, 10],
			resistSilence: [10, 15],
			resistAll: [10, 15],
		}, {
			name: 'Monarch',
			newName: 'Steelclash',
			enhancedArmor: [86, 99],
			phyMit: [9, 13],
			parry: [4, 5],
			sp: [45, 56],
			leech: 3,
			wraith: 3,
			allSkills: 1,
			allStats: [7, 10],
			resistAll: [7, 10],
			resistPhysical: [5, 10],
		},
	]
}