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
		ask.sunburst(o, {
			sizeStart: 0,
			sizeEnd: 400,
			zIndex: ask.behindMobLayer(o),
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
		ask.explosion({index: o.index, key: 'burst-poison'}, {
			duration: .5,
		})
		ask.particleCircle({
			index: o.index,
			key: 'particle-circle-poison',
		}, {
			duration: .4,
			alpha: 0,
			sizeEnd: 250,
		})
		o.endFrame = 3
		ask.explosion(o, {
			contrastStart: 1.3,
			brightnessStart: 3,
			sizeStart: 220,
			sizeEnd: 160,
			rotationStart: 45,
			rotation: 45,
			alpha: 1,
			duration: .4,
			frameDuration: .4,
			frameEase: Power0.easeIn,
		})
	}
	function dazzleThrust(o) {
		ask.explosion({index: o.index, key: 'burst-default'}, {
			duration: .5,
		})
		ask.explosion({index: o.index, key: 'orb-arcane'}, {
			contrastStart: 1.5,
			brightnessStart: 3,
			sizeStart: 0,
			sizeEnd: 250,
			rotation: 360,
		})
		o.endFrame = 2
		ask.explosion(o, {
			contrastStart: 1.3,
			brightnessStart: 4,
			sizeStart: 0,
			sizeEnd: 450,
			duration: .8,
			frameDuration: .32,
			frameEase: Power0.easeIn,
		})
	}
	function mirageStrike(o) {
		let img = ask.slash({index: o.index, key: 'mirageStrike-slash'}, {
			duration: .36,
			size: 300,
		})
		img.alpha = .25
		ask.slash({index: o.index, key: 'mirageStrike-slash'}, {
			duration: .18,
			size: 300,
		})
		ask.explosion({index: o.index, key: 'mirageStrike1'}, {
			contrastStart: 1.3,
			brightnessStart: 2,
			sizeStart: 200,
			sizeEnd: 350,
			duration: 1,
			zIndex: ask.behindMobLayer(o),
		})
	}
	function mirageStrikeBuff(o) {
		ask.explosion({index: o.index, endFrame: 3, key: 'mirageStrike'}, {
			targetMob: false,
			contrastStart: 1.3,
			brightnessStart: 2,
			sizeStart: 220,
			sizeEnd: 190,
			duration: 1.5,
			frameDuration: .5,
			frameEase: Power0.easeIn,
		})
	}
	function flashStrike(o) {
		ask.sunburst(o)
		ask.explosion({index: o.index, endFrame: 3, key: 'flashStrike'}, {
			contrastStart: 1.3,
			brightnessStart: 3,
			sizeStart: 200,
			sizeEnd: 300,
			duration: .8,
			frameDuration: .32,
			frameEase: Power0.easeIn,
		})
	}
	function talismanOfTreachery(o) {
		let o1 = ask.explosion({index: o.index, key: 'orb-arcane'}, {
			targetMob: false,
			contrastStart: 1.5,
			brightnessStart: 3,
			sizeStart: 100,
			sizeEnd: 250,
			duration: 2
		})
		TweenMax.to(o1, 2, {
			rotation: util.rotation(90),
			ease: Power0.easeIn,
		})
		let o2 = ask.explosion({index: o.index, key: 'orb-arcane'}, {
			targetMob: false,
			contrastStart: 1.5,
			brightnessStart: 3,
			sizeStart: 100,
			sizeEnd: 250,
			duration: 2
		})
		TweenMax.to(o2, 2, {
			rotation: util.rotation(-90),
			ease: Power0.easeIn,
		})
		ask.explosion({index: o.index, key: 'talismanOfTreachery2'}, {
			targetMob: false,
			contrastStart: 1.3,
			brightnessStart: 2,
			sizeStart: 200,
			sizeEnd: 280,
			duration: 2,
		})
		ask.explosion({index: o.index, key: 'talismanOfTreachery'}, {
			targetMob: false,
			contrastStart: 2,
			brightnessStart: 5,
			sizeStart: 350,
			sizeEnd: 280,
			duration: 2.5,
		})
	}
	function prowl(o) {
		ask.explosion({index: o.index, key: 'orb-large'}, {
			targetMob: false,
			contrastStart: 1.5,
			brightnessStart: 3,
			sizeStart: 150,
			sizeEnd: 250,
			duration: 1.5
		})
		let dark = ask.explosion(o, {
			targetMob: false,
			contrastStart: 1,
			brightnessStart: 1.5,
			sizeStart: 200,
			sizeEnd: 200,
			duration: 1,
			zIndexAdj: 1,
		})
		TweenMax.to(dark, 1, {
			startAt: {
				pixi: { brightness: .5 },
				x: '+=30',
			},
			x: '-=30'
		})
		let light = ask.explosion(o, {
			targetMob: false,
			contrastStart: 1.5,
			brightnessStart: 3,
			sizeStart: 200,
			sizeEnd: 200,
			duration: 1,
		})
		TweenMax.to(light, 1, {
			startAt: {
				x: '-=30',
			},
			x: '+=30'
		})
	}
}($, _, TweenMax, Power0, Power1, Power2, Power3, Power4);