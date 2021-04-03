!function($, _, TweenMax, Power0, Power1, Power2, Power3, Power4, RoughEase, undefined) {
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
		ask.explosion({index: o.index, key: 'burst-arcane'}, {
			sizeEnd: 250,
			duration: .5
		})
		ask.particleSmall({
			index: o.index,
			key: 'particle-small-arcane',
		}, {
			interval: .001,
			loops: 7,
			sizeStart: 32,
			sizeEnd: 8,
			xRange: 150,
			yRange: 50,
		})
		o.endFrame = 2
		ask.explosion(o, {
			contrastStart: 2,
			brightnessStart: 5,
			sizeStart: 200,
			sizeEnd: 300,
			duration: .6,
			frameDuration: .4,
			frameEase: Power0.easeIn,
		})
	}
	function deliverance(o) {
		ask.sunburst({index: o.index})
		o.endFrame = 1
		ask.explosion(o, {
			contrastStart: 2,
			brightnessStart: 5,
			sizeStart: 100,
			sizeEnd: 400,
			duration: .8,
			frameDuration: .33,
			ease: Power2.easeOut,
			frameEase: Power0.easeIn,
		})
		ask.explosion({index: o.index, key: 'deliverance-eye'}, {
			contrastStart: 1.5,
			brightnessStart: 2,
			contrastEnd: 1,
			brightnessEnd: .5,
			sizeStart: 164,
			sizeEnd: 128,
			duration: .4,
			alpha: 1,
			ease: Power2.easeOut,
			yStart: ask.centerY(o.index, false) - 400,
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
		for (var i=0; i<2; i++) {
			delayedCall(i * .1, () => {
				o.key = 'condemnation-cross'
				ask.explosion(o, {
					contrastStart: 1.5,
					brightnessStart: 3,
					duration: .5,
					sizeStart: 320,
					sizeEnd: 100,
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
		ask.particleCircle({
			index: o.index,
			key: 'particle-circle-arcane',
		}, {
			duration: .5,
			ease: Power0.easeOut,
			alpha: 0,
			rotation: 0,
			sizeEnd: 300,
		})
		o.key = 'sacredRevelation-glow'
		ask.explosion(o, {
			contrastStart: 1.2,
			brightnessStart: 2,
			sizeStart: 0,
			sizeEnd: 512,
			alpha: 0,
			duration: .5,
			ease: Power2.easeOut,
		})
		for (var i=0; i<4; i++) {
			!function(i) {
				delayedCall(i * .01, () => {
					o.key = 'sacredRevelation'
					ask.explosion(o, {
						contrastStart: 1.2,
						brightnessStart: 2,
						contrastEnd: 1,
						brightnessEnd: 1,
						sizeStart: 0,
						sizeEnd: 350,
						alpha: 0,
						duration: 1.2,
						ease: Back.easeOut,
					})
					ask.rings({index: o.index, type: 'arcane'}, {
						loops: 1,
						duration: .4,
					})
				})
			}(i)
		}
	}
	function holySanctuary(o) {
		ask.particleCircle({
			..._.clone(o),
			key: 'particle-circle-default',
		}, {
			duration: .5,
			ease: Power0.easeOut,
			alpha: 0,
			rotation: 0,
			sizeEnd: 333,
		})
		for (var i=0; i<4; i++) {
			!function(i) {
				delayedCall(i * .1, () => {
					o.key = 'holySanctuary-particle'
					o.endFrame = 2
					ask.explosion(o, {
						sizeStart: 256,
						sizeEnd: 256,
						duration: .5,
						rotation: i % 2 === 1 ? 90 : -90,
						frameDuration: .5,
						alpha: 0,
						ease: Power2.easeOut,
					})
				})
			}(i)

		}
		ask.moonburst(_.clone(o), {
			duration: 1,
			sizeEnd: 200
		})
		ask.moonburst(_.clone(o), {
			duration: 1.2,
			sizeEnd: 400
		})
		delayedCall(.25, () => {
			ask.starburst(_.clone(o))
		})
	}
	function forceOfGlory(o) {
		ask.groundExplosion(o, {
			contrastStart: 2,
			brightnessStart: 4,
			duration: .6,
			sizeStart: 200,
			sizeEnd: 420,
			anchorY: .93,
			alpha: 0,
			yoyo: false,
			ease: Power2.easeOut,
		})
		o.key = 'forceOfGlory-fist'
		ask.explosion(o, {
			contrastStart: 1.5,
			brightnessStart: 2,
			contrastEnd: 1,
			brightnessEnd: .5,
			sizeStart: 164,
			sizeEnd: 128,
			duration: .4,
			alpha: 1,
			ease: RoughEase.ease.config({
				strength: 3,
				points: 50,
				template: Strong.easeInOut,
				taper: 'both',
				randomize: false
			}),
			yStart: ask.centerY(o.index, false) - 400,
		})
	}
	function circleOfPrayer(o) {
		delayedCall(.2, () => {
			ask.particleGroup({
				index: o.index,
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
			contrastStart: 1.5,
			brightnessStart: 4,
			duration: 1,
			frameDuration: .6,
			frameEase: Power2.easeOut,
			sizeStart: 360,
			sizeEnd: 360,
			anchorY: .82,
			yoyo: false,
			alpha: 0,
			ease: Power2.easeOut,
		})
	}
	function guardianAngel(o) {
		o.key = 'guardianAngel-light'
		ask.explosion(o, {
			targetMob: false,
			contrastStart: 1.5,
			brightnessStart: 3,
			sizeStart: 0,
			sizeEnd: 350,
			duration: 1,
			ease: Power2.easeOut,
		})
		o.key = 'guardianAngel'
		o.endFrame = 3
		ask.explosion(o, {
			targetMob: false,
			contrastStart: 1.5,
			brightnessStart: 3,
			sizeStart: 300,
			sizeEnd: 400,
			duration: .7,
			frameDuration: .7,
			frameEase: Power4.easeOut,
			ease: Power2.easeOut,
		})
	}
	function divineLight(o) {
		ask.explosion(o, {
			targetMob: false,
			contrastStart: 1.5,
			brightnessStart: 3,
			sizeStart: 224,
			sizeEnd: 256,
			duration: .7,
			ease: Power2.easeOut,
		})
		delayedCall(.1, () => {
			ask.explosion({index: o.index, key: 'divineLight1'}, {
				targetMob: false,
				contrastStart: 1.5,
				brightnessStart: 3,
				sizeStart: 320,
				sizeEnd: 400,
				duration: .7,
				ease: Power2.easeOut,
			})
		})
		delayedCall(.2, () => {
			ask.explosion({index: o.index, key: 'divineLight2'}, {
				targetMob: false,
				contrastStart: 2,
				brightnessStart: 4,
				sizeStart: 320,
				sizeEnd: 400,
				duration: 1,
				ease: Power2.easeOut,
			})
		})
		delayedCall(.3, () => {
			ask.explosion({index: o.index, key: 'divineLight3'}, {
				targetMob: false,
				contrastStart: 1.5,
				brightnessStart: 3,
				contrastEnd: 0,
				brightnessEnd: 0,
				sizeStart: 320,
				sizeEnd: 400,
				duration: .7,
				ease: Power3.easeOut,
			})
		})
		delayedCall(.4, () => {
			ask.particleGroup({
				index: o.index,
				key: 'particle-group-arcane',
			}, {
				targetMob: false,
				duration: .3,
				interval: .1,
				sizeStart: 192,
				sizeEnd: 128,
				xRange: 60,
				yRange: 0,
				loops: 3,
			})
		})
	}
	function bindingGrace(o) {
		delayedCall(.2, () => {
			ask.particleGroup({
				index: o.index,
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
			duration: 3,
			sizeStart: 256,
			sizeEnd: 128,
		})
		delayedCall(.25, () => {
			ask.explosion({
				index: o.index,
				key: 'sealOfRedemption1'
			}, {
				targetMob: false,
				duration: 2.75,
				sizeStart: 300,
				sizeEnd: 200,
			})
		})
		delayedCall(.5, () => {
			ask.explosion({
				index: o.index,
				key: 'sealOfRedemption2'
			}, {
				targetMob: false,
				brightnessStart: 3,
				duration: 2,
				sizeStart: 300,
				sizeEnd: 200,
			})
		})
	}
	function zealousResolve(o) {
		ask.explosion(o, {
			targetMob: false,
			duration: 3,
			sizeStart: 320,
			sizeEnd: 250,
		})
		ask.explosion({index: my.row, key: 'mysticalGlow-p1'}, {
			targetMob: false,
			contrastStart: 2,
			brightnessStart: 4,
			sizeStart: 320,
			sizeEnd: 400,
			duration: 1.2,
			ease: Power2.easeOut,
		})
		delayedCall(.5, () => {
			ask.explosion({
				index: o.index,
				key: 'zealousResolve-buff'
			}, {
				targetMob: false,
				brightnessStart: 12,
				duration: 2,
				sizeStart: 200,
				sizeEnd: 150,
			})
		})
	}
}($, _, TweenMax, Power0, Power1, Power2, Power3, Power4, RoughEase);