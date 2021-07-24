loot.shoulders = {
	base: {
		slots: ['shoulder'],
		armorType: 'cloth',
	},
	normal: [
		{
			name: 'Drape',
			minArmor: 1,
			maxArmor: 4,
			itemLevel: 1,
			armorType: 'cloth',
			imgIndex: 0,
		}, {
			name: 'Leather Shoulders',
			minArmor: 4,
			maxArmor: 8,
			itemLevel: 6,
			armorType: 'leather',
			imgIndex: 1,
		}, {
			name: 'Scaled Mantle',
			minArmor: 8,
			maxArmor: 16,
			itemLevel: 6,
			armorType: 'mail',
			imgIndex: 2,
		}, {
			name: 'Spaulders',
			minArmor: 20,
			maxArmor: 30,
			itemLevel: 6,
			armorType: 'plate',
			imgIndex: 3,
		}, {
			name: 'Woven Drape',
			minArmor: 2,
			maxArmor: 8,
			itemLevel: 12,
			armorType: 'cloth',
			imgIndex: 4,
		}, {
			name: 'Studded Shoulders',
			minArmor: 6,
			maxArmor: 15,
			itemLevel: 12,
			armorType: 'leather',
			imgIndex: 5,
		}, {
			name: 'Chain Mantle',
			minArmor: 15,
			maxArmor: 33,
			itemLevel: 15,
			armorType: 'mail',
			imgIndex: 6,
		}, {
			name: 'Mithril Pauldron',
			minArmor: 27,
			maxArmor: 43,
			itemLevel: 16,
			armorType: 'plate',
			imgIndex: 7,
		}, {
			name: 'Shawl',
			minArmor: 4,
			maxArmor: 12,
			itemLevel: 18,
			armorType: 'cloth',
			imgIndex: 8,
		}, {
			name: 'Spiked Shoulders',
			minArmor: 12,
			maxArmor: 24,
			itemLevel: 18,
			armorType: 'leather',
			imgIndex: 9,
		}, {
			name: 'Kusari Mantle',
			minArmor: 30,
			maxArmor: 48,
			itemLevel: 28,
			armorType: 'mail',
			imgIndex: 10,
		}, {
			name: 'Sode',
			minArmor: 34,
			maxArmor: 53,
			itemLevel: 28,
			armorType: 'plate',
			imgIndex: 11,
		}, {
			name: 'Archon Shawl',
			minArmor: 8,
			maxArmor: 15,
			itemLevel: 24,
			armorType: 'cloth',
			imgIndex: 12,
		}, {
			name: 'Brigand Shoulders',
			minArmor: 18,
			maxArmor: 30,
			itemLevel: 24,
			armorType: 'leather',
			imgIndex: 13,
		}, {
			name: 'Laminar Mantle',
			minArmor: 33,
			maxArmor: 60,
			itemLevel: 32,
			armorType: 'mail',
			imgIndex: 14,
		}, {
			name: 'Monarch Pauldrons',
			minArmor: 44,
			maxArmor: 60,
			itemLevel: 34,
			armorType: 'plate',
			imgIndex: 15,
		},
	],
	prefix: {
		resists: 20,
		enhancedArmor: 100
	},
	suffix: {
		stats: 20,
		points: 25,
		ease: 2,
	},
	rare: {
		skills: 2,
	},
	unique: [
		{
			name: 'Drape',
			newName: 'Gilded Cloth',
			enhancedArmor: [10, 15],
			intel: [5, 8],
			wis: [4, 6],
			alteration: 2,
			crit: [2, 3],
			resistArcane: 4,
			addSpellArcane: [4, 6],
		}, {
			name: 'Leather Shoulders',
			newName: 'Lizardscale Mantle',
			enhancedArmor: [20, 25],
			alteration: 2,
			wis: [5, 7],
			intel: 4,
			resistPoison: [7, 10].map(util.divideBy4),
			resistFire: [5, 8].map(util.divideBy4),
			defense: 2,
		}, {
			name: 'Scaled Mantle',
			newName: 'Guardian\'s Bulwark',
			enhancedArmor: [30, 35],
			mp: 12,
			wis: [6, 8],
			dex: 5,
			addSpellPoison: [2, 4],
			addSpellBlood: [2, 4],
			sp: [11, 15],
		}, {
			name: 'Spaulders',
			newName: 'Blackened Iron Spaulders',
			enhancedArmor: [37, 42],
			hp: 10,
			defense: 2,
			oneHandBlunt: 2,
			oneHandSlash: 2,
			str: 7,
			resistBlood: [8, 12].map(util.divideBy4),
			resistPoison: [6, 8].map(util.divideBy4),
		}, {
			name: 'Woven Drape',
			newName: 'Pegasus Feather Drape',
			enhancedArmor: [20, 25],
			agi: 5,
			dex: 15,
			resistLightning: [10, 15].map(util.divideBy4),
			resistPoison: 2,
			resistFire: 2,
			addSpellLightning: 3,
		}, {
			name: 'Studded Shoulders',
			newName: 'Vagrant\'s Timber',
			enhancedArmor: [35, 40],
			resistAll: [7, 11],
			mpRegen: 2,
			sta: [9, 14],
			sp: [7, 12],
			alteration: [1, 2],
		}, {
			name: 'Chain Mantle',
			newName: 'Bloodstained Mantle',
			enhancedArmor: [25, 30],
			str: [7, 9],
			resistArcane: [11, 15].map(util.divideBy4),
			hpKill: 4,
			leech: [2, 4],
			conjuration: 1,
			addSpellBlood: [4, 6],
		}, {
			name: 'Mithril Pauldron',
			newName: 'Minotaur\'s Sprawl',
			enhancedArmor: [28, 32],
			oneHandSlash: 2,
			hpKill: 4,
			str: [12, 15],
			crit: 4,
			resistLightning: 3,
			spRegen: 2,
		}, {
			name: 'Shawl',
			newName: 'Ringwraith\'s Amice',
			enhancedArmor: [52, 58],
			conjuration: [2, 4],
			alteration: [2, 3],
			dex: [11, 14],
			mpKill: 5,
			resistAll: 13,
			magMit: 3,
		}, {
			name: 'Spiked Shoulders',
			newName: 'Tanaden\'s Spiked Shoulderpads',
			enhancedArmor: [65, 70],
			hp: 15,
			agi: 15,
			offense: 2,
			attack: 15,
			leech: 3,
			resistAll: 5,
			addSpellPoison: [4, 7],
			addSpellArcane: [4, 7],
		}, {
			name: 'Kusari Mantle',
			newName: 'Matsuwari\'s Solace',
			enhancedArmor: [71, 75],
			hp: 20,
			agi: 10,
			dex: [11, 15],
			crit: 3,
			phyMit: 3,
			spRegen: [2, 3],
		}, {
			name: 'Sode',
			newName: 'Golem\'s Shelf',
			enhancedArmor: [82, 88],
			conjuration: [2, 3],
			resistArcane: 6,
			resistIce: 2,
			mp: [11, 15],
			oneHandBlunt: 3,
			addSpellArcane: [3, 6],
		}, {
			name: 'Archon Shawl',
			newName: 'Riptide Shawl',
			enhancedArmor: [85, 92],
			mp: [30, 35],
			sta: [6, 10],
			crit: [4, 7],
			resistIce: [21, 30].map(util.divideBy4),
			evocation: [2, 4],
			addSpellIce: [7, 11],
		}, {
			name: 'Brigand Shoulders',
			newName: 'Prayer Shawl',
			enhancedArmor: [88, 94],
			hp: [31, 35],
			wis: [16, 20],
			dex: 5,
			addSpellArcane: [6, 9],
			alteration: [2, 4],
			spKill: 7,
			enhancedDamageToDemons: [5, 8],
		}, {
			name: 'Laminar Mantle',
			newName: 'Frostwalker\'s Covenant',
			enhancedArmor: [91, 100],
			hp: [24, 30],
			wis: [13, 16],
			twoHandBlunt: [3, 5],
			conjuration: [1, 2],
			resistIce: 6,
			resistPoison: 4,
			addSpellIce: [3, 5],
			increaseMpPercent: [2, 4],
		}, {
			name: 'Monarch Pauldrons',
			newName: 'Carnal Pauldrons',
			enhancedArmor: [96, 105],
			mp: [21, 15],
			mpRegen: [2, 3],
			dex: [17, 20],
			magMit: 5,
			resistAll: 10,
			addSpellArcane: [9, 12],
			addSpellBlood: [5, 8],
			sp: [9, 12],
		},
	]
}