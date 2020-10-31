!function($, _, TweenMax, Power0, Power1, Power2, Power3, Power4, undefined) {
	ask = {
		...ask,
		crossSlash,
		explosiveShot,
		trueshotStrike,
		spreadShot,
		bladeStorm,
		suppressingVolley,
		burningEmbers,
		shockNova,
		faerieFlame,
		fungalGrowth,
		shimmeringOrb,
		spiritOfTheHunter,
	}
	///////////////////////////////////////////

	function crossSlash(o) {
		ask.pierce(o, {
			size: 300,
			duration: .25,
		})
	}

	function explosiveShot(o) {
		ask.explosion(o, {
			duration: 1.25,
			sizeStart: 60,
			sizeEnd: 300,
			contrastStart: 2,
			brightnessStart: 2,
		})
	}

	function trueshotStrike(o) {
		ask.explosion(o, {
			duration: 1.25,
			contrastStart: 2,
			brightnessStart: 2,
		})
	}

	function spreadShot(o) {
		ask.explosion(o, {
			duration: 1.2
		})
	}

	function bladeStorm(o) {
		for (var i=0; i<5; i++) {
			!function(i) {
				delayedCall(i * .05, () => {
					ask.slash(o, {
						duration: .25,
						size: 200,
						yAdjust: (i * 50) - 100
					})
				})
			}(i)
		}
	}

	function suppressingVolley(o) {
		ask.explosion(o, {
			duration: 1.2
		})
	}

	function burningEmbers(o) {
		// add particles explosion
		ask.explosion(o, {
			duration: 1.5,
			sizeEnd: 400,
		})
	}

	function shockNova(o) {
		// nova
		ask.nova(o, {
			position: 'center',
			rotation: util.rotation(45),
			width: 400,
			loops: 3,
			zIndex: 200,
		})
		ask.nova(o, {
			position: 'center',
			rotation: util.rotation(135),
			loops: 3,
			width: 400,
			zIndex: 200,
		})
	}
	function faerieFlame(o) {
		// explosion + particles fall
		ask.explosion(o, {
			duration: 1.2
		})
	}
	function fungalGrowth(o) {
		// flash of light animates down over target
		ask.explosion(o, {
			targetMob: false,
			duration: 5,
			sizeEnd: 500,
		})
	}
	function shimmeringOrb(o) {
		// buff received - filter on icon?
		ask.explosion(o, {
			targetMob: false,
			duration: 5,
			sizeEnd: 500,
		})
	}
	function spiritOfTheHunter(o) {
		// buff received - filter on icon?
		ask.explosion(o, {
			targetMob: false,
			duration: 5,
			sizeEnd: 500,
		})
	}
}($, _, TweenMax, Power0, Power1, Power2, Power3, Power4);