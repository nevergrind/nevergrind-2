var mobEffects;
!function($, _, TweenMax, Linear, undefined) {
	mobEffects = {
		stun,
		stagger,
	}
	///////////////////////////////////////////
	function stun(i, duration) {
		if (duration > timers.mobEffects[i].stunDuration) {
			console.info('mobEffects STUNNED!', i)
			timers.mobStunTimer[i].kill()
			timers.mobAttack[i].pause()
			timers.mobEffects[i].stunDuration = duration
			// timers.mobStunDuration
			timers.mobStunTimer[i] = TweenMax.to(timers.mobEffects[i], duration, {
				stunDuration: 0,
				onComplete: stunComplete,
				onCompleteParams: [i],
				ease: Linear.easeNone,
			})
		}
		else {
			console.warn('mobEffects Stun SKIPPED!', duration, timers.mobEffects[i].stunDuration)
		}
		mob.hit(i, true)
	}
	function stunComplete(i) {
		timers.mobAttack[i].resume()
	}
	function stagger(i) {
		if (timers.mobEffects[i].stunDuration === 0) {
			console.info('mobEffects STAGGERED!', i)
			timers.mobAttack[i].kill()
			timers.mobAttack[i] = delayedCall(mob.mobAttackSpeed(i), mob.attack, [i])
		}
		else {
			console.warn("mobEffects STILL STUNNED", i, timers.mobEffects[i].stunDuration)
		}
		mob.hit(i, true)
	}

}($, _, TweenMax, Linear);