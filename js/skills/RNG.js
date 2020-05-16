!function($, _, TweenMax, Linear, undefined) {
	skill.RNG = {
		crossSlash,
		explosiveShot,
		trueshotArrow,
		spreadShot,
		bladeStorm,
		suppressingVolley,
		ignite,
		shockNova,
		faerieFlame,
		fungalGrowth,
		shimmeringOrb,
		spiritOfTheHunter,
	}
	let arr, damage, data

	const displayBlock = { display: 'block' }
	///////////////////////////////////////////
	function crossSlash(index, data) {
		var mpCost = data.mp[my.skills[index]]
		info('crossSlash', index, mpCost)
		if (timers.skillCooldowns[index] < 1) return
		/*if (mpCost > my.mp) {
			chat.log('Not enough mana for ' + data.name + '!', 'chat-warning')
			return
		}*/
		my.mp -= mpCost
		bar.updateBar('mp')
		my.fixTarget()
		if (my.target === -1) return

		arr = stats.damage()
		damage = _.random(arr[0], arr[1])
		damage && combat.damageMobMelee(my.target, damage, arr[2])

		timers.skillCooldowns[index] = 0

		let el = querySelector('#skill-timer-0-rotate')
		let textEl = querySelector('#skill-timer-0')

		TweenMax.set(el, displayBlock)
		let args = {
			el: el,
			index: index,
		}
		let obj = {
			onStart: button.handleButtonStart,
			onStartParams: [ args ],
			onUpdate: button.handleButtonUpdate,
			onUpdateParams: [ args ],
			onComplete: button.handleButtonComplete,
			onCompleteParams: [ args ],
			ease: Linear.easeNone
		}

		obj[index] = 1
		let t = {
			el: textEl,
			remaining: data.cooldownTime
		}

		textEl.innerHTML = data.cooldownTime
		TweenMax.to(t, 1, {
			repeat: 8,
			onRepeat: button.updateSkillTime,
			onRepeatParams: [ t ]
		})
		TweenMax.to(timers.skillCooldowns, data.cooldownTime, obj)
		button.triggerGlobalCooldown()
	}
	function explosiveShot(index, data) {
		info('explosiveShot', index)
	}
	function trueshotArrow(index, data) {
		info('trueshotArrow', index)
	}
	function spreadShot(index, data) {
		info('spreadShot', index)
	}
	function bladeStorm(index, data) {
		info('bladeStorm', index)
	}
	function suppressingVolley(index, data) {
		info('suppressingVolley', index)
	}
	function ignite(index, data) {
		info('ignite', index)
	}
	function shockNova(index, data) {
		info('shockNova', index)
	}
	function faerieFlame(index, data) {
		info('faerieFlame', index)
	}
	function fungalGrowth(index, data) {
		info('fungalGrowth', index)
	}
	function shimmeringOrb(index, data) {
		info('shimmeringOrb', index)
	}
	function spiritOfTheHunter(index, data) {
		info('spiritOfTheHunter', index)
	}
}($, _, TweenMax, Linear);