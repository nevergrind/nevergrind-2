loot.chests = {
	base: {
		slots: ['chest'],
		armorType: 'cloth',
	},
	normal: [
		{
			name: 'Robe',
			minArmor: 1,
			maxArmor: 12,
			itemLevel: 1,
			armorType: 'cloth',
			imgIndex: 0,
		}, {
			name: 'Tunic',
			minArmor: 10,
			maxArmor: 24,
			itemLevel: 1,
			armorType: 'leather',
			imgIndex: 1,
		}, {
			name: 'Chain Mail',
			minArmor: 16,
			maxArmor: 32,
			itemLevel: 6,
			armorType: 'mail',
			imgIndex: 2,
		}, {
			name: 'Breast Plate',
			minArmor: 30,
			maxArmor: 50,
			itemLevel: 6,
			armorType: 'plate',
			imgIndex: 3,
		}, {
			name: 'Silk Robe',
			minArmor: 10,
			maxArmor: 25,
			itemLevel: 10,
			armorType: 'cloth',
			imgIndex: 4,
		}, {
			name: 'Jerkin',
			minArmor: 24,
			maxArmor: 45,
			itemLevel: 11,
			armorType: 'leather',
			imgIndex: 5,
		}, {
			name: 'Ring Mail',
			minArmor: 44,
			maxArmor: 76,
			itemLevel: 12,
			armorType: 'mail',
			imgIndex: 6,
		}, {
			name: 'Cuirass',
			minArmor: 65,
			maxArmor: 99,
			itemLevel: 13,
			armorType: 'plate',
			imgIndex: 7,
		}, {
			name: 'Linen Robe',
			minArmor: 28,
			maxArmor: 39,
			itemLevel: 15,
			armorType: 'cloth',
			imgIndex: 8,
		}, {
			name: 'Drape',
			minArmor: 36,
			maxArmor: 50,
			itemLevel: 20,
			armorType: 'cloth',
			imgIndex: 9,
		}, {
			name: 'Leather Armor',
			minArmor: 56,
			maxArmor: 78,
			itemLevel: 20,
			armorType: 'leather',
			imgIndex: 10,
		}, {
			name: 'Studded Armor',
			minArmor: 81,
			maxArmor: 100,
			itemLevel: 24,
			armorType: 'leather',
			imgIndex: 11,
		}, {
			name: 'Scale Mail',
			minArmor: 95,
			maxArmor: 117,
			itemLevel: 24,
			armorType: 'mail',
			imgIndex: 12,
		}, {
			name: 'Kusari Mail',
			minArmor: 127,
			maxArmor: 150,
			itemLevel: 28,
			armorType: 'mail',
			imgIndex: 13,
		}, {
			name: 'Gothic Plate',
			minArmor: 122,
			maxArmor: 153,
			itemLevel: 30,
			armorType: 'plate',
			imgIndex: 14,
		}, {
			name: 'Archon Plate',
			minArmor: 168,
			maxArmor: 200,
			itemLevel: 34,
			armorType: 'plate',
			imgIndex: 15,
		},
	],
	prefix: {
		resists: 30,
		enhancedArmor: 100
	},
	suffix: {
		stats: 30,
		points: 50,
		crit: 40,
	},
	rare: {
		skills: 3,
		allSkills: 2,
	},
	unique: [
		{
			name: 'Robe',
			newName: 'Green Silken Drape',
			enhancedArmor: [25, 30],
			sta: 9,
			dex: 10,
			intel: 5,
			resistPoison: 25,
			addSpellPoison: [6, 10],
			sp: [15, 20],
		}, {
			name: 'Tunic',
			newName: 'Foreman\'s Tunic',
			enhancedArmor: [33, 40],
			handToHand: 2,
			wis: 12,
			str: 12,
			dodge: 2,
			defense: [1, 2],
			resistAll: [10, 15],
		}, {
			name: 'Chain Mail',
			newName: 'Samurai\'s Duty',
			enhancedArmor: [30, 35],
			dodge: [1, 3],
			riposte: [1, 3],
			parry: [1, 3],
			resistAll: [11, 15],
			hp: [16, 20],
			sp: [6, 10],
			addSpellLightning: [7, 12],
		}, {
			name: 'Breast Plate',
			newName: 'Gravelstone Coat',
			enhancedArmor: [30, 45],
			hp: [20, 25],
			mp: [15, 20],
			sp: [15, 20],
			str: 20,
			defense: 2,
			phyMit: 7,
			hpRegen: 3,
			twoHandBlunt: 3,
			twoHandSlash: 3,
		}, {
			name: 'Silk Robe',
			newName: 'Heavenly Garb',
			enhancedArmor: [33, 42],
			mp: 25,
			mpRegen: 2,
			resistAll: [5, 8],
			enhanceArcane: 3,
			resistSilence: [4, 8],
			damageTakenToMana: [4, 6],
		}, {
			name: 'Jerkin',
			newName: 'Ripjaw Hide Vest',
			enhancedArmor: [41, 48],
			attack: 5,
			sta: [11, 15],
			handToHand: [2, 4],
			piercing: 2,
			resistStun: [5, 8],
			resistBlood: [25, 30],
			resistFire: [11, 15],
			hp: [20, 25],
		}, {
			name: 'Ring Mail',
			newName: 'Eagle Claw Armor',
			enhancedArmor: [46, 54],
			hp: 20,
			hpKill: 2,
			piercing: [2, 3],
			allStats: [3, 6],
			resistBlood: 15,
			resistPoison: 20,
			resistIce: 10,
		}, {
			name: 'Cuirass',
			newName: 'Chestplate of the Revenant',
			enhancedArmor: [55, 70],
			str: [17, 25],
			allSkills: 1,
			resistFire: [18, 24],
			resistIce: [18, 24],
			resistArcane: [12, 16],
			resistLightning: [15, 25],
			leech: [2, 3],
			wraith: [2, 3],
		}, {
			name: 'Linen Robe',
			newName: 'Seducer\'s Whisper',
			enhancedArmor: [51, 60],
			mp: [40, 50],
			hp: [30, 35],
			agi: 10,
			intel: 25,
			cha: [35, 40],
			conjuration: [2, 3],
			dodge: 2,
			resistArcane: 35,
			resistPoison: 20,
		}, {
			name: 'Drape',
			newName: 'Metallic-Plated Robe',
			enhancedArmor: [71, 84],
			intel: 11,
			agi: 11,
			evocation: 3,
			mpKill: 5,
			resistIce: 10,
			resistFire: 10,
			enhanceIce: 3,
			enhancedDamageToHumanoids: [4, 6],
			increaseMpPercent: [3, 5],
		}, {
			name: 'Leather Armor',
			newName: 'Twitchthrash',
			enhancedArmor: [55, 66],
			twoHandBlunt: 2,
			dex: [13, 16],
			str: [13, 16],
			resistPoison: 20,
			resistFire: 20,
			hp: 15,
			mp: 20,
			sp: 30,
		}, {
			name: 'Studded Armor',
			newName: 'Brown Chitin Shell',
			enhancedArmor: [77, 85],
			dex: [21, 25],
			sta: [21, 25],
			agi: [21, 25],
			alteration: [2, 3],
			evocation: [2, 3],
			defense: 5,
			phyMit: 3,
			resistAll: [11, 20],
		}, {
			name: 'Scale Mail',
			newName: 'Frost Flicker',
			enhancedArmor: [65, 72],
			conjuration: [2, 3],
			twoHandBlunt: [3, 5],
			wis: [18, 24],
			str: [14, 20],
			resistIce: [25, 30],
			resistLightning: [15, 20],
			resistArcane: [15, 20],
			magMit: 3,
		}, {
			name: 'Kusari Mail',
			newName: 'Fencer\'s Vestments',
			enhancedArmor: [82, 90],
			str: [16, 21],
			sta: 12,
			dex: [16, 21],
			oneHandSlash: [2, 3],
			piercing: [2, 3],
			resistAll: 12,
			reduceTargetArmor: true,
		}, {
			name: 'Gothic Plate',
			newName: 'Dahlia\'s Chestplate',
			enhancedArmor: [75, 88],
			hpRegen: 5,
			hpKill: 7,
			leech: 4,
			resistAll: [10, 15],
			allSkills: [1, 2],
			addSpellBlood: [5, 10],
			addSpellArcane: [5, 10],
		}, {
			name: 'Archon Plate',
			newName: 'Silks of the Guardian',
			enhancedArmor: [95, 110],
			dex: 30,
			wraith: [3, 5],
			mpKill: [4, 7],
			resistLightning: [35, 42],
			resistArcane: [25, 35],
			resistFire: [36, 50],
			allSkills: 1,
			enhancedDamageToBeasts: [5, 9],
			//restInPeace: true,
		},
	]
}