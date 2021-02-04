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
		ask.explosion({index: o.index, key: 'burst-fire'})
		o.endFrame = 2
		let img = ask.groundExplosion(o, {
			contrastStart: 2,
			brightnessStart: 4,
			contrastEnd: 1,
			brightnessEnd: 1,
			yStart: ask.shadowY(o.index, true) + 60,
			sizeStart: 250,
			sizeEnd: 250,
			alpha: 1,
			repeat: true,
			duration: .5,
			frameDuration: .15,
			frameEase: Power0.easeOut,
		})
		ask.fadeOut(img, .5, .1)
	}
	function thunderclap(o) {
		ask.explosion({index: o.index, key: 'burst-lightning'}, {duration: .5})
		let shadowY = ask.shadowY(o.index, true) + 50
		let dur = .1
		o.key = 'thunderclap'
		o.endFrame = 3
		ask.groundExplosion(_.clone(o), {
			yStart: shadowY,
			contrastStart: 1.2,
			brightnessStart: 2,
			width: 450,
			height: 450,
			yoyo: false,
			duration: dur,
			frameDuration: dur,
			frameEase: Power0.easeIn,
		})
		ask.particleSmall({
			..._.clone(o),
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
			sizeStart: 80,
			sizeEnd: 280,
			alpha: 1,
			duration: dur,
			frameDuration: dur,
			frameEase: Power0.easeIn,
		})
		TweenMax.to(img, dur, {
			rotation: Math.random() > .5 ? 360 : -360,
			ease: Power0.easeOut,
		})
		ask.fadeOut(img, dur, dur * .2)
	}
	function fireWall(o) {
		let y = ask.shadowY(o.index, true)
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
		console.info(o)
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
			sizeEnd: o.data.isPrimaryTgt ? 350 : 240,
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
		ask.explosion(o, {
			targetMob: false,
			duration: 1.2
		})
	}
	function conviction(o) {
		ask.explosion(o, {
			targetMob: false,
			duration: 1.2
		})
	}
	function celestialFrenzy(o) {
		ask.explosion(o, {
			targetMob: false,
			duration: 1.2
		})
	}
}($, _, TweenMax, Power0, Power1, Power2, Power3, Power4, Bounce, Elastic);