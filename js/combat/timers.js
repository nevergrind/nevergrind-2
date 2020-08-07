var timers;
!function($, _, TweenMax, undefined) {
	timers = {
		primaryAttack: 1,
		secondaryAttack: 1,
		hpPotion: 1,
		mpPotion: 1,
		spPotion: 1,
		globalCooldown: 1,
		castBar: 1,
		skillCooldowns: [],
		mobAttack: [],
		mobStunTimer: [],
		mobChillTimer: [],
		mobEffects: [],
		primaryAttackCall: delayedCall(0, ''),
		secondaryAttackCall: delayedCall(0, ''),
		frozenBarrier: delayedCall(0, ''),
		init,
		clearMy,
		clearMob,
	}
	///////////////////////////////////////////
	function init() {
		for (var i=0; i<12; i++) {
			// skill cooldowns
			timers.skillCooldowns[i] = 1
		}
		for (var i=0; i<mob.max; i++) {
			// skill cooldowns
			timers.mobAttack[i] = delayedCall(0, '')
			timers.mobStunTimer[i] = delayedCall(0, '')
			timers.mobChillTimer[i] = delayedCall(0, '')
			timers.mobEffects[i] = {
				stunDuration: 0,
				chillDuration: 0,
			}
		}
	}
	function clearMy() {
		timers.primaryAttackCall.kill()
		timers.secondaryAttackCall.kill()
		timers.frozenBarrier.kill()

	}
	function clearMob() {
		// maybe need this I dunno

	}

}($, _, TweenMax);