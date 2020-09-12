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
			job: JOB.RANGER,
			reducePhysical: .25,
			hate: -1.5,
			duration: 9,
		},
		igniteArmor: {
			name: 'Ignite Armor',
			img: 6,
			job: JOB.RANGER,
			duration: 15,
		},
		faerieFlame: {
			name: 'Faerie Flame',
			img: 8,
			job: JOB.RANGER,
			duration: 45,
		},
		fungalGrowth: {
			name: 'Fungal Growth',
			img: 9,
			job: JOB.RANGER,
			ticks: 10,
			interval: 3,
			duration: 30,
			hate: 3,
			msg: () => 'Regenerative spores begin to heal your wounds.',
		},
		shimmeringOrb: {
			name: 'Shimmering Orb',
			img: 10,
			job: JOB.RANGER,
			mitigation: [0, 2, 4, 7, 9, 12, 15, 19],
			msg: () => 'A luminescent aura wraps you in a protective shell.',
			fadeMsg: 'The luminescent aura fades.'
		},
		spiritOfTheHunter: {
			name: 'Spirit of the Hunter',
			img: 11,
			job: JOB.RANGER,
			duration: 300,
			attackBonus: [0, 4, 8, 13, 19, 26, 34, 45],
			attackHaste: .2,
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
			job: JOB.CLERIC,
			duration: 3,
		},
		holySanctuary: { hate: -2.5 },
		forceOfGlory: { hate: 3 },
		// instant heals
		circleOfPrayer: {
			name: 'Circle of Prayer',
			img: 9,
			job: JOB.CLERIC,
			duration: 0,
			hate: 6,
			msg: (buff) => 'Circle of Prayer heals you for ' + buff.damage + ' health.',
		},
		bindingGrace: {
			name: 'Binding Grace',
			img: 6,
			job: JOB.CLERIC,
			duration: 0,
			hate: 3.2,
			msg: (buff) => 'Binding Grace heals you for ' + buff.damage + ' health.',
		},
		guardianAngel: {
			name: 'Guardian Angel',
			img: 7,
			job: JOB.CLERIC,
			duration: 30,
			hate: 2.5,
			msg: () => 'A guardian angel\'s wings surround you.',
			msgAbsorb: 'Your guardian angel protects you from harm.'
		},
		divineLight: {
			name: 'Divine Light',
			img: 8,
			job: JOB.CLERIC,
			duration: 0,
			hate: 4,
			msg: (buff) => 'Divine Light heals you for ' + buff.damage + ' health.',
		},
		sealOfRedemption: {
			name: 'Seal of Redemption',
			img: 10,
			job: JOB.CLERIC,
			duration: 720,
			resistBlood: [0, 16, 28, 40, 52, 64, 76, 88],
			msg: () => 'Your forehead is emblazoned with a crimson seal.',
			fadeMsg: 'Your crimson seal fades.'
		},
		zealousResolve: {
			name: 'Zealous Resolve',
			img: 11,
			job: JOB.CLERIC,
			duration: 720,
			armorRatio: .25, // % of health buff
			msg: () => 'Your spirit ignites with zealous resolve.',
			fadeMsg: 'Your zealous resolve fades.'
		},
		shieldBash: { hate: .5 },
		rupture: {
			name: 'Rupture',
			img: 1,
			job: JOB.WARRIOR,
			ticks: 8,
			interval: 3,
			hate: 1.2,
			duration: 24,
			spellType: '',
			damageType: DAMAGE_TYPE.BLOOD,
		},
		whirlwind: { hate: 1 },
		pummel: { hate: 2.5 },
		doubleThrow: { hate: .8 },
		shockwave: { hate: .8 },
		frenzy: {
			name: 'Frenzy',
			img: 6,
			job: JOB.WARRIOR,
			duration: 20,
			hate: 0,
			skillHaste: [0, .15, .17, .2, .22, .24, .26, .28],
			msg: () => 'You unleash your wrath in a crazed frenzy!',
			fadeMsg: 'Your frenzy fades.'
		},
		jumpStrike: {
			name: 'Jump Strike',
			img: 7,
			job: JOB.WARRIOR,
			duration: 1.5,
			hate: 1.5,
			msg: () => '',
			fadeMsg: ''
		},
		primalStomp: { hate: 2.5 },
		bulwark: {
			name: 'Bulwark',
			img: 9,
			job: JOB.WARRIOR,
			duration: 8,
			hate: 0,
			mitigation: [0, 7, 13, 19, 25, 31, 37, 43],
			msg: () => 'A protective bulwark surrounds you!',
			fadeMsg: 'The bulwark fades.'
		},
		intrepidShout: {
			name: 'Intrepid Shout',
			img: 10,
			job: JOB.WARRIOR,
			duration: 240,
			hate: 0,
			armor: [0, 25, 50, 75, 100, 125, 150, 175],
			resistFear: [0, 5, 7, 9, 11, 13, 15, 17],
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
			job: JOB.WIZARD,
			hate: .8,
			ticks: 12,
			interval: .5,
			duration: 6,
			spellType: PROP.CONJURATION,
			damageType: DAMAGE_TYPE.FIRE,
		},
		frozenBarrier: {
			name: 'Frozen Barrier',
			img: 8,
			job: JOB.WIZARD,
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
			job: JOB.WIZARD,
			duration: 720,
			hate: 0,
			silence: [0, 3, 5, 7, 9, 11, 13, 15],
			resistAll: [0, 10, 15, 20, 25, 30, 35, 40],
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
			job: JOB.DRUID,
			img: 4,
			ticks: 10,
			interval: 3,
			duration: 30,
			spellType: PROP.CONJURATION,
			damageType: DAMAGE_TYPE.POISON,
		},
		moltenBoulder: {
			name: 'Molten Boulder Strike',
			hate: 1.2,
			job: JOB.DRUID,
			img: 5,
			ticks: 4,
			interval: 3,
			duration: 12,
			spellType: PROP.CONJURATION,
			damageType: DAMAGE_TYPE.FIRE,
		},
		barbedThicket: { hate: -.5 },
		tornado: { hate: .5 },
		naturesTouch: {
			name: 'Nature\'s Touch',
			img: 8,
			job: JOB.DRUID,
			hate: 4.5,
			msg: (buff) => 'Nature\'s Touch heals you for ' + buff.damage + ' health.',
		},
		naturesTouchHot: {
			name: 'Nature\'s Touch',
			img: 8,
			job: JOB.DRUID,
			ticks: 3,
			interval: 3,
			duration: 9,
			hate: 3,
			msg: () => 'Nature\'s Touch starts healing your wounds.',
		},
		mossBreath: {
			name: 'Moss Breath',
			img: 9,
			job: JOB.DRUID,
			ticks: 7,
			interval: 3,
			duration: 21,
			hate: 4.8,
			msg: () => 'Moss Breath starts healing your wounds.',
		},
		synthesize: {
			name: 'Synthesize',
			img: 10,
			job: JOB.DRUID,
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
			job: JOB.DRUID,
			duration: 900,
			armorRatio: .15, // % of health buff
			attackRatio: .2,
			hpRegen: [0, 1, 1, 2, 2, 3, 3, 4],
			msg: () => 'A branch spirit rests in your heart.',
			fadeMsg: 'Your branch spirit fades.'
		},
		frostRift: { hate: -.25 },
		poisonNova: { hate: .7 },
		scourge: {
			name: 'Scourge',
			img: 2,
			job: JOB.SHAMAN,
			hate: .8,
			ticks: 6,
			interval: 3,
			duration: 18,
			damageType: DAMAGE_TYPE.BLOOD,
		},
		poisonBolt: { hate: 1.25 },
		vampiricGaze: {
			name: 'Vampiric Gaze',
			img: 4,
			job: JOB.SHAMAN,
			hate: .7,
			ticks: 15,
			interval: 3,
			duration: 45,
			damageType: DAMAGE_TYPE.ARCANE,
		},
		glacialShard: { hate: -1 },
		affliction: {
			name: 'Affliction',
			img: 6,
			job: JOB.SHAMAN,
			hate: .7,
			ticks: 12,
			interval: 3,
			duration: 36,
			damageType: DAMAGE_TYPE.POISON,
		},
		devouringSwarm: {
			name: 'Devouring Swarm',
			img: 7,
			job: JOB.SHAMAN,
			hate: 1.25,
			ticks: 10,
			interval: 3,
			duration: 30,
			damageType: DAMAGE_TYPE.ARCANE,
			healRatio: .5
		},
		rejuvinate: {
			name: 'Rejuvinate',
			img: 8,
			job: JOB.SHAMAN,
			hate: 4.8,
			msg: (buff) => 'Rejuvinate heals you for ' + buff.damage + ' health.',
		},
		rejuvinateHot: {
			name: 'Rejuvinate',
			img: 8,
			job: JOB.SHAMAN,
			ticks: 2,
			interval: 3,
			duration: 6,
			hate: 3.5,
			msg: () => 'Rejuvinate starts healing your wounds.',
		},
		mysticalGlow: {
			name: 'Mystical Glow',
			img: 9,
			job: JOB.SHAMAN,
			ticks: 8,
			interval: 3,
			duration: 24,
			hate: 3,
			msg: () => 'A mystical glow begins to heal your wounds.',
		},
		vampiricAllure: {
			name: 'Vampiric Allure',
			img: 10,
			job: JOB.SHAMAN,
			duration: 720,
			leech: [0, 2, 3, 4, 5, 6, 7, 8],
			cha: [0, 10, 14, 18, 22, 26, 30, 35],
			msg: () => 'Your spirit has a vampiric allure.',
			fadeMsg: 'Your vampiric allure fades.'
		},
		borealTalisman: {
			name: 'Boreal Talisman',
			img: 11,
			job: JOB.SHAMAN,
			duration: 900,
			str: [0, 8, 12, 16, 20, 24, 28, 32],
			sta: [0, 15, 20, 25, 30, 35, 40, 45],
			resistIce: [0, 16, 28, 40, 52, 64, 76, 88],
			msg: () => 'A boreal talisman imbues your spirit.',
			fadeMsg: 'The boreal talisman fades.'
		},
		venomBolt: { hate: 1 },
		explosivePlague: {
			name: 'Explosive Plague',
			img: 1,
			job: JOB.WARLOCK,
			hate: .7,
			ticks: 15,
			interval: 3,
			duration: 45,
			damageType: DAMAGE_TYPE.POISON,
		},
		bloodFire: {
			name: 'Blood Fire',
			img: 2,
			job: JOB.WARLOCK,
			hate: .8,
			ticks: 12,
			interval: 3,
			duration: 36,
			damageType: DAMAGE_TYPE.FIRE,
		},
		demonicPact: {
			name: 'Demonic Pact',
			img: 3,
			job: JOB.WARLOCK,
			hate: .8,
			ticks: 20,
			interval: 3,
			duration: 60,
			lowerResists: [0, .12, .15, .18, .21, .24, .27, .3],
			damageType: DAMAGE_TYPE.BLOOD,
		},
		hauntingVision: {
			name: 'Haunting Vision',
			img: 4,
			job: JOB.WARLOCK,
			hate: 1.5,
			ticks: 5,
			interval: 3,
			duration: 15,
			damageType: DAMAGE_TYPE.ARCANE,
		},
		icingDeath: {
			name: 'Icing Death',
			img: 5,
			job: JOB.WARLOCK,
			hate: -1,
			damageType: DAMAGE_TYPE.ICE,
		},
		curseOfShadows: {
			name: 'Curse of Shadows',
			img: 6,
			job: JOB.WARLOCK,
			hate: 1,
			ticks: 20,
			interval: 3,
			duration: 60,
			reduceBloodResist: .2,
			reducePoisonResist: .2,
			reduceArcaneResist: .2,
			damageType: DAMAGE_TYPE.ARCANE,
		},
		panicStrike: { hate: 1.5 },
		drainSoul: {
			name: 'Drain Soul',
			img: 8,
			job: JOB.WARLOCK,
			hate: 1.2,
			damageType: DAMAGE_TYPE.ARCANE,
			msg: (buff) => 'Drain Soul heals you for ' + buff.damage + ' health.',
		},
		lichForm: {
			name: 'Lich Form',
			img: 9,
			job: JOB.WARLOCK,
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
			job: JOB.WARLOCK,
			hate: -2,
			ticks: 10,
			interval: 3,
			duration: 30,
			damageType: DAMAGE_TYPE.POISON,
		},
		profaneSpirit: {
			name: 'Profane Spirit',
			img: 11,
			job: JOB.WARLOCK,
			duration: 900,
			addPoison: [0, 2, 3, 4, 5, 6, 7, 8],
			resistPoison: [0, 16, 28, 40, 52, 64, 76, 88],
			msg: () => 'A profane aura imbues your spirit.',
			fadeMsg: 'The profane aura fades.'
		},
		gravityFlux: { hate: 1},
		staticSuffocation: {
			name: 'Static Suffocation',
			img: 1,
			job: JOB.ENCHANTER,
			hate: 1.2,
			ticks: 9,
			interval: 3,
			duration: 27,
			damageType: DAMAGE_TYPE.LIGHTNING,
		},
		mindBlitz: { hate: 1.25 },
		mindBlitzEffect: {
			name: 'Debased Mind',
			job: JOB.ENCHANTER,
			img: 2,
			reduceArcaneResist: .3,
			duration: 45,
		},
		subversion: {
			name: 'Subversion',
			img: 3,
			job: JOB.ENCHANTER,
			hate: .9,
			ticks: 11,
			interval: 3,
			duration: 33,
			damageType: DAMAGE_TYPE.POISON,
		},
		colorShift: { hate: -2},
		phaseBlade: {
			name: 'Phase Blade',
			img: 5,
			job: JOB.ENCHANTER,
			duration: 300,
			addLightning: [0, 3, 6, 9, 12, 15, 18, 21],
			resistLightning: [0, 12, 20, 28, 36, 44, 52, 60],
			msg: () => 'Your weapons are enchanted with phased energy.',
			fadeMsg: 'The phased energy fades.'
		},
		stasisField: {
			name: 'Stasis Field',
			img: 6,
			job: JOB.ENCHANTER,
			hate: 0,
			ticks: 1,
			interval: 30,
			duration: 30,
			damageType: DAMAGE_TYPE.ARCANE,
			pveMitigationRatio: .1,
			pvpMitigation: [0, 7, 15, 25, 38, 45, 57, 60],
		},
		shiftingEther: {
			name: 'Shifting Ether',
			img: 7,
			job: JOB.ENCHANTER,
			hate: 1.5,
			ticks: 15,
			interval: 3,
			duration: 45,
			damageType: DAMAGE_TYPE.ARCANE,
		},
		sereneSigil: {
			name: 'Serene Sigil',
			img: 8,
			job: JOB.ENCHANTER,
			mitigation: [0, 4, 7, 13, 16, 22, 27, 34],
			msg: () => 'A serene sigil flashes before your eyes.',
			fadeMsg: 'The serene sigil fades.'
		},
		augmentation: {
			name: 'Augmentation',
			img: 9,
			job: JOB.ENCHANTER,
			agi: [0, 6, 9, 11, 13, 15, 17, 20],
			dex: [0, 6, 9, 11, 13, 15, 17, 20],
			skillHaste: [0, .1, .115, .13, .145, .16, .18, .2],
			duration: 480,
			msg: () => 'Your muscle fibers are augmented with alacrity.',
			fadeMsg: 'The augmentation fades.'
		},
		clarity: {
			name: 'Clarity',
			img: 10,
			job: JOB.ENCHANTER,
			hate: 0,
			mpRegen: [0, 2, 4, 6, 9, 11, 13, 15],
			intel: [0, 10, 13, 16, 20, 23, 26, 30],
			duration: 720,
			msg: () => 'A sense of clarity pervades your mind.',
			fadeMsg: 'Your clarity fades.'
		},
		enthrall: {
			name: 'Enthrall',
			img: 11,
			job: JOB.ENCHANTER,
			hate: -.5,
			ticks: 1,
			interval: 30,
			duration: 30,
			isDebuff: true,
			damageType: DAMAGE_TYPE.ARCANE,
		},
		lavaBolt: { hate: 1 },
		thunderclap: { hate: 1.2 },
		frozenOrb: { hate: -.5 },
		staticStorm: {
			name: 'Static Storm',
			img: 3,
			job: JOB.TEMPLAR,
			hate: 1.2,
			reduceLightningResist: .25,
			damageType: DAMAGE_TYPE.LIGHTNING,
		},
		staticStormDebuff: {
			name: 'Static Storm',
			img: 3,
			job: JOB.TEMPLAR,
			hate: 1.2,
			ticks: 1,
			interval: 60,
			duration: 60,
			damageType: DAMAGE_TYPE.LIGHTNING,
			isDebuff: true,
		},
		fireWall: { hate: 1 },
		glacialSpike: { hate: -.5 },
		primordialSludge: {
			name: 'Primordial Sludge',
			img: 6,
			job: JOB.TEMPLAR,
			hate: 1.5,
			ticks: 15,
			interval: 3,
			duration: 45,
			damageType: DAMAGE_TYPE.POISON,
		},
		arclight: {
			name: 'Arclight',
			img: 7,
			job: JOB.TEMPLAR,
			hate: 1.5,
			ticks: 10,
			interval: 3,
			duration: 30,
			damageType: DAMAGE_TYPE.LIGHTNING,
		},
		arclightDebuff: {
			name: 'Arclight Debuff',
			img: 7,
			job: JOB.TEMPLAR,
			ticks: 1,
			interval: 15,
			duration: 15,
			isDebuff: true,
		},
		primevalWithering: {
			name: 'Primeval Withering',
			img: 8,
			job: JOB.TEMPLAR,
			hate: 1.5,
			ticks: 30,
			interval: 3,
			duration: 90,
			reduceLightningResist: .2,
			reduceFireResist: .2,
			reduceIceResist: .2,
			damageType: DAMAGE_TYPE.ARCANE,
		},
		moltenAegis: {
			name: 'Molten Aegis',
			img: 9,
			job: JOB.TEMPLAR,
			duration: 420,
			addFire: [0, 2, 4, 6, 8, 10, 12, 15],
			resistFire: [0, 12, 24, 36, 48, 64, 80, 96],
			msg: () => 'Your weapons shimmer with molten energy.',
			fadeMsg: 'Your molten shimmer fades.'
		},
		conviction: {
			name: 'Lucid Energy',
			img: 10,
			job: JOB.TEMPLAR,
			spRegen: [0, 2, 3, 5, 7, 9, 10, 12],
			cha: [0, 12, 17, 22, 26, 30, 35, 40],
			duration: 720,
			msg: () => 'Spiritual insight gives you a charismatic aura.',
			fadeMsg: 'Your charismatic aura fades.'
		},
		celestialFrenzy: {
			name: 'Celestial Frenzy',
			img: 11,
			job: JOB.TEMPLAR,
			castingHaste: .15,
			addSpellAll: [0, 2, 3, 4, 6, 7, 8, 10],
			duration: 900,
			msg: () => 'Spiritual insight gives you a charismatic aura.',
			fadeMsg: 'Your charismatic aura fades.'
		},
		bellow: { hate: 1.25 },
		sonicBoom: { hate: 1.5 },
		euphonicDirge: {
			name: 'Euphonic Dirge',
			img: 2,
			job: JOB.BARD,
			hate: 1,
			ticks: 7,
			interval: 3,
			duration: 21,
			damageType: DAMAGE_TYPE.POISON,
		},
		subvertedSymphony: {
			name: 'Subverted Symphony',
			img: 3,
			job: JOB.BARD,
			hate: 1.2,
			ticks: 10,
			interval: 3,
			duration: 30,
			damageType: DAMAGE_TYPE.FIRE,
		},
		crashingChords: { hate: 1 },
		battleHymn: {
			name: 'Battle Hymn',
			img: 5,
			job: JOB.BARD,
			hate: 1,
			str: [0, 10, 15, 20, 25, 30, 35, 40],
			dex: [0, 10, 15, 20, 25, 30, 35, 40],
			attackHaste: .12,
			duration: 30,
			msg: () => 'The hymn of battle strengthens you.',
			fadeMsg: 'The battle hymn fades.',
		},
		militantCadence: {
			name: 'Militant Cadence',
			img: 6,
			job: JOB.BARD,
			hate: 1,
			hpPercent: [0, .12, .15, .18, .21, .24, .27, .3],
			mpPercent: [0, .08, .1, .12, .14, .16, .18, .2],
			spPercent: [0, .08, .1, .12, .14, .16, .18, .2],
			duration: 30,
			msg: () => 'A militant cadence inspires you.',
			fadeMsg: 'The militant cadence fades.',
		},
		consonantChain: {
			name: 'Consonant Chain',
			img: 7,
			job: JOB.BARD,
			hate: 1,
			ticks: 10,
			interval: 3,
			duration: 30,
			damageType: DAMAGE_TYPE.ARCANE,
		},
		litanyOfLife: {
			name: 'Litany of Life',
			img: 8,
			job: JOB.BARD,
			hate: 1,
			hpRegen: [0, 2, 4, 6, 9, 12, 15, 18],
			duration: 30,
			msg: () => 'A litany of life heals your wounds.',
			fadeMsg: 'The litany fades.',
		},
		melodyOfMana: {
			name: 'Melody of Mana',
			img: 9,
			job: JOB.BARD,
			hate: 1,
			castingHaste: .1,
			mpRegen: [0, 2, 3, 4, 6, 7, 8, 10],
			duration: 30,
			msg: () => 'A melody of mana restores your mind.',
			fadeMsg: 'The melody fades.',
		},
		righteousRhapsody: {
			name: 'Righteous Rhapsody',
			img: 10,
			job: JOB.BARD,
			hate: 1,
			ticks: 1,
			reduceAllResists: [0, .05, .07, .08, .1, .12, .13, .15],
			interval: 30,
			duration: 30,
			isDebuff: true,
			damageType: DAMAGE_TYPE.ARCANE,
		},
		chromaticSonata: {
			name: 'Chromatic Sonata',
			img: 11,
			job: JOB.BARD,
			hate: 1,
			armor: [0, 12, 24, 36, 48, 60, 72, 84],
			resistAll: [0, 10, 25, 40, 55, 70, 85, 100],
			duration: 30,
			msg: () => 'A chromatic sonata shields you from magic.',
			fadeMsg: 'The chromatic sonata fades.',
		},
		zealousSlam: { hate: 1.25 },
		rebuke: { hate: 1.3 },
		vengeance: { hate: .8 },
		consecrate: {
			name: 'Consecrate',
			img: 3,
			job: JOB.CRUSADER,
			hate: 1.5,
			duration: 30,
			stacks: 5,
			msg: () => 'Holy light consecrates the ground you stand on.',
			fadeMsg: 'The consecration fades.'
		},
		sealOfDamnation: { hate: 1 },
		holyWrath: { hate: 1 },
		divineJudgment: { hate: 1 },
		blessedHammer: { hate: 1 },
		sanctuary: { hate: 1 },
		divineGrace: { hate: 1 },
		benevolence: { hate: 1 },
		jubilee: { hate: 1 },

	}
	///////////////////////////////////////////

}($, _, TweenMax);