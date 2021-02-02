!function($, _, TweenMax, Power0, Power1, Power2, Power3, Power4, undefined) {
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
			yStart: ask.shadowY(o.index, true) + 65,
			sizeStart: 250,
			sizeEnd: 250,
			alpha: 1,
			repeat: true,
			duration: .5,
			frameDuration: .2,
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
		ask.explosion(o, {
			duration: 1.2
		})
	}
	function staticStorm(o) {
		ask.explosion(o, {
			duration: 1.2
		})
	}
	function fireWall(o) {
		ask.explosion(o, {
			duration: 1.2
		})
	}
	function glacialSpike(o) {
		ask.explosion(o, {
			duration: 1.2
		})
	}
	function primordialSludge(o) {
		ask.explosion(o, {
			duration: 1.2
		})
	}
	function arclight(o) {
		ask.explosion(o, {
			duration: 1.2
		})
	}
	function primevalWithering(o) {
		ask.explosion(o, {
			duration: 1.2
		})
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
}($, _, TweenMax, Power0, Power1, Power2, Power3, Power4);