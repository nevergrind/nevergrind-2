var timers;
!function($, _, TweenMax, undefined) {
	timers = {
		primaryAttack: 1,
		secondaryAttack: 1,
		hpPotion: 1,
		mpPotion: 1,
		spPotion: 1,
		hpPotionTimer: delayedCall(0, ''),
		mpPotionTimer: delayedCall(0, ''),
		spPotionTimer: delayedCall(0, ''),
		globalCooldown: 1,
		castBar: 1,
		stunTimer: 1,
		fearTimer: 1,
		paralyzeTimer: 1,
		silenceTimer: 1,
		chillTimer: 1,
		freezeTimer: 1,
		skillCooldowns: [],
		skillCooldownTimers: [],
		// mob timer keys
		mobAttack: [],
		mobStunTimer: [],
		mobStunTween: [],
		mobFreezeTimer: [],
		mobChillTimer: [],
		mobFearTimer: [],
		mobStasisTimer: [],
		// mobEffects
		mobEffects: [],
		primaryAttackCycle: delayedCall(0, ''),
		secondaryAttackCycle: delayedCall(0, ''),
		primaryAttackCall: delayedCall(0, ''),
		secondaryAttackCall: delayedCall(0, ''),
		frozenBarrier: delayedCall(0, ''),
		init,
		clearMy,
		clearMob,
	}
	const mobTimerKeys = [
		'mobAttack',
		'mobStunTimer',
		'mobStunTween',
		'mobFreezeTimer',
		'mobChillTimer',
		'mobFearTimer',
		'mobStasisTimer',
	]
	const defaultDurationObject = {
		stunDuration: 0,
		freezeDuration: 0,
		chillDuration: 0,
		fearDuration: 0,
		paralyzeDuration: 0,
		stasisDuration: 0,
		stunTimestamp: 0,
		fearTimestamp: 0,
		paralyzeTimestamp: 0,
		silenceTimestamp: 0,
		healTimestamp: 0,
	}
	///////////////////////////////////////////
	function init() {
		for (var i=0; i<12; i++) {
			// skill cooldowns
			timers.skillCooldowns[i] = 1
			timers.skillCooldownTimers[i] = delayedCall(0, '')
		}
		for (var i=0; i<mob.max; i++) {
			// skill cooldowns
			mobTimerKeys.forEach(key => {
				timers[key][i] = delayedCall(0, '')
			})
			timers.mobEffects[i] = {
				...defaultDurationObject
			}
		}
	}
	function clearMob(i) {
		mobTimerKeys.forEach(key => {
			timers[key][i].kill()
		})
		timers.mobEffects[i] = {
			...defaultDurationObject
		}
	}
	function clearMy() {
		timers.primaryAttackCall.kill()
		timers.secondaryAttackCall.kill()
		timers.frozenBarrier.kill()

	}

}($, _, TweenMax);