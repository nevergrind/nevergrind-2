!function($, _, TweenMax, Power0, Power1, Power2, Power3, Power4, undefined) {
	ask = {
		...ask,
		shadowBreak,
		deathStrike,
		deathStrikeHeal,
		crescentCleave,
		doomThrust,
		astralBlade,
		ravagingPlague,
		decayingDoom,
		bloodTerror,
		lifeTap,
		lifeTapHeal,
		vampiricFeast,
		vampiricFeastHeal,
		sanguineHarvest,
		sanguineHarvestProc,
		sanguineHarvestHeal,
		markOfRemphan,
	}
	///////////////////////////////////////////

	function shadowBreak(o) {
		ask.explosion({index: o.index, key: 'burst-purple'})
		o.endFrame = 3
		ask.explosion(o, {
			contrastStart: 1.3,
			brightnessStart: 2,
			sizeStart: 250,
			sizeEnd: 300,
			alpha: 1,
			duration: .28,
			frameDuration: .28,
			frameEase: Power0.easeIn,
		})
	}
	function deathStrike(o) {
		ask.slash({index: o.index, key: 'deathStrike-blood'}, {
			duration: .25,
			size: 250,
		})
		ask.slash(o, {
			duration: .2,
			size: 250,
		})
	}
	function deathStrikeHeal(o) {
		ask.explosion({index: o.index, key: 'orb-blood'}, {
			targetMob: false,
			duration: .5,
			sizeStart: 300,
			sizeEnd: 0,
		})
	}
	function crescentCleave(o) {
		ask.explosion(o, {
			duration: .25,
			alpha: .3,
			rotation: 360,
			sizeStart: 220,
			sizeEnd: 250,
			ease: Power0.easeIn,
		})
		ask.bloodDrop(o.index, 16)
	}
	function doomThrust(o) {
		ask.explosion({index: o.index, key: 'orb-purple'}, {
			contrastStart: 1.2,
			brightnessStart: 2,
			sizeStart: 333,
			sizeEnd: 0,
			duration: 1,
		})
		delayedCall(.15, () => {
			ask.starburst(o)
		})
		o.endFrame = 4
		let dur = .35
		ask.explosion(o, {
			contrastStart: 1.5,
			brightnessStart: 3,
			contrastEnd: 1,
			brightnessEnd: .25,
			alpha: 1,
			sizeStart: 220,
			sizeEnd: 180,
			duration: dur,
			frameDuration: dur,
			frameEase: Power0.easeIn,
		})
		/*ask.slash({index: o.index, key: 'doomThrust-slash1'}, {
			duration: .25,
			size: 250,
		})*/
		/*ask.slash({index: o.index, key: 'doomThrust-slash2'}, {
			duration: .25,
			size: 250,
		})*/
	}
	function astralBlade(o) {
		ask.explosion(o, {
			duration: 1.2
		})
	}
	function ravagingPlague(o) {
		o.endFrame = 3
		let img = ask.explosion(o, {
			contrastStart: 1,
			brightnessStart: 2,
			sizeStart: 220,
			sizeEnd: 150,
			yStart: ask.centerHeadY(o.index),
			duration: 1.5,
			repeat: true,
			frameDuration: .1,
			frameEase: Power0.easeIn,
		})
		ask.fadeOut(img, 1.5, .1)
		ask.particleGroup({
			..._.clone(o),
			key: 'particle-group-poison',
		}, {
			interval: .0166,
			sizeStart: 64,
			sizeEnd: 64,
			xRange: 120,
			yRange: 50,
			loops: 8
		})
	}
	function decayingDoom(o) {
		ask.explosion({index: o.index, key: 'burst-purple'})
		const centerX = mob.centerX[o.index]
		const centerY = ask.centerY(o.index, true)
		const size = 100
		for (var i=0; i<11; i++) {
			(i => {
				delayedCall(i * .05, () => {
					let xStart = centerX + _.random(-size, size)
					let yStart = centerY + _.random(-size, size)
					let dur = _.random(.3, .45)
					let orb = ask.explosion({index: o.index, key: 'orb-purple'}, {
						contrastStart: 1.5,
						brightnessStart: 3,
						sizeStart: 80,
						sizeEnd: 60,
						duration: dur * 1.5,
						xStart: xStart,
						yStart: yStart,
					})
					let img = ask.explosion({index: o.index, key: 'decayingDoom1'}, {
						contrastStart: 1.2,
						brightnessStart: 2,
						brightnessEnd: 0,
						xStart: xStart,
						yStart: yStart,
						sizeStart: 80,
						sizeEnd: 60,
						alpha: .2,
						duration: dur,
						frameDuration: dur,
						frameEase: Power0.easeIn,
					})
					TweenMax.to([orb, img], dur, {
						y: '-=' + 30,
					})
				})
			})(i)
		}
		ask.particleGroup({
			index: o.index,
			key: 'particle-group-purple',
		}, {
			duration: .4,
			interval: .05,
			sizeStart: 96,
			sizeEnd: 64,
			xRange: 96,
			yRange: 0,
			loops: 5,
		})
	}
	function bloodTerror(o) {
		ask.particleGroup({
			index: o.index,
			key: 'particle-group-blood',
		}, {
			duration: .4,
			interval: .05,
			sizeStart: 64,
			sizeEnd: 64,
			xRange: 96,
			yRange: 0,
			loops: 5,
		})
		ask.explosion({index: o.index, key: 'burst-blood'})
		const centerX = mob.centerX[o.index]
		const centerY = ask.centerY(o.index, true)
		o.endFrame = 3
		for (var i=0; i<6; i++) {
			(i => {
				delayedCall(i * .05, () => {
					let xStart = centerX + _.random(-80, 80)
					let yStart = centerY + _.random(-80, 80)
					ask.explosion(o, {
						contrastStart: 1,
						brightnessStart: 2,
						brightnessEnd: 0,
						xStart: xStart,
						yStart: yStart,
						sizeStart: 100,
						sizeEnd: 150,
						alpha: 1,
						duration: .32,
						frameDuration: .32,
						frameEase: Power0.easeIn,
					})
				})
			})(i)
		}
	}
	function lifeTap(o) {
		ask.explosion({index: o.index, key: 'burst-purple'})
		ask.explosion(o, {
			contrastStart: 1.5,
			brightnessStart: 4,
			sizeStart: 250,
			sizeEnd: 350,
			rotation: 720,
			duration: .666,
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
							xEnd: dungeon.centerX[0],
							yEnd: ask.centerY(0, false),
						})
					},
				})
			}(i)
		}
	}
	function lifeTapHeal(o) {
		ask.explosion({index: o.index, key: 'burst-poison'}, {
			targetMob: false,
		})
	}
	function vampiricFeast(o) {
		ask.explosion({index: o.index, key: 'burst-purple'})
		o.endFrame = 2
		let img = ask.explosion(o, {
			contrastStart: 1.2,
			brightnessStart: 2,
			brightnessEnd: .33,
			sizeStart: 250,
			sizeEnd: 200,
			alpha: 1,
			duration: .5,
			frameDuration: .25,
		})
		ask.fadeOut(img, .5, .25)
		for (var i=0; i<3; i++) {
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
							xEnd: dungeon.centerX[0],
							yEnd: ask.centerY(0, false),
						})
					},
				})
			}(i)
		}
	}
	function vampiricFeastHeal(o) {
		ask.explosion({index: o.index, key: 'orb-purple'}, {
			targetMob: false,
		})
	}
	function sanguineHarvest(o) {
		ask.explosion(o, {
			targetMob: false,
			duration: 1.2
		})
	}
	function sanguineHarvestProc(o) {
		ask.explosion(o, {
			duration: 1.2
		})
	}
	function sanguineHarvestHeal(o) {
		ask.explosion(o, {
			targetMob: false,
			duration: 1.2
		})
	}
	function markOfRemphan(o) {
		ask.explosion(o, {
			duration: 1.2
		})
	}
}($, _, TweenMax, Power0, Power1, Power2, Power3, Power4);