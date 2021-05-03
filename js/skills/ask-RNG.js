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

	function crossSlash(o) {
		ask.slash(o, {
			duration: .2,
			size: 250,
		})
		delayedCall(.25, () => {
			ask.starburst(_.clone(o))
		})
		audio.playSound('slice', 'combat')
	}

	function explosiveShot(o) {
		ask.sunburst({index: o.index}, {
			duration: .8,
			sizeEnd: 400
		})
		o.endFrame = 1
		ask.explosion(o, {
			contrastStart: 2,
			brightnessStart: 2,
			sizeStart: 0,
			sizeEnd: 325,
			duration: .8,
			frameDuration: .4,
			frameEase: Power2.easeInOut,
		})
		audio.playSound('fire-' + _.random(1, 3), 'spells')
	}

	function trueshotStrike(o) {
		ask.explosion({index: o.index, key: 'burst-default'})
		ask.explosion({index: o.index, key: 'trueshotStrike'}, {
			contrastStart: 1.2,
			brightnessStart: 3,
			sizeStart: 100,
			sizeEnd: 400,
			duration: .8,
			ease: Power2.easeOut,
			zIndexAdj: 1,
		})
		ask.explosion({index: o.index, key: 'trueshotStrike1'}, {
			contrastStart: 2,
			brightnessStart: 5,
			sizeStart: 100,
			sizeEnd: 400,
			duration: .4,
			ease: Power2.easeOut,
		})
		ask.moonburst(o, {
			duration: 1,
			sizeEnd: 350
		})
		audio.playSound('arrow-impact', 'combat')
		audio.playSound('hit-5', 'combat')
	}

	function spreadShot(o) {
		/*o.endFrame = 2
		ask.groundExplosion(o, {
			yStart: ask.bottomY(o.index, true) + 25,
			contrastStart: 1.2,
			brightnessStart: 2,
			sizeStart: 150,
			sizeEnd: 260,
			duration: .6,
			anchorY: .85,
			frameDuration: .3,
			yoyo: false,
			alpha: 0,
			frameEase: Power0.easeOut,
			ease: Power2.easeOut,
		})*/
		let centerY = ask.centerY(o.index, true)
		let centerX = mob.centerX[o.index]
		/*let width = mobs[o.index].clickAliveW * .5
		let yTop = mobs[o.index].clickAliveH - mobs[o.index].imgCy
		let yBottom = mobs[o.index].imgCy*/
		for (var i=0; i<12; i++) {
			!function(i) {
					/*let xStart = centerX + _.random(-width, width)
					let yStart = centerY + _.random(-yTop, yBottom)*/
					let xStart = centerX + _.random(-80, 80)
					let yStart = centerY + _.random(-80, 80)
					delayedCall(i * .015, () => {
						ask.explosion({index: o.index, key: 'burst-default'}, {
							contrastStart: 1.2,
							brightnessStart: 2,
							sizeStart: 0,
							sizeEnd: 80,
							xStart: xStart,
							yStart: yStart,
							duration: .5,
							ease: Power2.easeOut,
						})
					})
			}(i)
		}
		ask.moonburst(o)
		ask.particleCircle({
			index: o.index,
			key: 'particle-circle-default',
		}, {
			duration: .3,
			ease: Power0.easeOut,
			alpha: 0,
			rotation: 0,
			sizeEnd: 200,
		})
		audio.playSound('arrow-' + _.random(1, 3), 'combat')
	}

	function bladeStorm(o) {
		for (var i=0; i<5; i++) {
			!function(i) {
				delayedCall(i * .025, () => {
					ask.slash(o, {
						duration: .16,
						size: 200,
						yAdjust: (i * 50) - 100
					})
					if (i % 2 === 0) {
						audio.playSound('hit-' + (i + 1), 'combat')
					}
				})
			}(i)
		}
	}

	function suppressingVolley(o) {
		let centerY = ask.centerY(o.index, true)
		let centerX = mob.centerX[o.index]
		for (var i=0; i<15; i++) {
			!function(i) {
					let xStart = centerX + _.random(-60, 60)
					let yStart = centerY + _.random(-60, 60)
					delayedCall(i * .015, () => {
						ask.explosion({index: o.index, key: 'burst-purple'}, {
							contrastStart: 1.2,
							brightnessStart: 2,
							sizeStart: 0,
							sizeEnd: 100,
							xStart: xStart,
							yStart: yStart,
							duration: .6,
							ease: Power2.easeOut,
						})
					})
			}(i)
		}
		/*o.endFrame = 2
		ask.groundExplosion(o, {
			yStart: ask.bottomY(o.index, true) + 25,
			contrastStart: 2,
			brightnessStart: 4,
			sizeStart: 25,
			sizeEnd: 312,
			duration: .5,
			frameDuration: .5,
			anchorY: .85,
			yoyo: false,
			alpha: 0,
			frameEase: Power2.easeIn,
			ease: Power3.easeOut,
		})*/
		delayedCall(.1, () => {
			ask.moonburst(o)
		})
		ask.particleCircle({
			index: o.index,
			key: 'particle-circle-purple',
		}, {
			duration: .4,
			ease: Power2.easeOut,
			alpha: 0,
			sizeEnd: 300,
		})
		ask.particleSmall({
			index: o.index,
			key: 'particle-small-purple',
		}, {
			interval: .016,
			loops: _.random(4, 7),
			sizeStart: 32,
			sizeEnd: 4,
			xRange: 150,
			yRange: 50,
		})
		audio.playSound('arrow-impact', 'combat')
		audio.playSound('hit-3', 'combat')
	}

	function burningEmbers(o) {
		// add particles explosion
		o.endFrame = 2
		ask.explosion(o, {
			contrastStart: 4,
			brightnessStart: 12,
			duration: 1,
			frameDuration: .33,
			frameEase: Power2.easeInOut,
			sizeStart: 0,
			sizeEnd: 500,
			ease: Power4.easeOut,
		})
		ask.explosion(o, {
			contrastStart: 3,
			brightnessStart: 6,
			duration: 1,
			frameDuration: .33,
			frameEase: Power2.easeInOut,
			sizeStart: 0,
			sizeEnd: 400,
			ease: Power4.easeOut,
		})
		ask.explosion(o, {
			contrastStart: 2,
			brightnessStart: 4,
			duration: 1,
			frameDuration: .33,
			frameEase: Power2.easeInOut,
			sizeStart: 0,
			sizeEnd: 250,
			ease: Power4.easeOut,
		})
		ask.particleSmall({
			index: o.index,
			key: 'particle-small-fire',
		}, {
			interval: .001,
			loops: 25,
			sizeStart: 32,
			sizeEnd: 8,
			xRange: 200,
			yRange: 50,
		})
	}

	function shockNova(o) {
		// nova
		o.endFrame = 3
		ask.explosion(o, {
			yStart: ask.bottomY(o.index, true) - 100,
			contrastStart: 2,
			brightnessStart: 4,
			duration: 1,
			frameDuration: .25,
			frameEase: Power0.easeOut,
			sizeStart: 200,
			sizeEnd: 512,
			ease: Power3.easeOut,
		})
		ask.particleSmall({
			index: o.index,
			key: 'particle-small-lightning',
		}, {
			interval: .016,
			loops: 5,
			sizeStart: 32,
			sizeEnd: 8,
			xRange: 150,
			yRange: 50,
		})
	}
	function faerieFlame(o) {
		ask.particleGroup({
			index: o.index,
			key: 'particle-group-fire',
		}, {
			interval: .0166,
			sizeStart: 256,
			sizeEnd: 256,
			xRange: 0,
			yRange: 0,
			loops: 1
		})
		ask.particleSmall({
			index: o.index,
			key: 'particle-small-fire',
		}, {
			interval: .001,
			loops: 25,
			sizeStart: 32,
			sizeEnd: 8,
			xRange: 150,
			yRange: 50,
		})
	}
	function fungalGrowth(o) {
		// flash of light animates down over target
		delayedCall(.3, () => {
			ask.particleGroup({
				index: o.index,
				key: 'particle-group-arcane',
			}, {
				targetMob: false,
				duration: .4,
				interval: .1,
				sizeStart: 192,
				sizeEnd: 128,
				xRange: 50,
				yRange: 0,
				loops: 3,
			})
		})
		o.endFrame = 2
		ask.explosion(o, {
			targetMob: false,
			contrastStart: 1.5,
			brightnessStart: 2,
			duration: 1,
			frameDuration: 1,
			frameEase: Power1.easeOut,
			rotation: 180,
			sizeStart: 250,
			sizeEnd: 200,
			ease: Power0.easeOut,
		})
		ask.explosion(o, {
			targetMob: false,
			contrastStart: 1.5,
			brightnessStart: 2,
			duration: 1,
			frameDuration: 1,
			frameEase: Power1.easeOut,
			rotation: -180,
			sizeStart: 250,
			sizeEnd: 200,
			ease: Power0.easeOut,
		})
		ask.explosion(o, {
			targetMob: false,
			contrastStart: 2,
			brightnessStart: 4,
			duration: 1,
			frameDuration: 1,
			frameEase: Power1.easeOut,
			rotation: -90,
			sizeStart: 150,
			sizeEnd: 100,
			ease: Power0.easeOut,
		})
		ask.explosion(o, {
			targetMob: false,
			contrastStart: 2,
			brightnessStart: 4,
			duration: 1,
			frameDuration: 1,
			frameEase: Power1.easeOut,
			rotation: -90,
			sizeStart: 150,
			sizeEnd: 100,
			ease: Power0.easeOut,
		})
	}
	function shimmeringOrb(o) {
		// buff received - filter on icon?
		ask.explosion(o, {
			targetMob: false,
			contrastStart: 3,
			brightnessStart: 3,
			duration: 1.5,
			rotation: 135,
			sizeStart: 200,
			sizeEnd: 300,
			startAlpha: .6,
			alpha: 0,
			ease: Power2.easeOut,
		})
		ask.explosion(o, {
			targetMob: false,
			contrastStart: 3,
			brightnessStart: 3,
			duration: 1.5,
			rotation: -135,
			sizeStart: 200,
			sizeEnd: 300,
			startAlpha: .6,
			alpha: 0,
			ease: Power2.easeOut,
		})
	}
	function spiritOfTheHunter(o) {
		// buff received - filter on icon?
		ask.explosion(o, {
			targetMob: false,
			duration: 5,
			sizeStart: 300,
			sizeEnd: 300,
		})
		delayedCall(.25, () => {
			ask.explosion({
				index: o.index,
				key: 'spiritOfTheHunter1'
			}, {
				targetMob: false,
				duration: 4.75,
				sizeStart: 300,
				sizeEnd: 200,
			})
		})
		delayedCall(.5, () => {
			ask.explosion({
				index: o.index,
				key: 'spiritOfTheHunter2'
			}, {
				targetMob: false,
				brightnessStart: 12,
				duration: 4,
				sizeStart: 300,
				sizeEnd: 200,
			})
		})
	}
}($, _, TweenMax, Power0, Power1, Power2, Power3, Power4);