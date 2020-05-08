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
				description: 'Hits all front line targets for % damage',
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
				name: 'Cheetah Spirit',
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
				name: 'TestSkill',
				img: 'MNK-1',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'MNK-2',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'MNK-3',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'MNK-4',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'MNK-5',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'MNK-6',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'MNK-7',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'MNK-8',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'MNK-9',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'MNK-10',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'MNK-11',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'MNK-12',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			},
		],
		ROG: [
			{
				name: 'TestSkill',
				img: 'ROG-1',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'ROG-2',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'ROG-3',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'ROG-4',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'ROG-5',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'ROG-6',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'ROG-7',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'ROG-8',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'ROG-9',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'ROG-10',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'ROG-11',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
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
				name: 'TestSkill',
				img: 'DRU-1',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'DRU-2',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'DRU-3',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'DRU-4',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'DRU-5',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'DRU-6',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'DRU-7',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'DRU-8',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'DRU-9',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'DRU-10',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'DRU-11',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
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
				name: 'TestSkill',
				img: 'CLR-1',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'CLR-2',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'CLR-3',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'CLR-4',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'CLR-5',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'CLR-6',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'CLR-7',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'CLR-8',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'CLR-9',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'CLR-10',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'CLR-11',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
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
				name: 'TestSkill',
				img: 'SHM-1',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'SHM-2',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'SHM-3',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'SHM-4',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'SHM-5',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'SHM-6',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'SHM-7',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'SHM-8',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'SHM-9',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'SHM-10',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'SHM-11',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
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
				name: 'TestSkill',
				img: 'BRD-1',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'BRD-2',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'BRD-3',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'BRD-4',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'BRD-5',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'BRD-6',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'BRD-7',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'BRD-8',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'BRD-9',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'BRD-10',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'BRD-11',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
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
				name: 'TestSkill',
				img: 'NEC-1',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'NEC-2',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'NEC-3',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'NEC-4',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'NEC-5',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'NEC-6',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'NEC-7',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'NEC-8',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'NEC-9',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'NEC-10',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'NEC-11',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
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
				name: 'TestSkill',
				img: 'ENC-1',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'ENC-2',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'ENC-3',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'ENC-4',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'ENC-5',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'ENC-6',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'ENC-7',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'ENC-8',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'ENC-9',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'ENC-10',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'ENC-11',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
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
				name: 'TestSkill',
				img: 'SUM-1',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'SUM-2',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'SUM-3',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'SUM-4',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'SUM-5',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'SUM-6',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'SUM-7',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'SUM-8',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'SUM-9',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'SUM-10',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'SUM-11',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
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
				name: 'TestSkill',
				img: 'WIZ-1',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'WIZ-2',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'WIZ-3',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'WIZ-4',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'WIZ-5',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'WIZ-6',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'WIZ-7',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'WIZ-8',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'WIZ-9',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'WIZ-10',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
				img: 'WIZ-11',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldownTime: 0,
				description: 'LoremIpsum',
			}, {
				name: 'TestSkill',
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