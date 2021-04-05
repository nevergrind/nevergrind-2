!function($, _, TweenMax, Power0, Power1, Power2, Power3, Power4, undefined) {
	ask = {
		...ask,
		frostRift,
		poisonNova,
		scourge,
		poisonBolt,
		vampiricGaze,
		glacialShard,
		affliction,
		devouringSwarm,
		rejuvinate,
		mysticalGlow,
		vampiricAllure,
		borealTalisman,
	}
	///////////////////////////////////////////

	function frostRift(o) {
		ask.explosion({index: o.index, key: 'burst-ice'}, {
			sizeEnd: 250
		})
		ask.explosion({index: o.index, key: 'frostRift2'}, {
			contrastStart: 1.5,
			brightnessStart: 2,
			sizeStart: 0,
			sizeEnd: 250,
			duration: .4,
		})
		ask.explosion({index: o.index, key: 'frostRift1'}, {
			contrastStart: 1.5,
			brightnessStart: 2,
			rotation: 90,
			sizeStart: 0,
			sizeEnd: 200,
			duration: .5,
		})
		ask.explosion(o, {
			contrastStart: 1.5,
			brightnessStart: 2,
			rotation: -90,
			sizeStart: 0,
			sizeEnd: 125,
			duration: .6,
		})
	}
	function poisonNova(o) {
		ask.rings({index: o.index, type: 'poison'}, {
			loops: 3,
			yStart: ask.bottomY(o.index),
			duration: .32,
		})
		o.endFrame = 2
		let dur = .4
		let img = ask.groundExplosion(o, {
			contrastStart: 1.5,
			brightnessStart: 2.5,
			sizeStart: 50,
			sizeEnd: 300,
			anchorY: .508,
			yoyo: false,
			alpha: 1,
			duration: dur,
			ease: Power2.easeOut,
			frameDuration: dur,
			frameEase: Power0.easeIn,
		})
		ask.fadeOut(img, dur, dur * .85)
	}
	function scourge(o) {
		ask.explosion({index: o.index, key: 'burst-blood'}, {
			sizeEnd: 280
		})
		ask.slash({index: o.index, key: 'scourge'}, {
			duration: .25,
			size: 250,
		})
		let top = ask.slash({index: o.index, key: 'scourge'}, {
			duration: .25,
			size: 250,
		})
		top.y -= 40
		let bot = ask.slash({index: o.index, key: 'scourge'}, {
			duration: .25,
			size: 250,
		})
		bot.y += 40
		ask.particleGroup({
			index: o.index,
			key: 'particle-group-blood',
		}, {
			interval: .0166,
			sizeStart: 64,
			sizeEnd: 64,
			xRange: 90,
			yRange: 0,
			loops: 6
		})
	}
	function poisonBolt(o) {
		ask.explosion({index: o.index, key: 'burst-poison'}, {
			sizeEnd: 280
		})
		ask.explosion({index: o.index, key: 'poisonBolt2'}, {
			contrastStart: 1.5,
			brightnessStart: 2,
			rotation: -180,
			sizeStart: 0,
			sizeEnd: 250,
			duration: .5,
		})
		ask.explosion({index: o.index, key: 'poisonBolt1'}, {
			contrastStart: 1.5,
			brightnessStart: 2,
			rotation: 180,
			sizeStart: 0,
			sizeEnd: 225,
			duration: .65,
		})
		ask.explosion(o, {
			contrastStart: 1.5,
			brightnessStart: 2,
			sizeStart: 0,
			sizeEnd: 220,
			duration: .8,
		})
	}
	function vampiricGaze(o) {
		// ask.explosion({index: o.index, key: 'burst-arcane'})
		/*!function(o) {
			o.endFrame = 2
			let img = ask.explosion(o, {
				contrastStart: 1,
				brightnessStart: 2,
				sizeStart: 150,
				sizeEnd: 250,
				yStart: ask.centerY(o.index, true) - 100,
				alpha: 1,
				duration: 1,
				frameDuration: .45,
				frameEase: Power0.easeIn,
			})
			delayedCall(0, () => {
				TweenMax.to(img, .5, {
					pixi: { scale: 0 },
					y: ask.centerY(o.index, true),
					delay: .5,
					ease: Power1.easeInOut
				})
			})
			ask.fadeOut(img, 1.5, .1)
		}(_.clone(o))*/

		!function(o) {
			for (var i=0; i<5; i++) {
				delayedCall(i*.1, () => {
					ask.explosion({
						index: o.index,
						key: 'vampiricGaze-orb'
					}, {
						contrastStart: 1.5,
						brightnessStart: 2,
						sizeStart: 250,
						sizeEnd: 0,
						rotation: i % 2 === 0 ? 180 : -180,
						duration: 1.5,
					})
				})
			}
		}(o)

		ask.particleGroup({
			index: o.index,
			key: 'particle-group-purple',
		}, {
			interval: .0166,
			sizeStart: 64,
			sizeEnd: 64,
			xRange: 64,
			yRange: 50,
			loops: 6
		})
	}
	function glacialShard(o) {
		ask.explosion({index: o.index, key: 'burst-ice'})
		ask.explosion({index: o.index, key: 'glacialShard3'}, {
			contrastStart: 1.5,
			brightnessStart: 2,
			sizeStart: 500,
			sizeEnd: 200,
			duration: 1.2,
		})
		ask.explosion({index: o.index, key: 'glacialShard2'}, {
			contrastStart: 1.5,
			brightnessStart: 2,
			sizeStart: 400,
			sizeEnd: 300,
			duration: 1.2,
		})
		ask.explosion({index: o.index, key: 'glacialShard1'}, {
			contrastStart: 1.5,
			brightnessStart: 2,
			sizeStart: 0,
			sizeEnd: 350,
			duration: 1,
		})
		ask.explosion(o, {
			contrastStart: 1.5,
			brightnessStart: 2,
			sizeStart: 0,
			sizeEnd: 200,
			duration: .8,
		})
		ask.rings({index: o.index, type: 'ice'}, {
			loops: 3,
			duration: 1,
		})
	}
	function affliction(o) {
		ask.explosion({index: o.index, key: 'burst-poison'}, {
			duration: 1.2,
			sizeEnd: 280
		})
		ask.particleGroup({
			index: o.index,
			key: 'particle-group-poison',
		}, {
			duration: 1,
			interval: .1,
			sizeStart: 64,
			sizeEnd: 64,
			xRange: 100,
			yRange: 0,
			loops: 7,
		})
		let centerY = ask.centerY(o.index, true)
		let centerX = mob.centerX[o.index]
		o.endFrame = 3
		let dur = .25
		for (var i=0; i<30; i++) {
			!function(i) {
				delayedCall(i * .01, () => {
					let x = centerX + _.random(-125, 125)
					let y = centerY + _.random(-25, 75)
					let img = ask.explosion(o, {
						xStart: x,
						yStart: y,
						yEnd: y - 20,
						contrastStart: 1.2,
						brightnessStart: 2.5,
						sizeStart: 120,
						sizeEnd: 80,
						alpha: 1,
						duration: dur,
						frameDuration: dur,
					})
					ask.fadeOut(img, dur, dur * .5)
				})
			}(i)
		}
	}
	function devouringSwarm(o) {
		ask.explosion({index: o.index, key: 'burst-blood'})
		let centerX = mob.centerX[o.index]
		let centerY = ask.centerY(o.index, true)
		for (var i=0; i<40; i++) {
			let dur = _.random(.4, .8)
			!function(i) {
				delayedCall(i * .01, () => {
					let x = centerX + _.random(-80, 80)
					let y = centerY + _.random(-40, 80)
					let img = ask.explosion(o, {
						xStart: x,
						yStart: y,
						contrastStart: 2,
						brightnessStart: 5,
						sizeStart: 250,
						sizeEnd: 100,
						ease: Power2.easeOut,
						frameEase: Power0.easeOut,
						duration: dur,
						frameDuration: dur,
					})
					TweenMax.to(img, dur, {
						xEnd: centerX,
						yEnd: centerY,
						ease: Power2.easeInOut,
					})
				})
			}(i)
		}
	}
	function rejuvinate(o) {
			ask.explosion({index: o.index, key: 'rejuvinate2'}, {
			targetMob: false,
			contrastStart: 1.5,
			brightnessStart: 3,
			sizeStart: 220,
			sizeEnd: 300,
			duration: .7,
			ease: Power2.easeOut,
		})
		delayedCall(0, () => {
			ask.explosion({index: o.index, key: 'rejuvinate1'}, {
				targetMob: false,
				contrastStart: 1.5,
				brightnessStart: 2,
				sizeStart: 50,
				sizeEnd: 250,
				duration: .6,
				ease: Power2.easeOut,
			})
		})
		delayedCall(.15, () => {
			ask.explosion({index: o.index, key: 'rejuvinate'}, {
				targetMob: false,
				contrastStart: 2,
				brightnessStart: 4,
				sizeStart: 64,
				sizeEnd: 128,
				duration: 1,
				ease: Power2.easeOut,
			})
		})
		delayedCall(.2, () => {
			ask.explosion({index: o.index, key: 'mysticalGlow-p2'}, {
				targetMob: false,
				contrastStart: 1.5,
				brightnessStart: 3,
				contrastEnd: 0,
				brightnessEnd: 0,
				sizeStart: 240,
				sizeEnd: 300,
				duration: .7,
				ease: Power3.easeOut,
			})
		})
	}
	function mysticalGlow(o) {
		ask.explosion(o, {
			targetMob: false,
			contrastStart: 1.5,
			brightnessStart: 3,
			sizeStart: 224,
			sizeEnd: 256,
			duration: .7,
			ease: Power2.easeOut,
		})
		delayedCall(.1, () => {
			ask.explosion({index: o.index, key: 'mysticalGlow-cross'}, {
				targetMob: false,
				contrastStart: 1.5,
				brightnessStart: 3,
				sizeStart: 200,
				sizeEnd: 300,
				duration: .7,
				ease: Power2.easeOut,
			})
		})
		delayedCall(.2, () => {
			ask.explosion({index: o.index, key: 'mysticalGlow-p1'}, {
				targetMob: false,
				contrastStart: 2,
				brightnessStart: 4,
				sizeStart: 250,
				sizeEnd: 300,
				duration: 1.2,
				ease: Power2.easeOut,
			})
		})
		delayedCall(.3, () => {
			ask.explosion({index: o.index, key: 'mysticalGlow-p2'}, {
				targetMob: false,
				contrastStart: 1.5,
				brightnessStart: 3,
				contrastEnd: 0,
				brightnessEnd: 0,
				sizeStart: 250,
				sizeEnd: 300,
				duration: 1.5,
				ease: Power3.easeOut,
			})
		})
	}
	function vampiricAllure(o) {
		ask.explosion(o, {
			targetMob: false,
			contrastStart: 1.5,
			brightnessStart: 3,
			sizeStart: 224,
			sizeEnd: 256,
			duration: .7,
			ease: Power2.easeOut,
		})
		delayedCall(.1, () => {
			ask.explosion({index: o.index, key: 'vampiricAllure1'}, {
				targetMob: false,
				contrastStart: 1.5,
				brightnessStart: 3,
				sizeStart: 200,
				sizeEnd: 300,
				duration: .7,
				ease: Power2.easeOut,
			})
		})
		delayedCall(.2, () => {
			ask.explosion({index: o.index, key: 'vampiricAllure2'}, {
				targetMob: false,
				contrastStart: 2,
				brightnessStart: 4,
				sizeStart: 220,
				sizeEnd: 300,
				duration: 1.2,
				ease: Power2.easeOut,
			})
		})
		delayedCall(.3, () => {
			ask.explosion({index: o.index, key: 'vampiricAllure3'}, {
				targetMob: false,
				contrastStart: 1.5,
				brightnessStart: 3,
				contrastEnd: 0,
				brightnessEnd: 0,
				sizeStart: 220,
				sizeEnd: 300,
				duration: 1.5,
				ease: Power3.easeOut,
			})
		})
	}
	function borealTalisman(o) {
		ask.explosion({index: o.index, key: 'burst-ice'}, {targetMob: false})
		ask.explosion(o, {
			targetMob: false,
			yStart: ask.bottomY(o.index, false) - 50,
			duration: 2,
			sizeStart: 300,
			sizeEnd: 250,
		})
		delayedCall(.1, () => {
			ask.explosion({
				index: o.index,
				key: 'borealTalisman1'
			}, {
				targetMob: false,
				duration: 1.75,
				sizeStart: 300,
				sizeEnd: 200,
			})
		})
		delayedCall(.2, () => {
			ask.explosion({
				index: o.index,
				key: 'borealTalisman2'
			}, {
				targetMob: false,
				brightnessStart: 4,
				duration: 2,
				sizeStart: 300,
				sizeEnd: 250,
			})
		})
		delayedCall(.3, () => {
			ask.explosion({
				index: o.index,
				key: 'borealTalisman3'
			}, {
				targetMob: false,
				brightnessStart: 4,
				duration: 1,
				sizeStart: 300,
				sizeEnd: 300,
			})
		})
	}
}($, _, TweenMax, Power0, Power1, Power2, Power3, Power4);