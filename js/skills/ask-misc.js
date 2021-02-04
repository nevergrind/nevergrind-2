!function(
	$, _, TweenMax, Power0, Power1, Power2, Power3, Power4, Circ,
	TimelineMax, undefined) {

	const stunRangeX = 60
	const stunRXH = stunRangeX * .5
	const stunRangeY = 20
	const stunRYH = stunRangeY * .5
	const cacheMobStuns = []
	const cachePlayerStuns = []
	const cacheMobFears = []
	const cachePlayerFears = []
	const cacheMobParalyze = []
	const cachePlayerParalyze = []
	const cacheMobSilence = []
	const cachePlayerSilence = []
	const targetPlayerObj = {targetMob: false}

	ask = {
		...ask,
		mobStun,
		mobFear,
		mobParalyze,
		mobSilence,
		mobDivineJudgment,
		mobDivineGrace,
		mobLayHands,
		mobHarmTouch,
		mobBloodTerror,
		mobCraneKick,
		mobHadoken,
		mobDragonPunch,
		mobBackstab,
		mobWidowStrike,
		mobTrueshotStrike,
		mobBurningEmbers,
		mobShockNova,
		mobBellow,
		mobCreepingChords,
		mobStarfire,
		mobBlizzard,
		mobLightningBlast,
		mobNaturesTouch,
		mobSmite,
		mobForceOfGlory,
		mobFrostRift,
		mobDivineLight,
		mobMysticalGlow,
		mobScourge,
		mobAffliction,
		mobVenomBolt,
		mobBloodFire,
		mobEngulfingDarkness,
		mobPanicStrike,
		mobGravityFlux,
		mobMindBlitz,
		mobStaticSuffocation,
		mobSubversion,
		mobLavaBolt,
		mobStaticStorm,
		mobArclight,
		mobGlacialSpike,
		mobFireBolt,
		mobIceBolt,
		mobMagicMissiles,
		mobLightningBolt,
		mobFireball,
		fadeOut,
		flames,
	}
	let delay = 0
	///////////////////////////////////////////
	function flames(o, config) {
		let xAdj, yAdj, zIndex
		if (config.key === 'meteor') {
			xAdj = _.random(-192, 192)
			yAdj = _.random(-30, 60)
		}
		else if (config.key === 'fireWall') {
			xAdj = _.random(-192, 192)
			yAdj = _.random(-30, 60)
		}
		else {
			xAdj = _.random(-125, 125)
			yAdj = _.random(0, 30)
		}
		if (yAdj < 15) {
			zIndex = ask.behindMobLayer(o)
		}
		else {
			zIndex = ask.frontMobLayer(o)
		}
		o.key = config.key ? config.key : 'flames'
		o.endFrame = 3
		let flameObj = {
			yStart: config.y + yAdj,
			xAdjust: xAdj,
			contrastStart: 1,
			brightnessStart: 1,
			contrastEnd: 1,
			brightnessEnd: 1,
			anchorY: .938,
			sizeStart: config.size ? config.size : 96,
			sizeEnd: config.size ? config.size : 96,
			duration: config.duration,
			frameDuration: _.random(.3, .5),
			repeat: true,
			alphaStart: 0,
			// yoyo: true,
			zIndex: zIndex,
			frameEase: Power0.easeOut,
			ease: Power2.easeOut,
		}
		if (config.x) flameObj.x = config.x
		let flame = ask.groundExplosion(o, flameObj)
		// fade in
		TweenMax.to(flame, config.fade, {
			alpha: 1,
		})
		// fade out
		ask.fadeOut(flame, config.duration - config.fade, config.fade)
		return flame
	}
	function fadeOut(img, duration, fadeDuration) {
		if (typeof fadeDuration === 'undefined') fadeDuration = duration * .2
		delay = duration - fadeDuration
		TweenMax.to(img, fadeDuration, {
			overwrite: 2,
			delay: delay,
			alpha: 0,
			ease: Power0.easeIn,
		})
	}
	function mobFireball(index) {
		ask.sunburst({index: index}, targetPlayerObj)
		ask.particleSmall({
			index: index,
			key: 'particle-small-fire',
		}, {
			targetMob: false,
			interval: .0016,
			loops: 12,
			sizeStart: 32,
			sizeEnd: 0,
			xRange: 60,
			yRange: 50,
		})
		for (var i=0; i<5; i++) {
			!function(i) {
				delayedCall(i * .016, () => {
					ask.particleCircle({
						index: index,
						key: 'particle-circle-fire',
					}, {
						targetMob: false,
						duration: .16,
						ease: Power0.easeOut,
						alpha: 0,
						sizeEnd: 250 + (i * 7),
					})
				})
			}(i)
		}
	}
	function mobLightningBolt(index) {
		ask.explosion({index: index, key: 'burst-lightning'}, targetPlayerObj)
		ask.particleSmall({
			index: index,
			key: 'particle-small-lightning',
		}, {
			targetMob: false,
			interval: .0016,
			loops: 12,
			sizeStart: 32,
			sizeEnd: 0,
			xRange: 60,
			yRange: 50,
		})
		for (var i=0; i<3; i++) {
			!function(i) {
				delayedCall(i * .016, () => {
					ask.particleCircle({
						index: index,
						key: 'particle-circle-lightning',
					}, {
						targetMob: false,
						duration: .16,
						ease: Power0.easeOut,
						alpha: 0,
						sizeEnd: 250 + (i * 7),
					})
				})
			}(i)
		}
	}
	function mobMagicMissiles(index) {
		ask.explosion({index: index, key: 'burst-arcane'}, targetPlayerObj)
		ask.particleSmall({
			index: index,
			key: 'particle-small-arcane',
		}, {
			targetMob: false,
			interval: .0016,
			loops: 12,
			sizeStart: 32,
			sizeEnd: 0,
			xRange: 60,
			yRange: 50,
		})
		for (var i=0; i<1; i++) {
			!function(i) {
				delayedCall(i * .016, () => {
					ask.particleCircle({
						index: index,
						key: 'particle-circle-arcane',
					}, {
						targetMob: false,
						duration: .25,
						ease: Power2.easeOut,
						alpha: 0,
						sizeEnd: 250 + (i * 7),
					})
				})
			}(i)
		}
	}
	function mobIceBolt(index) {
		ask.explosion({index: index, key: 'burst-ice'}, targetPlayerObj)
		ask.particleSmall({
			index: index,
			key: 'particle-small-ice',
		}, {
			targetMob: false,
			interval: .0016,
			loops: 25,
			sizeStart: 32,
			sizeEnd: 0,
			xRange: 200,
			yRange: 50,
		})
		for (var i=0; i<5; i++) {
			!function(i) {
				delayedCall(i * .016, () => {
					ask.particleCircle({
						index: index,
						key: 'particle-circle-ice',
					}, {
						targetMob: false,
						duration: .16,
						ease: Power0.easeOut,
						alpha: 0,
						sizeEnd: 250 + (i * 7),
					})
				})
			}(i)
		}
	}
	function mobFireBolt(index) {
		ask.explosion({index: index, key: 'burst-fire'}, targetPlayerObj)
		ask.particleSmall({
			index: index,
			key: 'particle-small-fire',
		}, {
			targetMob: false,
			interval: .0016,
			loops: 25,
			sizeStart: 32,
			sizeEnd: 0,
			xRange: 200,
			yRange: 50,
		})
		for (var i=0; i<5; i++) {
			!function(i) {
				delayedCall(i * .016, () => {
					ask.particleCircle({
						index: index,
						key: 'particle-circle-fire',
					}, {
						targetMob: false,
						duration: .16,
						ease: Power0.easeOut,
						alpha: 0,
						sizeEnd: 250 + (i * 7),
					})
				})
			}(i)
		}
	}
	function mobGlacialSpike(index) {
		ask.explosion({index: index, key: 'burst-ice'}, targetPlayerObj)
		ask.particleSmall({
			index: index,
			key: 'particle-small-ice',
		}, {
			targetMob: false,
			interval: .0016,
			loops: 20,
			sizeStart: 32,
			sizeEnd: 0,
			xRange: 100,
			yRange: 50,
		})
		for (var i=0; i<3; i++) {
			!function(i) {
				delayedCall(i * .05, () => {
					ask.particleCircle({
						index: index,
						key: 'particle-circle-ice',
					}, {
						targetMob: false,
						duration: .16,
						ease: Power0.easeOut,
						alpha: 0,
						sizeEnd: 250 + (i * 7),
					})
				})
			}(i)
		}
	}
	function mobArclight(index) {
		ask.particleGroup({
			index: index,
			key: 'particle-group-lightning',
		}, {
			targetMob: false,
			duration: 1.25,
			interval: .1,
			sizeStart: 128,
			sizeEnd: 128,
			xRange: 64,
			yRange: 0,
			loops: 3,
			ease: Circ.easeInOut,
		})
		ask.particleSmall({
			index: index,
			key: 'particle-small-lightning',
		}, {
			targetMob: false,
			interval: .0033,
			loops: 17,
			sizeStart: 50,
			sizeEnd: 0,
			xRange: 150,
			yRange: 50,
		})
	}
	function mobStaticStorm(index) {
		ask.explosion({index: index, key: 'burst-lightning'}, targetPlayerObj)
		ask.particleSmall({
			index: index,
			key: 'particle-small-lightning',
		}, {
			targetMob: false,
			interval: .0016,
			loops: 4,
			sizeStart: 50,
			sizeEnd: 0,
			xRange: 50,
			yRange: 50,
		})
		for (var i=0; i<2; i++) {
			!function(i) {
				delayedCall(i * .05, () => {
					ask.particleCircle({
						index: index,
						key: 'particle-circle-lightning',
					}, {
						targetMob: false,
						duration: .16,
						ease: Power0.easeOut,
						alpha: 0,
						sizeEnd: 250 + (i * 7),
					})
				})
			}(i)
		}
	}
	function mobLavaBolt(index) {
		ask.sunburst({index: index}, targetPlayerObj)
		ask.particleSmall({
			index: index,
			key: 'particle-small-fire',
		}, {
			targetMob: false,
			interval: .0016,
			loops: 25,
			sizeStart: 32,
			sizeEnd: 0,
			xRange: 200,
			yRange: 50,
		})
		for (var i=0; i<3; i++) {
			!function(i) {
				delayedCall(i * .05, () => {
					ask.particleCircle({
						index: index,
						key: 'particle-circle-fire',
					}, {
						targetMob: false,
						duration: .16,
						ease: Power0.easeOut,
						alpha: 0,
						sizeEnd: 250 + (i * 7),
					})
				})
			}(i)
		}
	}
	function mobSubversion(index) {
		ask.particleGroup({
			index: index,
			key: 'particle-group-poison',
		}, {
			targetMob: false,
			duration: 1.25,
			interval: .05,
			sizeStart: 160,
			sizeEnd: 160,
			xRange: 48,
			yRange: 0,
			loops: 3,
			ease: Power2.easeInOut,
		})
		ask.particleSmall({
			index: index,
			key: 'particle-small-poison',
		}, {
			targetMob: false,
			interval: .0016,
			loops: 15,
			sizeStart: 32,
			sizeEnd: 0,
			xRange: 125,
			yRange: 50,
		})
	}
	function mobStaticSuffocation(index) {
		ask.particleGroup({
			index: index,
			key: 'particle-group-lightning',
		}, {
			targetMob: false,
			duration: 1,
			interval: .05,
			sizeStart: 160,
			sizeEnd: 160,
			xRange: 64,
			yRange: 0,
			loops: 3,
			ease: Power3.easeInOut,
		})
		ask.particleSmall({
			index: index,
			key: 'particle-small-lightning',
		}, {
			targetMob: false,
			interval: .001,
			loops: 9,
			sizeStart: 32,
			sizeEnd: 0,
			xRange: 50,
			yRange: 50,
		})
	}
	function mobGravityFlux(index) {
		ask.explosion({index: index, key: 'burst-arcane'}, targetPlayerObj)
		ask.particleSmall({
			index: index,
			key: 'particle-small-arcane',
		}, {
			targetMob: false,
			interval: .0016,
			loops: 25,
			sizeStart: 32,
			sizeEnd: 0,
			xRange: 250,
			yRange: 50,
		})
		for (var i=0; i<5; i++) {
			!function(i) {
				delayedCall(i * .005, () => {
					ask.particleCircle({
						index: index,
						key: 'particle-circle-arcane',
					}, {
						targetMob: false,
						duration: .16,
						rotation: !(i % 2) ? 90 : -90,
						ease: Power0.easeOut,
						alpha: 0,
						sizeEnd: 250 + (i * 7),
					})
				})
			}(i)
		}
	}
	function mobMindBlitz(index) {
		ask.explosion({index: index, key: 'burst-arcane'}, targetPlayerObj)
		ask.particleSmall({
			index: index,
			key: 'particle-small-arcane',
		}, {
			targetMob: false,
			interval: .0016,
			loops: 25,
			sizeStart: 32,
			sizeEnd: 0,
			xRange: 40,
			yRange: 70,
		})
		for (var i=0; i<3; i++) {
			!function(i) {
				delayedCall(i * .01, () => {
					ask.particleCircle({
						index: index,
						key: 'particle-circle-arcane',
					}, {
						targetMob: false,
						duration: .16,
						rotation: !(i % 2) ? 90 : -90,
						ease: Power0.easeOut,
						alpha: 0,
						sizeEnd: 250 + (i * 7),
					})
				})
			}(i)
		}
	}
	function mobPanicStrike(index) {
		ask.explosion({index: index, key: 'burst-arcane'}, targetPlayerObj)
		ask.particleSmall({
			index: index,
			key: 'particle-small-arcane',
		}, {
			targetMob: false,
			interval: .0016,
			loops: 13,
			sizeStart: 32,
			sizeEnd: 0,
			xRange: 70,
			yRange: 70,
		})
		for (var i=0; i<5; i++) {
			!function(i) {
				delayedCall(i * .016, () => {
					ask.particleCircle({
						index: index,
						key: 'particle-circle-arcane',
					}, {
						targetMob: false,
						duration: .16,
						rotation: !(i % 2) ? 90 : -90,
						ease: Power0.easeOut,
						alpha: 0,
						sizeEnd: 250 + (i * 7),
					})
				})
			}(i)
		}
	}
	function mobEngulfingDarkness(index) {
		ask.particleGroup({
			index: index,
			key: 'particle-group-poison',
		}, {
			targetMob: false,
			duration: .75,
			interval: .033,
			sizeStart: 160,
			sizeEnd: 128,
			xRange: 96,
			yRange: 0,
			loops: 5,
			ease: Power2.easeIn,
		})
		ask.particleSmall({
			index: index,
			key: 'particle-small-poison',
		}, {
			targetMob: false,
			interval: .001,
			loops: 12,
			sizeStart: 32,
			sizeEnd: 4,
			xRange: 50,
			yRange: 50,
		})
	}
	function mobBloodFire(index) {
		ask.particleGroup({
			index: index,
			key: 'particle-group-fire',
		}, {
			targetMob: false,
			duration: .75,
			interval: .033,
			sizeStart: 160,
			sizeEnd: 128,
			xRange: 96,
			yRange: 0,
			loops: 5,
			ease: Power2.easeIn,
		})
		ask.particleSmall({
			index: index,
			key: 'particle-small-fire',
		}, {
			targetMob: false,
			interval: .001,
			loops: 12,
			sizeStart: 32,
			sizeEnd: 4,
			xRange: 50,
			yRange: 50,
		})
	}
	function mobVenomBolt(index) {
		ask.explosion({index: index, key: 'burst-poison'}, targetPlayerObj)
		ask.particleSmall({
			index: index,
			key: 'particle-small-poison',
		}, {
			targetMob: false,
			interval: .0016,
			loops: 13,
			sizeStart: 32,
			sizeEnd: 0,
			xRange: 70,
			yRange: 70,
		})
		for (var i=0; i<5; i++) {
			!function(i) {
				delayedCall(i * .016, () => {
					ask.particleCircle({
						index: index,
						key: 'particle-circle-poison',
					}, {
						targetMob: false,
						duration: .16,
						rotation: !(i % 2) ? 90 : -90,
						ease: Power0.easeOut,
						alpha: 0,
						sizeEnd: 250 + (i * 7),
					})
				})
			}(i)
		}
	}
	function mobAffliction(index) {
		ask.particleGroup({
			index: index,
			key: 'particle-group-poison',
		}, {
			targetMob: false,
			duration: .75,
			interval: .033,
			sizeStart: 160,
			sizeEnd: 128,
			xRange: 96,
			yRange: 0,
			loops: 5,
			ease: Power2.easeIn,
		})
		ask.particleSmall({
			index: index,
			key: 'particle-small-poison',
		}, {
			targetMob: false,
			interval: .001,
			loops: 12,
			sizeStart: 32,
			sizeEnd: 4,
			xRange: 150,
			yRange: 50,
		})
	}
	function mobScourge(index) {
		ask.particleGroup({
			index: index,
			key: 'particle-group-blood',
		}, {
			targetMob: false,
			duration: .75,
			interval: .033,
			sizeStart: 160,
			sizeEnd: 128,
			xRange: 96,
			yRange: 0,
			loops: 5,
			ease: Power2.easeIn,
		})
		ask.particleSmall({
			index: index,
			key: 'particle-small-blood',
		}, {
			targetMob: false,
			interval: .001,
			loops: 12,
			sizeStart: 32,
			sizeEnd: 4,
			xRange: 150,
			yRange: 50,
		})
	}
	function mobMysticalGlow(index, tgt) {
		for (var i=0; i<3; i++) {
			!function(i) {
				delayedCall(i * .03, () => {
					ask.particleCircle({
						index: index,
						key: 'cast-swirl-arcane',
					}, {
						duration: 1,
						ease: Power2.easeOut,
						alpha: 1,
						sizeStart: mobs[index].width * .75,
						sizeEnd: mobs[index].width * .5,
					})
				})
			}(i)
		}
		ask.particleGroup({
			index: tgt,
			key: 'particle-group-arcane',
		}, {
			duration: 1,
			interval: .1,
			sizeStart: 192,
			sizeEnd: 128,
			xRange: 75,
			yRange: 0,
			loops: 3,
		})
	}
	function mobDivineLight(index, tgt) {
		for (var i=0; i<3; i++) {
			!function(i) {
				delayedCall(i * .03, () => {
					ask.particleCircle({
						index: index,
						key: 'cast-swirl-arcane',
					}, {
						duration: 1,
						ease: Power2.easeOut,
						alpha: 1,
						sizeStart: mobs[index].width * .75,
						sizeEnd: mobs[index].width * .5,
					})
				})
			}(i)
		}
		ask.particleGroup({
			index: tgt,
			key: 'particle-group-arcane',
		}, {
			duration: 1,
			interval: .1,
			sizeStart: 192,
			sizeEnd: 128,
			xRange: 75,
			yRange: 0,
			loops: 3,
		})
	}
	function mobFrostRift(index) {
		ask.explosion({index: index, key: 'burst-ice'}, targetPlayerObj)
		ask.particleSmall({
			index: index,
			key: 'particle-small-ice',
		}, {
			targetMob: false,
			interval: .0016,
			loops: 13,
			sizeStart: 32,
			sizeEnd: 0,
			xRange: 250,
			yRange: 50,
		})
		for (var i=0; i<5; i++) {
			!function(i) {
				delayedCall(i * .03, () => {
					ask.particleCircle({
						index: index,
						key: 'particle-circle-ice',
					}, {
						targetMob: false,
						duration: .16,
						ease: Power0.easeOut,
						alpha: 0,
						sizeEnd: 200 + (i * 5),
					})
				})
			}(i)
		}
	}
	function mobSmite(index) {
		ask.explosion({index: index, key: 'burst-arcane'}, targetPlayerObj)
		for (var i=0; i<5; i++) {
			!function(i) {
				delayedCall(i * .016, () => {
					ask.particleCircle({
						index: index,
						key: 'particle-circle-arcane',
					}, {
						targetMob: false,
						duration: .16,
						ease: Power0.easeOut,
						alpha: 0,
						sizeEnd: 200 + (i * 10),
					})
				})
			}(i)
		}
	}
	function mobForceOfGlory(index) {
		ask.sunburst({index: index}, targetPlayerObj)
		ask.explosion({index: index, key: 'burst-arcane'}, targetPlayerObj)
		ask.particleSmall({
			index: index,
			key: 'particle-small-arcane',
		}, {
			targetMob: false,
			interval: .0016,
			loops: 22,
			sizeStart: 32,
			sizeEnd: 16,
			xRange: 400,
			yRange: 50,
		})
		for (var i=0; i<5; i++) {
			!function(i) {
				delayedCall(i * .016, () => {
					ask.particleCircle({
						index: index,
						key: 'particle-circle-arcane',
					}, {
						targetMob: false,
						duration: .16,
						ease: Power0.easeOut,
						alpha: 0,
						sizeEnd: 350 - (i * 30),
					})
				})
			}(i)
		}
	}
	function mobNaturesTouch(index, tgt) {
		// console.info('mobDivineGrace', index, row)
		for (var i=0; i<3; i++) {
			!function(i) {
				delayedCall(i * .03, () => {
					ask.particleCircle({
						index: index,
						key: 'cast-swirl-arcane',
					}, {
						duration: 1,
						ease: Power2.easeOut,
						alpha: 1,
						sizeStart: mobs[index].width * .75,
						sizeEnd: mobs[index].width * .5,
					})
				})
			}(i)
		}
		ask.particleGroup({
			index: tgt,
			key: 'particle-group-arcane',
		}, {
			duration: 1,
			interval: .1,
			sizeStart: 192,
			sizeEnd: 128,
			xRange: 75,
			yRange: 0,
			loops: 3,
		})
	}
	function mobLightningBlast(index) {
		ask.explosion({index: index, key: 'burst-lightning'}, targetPlayerObj)
		ask.moonburst({index: index}, targetPlayerObj)
		ask.particleSmall({
			index: index,
			key: 'particle-small-lightning',
		}, {
			targetMob: false,
			interval: .0016,
			duration: .25,
			loops: 5,
			sizeStart: 32,
			sizeEnd: 0,
			xRange: 125,
			yRange: 50,
		})
	}
	function mobBlizzard(index) {
		ask.particleGroup({
			index: index,
			key: 'particle-group-ice',
		}, {
			targetMob: false,
			duration: 1,
			interval: .033,
			sizeStart: 256,
			sizeEnd: 192,
			xRange: 70,
			yRange: 0,
			loops: 1,
			yStartAdj: -70,
			ease: Power2.easeOut,
		})
		ask.particleSmall({
			index: index,
			key: 'particle-small-ice',
		}, {
			targetMob: false,
			interval: .0016,
			loops: 11,
			sizeStart: 32,
			sizeEnd: 16,
			xRange: 200,
			yRange: 50,
		})
	}
	function mobStarfire(index) {
		ask.sunburst({index: index}, targetPlayerObj)
		ask.particleSmall({
			index: index,
			key: 'particle-small-fire',
		}, {
			targetMob: false,
			interval: .0016,
			loops: 11,
			sizeStart: 32,
			sizeEnd: 16,
			xRange: 200,
			yRange: 50,
		})
		for (var i=0; i<3; i++) {
			!function(i) {
				if (i % 3 === 0) ask.sunburst({index: index}, targetPlayerObj)
				delayedCall(i * .033, () => {
					ask.particleCircle({
						index: index,
						key: 'particle-circle-fire',
					}, {
						targetMob: false,
						duration: .16,
						ease: Power0.easeOut,
						alpha: 0,
						sizeEnd: 200 + (i * 25),
					})
				})
			}(i)
		}
	}
	function mobCreepingChords(index) {
		ask.particleGroup({
			index: index,
			key: 'particle-group-lightning',
		}, {
			targetMob: false,
			duration: .9,
			interval: .033,
			sizeStart: 160,
			sizeEnd: 128,
			xRange: 96,
			yRange: 0,
			loops: 5,
			ease: Power2.easeIn,
		})
		ask.particleSmall({
			index: index,
			key: 'particle-small-lightning',
		}, {
			targetMob: false,
			interval: .001,
			loops: 12,
			sizeStart: 32,
			sizeEnd: 4,
			xRange: 150,
			yRange: 50,
		})
	}
	function mobBellow(index) {
		ask.explosion({index: index, key: 'burst-arcane'}, targetPlayerObj)
		ask.moonburst({index: index}, targetPlayerObj)
		ask.particleSmall({
			index: index,
			key: 'particle-small-arcane',
		}, {
			targetMob: false,
			interval: .001,
			loops: 13,
			sizeStart: 32,
			sizeEnd: 16,
			xRange: 200,
			yRange: 50,
		})
		for (var i=0; i<5; i++) {
			!function(i) {
				delayedCall(i * .033, () => {
					ask.particleCircle({
						index: index,
						key: 'particle-circle-arcane',
					}, {
						targetMob: false,
						duration: .25,
						ease: Power0.easeOut,
						alpha: 0,
						sizeEnd: 250,
					})
				})
			}(i)
		}
	}
	function mobBurningEmbers(index) {
		ask.particleGroup({
			index: index,
			key: 'particle-group-fire',
		}, {
			targetMob: false,
			duration: .75,
			interval: .033,
			sizeStart: 160,
			sizeEnd: 128,
			xRange: 96,
			yRange: 0,
			loops: 5,
			ease: Power2.easeIn,
		})
		ask.particleSmall({
			index: index,
			key: 'particle-small-fire',
		}, {
			targetMob: false,
			interval: .001,
			loops: 12,
			sizeStart: 32,
			sizeEnd: 4,
			xRange: 150,
			yRange: 50,
		})
	}
	function mobShockNova(index) {
		ask.moonburst({
			index: index,
		}, targetPlayerObj)
		ask.nova({index: index, key: 'cast-swirl-lightning'}, {
			targetMob: false,
			position: 'bottom',
			loops: 5,
		})
		ask.particleSmall({
			index: index,
			key: 'particle-small-lightning',
		}, {
			targetMob: false,
			interval: .0033,
			duration: .666,
			loops: 25,
			sizeStart: 32,
			sizeEnd: 8,
			xRange: 150,
			yRange: 50,
		})
		for (var i=0; i<3; i++) {
			!function(i) {
				delayedCall(i * .05, () => {
					ask.particleCircle({
						index: index,
						key: 'particle-circle-lightning',
					}, {
						targetMob: false,
						duration: .25,
						ease: Power0.easeOut,
						alpha: 0,
						sizeEnd: 350,
					})
				})
			}(i)
		}
	}
	function mobTrueshotStrike(index) {
		ask.explosion({index: index, key: 'burst-default'}, targetPlayerObj)
		ask.starburst({index: index}, targetPlayerObj)
		ask.particleSmall({
			index: index,
			key: 'particle-small-default',
		}, {
			targetMob: false,
			interval: .001,
			loops: 25,
			sizeStart: 32,
			sizeEnd: 8,
			xRange: 150,
			yRange: 50,
		})
		for (var i=0; i<1; i++) {
			!function(i) {
				delayedCall(i * .05, () => {
					ask.particleCircle({
						index: index,
						key: 'particle-circle-default',
					}, {
						targetMob: false,
						duration: .25,
						ease: Power0.easeOut,
						alpha: 0,
						sizeEnd: 350,
					})
				})
			}(i)
		}
	}
	function mobWidowStrike(index) {
		ask.particleGroup({
			index: index,
			key: 'particle-group-poison',
		}, {
			targetMob: false,
			duration: .5,
			interval: .05,
			sizeStart: 160,
			sizeEnd: 128,
			xRange: 64,
			yRange: 0,
			loops: 5,
			ease: Power2.easeIn,
		})
		ask.particleSmall({
			index: index,
			key: 'particle-small-poison',
		}, {
			targetMob: false,
			interval: .001,
			loops: 25,
			sizeStart: 32,
			sizeEnd: 8,
			xRange: 150,
			yRange: 50,
		})
	}
	function mobBackstab(index) {
		ask.explosion({index: index, key: 'burst-default'}, targetPlayerObj)
		ask.starburst({
			index: index,
		}, {
			targetMob: false,
		})
		for (var i=0; i<1; i++) {
			!function(i) {
				delayedCall(i * .05, () => {
					ask.particleCircle({
						index: index,
						key: 'particle-circle-default',
					}, {
						targetMob: false,
						duration: .25,
						ease: Power0.easeOut,
						alpha: 0,
						sizeEnd: 350,
					})
				})
			}(i)
		}
	}
	function mobDragonPunch(index) {
		ask.sunburst({index: index}, targetPlayerObj)
		ask.particleSmall({
			index: index,
			key: 'particle-small-fire',
		}, {
			targetMob: false,
			interval: .001,
			loops: 25,
			sizeStart: 32,
			sizeEnd: 8,
			xRange: 150,
			yRange: 50,
		})
		for (var i=0; i<1; i++) {
			!function(i) {
				delayedCall(i * .05, () => {
					ask.particleCircle({
						index: index,
						key: 'particle-circle-fire',
					}, {
						targetMob: false,
						duration: .25,
						ease: Power0.easeOut,
						alpha: 0,
						sizeEnd: 350,
					})
				})
			}(i)
		}
	}
	function mobHadoken(index) {
		ask.explosion({index: index, key: 'burst-arcane'}, targetPlayerObj)
		ask.starburst({
			index: index,
		}, targetPlayerObj)
		ask.particleSmall({
			index: index,
			key: 'particle-small-arcane',
		}, {
			targetMob: false,
			interval: .001,
			loops: 25,
			sizeStart: 32,
			sizeEnd: 8,
			xRange: 150,
			yRange: 50,
		})
		for (var i=0; i<2; i++) {
			!function(i) {
				delayedCall(i * .05, () => {
					ask.particleCircle({
						index: index,
						key: 'particle-circle-arcane',
					}, {
						targetMob: false,
						duration: .16,
						ease: Power0.easeOut,
						alpha: 0,
						sizeEnd: 350,
					})
				})
			}(i)
		}
	}
	function mobCraneKick(index) {
		ask.explosion({index: index, key: 'burst-default'}, targetPlayerObj)
		ask.moonburst({
			index: index,
		}, targetPlayerObj)
		for (var i=0; i<3; i++) {
			!function(i) {
				delayedCall(i * .05, () => {
					ask.particleCircle({
						index: index,
						key: 'particle-circle-default',
					}, {
						targetMob: false,
						duration: .25,
						ease: Power0.easeOut,
						alpha: 0,
						sizeEnd: 350,
					})
				})
			}(i)
		}
	}
	function mobBloodTerror(index) {
		ask.particleGroup({
			index: index,
			key: 'particle-group-blood',
		}, {
			targetMob: false,
			duration: .5,
			interval: .05,
			sizeStart: 160,
			sizeEnd: 128,
			xRange: 64,
			yRange: 0,
			loops: 5,
			ease: Power2.easeIn,
		})
	}
	function mobHarmTouch(index) {
		for (var i=0; i<5; i++) {
			!function(i) {
				delayedCall(i * .016, () => {
					ask.explosion({index: index, key: 'burst-blood'}, targetPlayerObj)
					ask.particleCircle({
						index: index,
						key: 'particle-circle-blood',
					}, {
						targetMob: false,
						duration: .2,
						ease: Power2.easeOut,
						alpha: 0,
						sizeEnd: 300,
					})
				})
			}(i)
		}
	}
	function mobLayHands(index, tgt) { // tx rx
		// console.info('mobDivineGrace', index, row)
		for (var i=0; i<5; i++) {
			ask.starburst({index: index})
			!function(i) {
				delayedCall(i * .1, () => {
					ask.particleCircle({
						index: index,
						key: 'cast-swirl-arcane',
					}, {
						duration: .7,
						ease: Power1.easeInOut,
						alpha: 0,
						sizeStart: mobs[index].width * .75,
						sizeEnd: mobs[index].width * .5,
					})
				})
			}(i)
		}
		ask.starburst({index: tgt})
		ask.particleGroup({
			index: tgt,
			key: 'particle-group-arcane',
		}, {
			duration: .7,
			interval: .1,
			sizeStart: 192,
			sizeEnd: 96,
			xRange: 96,
			ease: Power1.easeInOut,
			yRange: 0,
			loops: 7,
		})
	}

	function mobDivineGrace(index, tgt) { // tx rx
		// console.info('mobDivineGrace', index, row)
		for (var i=0; i<3; i++) {
			!function(i) {
				delayedCall(i * .03, () => {
					ask.particleCircle({
						index: index,
						key: 'cast-swirl-arcane',
					}, {
						duration: 1,
						ease: Power2.easeOut,
						alpha: 1,
						sizeStart: mobs[index].width * .75,
						sizeEnd: mobs[index].width * .5,
					})
				})
			}(i)
		}
		ask.particleGroup({
			index: tgt,
			key: 'particle-group-arcane',
		}, {
			duration: 1,
			interval: .1,
			sizeStart: 192,
			sizeEnd: 128,
			xRange: 75,
			yRange: 0,
			loops: 3,
		})
	}

	function mobDivineJudgment(index) {
		ask.explosion({index: index, key: 'burst-arcane'}, targetPlayerObj)
		for (var i=0; i<3; i++) {
			!function(i) {
				delayedCall(i * .05, () => {
					ask.particleCircle({
						index: index,
						key: 'particle-circle-arcane',
					}, {
						targetMob: false,
						duration: .25,
						ease: Power0.easeOut,
						alpha: 0,
						sizeEnd: 350,
					})
				})
			}(i)
		}
	}

	function mobSilence(o, targetMob) {
		let startX
		let startY
		if (targetMob) {
			if (!mob.isAlive(o.index)) return
			startX = mob.centerX[o.index]
			startY = ask.centerHeadY(o.index, true)
		}
		else {
			const pos = ask.getPlayerHead()
			startX = pos.x
			startY = pos.y
		}
		let bezierValues = [
			// p1
			{ x: startX, y: startY },
			{ x: startX + stunRXH, y: startY },
			{ x: startX + stunRXH, y: startY + stunRYH },
			// p2
			{ x: startX + stunRXH, y: startY + stunRangeY },
			{ x: startX, y: startY + stunRangeY },
			// p3
			{ x: startX - stunRXH, y: startY + stunRangeY },
			{ x: startX - stunRXH, y: startY + stunRYH },
			// p4
			{ x: startX - stunRXH, y: startY },
			{ x: startX, y: startY }
		]

		// remove cached IDs graphics and reset array
		if (targetMob) {
			if (Array.isArray(cacheMobSilence[o.index])) {
				cacheMobSilence[o.index].forEach(index => (ask.removeImg()(index)))
			}
			cacheMobSilence[o.index] = []
		}
		else {
			if (Array.isArray(cachePlayerSilence[o.index])) {
				cachePlayerSilence[o.index].forEach(index => (ask.removeImg()(index)))
			}
			cachePlayerSilence[o.index] = []
		}

		for (var i=0; i<3; i++) {
			!function createParticle(i, p) {
				p.width = 32
				p.height = 32
				p.x = startX
				p.y = startY
				if (targetMob) cacheMobSilence[o.index].push(p.id)
				else cachePlayerSilence[o.index].push(p.id)
				var t = new TweenMax.to(p, .333, {
					delay: i * .111,
					repeat: -1,
					curviness: 1.5,
					bezier: {
						type: 'quadratic',
						autoRotate: false,
						values: bezierValues
					},
					ease: Power0.easeNone,
					onUpdate: checkRemoval,
					onUpdateParams: [p],
				})
				if (i === 1) t.progress(1/3)
				else if (i === 2) t.progress(2/3)
			}(i, ask.particle(o, { targetMob: targetMob}))
		}
		/////////////////////////////////////////////
		function checkRemoval(particle) {
			if (targetMob) {
				if (!mobs[o.index].buffFlags.silence || !mob.isAlive(o.index)) {
					ask.removeImg()(particle.id)
				}
			}
			else {
				if (!my.isSilenced() || my.hp <= 0) {
					ask.removeImg()(particle.id)
				}
			}
		}
	}

	function mobParalyze(o, targetMob) {
		let startX
		let startY
		if (targetMob) {
			if (!mob.isAlive(o.index)) return
			startX = mob.centerX[o.index]
			startY = ask.centerHeadY(o.index, true)
		}
		else {
			const pos = ask.getPlayerHead()
			startX = pos.x
			startY = pos.y
		}
		let bezierValues = [
			// p1
			{ x: startX, y: startY },
			{ x: startX + stunRXH, y: startY },
			{ x: startX + stunRXH, y: startY + stunRYH },
			// p2
			{ x: startX + stunRXH, y: startY + stunRangeY },
			{ x: startX, y: startY + stunRangeY },
			// p3
			{ x: startX - stunRXH, y: startY + stunRangeY },
			{ x: startX - stunRXH, y: startY + stunRYH },
			// p4
			{ x: startX - stunRXH, y: startY },
			{ x: startX, y: startY }
		]

		// remove cached IDs graphics and reset array
		if (targetMob) {
			if (Array.isArray(cacheMobParalyze[o.index])) {
				cacheMobParalyze[o.index].forEach(index => (ask.removeImg()(index)))
			}
			cacheMobParalyze[o.index] = []
		}
		else {
			if (Array.isArray(cachePlayerParalyze[o.index])) {
				cachePlayerParalyze[o.index].forEach(index => (ask.removeImg()(index)))
			}
			cachePlayerParalyze[o.index] = []
		}

		for (var i=0; i<3; i++) {
			!function createParticle(i, p) {
				p.width = 32
				p.height = 32
				p.x = startX
				p.y = startY
				if (targetMob) cacheMobParalyze[o.index].push(p.id)
				else cachePlayerParalyze[o.index].push(p.id)
				var t = new TweenMax.to(p, .333, {
					delay: i * .111,
					repeat: -1,
					curviness: 1.5,
					bezier: {
						type: 'quadratic',
						autoRotate: false,
						values: bezierValues
					},
					ease: Power0.easeNone,
					onUpdate: checkRemoval,
					onUpdateParams: [p],
				})
				if (i === 1) t.progress(1/3)
				else if (i === 2) t.progress(2/3)
			}(i, ask.particle(o, { targetMob: targetMob}))
		}
		/////////////////////////////////////////////
		function checkRemoval(particle) {
			if (targetMob) {
				if (!mobs[o.index].buffFlags.paralyze || !mob.isAlive(o.index)) {
					ask.removeImg()(particle.id)
				}
			}
			else {
				if (!my.isParalyzed() || my.hp <= 0) {
					ask.removeImg()(particle.id)
				}
			}
		}
	}

	function mobFear(o, targetMob) {
		let startX
		let startY
		if (targetMob) {
			if (!mob.isAlive(o.index)) return
			startX = mob.centerX[o.index]
			startY = ask.centerHeadY(o.index, true)
		}
		else {
			const pos = ask.getPlayerHead()
			startX = pos.x
			startY = pos.y
		}
		let bezierValues = [
			// p1
			{ x: startX, y: startY },
			{ x: startX + stunRXH, y: startY },
			{ x: startX + stunRXH, y: startY + stunRYH },
			// p2
			{ x: startX + stunRXH, y: startY + stunRangeY },
			{ x: startX, y: startY + stunRangeY },
			// p3
			{ x: startX - stunRXH, y: startY + stunRangeY },
			{ x: startX - stunRXH, y: startY + stunRYH },
			// p4
			{ x: startX - stunRXH, y: startY },
			{ x: startX, y: startY }
		]

		// remove cached IDs graphics and reset array
		if (targetMob) {
			if (Array.isArray(cacheMobFears[o.index])) {
				cacheMobFears[o.index].forEach(index => (ask.removeImg()(index)))
			}
			cacheMobFears[o.index] = []
		}
		else {
			if (Array.isArray(cachePlayerFears[o.index])) {
				cachePlayerFears[o.index].forEach(index => (ask.removeImg()(index)))
			}
			cachePlayerFears[o.index] = []
		}

		for (var i=0; i<3; i++) {
			!function createParticle(i, p) {
				p.width = 32
				p.height = 32
				p.x = startX
				p.y = startY
				if (targetMob) cacheMobFears[o.index].push(p.id)
				else cachePlayerFears[o.index].push(p.id)
				var t = new TweenMax.to(p, .333, {
					delay: i * .111,
					repeat: -1,
					curviness: 1.5,
					bezier: {
						type: 'quadratic',
						autoRotate: false,
						values: bezierValues
					},
					ease: Power0.easeNone,
					onUpdate: checkRemoval,
					onUpdateParams: [p],
				})
				if (i === 1) t.progress(1/3)
				else if (i === 2) t.progress(2/3)
			}(i, ask.particle(o, { targetMob: targetMob}))
		}
		/////////////////////////////////////////////
		function checkRemoval(particle) {
			if (targetMob) {
				if (!mobs[o.index].buffFlags.fear || !mob.isAlive(o.index)) {
					ask.removeImg()(particle.id)
				}
			}
			else {
				if (!my.isFeared() || my.hp <= 0) {
					ask.removeImg()(particle.id)
				}
			}
		}
	}

	function mobStun(o, targetMob) {
		let startX
		let startY
		if (targetMob) {
			if (!mob.isAlive(o.index)) return
			startX = mob.centerX[o.index]
			startY = ask.centerHeadY(o.index, true)
		}
		else {
			const pos = ask.getPlayerHead()
			startX = pos.x
			startY = pos.y
		}
		let bezierValues = [
			// p1
			{ x: startX, y: startY },
			{ x: startX + stunRXH, y: startY },
			{ x: startX + stunRXH, y: startY + stunRYH },
			// p2
			{ x: startX + stunRXH, y: startY + stunRangeY },
			{ x: startX, y: startY + stunRangeY },
			// p3
			{ x: startX - stunRXH, y: startY + stunRangeY },
			{ x: startX - stunRXH, y: startY + stunRYH },
			// p4
			{ x: startX - stunRXH, y: startY },
			{ x: startX, y: startY }
		]

		// remove cached IDs graphics and reset array
		if (targetMob) {
			if (Array.isArray(cacheMobStuns[o.index])) {
				cacheMobStuns[o.index].forEach(index => (ask.removeImg()(index)))
			}
			cacheMobStuns[o.index] = []
		}
		else {
			if (Array.isArray(cachePlayerStuns[o.index])) {
				cachePlayerStuns[o.index].forEach(index => (ask.removeImg()(index)))
			}
			cachePlayerStuns[o.index] = []
		}

		for (var i=0; i<3; i++) {
			!function createParticle(i, p) {
				p.width = 32
				p.height = 32
				p.x = startX
				p.y = startY
				if (targetMob) cacheMobStuns[o.index].push(p.id)
				else cachePlayerStuns[o.index].push(p.id)
				var t = new TweenMax.to(p, .333, {
					delay: i * .111,
					repeat: -1,
					curviness: 1.5,
					bezier: {
						type: 'quadratic',
						autoRotate: false,
						values: bezierValues
					},
					ease: Power0.easeNone,
					onUpdate: checkRemoval,
					onUpdateParams: [p],
				})
				if (i === 1) t.progress(1/3)
				else if (i === 2) t.progress(2/3)
			}(i, ask.particle(o, { targetMob: targetMob}))
		}
		/////////////////////////////////////////////
		function checkRemoval(particle) {
			if (targetMob) {
				if (!mobs[o.index].buffFlags.stun || !mob.isAlive(o.index)) {
					ask.removeImg()(particle.id)
				}
			}
			else {
				if (!my.isStunned() || my.hp <= 0) {
					ask.removeImg()(particle.id)
				}
			}
		}
	}
}($, _, TweenMax, Power0, Power1, Power2, Power3, Power4, Circ, TimelineMax);