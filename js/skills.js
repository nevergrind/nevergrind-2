var skills;
!function($, _, TweenMax, Object, undefined) {
	skills = {
		init,
		getClassKeys,
		roman: ['I', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'],
		route: function(id) {
			var key = skills[my.job].skillKeys[id];
			skills.RNG[key]();
		},
		pull: function() {
			console.info("skills.pull");
		},
		toggleAutoAttack: function() {
			console.info("toggleAutoAttack");
		},
		bash: function() {
			console.info("bash");
		},
		taunt: function() {
			console.info("taunt");
		},
		kick: function() {
			console.info("kick");
		},
		demoralize: function() {
			console.info("demoralize");
		},
		tearAsunder: function() {
			console.info("tearAsunder");
		},
		shout: function() {
			console.info("shout");
		},
		warCry: function() {
			console.info("warCry");
		},
		warStomp: function() {
			console.info("warStomp");
		},
		skillEight: function() {
			console.info("skillEight");
		},
		skillNine: function() {
			console.info("skillNine");
		},
		skillTen: function() {
			console.info("skillTen");
		},
		skillEleven: function() {
			console.info("skillEleven");
		},
		// pal?
		layHands: function() {
			console.info("layHands");
		},
		bash: function() {
			console.info("bash");
		},
		taunt: function() {
			console.info("taunt");
		},
		heal: function() {
			console.info("heal");
		},
		blessedHammer: function() {
			console.info("blessedHammer");
		},
		smite: function() {
			console.info("smite");
		},
		resolution: function() {
			console.info("resolution");
		},
		holyMight: function() {
			console.info("holyMight");
		},
		skillEight: function() {
			console.info("skillEight");
		},
		skillNine: function() {
			console.info("skillNine");
		},
		skillTen: function() {
			console.info("skillTen");
		},
		skillEleven: function() {
			console.info("skillEleven");
		},
		// SHD
		harmTouch: function() {
			console.info("harmTouch");
		},
		bash: function() {
			console.info("bash");
		},
		taunt: function() {
			console.info("taunt");
		},
		lifeTap: function() {
			console.info("lifeTap");
		},
		engulfingDarkness: function() {
			console.info("engulfingDarkness");
		},
		bloodBoil: function() {
			console.info("bloodBoil");
		},
		invokeFear: function() {
			console.info("invokeFear");
		},
		waveOfHorror: function() {
			console.info("waveOfHorror");
		},
		skillEight: function() {
			console.info("skillEight");
		},
		skillNine: function() {
			console.info("skillNine");
		},
		skillTen: function() {
			console.info("skillTen");
		},
		skillEleven: function() {
			console.info("skillEleven");
		},
		// RNG
		trueshotStrike: function() {
			console.info("trueshotStrike");
		},
		kick: function() {
			console.info("kick");
		},
		ensnare: function() {
			console.info("ensnare");
		},
		ignite: function() {
			console.info("ignite");
		},
		faerieFlame: function() {
			console.info("faerieFlame");
		},
		carelessLightning: function() {
			console.info("carelessLightning");
		},
		healing: function() {
			console.info("healing");
		},
		feetLikeCat: function() {
			console.info("feetLikeCat");
		},
		skillEight: function() {
			console.info("skillEight");
		},
		skillNine: function() {
			console.info("skillNine");
		},
		skillTen: function() {
			console.info("skillTen");
		},
		skillEleven: function() {
			console.info("skillEleven");
		},
		// MNK
		roundhouseKick: function() {
			console.info("roundhouseKick");
		},
		mend: function() {
			console.info("mend");
		},
		feignDeath: function() {
			console.info("feignDeath");
		},
		intimidation: function() {
			console.info("intimidation");
		},
		chiBlast: function() {
			console.info("chiBlast");
		},
		shoryuken: function() {
			console.info("shoryuken");
		},
		hadoken: function() {
			console.info("hadoken");
		},
		nirvana: function() {
			console.info("nirvana");
		},
		skillEight: function() {
			console.info("skillEight");
		},
		skillNine: function() {
			console.info("skillNine");
		},
		skillTen: function() {
			console.info("skillTen");
		},
		skillEleven: function() {
			console.info("skillEleven");
		},
		// ROG
		backstab: function() {
			console.info("backstab");
		},
		evade: function() {
			console.info("evade");
		},
		widowStrike: function() {
			console.info("widowStrike");
		},
		flashPowder: function() {
			console.info("flashPowder");
		},
		shadowStrike: function() {
			console.info("shadowStrike");
		},
		mirrorStrike: function() {
			console.info("mirrorStrike");
		},
		crossSlash: function() {
			console.info("crossSlash");
		},
		awestruck: function() {
			console.info("awestruck");
		},
		skillEight: function() {
			console.info("skillEight");
		},
		skillNine: function() {
			console.info("skillNine");
		},
		skillTen: function() {
			console.info("skillTen");
		},
		skillEleven: function() {
			console.info("skillEleven");
		},
		// DRU
		healing: function() {
			console.info("healing");
		},
		starfire: function() {
			console.info("starfire");
		},
		skinLikeWood: function() {
			console.info("skinLikeWood");
		},
		driftingDeath: function() {
			console.info("driftingDeath");
		},
		tornado: function() {
			console.info("tornado");
		},
		endureLightning: function() {
			console.info("endureLightning");
		},
		lightningBlast: function() {
			console.info("lightningBlast");
		},
		chloroplast: function() {
			console.info("chloroplast");
		},
		skillEight: function() {
			console.info("skillEight");
		},
		skillNine: function() {
			console.info("skillNine");
		},
		skillTen: function() {
			console.info("skillTen");
		},
		skillEleven: function() {
			console.info("skillEleven");
		},
		// CLR
		holyMight: function() {
			console.info("holyMight");
		},
		smite: function() {
			console.info("smite");
		},
		blessedHammer: function() {
			console.info("blessedHammer");
		},
		healing: function() {
			console.info("healing");
		},
		resolution: function() {
			console.info("resolution");
		},
		symbolOfYentus: function() {
			console.info("symbolOfYentus");
		},
		endureBleed: function() {
			console.info("endureBleed");
		},
		armorOfFaith: function() {
			console.info("armorOfFaith");
		},
		skillEight: function() {
			console.info("skillEight");
		},
		skillNine: function() {
			console.info("skillNine");
		},
		skillTen: function() {
			console.info("skillTen");
		},
		skillEleven: function() {
			console.info("skillEleven");
		},
		// SHM
		healing: function() {
			console.info("healing");
		},
		frostRift: function() {
			console.info("frostRift");
		},
		devouringPlague: function() {
			console.info("devouringPlague");
		},
		drowsy: function() {
			console.info("drowsy");
		},
		spiritOfTheBear: function() {
			console.info("spiritOfTheBear");
		},
		bloodRitual: function() {
			console.info("bloodRitual");
		},
		endureIce: function() {
			console.info("endureIce");
		},
		talismanOfTrogmaar: function() {
			console.info("talismanOfTrogmaar");
		},
		skillEight: function() {
			console.info("skillEight");
		},
		skillNine: function() {
			console.info("skillNine");
		},
		skillTen: function() {
			console.info("skillTen");
		},
		skillEleven: function() {
			console.info("skillEleven");
		},
		// BRD
		chantOfBattle: function() {
			console.info("chantOfBattle");
		},
		hymnOfRestoration: function() {
			console.info("hymnOfRestoration");
		},
		boastfulBellow: function() {
			console.info("boastfulBellow");
		},
		consonantChain: function() {
			console.info("consonantChain");
		},
		lucidLullaby: function() {
			console.info("lucidLullaby");
		},
		elementalRhythms: function() {
			console.info("elementalRhythms");
		},
		chorusOfClarity: function() {
			console.info("chorusOfClarity");
		},
		sirensSong: function() {
			console.info("sirensSong");
		},
		skillEight: function() {
			console.info("skillEight");
		},
		skillNine: function() {
			console.info("skillNine");
		},
		skillTen: function() {
			console.info("skillTen");
		},
		skillEleven: function() {
			console.info("skillEleven");
		},
		// NEC
		engulfingDarkness: function() {
			console.info("engulfingDarkness");
		},
		invokeDeath: function() {
			console.info("invokeDeath");
		},
		venomBolt: function() {
			console.info("venomBolt");
		},
		bloodBoil: function() {
			console.info("bloodBoil");
		},
		invokeFear: function() {
			console.info("invokeFear");
		},
		lifeTap: function() {
			console.info("lifeTap");
		},
		endurePoison: function() {
			console.info("endurePoison");
		},
		dyingBreath: function() {
			console.info("dyingBreath");
		},
		skillEight: function() {
			console.info("skillEight");
		},
		skillNine: function() {
			console.info("skillNine");
		},
		skillTen: function() {
			console.info("skillTen");
		},
		skillEleven: function() {
			console.info("skillEleven");
		},
		// ENC
		discordantMind: function() {
			console.info("discordantMind");
		},
		colorShift: function() {
			console.info("colorShift");
		},
		alacrity: function() {
			console.info("alacrity");
		},
		dazzle: function() {
			console.info("dazzle");
		},
		gaspingEmbrace: function() {
			console.info("gaspingEmbrace");
		},
		clarity: function() {
			console.info("clarity");
		},
		cajolingWhispers: function() {
			console.info("cajolingWhispers");
		},
		mysticRune: function() {
			console.info("mysticRune");
		},
		skillEight: function() {
			console.info("skillEight");
		},
		skillNine: function() {
			console.info("skillNine");
		},
		skillTen: function() {
			console.info("skillTen");
		},
		skillEleven: function() {
			console.info("skillEleven");
		},
		// SMN
		lavaBolt: function() {
			console.info("lavaBolt");
		},
		summonElemental: function() {
			console.info("summonElemental");
		},
		frozenOrb: function() {
			console.info("frozenOrb");
		},
		elementalFury: function() {
			console.info("elementalFury");
		},
		psionicStorm: function() {
			console.info("psionicStorm");
		},
		malaise: function() {
			console.info("malaise");
		},
		endureFire: function() {
			console.info("endureFire");
		},
		stasisField: function() {
			console.info("stasisField");
		},
		skillEight: function() {
			console.info("skillEight");
		},
		skillNine: function() {
			console.info("skillNine");
		},
		skillTen: function() {
			console.info("skillTen");
		},
		skillEleven: function() {
			console.info("skillEleven");
		},
		// WIZ
		iceBolt: function() {
			console.info("iceBolt");
		},
		arcaneMissiles: function() {
			console.info("arcaneMissiles");
		},
		manaShield: function() {
			console.info("manaShield");
		},
		fireball: function() {
			console.info("fireball");
		},
		viziersShielding: function() {
			console.info("viziersShielding");
		},
		lightningStrike: function() {
			console.info("lightningStrike");
		},
		glacialSpike: function() {
			console.info("glacialSpike");
		},
		mirrorImages: function() {
			console.info("mirrorImages");
		},
		skillEight: function() {
			console.info("skillEight");
		},
		skillNine: function() {
			console.info("skillNine");
		},
		skillTen: function() {
			console.info("skillTen");
		},
		skillEleven: function() {
			console.info("skillEleven");
		},
		WAR: [
			{
				name: 'Shield Bash',
				img: 'WAR-1',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				executionTime: 0,
				cooldownTime: 0,
				description: 'Shield-based attack that does % shield damage (interrupts when equipped shield)',
			}, {
				name: 'Primal Stomp',
				img: 'WAR-2',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'Interrupt all targets and do small damage and high threat',
			}, {
				name: 'Jump Strike',
				img: 'WAR-3',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'Leaping strike that makes warrior invincible while in the air',
			}, {
				name: 'Bulwark',
				img: 'WAR-4',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'Defensive shield skill - boost all damage reduction for X seconds',
			}, {
				name: 'Whirlwind',
				img: 'WAR-5',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'Hit cone of targets (max 3) for % of weapon damage',
			}, {
				name: 'Rupture',
				img: 'WAR-6',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'Bleeds single target - all hits on this target receives damage bonus %',
			}, {
				name: 'Shockwave',
				img: 'WAR-7',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'Hit all front row targets for % shield damage',
			}, {
				name: 'Pummel',
				img: 'WAR-8',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'Single-target stun (glove % damage), large threat',
			}, {
				name: 'Double Throw',
				img: 'WAR-9',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'Ranged arcane attack that strikes twice for % damage',
			}, {
				name: 'Frenzy',
				img: 'WAR-10',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'Reduce execution time of skills for x seconds',
			}, {
				name: 'Commanding Shout',
				img: 'WAR-11',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'Boost all resources of all allies for x seconds',
			}, {
				name: 'Furious Cleave',
				img: 'WAR-12',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'Swing wildly hitting 3 targets for % damage - breaks+removes stuns and fear',
			},
		],
		CRU: [
			{
				name: 'Zealous Slam',
				img: 'CRU-1',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'Shield-based attack, stuns target when shield equipped',
			}, {
				name: 'Rebuke',
				img: 'CRU-2',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'Hits 3x targets - hits for x damage and interrupts all targets - bonus damage if interrupted',
			}, {
				name: 'Vengeance',
				img: 'CRU-3',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'Hits for % damage - Hits harder when health is lower',
			}, {
				name: 'Conviction',
				img: 'CRU-4',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'Hits for % damage - boosts stack of conviction up to 5x which gives resist all bonus',
			}, {
				name: 'Seal of Damnation',
				img: 'CRU-5',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'Hits for % damage - Target marked with a Seal that boosts all damage on target by x%',
			}, {
				name: 'Seal of Redemption',
				img: 'CRU-6',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'Hits for % damage - Target marked with a Seal that reduces all damage by x%',
			}, {
				name: 'Holy Wrath',
				img: 'CRU-7',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'Hits target for % damage and stuns for x seconds',
			}, {
				name: 'Divine Judgment',
				img: 'CRU-8',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'Strikes for X arcane damage - bonus to undead',
			}, {
				name: 'Blessed Hammer',
				img: 'CRU-9',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'Strikes 3x targets for arcane damage',
			}, {
				name: 'Divine Grace',
				img: 'CRU-10',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'Heal target for x amount',
			}, {
				name: 'Benevolence',
				img: 'CRU-11',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'Heal all allies for X amount',
			}, {
				name: 'Jubilee',
				img: 'CRU-12',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'Blast all targets with arcane damage (taunt reduce threat for everyone else)',
			},
		],
		SHD: [
			{
				name: 'Shield Strike',
				img: 'SHD-1',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'Shield-based attack that does % shield damage (double damage when equipped shield)',
			}, {
				name: 'Death Strike',
				img: 'SHD-2',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'Single-target strike that leaches health',
			}, {
				name: 'Crescent Cleave',
				img: 'SHD-3',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: '3x slice with strong taunt',
			}, {
				name: 'Brain Hew',
				img: 'SHD-4',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'Strike for % damage and drain mana resources from target to yourself',
			}, {
				name: 'Iron Heron',
				img: 'SHD-5',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'Ranged melee strike that silences for 6 seconds',
			}, {
				name: 'Mark of Remphan',
				img: 'SHD-6',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'Marks a single target - Strike for % damage, extra threat, extra % damage on that target',
			}, {
				name: 'Ravaging Plague',
				img: 'SHD-7',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'Strikes 3x targets with poison damage; hits for x ticks',
			}, {
				name: 'Decaying Doom',
				img: 'SHD-8',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'Hits single target for X arcane damage; x ticks reduce armor by x and hits for x damage',
			}, {
				name: 'Blood Terror',
				img: 'SHD-9',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'Hits 3x targets for x blood damage; fears targets for 8 seconds and hits for blood damage while feared',
			}, {
				name: 'Life Tap',
				img: 'SHD-10',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'Single-target arcane health drain',
			}, {
				name: 'Vampiric Lust',
				img: 'SHD-11',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'Hits all targets - arcane life drain and taunt',
			}, {
				name: 'Blood Feast',
				img: 'SHD-12',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'Single-target blood curse that does X damage per tick; recover health if target dies while active',
			},
		],
		RNG: [
			{
				name: 'Cross Slash',
				img: 'RNG-1',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'Hits 3 front line targets for % damage',
			}, {
				name: 'Explosive Shot',
				img: 'RNG-2',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'Launch an explosive fire arrow at 3x targets',
			}, {
				name: 'Trueshot Arrow',
				img: 'RNG-3',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'Strikes 3x targets with explosive physical damage (cannot dodge, parry, riposte)',
			}, {
				name: 'Spread Shot',
				img: 'RNG-4',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'Hits up to 5x targets for % damage',
			}, {
				name: 'Blade Storm',
				img: 'RNG-5',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'Hits single target for % damage - All melee attacks hit twice for 7 seconds',
			}, {
				name: 'Suppressing Volley',
				img: 'RNG-6',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'Hits 3x targets - Reduces threat and debuffs target strength',
			}, {
				name: 'Ignite',
				img: 'RNG-7',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'Ignites the target for X damage. Enhances all physical damage by X% for 12 seconds',
			}, {
				name: 'Shock Nova',
				img: 'RNG-8',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'Hits all targets for X lightning damage. Interrupts all spells.',
			}, {
				name: 'Faerie Flame',
				img: 'RNG-9',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'Mark a target - Direct fire damage and boosts',
			}, {
				name: 'Fungal Growth',
				img: 'RNG-10',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'Restores x health over time for 18 seconds',
			}, {
				name: 'Shimmering Orb',
				img: 'RNG-11',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'Conjure a shimmering globe that protects you for 20 seconds. Reducing all magic damage by X % for X seconds.',
			}, {
				name: 'Spirit of the Hunter',
				img: 'RNG-12',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'Boost your ability to dodge attacks by X% and receive x% haste for X seconds.',
			},
		],
		MNK: [
			{
				name: 'Tiger Strike',
				img: 'MNK-1',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'Strike for % damage - +1 Chi',
			}, {
				name: 'Hyper Strike',
				img: 'MNK-2',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'Strike for % damage and receive % haste - +1 Chi',
			}, {
				name: 'Viper Strike',
				img: 'MNK-3',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'Strike for % damage and leech extra health - +1 Chi',
			}, {
				name: 'Mime Strike',
				img: 'MNK-4',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'Hit for % damage - Next attack hits twice - +1 Chi',
			}, {
				name: 'Crane Kick',
				img: 'MNK-5',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'Strikes target for % damage - Interrupts -1 chi',
			}, {
				name: 'Feign Death',
				img: 'MNK-6',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'Reduces threat with all targets -1 chi',
			}, {
				name: 'Palm Strike',
				img: 'MNK-7',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'Delivers a powerful blow for % damage - Stuns for 2 seconds -2 chi',
			}, {
				name: 'Hurricane Kicks',
				img: 'MNK-8',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'Hit 3x targets -2 chi',
			}, {
				name: 'Dragon Punch',
				img: 'MNK-9',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'Hits front row target for % fire damage -2 chi',
			}, {
				name: 'Hadoken',
				img: 'MNK-10',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'Ranged fireball attack that hits for x % damage -2 chi',
			}, {
				name: 'Chakra Blast',
				img: 'MNK-11',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'Explode and hit all targets for X arcane damage -3 chi',
			}, {
				name: 'Spirit Barrier',
				img: 'MNK-12',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'Protect yourself in a spirit barrier that reduces all damage by 50% for x seconds -3 chi',
			},
		],
		ROG: [
			{
				name: 'Shadow Strike',
				img: 'ROG-1',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Sonic Strike',
				img: 'ROG-2',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Faded Strike',
				img: 'ROG-3',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Manic Strike',
				img: 'ROG-4',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Lacerate',
				img: 'ROG-5',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Backstab',
				img: 'ROG-6',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Widow Strike',
				img: 'ROG-7',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Stagger Shot',
				img: 'ROG-8',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Evade',
				img: 'ROG-9',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Flash Powder',
				img: 'ROG-10',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Talisman',
				img: 'ROG-11',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Prowl',
				img: 'ROG-12',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			},
		],
		DRU: [
			{
				name: 'Starfire',
				img: 'DRU-1',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Fissure',
				img: 'DRU-2',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Lightning Blast',
				img: 'DRU-3',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Blizzard',
				img: 'DRU-4',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Toxic Spores',
				img: 'DRU-5',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Molten Boulder',
				img: 'DRU-6',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Barbed Thicket',
				img: 'DRU-7',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Tornado',
				img: 'DRU-8',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Nature\'s Touch',
				img: 'DRU-9',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Moss Breath',
				img: 'DRU-10',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Synthesize',
				img: 'DRU-11',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Branch Spirit',
				img: 'DRU-12',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			},
		],
		CLR: [
			{
				name: 'Smite',
				img: 'CLR-1',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Deliverance',
				img: 'CLR-2',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Condemnation',
				img: 'CLR-3',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Sacred Revelation',
				img: 'CLR-4',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Holy Sanctuary',
				img: 'CLR-5',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Force of Glory',
				img: 'CLR-6',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Circle of Prayer',
				img: 'CLR-7',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Guardian Angel',
				img: 'CLR-8',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Divine Light',
				img: 'CLR-9',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Divine Embrace',
				img: 'CLR-10',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Seal of Redemption',
				img: 'CLR-11',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Zealous Resolve',
				img: 'CLR-12',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			},
		],
		SHM: [
			{
				name: 'Frost Rift',
				img: 'SHM-1',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Poison Nova',
				img: 'SHM-2',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Scourge',
				img: 'SHM-3',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Poison Bolt',
				img: 'SHM-4',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Vampiric Gaze',
				img: 'SHM-5',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Glacial Shard',
				img: 'SHM-6',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Affliction',
				img: 'SHM-7',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Devouring Swarm',
				img: 'SHM-8',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Rejuvinate',
				img: 'SHM-9',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Mystical Glow',
				img: 'SHM-10',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Vampiric Allure',
				img: 'SHM-11',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Boreal Talisman',
				img: 'SHM-12',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			},
		],
		BRD: [
			{
				name: 'Bellow',
				img: 'BRD-1',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Sonic Boom',
				img: 'BRD-2',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Euphonic Dirge',
				img: 'BRD-3',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Subverted Symphony',
				img: 'BRD-4',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Chords of Confusion',
				img: 'BRD-5',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Battle Hymn',
				img: 'BRD-6',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Victory Jaunt',
				img: 'BRD-7',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Shackle Chords',
				img: 'BRD-8',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Littany of Life',
				img: 'BRD-9',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Melody of Mana',
				img: 'BRD-10',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Sonnet of Steel',
				img: 'BRD-11',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Chromatic Sonnet',
				img: 'BRD-12',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			},
		],
		NEC: [
			{
				name: 'Venom Bolt',
				img: 'NEC-1',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Explosive Plague',
				img: 'NEC-2',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Blood Fire',
				img: 'NEC-3',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Demonic Pact',
				img: 'NEC-4',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Haunting Vision',
				img: 'NEC-5',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Summon Skeleton',
				img: 'NEC-6',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Sanguine Pact',
				img: 'NEC-7',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Gleam of Madness',
				img: 'NEC-8',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Drain Soul',
				img: 'NEC-9',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Breath of the Dead',
				img: 'NEC-10',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Engulfing Darkness',
				img: 'NEC-11',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Defiled Spirit',
				img: 'NEC-12',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			},
		],
		ENC: [
			{
				name: 'Gravity Flux',
				img: 'ENC-1',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Phase Blade',
				img: 'ENC-2',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Suffocation',
				img: 'ENC-3',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Mind Blitz',
				img: 'ENC-4',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Subversion',
				img: 'ENC-5',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Color Shift',
				img: 'ENC-6',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Stasis Field',
				img: 'ENC-7',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Shifting Ether',
				img: 'ENC-8',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Rune',
				img: 'ENC-9',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Augmentation',
				img: 'ENC-10',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Clarity',
				img: 'ENC-11',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Enthrall',
				img: 'ENC-12',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			},
		],
		SUM: [
			{
				name: 'Lava Bolt',
				img: 'SUM-1',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Frozen Orb',
				img: 'SUM-2',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Static Storm',
				img: 'SUM-3',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Fire Wall',
				img: 'SUM-4',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Glacial Spike',
				img: 'SUM-5',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Golem Sludge',
				img: 'SUM-6',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Summon Golem',
				img: 'SUM-7',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Golem Fury',
				img: 'SUM-8',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Golem Drain',
				img: 'SUM-9',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Lava Shield',
				img: 'SUM-10',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Lucid Synergy',
				img: 'SUM-11',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Elemental Focus',
				img: 'SUM-12',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			},
		],
		WIZ: [
			{
				name: 'Fire Bolt',
				img: 'WIZ-1',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Ice Bolt',
				img: 'WIZ-2',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Lightning Bolt',
				img: 'WIZ-3',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Magic Missiles',
				img: 'WIZ-4',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Fireball',
				img: 'WIZ-5',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Chain Lightning',
				img: 'WIZ-6',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Frost Nova',
				img: 'WIZ-7',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Meteor',
				img: 'WIZ-8',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Ice Block',
				img: 'WIZ-9',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Mirror Images',
				img: 'WIZ-10',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Counterspell',
				img: 'WIZ-11',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'Brain Freeze',
				img: 'WIZ-12',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			},
		],
	}

	///////////////////////////////////////////
	function init() {
		skills.skillNames = getClassKeys()
	}
	function getClassKeys() {
		return skills[my.job].map(o => o.name)
	}
}($, _, TweenMax, Object);