!function($, _, TweenMax, Power0, Power1, Power2, Power3, Power4, undefined) {
	ask = {
		...ask,
		gravityFlux,
		staticSuffocation,
		mindBlitz,
		subversion,
		colorShift,
		phaseBlade,
		stasisField,
		shiftingEther,
		sereneSigil,
		augmentation,
		clarity,
		enthrall,
	}
	///////////////////////////////////////////

	function gravityFlux(o) {
		ask.explosion(o, {
			duration: 1.2
		})
	}
	function staticSuffocation(o) {
		ask.explosion(o, {
			duration: 1.2
		})
	}
	function mindBlitz(o) {
		ask.explosion(o, {
			duration: 1.2
		})
	}
	function subversion(o) {
		ask.explosion(o, {
			duration: 1.2
		})
	}
	function colorShift(o) {
		ask.explosion({index: o.index, key: 'burst-arcane'})
		ask.rings({index: o.index, type: 'arcane'}, {
			loops: 1,
			duration: .3,
		})
		let dur = .5
		ask.explosion({index: o.index, key: 'colorShift2'}, {
			contrastStart: 1.2,
			brightnessStart: 2,
			sizeStart: 0,
			sizeEnd: 300,
			duration: dur,
			frameDuration: dur,
			frameEase: Power0.easeIn,
		})
		ask.explosion({index: o.index, key: 'colorShift1'}, {
			contrastStart: 1.2,
			brightnessStart: 2,
			sizeStart: 0,
			sizeEnd: 250,
			duration: dur,
			frameDuration: dur,
			frameEase: Power0.easeIn,
		})
		ask.explosion(o, {
			contrastStart: 1.2,
			brightnessStart: 2,
			sizeStart: 0,
			sizeEnd: 200,
			ease: Power1.easeIn,
			duration: dur,
			frameDuration: dur,
			frameEase: Power0.easeIn,
		})
	}
	function phaseBlade(o) {
		ask.explosion(o, {
			targetMob: false,
			duration: 1.2
		})
	}
	function stasisField(o) {
		ask.explosion(o, {
			duration: 1.2
		})
	}
	function shiftingEther(o) {
		ask.explosion(o, {
			duration: 1.2
		})
	}
	function sereneSigil(o) {
		ask.explosion(o, {
			targetMob: false,
			duration: 1.2
		})
	}
	function augmentation(o) {
		ask.explosion({index: o.index, key: 'orb-arcane'}, {targetMob: false})
		ask.particleCircle({
			index: o.index,
			key: 'particle-circle-arcane',
		}, {
			targetMob: false,
			duration: .33,
			alpha: 0,
			sizeEnd: 300,
		})
		o.endFrame = 2
		ask.explosion(o, {
			targetMob: false,
			duration: 2.5,
			frameDuration: .3,
			sizeStart: 300,
			sizeEnd: 200,
		})
	}
	function clarity(o) {
		!function(o) {
			delayedCall(.3, () => {
				ask.explosion({index: o.index, key: 'mysticalGlow-p1'}, {
					targetMob: false,
					contrastStart: 2,
					brightnessStart: 4,
					sizeStart: 320,
					sizeEnd: 400,
					duration: 1.2,
					ease: Power2.easeOut,
				})
				ask.explosion({index: o.index, key: 'orb-ice'}, {targetMob: false})
				ask.explosion({index: o.index, key: 'clarity-blue'}, {
					targetMob: false,
					contrastStart: 1.5,
					brightnessStart: 3,
					contrastEnd: 0,
					brightnessEnd: 0,
					sizeStart: 100,
					sizeEnd: 250,
					duration: 1.2,
					ease: Power2.easeOut,
				})
			})
		}(_.clone(o))
		o.endFrame = 2
		ask.explosion(o, {
			targetMob: false,
			contrastStart: 1.2,
			brightnessStart: 2,
			rotation: 180,
			sizeStart: 250,
			sizeEnd: 100,
			duration: .4,
			frameDuration: .4,
			ease: Power2.easeOut,
		})
	}
	function enthrall(o) {
		ask.explosion({index: o.index, key: 'burst-arcane'})
		ask.lightColumn({index: o.index, key: 'enthrall-col2'}, {
			widthStart: 200
		})
		ask.lightColumn({index: o.index, key: 'enthrall-col1'}, {
			widthStart: 100
		})
		ask.groundExplosion(o, {
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
}($, _, TweenMax, Power0, Power1, Power2, Power3, Power4);