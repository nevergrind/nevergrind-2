let buffs; // buff data for use with skill/spells/icons
!function($, _, TweenMax, undefined) {
	buffs = {
		// damage debuffs
		suppressingVolley: {
			name: 'Suppressing Volley',
			img: 5,
			job: 'RNG',
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
		// HoTs
		fungalGrowth: {
			name: 'Fungal Growth',
			img: 9,
			job: 'RNG',
			ticks: 10,
			interval: 3,
			duration: 30,
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
		sacredRevelation: {
			name: 'Sacred Revelation',
			img: 3,
			job: 'CLR',
			duration: 3,
		},
		// instant heals
		circleOfPrayer: {
			name: 'Circle of Prayer',
			img: 9,
			job: 'CLR',
			duration: 0,
				hate: .5,
			msg: (buff) => 'Circle of Prayer heals you for ' + buff.damage + ' health.',
		},
		bindingGrace: {
			name: 'Circle of Prayer',
			img: 6,
			job: 'CLR',
			duration: 0,
			hate: .4,
			msg: (buff) => 'Binding Grace heals you for ' + buff.damage + ' health.',
		},
		guardianAngel: {
			name: 'Guardian Angel',
			img: 7,
			job: 'CLR',
			duration: 30,
			hate: .5,
			msg: () => 'A guardian angel\'s wings surround you.',
			msgAbsorb: 'Your guardian angel protects you from harm.'
		},
		divineLight: {
			name: 'Divine Light',
			img: 8,
			job: 'CLR',
			duration: 0,
			hate: .8,
			msg: (buff) => 'Divine Light heals you for ' + buff.damage + ' health.',
		},
		sealOfRedemption: {
			name: 'Seal of Redemption',
			img: 10,
			job: 'CLR',
			duration: 5,
			msg: () => 'Your forehead is emblazoned with a crimson seal.',
			fadeMsg: 'Your crimson seal fades.'
		},
		zealousResolve: {
			name: 'Zealous Resolve',
			img: 11,
			job: 'CLR',
			duration: 5,
			msg: () => 'Your spirit ignites with zealous resolve.',
			fadeMsg: 'Your zealous resolve fades.'
		},
	}
	///////////////////////////////////////////

}($, _, TweenMax);