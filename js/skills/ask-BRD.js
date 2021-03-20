!function($, _, TweenMax, Power0, Power1, Power2, Power3, Power4, undefined) {
	ask = {
		...ask,
		bellow,
		sonicBoom,
		euphonicDirge,
		subvertedSymphony,
		crashingChords,
		battleHymn,
		militantCadence,
		consonantChain,
		litanyOfLife,
		melodyOfMana,
		righteousRhapsody,
		chromaticSonata,
	}
	///////////////////////////////////////////

	function bellow(o) {
		ask.explosion({index: o.index, key: 'burst-arcane'})
		ask.rings({index: o.index, type: 'arcane'}, {
			loops: 1,
			duration: .4,
		})
		o.endFrame = 3
		let dur = .32
		ask.explosion(o, {
			contrastStart: 1,
			brightnessStart: 2,
			// yStart: ask.centerY(o.index, false) - 350,
			sizeStart: 150,
			sizeEnd: 250,
			alpha: 1,
			duration: dur,
			frameDuration: dur,
			ease: Power0.easeIn,
			frameEase: Power0.easeIn,
		})
	}
	function sonicBoom(o) {
		ask.explosion({index: o.index, key: 'burst-default'})
		o.endFrame = 3
		let dur = .2
		ask.rings({index: o.index, type: 'default'}, {
			loops: 4,
			interval: .05,
			duration: 1,
		})
		for (var i=0; i<2; i++) {
			!function(i) {
				delayedCall(i * dur, () => {
					let img = ask.explosion(o, {
						contrastStart: 1,
						brightnessStart: 1.5,
						// yStart: ask.centerY(o.index, false) - 350,
						sizeStart: 150,
						sizeEnd: 350,
						duration: dur,
						alpha: 1,
						frameDuration: dur,
						ease: Power0.easeIn,
						frameEase: Power0.easeIn,
					})
					ask.fadeOut(img, dur, dur * .1)
				})
			}(i)
		}
	}
	function euphonicDirge(o) {
		o.endFrame = 3
		let img = ask.explosion(o, {
			contrastStart: 1,
			brightnessStart: 2,
			sizeStart: 220,
			sizeEnd: 180,
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
			sizeStart: 128,
			sizeEnd: 128,
			xRange: 120,
			yRange: 50,
			loops: 6
		})
	}
	function subvertedSymphony(o) {
		ask.explosion({index: o.index, key: 'burst-fire'})
		o.endFrame = 3
		let img = ask.explosion(o, {
			contrastStart: 1,
			brightnessStart: 1.5,
			sizeStart: 220,
			sizeEnd: 180,
			alpha: 1,
			yStart: ask.centerHeadY(o.index),
			duration: .6,
			frameDuration: .3,
			frameEase: Power0.easeIn,
		})
		TweenMax.to(img, .3, {
			pixi: { contrast: 2, saturation: 5 },
			onComplete: () => {
				TweenMax.to(img, .3, {
					pixi: {
						contrast: 1,
						saturation: 1,
					},
					alpha: 0
				})
			}
		})
		ask.particleGroup({
			..._.clone(o),
			key: 'particle-group-fire',
		}, {
			interval: .0166,
			sizeStart: 128,
			sizeEnd: 128,
			xRange: 120,
			yRange: 50,
			loops: 8
		})
	}
	function crashingChords(o) {
		ask.explosion({index: o.index, key: 'burst-lightning'}, {duration: 1.2})
		let centerX = mob.centerX[o.index]
		let centerY = ask.centerY(o.index, true)
		o.endFrame = 3
		for (var i=0; i<40; i++) {
			let dur = _.random(.32, .6)
			!function(i) {
				delayedCall(i * .003, () => {
					let x = centerX + _.random(-120, 120)
					let y = centerY + _.random(-50, 100)
					let img = ask.explosion({
						index: o.index,
						key: 'staticStorm',
					}, {
						xStart: x,
						yStart: y,
						contrastStart: 2,
						brightnessStart: 5,
						sizeStart: 80,
						sizeEnd: 0,
						ease: Power2.easeOut,
						frameEase: Power0.easeOut,
						duration: dur,
						frameDuration: dur,
					})
					delayedCall(0, () => {
						TweenMax.set(img, {
							pixi: { hue: 200 }
						})
					})
				})
			}(i)
		}
	}
	function battleHymn(o) {
		ask.explosion({index: o.index, key: 'burst-arcane'}, {targetMob: false})
		!function() {
			let img = ask.explosion(o, {
				targetMob: false,
				duration: 2.5,
				sizeStart: 350,
				sizeEnd: 220,
			})
			TweenMax.to(img, 1, {
				delay: .5,
				pixi: { blur: 100 },
			})
		}()
		let loops = 4
		let slice = 360 / (loops + 1)
		for (var i=0; i<loops; i++) {
			!function(i) {
				let rotation = i * slice
				let img = ask.explosion({
					..._.clone(o),
					key: 'battleHymn-particles'
				}, {
					targetMob: false,
					duration: 2,
					sizeStart: 0,
					sizeEnd: 220,
					alpha: 0,
					rotationStart: rotation,
					rotation: rotation + slice
				})
				TweenMax.to(img, 1, {
					delay: .1,
					pixi: { blur: 50 },
					ease: Power3.easeIn
				})
			}(i)
		}
	}
	function militantCadence(o) {
		ask.explosion({index: o.index, key: 'burst-fire'}, {
			targetMob: false
		})
		o.endFrame = 3
		let dur = 1.2
		let img = ask.explosion(o, {
			targetMob: false,
			contrastStart: 1.5,
			brightnessStart: 3,
			sizeStart: 350,
			sizeEnd: 200,
			duration: dur,
			frameDuration: dur * .5,
			frameEase: Sine.easeOut,
		})
		delayedCall(0, () => {
			TweenMax.set(img, {
				pixi: { saturation: 5, hue: 270 }
			})
			TweenMax.to(img, dur * .5, {
				delay: dur * .5,
				pixi: { blur: 20, saturation: 1, hue: 300, combineCMF: true }
			})
		})
		ask.particleSmall({
			index: o.index,
			key: 'particle-small-fire',
		}, {
			targetMob: false,
			interval: .0016,
			loops: 15,
			sizeStart: 32,
			sizeEnd: 16,
			xRange: 60,
			yRange: 50,
		})
	}
	function consonantChain(o) {
		ask.explosion({index: o.index, key: 'burst-arcane'})
		o.endFrame = 3
		let size = mobs[o.index].clickAliveW * mobs[o.index].size
		let dur = .5
		ask.explosion(o, {
			contrastStart: 1.5,
			brightnessStart: 3,
			sizeStart: size * 1.7,
			sizeEnd: size * 1.25,
			alpha: 1,
			duration: dur,
			frameDuration: dur,
			frameEase: Sine.easeOut,
		})
	}
	function litanyOfLife(o) {
		ask.explosion({index: o.index, key: 'burst-poison'}, {
			sizeStart: 0,
			sizeEnd: 250,
			targetMob: false
		})
		ask.rings({index: o.index, type: 'poison'}, {
			loops: 1,
			yAdj: 150,
			targetMob: false,
			duration: .32,
			width: 50,
		})
		o.endFrame = 3
		let img = ask.explosion(o, {
			targetMob: false,
			contrastStart: 1.2,
			brightnessStart: 2,
			sizeStart: 350,
			sizeEnd: 220,
			duration: .4,
			alpha: 1,
			frameDuration: .32,
			frameEase: Power0.easeOut,
		})
		ask.fadeOut(img, .4, .1)
		ask.particleSmall({
			index: o.index,
			key: 'particle-small-poison',
		}, {
			targetMob: false,
			interval: .0016,
			loops: 12,
			sizeStart: 32,
			sizeEnd: 0,
			xRange: 60,
			yRange: 50,
		})
	}
	function melodyOfMana(o) {
		ask.explosion({index: o.index, key: 'burst-ice'}, {
			targetMob: false
		})
		o.endFrame = 5
		let dur = .5
		let img = ask.explosion(o, {
			targetMob: false,
			contrastStart: 1.2,
			brightnessStart: 2,
			sizeStart: 100,
			sizeEnd: 200,
			alpha: 1,
			duration: dur,
			frameDuration: dur,
			frameEase: Power0.easeOut,
		})
		delayedCall(0, () => {
			TweenMax.set(img, {
				pixi: { hue: 90 }
			})
		})
		ask.particleSmall({
			index: o.index,
			key: 'particle-small-ice',
		}, {
			targetMob: false,
			interval: .0016,
			loops: 15,
			sizeStart: 32,
			sizeEnd: 16,
			xRange: 60,
			yRange: 50,
		})
	}
	function righteousRhapsody(o) {
		for (var i=0; i<3; i++) {
			!function(i) {
				delayedCall(i * .32, () => {
					ask.explosion({index: o.index, key: 'burst-purple'})
				})
			}(i)
		}
		o.endFrame = 3
		let dur = .32 * 3
		ask.explosion(o, {
			contrastStart: 1.2,
			brightnessStart: 3,
			sizeStart: 350,
			sizeEnd: 160,
			alpha: 1,
			duration: dur,
			frameDuration: .32,
			repeat: true,
			frameEase: Power0.easeOut,
		})
		/*delayedCall(0, () => {
			TweenMax.to(img, dur, {
				startAt: { pixi: { saturation: 5, hue: 270 } },
				pixi: { saturation: 1, hue: 300, combineCMF: true }
			})
		})*/
		ask.particleSmall({
			index: o.index,
			key: 'particle-small-purple',
		}, {
			interval: .0016,
			loops: 25,
			sizeStart: 64,
			sizeEnd: 0,
			xRange: 150,
			yRange: 50,
		})
	}
	function chromaticSonata(o) {
		ask.explosion({index: o.index, key: 'burst-default'}, {targetMob: false, duration: 1})
		for (let i=0; i<1; i++) {
			!function(i) {
				o.endFrame = 3
				let img = ask.explosion(o, {
					targetMob: false,
					contrastStart: 1,
					brightnessStart: 1.5,
					sizeStart: 300,
					sizeEnd: 250,
					repeat: true,
					duration: 2.4,
					frameDuration: .4,
					frameEase: Power0.easeIn,
				})
			}(i)
		}
	}
}($, _, TweenMax, Power0, Power1, Power2, Power3, Power4);