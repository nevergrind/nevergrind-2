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
		frenzyCompleted,
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
			...hit
		})
		console.info('damages', damages)
		combat.txDamageMob(damages)

		// animate timers
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
			requiresFrontRow: true,
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
				stagger: true,
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
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
			anyTarget: true,
			cannotFizzle: true,
			oocEnabled: true,
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, frenzyCompleted)
	}
	function frenzyCompleted() {
		damages = []
		damages.push({
			index: my.row,
			key: 'frenzy',
			spellType: spell.data.spellType,
			level: my.skills[spell.config.skillIndex],
			damage: 0
		})
		combat.txBuffHero(damages)

		// animate timers
		timers.skillCooldowns[spell.config.skillIndex] = 0
		button.processButtonTimers(spell.config.skillIndex, spell.data)
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
			hit = stats.damage(tgt)
			damages.push({
				index: tgt,
				enhancedDamage: enhancedDamage,
				...hit
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
			hit = stats.damage(target)
			damages.push({
				key: 'primalStomp',
				index: target,
				stagger: true,
				isRanged: true,
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