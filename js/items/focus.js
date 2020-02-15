items.focus = {
	base: {
		slots: ['primary', 'secondary'],
		weaponSkill: 'One-hand Blunt',
	},
	normal: [
		{
			name: 'Stein',
			minDamage: 1,
			maxDamage: 4,
			speed: 3.6, // 1.4
			itemLevel: 1,
		}, {
			name: 'Dark Orb',
			minDamage: 2,
			maxDamage: 6,
			speed: 3.5, // 2.2
			itemLevel: 5,
		}, {
			name: 'Ancient Tome',
			minDamage: 5,
			maxDamage: 13,
			speed: 3.4, // 5.3
			itemLevel: 10,
		}, {
			name: 'Totem',
			minDamage: 6,
			maxDamage: 20,
			speed: 3.8, // 6.8
			itemLevel: 15,
		}, {
			name: 'Crystal Ball',
			minDamage: 7,
			maxDamage: 24,
			speed: 3.7, // 8.4
			itemLevel: 20,
		}, {
			name: 'Skull',
			minDamage: 9,
			maxDamage: 31,
			speed: 3.4, // 11.8
			itemLevel: 25,
		}, {
			name: 'Emblazoned Orb',
			minDamage: 11,
			maxDamage: 36,
			speed: 3.6, // 13.1
			itemLevel: 30,
		}, {
			name: 'Idol',
			minDamage: 13,
			maxDamage: 43,
			speed: 3.3, // 17
			itemLevel: 35,
		},
	],
	prefix: {
		enhancedDamage: 100,
		castingSkills: 3,
		allSkills: 2,
		attack: 100,
		resists: 30,
		spellPower: 40,
	},
	suffix: {
		stats: 15,
		points: 50,
		crit: 20,
		leech: 5,
		wraith: 5,
		regen: 10,
		haste: 40,
	},
	rare: {
		addDamage: 20,
	},
	unique: [
		{
			name: 'Stein',
			newName: 'Stein of Gorgek',
			enhancedDamage: [83, 95],
			attack: [4, 6],
			hp: 21,
			mp: 21,
			dex: [4, 6],
			intel: [6, 8],
			mpRegen: [2, 4],
			addSpellBlood: [7, 10],
			addSpellPoison: [12, 16],
			addSpellFire: [8, 12],
			alteration: [1, 3],
		}, {
			name: 'Dark Orb',
			newName: 'Shimmering Orb',
			enhancedDamage: [87, 102],
			attack: [5, 7],
			hp: [20, 25],
			mp: [25, 35],
			conjuration: [2, 3],
			mpKill: [5, 8],
			resistArcane: 20,
			resistLightning: 30,
			addSpellIce: [14, 25],
			addSpellLightning: [20, 30],
		}, {
			name: 'Ancient Tome',
			newName: 'Testament of Rinara',
			enhancedDamage: [77, 88],
			attack: [7, 9],
			hp: [25, 30],
			mp: [35, 40],
			intel: 9,
			cha: [15, 20],
			allSkills: 1,
			mpRegen: [3, 5],
			addSpellFire: [25, 35],
		}, {
			name: 'Totem',
			newName: 'Paw of Rockgard',
			enhancedDamage: [89, 105],
			attack: [10, 13],
			mp: 40,
			wis: [8, 12],
			sta: [8, 12],
			agi: [6, 9],
			mpRegen: [3, 5],
			resistSilence: 10,
			resistPoison: 10,
			addSpellFire: [22, 34],
			addSpellIce: [22, 34],
		}, {
			name: 'Crystal Ball',
			newName: 'Manastone',
			enhancedDamage: [84, 99],
			attack: [12, 15],
			allStats: [5, 8],
			mp: [35, 45],
			sp: [20, 30],
			mpRegen: [6, 8],
			mpKill: 12,
			resistFear: 12,
			resistSilence: 9,
		}, {
			name: 'Skull',
			newName: 'Skull of Fintler',
			enhancedDamage: [94, 107],
			attack: [14, 17],
			mp: 45,
			crit: [10, 15],
			hpKill: [6, 8],
			mpKill: [4, 6],
			conjuration: [2, 3],
			addSpellBlood: [25, 36],
			addSpellPoison: [33, 44],
			resistSilence: 9,
			resistPoison: 25,
			resistArcane: 10,
		}, {
			name: 'Emblazoned Orb',
			newName: 'Glowing Black Stone',
			enhancedDamage: [75, 88],
			attack: [15, 18],
			mp: 50,
			intel: [12, 15],
			mpKill: 9,
			mpRegen: [6, 9],
			crit: [5, 8],
			evocation: [3, 4],
			resistStun: 8,
			resistSilence: 15,
			resistArcane: 45,
		}, {
			name: 'Idol',
			newName: 'Pearl Fahlnir Totem',
			enhancedDamage: [82, 96],
			attack: [17, 20],
			mp: [35, 40],
			wis: 18,
			allSkills: 1,
			resistAll: [10, 15],
			addSpellPoison: [25, 35],
			addSpellArcane: [32, 45],
			addSpellFire: [25, 35],
		},
	]
}