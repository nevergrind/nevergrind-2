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
	let arr, damage

	const displayBlock = { display: 'block' }
	///////////////////////////////////////////
	function crossSlash(index) {
		info('crossSlash', index)
		if (timers.skillCooldowns[index] < 1) return

		my.fixTarget()
		if (my.target === -1) return
		arr = stats.damage()

		damage = _.random(arr[0], arr[1])
		damage && combat.damageMobMelee(my.target, damage, arr[2])

		timers.skillCooldowns[index] = 0

		let el = querySelector('#skill-timer-0-rotate')
		TweenMax.set(el, displayBlock)
		let args = {
			el: el,
			index: index,
		}
		let obj = {
			onUpdate: button.btnUpdate,
			onUpdateParams: [ args ],
			onComplete: button.btnComplete,
			onCompleteParams: [ args ],
			ease: Linear.easeNone
		}
		obj[index] = 1
		TweenMax.to(timers.skillCooldowns, items.eq[12].speed, obj)

		button.triggerGlobalCooldown()
	}
	function explosiveShot(index) {
		info('explosiveShot', index)
	}
	function trueshotArrow(index) {
		info('trueshotArrow', index)
	}
	function spreadShot(index) {
		info('spreadShot', index)
	}
	function bladeStorm(index) {
		info('bladeStorm', index)
	}
	function suppressingVolley(index) {
		info('suppressingVolley', index)
	}
	function ignite(index) {
		info('ignite', index)
	}
	function shockNova(index) {
		info('shockNova', index)
	}
	function faerieFlame(index) {
		info('faerieFlame', index)
	}
	function fungalGrowth(index) {
		info('fungalGrowth', index)
	}
	function shimmeringOrb(index) {
		info('shimmeringOrb', index)
	}
	function spiritOfTheHunter(index) {
		info('spiritOfTheHunter', index)
	}
}($, _, TweenMax, Linear);