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
		getDefaults,
		expendSpellResources,
		expendMana,
		expendSpirit,
		triggerCooldown,
	}
	let castBarWrap = querySelector('#cast-bar-wrap')
	let castBar = querySelector('#cast-bar')
	let ratio
	let functionName
	let castPenalty = 0
	let castProgress = 0
	let mpCost = 0
	let spCost = 0
	let chance = 0
	let success = 0
	let spellType = ''
	let isShieldActive = false
	///////////////////////////////////////////
	function noop() {}
	function cancelSpell() {
		if (timers.castBar < 1) {
			spell.timer.kill()
			stopCasting()
		}
	}

	const fizzleMaxed = [0, 20, 45, 75, 105, 135, 165, 210, 260]
	const defaultMaxChannel = .5
	function getMaxChannelChance() {
		return my.buffFlags.manaShell ? .6 : defaultMaxChannel
	}
	function channelSuccessful() {
		spellType = skills[my.job][spell.index].spellType
		// console.info('channelSuccessful', spellType)
		if (!spellType) return true
		success = .6 - ((fizzleMaxed[my.skills[spell.index]] - my[spellType]) / 100)
		if (my.buffFlags.manaShell) success += .1
		// constraints
		 // max 50% chance to channel (60 with wiz buff)
		if (success > getMaxChannelChance()) success = getMaxChannelChance()
		else if (success < 0) success = 0 // at worst 0% chance requires 60+ diff

		let resp = rand() < success
		// console.info('channelSuccessful success 2', resp, success)
		// HIGHER success value is better
		return resp
	}
	function shieldsActive() {
		// buffs that help you ignore knockback
		isShieldActive = false
		if (my.buffFlags.guardianAngel ||
			my.buffFlags.sereneSigil) isShieldActive = true
		return isShieldActive
	}
	function knockback() {
		if (timers.castBar < 1 &&
			app.isApp && // knockback only happens in real app for testing purposes
			!shieldsActive() &&
			!channelSuccessful()) {
			// console.info('channelSuccessful knockback', success)
			spell.timer.kill()
			castPenalty = .5 / spell.castTime
			timers.castBar -= castPenalty
			if (timers.castBar < 0) timers.castBar = 0
			/////////////////////////
			castProgress = (1 - (timers.castBar / 1)) * spell.castTime
			// console.info('knockback', castProgress, spell.castTime)
			TweenMax.set(castBar, { x: '-' + spellRatio() + '%' })
			spell.timer = TweenMax.to(timers, castProgress, {
				startAt: { castBar: timers.castBar },
				castBar: 1,
				onUpdate: updateSpellBar,
				ease: Power0.easeIn,
				onComplete: spellComplete,
				onCompleteParams: [spell.callbackFn]
			})
		}
	}

	let castHaste = 1
	function getCastSpeed() {
		castHaste = 1
		if (my.buffFlags.celestialFrenzy) castHaste -= .15
		if (castHaste < .5) castHaste = .5
		else if (castHaste > 2) castHaste = 2
		// console.info('getCastSpeed', spell.castTime * castHaste)
		return spell.castTime * castHaste
	}

	function startCasting(index, data, callbackFn) {
		button.pauseAutoAttack()
		spell.callbackFn = callbackFn
		spell.index = index
		spell.data = data
		spell.castTime = data.castTime
		castBarWrap.style.opacity = 1
		TweenMax.set(castBar, { x: '-100%' })
		spell.timer = TweenMax.to(timers, getCastSpeed(), {
			startAt: { castBar: 0 },
			castBar: 1,
			onUpdate: updateSpellBar,
			ease: Power0.easeIn,
			onComplete: spellComplete,
			onCompleteParams: [spell.callbackFn]
		})
		if (!spell.config.cannotFizzle || !ng.isApp) {
			checkSpellFizzle()
		}
	}
	function spellFizzleChance() {
		spellType = skills[my.job][spell.index].spellType
		chance = .08 + ((fizzleMaxed[my.skills[spell.index]] - my[spellType]) / 100)
		// console.info('chance', chance)
		if (chance < .05) chance = .05
		else if (chance > .8) chance = .8
		// console.info('chance after', chance)
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
		// console.info('complete spell cast:', spell.data.name)
		// console.warn('calling:', functionName)
		// functionName = _.camelCase(spell.data.name + 'Completed')
		expendSpellResources()
		callbackFn()
		combat.levelSkillCheck(spell.data.spellType)
		button.resumeAutoAttack()
	}
	function expendSpellResources(fizzlePenalty) {
		fizzlePenalty = fizzlePenalty ? .1 : 1
		mpCost = 0
		spCost = 0
		if (spell.config.mpCost) {
			mpCost = ~~(spell.config.mpCost * fizzlePenalty)
			if (mpCost < 1) mpCost = 1
			my.mp -= mpCost
			bar.updateBar('mp', my)
		}
		if (spell.config.spCost) {
			spCost = ~~(spell.config.spCost * fizzlePenalty)
			if (spCost < 1) spCost = 1
			my.sp -= spCost
			bar.updateBar('sp', my)
		}
	}
	function stopCasting() {
		timers.castBar = 1
		castBarWrap.style.opacity = 0
		button.resumeAutoAttack()
	}
	// defaults for combat DD on mob
	function getDefaults(skillIndex, data) {
		// console.info('getDefaults', skillIndex)
		return {
			skillIndex: skillIndex,
			global: true,
			isMob: true,
			fixTarget: true,
			target: my.target,
			targetName: getTargetName(),
			oocEnabled: false,
			mpCost: typeof data.mp === TYPE.FUNCTION ? data.mp(my.skills[skillIndex]) : 0,
			spCost: typeof data.sp === TYPE.FUNCTION ? data.sp(my.skills[skillIndex]) : 0,
			name: data.name,
		}
	}
	function getTargetName() {
		if (my.targetIsMob && my.target !== -1) return mobs[my.target].name
		else return my.target === -1 ? '' : party.getNameByRow(my.target)
	}
	function expendMana(data, index) {
		spell.config.mpCost = data.mp(my.skills[index])
		spell.config.spCost = 0
		expendSpellResources()
	}
	function expendSpirit(data, index) {
		spell.config.mpCost = 0
		spell.config.spCost = data.sp(my.skills[index])
		expendSpellResources()
	}
	function triggerCooldown(index, data) {
		timers.skillCooldowns[index] = 0
		button.processButtonTimers(index, data || skills.lastData)
	}
}($, _, TweenMax, Power0);