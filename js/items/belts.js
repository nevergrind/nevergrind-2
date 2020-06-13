loot.belts = {
	base: {
		slots: ['waist'],
		armorType: 'cloth',
	},
	normal: [
		{
			name: 'Sash',
			minArmor: 1,
			maxArmor: 2,
			itemLevel: 1,
			armorType: 'cloth',
			imgIndex: 0,
		}, {
			name: 'Linen Sash',
			minArmor: 5,
			maxArmor: 6,
			itemLevel: 15,
			armorType: 'cloth',
			imgIndex: 1,
		}, {
			name: 'Belt',
			minArmor: 4,
			maxArmor: 6,
			itemLevel: 6,
			armorType: 'leather',
			imgIndex: 2,
		}, {
			name: 'Heavy Belt',
			minArmor: 10,
			maxArmor: 12,
			itemLevel: 15,
			armorType: 'leather',
			imgIndex: 3,
		}, {
			name: 'Mesh Belt',
			minArmor: 12,
			maxArmor: 14,
			itemLevel: 6,
			armorType: 'mail',
			imgIndex: 4,
		}, {
			name: 'Splinted Belt',
			minArmor: 19,
			maxArmor: 21,
			itemLevel: 25,
			armorType: 'mail',
			imgIndex: 5,
		}, {
			name: 'Bronze Belt',
			minArmor: 20,
			maxArmor: 22,
			itemLevel: 6,
			armorType: 'plate',
			imgIndex: 6,
		}, {
			name: 'Plated Belt',
			minArmor: 26,
			maxArmor: 28,
			itemLevel: 32,
			armorType: 'plate',
			imgIndex: 7,
		}, {
			name: 'Cord',
			minArmor: 2,
			maxArmor: 4,
			itemLevel: 3,
			armorType: 'cloth',
			imgIndex: 8,
		}, {
			name: 'Arcane Sash',
			minArmor: 6,
			maxArmor: 8,
			itemLevel: 20,
			armorType: 'cloth',
			imgIndex: 9,
		}, {
			name: 'Leather Belt',
			minArmor: 8,
			maxArmor: 10,
			itemLevel: 12,
			armorType: 'leather',
			imgIndex: 10,
		}, {
			name: 'Woven Sash',
			minArmor: 13,
			maxArmor: 15,
			itemLevel: 22,
			armorType: 'leather',
			imgIndex: 11,
		}, {
			name: 'Girdle',
			minArmor: 16,
			maxArmor: 18,
			itemLevel: 22,
			armorType: 'mail',
			imgIndex: 12,
		}, {
			name: 'Chain Belt',
			minArmor: 22,
			maxArmor: 24,
			itemLevel: 30,
			armorType: 'mail',
			imgIndex: 13,
		}, {
			name: 'Monarch Belt',
			minArmor: 23,
			maxArmor: 25,
			itemLevel: 27,
			armorType: 'plate',
			imgIndex: 14,
		}, {
			name: 'Mithril Belt',
			minArmor: 28,
			maxArmor: 30,
			itemLevel: 30,
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
		crit: 20,
		leech: 5,
		wraith: 5,
	},
	rare: {
		attack: 10,
		skills: 2,
		addDamage: 10,
	},
	unique: [
		{
			name: 'Sash',
			newName: 'Lenymo Sash',
			enhancedArmor: [10, 18],
			crit: [4, 8],
			hp: 15,
			mp: 15,
			sp: 15,
			resistAll: [3, 8],
			mpKill: 3,
		}, {
			name: 'Linen Sash',
			newName: 'Sphinx Hair Cord',
			enhancedArmor: [24, 38],
			phyMit: 2,
			cha: [8, 12],
			intel: 9,
			resistFire: [7, 15],
			resistLightning: [7, 15],
			resistIce: [7, 15],
			addSpellFire: [5, 8],
		}, {
			name: 'Belt',
			newName: 'Snakecord',
			enhancedArmor: [15, 24],
			agi: [3, 5],
			wis: [5, 9],
			hpRegen: 1,
			magMit: 4,
			resistPoison: [9, 12],
			resistBlood: [9, 12],
			defense: [1, 2],
			wraith: [3, 4],
		}, {
			name: 'Heavy Belt',
			newName: 'Frenzied Sash of Kordata',
			enhancedArmor: [28, 42],
			attack: [9, 12],
			addSpellLightning: [4, 6],
			dex: 15,
			agi: [25, 32],
			resistPoison: [11, 15],
			resistFire: [11, 15],
			offense: [1, 2],
		}, {
			name: 'Kusari Belt',
			newName: 'Spinechill Belt',
			enhancedArmor: [17, 25],
			wis: 10,
			resistIce: [17, 21],
			addSpellIce: [5, 8],
			damageTakenToSpirit: [2, 3],
			mpKill: 5,
			mp: [16, 24],
		}, {
			name: 'Splinted Belt',
			newName: 'Sage\'s Clamp',
			enhancedArmor: [29, 44],
			hpKill: [4, 6],
			dodge: 3,
			resistLightning: [9, 13],
			resistArcane: [13, 17],
			addSpellAll: [2, 4],
		}, {
			name: 'Bronze Belt',
			newName: 'Sludged Girdle',
			enhancedArmor: [18, 26],
			cha: [5, 8],
			intel: 12,
			hp: 20,
			mp: 10,
			enhancePoison: [4, 7],
			enhanceArcane: [4, 7],
			addSpellPoison: [2, 4],
		}, {
			name: 'Plated Belt',
			newName: 'Guardian\'s Girdle',
			enhancedArmor: [33, 48],
			hp: 25,
			sta: [6, 10],
			cha: 7,
			defense: [2, 3],
			hpKill: 6,
			resistArcane: 25,
		}, {
			name: 'Cord',
			newName: 'Clasp of Ears',
			enhancedArmor: [52, 65],
			defense: [2, 3],
			leech: [4, 5],
			magMit: [4, 7],
			phyMit: [4, 7],
			resistFear: [5, 7],
		}, {
			name: 'Arcane Sash',
			newName: 'Wraith\'s Lust',
			enhancedArmor: [73, 84],
			intel: [14, 18],
			sta: [11, 15],
			resistFire: [15, 20],
			resistArcane: [15, 20],
			evocation: [2, 3],
			alteration: [1, 2],
		}, {
			name: 'Leather Belt',
			newName: 'Terrorwhip',
			enhancedArmor: [54, 68],
			defense: [2, 3],
			dex: [18, 21],
			sp: [12, 16],
			spRegen: [2, 3],
			reduceHealing: [4, 6],
			spKill: [4, 6],
			enhancedDamageToMystical: [5, 8],
		}, {
			name: 'Woven Sash',
			newName: 'Fairy\'s Trap',
			enhancedArmor: [75, 87],
			mpRegen: [3, 5],
			mp: [14, 20],
			sta: [14, 20],
			wraith: [3, 5],
			sp: 12,
			addSpellArcane: [3, 9],
			enhancedDamageToBeasts: [6, 8],
		}, {
			name: 'Girdle',
			newName: 'Runed Frontier Belt',
			enhancedArmor: [55, 70],
			str: 10,
			dex: 10,
			sta: 10,
			addSpellAll: [2, 4],
			resistArcane: [11, 20],
			resistBlood: [11, 20],
			resistLightning: [11, 20],
		}, {
			name: 'Chain Belt',
			newName: 'Pegasus Belt',
			enhancedArmor: [77, 90],
			agi: [11, 15],
			intel: [11, 15],
			str: [11, 15],
			crit: [11, 15],
			addSpellArcane: [4, 9],
			addSpellLightning: [4, 9],
		}, {
			name: 'Monarch Belt',
			newName: 'Belt of Concordance',
			enhancedArmor: [57, 74],
			str: 10,
			cha: 10,
			resistPoison: 25,
			resistIce: 25,
			allSkills: 1,
		}, {
			name: 'Mithril Belt',
			newName: 'Bile-Etched Obsidian Girdle',
			enhancedArmor: [80, 96],
			sta: 10,
			str: [16, 24],
			dex: 15,
			hp: 40,
			mp: 40,
			resistAll: [4, 6],
			addSpellPoison: [5, 9],
		},
	]
}