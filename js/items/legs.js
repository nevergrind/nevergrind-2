items.legs = {
	base: {
		slots: ['legs'],
		armorType: 'cloth',
	},
	normal: [
		{
			name: 'Pants',
			minArmor: 7,
			maxArmor: 12,
			itemLevel: 1,
		}, {
			name: 'Cotton Pants',
			minArmor: 13,
			maxArmor: 16,
			itemLevel: 5,
		}, {
			name: 'Linen Pants',
			minArmor: 18,
			maxArmor: 21,
			itemLevel: 12,
		}, {
			name: 'Silk Leggings',
			minArmor: 22,
			maxArmor: 25,
			itemLevel: 20,
		}, {
			name: 'Fur Pants',
			minArmor: 14,
			maxArmor: 18,
			itemLevel: 5,
			armorType: 'leather',
		}, {
			name: 'Patched Pants',
			minArmor: 25,
			maxArmor: 29,
			itemLevel: 10,
			armorType: 'leather',
		}, {
			name: 'Tanned Legs',
			minArmor: 35,
			maxArmor: 42,
			itemLevel: 17,
			armorType: 'leather',
		}, {
			name: 'Studded Legs',
			minArmor: 45,
			maxArmor: 50,
			itemLevel: 21,
			armorType: 'leather',
		}, {
			name: 'Scaled Legs',
			minArmor: 37,
			maxArmor: 44,
			itemLevel: 15,
			armorType: 'mail',
		}, {
			name: 'Chausses',
			minArmor: 47,
			maxArmor: 55,
			itemLevel: 21,
			armorType: 'mail',
		}, {
			name: 'Kusazuri',
			minArmor: 58,
			maxArmor: 66,
			itemLevel: 25,
			armorType: 'mail',
		}, {
			name: 'Poleyn',
			minArmor: 69,
			maxArmor: 75,
			itemLevel: 29,
			armorType: 'mail',
		}, {
			name: 'Cobalt Legplates',
			minArmor: 49,
			maxArmor: 56,
			itemLevel: 20,
			armorType: 'plate',
		}, {
			name: 'Iron Legplates',
			minArmor: 65,
			maxArmor: 74,
			itemLevel: 25,
			armorType: 'plate',
		}, {
			name: 'Mithril Legplates',
			minArmor: 78,
			maxArmor: 87,
			itemLevel: 28,
			armorType: 'plate',
		}, {
			name: 'Royal Legplates',
			minArmor: 89,
			maxArmor: 100,
			itemLevel: 33,
			armorType: 'plate',
		},
	],
	prefix: {
		resists: 30,
		enhancedArmor: 100
	},
	suffix: {
		stats: 30,
		points: 40,
	},
	rare: {
		skills: 3,
	},
	unique: [
		{
			name: 'Pants',
			newName: 'Imbued Viperskin',
			enhancedArmor: [11, 20],
			hp: [18, 24],
			agi: [11, 15],
			evocation: 2,
			resistFire: [12, 16],
			resistPoison: 25,
			piercing: 3,
		}, {
			name: 'Cotton Pants',
			newName: 'Villainous Lordship Pants',
			enhancedArmor: [24, 37],
			mp: 35,
			resistArcane: 15,
			mpKill: [4, 6],
			crit: [7, 10],
			sp: [20, 24],
			cha: [12, 18],
		}, {
			name: 'Linen Pants',
			newName: 'Mystical Vizier\'s Pants',
			enhancedArmor: [45, 63],
			crit: [18, 24],
			sp: [28, 35],
			conjuration: [2, 3],
			evocation: [4, 6],
			addSpellAll: [4, 6],
		}, {
			name: 'Silk Leggings',
			newName: 'Fantoam Pantaloons',
			enhancedArmor: [72, 80],
			hp: 50,
			mp: 35,
			intel: [15, 20],
			allSkills: [1, 2],
			resistAll: [8, 12],
		}, {
			name: 'Fur Pants',
			newName: 'Exalted Furs',
			enhancedArmor: [15, 22],
			allStats: [3, 6],
			phyMit: 3,
			mpRegen: [2, 3],
			resistArcane: [15, 20],
			resistIce: [25, 30],
			archery: [2, 3],
			attack: [7, 10],
		}, {
			name: 'Patched Pants',
			newName: 'Abyssimal Pants',
			enhancedArmor: [29, 42],
			sta: [12, 15],
			wis: [17, 20],
			dodge: [4, 6],
			enhanceArcane: [2, 3],
			resistAll: [6, 9],
		}, {
			name: 'Tanned Legs',
			newName: 'Ethereal Kraken Leggings',
			enhancedArmor: [55, 68],
			parry: [3, 5],
			defense: [4, 6],
			dodge: [3, 5],
			cannotBeStunned: true,
			resistIce: [25, 35],
			enhancedDamageToEldritch: [5, 8],
		}, {
			name: 'Studded Legs',
			newName: 'Friar\'s Penance',
			enhancedArmor: [78, 85],
			resistAll: 10,
			magMit: [4, 7],
			phyMit: [5, 8],
			hp: 35,
			sp: 15,
			str: 15,
			wis: 20,
		}, {
			name: 'Scaled Legs',
			newName: 'Accursed Serenity Leggings',
			enhancedArmor: [17, 24],
			agi: [8, 12],
			dex: [18, 25],
			resistArcane: [20, 30],
			resistIce: [15, 22],
			resistFire: [15, 22],
			addSpellLightning: [5, 9],
			addSpellArcane: [5, 9],
		}, {
			name: 'Chausses',
			newName: 'Vorpal Leggings',
			enhancedArmor: [30, 48],
			hp: [30, 35],
			mp: [20, 25],
			sp: [20, 25],
			wis: 25,
			mpRegen: [3, 5],
			enhancePoison: [3, 5],
		}, {
			name: 'Kusazuri',
			newName: 'Honored Samurai Legplates',
			enhancedArmor: [58, 72],
			leech: [3, 6],
			riposte: [2, 3],
			parry: [2, 3],
			dex: 35,
			addSpellFire: [6, 10],
			addSpellBlood: [6, 10],
		}, {
			name: 'Poleyn',
			newName: 'Haunted Wail',
			enhancedArmor: [82, 94],
			twoHandSlash: 3,
			conjuration: [4, 6],
			allStats: [8, 12],
			addSpellArcane: [8, 12],
			resistIce: [18, 24],
			resistPoison: [12, 16],
			enhancedDamageToUndead: [5, 7],
		}, {
			name: 'Cobalt Legplates',
			newName: 'Eternal Annihilator Legplates',
			enhancedArmor: [18, 26],
			hp: 25,
			str: 20,
			hpKill: 12,
			spKill: 5,
			resistAll: [7, 12],
			enhancedDamageToHumanoids: [4, 6],
		}, {
			name: 'Iron Legplates',
			newName: 'Sinister Legplates',
			enhancedArmor: [36, 51],
			offense: [4, 6],
			attack: 10,
			sta: [10, 15],
			allSkills: [1, 2],
			resistBlood: [11, 20],
			resistArcane: [11, 20],
		}, {
			name: 'Mithril Legplates',
			newName: 'Forlorn Lover\'s Legplates',
			enhancedArmor: [64, 76],
			cha: [21, 30],
			dex: [15, 20],
			mpKill: 15,
			resistArcane: 40,
			resistFire: 25,
			resistPoison: 20,
			cannotBeSilenced: true,
		}, {
			name: 'Royal Legplates',
			newName: 'Doomhaunch',
			enhancedArmor: [85, 104],
			hp: 50,
			str: 15,
			agi: 25,
			crit: [18, 25],
			addSpellPoison: [7, 10],
			addSpellFire: [7, 10],
			allSkills: 1,
		},
	]
}