let buffs; // buff data for use with skill/spells/icons
!function($, _, TweenMax, undefined) {
	buffs = {
		// dynamic shared effects
		paralyze: {
			name: 'Paralyzed',
			img: 0,
			job: 'misc',
		},
		stun: {
			name: 'Stunned',
			img: 1,
			job: 'misc',
		},
		fear: {
			name: 'Feared',
			img: 2,
			job: 'misc',
		},
		silence: {
			name: 'Silenced',
			img: 3,
			job: 'misc',
		},
		chill: {
			name: 'Chilled',
			img: 4,
			job: 'misc',
		},
		freeze: {
			name: 'Frozen',
			img: 5,
			job: 'misc',
		},
		// damage debuffs
		crossSlash: { hate: .5 },
		explosiveShot: { hate: .8 },
		trueshotStrike: { hate: 2 },
		spreadShot: { hate: .5 },
		bladeStorm: { hate: 1.2 },
		suppressingVolley: {
			name: 'Suppressing Volley',
			img: 5,
			job: 'RNG',
			hate: -1.5,
			duration: 9,
		},
		igniteArmor: {
			name: 'Ignite Armor',
			img: 6,
			job: 'RNG',
			duration: 15,
		},
		faerieFlame: {
			name: 'Faerie Flame',
			img: 8,
			job: 'RNG',
			duration: 45,
		},
		fungalGrowth: {
			name: 'Fungal Growth',
			img: 9,
			job: 'RNG',
			ticks: 10,
			interval: 3,
			duration: 30,
			hate: 3,
			msg: () => 'Regenerative spores begin to heal your wounds.',
		},
		shimmeringOrb: {
			name: 'Shimmering Orb',
			img: 10,
			job: 'RNG',
			mitigation: [0, 2, 4, 7, 9, 12, 15, 19],
			msg: () => 'A luminescent aura wraps you in a protective shell.',
			fadeMsg: 'The luminescent aura fades.'
		},
		spiritOfTheHunter: {
			name: 'Spirit of the Hunter',
			img: 11,
			job: 'RNG',
			duration: 300,
			attackBonus: [0, 4, 8, 13, 19, 26, 34, 45],
			msg: () => 'A brief lupine energy courses through your spirit.',
			fadeMsg: 'Your lupine aura fades.'
		},
		smite: { hate: 2 },
		deliverance: { hate: 1 },
		condemnation: { hate: .7 },
		sacredRevelation: {
			name: 'Sacred Revelation',
			img: 3,
			hate: 1.6,
			job: 'CLR',
			duration: 3,
		},
		holySanctuary: { hate: -2.5 },
		forceOfGlory: { hate: 3 },
		// instant heals
		circleOfPrayer: {
			name: 'Circle of Prayer',
			img: 9,
			job: 'CLR',
			duration: 0,
			hate: 6,
			msg: (buff) => 'Circle of Prayer heals you for ' + buff.damage + ' health.',
		},
		bindingGrace: {
			name: 'Binding Grace',
			img: 6,
			job: 'CLR',
			duration: 0,
			hate: 3.2,
			msg: (buff) => 'Binding Grace heals you for ' + buff.damage + ' health.',
		},
		guardianAngel: {
			name: 'Guardian Angel',
			img: 7,
			job: 'CLR',
			duration: 30,
			hate: 2.5,
			msg: () => 'A guardian angel\'s wings surround you.',
			msgAbsorb: 'Your guardian angel protects you from harm.'
		},
		divineLight: {
			name: 'Divine Light',
			img: 8,
			job: 'CLR',
			duration: 0,
			hate: 4,
			msg: (buff) => 'Divine Light heals you for ' + buff.damage + ' health.',
		},
		sealOfRedemption: {
			name: 'Seal of Redemption',
			img: 10,
			job: 'CLR',
			duration: 720,
			base: 4,
			bloodPerLevel: 3,
			msg: () => 'Your forehead is emblazoned with a crimson seal.',
			fadeMsg: 'Your crimson seal fades.'
		},
		zealousResolve: {
			name: 'Zealous Resolve',
			img: 11,
			job: 'CLR',
			duration: 720,
			armorRatio: .25, // % of health buff
			msg: () => 'Your spirit ignites with zealous resolve.',
			fadeMsg: 'Your zealous resolve fades.'
		},
		shieldBash: { hate: 1.2 },
		rupture: {
			name: 'Rupture',
			img: 1,
			job: 'WAR',
			ticks: 8,
			interval: 3,
			hate: 1.2,
			duration: 24,
			spellType: '',
			damageType: 'blood',
		},
		whirlwind: { hate: 1 },
		pummel: { hate: 2.5 },
		doubleThrow: { hate: .8 },
		shockwave: { hate: .8 },
		frenzy: {
			name: 'Frenzy',
			img: 6,
			job: 'WAR',
			duration: 20,
			hate: 0,
			haste: [0, .15, .17, .2, .22, .24, .26, .28],
			msg: () => 'You unleash your wrath in a crazed frenzy!',
			fadeMsg: 'Your frenzy fades.'
		},
		jumpStrike: {
			name: 'Jump Strike',
			img: 7,
			job: 'WAR',
			duration: 1.5,
			hate: 1.5,
			msg: () => '',
			fadeMsg: ''
		},
		primalStomp: { hate: 2.5 },
		bulwark: {
			name: 'Bulwark',
			img: 9,
			job: 'WAR',
			duration: 8,
			hate: 0,
			mitigation: [0, 7, 13, 19, 25, 31, 37, 43],
			msg: () => 'A protective bulwark surrounds you!',
			fadeMsg: 'The bulwark fades.'
		},
		intrepidShout: {
			name: 'Intrepid Shout',
			img: 10,
			job: 'WAR',
			duration: 240,
			hate: 0,
			armor: [0, 25, 50, 75, 100, 125, 150, 175],
			base: 5,
			fearPerLevel: 2,
			msg: () => 'An intrepid shout makes you feel dauntless!',
			fadeMsg: 'The intrepid shout fades.'
		},
		furiousCleave: { hate: 1.5 },
		// wiz
		fireBolt: { hate: 1 },
		iceBolt: { hate: -.5 },
		lightningBolt: { hate: .7 },
		magicMissiles: { hate: 1.2 },
		fireball: { hate: .75 },
		chainLightning: { hate: .5 },
		frostNova: { hate: -2 },
		meteor: { hate: 2 },
		meteorStrike: {
			name: 'Meteor Strike',
			img: 7,
			job: 'WIZ',
			hate: .8,
			ticks: 12,
			interval: .5,
			duration: 6,
			spellType: 'conjuration',
			damageType: 'fire',
		},
		frozenBarrier: {
			name: 'Frozen Barrier',
			img: 8,
			job: 'WIZ',
			duration: 8,
			msg: () => 'You are encased in a frozen barrier.',
			fadeMsg: 'The barrier fades.',
		},
		mirrorImage: {
			name: 'Mirror Images',
			img: 9,
			job: 'Wiz',
			hate: 1,
			msg: () => 'Your mirror form materializes from the void.',
			msgAbsorb: 'Your mirror image shields you from harm.'
		},
		manaShell: {
			name: 'Mana Shell',
			img: 10,
			job: 'WIZ',
			duration: 720,
			hate: 0,
			silence: [0, 3, 5, 7, 9, 11, 13, 15],
			resistAll: [0, 2, 3, 4, 6, 7, 8, 10],
			knockback: 10,
			msg: () => 'You are protected by a mana shell.',
			fadeMsg: 'The mana shell fades.'
		},
		deepFreeze: { hate: -1, },
		// dru
		starfire: { hate: 1 },
		fissure: { hate: .75 },
		lightningBlast: { hate: .5 },
		blizzard: { hate: -.5 },
		toxicSpores: {
			name: 'Toxic Spores',
			hate: .7,
			job: 'DRU',
			img: 4,
			ticks: 10,
			interval: 3,
			duration: 30,
			spellType: 'conjuration',
			damageType: 'poison',
		},
		moltenBoulder: {
			name: 'Molten Boulder Strike',
			hate: 1.2,
			job: 'DRU',
			img: 5,
			ticks: 4,
			interval: 3,
			duration: 12,
			spellType: 'conjuration',
			damageType: 'fire',
		},
		barbedThicket: { hate: -.5 },
		tornado: { hate: .5 },
		naturesTouch: {
			name: 'Nature\'s Touch',
			img: 8,
			job: 'DRU',
			hate: 4.5,
			msg: (buff) => 'Nature\'s Touch heals you for ' + buff.damage + ' health.',
		},
		naturesTouchHot: {
			name: 'Nature\'s Touch',
			img: 8,
			job: 'DRU',
			ticks: 3,
			interval: 3,
			duration: 9,
			hate: 3,
			msg: () => 'Nature\'s Touch starts healing your wounds.',
		},
		mossBreath: {
			name: 'Moss Breath',
			img: 9,
			job: 'DRU',
			ticks: 7,
			interval: 3,
			duration: 21,
			hate: 4.8,
			msg: () => 'Moss Breath starts healing your wounds.',
		},
		synthesize: {
			name: 'Synthesize',
			img: 10,
			job: 'DRU',
			ticks: 84,
			interval: 5,
			duration: 420,
			hate: 2.5,
			addPerTick: 1,
			msg: () => 'Synthesize starts healing your wounds.',
		},
		branchSpirit: {
			name: 'Branch Spirit',
			img: 11,
			job: 'DRU',
			duration: 900,
			armorRatio: .15, // % of health buff
			attackRatio: .2,
			regenPerLevel: .4, // % of health buff (2.8 @ 7)
			msg: () => 'A branch spirit rests in your heart.',
			fadeMsg: 'Your branch spirit fades.'
		},
		frostRift: { hate: -.25 },
		poisonNova: { hate: .7 },
		scourge: {
			name: 'Scourge',
			img: 2,
			job: 'SHM',
			hate: .8,
			ticks: 6,
			interval: 3,
			duration: 18,
			damageType: 'blood',
		},
		poisonBolt: { hate: 1.25 },
		vampiricGaze: {
			name: 'Vampiric Gaze',
			img: 4,
			job: 'SHM',
			hate: .7,
			ticks: 15,
			interval: 3,
			duration: 45,
			damageType: 'arcane',
		},
		glacialShard: { hate: -1 },
		affliction: {
			name: 'Affliction',
			img: 6,
			job: 'SHM',
			hate: .7,
			ticks: 12,
			interval: 3,
			duration: 36,
			damageType: 'poison',
		},
		devouringSwarm: {
			name: 'Devouring Swarm',
			img: 7,
			job: 'SHM',
			hate: 1.25,
			ticks: 10,
			interval: 3,
			duration: 30,
			damageType: 'arcane',
			healRatio: .5
		},
		rejuvinate: {
			name: 'Rejuvinate',
			img: 8,
			job: 'SHM',
			hate: 4.8,
			msg: (buff) => 'Rejuvinate heals you for ' + buff.damage + ' health.',
		},
		rejuvinateHot: {
			name: 'Rejuvinate',
			img: 8,
			job: 'SHM',
			ticks: 2,
			interval: 3,
			duration: 6,
			hate: 3.5,
			msg: () => 'Rejuvinate starts healing your wounds.',
		},
		mysticalGlow: {
			name: 'Mystical Glow',
			img: 9,
			job: 'SHM',
			ticks: 8,
			interval: 3,
			duration: 24,
			hate: 3,
			msg: () => 'A mystical glow begins to heal your wounds.',
		},
		vampiricAllure: {
			name: 'Vampiric Allure',
			img: 10,
			job: 'SHM',
			duration: 720,
			leech: [0, 2, 3, 4, 5, 6, 7, 8],
			cha: [0, 10, 14, 18, 22, 26, 30, 35],
			msg: () => 'Your spirit has a vampiric allure.',
			fadeMsg: 'Your vampiric allure fades.'
		},
		borealTalisman: {
			name: 'Boreal Talisman',
			img: 11,
			job: 'SHM',
			duration: 900,
			str: [0, 8, 12, 16, 20, 24, 28, 32],
			sta: [0, 15, 20, 25, 30, 35, 40, 45],
			resistIce: [0, 4, 7, 10, 13, 16, 19, 22],
			msg: () => 'A boreal talisman imbues your spirit.',
			fadeMsg: 'The boreal talisman fades.'
		},
		venomBolt: { hate: 1 },
		explosivePlague: {
			name: 'Explosive Plague',
			img: 1,
			job: 'WLK',
			hate: .7,
			ticks: 15,
			interval: 3,
			duration: 45,
			damageType: 'poison',
		},
		bloodFire: {
			name: 'Blood Fire',
			img: 2,
			job: 'WLK',
			hate: .8,
			ticks: 12,
			interval: 3,
			duration: 36,
			damageType: 'fire',
		},
		demonicPact: {
			name: 'Demonic Pact',
			img: 3,
			job: 'WLK',
			hate: .8,
			ticks: 20,
			interval: 3,
			duration: 60,
			lowerResists: [0, .12, .15, .18, .21, .24, .27, .3],
			damageType: 'blood',
		},
		hauntingVision: {
			name: 'Haunting Vision',
			img: 4,
			job: 'WLK',
			hate: 1.5,
			ticks: 5,
			interval: 3,
			duration: 15,
			damageType: 'arcane',
		},
		icingDeath: {
			name: 'Icing Death',
			img: 5,
			job: 'WLK',
			hate: -1,
			damageType: 'ice',
		},
		curseOfShadows: {
			name: 'Curse of Shadows',
			img: 6,
			job: 'WLK',
			hate: 1,
			ticks: 14,
			interval: 3,
			duration: 42,
			damageType: 'arcane',
		},
		panicStrike: { hate: 1.5 },
		drainSoul: {
			name: 'Drain Soul',
			img: 8,
			job: 'WLK',
			hate: 1.2,
			damageType: 'arcane',
			msg: (buff) => 'Drain Soul heals you for ' + buff.damage + ' health.',
		},
		lichForm: {
			name: 'Lich Form',
			img: 9,
			job: 'WLK',
			duration: 720,
			hpRegen: [0, 2, 5, 9, 12, 15, 19, 22],
			mpRegen: [0, 4, 10, 16, 22, 28, 34, 40],
			armor: [0, 33, 66, 100, 133, 166, 200, 233],
			enhancePnB: [0, 12, 25, 37, 49, 61, 73, 85],
			msg: () => 'Your flesh rots revealing an unholy form.',
			fadeMsg: 'Your flesh returns.'
		},
		engulfingDarkness: {
			name: 'Engulfing Darkness',
			img: 10,
			job: 'WLK',
			hate: -2,
			ticks: 10,
			interval: 3,
			duration: 30,
			damageType: 'poison',
		},
		profaneSpirit: {
			name: 'Profane Spirit',
			img: 11,
			job: 'WLK',
			duration: 900,
			addPoison: [0, 2, 3, 4, 5, 6, 7, 8],
			resistPoison: [0, 4, 7, 10, 13, 16, 19, 22],
			msg: () => 'A profane aura imbues your spirit.',
			fadeMsg: 'The profane aura fades.'
		},
		gravityFlux: { hate: 1},
		staticSuffocation: {
			name: 'Static Suffocation',
			img: 1,
			job: 'ENC',
			hate: 1.2,
			ticks: 9,
			interval: 3,
			duration: 27,
			damageType: 'lightning',
		},
		mindBlitz: { hate: 1.25 },
		mindBlitzEffect: {
			name: 'Debased Mind',
			job: 'ENC',
			img: 2,
			duration: 45,
		},
		subversion: {
			name: 'Subversion',
			img: 3,
			job: 'ENC',
			hate: .9,
			ticks: 11,
			interval: 3,
			duration: 33,
			damageType: 'poison',
		},
		colorShift: { hate: -2},
		phaseBlade: {
			name: 'Phase Blade',
			img: 5,
			job: 'ENC',
			duration: 300,
			addLightning: [0, 3, 6, 9, 12, 15, 18, 21],
			resistLightning: [0, 3, 5, 7, 9, 11, 13, 15],
			msg: () => 'Your weapons are enchanted with phased energy.',
			fadeMsg: 'The phased energy fades.'
		},
		stasisField: {
			name: 'Stasis Field',
			img: 6,
			job: 'ENC',
			hate: 0,
			ticks: 1,
			interval: 30,
			duration: 30,
			damageType: 'arcane',
			pveMitigationRatio: .1,
			pvpMitigation: [0, 7, 15, 25, 38, 45, 57, 60],
		},
		shiftingEther: {
			name: 'Shifting Ether',
			img: 7,
			job: 'ENC',
			hate: 1.5,
			ticks: 15,
			interval: 3,
			duration: 45,
			damageType: 'arcane',
		},
		sereneSigil: {
			name: 'Serene Sigil',
			img: 8,
			job: 'ENC',
			mitigation: [0, 4, 7, 13, 16, 22, 27, 34],
			msg: () => 'A serene sigil flashes before your eyes.',
			fadeMsg: 'The serene sigil fades.'
		},
		augmentation: {
			name: 'Augmentation',
			img: 9,
			job: 'ENC',
			stats: [0, 6, 9, 11, 13, 15, 17, 20],
			haste: [0, .1, .115, .13, .145, .16, .18, .2],
			duration: 480,
			msg: () => 'Your muscle fibers are augmented with alacrity.',
			fadeMsg: 'The augmentation fades.'
		},
		clarity: {
			name: 'Clarity',
			img: 10,
			job: 'ENC',
			hate: 0,
			mpRegen: [0, 2, 4, 6, 9, 11, 13, 15],
			stats: [0, 10, 13, 16, 20, 23, 26, 30],
			duration: 720,
			msg: () => 'A sense of clarity pervades your mind.',
			fadeMsg: 'Your clarity fades.'
		},
		enthrall: {
			name: 'Enthrall',
			img: 11,
			job: 'ENC',
			hate: -.5,
			ticks: 1,
			interval: 30,
			duration: 30,
			isDebuff: true,
			damageType: 'arcane',
		},
		lavaBolt: { hate: 1 },
		thunderclap: { hate: 1.2 },
		frozenOrb: { hate: -.5 },
		staticStorm: {
			name: 'Static Storm',
			img: 3,
			job: 'TMP',
			hate: 1.2,
			ticks: 1,
			interval: 60,
			duration: 60,
			damageType: 'lightning',
			isDebuff: true,
		},
		fireWall: { hate: 1 },
		glacialSpike: { hate: -.5 },
		primordialSludge: {
			name: 'Primordial Sludge',
			img: 6,
			job: 'TMP',
			hate: 1.5,
			ticks: 15,
			interval: 3,
			duration: 45,
			damageType: 'poison',
		},
		arclight: {
			name: 'Arclight',
			img: 7,
			job: 'TMP',
			hate: 1.5,
			ticks: 10,
			interval: 3,
			duration: 30,
			damageType: 'lightning',
		},
		primevalWithering: { hate: 1 },
		lavaShield: { hate: 1 },
		lucidEnergy: { hate: 1 },
		etherealFocus: { hate: 1 },
	}
	///////////////////////////////////////////

}($, _, TweenMax);