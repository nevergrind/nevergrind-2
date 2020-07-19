let skill = {};
!function($, _, TweenMax, undefined) {
	skill.WAR = {
		shieldBash,
		rupture,
		ruptureCompleted,
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
		hit = stats.damage(tgt)
		damages.push({
			key: 'shieldBash',
			index: tgt,
			enhancedDamage: enhancedDamage,
			interrupt: true,
			...hit
		})
		console.info('damages', damages)
		combat.txDamageMob(damages)

		// animate timers
		timers.skillCooldowns[index] = 0
		button.processButtonTimers(index, data)
		button.triggerGlobalCooldown()
	}
	function rupture(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
			cannotFizzle: true
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, ruptureCompleted)
	}
	function ruptureCompleted() {
		combat.txDotMob([{
			key: 'rupture',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage(),
		}])
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
			hit = stats.damage(tgt)
			damages.push({
				key: 'whirlwind',
				index: tgt,
				enhancedDamage: enhancedDamage,
				...hit
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
		}
		if (skills.notReady(config)) return

		// process skill data
		let tgt = my.target
		enhancedDamage = data.enhancedDamage[my.skills[index]]
		damages = []
		damages.push({
			key: 'pummel',
			index: tgt,
			isPiercing: true,
			stun: 3,
			enhancedDamage: enhancedDamage,
			...stats.damage(tgt)
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
				key: 'doubleThrow',
				index: tgt,
				isRanged: true,
				interrupt: true,
				enhancedDamage: enhancedDamage,
				...stats.damage(tgt)
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
				hit = stats.damage(i)
				damages.push({
					key: 'shockwave',
					index: i,
					requiresFrontRow: true,
					enhancedDamage: enhancedDamage,
					...hit
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
		// check constraints
		config = {
			...skills.getDefaults(index),
		}
		if (skills.notReady(config)) return

		// process skill data
		let tgt = my.target
		enhancedDamage = data.enhancedDamage[my.skills[index]]
		damages = []
		hit = stats.damage(tgt)
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
	function jumpStrike(index, data) {
		// check constraints
		config = {
			...skills.getDefaults(index),
		}
		if (skills.notReady(config)) return

		// process skill data
		let tgt = my.target
		enhancedDamage = data.enhancedDamage[my.skills[index]]
		damages = []
		hit = stats.damage(tgt)
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
	function primalStomp(index, data) {
		// check constraints
		config = {
			...skills.getDefaults(index),
		}
		if (skills.notReady(config)) return

		// process skill data
		let tgt = my.target
		enhancedDamage = data.enhancedDamage[my.skills[index]]
		damages = []
		hit = stats.damage(tgt)
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
	function bulwark(index, data) {
		// check constraints
		config = {
			...skills.getDefaults(index),
		}
		if (skills.notReady(config)) return

		// process skill data
		let tgt = my.target
		enhancedDamage = data.enhancedDamage[my.skills[index]]
		damages = []
		hit = stats.damage(tgt)
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
		hit = stats.damage(tgt)
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
		hit = stats.damage(tgt)
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

}($, _, TweenMax);