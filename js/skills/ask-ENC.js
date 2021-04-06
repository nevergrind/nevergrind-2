!function($, _, TweenMax, Power0, Power1, Power2, Power3, Power4, undefined) {
	ask = {
		...ask,
		gravityFlux,
		staticSuffocation,
		mindBlitz,
		subversion,
		colorShift,
		phaseBlade,
		stasisField,
		shiftingEther,
		sereneSigil,
		augmentation,
		clarity,
		enthrall,
	}
	///////////////////////////////////////////

	function gravityFlux(o) {
		const yBottom = ask.bottomY(o.index, true) + 60
		ask.explosion({index: o.index, key: 'burst-purple'})
		ask.nova({index: o.index, key: 'cast-swirl-purple'}, {
			position: 'bottom',
			loops: 1,
		})
		ask.groundExplosion(o, {
			contrastStart: 1.5,
			brightnessStart: 2,
			yStart: yBottom,
			sizeStart: 200,
			sizeEnd: 300,
			duration: .8,
			alpha: 0,
			yoyo: false,
		})
		ask.groundExplosion({index: o.index, key: 'gravityFlux1'}, {
			contrastStart: 1.5,
			brightnessStart: 2,
			yStart: yBottom,
			sizeStart: 200,
			sizeEnd: 300,
			duration: .6,
			alpha: 0,
			yoyo: false,
		})
		ask.explosion({index: o.index, key: 'gravityFlux-center'}, {
			contrastStart: 1.5,
			brightnessStart: 2,
			rotation: 360,
			sizeStart: 0,
			sizeEnd: 300,
			duration: .4,
		})
	}
	function staticSuffocation(o) {
		o.endFrame = 3
		const centerX = mob.centerX[o.index]
		const centerY = ask.centerY(o.index, true)
		const bottomY = ask.bottomY(o.index, true)
		for (var i=0; i<5; i++) {
			(i => {
				let xStart = centerX + _.random(-100, 100)
				let yStart = centerY + _.random(-100, 100)
				let yEnd = Math.min(yStart + 30, bottomY)
				let dur = _.random(.32, .52)
				ask.explosion({index: o.index, key: 'orb-lightning'}, {
					contrastStart: 1.5,
					brightnessStart: 3,
					sizeStart: 150,
					sizeEnd: 0,
					duration: 1,
					xStart: xStart,
					yStart: yStart,
					yEnd: yEnd,
				})
				ask.explosion(o, {
					contrastStart: 1.5,
					brightnessStart: 3,
					xStart: xStart,
					yStart: yStart,
					yEnd: yEnd,
					sizeStart: 160,
					sizeEnd: 120,
					alpha: 1,
					duration: dur,
					frameDuration: dur,
					frameEase: Power0.easeIn,
				})
			})(i)
		}
	}
	function mindBlitz(o) {
		ask.nova({index: o.index, key: 'cast-swirl-lightning'}, {
			position: 'bottom',
			loops: 4,
			duration: .3
		})
		let shadowY = ask.bottomY(o.index, true) + 90
		o.endFrame = 3
		ask.groundExplosion(o, {
			yStart: shadowY,
			contrastStart: 1.5,
			brightnessStart: 3,
			width: 512,
			height: 512,
			yoyo: false,
			alpha: 1,
			duration: .24,
			frameDuration: .24,
			frameEase: Power0.easeIn,
		})
		ask.particleSmall({
			index: o.index,
			key: 'particle-small-lightning',
		}, {
			interval: .001,
			loops: 15,
			sizeStart: 24,
			sizeEnd: 4,
			xRange: 400,
			yRange: 50,
		})
	}
	function subversion(o) {
		o.endFrame = 2
		const centerX = mob.centerX[o.index]
		const centerY = ask.centerY(o.index, true)
		const bottomY = ask.bottomY(o.index, true)
		for (var i=0; i<8; i++) {
			(i => {
				let xStart = centerX + _.random(-80, 80)
				let yStart = centerY + _.random(-80, 80)
				let dur = _.random(.24, .36)
				let img = ask.explosion({index: o.index, key: 'orb-poison'}, {
					contrastStart: 1.5,
					brightnessStart: 3,
					sizeStart: 150,
					sizeEnd: 32,
					duration: dur + .3,
					xStart: xStart,
					yStart: yStart,
					yEnd: yStart + 70,
				})
				TweenMax.to(img, dur + .3, {
					y: '+=' + 70
				})
				ask.explosion(o, {
					contrastStart: 1.5,
					brightnessStart: 3,
					xStart: xStart,
					yStart: yStart,
					yEnd: Math.min(yStart + 30, bottomY),
					sizeStart: 100,
					sizeEnd: 50,
					alpha: 1,
					duration: dur,
					frameDuration: dur,
					frameEase: Power0.easeIn,
				})
			})(i)
		}
	}
	function colorShift(o) {
		ask.explosion({index: o.index, key: 'burst-arcane'}, {
			sizeEnd: 260
		})
		ask.rings({index: o.index, type: 'arcane'}, {
			loops: 1,
			duration: .3,
		})
		let dur = .5
		ask.explosion({index: o.index, key: 'colorShift2'}, {
			contrastStart: 1.2,
			brightnessStart: 2,
			sizeStart: 0,
			sizeEnd: 300,
			duration: dur,
			frameDuration: dur,
			frameEase: Power0.easeIn,
		})
		ask.explosion({index: o.index, key: 'colorShift1'}, {
			contrastStart: 1.2,
			brightnessStart: 2,
			sizeStart: 0,
			sizeEnd: 250,
			duration: dur,
			frameDuration: dur,
			frameEase: Power0.easeIn,
		})
		ask.explosion(o, {
			contrastStart: 1.2,
			brightnessStart: 2,
			sizeStart: 0,
			sizeEnd: 200,
			ease: Power1.easeIn,
			duration: dur,
			frameDuration: dur,
			frameEase: Power0.easeIn,
		})
	}
	function phaseBlade(o) {
		ask.explosion({index: o.index, key: 'orb-lightning'}, {
			targetMob: false,
			duration: 3.5,
			sizeStart: 50,
			sizeEnd: 350,
		})
		for (var i=0; i<3; i++) {
			(i => {
				delayedCall(i * .25, () => {
					let img = ask.explosion({
						index: o.index,
						key: 'phaseBlade1'
					}, {
						targetMob: false,
						duration: 2,
						contrastStart: 1.5,
						brightnessStart: 2,
						sizeStart: 200 + (i * 75),
						sizeEnd: 0,
					})
					TweenMax.to(img, 1.5, {
						rotation: util.rotation(90),
						ease: Power0.easeIn,
					})
				})
			})(i)
		}
		let img = ask.explosion(o, {
			targetMob: false,
			contrastStart: 1.5,
			brightnessStart: 2,
			duration: 3.5,
			sizeStart: 250,
			sizeEnd: 350,
		})
		img.zIndex = ask.LAYER_PLAYER_ROW_FRONT + 1
	}
	function stasisField(o) {
		ask.explosion({index: o.index, key: 'orb-purple'})
		const dur = 1.5
		let img = ask.explosion({
			index: o.index,
			key: 'stasisField'
		}, {
			contrastStart: 1.5,
			brightnessStart: 2,
			duration: dur,
			sizeStart: 450,
			sizeEnd: 300,
		})
		TweenMax.to(img, dur, {
			rotation: util.rotation(133),
			ease: Power0.easeIn,
		})
		let img2 = ask.explosion({
			index: o.index,
			key: 'stasisField'
		}, {
			contrastStart: 1.5,
			brightnessStart: 2,
			duration: dur,
			sizeStart: 150,
			sizeEnd: 300,
		})
		TweenMax.to(img2, dur, {
			rotation: util.rotation(-133),
			ease: Power0.easeIn,
		})
	}
	function shiftingEther(o) {
		ask.explosion({index: o.index, key: 'orb-blood'})
		ask.explosion({index: o.index, key: 'burst-lightning'})
		ask.explosion(o, {
			contrastStart: 1.5,
			brightnessStart: 2,
			duration: .7,
			sizeStart: 150,
			sizeEnd: 200,
		})
		ask.explosion({
			index: o.index,
			key: 'shiftingEther1'
		}, {
			duration: .7,
			rotation: 90,
			contrastStart: 1.5,
			brightnessStart: 2,
			sizeStart: 150,
			sizeEnd: 220,
		})
		delayedCall(.15, () => {
			ask.explosion({
				index: o.index,
				key: 'shiftingEther2'
			}, {
				contrastStart: 1.5,
				brightnessStart: 2,
				duration: .6,
				rotation: 90,
				sizeStart: 150,
				sizeEnd: 240,
			})
		})
		delayedCall(.3, () => {
			ask.explosion({
				index: o.index,
				key: 'shiftingEther3'
			}, {
				contrastStart: 1.5,
				brightnessStart: 2,
				duration: .6,
				rotation: 90,
				sizeStart: 180,
				sizeEnd: 280,
			})
		})
	}
	function sereneSigil(o) {
		ask.explosion({index: o.index, key: 'orb-arcane'}, {
			targetMob: false,
			duration: 2.5,
			sizeStart: 50,
			sizeEnd: 350,
		})
		ask.explosion(o, {
			targetMob: false,
			contrastStart: 1.5,
			brightnessStart: 2,
			duration: .5,
			sizeStart: 0,
			sizeEnd: 350,
		})
		ask.explosion({
			index: o.index,
			key: 'sereneSigil1'
		}, {
			targetMob: false,
			duration: 1.5,
			contrastStart: 1.5,
			brightnessStart: 2,
			sizeStart: 200,
			sizeEnd: 250,
		})
		ask.explosion({
			index: o.index,
			key: 'sereneSigil2'
		}, {
			targetMob: false,
			contrastStart: 1.5,
			brightnessStart: 2,
			duration: 2,
			sizeStart: 200,
			sizeEnd: 350,
		})
	}
	function augmentation(o) {
		ask.explosion({index: o.index, key: 'orb-arcane'}, {
			targetMob: false,
			sizeEnd: 300
		})
		ask.particleCircle({
			index: o.index,
			key: 'particle-circle-arcane',
		}, {
			targetMob: false,
			duration: .33,
			alpha: 0,
			sizeEnd: 300,
		})
		o.endFrame = 2
		ask.explosion(o, {
			targetMob: false,
			duration: 1.25,
			frameDuration: .3,
			sizeStart: 300,
			sizeEnd: 200,
		})
	}
	function clarity(o) {
		ask.explosion({index: o.index, key: 'orb-ice'}, {
			targetMob: false,
			sizeStart: 300,
			sizeEnd: 0
		})
		ask.particleSmall({
			index: o.index,
			key: 'particle-small-ice',
		}, {
			targetMob: false,
			interval: .0016,
			loops: 22,
			sizeStart: 32,
			sizeEnd: 0,
			xRange: 100,
			yRange: 0,
		})
		!function(o) {
			delayedCall(.3, () => {
				ask.explosion({index: o.index, key: 'mysticalGlow-p1'}, {
					targetMob: false,
					contrastStart: 2,
					brightnessStart: 4,
					sizeStart: 280,
					sizeEnd: 370,
					duration: 1,
					ease: Power2.easeOut,
				})
				ask.explosion({index: o.index, key: 'orb-ice'}, {targetMob: false})
				/*ask.explosion({index: o.index, key: 'clarity-blue'}, {
					targetMob: false,
					contrastStart: 1.5,
					brightnessStart: 3,
					contrastEnd: 0,
					brightnessEnd: 0,
					sizeStart: 100,
					sizeEnd: 250,
					duration: 1.2,
					ease: Power2.easeOut,
				})*/
			})
		}(_.clone(o))
		o.endFrame = 2
		ask.explosion(o, {
			targetMob: false,
			contrastStart: 1.2,
			brightnessStart: 2,
			rotation: 180,
			sizeStart: 250,
			sizeEnd: 100,
			duration: .4,
			frameDuration: .4,
			ease: Power2.easeOut,
		})
	}

	const ENTHRALL_CONFIG = {
		innerStrength: 0,
		outerStrength: 5,
		color: '0xffff00',
	}
	function enthrall(o) {
		ask.lightColumn({index: o.index, key: 'enthrall-col2'}, {
			widthStart: 200,
			glowFilter: ENTHRALL_CONFIG,
		})
		ask.lightColumn({index: o.index, key: 'enthrall-col1'}, {
			widthStart: 100,
			glowFilter: ENTHRALL_CONFIG,
		})
		ask.groundExplosion(o, {
			yStart: ask.bottomY(o.index, true) + 25,
			contrastStart: 1.5,
			brightnessStart: 2,
			sizeStart: 100,
			sizeEnd: 400,
			yoyo: false,
			alpha: 0,
			duration: .5,
		})
	}
}($, _, TweenMax, Power0, Power1, Power2, Power3, Power4);