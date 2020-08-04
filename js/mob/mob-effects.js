var mobEffects;
!function($, _, TweenMax, Linear, undefined) {
	mobEffects = {
		stun,
		stagger,
		chill,
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
		console.info('mobEffects STAGGERED!', i)
		timers.mobAttack[i].kill()
		timers.mobAttack[i] = delayedCall(mob.mobAttackSpeed(i), mob.attack, [i])
		mob.hit(i, true)
	}
	function chill(i, duration) {
		if (duration > timers.mobEffects[i].chillDuration) {
			console.info('mobEffects STUNNED!', i)
			timers.mobChillTimer[i].kill()
			timers.mobEffects[i].chillDuration = duration
			// timers.mobStunDuration
			timers.mobChillTimer[i] = TweenMax.to(timers.mobEffects[i], duration, {
				chillDuration: 0,
				onComplete: mob.setTimeScaleSpeed,
				onCompleteParams: [i],
				ease: Linear.easeNone,
			})
			mob.setTimeScaleSpeed(i)
		}
		else {
			console.warn('mobEffects chillDuration SKIPPED!', duration, timers.mobEffects[i].chillDuration)
		}
	}

}($, _, TweenMax, Linear);