!function($, _, TweenMax, Power0, Power1, Power2, Power3, Power4, undefined) {
	ask = {
		...ask,
		shadowBreak,
		deathStrike,
		deathStrikeHeal,
		crescentCleave,
		doomThrust,
		astralBlade,
		ravagingPlague,
		decayingDoom,
		bloodTerror,
		lifeTap,
		lifeTapHeal,
		vampiricFeast,
		vampiricFeastHeal,
		sanguineHarvest,
		sanguineHarvestProc,
		sanguineHarvestHeal,
		markOfRemphan,
	}
	///////////////////////////////////////////

	function shadowBreak(o) {
		ask.explosion({index: o.index, key: 'burst-purple'})
		o.endFrame = 3
		ask.explosion(o, {
			contrastStart: 2,
			brightnessStart: 5,
			sizeStart: 100,
			sizeEnd: 300,
			duration: .4,
			frameDuration: .4,
			frameEase: Power0.easeIn,
		})
	}
	function deathStrike(o) {
		ask.explosion(o, {
			duration: 1.2
		})
	}
	function deathStrikeHeal(o) {
		ask.explosion(o, {
			targetMob: false,
			duration: 1.2
		})
	}
	function crescentCleave(o) {
		ask.explosion(o, {
			duration: 1.2
		})
	}
	function doomThrust(o) {
		ask.explosion(o, {
			duration: 1.2
		})
	}
	function astralBlade(o) {
		ask.explosion(o, {
			duration: 1.2
		})
	}
	function ravagingPlague(o) {
		ask.explosion(o, {
			duration: 1.2
		})
	}
	function decayingDoom(o) {
		ask.explosion(o, {
			duration: 1.2
		})
	}
	function bloodTerror(o) {
		ask.explosion(o, {
			duration: 1.2
		})
	}
	function lifeTap(o) {
		ask.explosion(o, {
			duration: 1.2
		})
	}
	function lifeTapHeal(o) {
		ask.explosion(o, {
			targetMob: false,
			duration: 1.2
		})
	}
	function vampiricFeast(o) {
		ask.explosion(o, {
			duration: 1.2
		})
	}
	function vampiricFeastHeal(o) {
		ask.explosion(o, {
			targetMob: false,
			duration: 1.2
		})
	}
	function sanguineHarvest(o) {
		ask.explosion(o, {
			targetMob: false,
			duration: 1.2
		})
	}
	function sanguineHarvestProc(o) {
		ask.explosion(o, {
			duration: 1.2
		})
	}
	function sanguineHarvestHeal(o) {
		ask.explosion(o, {
			targetMob: false,
			duration: 1.2
		})
	}
	function markOfRemphan(o) {
		ask.explosion(o, {
			duration: 1.2
		})
	}
}($, _, TweenMax, Power0, Power1, Power2, Power3, Power4);