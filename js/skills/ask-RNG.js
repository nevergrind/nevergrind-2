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
		ask.slash(o, {
			duration: .2,
			size: 250,
		})
		delayedCall(.1, () => {
			ask.starburst(_.clone(o))
		})
	}

	function explosiveShot(o) {
		ask.sunburst(_.clone(o), {
			duration: 1,
			frameDuration: .25,
			sizeEnd: 450
		})
		o.endFrame = 1
		ask.explosion(o, {
			duration: 1.25,
			contrastStart: 2,
			brightnessStart: 2,
			sizeStart: 0,
			sizeEnd: 325,
			rotation: -90,
			frameDuration: .5,
			frameEase: Power2.easeInOut,
		})
		ask.explosion(o, {
			duration: 1.25,
			contrastStart: 2,
			brightnessStart: 2,
			sizeStart: 0,
			sizeEnd: 325,
			rotation: 90,
			frameDuration: .3,
			frameEase: Power2.easeInOut,
		})
	}

	function trueshotStrike(o) {
		ask.explosion(o, {
			duration: 1.25,
			contrastStart: 2,
			brightnessStart: 2,
		})
		delayedCall(.1, () => {
			ask.moonburst(_.clone(o), {
				sizeEnd: 350
			})
		})
	}

	function spreadShot(o) {
		ask.explosion(o, {
			duration: 1.2
		})
		delayedCall(.1, () => {
			ask.moonburst(_.clone(o))
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
		o.endFrame = 2
		ask.explosion(o, {
			contrastStart: 4,
			brightnessStart: 12,
			duration: 1,
			frameDuration: .33,
			frameEase: Power2.easeInOut,
			startSize: 0,
			sizeEnd: 500,
			ease: Power4.easeOut,
		})
		ask.explosion(o, {
			contrastStart: 3,
			brightnessStart: 6,
			duration: 1,
			frameDuration: .33,
			frameEase: Power2.easeInOut,
			startSize: 0,
			sizeEnd: 400,
			ease: Power4.easeOut,
		})
		ask.explosion(o, {
			contrastStart: 2,
			brightnessStart: 4,
			duration: 1,
			frameDuration: .33,
			frameEase: Power2.easeInOut,
			startSize: 0,
			sizeEnd: 250,
			ease: Power4.easeOut,
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
		o.endFrame = 2
		ask.flameRip(o, {
			duration: .75,
			frameDuration: .3,
			sizeStart: 50,
			sizeEnd: 200,
			yoyo: true,
			yStart: ask.shadowY(o.index),
			anchorY: .845, // 433/512
			ease: Power4.easeOut,
		})
	}
	function fungalGrowth(o) {
		// flash of light animates down over target
		o.endFrame = 2
		ask.explosion(o, {
			targetMob: false,
			contrastStart: 2,
			brightnessStart: 3,
			duration: 1,
			frameDuration: .33,
			frameEase: Power3.easeOut,
			rotation: 180,
			startSize: 0,
			sizeEnd: 500,
			ease: Power3.easeOut,
		})
		ask.explosion(o, {
			targetMob: false,
			contrastStart: 2,
			brightnessStart: 3,
			duration: 1,
			frameDuration: .33,
			frameEase: Power3.easeOut,
			rotation: -180,
			startSize: 0,
			sizeEnd: 500,
			ease: Power3.easeOut,
		})
		ask.explosion(o, {
			targetMob: false,
			contrastStart: 4,
			brightnessStart: 8,
			duration: 1,
			frameDuration: .33,
			frameEase: Power3.easeOut,
			rotation: 90,
			startSize: 0,
			sizeEnd: 250,
			ease: Power3.easeOut,
		})
		ask.explosion(o, {
			targetMob: false,
			contrastStart: 4,
			brightnessStart: 8,
			duration: 1,
			frameDuration: .33,
			frameEase: Power3.easeOut,
			rotation: -90,
			startSize: 0,
			sizeEnd: 250,
			ease: Power3.easeOut,
		})
	}
	function shimmeringOrb(o) {
		// buff received - filter on icon?
		ask.explosion(o, {
			targetMob: false,
			contrastStart: 3,
			brightnessStart: 3,
			duration: 1.5,
			rotation: 135,
			startSize: 200,
			sizeEnd: 300,
			startAlpha: .6,
			alpha: 0,
			ease: Power2.easeOut,
		})
		ask.explosion(o, {
			targetMob: false,
			contrastStart: 3,
			brightnessStart: 3,
			duration: 1.5,
			rotation: -135,
			startSize: 200,
			sizeEnd: 300,
			startAlpha: .6,
			alpha: 0,
			ease: Power2.easeOut,
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