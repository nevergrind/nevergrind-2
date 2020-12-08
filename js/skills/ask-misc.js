!function($, _, TweenMax, Power0, Power1, Power2, Power3, Power4, TimelineMax, undefined) {
	ask = {
		...ask,
		stun,
	}
	///////////////////////////////////////////

	const stunRangeX = 60
	const stunRXH = stunRangeX * .5
	const stunRangeY = 20
	const stunRYH = stunRangeY * .5

	function stun(o, targetMob) {
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

		for (var i=0; i<3; i++) {
			!function createParticle(i, p, values) {
				p.width = 32
				p.height = 32
				TweenMax.to(p, .333, {
					delay: i * .111,
					repeat: -1,
					bezier: {
						type: 'quadratic',
						autoRotate: false,
						values: values
					},
					ease: Power0.easeNone,
					onUpdate: checkRemoval,
					onUpdateParams: [p],
				})
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