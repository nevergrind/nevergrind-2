loot.staves = {
	base: {
		slots: ['primary'],
		weaponSkill: 'Two-hand Blunt',
	},
	normal: [
		{
			name: 'Staff',
			minDamage: 5,
			maxDamage: 11,
			speed: 4.2, // 3.8
			itemLevel: 1,
			imgIndex: 0,
		}, {
			name: 'Runic Staff',
			minDamage: 7,
			maxDamage: 16,
			speed: 4.4, // 5.2
			itemLevel: 6,
			imgIndex: 1,
		}, {
			name: 'Cedar Staff',
			minDamage: 10,
			maxDamage: 29,
			speed: 4.5, // 8.6
			itemLevel: 12,
			imgIndex: 2,
		}, {
			name: 'Quarterstaff',
			minDamage: 14,
			maxDamage: 58,
			speed: 4.4, // 16.4
			itemLevel: 18,
			imgIndex: 3,
		}, {
			name: 'Cosmic Staff',
			minDamage: 26,
			maxDamage: 72,
			speed: 4.2, // 23.9
			itemLevel: 25,
			imgIndex: 4,
		}, {
			name: 'Archon Staff',
			minDamage: 39,
			maxDamage: 88,
			speed: 4.3, // 29.53
			itemLevel: 32,
			imgIndex: 5,
		},
	],
	prefix: {
		enhancedDamage: 100,
		castingSkills: 6,
		allSkills: 4,
		attack: 200,
		resists: 60,
		spellPower: 80,
		addSpellAll: 30,
	},
	suffix: {
		stats: 30,
		allStats: 15,
		points: 100,
		crit: 40,
		leech: 10,
		wraith: 10,
		regen: 20,
		haste: 40,
		ease: 2,
	},
	rare: {
		addDamage: 40,
	},
	unique: [
		{
			name: 'Staff',
			newName: 'Runed Totem Staff',
			enhancedDamage: [90, 105],
			attack: [8, 12],
			mp: [16, 24],
			hp: [16, 24],
			wis: 10,
			intel: 10,
			addArcane: [8, 12],
			resistArcane: 9,
			resistIce: 9,
			addSpellFire: [10, 12],
			addSpellLightning: [6, 16],
		}, {
			name: 'Runic Staff',
			newName: 'Bane Ash',
			enhancedDamage: [95, 112],
			attack: [11, 15],
			mp: [20, 25],
			mpRegen: [4, 6],
			crit: [7, 11],
			resistFire: 12,
			resistBlood: 7,
			addFire: [13, 16],
			addSpellFire: [28, 35],
			addSpellPoison: [20, 26],
			resistSilence: 25,
		}, {
			name: 'Cedar Staff',
			newName: 'Serpent Lord',
			enhancedDamage: [107, 125],
			attack: [18, 22],
			mp: [45, 60],
			allStats: [5, 8],
			enhancePoison: [4, 6],
			addPoison: [16, 24],
			addSpellPoison: [30, 40],
			addSpellBlood: [15, 24],
			leech: 5,
			wraith: 5,
			mpKill: 10,
			resistPoison: 40,
		}, {
			name: 'Quarterstaff',
			newName: 'Spire of Sentoth',
			enhancedDamage: [103, 119],
			attack: [24, 30],
			mp: 60,
			allSkills: [1, 2],
			enhanceLightning: [4, 6],
			mpRegen: [5, 8],
			intel: [15, 20],
			phyMit: 5,
			addLightning: [20, 25],
			addSpellFire: [20, 25],
			addSpellPoison: [35, 50],
		}, {
			name: 'Cosmic Staff',
			newName: 'Staff of the Sentinel',
			enhancedDamage: [105, 120],
			attack: [20, 25],
			mp: [50, 60],
			hp: 35,
			sp: 25,
			wis: [20, 25],
			intel: [20, 25],
			resistStun: [16, 20],
			resistFear: [12, 16],
			addArcane: [28, 35],
			allSkills: 1,
			addSpellArcane: [60, 75],
		}, {
			name: 'Archon Staff',
			newName: 'The Salamander',
			enhancedDamage: [99, 111],
			attack: [20, 25],
			mp: 99,
			mpRegen: [7, 9],
			enhanceFire: [4, 6],
			evocation: [3, 5],
			conjuration: [3, 5],
			wraith: [7, 9],
			leech: [5, 7],
			addFire: [35, 42],
			resistFire: 33,
			addSpellPoison: [65, 80],
			addSpellLightning: [25, 34],
		},
	]
}