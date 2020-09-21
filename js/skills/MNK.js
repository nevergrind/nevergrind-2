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
	let mimeStatus = false
	///////////////////////////////////////////
	function tigerStrike(index, data) {
		config = {
			...skills.getDefaults(index, data),
		}
		if (skills.notReady(config, data)) return
		spell.expendMana(data, index)

		// process skill data
		enhancedDamage = data.enhancedDamage[my.skills[index]]
		damages = []
		hit = {
			...stats.skillDamage(my.target, data.critBonus[my.skills[index]]),
			key: 'tigerStrike',
			index: my.target,
			enhancedDamage: enhancedDamage,
			hitBonus: data.hitBonus[my.skills[index]],
		}
		damages.push(hit)
		mimeStatus && mimeStrikeHit(hit)
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
		damages = []
		hit = {
			key: 'hyperStrike',
			index: my.target,
			enhancedDamage: data.enhancedDamage[my.skills[index]],
			hitBonus: data.hitBonus[my.skills[index]],
			...stats.skillDamage(my.target, data.critBonus[my.skills[index]]),
		}
		damages.push(hit)
		mimeStatus && mimeStrikeHit(hit)
		combat.txDamageMob(damages)

		combat.txBuffHero([{
			key: 'hyperStrike',
			index: my.row,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			level: my.skills[index],
			damage: 0
		}])
		spell.triggerSkillCooldown(index, data)
		button.triggerGlobalCooldown()
	}
	function mimeStrikeHit(hit) {
		damages.push(hit)
		mimeStatus = false
	}
	function mimeStrike(index, data) {
		// check constraints
		config = {
			...skills.getDefaults(index, data),
		}
		if (skills.notReady(config)) return
		spell.expendMana(data, index)

		// process skill data
		enhancedDamage = data.enhancedDamage[my.skills[index]]
		damages = []
		hit = {
			...stats.skillDamage(my.target, data.critBonus[my.skills[index]]),
			key: 'tigerStrike',
			index: my.target,
			enhancedDamage: enhancedDamage,
			hitBonus: data.hitBonus[my.skills[index]],
		}
		damages.push(hit)
		combat.txDamageMob(damages)
		spell.triggerSkillCooldown(index, data)
		button.triggerGlobalCooldown()
		mimeStatus = true
	}
	function craneKick(index, data) {
		// check constraints
		config = {
			...skills.getDefaults(index, data),
		}
		if (skills.notReady(config)) return
		spell.expendMana(data, index)

		// process skill data
		damages = []
		hit = {
			key: 'craneKick',
			index: my.target,
			enhancedDamage: data.enhancedDamage[my.skills[index]],
			hitBonus: data.hitBonus[my.skills[index]],
			...stats.skillDamage(my.target, data.critBonus[my.skills[index]]),
			buffs: [{
				i: my.target, // target
				row: my.row, // this identifies unique buff state/icon
				key: 'stun', // this sets the flag,
				duration: buffs.craneKick.stunDuration,
			}],
		}
		damages.push(hit)
		mimeStatus && mimeStrikeHit(hit)
		combat.txDamageMob(damages)
		spell.triggerSkillCooldown(index, data)
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