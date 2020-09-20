!function($, _, TweenMax, undefined) {
	skill.MNK = {
		tigerStrike,
		hyperStrike,
		mimeStrike,
		craneKick,
		chakraBlast,
		hadoken,
		hurricaneKicks,
		dragonPunch,
		viperStrike,
		palmStrike,
		sacrifice,
		spiritBarrier,
	}
	let enhancedDamage, hit, config, i, splashIndex, tgt, damages = [], dam, key
	///////////////////////////////////////////
	function tigerStrike(index, data) {
		// check constraints
		config = {
			...skills.getDefaults(index, data),
		}
		if (skills.notReady(config)) return
		spell.expendMana(data, index)

		// process skill data
		tgt = my.target
		damages = []
		damages.push({
			key: 'tigerStrike',
			index: tgt,
			enhancedDamage: data.enhancedDamage[my.skills[index]],
			hitBonus: data.hitBonus[my.skills[index]],
			...stats.skillDamage(tgt, data.critBonus[my.skills[index]]),
		})
		combat.txDamageMob(damages)
		button.triggerGlobalCooldown()
	}
	function hyperStrike(index, data) {
		// check constraints
		config = {
			...skills.getDefaults(index, data),
		}
		if (skills.notReady(config)) return
		spell.expendMana(data, index)

		// process skill data
		tgt = my.target
		damages = []
		damages.push({
			key: 'hyperStrike',
			index: tgt,
			enhancedDamage: data.enhancedDamage[my.skills[index]],
			hitBonus: data.hitBonus[my.skills[index]],
			...stats.skillDamage(tgt, data.critBonus[my.skills[index]]),
		})
		combat.txDamageMob(damages)
		button.triggerGlobalCooldown()
	}
	function mimeStrike(index, data) {
		// check constraints
		config = {
			...skills.getDefaults(index, data),
		}
		if (skills.notReady(config)) return
		spell.expendMana(data, index)

		// process skill data
		tgt = my.target
		damages = []
		damages.push({
			key: 'mimeStrike',
			index: tgt,
			enhancedDamage: data.enhancedDamage[my.skills[index]],
			hitBonus: data.hitBonus[my.skills[index]],
			...stats.skillDamage(tgt, data.critBonus[my.skills[index]]),
		})
		combat.txDamageMob(damages)
		button.triggerGlobalCooldown()
	}
	function craneKick(index, data) {
		// check constraints
		config = {
			...skills.getDefaults(index, data),
		}
		if (skills.notReady(config)) return
		spell.expendMana(data, index)

		// process skill data
		tgt = my.target
		damages = []
		damages.push({
			key: 'craneKick',
			index: tgt,
			enhancedDamage: data.enhancedDamage[my.skills[index]],
			hitBonus: data.hitBonus[my.skills[index]],
			...stats.skillDamage(tgt, data.critBonus[my.skills[index]]),
		})
		combat.txDamageMob(damages)
		button.triggerGlobalCooldown()
	}
	function chakraBlast(index, data) {
		// check constraints
		config = {
			...skills.getDefaults(index, data),
		}
		if (skills.notReady(config)) return
		spell.expendMana(data, index)

		// process skill data
		tgt = my.target
		damages = []
		damages.push({
			key: 'chakraBlast',
			index: tgt,
			enhancedDamage: data.enhancedDamage[my.skills[index]],
			hitBonus: data.hitBonus[my.skills[index]],
			...stats.skillDamage(tgt, data.critBonus[my.skills[index]]),
		})
		combat.txDamageMob(damages)
		button.triggerGlobalCooldown()
	}
	function hadoken(index, data) {
		// check constraints
		config = {
			...skills.getDefaults(index, data),
		}
		if (skills.notReady(config)) return
		spell.expendMana(data, index)

		// process skill data
		tgt = my.target
		damages = []
		damages.push({
			key: 'hadoken',
			index: tgt,
			enhancedDamage: data.enhancedDamage[my.skills[index]],
			hitBonus: data.hitBonus[my.skills[index]],
			...stats.skillDamage(tgt, data.critBonus[my.skills[index]]),
		})
		combat.txDamageMob(damages)
		button.triggerGlobalCooldown()
	}
	function hurricaneKicks(index, data) {
		// check constraints
		config = {
			...skills.getDefaults(index, data),
		}
		if (skills.notReady(config)) return
		spell.expendMana(data, index)

		// process skill data
		tgt = my.target
		damages = []
		damages.push({
			key: 'hurricaneKicks',
			index: tgt,
			enhancedDamage: data.enhancedDamage[my.skills[index]],
			hitBonus: data.hitBonus[my.skills[index]],
			...stats.skillDamage(tgt, data.critBonus[my.skills[index]]),
		})
		combat.txDamageMob(damages)
		button.triggerGlobalCooldown()
	}
	function dragonPunch(index, data) {
		// check constraints
		config = {
			...skills.getDefaults(index, data),
		}
		if (skills.notReady(config)) return
		spell.expendMana(data, index)

		// process skill data
		tgt = my.target
		damages = []
		damages.push({
			key: 'dragonPunch',
			index: tgt,
			enhancedDamage: data.enhancedDamage[my.skills[index]],
			hitBonus: data.hitBonus[my.skills[index]],
			...stats.skillDamage(tgt, data.critBonus[my.skills[index]]),
		})
		combat.txDamageMob(damages)
		button.triggerGlobalCooldown()
	}
	function viperStrike(index, data) {
		// check constraints
		config = {
			...skills.getDefaults(index, data),
		}
		if (skills.notReady(config)) return
		spell.expendSpirit(data, index)

		// process skill data
		tgt = my.target
		damages = []
		damages.push({
			key: 'viperStrike',
			index: tgt,
			enhancedDamage: data.enhancedDamage[my.skills[index]],
			hitBonus: data.hitBonus[my.skills[index]],
			...stats.skillDamage(tgt, data.critBonus[my.skills[index]]),
		})
		combat.txDamageMob(damages)
		button.triggerGlobalCooldown()
	}
	function palmStrike(index, data) {
		// check constraints
		config = {
			...skills.getDefaults(index, data),
		}
		if (skills.notReady(config)) return
		spell.expendSpirit(data, index)

		// process skill data
		tgt = my.target
		damages = []
		damages.push({
			key: 'palmStrike',
			index: tgt,
			enhancedDamage: data.enhancedDamage[my.skills[index]],
			hitBonus: data.hitBonus[my.skills[index]],
			...stats.skillDamage(tgt, data.critBonus[my.skills[index]]),
		})
		combat.txDamageMob(damages)
		button.triggerGlobalCooldown()
	}
	function sacrifice(index, data) {
		// check constraints
		config = {
			...skills.getDefaults(index, data),
		}
		if (skills.notReady(config)) return
		spell.expendSpirit(data, index)

		// process skill data
		tgt = my.target
		damages = []
		damages.push({
			key: 'sacrifice',
			index: tgt,
			enhancedDamage: data.enhancedDamage[my.skills[index]],
			hitBonus: data.hitBonus[my.skills[index]],
			...stats.skillDamage(tgt, data.critBonus[my.skills[index]]),
		})
		combat.txDamageMob(damages)
		button.triggerGlobalCooldown()
	}
	function spiritBarrier(index, data) {
		// check constraints
		config = {
			...skills.getDefaults(index, data),
		}
		if (skills.notReady(config)) return
		spell.expendSpirit(data, index)

		// process skill data
		tgt = my.target
		damages = []
		damages.push({
			key: 'spiritBarrier',
			index: tgt,
			enhancedDamage: data.enhancedDamage[my.skills[index]],
			hitBonus: data.hitBonus[my.skills[index]],
			...stats.skillDamage(tgt, data.critBonus[my.skills[index]]),
		})
		combat.txDamageMob(damages)
		button.triggerGlobalCooldown()
	}
}($, _, TweenMax);