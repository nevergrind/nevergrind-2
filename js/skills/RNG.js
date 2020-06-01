!function($, _, TweenMax, Linear, undefined) {
	skill.RNG = {
		crossSlash,
		explosiveShot,
		trueshotStrike,
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
	let damages, enhancedDamage, hit

	const displayBlock = { display: 'block' }
	///////////////////////////////////////////
	function crossSlash(index, data) {
		info('crossSlash', index)
		// check constraints
		if (timers.skillCooldowns[index] < 1 || timers.globalCooldown < 1) return
		if (!battle.targetIsFrontRow()) {
			chat.log(data.name + ' must target the front row!', 'chat-warning')
			return
		}
		my.fixTarget()
		if (my.target === -1) return
		var mpCost = data.mp[my.skills[index]]
		if (mpCost > my.mp) {
			chat.log('Not enough mana for ' + data.name + '!', 'chat-warning')
			return
		}
		my.mp -= mpCost
		bar.updateBar('mp')
		// process skill data
		enhancedDamage = data.enhancedDamage[my.skills[index]]
		damages = []

		let tgt = my.target
		hit = stats.damage()
		damages.push({
			index: tgt,
			damage: hit.damage,
			isCrit: hit.isCrit,
			enhancedDamage: enhancedDamage,
			requiresFrontRow: true,
			damageType: hit.damageType,
		})

		tgt = my.target - 1
		hit = stats.damage(tgt)
		damages.push({
			index: tgt,
			damage: hit.damage,
			isCrit: hit.isCrit,
			enhancedDamage: enhancedDamage,
			requiresFrontRow: true,
			damageType: hit.damageType,
		})

		tgt = my.target + 1
		hit = stats.damage(tgt)
		damages.push({
			index: tgt,
			damage: hit.damage,
			isCrit: hit.isCrit,
			enhancedDamage: enhancedDamage,
			requiresFrontRow: true,
			damageType: hit.damageType,
		})

		combat.txDamageMob(damages)
		// animate timers
		timers.skillCooldowns[index] = 0
		button.processButtonTimers(index, data)
		button.triggerGlobalCooldown()
	}

	function explosiveShot(index, data) {
		info('explosiveShot', index)
		// check constraints
		if (timers.skillCooldowns[index] < 1 || timers.globalCooldown < 1) return
		my.fixTarget()
		if (my.target === -1) return
		var mpCost = data.mp[my.skills[index]]
		if (mpCost > my.mp) {
			chat.log('Not enough mana for ' + data.name + '!', 'chat-warning')
			return
		}
		my.mp -= mpCost
		bar.updateBar('mp')
		// process skill data
		enhancedDamage = data.enhancedDamage[my.skills[index]]
		damages = []

		let tgt = my.target
		hit = stats.rangedDamage(tgt)
		damages.push({
			index: tgt,
			damage: hit.damage,
			isCrit: hit.isCrit,
			enhancedDamage: enhancedDamage,
			isRanged: hit.isRanged,
			damageType: 'fire',
		})


		tgt = battle.getSplashTarget(-1)
		hit = stats.rangedDamage(tgt)
		damages.push({
			index: tgt,
			damage: hit.damage,
			isCrit: hit.isCrit,
			enhancedDamage: enhancedDamage,
			isRanged: hit.isRanged,
			damageType: 'fire',
		})

		tgt = battle.getSplashTarget(1)
		hit = stats.rangedDamage(tgt)
		damages.push({
			index: tgt,
			damage: hit.damage,
			isCrit: hit.isCrit,
			enhancedDamage: enhancedDamage,
			isRanged: hit.isRanged,
			damageType: 'fire',
		})

		combat.txDamageMob(damages)
		// animate timers
		timers.skillCooldowns[index] = 0
		button.processButtonTimers(index, data)
		button.triggerGlobalCooldown()
	}
	function trueshotStrike(index, data) {
		info('trueshotStrike', index)
		// check constraints
		if (timers.skillCooldowns[index] < 1 || timers.globalCooldown < 1) return
		my.fixTarget()
		if (my.target === -1) return
		var mpCost = data.mp[my.skills[index]]
		if (mpCost > my.mp) {
			chat.log('Not enough mana for ' + data.name + '!', 'chat-warning')
			return
		}
		my.mp -= mpCost
		bar.updateBar('mp')

		// process skill data
		let tgt = my.target
		enhancedDamage = data.enhancedDamage[my.skills[index]]
		damages = []
		hit = stats.rangedDamage(tgt)
		damages.push({
			index: tgt,
			damage: hit.damage,
			isCrit: hit.isCrit,
			isPiercing: true,
			enhancedDamage: enhancedDamage,
			isRanged: hit.isRanged,
			damageType: hit.damageType,
		})
		combat.txDamageMob(damages)

		// animate timers
		timers.skillCooldowns[index] = 0
		button.processButtonTimers(index, data)
		button.triggerGlobalCooldown()
	}
	function spreadShot(index, data) {
		info('spreadShot', index)
		if (timers.skillCooldowns[index] < 1 || timers.globalCooldown < 1) return
		my.fixTarget()
		if (my.target === -1) return
		var mpCost = data.mp[my.skills[index]]
		if (mpCost > my.mp) {
			chat.log('Not enough mana for ' + data.name + '!', 'chat-warning')
			return
		}
		my.mp -= mpCost
		bar.updateBar('mp')
		// check constraints
		// process skill data
		// animate timers
	}
	function bladeStorm(index, data) {
		info('bladeStorm', index)
		if (timers.skillCooldowns[index] < 1 || timers.globalCooldown < 1) return
		my.fixTarget()
		if (my.target === -1) return
		var mpCost = data.mp[my.skills[index]]
		if (mpCost > my.mp) {
			chat.log('Not enough mana for ' + data.name + '!', 'chat-warning')
			return
		}
		my.mp -= mpCost
		bar.updateBar('mp')
		// check constraints
		// process skill data
		// animate timers
	}
	function suppressingVolley(index, data) {
		info('suppressingVolley', index)
		if (timers.skillCooldowns[index] < 1 || timers.globalCooldown < 1) return
		my.fixTarget()
		if (my.target === -1) return
		var mpCost = data.mp[my.skills[index]]
		if (mpCost > my.mp) {
			chat.log('Not enough mana for ' + data.name + '!', 'chat-warning')
			return
		}
		my.mp -= mpCost
		bar.updateBar('mp')
		// check constraints
		// process skill data
		// animate timers
	}
	function ignite(index, data) {
		info('ignite', index)
		if (timers.skillCooldowns[index] < 1 || timers.globalCooldown < 1) return
		my.fixTarget()
		if (my.target === -1) return
		var mpCost = data.mp[my.skills[index]]
		if (mpCost > my.mp) {
			chat.log('Not enough mana for ' + data.name + '!', 'chat-warning')
			return
		}
		my.mp -= mpCost
		bar.updateBar('mp')
		// check constraints
		// process skill data
		// animate timers
	}
	function shockNova(index, data) {
		info('shockNova', index)
		if (timers.skillCooldowns[index] < 1 || timers.globalCooldown < 1) return
		my.fixTarget()
		if (my.target === -1) return
		var mpCost = data.mp[my.skills[index]]
		if (mpCost > my.mp) {
			chat.log('Not enough mana for ' + data.name + '!', 'chat-warning')
			return
		}
		my.mp -= mpCost
		bar.updateBar('mp')
		// check constraints
		// process skill data
		// animate timers
	}
	function faerieFlame(index, data) {
		info('faerieFlame', index)
		if (timers.skillCooldowns[index] < 1 || timers.globalCooldown < 1) return
		my.fixTarget()
		if (my.target === -1) return
		var mpCost = data.mp[my.skills[index]]
		if (mpCost > my.mp) {
			chat.log('Not enough mana for ' + data.name + '!', 'chat-warning')
			return
		}
		my.mp -= mpCost
		bar.updateBar('mp')
		// check constraints
		// process skill data
		// animate timers
	}
	function fungalGrowth(index, data) {
		info('fungalGrowth', index)
		// check constraints
		// process skill data
		// animate timers
	}
	function shimmeringOrb(index, data) {
		info('shimmeringOrb', index)
		if (timers.skillCooldowns[index] < 1 || timers.globalCooldown < 1) return
		my.fixTarget()
		if (my.target === -1) return
		var mpCost = data.mp[my.skills[index]]
		if (mpCost > my.mp) {
			chat.log('Not enough mana for ' + data.name + '!', 'chat-warning')
			return
		}
		my.mp -= mpCost
		bar.updateBar('mp')
		// check constraints
		// process skill data
		// animate timers
	}
	function spiritOfTheHunter(index, data) {
		info('spiritOfTheHunter', index)
		if (timers.skillCooldowns[index] < 1 || timers.globalCooldown < 1) return
		my.fixTarget()
		if (my.target === -1) return
		var mpCost = data.mp[my.skills[index]]
		if (mpCost > my.mp) {
			chat.log('Not enough mana for ' + data.name + '!', 'chat-warning')
			return
		}
		my.mp -= mpCost
		bar.updateBar('mp')
		// check constraints
		// process skill data
		// animate timers
	}
}($, _, TweenMax, Linear);