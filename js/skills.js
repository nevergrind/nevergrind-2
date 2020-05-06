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
				name: 'TestSkill',
				img: 'WAR-1',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'WAR-2',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'WAR-3',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'WAR-4',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'WAR-5',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'WAR-6',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'WAR-7',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'WAR-8',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'WAR-9',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'WAR-10',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'WAR-11',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'WAR-12',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			},
		],
		CRU: [
			{
				name: 'TestSkill',
				img: 'CRU-1',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'CRU-2',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'CRU-3',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'CRU-4',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'CRU-5',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'CRU-6',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'CRU-7',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'CRU-8',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'CRU-9',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'CRU-10',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'CRU-11',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'CRU-12',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			},
		],
		SHD: [
			{
				name: 'TestSkill',
				img: 'SHD-1',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'SHD-2',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'SHD-3',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'SHD-4',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'SHD-5',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'SHD-6',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'SHD-7',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'SHD-8',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'SHD-9',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'SHD-10',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'SHD-11',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'SHD-12',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			},
		],
		RNG: [
			{
				name: 'TestSkill0',
				img: 'RNG-1',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill1',
				img: 'RNG-2',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill2',
				img: 'RNG-3',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill3',
				img: 'RNG-4',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill4',
				img: 'RNG-5',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill5',
				img: 'RNG-6',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill6',
				img: 'RNG-7',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill7',
				img: 'RNG-8',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill8',
				img: 'RNG-9',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill9',
				img: 'RNG-10',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill10',
				img: 'RNG-11',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill11',
				img: 'RNG-12',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
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
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'MNK-2',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'MNK-3',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'MNK-4',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'MNK-5',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'MNK-6',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'MNK-7',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'MNK-8',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'MNK-9',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'MNK-10',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'MNK-11',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'MNK-12',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
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
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'ROG-2',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'ROG-3',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'ROG-4',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'ROG-5',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'ROG-6',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'ROG-7',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'ROG-8',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'ROG-9',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'ROG-10',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'ROG-11',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'ROG-12',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
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
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'DRU-2',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'DRU-3',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'DRU-4',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'DRU-5',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'DRU-6',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'DRU-7',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'DRU-8',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'DRU-9',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'DRU-10',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'DRU-11',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'DRU-12',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
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
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'CLR-2',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'CLR-3',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'CLR-4',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'CLR-5',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'CLR-6',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'CLR-7',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'CLR-8',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'CLR-9',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'CLR-10',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'CLR-11',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'CLR-12',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
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
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'SHM-2',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'SHM-3',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'SHM-4',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'SHM-5',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'SHM-6',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'SHM-7',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'SHM-8',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'SHM-9',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'SHM-10',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'SHM-11',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'SHM-12',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
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
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'BRD-2',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'BRD-3',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'BRD-4',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'BRD-5',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'BRD-6',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'BRD-7',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'BRD-8',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'BRD-9',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'BRD-10',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'BRD-11',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'BRD-12',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
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
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'NEC-2',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'NEC-3',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'NEC-4',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'NEC-5',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'NEC-6',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'NEC-7',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'NEC-8',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'NEC-9',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'NEC-10',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'NEC-11',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'NEC-12',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
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
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'ENC-2',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'ENC-3',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'ENC-4',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'ENC-5',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'ENC-6',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'ENC-7',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'ENC-8',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'ENC-9',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'ENC-10',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'ENC-11',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'ENC-12',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
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
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'SUM-2',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'SUM-3',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'SUM-4',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'SUM-5',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'SUM-6',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'SUM-7',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'SUM-8',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'SUM-9',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'SUM-10',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'SUM-11',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'SUM-12',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
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
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'WIZ-2',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'WIZ-3',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'WIZ-4',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'WIZ-5',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'WIZ-6',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'WIZ-7',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'WIZ-8',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'WIZ-9',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'WIZ-10',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'WIZ-11',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
			}, {
				name: 'TestSkill',
				img: 'WIZ-12',
				mp: 0,
				sp: 0,
				spellType: '',
				castTime: 0,
				cooldown: 0,
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