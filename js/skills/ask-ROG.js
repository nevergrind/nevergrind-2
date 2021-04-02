!function($, _, TweenMax, Power0, Power1, Power2, Power3, Power4, undefined) {
	ask = {
		...ask,
		shadowStrike,
		sonicStrike,
		sonicStrikeNova,
		fadedStrike,
		fadedStrikeBuff,
		risingFuror,
		risingFurorBuff,
		lacerate,
		backstab,
		widowStrike,
		dazzleThrust,
		mirageStrike,
		mirageStrikeBuff,
		flashStrike,
		talismanOfTreachery,
		prowl,
	}
	///////////////////////////////////////////

	function shadowStrike(o) {
		ask.explosion({index: o.index, key: 'burst-purple'}, {
			duration: .33,
			sizeEnd: 300,
		})
		o.endFrame = 2
		ask.explosion(o, {
			contrastStart: 1.3,
			brightnessStart: 2,
			sizeStart: 250,
			sizeEnd: 150,
			alpha: 1,
			duration: .39,
			frameDuration: .39,
			frameEase: Power0.easeIn,
		})
	}
	function sonicStrike(o) {
		ask.explosion({index: o.index, key: 'burst-default'}, {
			duration: .33,
			sizeEnd: 300,
		})
		ask.rings({index: o.index, type: 'default'}, {
			loops: 5,
		})
		o.endFrame = 2
		ask.explosion(o, {
			contrastStart: 1.3,
			brightnessStart: 2,
			sizeStart: 300,
			sizeEnd: 200,
			alpha: 1,
			duration: .39,
			frameDuration: .39,
			frameEase: Power0.easeIn,
		})
	}
	function sonicStrikeNova(o) {
		ask.rings({index: o.index, type: 'default'}, {
			loops: 5,
		})
	}
	function fadedStrike(o) {
		ask.explosion({index: o.index, key: 'burst-ice'}, {
			duration: .33,
			sizeEnd: 300,
		})
		delayedCall(.3, () => {
			ask.starburst(o)
		})
		o.endFrame = 2
		ask.explosion(o, {
			contrastStart: 1.3,
			brightnessStart: 2,
			sizeStart: 250,
			sizeEnd: 200,
			alpha: 1,
			duration: .33,
			frameDuration: .33,
			frameEase: Power0.easeIn,
		})
	}
	function fadedStrikeBuff(o) {
		ask.explosion({index: o.index, key: 'burst-ice'}, {
			targetMob: false,
			duration: .5,
			sizeEnd: 250,
		})
	}
	function risingFuror(o) {
		ask.explosion({index: o.index, key: 'burst-blood'}, {
			duration: .5,
		})
		delayedCall(.3, () => {
			ask.moonburst(o)
		})
		o.endFrame = 3
		ask.explosion(o, {
			contrastStart: 1.3,
			brightnessStart: 2,
			sizeStart: 300,
			sizeEnd: 300,
			alpha: 1,
			duration: .33,
			frameDuration: .33,
			frameEase: Power0.easeIn,
		})
	}
	function risingFurorBuff(o) {
		ask.explosion({index: o.index, key: 'burst-blood'}, {
			targetMob: false,
			duration: .5,
			sizeEnd: 250,
		})
	}
	function lacerate(o) {
		ask.explosion({index: o.index, key: 'burst-blood'}, {
			duration: .5,
		})
		o.endFrame = 3
		ask.explosion(o, {
			contrastStart: 1.3,
			brightnessStart: 2,
			sizeStart: 300,
			sizeEnd: 300,
			alpha: 1,
			duration: .44,
			frameDuration: .44,
			frameEase: Power0.easeIn,
		})
		ask.bloodDrop(o.index, 64)
	}
	function backstab(o) {
		ask.sunburst(o, {
			sizeStart: 0,
			sizeEnd: 300,
		})
		o.endFrame = 3
		ask.explosion(o, {
			contrastStart: 1.3,
			brightnessStart: 3,
			sizeStart: 0,
			sizeEnd: 350,
			alpha: 1,
			duration: .28,
			frameDuration: .28,
			frameEase: Power0.easeIn,
		})
		ask.explosion(o, {
			contrastStart: 1.3,
			brightnessStart: 5,
			sizeStart: 500,
			sizeEnd: 400,
			alpha: 1,
			rotationStart: 45,
			rotation: 45,
			zIndex: ask.behindMobLayer(o),
			duration: .56,
			frameDuration: .56,
			frameEase: Power0.easeIn,
		})
		ask.particleSmall({
			index: o.index,
			key: 'particle-small-default',
		}, {
			interval: 0,
			loops: 15,
			sizeStart: 16,
			sizeEnd: 4,
			xRange: 250,
			yRange: 0,
		})
	}
	function widowStrike(o) {
		ask.explosion(o, {
			duration: 1.2
		})
	}
	function dazzleThrust(o) {
		ask.explosion(o, {
			duration: 1.2
		})
	}
	function mirageStrike(o) {
		ask.explosion(o, {
			duration: 1.2
		})
	}
	function mirageStrikeBuff(o) {
		ask.explosion(o, {
			targetMob: false,
			duration: 1.2
		})
	}
	function flashStrike(o) {
		ask.explosion(o, {
			duration: 1.2
		})
	}
	function talismanOfTreachery(o) {
		ask.explosion(o, {
			targetMob: false,
			duration: 1.2
		})
	}
	function prowl(o) {
		ask.explosion(o, {
			targetMob: false,
			duration: 1.2
		})
	}
}($, _, TweenMax, Power0, Power1, Power2, Power3, Power4);