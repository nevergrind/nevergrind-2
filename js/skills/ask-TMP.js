!function($, _, TweenMax, Power0, Power1, Power2, Power3, Power4, Bounce, Elastic, undefined) {
	ask = {
		...ask,
		lavaBolt,
		thunderclap,
		frozenOrb,
		staticStorm,
		fireWall,
		glacialSpike,
		primordialSludge,
		arclight,
		primevalWithering,
		moltenAegis,
		conviction,
		celestialFrenzy,
	}
	///////////////////////////////////////////

	function lavaBolt(o) {
		ask.explosion({index: o.index, key: 'burst-fire'}, {
			sizeEnd: 280,
			duration: .6
		})
		o.endFrame = 2
		ask.explosion({index: o.index, key: 'fireball2'}, {
			contrastStart: 2,
			brightnessStart: 4,
			sizeStart: 0,
			sizeEnd: 280,
			duration: .5,
		})
	}
	function thunderclap(o) {
		ask.explosion({index: o.index, key: 'burst-lightning'}, {
			duration: .5,
			sizeEnd: 275,
		})
		o.key = 'thunderclap'
		o.endFrame = 3
		ask.groundExplosion(o, {
			anchorY: .875,
			contrastStart: 1.2,
			brightnessStart: 2,
			width: 400,
			height: 400,
			yoyo: false,
			duration: .1,
			frameDuration: .1,
			frameEase: Power0.easeIn,
		})
		ask.particleSmall({
			index: o.index,
			key: 'particle-small-lightning',
		}, {
			interval: .001,
			loops: 4,
			sizeStart: 24,
			sizeEnd: 4,
			xRange: 400,
			yRange: 50,
		})
	}
	function frozenOrb(o) {
		if (o.animate) {
			// orb
			let yStart = ask.centerY(o.index, true) - 1100
			let yEnd = ask.centerY(o.index, true) - 100
			let dur = 1.5
			o.key = 'frozenOrbRay'
			o.endFrame = 1
			let rays = ask.explosion(o, {
				yStart: yStart,
				yEnd: yEnd,
				contrastStart: 1.5,
				brightnessStart: 2,
				sizeStart: 300,
				sizeEnd: 300,
				alpha: 1,
				duration: dur,
				frameDuration: .1,
				repeat: true,
				ease: Power4.easeOut,
				frameEase: Power0.easeOut,
			})
			// orb
			o.key = 'frozenOrb'
			o.endFrame = null
			let orb = ask.explosion(o, {
				yStart: yStart,
				yEnd: yEnd,
				contrastStart: 1.5,
				brightnessStart: 2,
				sizeStart: 400,
				sizeEnd: 400,
				alpha: 1,
				duration: dur,
				ease: Power4.easeOut,
			})
			TweenMax.to(orb, .2, {
				rotation: util.rotation(360),
				repeat: -1,
				ease: Power0.easeNone,
			})
			TweenMax.to(orb, dur, {
				onUpdate: () => {
					orb.scale.x = orb.scale.x * -1
				}
			})
			// frost 1
			o.key = 'frozenOrbFrost'
			let frost1 = ask.explosion(o, {
				yStart: yStart,
				yEnd: yEnd,
				contrastStart: 1.5,
				brightnessStart: 2,
				sizeStart: 300,
				sizeEnd: 300,
				startAlpha: .6,
				alpha: .6,
				duration: dur,
				ease: Power4.easeOut,
			})
			TweenMax.to(frost1, 1.5, {
				rotation: util.rotation(-360),
				repeat: -1,
				ease: Power0.easeNone,
			})
			// frost 2
			let frost2 = ask.explosion(o, {
				yStart: yStart,
				yEnd: yEnd,
				contrastStart: 1.5,
				brightnessStart: 2,
				sizeStart: 300,
				sizeEnd: 300,
				startAlpha: .6,
				alpha: .6,
				duration: dur,
				ease: Power4.easeOut,
			})
			TweenMax.to(frost2, 1.5, {
				rotation: util.rotation(360),
				repeat: -1,
				ease: Power0.easeNone,
			})
			ask.fadeOut([orb, frost1, frost2, rays], dur, dur * .1)
		}
		else {
			// shards
			ask.explosion({index: o.index, key: 'burst-ice'}, {duration: .5})
			ask.explosion({index: o.index, key: 'frozenOrbRay1'}, {
				contrastStart: 1.5,
				brightnessStart: 3,
				sizeStart: 200,
				sizeEnd: 0,
				duration: .5,
			})
			ask.particleSmall({
				..._.clone(o),
				key: 'particle-small-ice',
			}, {
				interval: .001,
				loops: 5,
				sizeStart: 32,
				sizeEnd: 8,
				xRange: 220,
				yRange: 50,
			})
		}
	}
	function staticStorm(o) {
		o.endFrame = 3
		let dur = .5
		let img = ask.explosion(o, {
			contrastStart: 1.5,
			brightnessStart: 2,
			sizeStart: 0,
			sizeEnd: 250,
			alpha: 1,
			duration: dur,
			frameDuration: dur,
			frameEase: Power0.easeIn,
		})
		TweenMax.to(img, dur, {
			rotation: 360,
			ease: Power0.easeOut,
		})
		ask.fadeOut(img, dur, dur * .2)
	}
	function fireWall(o) {
		let y = ask.bottomY(o.index, true)
		for (var i=0; i<7; i++) {
			!function() {
				ask.flames(o, {
					y: y,
					key: 'fireWall',
					size: 128,
					duration: _.random(2.5, 4.5),
					fade: _.random(.35, .5),
				})
			}()
		}
	}
	function glacialSpike(o) {
		if (o.data.isPrimaryTgt) {
			ask.explosion({index: o.index, key: 'burst-ice'}, {
				duration: 1,
				sizeEnd: 500,
			})
			ask.explosion({index: o.index, key: 'burst-ice'}, {
				duration: 1,
				sizeEnd: 600,
			})
			ask.rings({index: o.index, type: 'ice'}, {
				loops: 3,
				duration: 1,
			})
		}
		else {
			ask.explosion({index: o.index, key: 'burst-ice'}, {duration: .5})
		}
		o.endFrame = 2
		let dur = .38
		let img = ask.explosion(o, {
			contrastStart: o.data.isPrimaryTgt ? 3 : 1.2,
			brightnessStart: o.data.isPrimaryTgt ? 7 : 2.5,
			sizeStart: 80,
			sizeEnd: o.data.isPrimaryTgt ? 350 : 200,
			alpha: 1,
			duration: dur,
			frameDuration: dur,
		})
		ask.fadeOut(img, dur, dur * .3)
	}
	function primordialSludge(o) {
		ask.explosion({index: o.index, key: 'burst-poison'}, {duration: 1.2})
		let centerY = ask.centerY(o.index, true)
		let centerX = mob.centerX[o.index]
		o.endFrame = 2
		let dur = .25
		for (var i=0; i<30; i++) {
			!function(i) {
				delayedCall(i * .01, () => {
					let x = centerX + _.random(-125, 125)
					let y = centerY + _.random(-25, 75)
					let img = ask.explosion(o, {
						xStart: x,
						yStart: y,
						yEnd: y - 40,
						contrastStart: 1.2,
						brightnessStart: 2.5,
						sizeStart: 80,
						sizeEnd: 400,
						alpha: 1,
						duration: dur,
						frameDuration: dur,
					})
					ask.fadeOut(img, dur, dur * .3)
				})
			}(i)
		}
	}
	function arclight(o) {
		ask.explosion({index: o.index, key: 'burst-lightning'}, {duration: 1.2})
		let centerX = mob.centerX[o.index]
		let centerY = ask.centerY(o.index, true)
		o.endFrame = 5
		let dur = .5
		for (var i=0; i<120; i++) {
			!function(i) {
				delayedCall(i * .003, () => {
					let x = centerX + _.random(-120, 120)
					let y = centerY + _.random(-50, 100)
					let rotation = _.random(0, 7) * 45
					let img = ask.explosion(o, {
						xStart: x,
						yStart: y,
						contrastStart: 4,
						brightnessStart: 10,
						rotationStart: rotation,
						rotation: (rotation + _.random(-90, 90)),
						sizeStart: 120,
						sizeEnd: 40,
						alpha: 1,
						ease: Bounce.easeOut,
						frameEase: Elastic.easeOut,
						duration: dur,
						frameDuration: dur,
					})
					TweenMax.to(img, dur, {
						x: x += _.random(-10, 10),
						y: y += _.random(-10, 10),
						ease: Power0.easeOut,
					})
					ask.fadeOut(img, dur, dur * .3)
				})
			}(i)
		}
	}
	function primevalWithering(o) {
		ask.explosion({index: o.index, key: 'burst-arcane'}, {duration: 1.2})
		let centerY = ask.centerY(o.index, true)
		let centerX = mob.centerX[o.index]
		o.endFrame = 2
		let dur = .25
		for (var i=0; i<30; i++) {
			!function(i) {
				delayedCall(i * .01, () => {
					let x = centerX + _.random(-125, 125)
					let y = centerY + _.random(-25, 75)
					let img = ask.explosion(o, {
						xStart: x,
						yStart: y,
						yEnd: y + 40,
						contrastStart: 1.2,
						brightnessStart: 2.5,
						sizeStart: 80,
						sizeEnd: 400,
						alpha: 1,
						duration: dur,
						frameDuration: dur,
					})
					ask.fadeOut(img, dur, dur * .3)
				})
			}(i)
		}
	}
	function moltenAegis(o) {
		ask.explosion({index: o.index, key: 'burst-fire'}, {
			targetMob: false,
			duration: .6,
			sizeEnd: 250
		})
		let img = ask.explosion({index: o.index, key: 'moltenAegis2'}, {
			targetMob: false,
			duration: 1,
			alpha: 1,
			sizeStart: 250,
			sizeEnd: 200,
		})
		ask.fadeOut(img, .66, .33)

		ask.explosion({index: o.index, key: 'moltenAegis3'}, {
			targetMob: false,
			duration: .33,
			sizeStart: 0,
			sizeEnd: 300,
		})
	}
	function conviction(o) {
		ask.explosion({index: o.index, key: 'burst-arcane'}, {
			targetMob: false,
			duration: 1,
			sizeEnd: 320
		})
		let img = ask.explosion(o, {
			contrastStart: 2,
			targetMob: false,
			duration: 1.5,
			sizeStart: 440,
			sizeEnd: 240,
		})
		TweenMax.to(img, 2, {
			rotation: 360,
			ease: Power0.easeIn,
		})
		let img2 = ask.explosion(o, {
			contrastStart: 2,
			targetMob: false,
			duration: 1.5,
			sizeStart: 440,
			sizeEnd: 240,
		})
		TweenMax.to(img2, 2, {
			rotation: -360,
			ease: Power0.easeIn,
		})
		ask.explosion({
			index: o.index,
			key: 'conviction1'
		}, {
			targetMob: false,
			brightnessStart: 2,
			duration: 1,
			sizeStart: 300,
			sizeEnd: 300,
		})
	}
	function celestialFrenzy(o) {
		let yStart = ask.centerY(o.index, false)
		ask.explosion({index: o.index, key: 'burst-purple'}, {
			targetMob: false,
			duration: .8,
			sizeEnd: 300,
		})
		ask.explosion({
			index: o.index,
			key: 'celestialFrenzy1'
		}, {
			targetMob: false,
			yStart: yStart,
			yoyo: false,
			alpha: 0,
			brightnessStart: 2,
			duration: 1.5,
			sizeStart: 300,
			sizeEnd: 300,
		})
		ask.explosion(o, {
			contrastStart: 2,
			targetMob: false,
			duration: 2,
			sizeStart: 350,
			sizeEnd: 240,
		})
		/*delayedCall(.5, () => {
			let img = ask.explosion({
				..._.clone(o),
				key: 'celestialFrenzy3'
			}, {
				targetMob: false,
				contrastStart: 2,
				brightnessStart: 4,
				duration: 1,
				sizeStart: 250,
				sizeEnd: 250,
			})
			TweenMax.to(img, 1, {
				startAt: {y: yStart + 100},
				y: yStart - 100,
				ease: Power0.easeIn,
			})
		})*/
	}
}($, _, TweenMax, Power0, Power1, Power2, Power3, Power4, Bounce, Elastic);