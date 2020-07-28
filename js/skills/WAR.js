let skill = {};
!function($, _, TweenMax, undefined) {
	skill.WAR = {
		shieldBash,
		rupture,
		whirlwind,
		pummel,
		doubleThrow,
		shockwave,
		frenzy,
		jumpStrike,
		primalStomp,
		bulwark,
		commandingShout,
		furiousCleave,
	}
	///////////////////////////////////////////
	let enhancedDamage, hit, config
	let damages = []

	///////////////////////////////////////////
	function shieldBash(index, data) {
		// check constraints
		config = {
			...skills.getDefaults(index),
		}
		if (skills.notReady(config)) return

		// process skill data
		let tgt = my.target
		enhancedDamage = data.enhancedDamage[my.skills[index]]
		if (items.eq[13]?.itemType === 'shields') enhancedDamage += .5
		damages = []
		damages.push({
			...stats.damage(),
			key: 'shieldBash',
			index: tgt,
			enhancedDamage: enhancedDamage,
		})
		console.info('shieldBash', damages)
		combat.txDamageMob(damages)

		// animate timers
		button.triggerGlobalCooldown()
	}
	function rupture(index, data) {
		config = {
			...skills.getDefaults(index, data),
		}
		if (skills.notReady(config, data)) return

		damages = [{
			key: 'rupture',
			index: my.target,
			isRanged: true,
			isPiercing: true,
			damageType: 'blood',
			...stats.damage(false, false, true)
		}]
		damages[0].damage = damages[0].max
		damages[0].damage = (damages[0].damage * data.enhancedDamage[my.skills[index]]) + my.level

		combat.txDotMob(damages)
		button.triggerGlobalCooldown()
	}
	function whirlwind(index, data) {
		// check constraints
		config = {
			...skills.getDefaults(index),
		}
		if (skills.notReady(config)) return
		// process skill data
		enhancedDamage = data.enhancedDamage[my.skills[index]]
		damages = []
		let splashIndex = -2
		let tgt
		for (var i=0; i<5; i++) {
			tgt = battle.getSplashTarget(splashIndex++)
			hit = stats.damage()
			damages.push({
				...hit,
				key: 'whirlwind',
				index: tgt,
				enhancedDamage: enhancedDamage,
			})
		}
		combat.txDamageMob(damages)

		// animate timers
		timers.skillCooldowns[index] = 0
		button.processButtonTimers(index, data)
		button.triggerGlobalCooldown()
	}
	function pummel(index, data) {
		// check constraints
		config = {
			...skills.getDefaults(index),
			requiresFrontRow: true,
		}
		if (skills.notReady(config)) return

		// process skill data
		let tgt = my.target
		enhancedDamage = data.enhancedDamage[my.skills[index]]
		damages = []
		damages.push({
			...stats.damage(),
			key: 'pummel',
			index: tgt,
			isPiercing: true,
			stun: 3,
			enhancedDamage: enhancedDamage,
		})
		combat.txDamageMob(damages)

		// animate timers
		timers.skillCooldowns[index] = 0
		button.processButtonTimers(index, data)
		button.triggerGlobalCooldown()
	}
	function doubleThrow(index, data) {
		// check constraints
		config = {
			...skills.getDefaults(index),
		}
		if (skills.notReady(config)) return

		// process skill data
		let tgt = my.target
		enhancedDamage = data.enhancedDamage[my.skills[index]]
		damages = []
		for (var i=0; i<2; i++) {
			damages.push({
				...stats.damage(),
				key: 'doubleThrow',
				index: tgt,
				isRanged: true,
				stagger: true,
				enhancedDamage: enhancedDamage,
			})
			if (battle.targetIsBackRow(tgt)) {
				damages[i].damage *= 2
			}
		}
		combat.txDamageMob(damages)

		// animate timers
		timers.skillCooldowns[index] = 0
		button.processButtonTimers(index, data)
		button.triggerGlobalCooldown()
	}
	function shockwave(index, data) {
		console.info('crossSlash', index)
		// check constraints
		config = {
			...skills.getDefaults(index),
			anyTarget: true,
		}
		if (skills.notReady(config)) return

		// process skill data
		enhancedDamage = data.enhancedDamage[my.skills[index]]
		if (items.eq[13]?.itemType === 'shields') enhancedDamage += .2
		damages = []
		for (var i = 0; i<=4; i++) {
			if (mobs[i].hp) {
				hit = stats.damage()
				damages.push({
					...hit,
					key: 'shockwave',
					index: i,
					requiresFrontRow: true,
					enhancedDamage: enhancedDamage,
				})
			}
		}
		combat.txDamageMob(damages)
		// animate timers
		timers.skillCooldowns[index] = 0
		button.processButtonTimers(index, data)
		button.triggerGlobalCooldown()
	}
	function frenzy(index, data) {
		config = {
			...skills.getDefaults(index),
			mpCost: data.mp(my.skills[index]),
			anyTarget: true,
			oocEnabled: true,
		}
		if (skills.notReady(config)) return
		spell.config.mpCost = data.mp(my.skills[index])
		spell.config.spCost = 0
		spell.expendSpellResources()

		combat.txBuffHero([{
			index: my.row,
			key: 'frenzy',
			level: my.skills[index],
			damage: 0
		}])

		// animate timers
		timers.skillCooldowns[index] = 0
		button.processButtonTimers(index, data)
	}

	const jumpStrikeDuration = 1.5
	function jumpStrike(index, data) {
		// check constraints
		config = {
			...skills.getDefaults(index),
			isPiercing: true,
			mpCost: data.mp(my.skills[index])
		}
		if (skills.notReady(config)) return
		spell.config.spCost = 0
		spell.config.mpCost = data.mp(my.skills[index])
		spell.expendSpellResources()

		// buff
		combat.txBuffHero([{
			index: my.row,
			key: 'jumpStrike',
			spellType: '',
			level: my.skills[my.skills[index]],
			damage: 0,
			isCrit: false,
		}])

		// process skill data
		delayedCall(jumpStrikeDuration, () => {
			if (my.hp <= 0) return
			let tgt = my.target
			enhancedDamage = data.enhancedDamage[my.skills[index]]
			damages = []
			hit = stats.damage()
			damages.push({
				...hit,
				index: tgt,
				enhancedDamage: enhancedDamage,
			})
			combat.txDamageMob(damages)
		})

		// animate timers
		timers.skillCooldowns[index] = 0
		button.processButtonTimers(index, data)
		button.triggerGlobalCooldown()
	}
	function primalStomp(index, data) {
		// check constraints
		config = {
			...skills.getDefaults(index),
			mpCost: data.mp(my.skills[index])
		}
		if (skills.notReady(config)) return
		spell.config.spCost = 0
		spell.config.mpCost = data.mp(my.skills[index])
		spell.expendSpellResources()

		// select targets
		let targets = []
		mobs.forEach((mob, index) => {
			if (mob.name) targets.push(index)
		})
		// process skill data
		enhancedDamage = data.enhancedDamage[my.skills[index]]
		damages = []
		targets.forEach(target => {
			hit = stats.damage()
			damages.push({
				...hit,
				key: 'primalStomp',
				index: target,
				stagger: true,
				isRanged: true,
				enhancedDamage: enhancedDamage,
			})
		})
		combat.txDamageMob(damages)

		// animate timers
		timers.skillCooldowns[index] = 0
		button.processButtonTimers(index, data)
		button.triggerGlobalCooldown()
	}
	function bulwark(index, data) {
		console.info('bulwark', data)
		config = {
			...skills.getDefaults(index),
			mpCost: data.sp(my.skills[index]),
			anyTarget: true,
			oocEnabled: true,
		}
		if (skills.notReady(config)) return
		spell.config.spCost = data.sp(my.skills[index])
		spell.config.mpCost = 0
		spell.expendSpellResources()

		combat.txBuffHero([{
			index: my.row,
			key: 'bulwark',
			level: my.skills[index],
			damage: 0
		}])

		// animate timers
		timers.skillCooldowns[index] = 0
		button.processButtonTimers(index, data)
		button.triggerGlobalCooldown()
	}
	function commandingShout(index, data) {
		// check constraints
		config = {
			...skills.getDefaults(index),
		}
		if (skills.notReady(config)) return

		// process skill data
		let tgt = my.target
		enhancedDamage = data.enhancedDamage[my.skills[index]]
		damages = []
		hit = stats.damage()
		damages.push({
			...hit,
			index: tgt,
			isPiercing: true,
			enhancedDamage: enhancedDamage,
		})
		combat.txDamageMob(damages)

		// animate timers
		timers.skillCooldowns[index] = 0
		button.processButtonTimers(index, data)
		button.triggerGlobalCooldown()
	}
	function furiousCleave(index, data) {
		// check constraints
		config = {
			...skills.getDefaults(index),
		}
		if (skills.notReady(config)) return

		// process skill data
		let tgt = my.target
		enhancedDamage = data.enhancedDamage[my.skills[index]]
		damages = []
		hit = stats.damage()
		damages.push({
			...hit,
			index: tgt,
			isPiercing: true,
			enhancedDamage: enhancedDamage,
		})
		combat.txDamageMob(damages)

		// animate timers
		timers.skillCooldowns[index] = 0
		button.processButtonTimers(index, data)
		button.triggerGlobalCooldown()
	}

}($, _, TweenMax);