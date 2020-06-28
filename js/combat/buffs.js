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
			msg: 'Regenerative spores begin to heal your wounds.',
		},
		shimmeringOrb: {
			name: 'Shimmering Orb',
			img: 10,
			job: 'RNG',
			msg: 'A luminescent aura wraps you in a protective shell.',
		},
		spiritOfTheHunter: {
			name: 'Spirit of the Hunter',
			img: 11,
			job: 'RNG',
			duration: 300,
			msg: 'A brief lupine energy courses through your spirit.',
		},
	}
	///////////////////////////////////////////

}($, _, TweenMax);