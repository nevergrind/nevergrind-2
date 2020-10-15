!function($, _, TweenMax, Power0, Power1, Power2, Power3, Power4, undefined) {
	ask = {
		...ask,
		crossSlash,
		explosiveShot,
		trueshotStrike,
		spreadShot,
		bladeStorm,
		suppressingVolley,
		burningEmbers,
		shockNova,
		faerieFlame,
		fungalGrowth,
		shimmeringOrb,
		spiritOfTheHunter,
	}
	///////////////////////////////////////////

	const crossSlashWidth = 300
	function crossSlash(o) {
		const img = ask.getAskImg(o)
		battle.layer.stage.addChild(img)
		img.width = 0
		img.height = 0
		img.x = mob.centerX[o.index] + (crossSlashWidth * .5)
		img.anchor.set(1, .5)

		TweenMax.to(img, .2, {
			pixi: { width: crossSlashWidth, height: crossSlashWidth },
			ease: Power2.easeIn,
			onComplete: () => {
				img.anchor.set(0, .5)
				img.x -= crossSlashWidth
				TweenMax.to(img, .2, {
					pixi: { width: 0, height: 0 },
					ease: Power2.easeOut,
					onComplete: ask.removeImg(),
					onCompleteParams: [ img.id ]
				})
			}
		})
	}

	function explosiveShot(o) {
		ask.explosion(o, {
			duration: 1.25,
			sizeStart: 60,
			sizeEnd: 300,
			contrastStart: 2,
			brightnessStart: 2,
		})
	}

	function trueshotStrike(o) {
		ask.explosion(o, {
			duration: 1.25,
			contrastStart: 2,
			brightnessStart: 2,
		})
	}

	function spreadShot(o) {
		ask.explosion(o, {
			duration: 1.2
		})
	}

	const bladeStormSize = 200
	function bladeStorm(o) {

		for (var i=0; i<5; i++) {
			!function(i) {
				const img = ask.getAskImg(o)
				battle.layer.stage.addChild(img)
				img.width = 0
				img.height = 0
				img.anchor.set(1, 0)
				img.y += (i * 50) - 100
				img.x += bladeStormSize * .5
				img.y -= bladeStormSize * .5

				TweenMax.to(img, .15, {
					pixi: { width: bladeStormSize, height: bladeStormSize },
					ease: Power2.easeIn,
					onComplete: () => {
						img.anchor.set(0, 1)
						img.x -= bladeStormSize
						img.y += bladeStormSize
						TweenMax.to(img, .15, {
							pixi: { width: 0, height: 0 },
							ease: Power2.easeOut,
							onComplete: ask.removeImg(),
							onCompleteParams: [ img.id ]
						})
					}
				})
			}(i)
		}
	}

	function suppressingVolley(o) {
		ask.explosion(o, {
			duration: 1.2
		})
	}

	function burningEmbers(o) {
		// add particles explosion
		ask.explosion(o, {
			duration: 1.5,
			sizeEnd: 400,
		})
	}

	function shockNova(o) {
		// nova
		ask.explosion(o, {
			duration: 1.2
		})
	}
	function faerieFlame(o) {
		// explosion + particles fall
		ask.explosion(o, {
			duration: 1.2
		})
	}
	function fungalGrowth(o) {
		// flash of light animates down over target
		ask.explosion(o, {
			targetMob: false,
			duration: 5,
			sizeEnd: 500,
		})
	}
	function shimmeringOrb(o) {
		// buff received - filter on icon?
		ask.explosion(o, {
			targetMob: false,
			duration: 5,
			sizeEnd: 500,
		})
	}
	function spiritOfTheHunter(o) {
		// buff received - filter on icon?
		ask.explosion(o, {
			targetMob: false,
			duration: 5,
			sizeEnd: 500,
		})
	}
}($, _, TweenMax, Power0, Power1, Power2, Power3, Power4);