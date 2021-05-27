var mobEffects;
!function($, _, TweenMax, Linear, undefined) {
	mobEffects = {
		stun,
		freeze,
		stagger,
		chill,
		fear,
		stasis,
		paralyze,
	}
	///////////////////////////////////////////
	function stasis(i, duration) {
		if (duration > timers.mobEffects[i].stasisDuration) {
			// console.info('mobEffects stasis!', i, duration)
			timers.mobStasisTimer[i].kill()
			timers.mobEffects[i].stasisDuration = duration
			// timers.mobStunDuration
			timers.mobStasisTimer[i] = TweenMax.to(timers.mobEffects[i], duration, {
				stasisDuration: 0,
				onComplete: mob.setFilter,
				onCompleteParams: [i],
				ease: Linear.easeNone,
			})
			mob.setFilter(i)
			// console.info('mob stasis!', i)
		}
	}
	function stun(i, duration) {
		if (duration > timers.mobEffects[i].stunDuration) {
			// console.info('mobEffects STUNNED!', i, duration)
			timers.mobStunTimer[i].kill()
			timers.mobAttack[i].pause()
			timers.mobEffects[i].stunDuration = duration
			// timers.mobStunDuration
			timers.mobStunTimer[i] = TweenMax.to(timers.mobEffects[i], duration, {
				stunDuration: 0,
				onComplete: stunLikeEffectComplete,
				onCompleteParams: [i],
				ease: Linear.easeNone,
			})
			ask.mobStun({
				index: i,
				key: 'particle-small-default',
				duration: duration
			}, true)
		}
		mob.animateHit(i, true, combat.MAX_DAMAGE)
	}
	function freeze(i, duration) {
		if (duration > timers.mobEffects[i].freezeDuration) {
			// console.info('mobEffects FREEZE!', i, duration)
			timers.mobFreezeTimer[i].kill()
			timers.mobAttack[i].pause()
			timers.mobEffects[i].freezeDuration = duration
			// timers.mobStunDuration
			timers.mobFreezeTimer[i] = TweenMax.to(timers.mobEffects[i], duration, {
				freezeDuration: 0,
				onComplete: stunLikeEffectComplete,
				onCompleteParams: [i],
				ease: Linear.easeNone,
			})
			mob.setFilter(i)
		}
		mobs[i].animation.pause()
	}
	function stunLikeEffectComplete(i) {
		if (!timers.mobEffects[i].freezeDuration) {
			mob.resetIdle(i)
		}
		if (!timers.mobEffects[i].stunDuration && !timers.mobEffects[i].freezeDuration) {
			timers.mobAttack[i].resume()
		}
		mob.setFilter(i)
	}
	function stagger(i) {
		// console.info('mobEffects STAGGERED!', i)
		timers.mobAttack[i].kill()
		timers.mobAttack[i] = delayedCall(mob.getMobAttackSpeed(i), mob.attack, [i])
		mob.animateHit(i, true, combat.MAX_DAMAGE)
	}
	function chill(i, duration) {
		if (duration > timers.mobEffects[i].chillDuration) {
			// console.info('mobEffects chill!', i)
			timers.mobChillTimer[i].kill()
			timers.mobEffects[i].chillDuration = duration
			timers.mobChillTimer[i] = TweenMax.to(timers.mobEffects[i], duration, {
				chillDuration: 0,
				onComplete: chillComplete,
				onCompleteParams: [i],
				ease: Linear.easeNone,
			})
			mob.setTimeScaleSpeed(i)
			mob.setFilter(i)
		}
	}
	function chillComplete(i) {
		mob.setTimeScaleSpeed(i)
		mob.setFilter(i)
	}
	function fear(i, duration) {
		if (duration > timers.mobEffects[i].fearDuration) {
			// console.info('mobEffects FEARED!', i)
			timers.mobFearTimer[i].kill()
			timers.mobEffects[i].fearDuration = duration
			timers.mobFearTimer[i] = TweenMax.to(timers.mobEffects[i], duration, {
				fearDuration: 0,
				ease: Linear.easeNone,
			})
		}
	}
	function paralyze(i, duration) {
		if (duration > timers.mobEffects[i].paralyzeDuration) {
			// console.info('mobEffects PARALYZED!', i)
			timers.mobFearTimer[i].kill()
			timers.mobEffects[i].paralyzeDuration = duration
			timers.mobFearTimer[i] = TweenMax.to(timers.mobEffects[i], duration, {
				paralyzeDuration: 0,
				ease: Linear.easeNone,
			})
		}
	}
}($, _, TweenMax, Linear);