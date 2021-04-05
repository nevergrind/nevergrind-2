!function($, _, TweenMax, Power0, Power1, Power2, Power3, Power4, undefined) {
	ask = {
		...ask,
		fireBolt,
		iceBolt,
		lightningBolt,
		magicMissiles,
		fireball,
		chainLightning,
		frostNova,
		meteorLaunch,
		meteor,
		meteorStrike,
		frozenBarrier,
		mirrorImage,
		manaShell,
		deepFreeze,
	}
	///////////////////////////////////////////

	function fireBolt(o) {
		ask.sunburst({index: o.index})
		o.endFrame = 2
		let dur = .32
		let img = ask.explosion(o, {
			contrastStart: 1.2,
			brightnessStart: 2,
			sizeStart: 50,
			sizeEnd: 200,
			alpha: 1,
			duration: dur,
			frameDuration: dur,
			frameEase: Power0.easeIn,
		})
		let img2 = ask.explosion(o, {
			flip: true,
			contrastStart: 1.5,
			brightnessStart: 2,
			sizeStart: 50,
			sizeEnd: 200,
			alpha: 1,
			duration: dur,
			frameDuration: dur,
			frameEase: Power0.easeIn,
		})
		ask.fadeOut([img, img2], dur, dur * .5)
	}
	function iceBolt(o) {
		ask.explosion({index: o.index, key: 'burst-ice'})
		o.endFrame = 2
		let dur = .3
		let img = ask.explosion(o, {
			contrastStart: 1.5,
			brightnessStart: 2,
			sizeStart: 0,
			sizeEnd: 250,
			alpha: 1,
			duration: dur,
			frameDuration: dur,
			frameEase: Power0.easeIn,
		})
		let img2 = ask.explosion(o, {
			contrastStart: 1.5,
			brightnessStart: 2,
			sizeStart: 0,
			sizeEnd: 250,
			rotation: -90,
			alpha: 1,
			duration: dur,
			frameDuration: dur,
			frameEase: Power0.easeIn,
		})
		ask.fadeOut([img, img2], dur, dur * .5)
	}
	function lightningBolt(o) {
		let shadowY = ask.bottomY(o.index, true) + 50
		ask.explosion({index: o.index, key: 'burst-lightning'}, {
			sizeEnd: 250,
		})
		let img = ask.groundExplosion(o, {
			yStart: shadowY,
			contrastStart: 2,
			brightnessStart: 5,
			width: 400,
			height: 900,
			yoyo: false,
			alpha: 1,
			duration: 1,
			frameDuration: 1,
			frameEase: Power0.easeIn,
		})
		delayedCall(.06, () => {
			TweenMax.to(img, 1, {
				startAt: { alpha: .1 },
				alpha: 0,
			})
			o.key = 'lightningBolt1'
			let img1 = ask.groundExplosion(o, {
				yStart: shadowY,
				contrastStart: 3,
				brightnessStart: 6,
				width: 100,
				height: 900,
				yoyo: false,
				alpha: 1,
				duration: 1,
				frameDuration: 1,
				frameEase: Power0.easeIn,
			})
			delayedCall(.04, () => {
				TweenMax.to(img1, .1, {
					startAt: {alpha: .1},
					alpha: 0,
				})
				o.key = 'lightningBolt2'
				let img2 = ask.groundExplosion(o, {
					yStart: shadowY,
					contrastStart: 3,
					brightnessStart: 6,
					width: 100,
					height: 900,
					yoyo: false,
					alpha: 1,
					duration: 1,
					frameDuration: 1,
					frameEase: Power0.easeIn,
				})
				delayedCall(.04, () => {
					TweenMax.to(img2, .1, {
						startAt: {alpha: .1},
						alpha: 0,
					})
				})
			})
		})
		ask.particleSmall({
			index: o.index,
			key: 'particle-small-lightning',
		}, {
			interval: .001,
			loops: 15,
			sizeStart: 24,
			sizeEnd: 4,
			xRange: 400,
			yRange: 50,
		})
	}
	function magicMissiles(o) {
		ask.explosion({index: o.index, key: 'burst-lightning'}, {
			sizeEnd: 245,
			duration: .4,
		})
		o.key = 'magicMissiles1'
		ask.slash(o, {
			isPrimary: false,
			yAdjust: -80,
			duration: .2,
			size: 150,
		})
		ask.slash(o, {
			isPrimary: false,
			yAdjust: 80,
			duration: .2,
			size: 150,
		})
		o.key = 'magicMissiles2'
		ask.slash(o, {
			isPrimary: false,
			duration: .2,
			size: 300,
		})
	}
	function fireball(o) {
		ask.sunburst({index: o.index}, {
			sizeEnd: 400,
			duration: 1.2
		})
		o.endFrame = 3
		let dur = .45
		ask.explosion(o, {
			contrastStart: 1.5,
			brightnessStart: 3,
			sizeStart: 50,
			sizeEnd: 300,
			alpha: 1,
			duration: dur,
			frameDuration: dur,
			frameEase: Power0.easeIn,
		})
		ask.particleSmall({
			index: o.index,
			key: 'particle-small-fire',
		}, {
			interval: .001,
			loops: 15,
			sizeStart: 24,
			sizeEnd: 4,
			xRange: 400,
			yRange: 50,
		})
	}
	function chainLightning(o) {
		ask.explosion({index: o.index, key: 'burst-lightning'}, {
			sizeEnd: 250,
			duration: .6
		})
		o.endFrame = 4
		let dur = .125 * 2
		let img = ask.explosion(o, {
			contrastStart: 3,
			brightnessStart: 8,
			sizeStart: 400,
			sizeEnd: 400,
			alpha: 1,
			duration: dur,
			frameDuration: dur,
			frameEase: Power0.easeIn,
		})
		ask.fadeOut(img, dur, dur * .3)
	}
	function frostNova(o) {
		ask.explosion({index: o.index, key: 'burst-ice'})
		ask.rings({index: o.index, type: 'ice'}, {
			loops: 1,
			duration: .5,
		})
		o.endFrame = 3
		let dur = .4
		let img = ask.groundExplosion(o, {
			contrastStart: 1.5,
			brightnessStart: 2.5,
			sizeStart: 50,
			sizeEnd: 320,
			anchorY: .508,
			yoyo: false,
			alpha: 1,
			duration: dur,
			ease: Power2.easeOut,
			frameDuration: dur,
			frameEase: Power0.easeIn,
		})
		ask.fadeOut(img, dur, dur * .7)
		ask.particleSmall({
			index: o.index,
			key: 'particle-small-ice',
		}, {
			interval: .001,
			loops: 13,
			sizeStart: 32,
			sizeEnd: 4,
			xRange: 250,
			yRange: 50,
		})
	}
	function meteorLaunch(o) {
		// launch
		let xEnd = mob.centerX[o.index]
		let yEnd = ask.centerY(o.index, true)
		let xStart = xEnd + 10000
		let yStart = yEnd - 10000

		o.key = 'meteor'
		o.endFrame = 1
		let dur = 2
		let img = ask.explosion(o, {
			xStart: xStart,
			yStart: yStart,
			contrastStart: 1.3,
			brightnessStart: 3,
			sizeStart: 400,
			sizeEnd: 400,
			anchorY: .8398,
			yoyo: false,
			alpha: 1,
			repeat: true,
			duration: dur,
			ease: Power2.easeOut,
			frameDuration: .1,
			frameEase: Power0.easeIn,
		})
		TweenMax.to(img, 2, {
			x: xEnd,
			y: yEnd,
			ease: Power0.easeNone,
			onComplete: () => {
				ask.explosion({index: o.index, key: 'burst-default'}, {sizeEnd: 350, duration: 1})
				ask.rings({index: o.index, type: 'default'}, {
					duration: 1,
					loops: 3,
				})
			}
		})
	}
	function meteor(o) {
		// HIT
		ask.sunburst({index: o.index}, {sizeEnd: 500, duration: 1.5})
		ask.explosion({index: o.index, key: 'burst-fire'}, {sizeEnd: 400, duration: 1.5})
		o.key = 'meteorBurst'
		o.endFrame = 3
		let dur = .44
		let img = ask.groundExplosion(o, {
			contrastStart: 1.3,
			brightnessStart: 3,
			sizeStart: 80,
			sizeEnd: 500,
			anchorY: .8398,
			yoyo: false,
			alpha: 1,
			duration: dur,
			ease: Power2.easeOut,
			frameDuration: dur,
			frameEase: Power0.easeIn,
		})
		ask.fadeOut(img, dur, dur * .3)
		ask.particleSmall({
			index: o.index,
			key: 'particle-small-fire',
		}, {
			interval: .001,
			loops: 33,
			sizeStart: 32,
			sizeEnd: 4,
			xRange: 250,
			yRange: 50,
		})
	}
	function meteorStrike(o) {
		// 6 seconds of burning 12 * .5
		let y = ask.bottomY(o.index, true)
		for (var i=0; i<30; i++) {
			ask.flames(o, {
				y: y,
				key: 'meteor',
				duration: _.random(5.5, 6.5),
				fade: _.random(.2, .5),
			})
		}
	}
	function frozenBarrier(o) {
		ask.explosion({index: o.index, key: 'burst-ice'}, {targetMob: false, duration: 1.5})
		o.endFrame = 3
		let dur = 1.5
		let img = ask.explosion(o, {
			targetMob: false,
			contrastStart: 1.2,
			brightnessStart: 2,
			sizeStart: 200,
			sizeEnd: 200,
			alpha: 1,
			duration: dur,
			frameDuration: .4,
			frameEase: Power0.easeIn,
		})
		TweenMax.to(img, .8, {
			width: 300,
			height: 300,
			ease: Power4.easeOut,
		})
		delayedCall(dur * .8, () => {
			img.anchor.set(.5, 1)
			img.y += 150
			TweenMax.to(img, dur * .2, {
				height: 0,
			})
		})
		ask.fadeOut(img, dur, dur * .2)
	}
	function mirrorImage(o) {
		ask.explosion({index: o.index, key: 'burst-purple'}, {targetMob: false, duration: 1.5})
		ask.explosion(o, {
			targetMob: false,
			duration: 1,
			sizeStart: 300,
			sizeEnd: 200,
		})
		delayedCall(.25, () => {
			ask.explosion({
				..._.clone(o),
				key: 'mirrorImage1'
			}, {
				targetMob: false,
				brightnessStart: 4,
				duration: 1,
				sizeStart: 300,
				sizeEnd: 200,
			})
		})
		delayedCall(.5, () => {
			ask.explosion({
				..._.clone(o),
				key: 'mirrorImage2'
			}, {
				targetMob: false,
				brightnessStart: 6,
				duration: 1,
				sizeStart: 300,
				sizeEnd: 200,
			})
		})
		delayedCall(.75, () => {
			ask.explosion({
				..._.clone(o),
				key: 'mirrorImage3'
			}, {
				targetMob: false,
				brightnessStart: 8,
				duration: 2.5,
				sizeStart: 300,
				sizeEnd: 200,
			})
		})
	}
	function manaShell(o) {
		ask.explosion({index: o.index, key: 'manaShell-'}, {
			targetMob: false,
			contrastStart: 1.2,
			brightnessStart: 2,
			sizeStart: 300,
			sizeEnd: 200,
			duration: .33,
		})
		ask.explosion({index: o.index, key: 'manaShell-1'}, {
			targetMob: false,
			contrastStart: 1.2,
			brightnessStart: 2,
			sizeStart: 300,
			sizeEnd: 200,
			duration: .33,
		})
		delayedCall(.33, () => {
			ask.explosion({index: o.index, key: 'burst-lightning'}, {
				targetMob: false,
				sizeEnd: 300
			})
			ask.explosion({index: o.index, key: 'manaShell-2'}, {
				targetMob: false,
				contrastStart: 1.2,
				brightnessStart: 2,
				sizeStart: 300,
				sizeEnd: 250,
				duration: 1.25,
			})
		})
	}
	function deepFreeze(o) {
		ask.explosion({index: o.index, key: 'burst-ice'}, {targetMob: false})
		o.endFrame = 3
		let dur = 1.5
		let fade = .25
		let img = ask.groundExplosion(o, {
			contrastStart: 1.4,
			brightnessStart: 2,
			contrastEnd: 1,
			brightnessEnd: 1,
			anchorY: .879,
			sizeStart: 350,
			sizeEnd: 350,
			alpha: 1,
			duration: dur,
			frameDuration: fade,
			frameEase: Power0.easeOut,
		})
		TweenMax.to(img, dur - fade, {
			delay: fade,
			width: 340,
			height: 340,
			ease: Power0.easeOut,
		})
		ask.fadeOut(img, dur, dur * .25)

	}
}($, _, TweenMax, Power0, Power1, Power2, Power3, Power4);