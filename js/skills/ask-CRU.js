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
			duration: 1.2
		})
	}
	function divineGrace(o) {
		ask.explosion(o, {
			targetMob: false,
			duration: 1.2
		})
	}
	function benevolence(o) {
		ask.explosion(o, {
			targetMob: false,
			duration: 1.2
		})
	}
	function jubilee(o) {
		ask.explosion(o, {
			duration: 1.2
		})
	}
}($, _, TweenMax, Power0, Power1, Power2, Power3, Power4);