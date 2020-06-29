var spell;
!function($, _, TweenMax, Power0, undefined) {
	spell = {
		index: -1,
		data: {},
		config: {},
		callbackFn: noop,
		timer: '',
		castTime: 0,
		startCasting,
		stopCasting,
		cancelSpell,
		knockback,
	}
	let castBarWrap = querySelector('#cast-bar-wrap')
	let castBar = querySelector('#cast-bar')
	let ratio
	let functionName
	let castPenalty = 0
	let castProgress = 0
	let mpCost = 0
	let spCost = 0
	const fizzleMaxed = [0, 20, 45, 75, 105, 135, 165, 210, 260]
	let chance = 0
	let success = 0
	let spellType = ''
	///////////////////////////////////////////
	function noop() {}
	function cancelSpell() {
		if (timers.castBar < 1) {
			spell.timer.kill()
			stopCasting()
		}
	}
	// TODO: Fix cast knockback calc
	function channelSuccessful() {
		spellType = skills[my.job][spell.index].spellType
		success = .6 - ((fizzleMaxed[my.skills[spell.index]] - my[spellType]) / 100)
		//console.info('channelSuccessful success 1', success)
		if (success > .5) success = .5 // max 50% chance to channel
		else if (success < 0) success = 0 // at worst 0% chance requires 60+ diff
		//console.info('channelSuccessful success 2', success)
		return rand() < success
	}
	function knockback() {
		if (timers.castBar < 1 && !channelSuccessful()) {
			spell.timer.kill()
			castPenalty = .5 / spell.castTime
			timers.castBar -= castPenalty
			if (timers.castBar < 0) timers.castBar = 0
			/////////////////////////
			castProgress = 1 - (timers.castBar / spell.castTime)
			TweenMax.set(castBar, { x: '-' + spellRatio() + '%' })
			spell.timer = TweenMax.to(timers, spell.castTime * castProgress, {
				startAt: { castBar: timers.castBar },
				castBar: 1,
				onUpdate: updateSpellBar,
				ease: Power0.easeIn,
				onComplete: spellComplete,
				onCompleteParams: [spell.callbackFn]
			})
		}
	}

	function startCasting(index, data, callbackFn) {
		spell.callbackFn = callbackFn
		spell.index = index
		spell.data = data
		spell.castTime = data.castTime
		castBarWrap.style.opacity = 1
		TweenMax.set(castBar, { x: '-100%' })
		spell.timer = TweenMax.to(timers, spell.castTime, {
			startAt: { castBar: 0 },
			castBar: 1,
			onUpdate: updateSpellBar,
			ease: Power0.easeIn,
			onComplete: spellComplete,
			onCompleteParams: [spell.callbackFn]
		})
		checkSpellFizzle()
	}
	function spellFizzleChance() {
		spellType = skills[my.job][spell.index].spellType
		chance = .08 + ((fizzleMaxed[my.skills[spell.index]] - my[spellType]) / 100)
		console.info('chance', chance)
		if (chance < .05) chance = .05
		else if (chance > .8) chance = .8
		console.info('chance after', chance)
		return rand() < chance
	}
	function checkSpellFizzle() {
		spellFizzleChance() && delayedCall(.2, spellFizzle)
	}
	function spellFizzle() {
		expendSpellResources(true)
		chat.log('Your spell fizzled!', 'chat-spell')
		cancelSpell()
	}
	function expendSpellResources(fizzlePenalty) {
		fizzlePenalty = fizzlePenalty ? .1 : 1
		mpCost = typeof spell.data.mp === 'object' ? spell.data.mp[my.skills[spell.index]] : 0
		spCost = typeof spell.data.sp === 'object' ? spell.data.sp[my.skills[spell.index]] : 0
		if (mpCost) {
			mpCost = ~~(mpCost * fizzlePenalty)
			if (mpCost < 1) mpCost = 1
			my.mp -= mpCost
			bar.updateBar('mp')
		}
		if (spCost) {
			spCost = ~~(spCost * fizzlePenalty)
			if (spCost < 1) spCost = 1
			my.sp -= spCost
			bar.updateBar('sp')
		}
	}

	function updateSpellBar() {
		TweenMax.set(castBar, {
			x: '-' + spellRatio() + '%'
		})
	}

	function spellRatio() {
		ratio = (1 - timers.castBar / 1)
		if (ratio > 1) ratio = 1
		return ratio * 100
	}

	function spellComplete(callbackFn) {
		stopCasting()
		//console.info('complete spell cast:', spell.data.name)
		//console.warn('calling:', functionName)
		functionName = _.camelCase(spell.data.name + 'Completed')
		expendSpellResources()
		callbackFn()
		combat.levelSkillCheck(spell.data.spellType)
	}

	function stopCasting() {
		timers.castBar = 1
		castBarWrap.style.opacity = 0
	}
}($, _, TweenMax, Power0);