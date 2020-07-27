let buffs; // buff data for use with skill/spells/icons
!function($, _, TweenMax, undefined) {
	buffs = {
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
			msg: () => 'A luminescent aura wraps you in a protective shell.',
		},
		spiritOfTheHunter: {
			name: 'Spirit of the Hunter',
			img: 11,
			job: 'RNG',
			duration: 300,
			msg: () => 'A brief lupine energy courses through your spirit.',
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
			base: 8,
			bloodPerLevel: 2,
			msg: () => 'Your forehead is emblazoned with a crimson seal.',
			fadeMsg: 'Your crimson seal fades.'
		},
		zealousResolve: {
			name: 'Zealous Resolve',
			img: 11,
			job: 'CLR',
			duration: 720,
			armorRatio: .25,
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
			msg: () => 'A protective bulwark surrounds you!',
			fadeMsg: 'The bulwark fades.'
		},
	}
	///////////////////////////////////////////

}($, _, TweenMax);