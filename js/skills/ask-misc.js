!function($, _, TweenMax, Power0, Power1, Power2, Power3, Power4, TimelineMax, undefined) {
	ask = {
		...ask,
		mobStun,
		mobDivineJudgment,
	}

	const stunRangeX = 60
	const stunRXH = stunRangeX * .5
	const stunRangeY = 20
	const stunRYH = stunRangeY * .5
	const cacheMobStuns = []
	const cachePlayerStuns = []

	///////////////////////////////////////////
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
						rotation: 0,
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
}($, _, TweenMax, Power0, Power1, Power2, Power3, Power4, TimelineMax);