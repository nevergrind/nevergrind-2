loot.oneHandBlunts = {
	base: {
		slots: ['primary', 'secondary'],
		weaponSkill: 'One-hand Blunt',
	},
	normal: [
		{
			name: 'Mace',
			minDamage: 2,
			maxDamage: 9,
			speed: 3.6, // 3.05 - 1.53
			itemLevel: 1,
			imgIndex: 0,
		}, {
			name: 'Club',
			minDamage: 3,
			maxDamage: 13,
			speed: 3.5, // 4.57of
			itemLevel: 5,
			imgIndex: 1,
		}, {
			name: 'Morning Star',
			minDamage: 5,
			maxDamage: 16,
			speed: 3.4, // 6.17
			itemLevel: 10,
			imgIndex: 2,
		}, {
			name: 'Spiked Club',
			minDamage: 7,
			maxDamage: 27,
			speed: 3.8, // 8.94
			itemLevel: 15,
			imgIndex: 3,
		}, {
			name: 'Jagged Star',
			minDamage: 9,
			maxDamage: 38,
			speed: 3.7, // 12.7
			itemLevel: 20,
			imgIndex: 4,
		}, {
			name: 'Scepter',
			minDamage: 11,
			maxDamage: 48,
			speed: 3.4, // 17.35
			itemLevel: 25,
			imgIndex: 5,
		}, {
			name: 'Cudgel',
			minDamage: 16,
			maxDamage: 68,
			speed: 3.6, // 23.3
			itemLevel: 30,
			imgIndex: 6,
		}, {
			name: 'Caduceus',
			minDamage: 19,
			maxDamage: 78,
			speed: 3.3, // 29.39
			itemLevel: 35,
			imgIndex: 7,
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
		ease: 2,
	},
	rare: {
		addDamage: 10,
	},
	unique: [
		{
			name: 'Mace',
			newName: 'Sageknot',
			enhancedDamage: [135, 160],
			attack: [4, 8],
			mp: [15, 25],
			wis: 5,
			oneHandBlunt: [1, 2],
			phyMit: 4,
			resistLightning: 4,
			resistFire: 3,
		}, {
			name: 'Club',
			newName: 'Brimthorn',
			enhancedDamage: [90, 120],
			attack: [5, 8],
			sta: [8, 12],
			crit: 10,
			magMit: 4,
			addPoison: [2, 4],
			addBlood: [1, 3],
			mpRegen: [2, 3],
			alteration: [1, 2],
		}, {
			name: 'Morning Star',
			newName: 'Howling Mace',
			enhancedDamage: [120, 150],
			attack: [7, 12],
			spRegen: [3, 5],
			resistFear: 5,
			addSpellArcane: [8, 12],
			wraith: [2, 3],
			alteration: 2,
			evocation: [1, 2],
			addArcane: [4, 6],
		}, {
			name: 'Spiked Club',
			newName: 'Bloodrise',
			enhancedDamage: [115, 130],
			attack: [10, 15],
			hp: [12, 16],
			hpKill: 5,
			leech: [3, 5],
			sp: [8, 12],
			addBlood: [4, 7],
		}, {
			name: 'Jagged Star',
			newName: 'Cold Iron Morning Star',
			enhancedDamage: [120, 145],
			attack: [12, 15],
			crit: [8, 12],
			wis: [12, 15],
			resistIce: 6,
			oneHandBlunt: [2, 3],
			wraith: 3,
			addIce: [6, 8],
		}, {
			name: 'Scepter',
			newName: 'Ebony Black Mace',
			enhancedDamage: [90, 120],
			attack: [13, 16],
			allStats: [3, 5],
			mp: 30,
			mpKill: 4,
			wraith: [4, 6],
			conjuration: [1, 2],
			addIce: [3, 5],
			addLightning: [2, 4],
		}, {
			name: 'Cudgel',
			newName: 'Orcish Warhammer',
			enhancedDamage: [120, 140],
			attack: [16, 20],
			oneHandBlunt: [2, 3],
			offense: [2, 3],
			crit: 10,
			resistFear: [7, 10],
			leech: [3, 5],
			addIce: [2, 4],
			addBlood: [2, 7],
		}, {
			name: 'Caduceus',
			newName: 'Stormeye',
			enhancedDamage: [110, 140],
			attack: [18, 24],
			allSkills: 1,
			allStats: 5,
			mpRegen: [3, 5],
			mpKill: [6, 8],
			evocation: [2, 3],
			resistAll: [7, 10],
			addLightning: [8, 12],
		},
	]
}