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