loot.bows = {
	base: {
		slots: ['range'],
		weaponSkill: 'Archery',
	},
	normal: [
		{
			name: 'Short Bow',
			minDamage: 5,
			maxDamage: 9,
			speed: 3, // 4.7
			itemLevel: 1,
			imgIndex: 0,
		}, {
			name: 'Hunting Bow',
			minDamage: 7,
			maxDamage: 13,
			speed: 3.1, // 6.5
			itemLevel: 5,
			imgIndex: 1,
		}, {
			name: 'Composite Bow',
			minDamage: 12,
			maxDamage: 20,
			speed: 3.3, // 9.7
			itemLevel: 10,
			imgIndex: 2,
		}, {
			name: 'Siege Bow',
			minDamage: 15,
			maxDamage: 23,
			speed: 2.9, // 13.1
			itemLevel: 15,
			imgIndex: 3,
		}, {
			name: 'Recurve Bow',
			minDamage: 24,
			maxDamage: 40,
			speed: 3.3, // 19.4
			itemLevel: 20,
			imgIndex: 4,
		}, {
			name: 'Gothic Bow',
			minDamage: 27,
			maxDamage: 63,
			speed: 3.5, // 25.4
			itemLevel: 25,
			imgIndex: 5,
		}, {
			name: 'Ward Bow',
			minDamage: 33,
			maxDamage: 60,
			speed: 2.7, // 34.4
			itemLevel: 30,
			imgIndex: 6,
		}, {
			name: 'Hydra Bow',
			minDamage: 46,
			maxDamage: 105,
			speed: 3.5, // 43.1
			itemLevel: 35,
			imgIndex: 7,
		},
	],
	prefix: {
		enhancedDamage: 100,
		skills: 6,
		attack: 200,
	},
	suffix: {
		stats: 30,
		points: 80,
		crit: 40,
		leech: 10,
		wraith: 10,
		haste: 40,
	},
	rare: {
		addDamage: 20,
	},
	unique: [
		{
			name: 'Short Bow',
			newName: 'Pluckstring',
			enhancedDamage: [102, 124],
			attack: [12, 16],
			hp: 20,
			agi: [8, 12],
			mpKill: 3,
			sp: [11, 15],
			addArcane: [3, 5],
			dex: [15, 20],
			enhancedDamageToEldritch: [3, 6],
			resistBlood: [15, 20],
			resistLightning: [15, 20],
		}, {
			name: 'Hunting Bow',
			newName: 'Chirpstrike',
			enhancedDamage: [108, 127],
			attack: [15, 18],
			agi: 20,
			dex: 20,
			crit: [7, 10],
			hpKill: 2,
			spKill: 4,
			resistArcane: [15, 20],
			archery: [2, 3],
		}, {
			name: 'Composite Bow',
			newName: 'Runed Oak Bow',
			enhancedDamage: [108, 128],
			attack: [16, 20],
			alteration: [1, 2],
			wis: [12, 16],
			resistIce: [13, 16],
			resistFire: [16, 24],
			defense: 2,
			addIce: [4, 8],
			enhanceLightning: [4, 5],
			hpRegen: 3,
		}, {
			name: 'Siege Bow',
			newName: 'Raven Maw Bow',
			enhancedDamage: [120, 150],
			attack: [18, 24],
			str: [13, 16],
			dex: [18, 24],
			sp: [35, 45],
			mp: [50, 60],
			addFire: [9, 13],
			wraith: 7,
			hpRegen: 2,
			resistAll: [8, 12],
		}, {
			name: 'Recurve Bow',
			newName: 'Larktwitter Bow',
			enhancedDamage: [115, 133],
			attack: [22, 33],
			mp: 20,
			magMit: 7,
			resistArcane: 25,
			resistFire: 10,
			addSpellLightning: [3, 5],
			addSpellFire: [9, 15],
			addSpellIce: [9, 15],
			resistSilence: 15,
			leech: [6, 9],
		}, {
			name: 'Gothic Bow',
			newName: 'Stormstrike Bow',
			enhancedDamage: [100, 120],
			attack: [20, 25],
			mp: [45, 60],
			parry: 4,
			str: [20, 25],
			addLightning: [7, 10],
			enhanceLightning: [3, 5],
			resistLightning: 60,
			enhancedDamageToEldritch: [5, 7],
			damageTakenToMana: [5, 7],
			resistStun: 12,
		}, {
			name: 'Ward Bow',
			newName: 'Qalonscathe',
			enhancedDamage: [90, 115],
			attack: [28, 35],
			dex: [20, 30],
			resistFire: 40,
			archery: [4, 6],
			addSpellAll: [2, 3],
			allSkills: [1, 2],
			addFire: [9, 15],
			slowsTarget: [7, 15],
		}, {
			name: 'Hydra Bow',
			newName: 'Stormcaller Bow',
			enhancedDamage: [108, 133],
			attack: [38, 45],
			crit: [28, 35],
			addLightning: [8, 12],
			addIce: [3, 5],
			hpKill: 5,
			resistIce: 25,
			resistLightning: 25,
			allSkills: [1, 2],
			leech: [8, 12],
			resistSilence: 20,
			enhancedDamageToDragonkin: [6, 9],
		},
	]
}