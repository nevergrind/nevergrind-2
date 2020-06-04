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
		console.info('crossSlash', index)
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
			enhancedDamage: enhancedDamage,
			requiresFrontRow: true,
			...hit
		})

		tgt = my.target - 1
		hit = stats.damage(tgt)
		damages.push({
			index: tgt,
			enhancedDamage: enhancedDamage,
			requiresFrontRow: true,
			...hit
		})

		tgt = my.target + 1
		hit = stats.damage(tgt)
		damages.push({
			index: tgt,
			enhancedDamage: enhancedDamage,
			requiresFrontRow: true,
			...hit
		})

		combat.txDamageMob(damages)
		// animate timers
		timers.skillCooldowns[index] = 0
		button.processButtonTimers(index, data)
		button.triggerGlobalCooldown()
	}

	function explosiveShot(index, data) {
		console.info('explosiveShot', index)
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
		let splashIndex = -1
		let tgt
		for (var i=0; i<3; i++) {
			tgt = battle.getSplashTarget(splashIndex++)
			hit = stats.rangedDamage(tgt)
			damages.push({
				index: tgt,
				enhancedDamage: enhancedDamage,
				damageType: 'fire',
				...hit
			})
		}
		combat.txDamageMob(damages)

		// animate timers
		timers.skillCooldowns[index] = 0
		button.processButtonTimers(index, data)
		button.triggerGlobalCooldown()
	}
	function trueshotStrike(index, data) {
		console.info('trueshotStrike', index)
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
			isPiercing: true,
			enhancedDamage: enhancedDamage,
			...hit
		})
		combat.txDamageMob(damages)

		// animate timers
		timers.skillCooldowns[index] = 0
		button.processButtonTimers(index, data)
		button.triggerGlobalCooldown()
	}
	function spreadShot(index, data) {
		console.info('spreadShot', index)
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
		// select targets
		let targets = [my.target]
		mobs.forEach((mob, index) => {
			if (mob.name) {
				if (!targets.includes(index) && targets.length < 5) {
					console.info('asdf mob', index)
					targets.push(index)
				}
			}
		})
		// process skill data
		enhancedDamage = data.enhancedDamage[my.skills[index]]
		damages = []
		targets.forEach(target => {
			hit = stats.rangedDamage(target)
			damages.push({
				index: target,
				enhancedDamage: enhancedDamage,
				...hit
			})
		})
		combat.txDamageMob(damages)

		// animate timers
		timers.skillCooldowns[index] = 0
		button.processButtonTimers(index, data)
		button.triggerGlobalCooldown()
	}
	function bladeStorm(index, data) {
		console.info('bladeStorm', index)
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
		let tgt = my.target
		let hits = 5
		for (var i=0; i<hits; i++) {
			(function(i) {
				delayedCall(i * .2, () => {
					let finalBlow = i === hits - 1
					hit = stats.damage(tgt, finalBlow)
					damages = []
					hit.damage = finalBlow ? hit.damage * 4 : hit.damage
					damages.push({
						index: tgt,
						isPiercing: true,
						enhancedDamage: enhancedDamage,
						...hit
					})
					combat.txDamageMob(damages)
				})
			})(i)
		}

		// animate timers
		timers.skillCooldowns[index] = 0
		button.processButtonTimers(index, data)
		button.triggerGlobalCooldown()
	}
	function suppressingVolley(index, data) {
		console.info('suppressingVolley', index)
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
		let splashIndex = -1
		let tgt
		buff.isSuppressing = []
		for (var i=0; i<3; i++) {
			tgt = battle.getSplashTarget(splashIndex++)
			buff.isSuppressing.push(tgt)
			hit = stats.rangedDamage(tgt)
			damages.push({
				index: tgt,
				hate: -1,
				enhancedDamage: enhancedDamage,
				...hit
			})
		}
		combat.txDamageMob(damages)
		// animate timers
		timers.skillCooldowns[index] = 0
		button.processButtonTimers(index, data)
		button.triggerGlobalCooldown()
		// special effects
		delayedCall(9, () => {
			buff.isSuppressing = []
		})
	}
	function ignite(index, data) {
		console.info('ignite', index)
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
		console.info('shockNova', index)
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
		console.info('faerieFlame', index)
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
		console.info('fungalGrowth', index)
		// check constraints
		// process skill data
		// animate timers
	}
	function shimmeringOrb(index, data) {
		console.info('shimmeringOrb', index)
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
		console.info('spiritOfTheHunter', index)
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