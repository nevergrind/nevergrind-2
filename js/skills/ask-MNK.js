!function($, _, TweenMax, Power0, Power1, Power2, Power3, Power4, undefined) {
	ask = {
		...ask,
		tigerStrike,
		hyperStrike,
		hyperStrikeBuff,
		mimeStrike,
		craneKick,
		chakraBlast,
		hadoken,
		hurricaneKicks,
		dragonPunch,
		viperStrike,
		viperStrikeBuff,
		viperStrikeHeal,
		palmStrike,
		mendingAura,
		spiritBarrier,
	}
	///////////////////////////////////////////

	function tigerStrike(o) {
		for (var i=0; i<3; i++) {
			ask.slash(o, {
				duration: .25,
				size: 200,
				yAdjust: (i * 33) - 33
			})
		}
		o.endFrame = 2
		o.key = 'tigerStrikeRoar'
		ask.explosion(o, {
			yStart: ask.centerY(o.index, false) - 350,
			contrastStart: 1.5,
			brightnessStart: 2,
			sizeStart: 200,
			sizeEnd: 150,
			duration: .45,
			alpha: 1,
			frameDuration: .45,
			frameEase: Power0.easeIn,
		})
	}
	function hyperStrike(o) {
		ask.explosion({index: o.index, key: 'burst-purple'})
		o.endFrame = 2
		let img = ask.explosion(o, {
			contrastStart: 2,
			brightnessStart: 4,
			sizeStart: 0,
			sizeEnd: 300,
			duration: .3,
			alpha: 1,
			frameDuration: .3,
			ease: Power0.easeIn,
			frameEase: Power0.easeIn,
		})
		ask.fadeOut(img, .4, .1)
	}
	function hyperStrikeBuff(o) {
		ask.explosion({index: o.index, key: 'burst-default'}, {targetMob: false})
	}
	function mimeStrike(o) {
		if (o.damage) {
			// strike
			o.endFrame = 3
			ask.explosion({index: o.index, key: 'burst-ice'})
			ask.explosion(o, {
				contrastStart: 1,
				brightnessStart: 1.5,
				// yStart: ask.centerY(o.index, false) - 350,
				sizeStart: 180,
				sizeEnd: 200,
				duration: .7,
				alpha: 0,
				frameDuration: .7,
				ease: Power0.easeIn,
				frameEase: Power0.easeIn,
			})
		}
		else {
			// buff
			ask.explosion({index: o.index, key: 'burst-arcane'}, {targetMob: false})
		}
	}
	function craneKick(o) {
			ask.explosion({index: o.index, key: 'burst-fire'}, {sizeEnd: 300})
			ask.explosion({index: o.index, key: 'burst-arcane'}, {sizeEnd: 500})
			let img = ask.explosion(o, {
				contrastStart: 1.5,
				brightnessStart: 2,
				sizeStart: 300,
				sizeEnd: 150,
				alpha: 1,
				ease: Bounce.easeOut,
				duration: .4,
			})
			TweenMax.to(img, .4, {
				rotation: util.rotation(-90)
			})
			ask.fadeOut(img, .4, .1)
	}
	function chakraBlast(o) {
			ask.explosion({index: o.index, key: 'burst-arcane'}, {duration: 1.5})
			o.endFrame = 4
			let dur = .33
			let img = ask.explosion(o, {
				contrastStart: 2,
				brightnessStart: 4,
				sizeStart: 0,
				sizeEnd: 300,
				duration: dur,
				alpha: 1,
				frameDuration: dur,
				ease: Power3.easeOut,
				frameEase: Power0.easeIn,
			})
			ask.fadeOut(img, dur, .1)
	}
	function hadoken(o) {
			ask.explosion({index: o.index, key: 'burst-purple'}, {duration: 1})
			o.endFrame = 2
			let dur = .33
			let img = ask.explosion(o, {
				contrastStart: 2,
				brightnessStart: 4,
				sizeStart: 80,
				sizeEnd: 350,
				duration: dur,
				alpha: 1,
				frameDuration: dur,
				ease: Power3.easeOut,
				frameEase: Power0.easeIn,
			})
			ask.fadeOut(img, dur, .1)
	}
	function hurricaneKicks(o) {
			ask.explosion({index: o.index, key: 'burst-default'}, {duration: 1})
			ask.nova({index: o.index, key: 'cast-swirl-arcane'}, {
				position: 'center',
				loops: 3,
				zIndex: ask.DEFAULT_MOB_LAYER,
			})
			o.endFrame = 2
			let dur = .3
			let img = ask.explosion(o, {
				contrastStart: 2,
				brightnessStart: 4,
				sizeStart: 300,
				sizeEnd: 250,
				duration: dur,
				alpha: 1,
				frameDuration: dur,
				ease: Power3.easeOut,
				frameEase: Power0.easeIn,
			})
			ask.fadeOut(img, dur, .1)
	}
	function dragonPunch(o) {
			// ask.sunburst({index: o.index})
			ask.explosion({index: o.index, key: 'burst-fire'}, {duration: 1})
			o.endFrame = 3
			let dur = .5
			let img = ask.explosion(o, {
				contrastStart: 2,
				brightnessStart: 3,
				sizeStart: 200,
				sizeEnd: 250,
				duration: dur,
				alpha: 1,
				frameDuration: dur,
				ease: Power3.easeOut,
				frameEase: Power0.easeIn,
			})
			ask.fadeOut(img, dur, .1)
			ask.particleSmall({
				..._.clone(o),
				key: 'particle-small-fire',
			}, {
				interval: .001,
				loops: 20,
				sizeStart: 24,
				sizeEnd: 4,
				xRange: 400,
				yRange: 50,
			})
	}
	function viperStrike(o) {
		ask.slash(o, {
			duration: .22,
			size: 220,
		})
		o.key = 'viperStrike1'
		ask.slash(o, {
			duration: .18,
			size: 200,
		})
		o.key = 'viperStrike2'
		ask.slash(o, {
			duration: .15,
			size: 180,
		})
		o.key = 'viperStrike3'
		ask.slash(o, {
			duration: .25,
			size: 250,
		})
	}
	function viperStrikeBuff(o) {
		let img = ask.explosion({
			..._.clone(o),
			key: 'viperStrikeBuff'
		}, {
			targetMob: false,
			yStart: ask.centerY(o.index, false) - 50,
			duration: 1,
			sizeStart: 400,
			sizeEnd: 250,
			alpha: 0,
			ease: Power3.easeOut,
		})
		ask.fadeOut(img, 1, .2)
	}
	function viperStrikeHeal(o) {
		ask.explosion({index: o.index, key: 'burst-poison'}, {targetMob: false, duration: .5})
	}
	function palmStrike(o) {
			ask.explosion({index: o.index, key: 'burst-ice'}, {duration: 1})
			o.endFrame = 1
			let dur = .33
			let img = ask.explosion(o, {
				contrastStart: 2,
				brightnessStart: 3,
				sizeStart: 80,
				sizeEnd: 250,
				duration: dur,
				alpha: 1,
				frameDuration: dur,
				ease: Power2.easeOut,
				frameEase: Power0.easeIn,
			})
			ask.fadeOut(img, dur, .1)
			ask.nova({index: o.index, key: 'cast-swirl-default'}, {
				position: 'center',
				loops: 3,
				zIndex: ask.DEFAULT_MOB_LAYER,
			})
			ask.particleSmall({
				..._.clone(o),
				key: 'particle-small-default',
			}, {
				interval: .001,
				loops: 15,
				sizeStart: 24,
				sizeEnd: 4,
				xRange: 400,
				yRange: 50,
			})
	}
	function mendingAura(o) {
		ask.explosion(o, {
			targetMob: false,
			duration: 1.2
		})
	}
	function spiritBarrier(o) {
		ask.explosion(o, {
			targetMob: false,
			duration: 1.2
		})
	}
}($, _, TweenMax, Power0, Power1, Power2, Power3, Power4);