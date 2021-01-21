!function($, _, TweenMax, Power0, Power1, Power2, Power3, Power4, TimelineMax, undefined) {

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
		mobPanicStrike,
		mobMindBlitz,
	}

	///////////////////////////////////////////
	function mobMindBlitz(index) {
		ask.particleSmall({
			index: index,
			key: 'particle-small-arcane',
		}, {
			targetMob: false,
			interval: .0016,
			loops: 25,
			sizeStart: 32,
			sizeEnd: 0,
			xRange: 70,
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
		for (var i=0; i<7; i++) {
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
		for (var i=0; i<3; i++) {
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
	function mobVenomBolt(index) {
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
		for (var i=0; i<7; i++) {
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
		for (var i=0; i<3; i++) {
			!function(i) {
				delayedCall(i * .05, () => {
					ask.particleCircle({
						index: index,
						key: 'particle-circle-poison',
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
		for (var i=0; i<3; i++) {
			!function(i) {
				delayedCall(i * .05, () => {
					ask.particleCircle({
						index: index,
						key: 'particle-circle-blood',
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
		for (var i=0; i<11; i++) {
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
		for (var i=0; i<11; i++) {
			!function(i) {
				delayedCall(i * .016, () => {
					ask.particleCircle({
						index: index,
						key: 'particle-circle-arcane',
					}, {
						targetMob: false,
						duration: .27 - (i * .015),
						ease: Power0.easeOut,
						alpha: 0,
						sizeEnd: 200 + (i * 10),
					})
				})
			}(i)
		}
	}
	function mobForceOfGlory(index) {
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
		for (var i=0; i<7; i++) {
			!function(i) {
				delayedCall(i * .016, () => {
					if (i === 0) ask.sunburst({index: index}, {targetMob: false})
					ask.particleCircle({
						index: index,
						key: 'particle-circle-arcane',
					}, {
						targetMob: false,
						duration: .27 + (i * .015),
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
		ask.moonburst({index: index}, {targetMob: false})
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
		ask.particleCircle({
			index: index,
			key: 'particle-circle-lightning',
		}, {
			targetMob: false,
			duration: .33,
			ease: Power1.easeOut,
			alpha: 0,
			sizeEnd: 300,
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
		for (var i=0; i<7; i++) {
			!function(i) {
				if (i % 3 === 0) ask.sunburst({index: index}, {targetMob: false})
				delayedCall(i * .033, () => {
					ask.particleCircle({
						index: index,
						key: 'particle-circle-fire',
					}, {
						targetMob: false,
						duration: .27 - (i * .015),
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
	function mobBellow(index) {
		ask.moonburst({index: index}, {targetMob: false})
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
		for (var i=0; i<3; i++) {
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
	function mobShockNova(index) {
		ask.moonburst({
			index: index,
		}, {
			targetMob: false,
		})
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
		ask.starburst({index: index}, {targetMob: false})
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
		for (var i=0; i<3; i++) {
			!function(i) {
				delayedCall(i * .05, () => {
					ask.particleCircle({
						index: index,
						key: 'particle-circle-poison',
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
	function mobBackstab(index) {
		ask.starburst({
			index: index,
		}, {
			targetMob: false,
		})
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
	function mobDragonPunch(index) {
		ask.sunburst({
			index: index,
		}, {
			targetMob: false,
		})
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
		for (var i=0; i<3; i++) {
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
		ask.starburst({
			index: index,
		}, {
			targetMob: false,
		})
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
	function mobCraneKick(index) {
		ask.moonburst({
			index: index,
		}, {
			targetMob: false,
		})
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
		ask.particleCircle({
			index: index,
			key: 'cast-swirl-blood',
		}, {
			targetMob: false,
			duration: .7,
			ease: Power2.easeOut,
			alpha: 1,
			sizeStart: 512,
			sizeEnd: 350,
		})
		for (var i=0; i<9; i++) {
			!function(i) {
				delayedCall(i * .033, () => {
					ask.particleCircle({
						index: index,
						key: 'particle-circle-blood',
					}, {
						targetMob: false,
						duration: .5,
						ease: Power2.easeOut,
						alpha: 0,
						sizeEnd: 350,
					})
				})
			}(i)
		}
	}
	function mobLayHands(index, tgt) { // tx rx
		// console.info('mobDivineGrace', index, row)
		for (var i=0; i<7; i++) {
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
		/*for (var i=0; i<5; i++) {
			!function(i) {
				delayedCall(i * .1, () => {
					ask.particleCircle({
						index: tgt,
						key: 'particle-circle-arcane',
					}, {
						duration: .7,
						ease: Power1.easeInOut,
						saturationStart: 2,
						brightnessStart: 5,
						saturationEnd: 1,
						brightnessEnd: 0,
						alpha: 0,
						sizeStart: mobs[tgt].width * .5,
						sizeEnd: 0,
					})
				})
			}(i)
		}*/
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
	/*
	ask.particleSmall({
		..._.clone(o),
		key: 'particle-small-arcane',
	}, {
		interval: .001,
		loops: 25,
		sizeStart: 32,
		sizeEnd: 8,
		xRange: 150,
		yRange: 50,
	})

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
	 */
}($, _, TweenMax, Power0, Power1, Power2, Power3, Power4, TimelineMax);