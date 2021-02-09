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
			contrastStart: 2,
			brightnessStart: 5,
			sizeStart: 100,
			sizeEnd: 300,
			duration: 1,
			frameDuration: .33,
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
				})
			}(i)
		}
	}
	function whirlwind(o) {
		ask.explosion({index: o.index, key: 'burst-ice'})
		o.endFrame = 4
		ask.explosion(_.clone(o), {
			contrastStart: 2,
			brightnessStart: 5,
			sizeStart: 350,
			sizeEnd: 450,
			duration: 1.5,
			frameDuration: .3,
			frameEase: Power0.easeIn,
		})
	}
	function pummel(o) {
		for (var i=0; i<1; i++) {
			!function(i) {
				delayedCall(i * .05, () => {
					ask.slash(o, {
						duration: .25,
						size: 300,
					})
				})
			}(i)
		}
		ask.nova({index: o.index, key: 'cast-swirl-purple'}, {
			position: 'bottom',
			loops: 5,
		})
	}
	function doubleThrow(o) {
		ask.explosion({index: o.index, key: 'burst-arcane'})
		o.endFrame = 2
		ask.explosion(_.clone(o), {
			contrastStart: 2,
			brightnessStart: 5,
			sizeStart: 512,
			sizeEnd: 512,
			duration: .75,
			frameDuration: .2,
			frameEase: Power1.easeIn,
		})
	}
	function shockwave(o) {
		ask.explosion({index: o.index, key: 'burst-ice'})
		o.endFrame = 2
		ask.explosion(_.clone(o), {
			contrastStart: 1.5,
			brightnessStart: 2,
			sizeStart: 256,
			sizeEnd: 512,
			duration: 1,
			frameDuration: .33,
			frameEase: Power0.easeIn,
		})
	}
	function frenzy(o) {
		ask.explosion(o, {
			targetMob: false,
			duration: 5,
			sizeStart: 256,
			sizeEnd: 128,
		})
		delayedCall(.25, () => {
			ask.explosion({
				..._.clone(o),
				key: 'frenzy1'
			}, {
				targetMob: false,
				duration: 4.75,
				sizeStart: 300,
				sizeEnd: 200,
			})
		})
	}
	function jumpStrike(o) {
		ask.explosion({index: o.index, key: 'burst-purple'})
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
	}
	function primalStomp(o) {
		// ask.explosion({index: o.index, key: 'burst-arcane'})
		o.endFrame = 3
		ask.groundExplosion(o, {
			yStart: ask.bottomY(o.index, true) + 50,
			contrastStart: 2,
			brightnessStart: 4,
			sizeStart: 512,
			sizeEnd: 412,
			duration: 1,
			frameDuration: .25,
			yoyo: false,
			alpha: 0,
			frameEase: Power0.easeOut,
			ease: Power2.easeOut,
		})
		ask.nova({index: o.index, key: 'cast-swirl-fire'}, {
			position: 'bottom',
			loops: 5,
		})
	}
	function bulwark(o) {
		ask.explosion(o, {
			targetMob: false,
			duration: 5,
			sizeStart: 400,
			sizeEnd: 350,
		})
		delayedCall(.1, () => {
			ask.explosion({
				..._.clone(o),
				key: 'bulwark1'
			}, {
				targetMob: false,
				duration: 3.8,
				sizeStart: 400,
				sizeEnd: 300,
			})
		})
		delayedCall(.2, () => {
			ask.explosion({
				..._.clone(o),
				key: 'bulwark2'
			}, {
				targetMob: false,
				duration: 3.1,
				sizeStart: 400,
				sizeEnd: 250,
			})
		})
		delayedCall(.3, () => {
			ask.explosion({
				..._.clone(o),
				key: 'bulwark3'
			}, {
				targetMob: false,
				duration: 2,
				sizeStart: 600,
				sizeEnd: 350,
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
				..._.clone(o),
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
					..._.clone(o),
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
						..._.clone(o),
						key: 'intrepidShout3'
					}, {
						targetMob: false,
						duration: 3,
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
			duration: .16,
			size: 300,
		})
		ask.starburst(o)
		ask.moonburst(o)
	}
}($, _, TweenMax, Power0, Power1, Power2, Power3, Power4);