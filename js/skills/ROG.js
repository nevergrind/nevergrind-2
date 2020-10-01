!function($, _, TweenMax, undefined) {
	skill.ROG = {
		shadowStrike,
		sonicStrike,
		sonicStrikeHit,
		fadedStrike,
		fadedStrikeHit,
		risingFuror,
		risingFurorHit,
		lacerate,
		backstab,
		widowStrike,
		staggerShot,
		evade,
		flashPowder,
		talisman,
		prowl,
	}
	let enhancedDamage, hit, config, i, splashIndex, tgt, damages = [], dam, key
	///////////////////////////////////////////
	function shadowStrike(index, data) {
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
			key: 'shadowStrike',
			index: my.target,
			enhancedDamage: enhancedDamage,
			hitBonus: data.hitBonus[my.skills[index]],
		}
		damages.push(hit)

		combat.txDamageMob(damages)
		button.triggerGlobalCooldown()
	}
	function sonicStrike(index, data) {
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
			key: 'sonicStrike',
			index: my.target,
			enhancedDamage: enhancedDamage,
			hitBonus: data.hitBonus[my.skills[index]],
		}
		damages.push(hit)
		combat.txDamageMob(damages)
		spell.triggerSkillCooldown(index, data)
		button.triggerGlobalCooldown()
	}
	function sonicStrikeHit(damage) {
		let originalTarget = damage.index
		splashIndex = -1
		damages = []
		for (var i=0; i<3; i++) {
			tgt = battle.getSplashTarget(splashIndex++, originalTarget)
			hit = stats.skillDamage(tgt, skills.ROG[2].critBonus[my.skills[damage.index]])
			hit.damage *= .25
			damages.push({
				key: 'sonicStrikeNova',
				index: tgt,
				enhancedDamage: skills.ROG[2].enhancedDamage[my.skills[damage.index]],
				damageType: DAMAGE_TYPE.ARCANE,
				effects: { stagger: true },
				...hit,
			})
		}
		combat.txDamageMob(damages)
	}
	function fadedStrike(index, data) {
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
			key: 'fadedStrike',
			index: my.target,
			enhancedDamage: enhancedDamage,
			hitBonus: data.hitBonus[my.skills[index]],
			buffs: [{
				i: my.target,
				row: my.row, // this identifies unique buff state/icon
				key: 'chill', // this sets the flag,
				duration: 7,
			}],
		}
		damages.push(hit)

		combat.txDamageMob(damages)
		spell.triggerSkillCooldown(index, data)
		button.triggerGlobalCooldown()
	}
	function fadedStrikeHit(damage) {
		let d = []
		damages.forEach(damage => {
			d.push({
				key: 'fadedStrike',
				index: my.row,
				level: my.skills[damage.index],
				damage: 0
			})
		})
		combat.txBuffHero(d)
	}
	function risingFuror(index, data) {
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
			key: 'risingFuror',
			index: my.target,
			enhancedDamage: enhancedDamage,
			hitBonus: data.hitBonus[my.skills[index]],
		}
		damages.push(hit)

		combat.txDamageMob(damages)
		spell.triggerSkillCooldown(index, data)
		button.triggerGlobalCooldown()
	}
	function risingFurorHit(damage) {
		let d = []
		damages.forEach(damage => {
			d.push({
				key: 'risingFuror',
				index: my.row,
				level: my.skills[damage.index],
				damage: 0
			})
		})
		combat.txBuffHero(d)
	}
	function lacerate(index, data) {
		config = {
			...skills.getDefaults(index, data),
		}
		if (skills.notReady(config, data)) return
		spell.expendMana(data, index)

		// process skill data
		enhancedDamage = data.enhancedDamage[my.skills[index]]
		damages = []
		damages.push({
			...stats.skillDamage(my.target, data.critBonus[my.skills[index]]),
			key: 'lacerate',
			index: my.target,
			enhancedDamage: enhancedDamage,
			hitBonus: data.hitBonus[my.skills[index]],
		})
		combat.txDamageMob(damages)
		spell.triggerSkillCooldown(index, data)
		button.triggerGlobalCooldown()
	}
	function backstab(index, data) {
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
			key: 'backstab',
			index: my.target,
			enhancedDamage: enhancedDamage,
			isRanged: true,
			isPiercing: true,
			hitBonus: data.hitBonus[my.skills[index]],
		}
		damages.push(hit)
		combat.txDamageMob(damages)
		spell.triggerSkillCooldown(index, data)
		button.triggerGlobalCooldown()
	}
	function widowStrike(index, data) {
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
			key: 'widowStrike',
			index: my.target,
			enhancedDamage: enhancedDamage,
			hitBonus: data.hitBonus[my.skills[index]],
		}
		damages.push(hit)

		combat.txDamageMob(damages)
		button.triggerGlobalCooldown()
	}
	function staggerShot(index, data) {
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
			key: 'staggerShot',
			index: my.target,
			enhancedDamage: enhancedDamage,
			hitBonus: data.hitBonus[my.skills[index]],
		}
		damages.push(hit)

		combat.txDamageMob(damages)
		button.triggerGlobalCooldown()
	}
	function evade(index, data) {
		config = {
			...skills.getDefaults(index, data),
		}
		if (skills.notReady(config, data)) return
		spell.expendSpirit(data, index)

		// process skill data
		enhancedDamage = data.enhancedDamage[my.skills[index]]
		damages = []
		hit = {
			...stats.skillDamage(my.target, data.critBonus[my.skills[index]]),
			key: 'evade',
			index: my.target,
			enhancedDamage: enhancedDamage,
			hitBonus: data.hitBonus[my.skills[index]],
		}
		damages.push(hit)

		combat.txDamageMob(damages)
		button.triggerGlobalCooldown()
	}
	function flashPowder(index, data) {
		config = {
			...skills.getDefaults(index, data),
		}
		if (skills.notReady(config, data)) return
		spell.expendSpirit(data, index)

		// process skill data
		enhancedDamage = data.enhancedDamage[my.skills[index]]
		damages = []
		hit = {
			...stats.skillDamage(my.target, data.critBonus[my.skills[index]]),
			key: 'flashPowder',
			index: my.target,
			enhancedDamage: enhancedDamage,
			hitBonus: data.hitBonus[my.skills[index]],
		}
		damages.push(hit)

		combat.txDamageMob(damages)
		button.triggerGlobalCooldown()
	}
	function talisman(index, data) {
		config = {
			...skills.getDefaults(index, data),
		}
		if (skills.notReady(config, data)) return
		spell.expendSpirit(data, index)

		// process skill data
		enhancedDamage = data.enhancedDamage[my.skills[index]]
		damages = []
		hit = {
			...stats.skillDamage(my.target, data.critBonus[my.skills[index]]),
			key: 'talisman',
			index: my.target,
			enhancedDamage: enhancedDamage,
			hitBonus: data.hitBonus[my.skills[index]],
		}
		damages.push(hit)

		combat.txDamageMob(damages)
		button.triggerGlobalCooldown()
	}
	function prowl(index, data) {
		config = {
			...skills.getDefaults(index, data),
		}
		if (skills.notReady(config, data)) return
		spell.expendSpirit(data, index)

		// process skill data
		enhancedDamage = data.enhancedDamage[my.skills[index]]
		damages = []
		hit = {
			...stats.skillDamage(my.target, data.critBonus[my.skills[index]]),
			key: 'prowl',
			index: my.target,
			enhancedDamage: enhancedDamage,
			hitBonus: data.hitBonus[my.skills[index]],
		}
		damages.push(hit)

		combat.txDamageMob(damages)
		button.triggerGlobalCooldown()
	}

}($, _, TweenMax);