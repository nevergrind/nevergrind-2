loot.gloves = {
	base: {
		slots: ['hands'],
		armorType: 'cloth',
	},
	normal: [
		{
			name: 'Gloves',
			minArmor: 1,
			maxArmor: 4,
			itemLevel: 1,
			armorType: 'cloth',
			imgIndex: 0,
		}, {
			name: 'Cloth Gloves',
			minArmor: 5,
			maxArmor: 8,
			itemLevel: 5,
			armorType: 'cloth',
			imgIndex: 1,
		}, {
			name: 'Woven Gloves',
			minArmor: 9,
			maxArmor: 11,
			itemLevel: 12,
			armorType: 'cloth',
			imgIndex: 2,
		}, {
			name: 'Mesh Gloves',
			minArmor: 12,
			maxArmor: 15,
			itemLevel: 22,
			armorType: 'cloth',
			imgIndex: 3,
		}, {
			name: 'Patchwork Gloves',
			minArmor: 6,
			maxArmor: 10,
			itemLevel: 5,
			armorType: 'leather',
			imgIndex: 4,
		}, {
			name: 'Drakescale Gloves',
			minArmor: 13,
			maxArmor: 17,
			itemLevel: 9,
			armorType: 'leather',
			imgIndex: 5,
		}, {
			name: 'Twill Gloves',
			minArmor: 21,
			maxArmor: 24,
			itemLevel: 14,
			armorType: 'leather',
			imgIndex: 6,
		}, {
			name: 'Studded Gloves',
			minArmor: 26,
			maxArmor: 30,
			itemLevel: 24,
			armorType: 'leather',
			imgIndex: 7,
		}, {
			name: 'Lamellar Gloves',
			minArmor: 23,
			maxArmor: 27,
			itemLevel: 6,
			armorType: 'mail',
			imgIndex: 8,
		}, {
			name: 'Chain Gauntlets',
			minArmor: 31,
			maxArmor: 35,
			itemLevel: 14,
			armorType: 'mail',
			imgIndex: 9,
		}, {
			name: 'Kusari Gauntlets',
			minArmor: 37,
			maxArmor: 40,
			itemLevel: 20,
			armorType: 'mail',
			imgIndex: 10,
		}, {
			name: 'Brigandine Gauntlets',
			minArmor: 41,
			maxArmor: 45,
			itemLevel: 27,
			armorType: 'mail',
			imgIndex: 11,
		}, {
			name: 'Cobalt Gauntlets',
			minArmor: 32,
			maxArmor: 36,
			itemLevel: 6,
			armorType: 'plate',
			imgIndex: 12,
		}, {
			name: 'Ornate Gauntlets',
			minArmor: 39,
			maxArmor: 44,
			itemLevel: 14,
			armorType: 'plate',
			imgIndex: 13,
		}, {
			name: 'Tetrarch Gauntlets',
			minArmor: 48,
			maxArmor: 53,
			itemLevel: 23,
			armorType: 'plate',
			imgIndex: 14,
		}, {
			name: 'Gilded Gauntlets',
			minArmor: 56,
			maxArmor: 60,
			itemLevel: 32,
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
		ease: 2,
	},
	rare: {
		attack: 10,
		skills: 3,
		addDamage: 10,
	},
	unique: [
		{
			name: 'Gloves',
			newName: 'The Hand of Armetrin',
			enhancedArmor: [12, 16],
			mp: [10, 15],
			mpRegen: [1, 2],
			leech: [2, 3],
			hpKill: 2,
			mpKill: 2,
			defense: 1,
			resistPoison: [7, 10].map(util.divideBy4),
			resistFire: [7, 10].map(util.divideBy4),
		}, {
			name: 'Cloth Gloves',
			newName: 'Dusty Bloodstained Gloves',
			enhancedArmor: [22, 33],
			mp: 20,
			intel: [8, 12],
			evocation: [2, 3],
			resistArcane: 9,
			resistBlood: 5,
			resistLightning: 9,
		}, {
			name: 'Woven Gloves',
			newName: 'Gauntlets of Omnipotence',
			enhancedArmor: [37, 44],
			evocation: [2, 4],
			intel: 12,
			mpKill: 3,
			enhanceIce: [2, 4],
			resistIce: [11, 15].map(util.divideBy4),
			resistArcane: [6, 10].map(util.divideBy4),
		}, {
			name: 'Mesh Gloves',
			newName: 'Luminescent Touch',
			enhancedArmor: [55, 63],
			hp: 12,
			crit: 5,
			allStats: 5,
			resistAll: [3, 5],
			addSpellArcane: [3, 5],
			sp: 9,
		}, {
			name: 'Patchwork Gloves',
			newName: 'Bloodfist Gloves',
			enhancedArmor: [13, 21],
			hp: 25,
			oneHandBlunt: [2, 3],
			leech: [3, 5],
			defense: [1, 2],
			resistBlood: 6,
			addSpellBlood: [4, 7],
		}, {
			name: 'Drakescale Gloves',
			newName: 'Greenthorn Hide Gloves',
			enhancedArmor: [28, 34],
			hp: [16, 20],
			mp: [11, 15],
			dex: 9,
			sta: 9,
			dodge: 3,
			conjuration: 2,
		}, {
			name: 'Twill Gloves',
			newName: 'Griffon Talon Gloves',
			enhancedArmor: [42, 58],
			mp: 15,
			hpKill: 3,
			leech: [3, 4],
			offense: [2, 3],
			parry: 3,
			resistLightning: [12, 16].map(util.divideBy4),
		}, {
			name: 'Studded Gloves',
			newName: 'Impskin Gloves',
			enhancedArmor: [72, 88],
			mp: [16, 20],
			wis: 12,
			intel: 12,
			leech: 2,
			resistPoison: [8, 15].map(util.divideBy4),
			resistFire: [8, 15].map(util.divideBy4),
		}, {
			name: 'Lamellar Gloves',
			newName: 'Merchant\'s Guards',
			enhancedArmor: [14, 24],
			sp: [7, 10],
			defense: 2,
			attack: 7,
			cha: [15, 20],
			wis: [8, 12],
			riposte: [2, 3],
			spRegen: [2, 4],
		}, {
			name: 'Chain Gauntlets',
			newName: 'Sorcerer\'s Gauntlets',
			enhancedArmor: [33, 48],
			mp: [16, 20],
			defense: 2,
			enhanceFire: [2, 3],
			mpRegen: [2, 3],
			wraith: 3,
			resistAll: 5,
		}, {
			name: 'Kusari Gauntlets',
			newName: 'Moss Etched Gauntlets',
			enhancedArmor: [53, 67],
			mp: 16,
			hp: 24,
			attack: [8, 15],
			resistAll: [7, 10],
			sp: [10, 15],
		}, {
			name: 'Brigandine Gauntlets',
			newName: 'Sage\'s Acumen',
			enhancedArmor: [82, 99],
			addSpellFire: [5, 10],
			addSpellIce: [4, 8],
			hp: [12, 16],
			mp: [25, 34],
			resistFire: 6,
			resistLightning: 3,
		}, {
			name: 'Cobalt Gauntlets',
			newName: 'Frostburn Grips',
			enhancedArmor: [14, 23],
			mp: [25, 35],
			wis: 10,
			intel: 7,
			evocation: [1, 2],
			wraith: [3, 5],
			defense: 3,
			increaseMpPercent: [3, 5],
		}, {
			name: 'Ornate Gauntlets',
			newName: 'Junon\'s Gleaming Gauntlets',
			enhancedArmor: [35, 51],
			hpKill: 5,
			leech: [2, 4],
			cha: [15, 25],
			sp: [7, 12],
			conjuration: [2, 3],
			alteration: [2, 3],
		}, {
			name: 'Tetrarch Gauntlets',
			newName: 'Charred Gauntlets',
			enhancedArmor: [63, 79],
			mp: 15,
			wis: 8,
			mpKill: 3,
			sta: 7,
			defense: [1, 2],
			addSpellFire: [4, 8],
			sp: [7, 10],
			leech: [3, 4],
		}, {
			name: 'Gilded Gauntlets',
			newName: 'Gauntlets of Brute Strength',
			enhancedArmor: [83, 96],
			sta: [12, 15],
			str: [20, 25],
			twoHandSlash: [2, 4],
			twoHandBlunt: [2, 4],
			crit: [15, 20],
			resistBlood: [15, 20].map(util.divideBy4),
			resistFear: [6, 9],
		},
	]
}