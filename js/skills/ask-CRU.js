!function($, _, TweenMax, Power0, Power1, Power2, Power3, Power4, undefined) {
	ask = {
		...ask,
		zealousSlam,
		rebuke,
		vengeance,
		consecrate,
		consecrateBuff,
		sealOfDamnation,
		holyWrath,
		divineJudgment,
		blessedHammer,
		sealOfSanctuary,
		divineGrace,
		benevolence,
		jubilee,
	}
	///////////////////////////////////////////

	function zealousSlam(o) {
		ask.explosion({index: o.index, key: 'burst-default'}, {
			sizeEnd: 350,
		})
		o.endFrame = 3
		ask.explosion(o, {
			contrastStart: 1.3,
			brightnessStart: 3,
			sizeStart: 250,
			sizeEnd: 300,
			alpha: 1,
			duration: .28,
			frameDuration: .28,
			frameEase: Power0.easeIn,
		})
	}
	function rebuke(o) {
		ask.explosion({index: o.index, key: 'burst-default'}, {
			sizeEnd: 200,
		})
		ask.explosion(o, {
			contrastStart: 2,
			brightnessStart: 3,
			sizeStart: 150,
			sizeEnd: 300,
			duration: 1,
		})
	}
	function vengeance(o) {
		const dur = .2
		ask.explosion({index: o.index, key: 'vengeance-red'}, {
			contrastStart: 1.3,
			brightnessStart: 2,
			sizeStart: 200,
			sizeEnd: 350,
			alpha: 1,
			duration: dur,
			ease: Power0.easeIn,
		})

		ask.explosion({index: o.index, key: 'vengeance-blue'}, {
			contrastStart: 1.3,
			brightnessStart: 2,
			sizeStart: 200,
			sizeEnd: 350,
			alpha: 1,
			duration: dur,
			ease: Power0.easeIn,
		})

		delayedCall(.1, () => {
			ask.explosion({index: o.index, key: 'vengeance-red1'}, {
				contrastStart: 1.3,
				brightnessStart: 2,
				sizeStart: 350,
				sizeEnd: 500,
				alpha: 1,
				duration: dur,
				ease: Power0.easeIn,
			})

			ask.explosion({index: o.index, key: 'vengeance-blue1'}, {
				contrastStart: 1.3,
				brightnessStart: 2,
				sizeStart: 350,
				sizeEnd: 500,
				alpha: 1,
				duration: dur,
				ease: Power0.easeIn,
			})
		})

		delayedCall(.2, () => {
			ask.moonburst({index: o.index})
			ask.explosion({index: o.index, key: 'vengeance'}, {
				contrastStart: 1.2,
				brightnessStart: 2,
				sizeStart: 0,
				sizeEnd: 400,
				duration: .6,
			})
		})
	}
	function consecrate(o) {
		console.info('consecrate', o)
		ask.explosion({index: o.index, key: 'burst-arcane'}, {
			sizeEnd: 300,
		})
		const dur = .25
		o.endFrame = 1
		ask.explosion(o, {
			contrastStart: 1.3,
			brightnessStart: 3,
			sizeStart: 100,
			sizeEnd: 350,
			alpha: 1,
			rotationStart: 0,
			rotation: 0,
			duration: dur,
			frameDuration: dur,
			frameEase: Power0.easeIn,
		})
		ask.explosion(o, {
			contrastStart: 1.3,
			brightnessStart: 3,
			sizeStart: 100,
			sizeEnd: 350,
			alpha: 1,
			rotationStart: 180,
			rotation: 180,
			duration: dur,
			frameDuration: dur,
			frameEase: Power0.easeIn,
		})
	}
	function consecrateBuff(o) {
		ask.groundExplosion({index: o.index, key: 'consecrate-buff'}, {
			targetMob: false,
			contrastStart: 1.2,
			brightnessStart: 2,
			sizeStart: 250,
			sizeEnd: 150,
			anchorY: .863,
			yoyo: false,
			alpha: 0,
			duration: 1.25,
		})
	}
	function sealOfDamnation(o) {
		ask.explosion({index: o.index, key: 'burst-arcane'}, {
			sizeEnd: 300,
		})
		const dur = .36
		o.endFrame = 2
		let img = ask.explosion(o, {
			contrastStart: 1.2,
			brightnessStart: 2,
			sizeStart: 0,
			sizeEnd: 350,
			alpha: 1,
			duration: dur,
			frameDuration: dur,
			frameEase: Power0.easeIn,
		})
		ask.fadeOut(img, dur, .05)
	}
	function holyWrath(o) {
		ask.explosion({index: o.index, key: 'burst-arcane'}, {
			sizeEnd: 300,
		})
		const dur = .4
		o.endFrame = 4
		let img = ask.explosion(o, {
			contrastStart: 1.2,
			brightnessStart: 2,
			sizeStart: 0,
			sizeEnd: 400,
			alpha: 1,
			duration: dur,
			frameDuration: dur,
			frameEase: Power0.easeIn,
		})
		ask.fadeOut(img, dur, .1)
	}
	function divineJudgment(o) {
		o.endFrame = 4
		ask.groundExplosion(o, {
			contrastStart: 1,
			brightnessStart: 1,
			sizeStart: 512,
			sizeEnd: 512,
			yoyo: false,
			anchorY: .928,
			alpha: 1,
			duration: .4,
			frameDuration: .4,
			frameEase: Power0.easeIn,
		})
		delayedCall(.2, () => {
			ask.explosion({index: o.index, key: 'burst-arcane'}, {
				sizeEnd: 450,
			})
		})
		delayedCall(.3, () => {
			ask.rings({index: o.index, type: 'arcane'}, {
				loops: 1,
				duration: .5,
			})
		})
	}
	function blessedHammer(o) {
		if (o.animate) {
			const dur = 1.5
			let img = ask.explosion(o, {
				contrastStart: 1.2,
				brightnessStart: 2,
				sizeStart: 120,
				sizeEnd: 120,
				alpha: 1,
				duration: dur,
			})
			ask.fadeOut(img, dur, .1)
			TweenMax.to(img, .25, {
				rotation: util.rotation(360),
				repeat: -1,
				ease: Power0.easeIn,
			})


			let startX = img.x
			let startY = img.y
			let intervalX = mob.centerX[2] - mob.centerX[6]
			let intervalY = mob.bottomY[5] - mob.bottomY[4]
			let bezierValues = [
				// target
				/*{ x: startX, y: startY },
				{ x: startX + intervalX, y: startY - intervalY },*/
				{ x: startX, y: startY - intervalY },
				// right mob
				{ x: startX + intervalX * 2, y: startY },
				// { x: startX + intervalX, y: startY + (intervalY * .5) },
				// bottom center
				{ x: startX, y: startY + intervalY },
				// { x: startX - intervalX, y: startY + (intervalY * .5) },
				// left mob
				{ x: startX - (intervalX * 2), y: startY },
				// { x: startX - intervalX, y: startY - intervalY },
				{ x: startX, y: startY - intervalY },
				// top center
			]
			TweenMax.to(img, dur, {
				bezier: {
					type: 'thru', // bezier thru, soft, quadratic, cubic
					curviness: 1.5,
					values: bezierValues
				},
				ease: Power0.easeIn,
			})
		}
		else {
			ask.explosion({index: o.index, key: 'burst-arcane'}, {
				sizeEnd: 250,
				duration: .5
			})
		}
	}
	function sealOfSanctuary(o) {
		ask.explosion(o, {
			targetMob: false,
			contrastStart: 1.5,
			brightnessStart: 3,
			sizeStart: 350,
			sizeEnd: 256,
			duration: 2.5,
			ease: Power2.easeOut,
		})
		for (var i=0; i<4; i++) {
			(i => {
				delayedCall(i * .1, () => {
					ask.groundExplosion({index: o.index, key: 'sealOfSanctuary-light'}, {
						targetMob: false,
						contrastStart: 1.5,
						brightnessStart: 2 + (i * .25),
						sizeStart: 100 + (i * 60),
						sizeEnd: 50 + (i * 50),
						anchorY: .89,
						yoyo: false,
						alpha: 0,
						duration: 2 - (i * .1),
					})
				})
			})(i)
		}
	}
	function divineGrace(o) {
			ask.explosion(o, {
			targetMob: false,
			contrastStart: 1.5,
			brightnessStart: 3,
			sizeStart: 220,
			sizeEnd: 300,
			duration: .7,
			ease: Power2.easeOut,
		})
		delayedCall(.2, () => {
			ask.explosion({index: o.index, key: 'mysticalGlow-p2'}, {
				targetMob: false,
				contrastStart: 1.5,
				brightnessStart: 3,
				contrastEnd: 0,
				brightnessEnd: 0,
				sizeStart: 260,
				sizeEnd: 350,
				duration: .7,
				ease: Power3.easeOut,
			})
		})
		delayedCall(.15, () => {
			ask.explosion({index: o.index, key: 'divineGrace-cross'}, {
				targetMob: false,
				contrastStart: 1,
				brightnessStart: 2,
				sizeStart: 64,
				sizeEnd: 150,
				duration: 1,
				ease: Power2.easeOut,
			})
		})
	}
	function benevolence(o) {
		ask.groundExplosion({index: o.index, key: 'sealOfSanctuary-light'}, {
			targetMob: false,
			contrastStart: 1.5,
			brightnessStart: 3,
			sizeStart: 300,
			sizeEnd: 150,
			anchorY: .89,
			yoyo: false,
			alpha: 0,
			duration: 1.5,
		})
		ask.explosion({index: o.index, key: 'mysticalGlow-p2'}, {
			targetMob: false,
			contrastStart: 1.5,
			brightnessStart: 3,
			contrastEnd: 0,
			brightnessEnd: 0,
			sizeStart: 0,
			sizeEnd: 300,
			duration: 1.5,
			ease: Power3.easeOut,
		})
		o.endFrame = 3
		ask.explosion(o, {
			targetMob: false,
			contrastStart: 2,
			brightnessStart: 4,
			sizeStart: 300,
			sizeEnd: 260,
			duration: 1,
			frameDuration: .32,
			ease: Power2.easeOut,
			frameEase: Power0.easeIn,
		})
	}
	function jubilee(o) {
		ask.explosion({index: o.index, key: 'burst-arcane'}, {
			sizeEnd: 250
		})
		let centerY = ask.centerY(o.index, true)
		let centerX = mob.centerX[o.index]
		for (var i=0; i<12; i++) {
			!function(i) {
					let xStart = centerX + _.random(-120, 120)
					let yStart = centerY + _.random(-120, 120)
					ask.explosion({index: o.index, key: 'jubilee'}, {
						contrastStart: 1,
						brightnessStart: 1,
						sizeStart: 80,
						sizeEnd: 20,
						yEnd: yStart,
						xEnd: xStart,
						rotation: 720,
						alpha: 0,
						duration: .77,
						ease: Power3.easeOut,
						alphaEase: Power1.easeOut,
					})
			}(i)
		}
		ask.particleCircle({
			index: o.index,
			key: 'particle-circle-arcane',
		}, {
			duration: .33,
			alpha: 0,
			sizeEnd: 300,
		})
	}
}($, _, TweenMax, Power0, Power1, Power2, Power3, Power4);