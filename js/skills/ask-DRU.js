!function($, _, TweenMax, Power0, Power1, Power2, Power3, Power4, undefined) {
	ask = {
		...ask,
		starfire,
		fissure,
		lightningBlast,
		blizzard,
		toxicSpores,
		moltenBoulder,
		barbedThicket,
		tornado,
		naturesTouch,
		mossBreath,
		synthesize,
		branchSpirit,
	}
	///////////////////////////////////////////

	function starfire(o) {
		ask.explosion({index: o.index, key: 'burst-fire'})
		o.endFrame = 4
		ask.explosion(_.clone(o), {
			contrastStart: 1.5,
			brightnessStart: 2,
			sizeStart: 300,
			sizeEnd: 400,
			duration: 1.5,
			frameDuration: .3,
			frameEase: Power0.easeIn,
		})
	}
	function fissure(o) {
		for (var i=0; i<15; i++) {
			!function(i) {
				delayedCall(i * .1, () => {
					o.endFrame = 2
					ask.groundExplosion(o, {
						yStart: ask.shadowY(o.index, true) + _.random(0, 30),
						xAdjust: _.random(-100, 100),
						contrastStart: 1,
						brightnessStart: 1,
						anchorY: .78,
						sizeStart: 128,
						sizeEnd: 128,
						duration: .5,
						frameDuration: .5,
						yoyo: true,
						zIndex: ask.DEFAULT_BEHIND_MOB_LAYER,
						alphaStart: 0,
						alpha: 1,
						frameEase: Power0.easeOut,
						ease: Power0.easeInOut,
					})
				})
			}(i)
		}
	}
	function lightningBlast(o) {
		o.endFrame = 4
		ask.groundExplosion(_.clone(o), {
			yStart: ask.shadowY(o.index, true) + 50,
			contrastStart: 1.5,
			brightnessStart: 2,
			sizeStart: 512,
			sizeEnd: 512,
			yoyo: false,
			alpha: 1,
			duration: .25,
			frameDuration: .25,
			frameEase: Power0.easeIn,
		})
		ask.particleSmall({
			..._.clone(o),
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

	function blizzard(o) {
		o.endFrame = 1
		!function(o) {
			for (var i=0; i<5; i++) {
				!function(i, o) {
					delayedCall(i * .02, () => {
						o.key = 'blizzard'
						ask.explosion(o, {
							contrastStart: 1.5,
							brightnessStart: 2,
							sizeStart: 512 - (i * 20),
							sizeEnd: 512 - (i * 20),
							duration: 3,
							frameDuration: 1.5,
							frameEase: Power0.easeIn,
						})
					})
				}(i, o)
			}
		}(_.clone(o))
		let centerY = ask.centerY(o.index, true) - 175
		let centerX = mob.centerX[o.index]
		let ground = ask.shadowY(o.index, true) + 25
		let distanceDuration = (ground - centerY) / 1000
		for (var i=0; i<9; i++) {
			!function(i, o) {
				let x = centerX + _.random(-125, 125)
				let duration = distanceDuration + _.random(-.1, .1)
				o.key = 'blizzard-shard' + _.random(2)
				o.endFrame = null
				delayedCall(i * .1, () => {
					ask.explosion(o, {
						contrastStart: 1.5,
						brightnessStart: 3,
						duration: duration,
						autoSize: true,
						rotation: _.random(-360, 360),
						xStart: x,
						yStart: centerY,
						yEnd: ground,
						alpha: 1,
						ease: Power0.easeOut,
					})
					delayedCall(duration, () => {
						ask.nova({index: o.index, key: 'cast-swirl-ice'}, {
							position: 'bottom',
							xStart: x,
							width: 300,
							height: 50,
							loops: 1,
						})
					})
				})
			}(i, o)
		}
	}
	function toxicSpores(o) {
		ask.particleGroup({
			..._.clone(o),
			key: 'particle-group-poison',
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
			key: 'particle-small-poison',
		}, {
			interval: .001,
			loops: 25,
			sizeStart: 32,
			sizeEnd: 8,
			xRange: 150,
			yRange: 50,
		})
	}
	function moltenBoulder(o) {
		if (o.animate) {
			let size = 300
			let x = mob.centerX[o.tgtStart]
			let y = ask.shadowY(o.tgtStart, true) - (size * .5) + 20
			let tgts = Math.abs(o.tgtStart - o.tgtEnd)
			let duration = 1 + (tgts * .333)
			let rotation = 720 + ((tgts - 2) * 180)
			if (o.tgtStart === 4) {
				x += (384 * 3)
				rotation *= -1
			}
			else {
				x -= (384 * 3)
			}
			// rock
			let img = ask.explosion(o, {
				duration: duration,
				contrastStart: 1,
				brightnessStart: 1,
				sizeStart: size,
				sizeEnd: size,
				rotation: rotation,
				alpha: 1,
				ease: Power0.easeOut,
			})
			img.x = x
			img.y = y
			TweenMax.to(img, duration, {
				x: mob.centerX[o.tgtEnd],
				ease: Power0.easeIn,
			})
			delayedCall(duration, () => {
				ask.sunburst({index: o.tgtEnd})
				ask.explosion({index: o.tgtEnd, key: 'burst-fire'})
				// fissure
				o.index = o.tgtEnd
				o.endFrame = 2
				o.key = 'fissure'
				let y = ask.shadowY(o.tgtEnd, true)


				ask.particleSmall({...o, key: 'particle-small-fire'}, {
					interval: .001,
					loops: 15,
					sizeStart: 24,
					sizeEnd: 4,
					xRange: 400,
					yRange: 50,
				})

				for (var i=0; i<60; i++) {
					!function(i) {
						delayedCall(i * .2, () => {
							ask.groundExplosion(o, {
								yStart: y + _.random(0, 30),
								xAdjust: _.random(-125, 125),
								contrastStart: 2,
								brightnessStart: 3,
								anchorY: .78,
								sizeStart: 128,
								sizeEnd: 128,
								duration: .5,
								frameDuration: .5,
								yoyo: true,
								zIndex: ask.DEFAULT_BEHIND_MOB_LAYER,
								alphaStart: 0,
								alpha: 1,
								frameEase: Power0.easeOut,
								ease: Power0.easeInOut,
							})
						})
					}(i)
				}
			})
		}
	}
	function barbedThicket(o) {
		o.endFrame = 4
		for (var i=0; i<13; i++) {
			!function() {
				let yAdjust = _.random(-15, 15)
				let zIndex = yAdjust >= 0 ? ask.DEFAULT_MOB_LAYER : ask.DEFAULT_BEHIND_MOB_LAYER
				let size = 100 - ((yAdjust + 15) * 2)
				let img = ask.groundExplosion(_.clone(o), {
					yStart: ask.shadowY(o.index, true) + yAdjust,
					xAdjust: _.random(-125, 125),
					contrastStart: 1.5,
					brightnessStart: 2,
					sizeStart: size,
					sizeEnd: size,
					yoyo: false,
					alpha: 1,
					duration: 3,
					frameDuration: _.random(.2, 1),
					zIndex: zIndex,
					ease: Power4.easeOut,
					frameEase: Power1.easeIn,
				})
				img.scale.x *= Math.random() > .5 ? 1 : -1
				delayedCall(2, () => {
					TweenMax.to(img, .5, {
						alpha: 0,
					})
				})
			}()
		}
		ask.particleSmall({
			..._.clone(o),
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
	let tornadoInvert = false
	function tornado(o) {
		o.endFrame = 2
		let img = ask.groundExplosion(o, {
			yStart: ask.shadowY(o.index, true) + 25,
			contrastStart: 1.5,
			brightnessStart: 2,
			sizeStart: 360,
			sizeEnd: 250,
			yoyo: false,
			alpha: 0,
			duration: 1,
			frameDuration: .2,
			repeat: true,
			frameEase: Power0.easeIn,
		})
		tornadoInvert = !tornadoInvert
		img.scale.x = tornadoInvert ? -1 : 1/*
		for (var i=0; i<5; i++) {
			delayedCall(i*.2, () => {
				img.scale.x = Math.random() > .5 ? 1 : -1
			})
		}*/

	}
	function naturesTouch(o) {
		let img = ask.explosion(o, {
			targetMob: false,
			contrastStart: 1.5,
			brightnessStart: 2,
			alpha: 1,
			sizeStart: 128,
			sizeEnd: 320,
			duration: 1,
			ease: Power2.easeOut,
		})
		TweenMax.to(img, .3, {
			delay: .7,
			alpha: 0,
		})
		o.key = 'naturesTouchStar'
		let img2 = ask.explosion(o, {
			targetMob: false,
			contrastStart: 1.5,
			brightnessStart: 2,
			alpha: 0,
			rotation: 360,
			sizeStart: 256,
			sizeEnd: 128,
			duration: 1,
			ease: Power2.easeOut,
		})
		let img3 = ask.explosion(o, {
			targetMob: false,
			contrastStart: 1.5,
			brightnessStart: 2,
			alpha: 0,
			rotation: -360,
			sizeStart: 256,
			sizeEnd: 128,
			duration: 1,
			ease: Power2.easeOut,
		})
		TweenMax.to([img2, img3], .3, {
			delay: .7,
			alpha: 0,
		})
		!function(o) {
			o.endFrame = 2
			o.key = 'naturesTouchParticle'
			let img = ask.explosion(o, {
				targetMob: false,
				contrastStart: 1.5,
				brightnessStart: 2,
				repeat: true,
				sizeStart: 256,
				sizeEnd: 256,
				alpha: 1,
				duration: 1,
				frameDuration: .25,
				ease: Power3.easeOut,
			})
			TweenMax.to(img, .3, {
				delay: .7,
				alpha: 0,
			})
		}(_.clone(o))
	}
	function mossBreath(o) {
		!function(o) {
			o.key = 'mossBreathGreen'
			let img1 = ask.explosion(o, {
				targetMob: false,
				contrastStart: 1.5,
				brightnessStart: 2,
				alpha: 0,
				rotation: 360,
				sizeStart: 0,
				sizeEnd: 312,
				duration: 1,
				ease: Power2.easeOut,
			})
			o.key = 'mossBreathYellow'
			let img2 = ask.explosion(o, {
				targetMob: false,
				contrastStart: 1.5,
				brightnessStart: 2,
				alpha: 0,
				rotation: -360,
				sizeStart: 0,
				sizeEnd: 312,
				duration: 1,
				ease: Power2.easeOut,
			})
			o.key = 'mossBreathStar'
			let img3 = ask.explosion(o, {
				targetMob: false,
				contrastStart: 1.5,
				brightnessStart: 2,
				alpha: 0,
				rotation: -360,
				sizeStart: 256,
				sizeEnd: 128,
				duration: 1,
				ease: Power2.easeOut,
			})
			let img4 = ask.explosion(o, {
				targetMob: false,
				contrastStart: 1.5,
				brightnessStart: 2,
				alpha: 0,
				rotation: 360,
				sizeStart: 256,
				sizeEnd: 128,
				duration: 1,
				ease: Power2.easeOut,
			})
			TweenMax.to([img1, img2, img3, img4], .3, {
				delay: .7,
				alpha: 0,
			})
			o.key = 'mossBreathParticlesWhite'
			ask.explosion(o, {
				targetMob: false,
				contrastStart: 1.5,
				brightnessStart: 2,
				sizeStart: 0,
				sizeEnd: 256,
				alpha: 0,
				duration: .8,
				ease: Power3.easeOut,
			})
		}(_.clone(o))
	}
	function synthesize(o) {
		ask.explosion({index: o.index, key: 'burst-poison'}, {targetMob: false})
		o.endFrame = 3
		let dur = 1.5
		let fade = .3
		let img = ask.explosion(o, {
			targetMob: false,
			contrastStart: 1.5,
			brightnessStart: 2,
			sizeStart: 256,
			sizeEnd: 312,
			alpha: 1,
			duration: dur,
			frameDuration: dur/4,
			frameEase: Power0.easeIn,
		})
		TweenMax.to(img, fade, {
			delay: dur - fade,
			alpha: 0,
		})
		TweenMax.to(img, 2, {
			rotation: 360,
			ease: Power0.easeNone
		})
	}
	function branchSpirit(o) {
		o.key = 'branchSpiritGlow'
		ask.explosion(o, {
			targetMob: false,
			duration: 5,
			sizeStart: 400,
			sizeEnd: 300,
		})
		ask.explosion({
			...o,
			key: 'branchSpiritParticles'
		}, {
			targetMob: false,
			brightnessStart: 12,
			duration: 1,
			alpha: 0,
			sizeStart: 0,
			sizeEnd: 350,
		})
		ask.explosion({
			...o,
			key: 'branchSpiritNova'
		}, {
			targetMob: false,
			duration: 2.5,
			sizeStart: 0,
			sizeEnd: 500,
		})
		for (var i=0; i<1; i++) {
			!function(i) {
				delayedCall(.25, () => {
					ask.explosion({
						...o,
						key: 'branchSpiritRing'
					}, {
						targetMob: false,
						duration: 4,
						alpha: 0,
						sizeStart: 400,
						sizeEnd: 300,
					})
				})
			}(i)
		}
		delayedCall(.5, () => {
			ask.explosion({
				...o,
				key: 'branchSpiritTree'
			}, {
				targetMob: false,
				duration: 4,
				sizeStart: 400,
				sizeEnd: 300,
			})
		})
	}
}($, _, TweenMax, Power0, Power1, Power2, Power3, Power4);