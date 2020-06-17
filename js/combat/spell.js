var spell;
!function($, _, TweenMax, Power0, undefined) {
	spell = {
		index: -1,
		data: {},
		config: {},
		startCasting,
		stopCasting,
	}
	let castBarWrap = querySelector('#cast-bar-wrap')
	let castBar = querySelector('#cast-bar')
	let ratio
	let functionName
	///////////////////////////////////////////

	function startCasting(index, data, callbackFn) {
		spell.index = index
		spell.data = data
		castBarWrap.style.opacity = 1
		TweenMax.set(castBar, { x: '-100%' })
		TweenMax.to(timers, data.castTime, {
			startAt: { castBar: 0 },
			castBar: 1,
			onUpdate: updateSpellBar,
			ease: Power0.easeIn,
			onComplete: spellComplete,
			onCompleteParams: [callbackFn]
		})

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
		console.info('complete spell cast:', spell.data.name)
		functionName = _.camelCase(spell.data.name + 'Completed')
		console.warn('calling:', functionName)
		let mpCost = typeof spell.data.mp === 'object' ? spell.data.mp[my.skills[spell.index]] : 0
		let spCost = typeof spell.data.sp === 'object' ? spell.data.sp[my.skills[spell.index]] : 0
		if (mpCost) {
			my.mp -= mpCost
			bar.updateBar('mp')
		}
		if (spCost) {
			my.sp -= spCost
			bar.updateBar('sp')
		}
		callbackFn()
	}

	function stopCasting() {
		timers.castBar = 1
		castBarWrap.style.opacity = 0
	}
}($, _, TweenMax, Power0);