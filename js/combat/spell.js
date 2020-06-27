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
	const fizzleMaxed = [0, 10, 35, 65, 95, 125, 155, 200, 250]
	///////////////////////////////////////////
	function noop() {}
	function cancelSpell() {
		if (timers.castBar < 1) {
			spell.timer.kill()
			stopCasting()
		}
	}
	function knockback() {
		if (timers.castBar < 1) {
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
	function checkSpellFizzle() {
		let type = skills[my.job][spell.config.skillIndex].spellType
		let skillLevel = my.skills[spell.index]
		let chance = 1 - (my[type] / fizzleMaxed[skillLevel])
		if (chance < .08) chance = .08
		else if (chance > .8) chance = .8
		console.log('checkSpellFizzle', chance)
		if (rand() < chance) {
			// add mana penalty
			delayedCall(.2, spellFizzle)
		}
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