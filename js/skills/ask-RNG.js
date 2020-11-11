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
		delayedCall(.25, () => {
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
	}

	function trueshotStrike(o) {
		o.endFrame = 1
		ask.explosion(o, {
			contrastStart: 2,
			brightnessStart: 5,
			sizeStart: 100,
			sizeEnd: 500,
			duration: 1,
			ease: Power2.easeOut,
			frameDuration: .5,
			frameEase: Power0.easeOut,
		})
		delayedCall(.1, () => {
			ask.moonburst(_.clone(o), {
				sizeEnd: 200
			})
			ask.moonburst(_.clone(o), {
				duration: 1,
				sizeEnd: 400
			})
			ask.moonburst(_.clone(o), {
				duration: 1.2,
				sizeEnd: 800
			})
		})
	}

	function spreadShot(o) {
		o.endFrame = 2
		ask.groundExplosion(o, {
			yStart: ask.shadowY(o.index, true) + 25,
			contrastStart: 2,
			brightnessStart: 4,
			sizeStart: 25,
			sizeEnd: 312,
			duration: .4,
			frameDuration: .15,
			yoyo: false,
			alpha: 0,
			frameEase: Power0.easeOut,
			ease: Power3.easeOut,
		})
		delayedCall(.1, () => {
			ask.moonburst(_.clone(o))
		})
		ask.particleCircle({
			..._.clone(o),
			key: 'particle-circle-default',
		}, {
			duration: .3,
			ease: Power0.easeOut,
			alpha: 0,
			rotation: 0,
			sizeEnd: 200,
		})
		ask.particleSmall({
			..._.clone(o),
			key: 'particle-small-default',
		}, {
			interval: .016,
			loops: _.random(4, 7),
			sizeStart: 32,
			sizeEnd: 4,
			xRange: 150,
			yRange: 50,
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
		o.endFrame = 2
		ask.groundExplosion(o, {
			yStart: ask.shadowY(o.index, true) + 25,
			contrastStart: 2,
			brightnessStart: 4,
			sizeStart: 25,
			sizeEnd: 312,
			duration: .5,
			frameDuration: .2,
			yoyo: false,
			alpha: 0,
			frameEase: Power2.easeIn,
			ease: Power3.easeOut,
		})
		delayedCall(.1, () => {
			ask.moonburst(_.clone(o))
		})
		ask.particleCircle({
			..._.clone(o),
			key: 'particle-circle-purple',
		}, {
			duration: .3,
			ease: Power0.easeOut,
			alpha: 0,
			rotation: 0,
			sizeEnd: 200,
		})
		ask.particleSmall({
			..._.clone(o),
			key: 'particle-small-purple',
		}, {
			interval: .016,
			loops: _.random(4, 7),
			sizeStart: 32,
			sizeEnd: 4,
			xRange: 150,
			yRange: 50,
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
			sizeStart: 0,
			sizeEnd: 500,
			ease: Power4.easeOut,
		})
		ask.explosion(o, {
			contrastStart: 3,
			brightnessStart: 6,
			duration: 1,
			frameDuration: .33,
			frameEase: Power2.easeInOut,
			sizeStart: 0,
			sizeEnd: 400,
			ease: Power4.easeOut,
		})
		ask.explosion(o, {
			contrastStart: 2,
			brightnessStart: 4,
			duration: 1,
			frameDuration: .33,
			frameEase: Power2.easeInOut,
			sizeStart: 0,
			sizeEnd: 250,
			ease: Power4.easeOut,
		})
		ask.particleSmall({
			..._.clone(o),
			key: 'particle-small-fire',
		}, {
			interval: .001,
			loops: 25,
			sizeStart: 32,
			sizeEnd: 8,
			xRange: 200,
			yRange: 50,
		})
	}

	function shockNova(o) {
		// nova
		o.endFrame = 3
		ask.explosion(o, {
			yStart: ask.shadowY(o.index, true) - 100,
			contrastStart: 2,
			brightnessStart: 4,
			duration: 1,
			frameDuration: .25,
			frameEase: Power0.easeOut,
			sizeStart: 200,
			sizeEnd: 512,
			ease: Power3.easeOut,
		})
		ask.particleSmall({
			..._.clone(o),
			key: 'particle-small-lightning',
		}, {
			interval: .016,
			loops: 5,
			sizeStart: 32,
			sizeEnd: 8,
			xRange: 150,
			yRange: 50,
		})
		/*ask.nova(o, {
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
		})*/
	}
	function faerieFlame(o) {
		ask.particleGroup({
			..._.clone(o),
			key: 'particle-group-fire',
		}, {
			interval: .0166,
			sizeStart: 256,
			sizeEnd: 256,
			xRange: 0,
			yRange: 0,
			loops: 1
		})
		ask.particleSmall({
			..._.clone(o),
			key: 'particle-small-fire',
		}, {
			interval: .001,
			loops: 25,
			sizeStart: 32,
			sizeEnd: 8,
			xRange: 150,
			yRange: 50,
		})

		/*o.endFrame = 2
		ask.flameRip(o, {
			duration: .75,
			frameDuration: .3,
			sizeStart: 50,
			sizeEnd: 200,
			yoyo: true,
			yStart: ask.shadowY(o.index, true),
			anchorY: .845, // 433/512
			ease: Power4.easeOut,
		})*/
/*
		ask.sunburst(_.clone(o), {
			duration: .6,
			frameDuration: .15,
			sizeEnd: 350
		})
		ask.particleCircle({
			..._.clone(o),
			key: 'particle-circle-fire',
		}, {
			duration: .33,
			ease: Power1.easeOut,
			alpha: 0,
			rotation: 0,
			sizeEnd: 350,
		})
		*/
	}
	function fungalGrowth(o) {
		// flash of light animates down over target
		delayedCall(.3, () => {
			ask.particleGroup({
				..._.clone(o),
				key: 'particle-group-arcane',
			}, {
				targetMob: false,
				duration: .4,
				interval: .1,
				sizeStart: 192,
				sizeEnd: 128,
				xRange: 50,
				yRange: 0,
				loops: 3,
			})
		})
		o.endFrame = 2
		ask.explosion(o, {
			targetMob: false,
			contrastStart: 2,
			brightnessStart: 3,
			duration: 1.25,
			frameDuration: .4,
			frameEase: Power3.easeIn,
			rotation: 180,
			sizeStart: 0,
			sizeEnd: 500,
			ease: Power3.easeOut,
		})
		ask.explosion(o, {
			targetMob: false,
			contrastStart: 2,
			brightnessStart: 3,
			duration: 1.25,
			frameDuration: .4,
			frameEase: Power3.easeIn,
			rotation: -180,
			sizeStart: 0,
			sizeEnd: 500,
			ease: Power3.easeOut,
		})
		ask.explosion(o, {
			targetMob: false,
			contrastStart: 4,
			brightnessStart: 8,
			duration: 1.25,
			frameDuration: .4,
			frameEase: Power3.easeIn,
			rotation: 90,
			sizeStart: 0,
			sizeEnd: 250,
			ease: Power3.easeOut,
		})
		ask.explosion(o, {
			targetMob: false,
			contrastStart: 4,
			brightnessStart: 8,
			duration: 1.25,
			frameDuration: .4,
			frameEase: Power3.easeIn,
			rotation: -90,
			sizeStart: 0,
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
			sizeStart: 200,
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
			sizeStart: 200,
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
			sizeStart: 300,
			sizeEnd: 300,
		})
		delayedCall(.25, () => {
			ask.explosion({
				..._.clone(o),
				key: 'spiritOfTheHunter1'
			}, {
				targetMob: false,
				duration: 4.75,
				sizeStart: 300,
				sizeEnd: 200,
			})
		})
		delayedCall(.5, () => {
			ask.explosion({
				..._.clone(o),
				key: 'spiritOfTheHunter2'
			}, {
				targetMob: false,
				brightnessStart: 12,
				duration: 4,
				sizeStart: 300,
				sizeEnd: 200,
			})
		})
	}
}($, _, TweenMax, Power0, Power1, Power2, Power3, Power4);