!function($, _, TweenMax, Power0, Power1, Power2, Power3, Power4, undefined) {
	ask = {
		...ask,
		starfire,
		fissure,
		lightningBlast,
		blizzard,
		toxicSpores,
		moltenBoulder,
		barbedThicket,
		tornado,
		naturesTouch,
		mossBreath,
		synthesize,
		branchSpirit,
	}
	///////////////////////////////////////////

	function starfire(o) {
		ask.explosion({index: o.index, key: 'burst-fire'})
		o.endFrame = 4
		ask.explosion(_.clone(o), {
			contrastStart: 1.5,
			brightnessStart: 2,
			sizeStart: 300,
			sizeEnd: 400,
			duration: 1.5,
			frameDuration: .3,
			frameEase: Power0.easeIn,
		})
	}
	function fissure(o) {
		for (var i=0; i<15; i++) {
			!function(i) {
				delayedCall(i * .1, () => {
					o.endFrame = 2
					ask.groundExplosion(o, {
						yStart: ask.shadowY(o.index, true) + _.random(0, 30),
						xAdjust: _.random(-100, 100),
						contrastStart: 1,
						brightnessStart: 1,
						anchorY: .78,
						sizeStart: 128,
						sizeEnd: 128,
						duration: .5,
						frameDuration: .5,
						yoyo: true,
						zIndex: ask.DEFAULT_BEHIND_MOB_LAYER,
						alphaStart: 0,
						alpha: 1,
						frameEase: Power0.easeOut,
						ease: Power0.easeInOut,
					})
				})
			}(i)
		}
	}
	function lightningBlast(o) {
		ask.explosion(o, {
			duration: 1.2
		})
	}
	function blizzard(o) {
		ask.explosion(o, {
			duration: 1.2
		})
	}
	function toxicSpores(o) {
		ask.explosion(o, {
			duration: 1.2
		})
	}
	function moltenBoulder(o) {
		ask.explosion(o, {
			duration: 1.2
		})
	}
	function barbedThicket(o) {
		ask.explosion(o, {
			duration: 1.2
		})
	}
	function tornado(o) {
		ask.explosion(o, {
			duration: 1.2
		})
	}
	function naturesTouch(o) {
		ask.explosion(o, {
			targetMob: false,
			duration: 1.2
		})
	}
	function mossBreath(o) {
		ask.explosion(o, {
			targetMob: false,
			duration: 1.2
		})
	}
	function synthesize(o) {
		ask.explosion(o, {
			targetMob: false,
			duration: 1.2
		})
	}
	function branchSpirit(o) {
		ask.explosion(o, {
			targetMob: false,
			duration: 1.2
		})
	}
}($, _, TweenMax, Power0, Power1, Power2, Power3, Power4);