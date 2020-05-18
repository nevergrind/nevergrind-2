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
	let arr, damage, damages, enhanceDamage

	const displayBlock = { display: 'block' }
	///////////////////////////////////////////
	function crossSlash(index, data) {
		info('crossSlash', index)
		// check constraints
		if (timers.skillCooldowns[index] < 1 || timers.globalCooldown < 1) return
		if (!battle.targetIsFrontRow()) {
			chat.log('You must choose a target in the front row when using ' + data.name + '!', 'chat-warning')
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
		let tgt = my.target
		enhanceDamage = data.enhancedDamage[my.skills[index]]
		damages = []
		arr = stats.damage().map(dam => dam * enhanceDamage)
		damage = _.random(arr[0], arr[1])
		damages.push({
			index: tgt,
			damage: damage,
			isCrit: arr[2],
		})

		tgt = my.target - 1
		if (battle.targetIsFrontRow(tgt)) {
			arr = stats.damage(tgt).map(dam => dam * enhanceDamage)
			damage = _.random(arr[0], arr[1])
			damages.push({
				index: tgt,
				damage: damage,
				isCrit: arr[2],
			})
		}

		tgt = my.target + 1
		if (battle.targetIsFrontRow(tgt)) {
			arr = stats.damage(tgt).map(dam => dam * enhanceDamage)
			damage = _.random(arr[0], arr[1])
			damages.push({
				index: tgt,
				damage: damage,
				isCrit: arr[2],
			})
		}

		combat.txDamageMobMelee(damages)
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
		let tgt = my.target
		enhanceDamage = data.enhancedDamage[my.skills[index]]
		damages = []
		arr = stats.rangedDamage(tgt).map(dam => dam * enhanceDamage)
		damage = _.random(arr[0], arr[1])
		damages.push({
			index: tgt,
			damage: damage,
			isCrit: arr[2],
		})

		tgt = battle.getSplashTarget(-1)
		if (tgt > -1) {
			arr = stats.rangedDamage(tgt).map(dam => dam * enhanceDamage)
			damage = _.random(arr[0], arr[1])
			damages.push({
				index: tgt,
				damage: damage,
				isCrit: arr[2],
			})
		}

		tgt = battle.getSplashTarget(1)
		if (tgt > -1) {
			arr = stats.rangedDamage(tgt).map(dam => dam * enhanceDamage)
			damage = _.random(arr[0], arr[1])
			damages.push({
				index: tgt,
				damage: damage,
				isCrit: arr[2],
			})
		}

		combat.txDamageMobMelee(damages)
		// animate timers
		timers.skillCooldowns[index] = 0
		button.processButtonTimers(index, data)
		button.triggerGlobalCooldown()
	}
	function trueshotArrow(index, data) {
		info('trueshotArrow', index)
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