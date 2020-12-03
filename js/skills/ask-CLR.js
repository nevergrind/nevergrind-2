!function($, _, TweenMax, Power0, Power1, Power2, Power3, Power4, undefined) {
	ask = {
		...ask,
		smite,
		deliverance,
		condemnation,
		sacredRevelation,
		holySanctuary,
		forceOfGlory,
		circleOfPrayer,
		guardianAngel,
		divineLight,
		bindingGrace,
		sealOfRedemption,
		zealousResolve,
	}
	///////////////////////////////////////////

	function smite(o) {
		ask.explosion(o, {
			duration: 1.2
		})
	}
	function deliverance(o) {
		ask.explosion(o, {
			duration: 1.2
		})
	}
	function condemnation(o) {
		for (var j=0; j<2; j++) {
			delayedCall(j * .1, () => {
				o.key = 'condemnation'
				ask.groundExplosion(o, {
					contrastStart: 1.5,
					brightnessStart: 3,
					duration: .333,
					sizeStart: 0,
					sizeEnd: 320,
					alpha: 0,
					yoyo: false,
					ease: Power2.easeOut,
				})
			})
		}
		for (var i=0; i<3; i++) {
			delayedCall(i * .1, () => {
				o.key = 'condemnation-cross'
				ask.explosion(o, {
					contrastStart: 1.5,
					brightnessStart: 3,
					duration: .5,
					sizeStart: 320,
					sizeEnd: 0,
					alpha: 0,
					ease: Power2.easeOut,
				})
			})
		}
		for (var i=0; i<2; i++) {
			delayedCall(i * .05, () => {
				o.key = 'condemnation-particle'
				ask.explosion(o, {
					contrastStart: 1.5,
					brightnessStart: 3,
					duration: .5,
					sizeStart: 0,
					sizeEnd: 320,
					rotationStart: _.random(0, 360),
					alpha: 0,
					ease: Power2.easeOut,
				})
			})
		}
	}
	function sacredRevelation(o) {
		ask.explosion(o, {
			duration: 1.2
		})
	}
	function holySanctuary(o) {
		ask.explosion(o, {
			duration: 1.2
		})
	}
	function forceOfGlory(o) {
		ask.explosion(o, {
			duration: 1.2
		})
	}
	function circleOfPrayer(o) {
		delayedCall(.2, () => {
			ask.particleGroup({
				..._.clone(o),
				key: 'particle-group-arcane',
			}, {
				targetMob: false,
				duration: .4,
				interval: .05,
				sizeStart: 128,
				sizeEnd: 64,
				xRange: 96,
				yRange: 0,
				loops: 5,
			})
		})
		o.endFrame = 2
		ask.groundExplosion(o, {
			targetMob: false,
			yStart: ask.shadowY(o.index, false) + 25,
			contrastStart: 1.5,
			brightnessStart: 4,
			duration: 1,
			frameDuration: .6,
			frameEase: Power2.easeOut,
			sizeStart: 360,
			sizeEnd: 360,
			yoyo: false,
			alpha: 0,
			ease: Power2.easeOut,
		})
	}
	function guardianAngel(o) {
		ask.explosion(o, {
			targetMob: false,
			duration: 1.2
		})
	}
	function divineLight(o) {
		ask.explosion(o, {
			targetMob: false,
			duration: 1.2
		})
	}
	function bindingGrace(o) {
		delayedCall(.2, () => {
			ask.particleGroup({
				..._.clone(o),
				key: 'particle-group-arcane',
			}, {
				targetMob: false,
				duration: .4,
				interval: .1,
				sizeStart: 128,
				sizeEnd: 64,
				xRange: 50,
				yRange: 0,
				loops: 3,
			})
		})
		o.endFrame = 1
		ask.explosion(o, {
			targetMob: false,
			contrastStart: 1.5,
			brightnessStart: 2,
			duration: 1,
			frameDuration: 1,
			frameEase: Power1.easeOut,
			rotation: 180,
			sizeStart: 256,
			sizeEnd: 200,
			ease: Power0.easeOut,
		})
		ask.explosion(o, {
			targetMob: false,
			contrastStart: 1.5,
			brightnessStart: 2,
			duration: 1,
			frameDuration: 1,
			frameEase: Power1.easeOut,
			rotation: -180,
			sizeStart: 256,
			sizeEnd: 200,
			ease: Power0.easeOut,
		})
	}
	function sealOfRedemption(o) {
		ask.explosion(o, {
			targetMob: false,
			duration: 1.2
		})
	}
	function zealousResolve(o) {
		ask.explosion(o, {
			targetMob: false,
			duration: 1.2
		})
	}
}($, _, TweenMax, Power0, Power1, Power2, Power3, Power4);