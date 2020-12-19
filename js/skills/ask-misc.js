!function($, _, TweenMax, Power0, Power1, Power2, Power3, Power4, TimelineMax, undefined) {
	ask = {
		...ask,
		mobStun,
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
	}

	const stunRangeX = 60
	const stunRXH = stunRangeX * .5
	const stunRangeY = 20
	const stunRYH = stunRangeY * .5
	const cacheMobStuns = []
	const cachePlayerStuns = []

	///////////////////////////////////////////
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
						duration: .4,
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
			duration: .3,
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

		// remove cached IDs and reset array
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
			!function createParticle(i, p, values) {
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
						values: values
					},
					ease: Power0.easeNone,
					onUpdate: checkRemoval,
					onUpdateParams: [p],
				})
				if (i === 1) t.progress(1/3)
				else if (i === 2) t.progress(2/3)
			}(i, ask.particle(o, { targetMob: targetMob}), bezierValues)
		}
		/////////////////////////////////////////////
		function checkRemoval(particle) {
			if (targetMob) {
				if (!mobs[o.index].buffFlags.stun || !mob.isAlive(o.index)) {
					ask.removeImg()(particle.id)
				}
			}
			else {
				if (!my.buffFlags.slam || my.hp <= 0) {
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