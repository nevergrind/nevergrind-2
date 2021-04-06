!function($, _, TweenMax, Power0, Power1, Power2, Power3, Power4, undefined) {
	ask = {
		...ask,
		shieldBash,
		rupture,
		whirlwind,
		pummel,
		doubleThrow,
		shockwave,
		frenzy,
		jumpStrike,
		primalStomp,
		bulwark,
		intrepidShout,
		furiousCleave,
	}
	///////////////////////////////////////////

	function shieldBash(o) {
		ask.explosion({index: o.index, key: 'burst-default'})
		o.endFrame = 2
		ask.explosion(_.clone(o), {
			contrastStart: 1.5,
			brightnessStart: 2,
			sizeStart: 100,
			sizeEnd: 300,
			duration: .8,
			frameDuration: .8,
			frameEase: Power0.easeIn,
		})
	}
	function rupture(o) {
		for (var i=0; i<3; i++) {
			!function(i) {
				delayedCall(i * .05, () => {
					ask.slash(o, {
						duration: .16,
						size: 250 + (i * 25),
					})
					let img = ask.slash(o, {
						duration: .16,
						size: 250 + (i * 25),
					})
					img.y += 30
					let z = ask.slash(o, {
						duration: .16,
						size: 250 + (i * 25),
					})
					z.y += 60
				})
			}(i)
		}
		ask.bloodDrop(o.index, 64)
	}
	function whirlwind(o) {
		ask.explosion({index: o.index, key: 'burst-ice'})
		o.endFrame = 4
		ask.explosion(o, {
			contrastStart: 2,
			brightnessStart: 4,
			sizeStart: 300,
			sizeEnd: 400,
			duration: 1.2,
			frameDuration: .4,
			frameEase: Power0.easeIn,
		})
	}
	function pummel(o) {
		ask.slash(o, {
			duration: .2,
			size: 300,
		})
		let img = ask.slash(o, {
			duration: .2,
			size: 300,
		})
		img.y += 45
		ask.nova({index: o.index, key: 'cast-swirl-purple'}, {
			position: 'bottom',
			loops: 5,
			duration: .5
		})
	}
	function doubleThrow(o) {
		ask.explosion({index: o.index, key: 'burst-arcane'})
		o.endFrame = 2
		ask.explosion(_.clone(o), {
			contrastStart: 2,
			brightnessStart: 5,
			sizeStart: 400,
			sizeEnd: 400,
			duration: .75,
			frameDuration: .3,
			frameEase: Power1.easeIn,
		})
	}
	function shockwave(o) {
		ask.explosion({index: o.index, key: 'burst-ice'})
		o.endFrame = 2
		ask.explosion(o, {
			contrastStart: 1.5,
			brightnessStart: 2,
			sizeStart: 200,
			sizeEnd: 400,
			duration: 1,
			frameDuration: .5,
			frameEase: Power0.easeIn,
		})
	}
	function frenzy(o) {
		ask.explosion(o, {
			targetMob: false,
			duration: 3,
			sizeStart: 256,
			sizeEnd: 128,
		})
		delayedCall(.2, () => {
			ask.explosion({
				index: o.index,
				key: 'frenzy1'
			}, {
				targetMob: false,
				duration: 2.75,
				sizeStart: 300,
				sizeEnd: 200,
			})
		})
	}
	function jumpStrike(o) {
		ask.explosion({index: o.index, key: 'burst-purple'})
		ask.lightColumn({index: o.index, key: 'column-lightning'}, {
			widthStart: 150,
		})
		o.endFrame = 2
		ask.groundExplosion(o, {
			yStart: ask.bottomY(o.index, true) + 25,
			contrastStart: 2,
			brightnessStart: 4,
			sizeStart: 412,
			sizeEnd: 512,
			duration: .8,
			frameDuration: .25,
			yoyo: false,
			alpha: 0,
			frameEase: Power0.easeOut,
			ease: Power3.easeOut,
		})
		ask.groundExplosion({index: o.index, key: 'burstGround-lightning'}, {
			yStart: ask.bottomY(o.index, true) + 25,
			contrastStart: 1.5,
			brightnessStart: 2,
			sizeStart: 100,
			sizeEnd: 400,
			yoyo: false,
			alpha: 0,
			duration: .5,
		})
	}
	function primalStomp(o) {
		// ask.explosion({index: o.index, key: 'burst-arcane'})
		o.endFrame = 3
		let img = ask.groundExplosion(o, {
			contrastStart: 1.2,
			brightnessStart: 2,
			sizeStart: 300,
			sizeEnd: 300,
			anchorY: .713,
			duration: .8,
			frameDuration: .32,
			yoyo: false,
			alpha: 1,
			frameEase: Power0.easeOut,
			ease: Power2.easeOut,
		})
		ask.fadeOut(img, .4, .4)
		delayedCall(.24, () => {
			ask.nova({index: o.index, key: 'cast-swirl-fire'}, {
				position: 'bottom',
				loops: 3,
			})
			ask.groundExplosion({index: o.index, key: 'burstGround-fire'}, {
				yStart: ask.bottomY(o.index, true),
				contrastStart: 1.5,
				brightnessStart: 2,
				sizeStart: 100,
				sizeEnd: 300,
				yoyo: false,
				alpha: 0,
				duration: .6,
			})
		})
	}
	function bulwark(o) {
		ask.explosion(o, {
			targetMob: false,
			duration: 3,
			sizeStart: 400,
			sizeEnd: 350,
		})
		delayedCall(.1, () => {
			ask.explosion({
				index: o.index,
				key: 'bulwark1'
			}, {
				targetMob: false,
				duration: 2.8,
				sizeStart: 400,
				sizeEnd: 300,
			})
		})
		delayedCall(.2, () => {
			ask.explosion({
				index: o.index,
				key: 'bulwark2'
			}, {
				targetMob: false,
				duration: 2.1,
				sizeStart: 350,
				sizeEnd: 250,
			})
		})
		delayedCall(.3, () => {
			ask.explosion({
				index: o.index,
				key: 'bulwark3'
			}, {
				targetMob: false,
				duration: 2,
				sizeStart: 350,
				sizeEnd: 300,
			})
		})
	}
	function intrepidShout(o) {
		let interval = .1
		ask.explosion(o, {
			targetMob: false,
			duration: interval,
			alpha: 1,
			sizeStart: 300,
			sizeEnd: 200,
		})
		delayedCall(interval, () => {
			ask.explosion({
				index: o.index,
				key: 'intrepidShout1'
			}, {
				targetMob: false,
				duration: interval,
				alpha: 1,
				sizeStart: 300,
				sizeEnd: 200,
			})
			delayedCall(interval, () => {
				ask.explosion({
					index: o.index,
					key: 'intrepidShout2'
				}, {
					targetMob: false,
					alpha: 1,
					duration: interval,
					sizeStart: 300,
					sizeEnd: 200,
				})
				delayedCall(interval, () => {
					ask.explosion({
						index: o.index,
						key: 'intrepidShout3'
					}, {
						targetMob: false,
						duration: 1.5,
						sizeStart: 300,
						sizeEnd: 250,
					})
				})
			})
		})
	}
	function furiousCleave(o) {
		ask.explosion({index: o.index, key: 'burst-default'})
		ask.slash(o, {
			duration: .2,
			size: 300,
		})
		let img = ask.slash(o, {
			duration: .2,
			size: 300,
		})
		img.y += 22
		let z = ask.slash(o, {
			duration: .2,
			size: 300,
		})
		z.y += 44
		ask.moonburst(o)
	}
}($, _, TweenMax, Power0, Power1, Power2, Power3, Power4);