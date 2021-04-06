!function($, _, TweenMax, Power0, Power1, Power2, Power3, Power4, undefined) {
	ask = {
		...ask,
		venomBolt,
		explosivePlague,
		explosivePlagueExplosion,
		bloodFire,
		demonicPact,
		hauntingVision,
		icingDeath,
		curseOfShadows,
		panicStrike,
		drainSoul,
		drainSoulHeal,
		lichForm,
		engulfingDarkness,
		profaneSpirit,
		profaneSpiritExplosion,
	}
	///////////////////////////////////////////

	function venomBolt(o) {
		ask.explosion({index: o.index, key: 'burst-poison'})
		ask.particleCircle({
			index: o.index,
			key: 'particle-circle-poison',
		}, {
			duration: .3,
			alpha: 0,
			sizeEnd: 250,
		})
		o.endFrame = 3
		ask.explosion(o, {
			contrastStart: 1.5,
			brightnessStart: 2,
			sizeStart: 180,
			sizeEnd: 225,
			alpha: 1,
			duration: .32,
			frameDuration: .32,
			frameEase: Power0.easeIn,
		})
	}
	function explosivePlague(o) {
		ask.particleGroup({
			..._.clone(o),
			key: 'particle-group-poison',
		}, {
			interval: .0166,
			sizeStart: 128,
			sizeEnd: 64,
			xRange: 75,
			yRange: 100,
			loops: 7
		})
		ask.explosion({index: o.index, key: 'orb-poison'}, {
			contrastStart: 1.5,
			brightnessStart: 3,
			sizeStart: 400,
			sizeEnd: 0,
			rotation: 360,
			duration: 2,
		})
	}
	function explosivePlagueExplosion(o) {
		ask.explosion({index: o.index, key: 'burst-poison'}, {
			sizeEnd: 300,
			duration: .8
		})
		ask.explosion({index: o.index, key: 'orb-poison'}, {
			contrastStart: 1.5,
			brightnessStart: 3,
			sizeStart: 0,
			sizeEnd: 450,
			duration: 1.5,
		})
		o.endFrame = 3
		ask.explosion(o, {
			contrastStart: 1.5,
			brightnessStart: 3,
			sizeStart: 100,
			sizeEnd: 225,
			duration: 1,
			frameDuration: .8,
			frameEase: Power0.easeIn,
		})
	}
	function bloodFire(o) {
		ask.explosion({index: o.index, key: 'burst-fire'})
		ask.explosion({index: o.index, key: 'bloodFire1'}, {
			contrastStart: 1.5,
			brightnessStart: 2,
			rotation: 90,
			sizeStart: 100,
			sizeEnd: 250,
			duration: 1,
		})
		ask.explosion(o, {
			contrastStart: 1.5,
			brightnessStart: 2,
			rotation: -90,
			sizeStart: 100,
			sizeEnd: 200,
			duration: 1.2,
		})
		ask.explosion({index: o.index, key: 'bloodFire2'}, {
			contrastStart: 1.5,
			brightnessStart: 2,
			sizeStart: 100,
			sizeEnd: 300,
			duration: .8,
		})
		ask.particleGroup({
			index: o.index,
			key: 'particle-group-fire',
		}, {
			interval: .0166,
			sizeStart: 32,
			sizeEnd: 32,
			xRange: 100,
			yRange: 100,
			loops: 3
		})
	}
	function demonicPact(o) {
		ask.explosion({index: o.index, key: 'burst-blood'}, {
			sizeEnd: 250
		})
		o.endFrame = 2
		let dur = .15
		let xStart = mob.centerX[o.index] + 100
		for (var i=0; i<5; i++) {
			!function(i) {
				delayedCall(i*.1, () => {
					ask.explosion(o, {
						contrastStart: 1.5,
						brightnessStart: 2,
						xStart: xStart - (i * 50),
						sizeStart: 220,
						sizeEnd: 180,
						alpha: 1,
						duration: dur,
						frameDuration: dur,
						frameEase: Power0.easeIn,
					})
				})
			}(i)
		}
		ask.particleGroup({
			index: o.index,
			key: 'particle-group-blood',
		}, {
			interval: .0166,
			sizeStart: 50,
			sizeEnd: 50,
			xRange: 60,
			yRange: 100,
			loops: 6
		})
	}
	function hauntingVision(o) {
		ask.explosion({index: o.index, key: 'burst-purple'})
		ask.particleSmall({
			index: o.index,
			key: 'particle-small-purple',
		}, {
			interval: .001,
			loops: 22,
			sizeStart: 16,
			sizeEnd: 0,
			xRange: 50,
			yRange: 0,
		})
		o.endFrame = 1
		ask.explosion(o, {
			contrastStart: 1.5,
			brightnessStart: 2,
			sizeStart: 200,
			sizeEnd: 180,
			yStart: ask.centerY(o.index, true) - 50,
			repeat: true,
			duration: 1.2,
			frameDuration: .125,
			frameEase: Power0.easeIn,
		})
	}
	function icingDeath(o) {
		ask.explosion({index: o.index, key: 'burst-ice'}, {
			sizeEnd: 270
		})
		ask.explosion({index: o.index, key: 'icingDeath2'}, {
			contrastStart: 1.5,
			brightnessStart: 2,
			sizeStart: 0,
			sizeEnd: 240,
			duration: .8,
		})
		ask.explosion({index: o.index, key: 'icingDeath1'}, {
			contrastStart: 1.5,
			brightnessStart: 2,
			sizeStart: 0,
			sizeEnd: 200,
			duration: .7,
		})
		ask.explosion(o, {
			contrastStart: 1.5,
			brightnessStart: 2,
			sizeStart: 0,
			sizeEnd: 150,
			duration: .85,
		})
	}
	function curseOfShadows(o) {
		ask.explosion({index: o.index, key: 'burst-purple'}, {
			sizeEnd: 300
		})
		ask.explosion({index: o.index, key: 'curseOfShadows2'}, {
			contrastStart: 1.5,
			brightnessStart: 2,
			rotation: -90,
			sizeStart: 200,
			sizeEnd: 250,
			duration: 1,
		})
		ask.explosion(o, {
			contrastStart: 1.5,
			brightnessStart: 2,
			rotation: -90,
			sizeStart: 150,
			sizeEnd: 200,
			duration: .8,
		})
		ask.explosion({index: o.index, key: 'curseOfShadows1'}, {
			contrastStart: 1.5,
			brightnessStart: 2,
			rotation: 90,
			sizeStart: 100,
			sizeEnd: 180,
			duration: .66,
		})
		ask.particleCircle({
			index: o.index,
			key: 'particle-circle-purple',
		}, {
			duration: .3,
			ease: Power2.easeOut,
			alpha: 0,
			rotation: 0,
			sizeEnd: 300,
		})
	}
	function panicStrike(o) {
		ask.explosion({index: o.index, key: 'burst-arcane'})

		const ringWidth = ((mobs[o.index].clickAliveW * mobs[o.index].size) * 2)
		ask.rings({index: o.index, type: 'purple'}, {
			loops: 6,
			yStart: ask.centerHeadY(o.index, true),
			yEnd: ask.bottomY(o.index, true),
			alpha: 1,
			widthStart: ringWidth,
			width: ringWidth,
			height: ringWidth * .2,
			interval: .07,
			duration: .5,
			ease: Power2.easeOut,
		})

		for (var i=0; i<30; i++) {
			!function(i) {
				delayedCall(i * .03, () => {
					let img = ask.explosion(o, {
						duration: .666,
						contrastStart: 1.5,
						brightnessStart: 2,
						xStart: mob.centerX[o.index] + _.random(-125, 125),
						yStart: ask.centerHeadY(o.index, true) + _.random(-20, 20),
						sizeStart: 50,
						sizeEnd: 0,
						ease: Power0.easeIn,
					})
					TweenMax.to(img, .666, {
						y: '+=' + 40,
						ease: Circ.easeOut,
					})
				})
			}(i)
		}
	}
	function drainSoul(o) {
		ask.explosion({index: o.index, key: 'burst-poison'})
		ask.explosion({index: o.index, key: 'drainSoul1'}, {
			contrastStart: 1.5,
			brightnessStart: 2,
			sizeStart: 200,
			sizeEnd: 250,
			duration: 1,
		})
		ask.explosion({index: o.index, key: 'drainSoul2'}, {
			contrastStart: 1.5,
			brightnessStart: 2,
			rotation: 180,
			sizeStart: 200,
			sizeEnd: 300,
			duration: .8,
		})
		let face = ask.explosion(o, {
			contrastStart: 1.5,
			brightnessStart: 2,
			sizeStart: 250,
			sizeEnd: 350,
			duration: 1.2,
		})
		TweenMax.to(face, 1.2, {
			y: '-=' + 50
		})
		for (var i=0; i<5; i++) {
			!function(i) {
				let img = ask.explosion({index: o.index, key: 'drainSoul3'}, {
					contrastStart: 1.5,
					brightnessStart: 2,
					sizeStart: 100,
					sizeEnd: 150,
					alpha: 1,
					duration: .8,
				})
				TweenMax.to(img, .8, {
					curviness: 1.5,
					bezier: {
						type: 'thru', // bezier thru, soft, quadratic, cubic
						curviness: 1.5,
						values: util.getBezierValues({
							points: 5,
							xStart: mob.centerX[o.index],
							yStart: ask.centerY(o.index, true),
							xEnd: dungeon.centerX[party.getIndexByRow(o.row)],
							yEnd: ask.centerY(0, false),
						})
					},
				})
			}(i)
		}
	}
	function drainSoulHeal(o) {
		ask.explosion({index: o.index, key: 'burst-poison'}, {
			targetMob: false,
			sizeStart: 300,
			sizeEnd: 100,
		})
	}
	function lichForm(o) {
		ask.explosion({index: o.index, key: 'orb-purple'}, {
			targetMob: false,
			duration: 1.5,
			sizeStart: 400,
			sizeEnd: 300,
		})
		ask.explosion({
			index: o.index,
			key: 'lichForm1'
		}, {
			targetMob: false,
			duration: 2,
			alphaStart: .5,
			brightnessStart: .5,
			brightnessEnd: 0,
			sizeStart: 320,
			sizeEnd: 270,
		})
		ask.explosion(o, {
			targetMob: false,
			duration: 2,
			sizeStart: 300,
			sizeEnd: 250,
		})
	}
	function engulfingDarkness(o) {
		ask.explosion({index: o.index, key: 'burst-purple'})
		o.endFrame = 2
		for (var i=0; i<3; i++) {
			!function(i) {
				let dur = _.random(.7, 1.1)
				let size = _.random(260, 340)
				let img = ask.groundExplosion(o, {
					yStart: ask.bottomY(o.index, true) + 25,
					contrastStart: 1.5,
					brightnessStart: 2,
					contrastEnd: 1,
					brightnessEnd: 0,
					sizeStart: size,
					sizeEnd: size * .75,
					yoyo: false,
					alphaStart: 1,
					alpha: .5,
					duration: dur,
					frameDuration: .15,
					repeat: true,
					frameEase: Power0.easeIn,
				})
				if (!i) img.x += 50
				else if (i === 2) img.x -= 50
			}(i)
		}
		ask.particleGroup({
			index: o.index,
			key: 'particle-group-purple',
		}, {
			interval: .0166,
			sizeStart: 128,
			sizeEnd: 64,
			xRange: 75,
			yRange: 100,
			loops: 6
		})
	}
	function profaneSpirit(o) {
		ask.explosion({index: o.index, key: 'orb-poison'}, {
			targetMob: false,
			sizeEnd: 300
		})
		ask.particleCircle({
			index: o.index,
			key: 'particle-circle-poison',
		}, {
			targetMob: false,
			duration: .6,
			alpha: 0,
			sizeEnd: 250,
		})
		ask.explosion(o, {
			targetMob: false,
			duration: .6,
			sizeStart: 250,
			sizeEnd: 100,
		})
		delayedCall(.15, () => {
			ask.explosion({
				index: o.index,
				key: 'profaneSpirit1'
			}, {
				targetMob: false,
				duration: .6,
				sizeStart: 200,
				sizeEnd: 100,
			})
		})
		delayedCall(.3, () => {
			ask.explosion({
				index: o.index,
				key: 'profaneSpirit2'
			}, {
				targetMob: false,
				duration: .6,
				sizeStart: 250,
				sizeEnd: 150,
			})
		})
	}
	function profaneSpiritExplosion(o) {
		ask.explosion({index: o.index, key: 'burst-poison'})
		ask.explosion({index: o.index, key: 'orb-poison'}, {
			sizeEnd: 400
		})
		ask.particleCircle({
			index: o.index,
			key: 'particle-circle-poison',
		}, {
			duration: .33,
			alpha: 0,
			sizeEnd: 300,
		})
	}
}($, _, TweenMax, Power0, Power1, Power2, Power3, Power4);