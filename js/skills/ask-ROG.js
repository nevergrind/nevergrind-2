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
		ask.explosion({index: o.index, key: 'burst-ice'}, {
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
		ask.explosion(o, {
			duration: 1.2
		})
	}
	function fadedStrikeBuff(o) {
		ask.explosion(o, {
			targetMob: false,
			duration: 1.2
		})
	}
	function risingFuror(o) {
		ask.explosion(o, {
			duration: 1.2
		})
	}
	function risingFurorBuff(o) {
		ask.explosion(o, {
			targetMob: false,
			duration: 1.2
		})
	}
	function lacerate(o) {
		ask.explosion(o, {
			duration: 1.2
		})
	}
	function backstab(o) {
		ask.explosion(o, {
			duration: 1.2
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