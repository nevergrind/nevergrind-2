!function($, _, TweenMax, Linear, undefined) {
	skill.RNG = {
		crossSlash,
		explosiveShot,
		trueshotStrike,
		spreadShot,
		bladeStorm,
		suppressingVolley,
		ignite,
		igniteCompleted,
		shockNova,
		faerieFlame,
		fungalGrowth,
		shimmeringOrb,
		spiritOfTheHunter,
	}
	let enhancedDamage, hit, config

	let damages = []
	///////////////////////////////////////////
	function crossSlash(index, data) {
		console.info('crossSlash', index)
		// check constraints
		config = {
			skillIndex: index,
			global: true,
			target: true,
			requiresFrontRow: true,
			isMob: true,
		}
		if (skills.notReady(config)) return
		// process skill data
		enhancedDamage = data.enhancedDamage[my.skills[index]]
		damages = []

		for (var i = my.target - 1; i<=my.target+1; i++) {
			hit = stats.damage(i)
			damages.push({
				index: i,
				enhancedDamage: enhancedDamage,
				requiresFrontRow: true,
				...hit
			})
		}
		combat.txDamageMob(damages)
		// animate timers
		timers.skillCooldowns[index] = 0
		button.processButtonTimers(index, data)
		button.triggerGlobalCooldown()
	}

	function explosiveShot(index, data) {
		console.info('explosiveShot', index)
		// check constraints
		config = {
			skillIndex: index,
			global: true,
			target: true,
			isMob: true,
		}
		if (skills.notReady(config)) return
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
		config = {
			skillIndex: index,
			global: true,
			target: true,
			isMob: true,
		}
		if (skills.notReady(config)) return

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
		config = {
			skillIndex: index,
			global: true,
			target: true,
			isMob: true,
		}
		if (skills.notReady(config)) return
		// select targets
		let targets = [my.target]
		mobs.forEach((mob, index) => {
			if (mob.name) {
				if (!targets.includes(index) && targets.length < 5) {
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
		config = {
			skillIndex: index,
			global: true,
			target: true,
			isMob: true,
		}
		if (skills.notReady(config)) return
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
						isMob: config.isMob,
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
		config = {
			skillIndex: index,
			global: true,
			target: true,
			isMob: true,
		}
		if (skills.notReady(config)) return

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
				hate: -1,
				enhancedDamage: enhancedDamage,
				buffs: [{
					i: tgt, // target
					isMob: config.isMob,
					row: my.row, // this identifies unique buff state/icon
					key: 'suppressingVolley', // this sets the flag
				}],
				...hit
			})
		}
		combat.txDamageMob(damages)
		// animate timers
		timers.skillCooldowns[index] = 0
		button.processButtonTimers(index, data)
		button.triggerGlobalCooldown()
		// special effects
	}
	function ignite(index, data) {
		console.info('ignite', index)
		// check constraints
		spell.config = {
			skillIndex: index,
			global: true,
			target: my.target,
			isMob: true,
			fixTarget: true,
			mpCost: data.mp[my.skills[index]],
			name: data.name,
		}
		if (skills.notReady(spell.config)) return
		spell.startCasting(index, data, igniteCompleted)
	}
	function igniteCompleted() {
		info('called: igniteCompleted', spell.config)
		damages = []
		damages.push({
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			buffs: [{
				i: spell.config.target, // target
				isMob: spell.config.isMob,
				row: my.row, // this identifies unique buff state/icon
				key: 'igniteArmor', // this sets the flag
			}],
			...stats.spellDamage()
		})
		combat.txDamageMob(damages)
	}
	function shockNova(index, data) {
		console.info('shockNova', index)
		spell.config = {
			skillIndex: index,
			global: true,
			target: my.target,
			isMob: true,
			fixTarget: true,
			mpCost: data.mp[my.skills[index]],
			name: data.name,
		}
		if (skills.notReady(spell.config)) return
		spell.startCasting(index, data, shockNovaCompleted)
	}
	function shockNovaCompleted() {
		damages = []
		for (var i=0; i<mob.max; i++) {
			if (mobs[i].hp > 0) {
				damages.push({
					index: i,
					spellType: spell.data.spellType,
					damageType: spell.data.damageType,
					isMob: spell.config.isMob,
					interrupt: true,
					...stats.spellDamage()
				})
			}
		}
		combat.txDamageMob(damages)
	}
	function faerieFlame(index, data) {
		console.info('faerieFlame', index)
		spell.config = {
			skillIndex: index,
			global: true,
			target: my.target,
			isMob: true,
			fixTarget: true,
			mpCost: data.mp[my.skills[index]],
			name: data.name,
		}
		if (skills.notReady(spell.config)) return
		spell.startCasting(index, data, faerieFlameCompleted)
	}
	function faerieFlameCompleted() {
		damages = []
		damages.push({
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			buffs: [{
				i: spell.config.target, // target
				isMob: spell.config.isMob,
				row: my.row, // this identifies unique buff state/icon
				key: 'faerieFlame', // this sets the flag
			}],
			...stats.spellDamage()
		})
		combat.txDamageMob(damages)
	}
	function fungalGrowth(index, data) {
		console.info('fungalGrowth', index)
		spell.config = {
			skillIndex: index,
			global: true,
			target: my.target,
			isMob: false,
			oocEnabled: true,
			spCost: data.sp[my.skills[index]],
			name: data.name,
		}
		if (skills.notReady(spell.config)) return
		spell.config.targetName = party.getNameByRow(my.target)
		spell.startCasting(index, data, fungalGrowthCompleted)
	}
	function fungalGrowthCompleted() {
		damages = []
		damages.push({
			index: spell.config.target,
			key: 'fungalGrowth',
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage(false, true) // skill check, noCrit, force noCrit
		})
		console.info('fungalGrowthCompleted', damages)
		combat.txHotHero(spell.config.target, damages)
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