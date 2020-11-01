!function($, _, TweenMax, undefined) {
	skill.MNK = {
		tigerStrike,
		hyperStrike,
		hyperStrikeHit,
		mimeStrike,
		craneKick,
		chakraBlast,
		hadoken,
		hurricaneKicks,
		dragonPunch,
		viperStrike,
		viperStrikeHit,
		viperStrikeHeal,
		palmStrike,
		innerSanctum,
		spiritBarrier,
	}
	let enhancedDamage, hit, config, tgt, damages = []
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
		if (my.buffFlags.mimeStrike) damages = mimeStrikeHit(damages)

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
		if (my.buffFlags.mimeStrike) damages = mimeStrikeHit(damages)

		combat.txDamageMob(damages)
		spell.triggerSkillCooldown(index, data)
		button.triggerGlobalCooldown()
	}
	function hyperStrikeHit(damages) {
		let d = []
		damages.forEach(damage => {
			d.push({
				key: 'hyperStrikeBuff',
				index: my.row,
				level: my.skills[damage.index],
				damage: 0
			})
		})
		combat.txBuffHero(d)
	}
	function mimeStrikeHit(dam) {
		battle.removeBuff('mimeStrike')
		return dam.concat(dam)
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
			key: 'mimeStrike',
			index: my.target,
			enhancedDamage: enhancedDamage,
			hitBonus: data.hitBonus[my.skills[index]],
		}
		damages.push(hit)
		if (my.buffFlags.mimeStrike) damages = mimeStrikeHit(damages)

		combat.txDamageMob(damages)
		spell.triggerSkillCooldown(index, data)
		button.triggerGlobalCooldown()

		combat.txBuffHero([{
			key: 'mimeStrike',
			index: my.row,
			level: my.skills[index],
			damage: 0
		}])
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
		if (my.buffFlags.mimeStrike) damages = mimeStrikeHit(damages)

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
		enhancedDamage = data.enhancedDamage[my.skills[index]]
		damages = []
		mobs.forEach((m, tgt) => {
			hit = {
				...stats.skillDamage(tgt, data.critBonus[my.skills[index]]),
				key: 'chakraBlast',
				index: tgt,
				damageType: DAMAGE_TYPE.ARCANE,
				enhancedDamage: enhancedDamage,
			}
			damages.push(hit)
		})
		if (my.buffFlags.mimeStrike) damages = mimeStrikeHit(damages)
		combat.txDamageMob(damages)
		spell.triggerSkillCooldown(index, data)
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
		enhancedDamage = data.enhancedDamage[my.skills[index]]
		damages = []
		hit = {
			...stats.skillDamage(my.target, data.critBonus[my.skills[index]]),
			key: 'hadoken',
			index: my.target,
			damageType: DAMAGE_TYPE.ARCANE,
			enhancedDamage: enhancedDamage,
		}
		damages.push(hit)
		if (my.buffFlags.mimeStrike) damages = mimeStrikeHit(damages)
		combat.txDamageMob(damages)

		spell.triggerSkillCooldown(index, data)
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
		let originalTarget = my.target
		for (var i=0; i<3; i++) {
			delayedCall((i * .33) + .33, hurricaneKickHit, [originalTarget, data, index])
		}
		spell.triggerSkillCooldown(index, data)
		button.triggerGlobalCooldown()
	}
	function hurricaneKickHit(originalTarget, data, index) {
		let damages = []
		let splashIndex = -1
		let enhancedDamage = data.enhancedDamage[my.skills[index]]
		for (var j=0; j<3; j++) {
			let tgt = battle.getSplashTarget(splashIndex++, originalTarget)
			if (mob.isAlive(tgt)) {
				let hit = stats.skillDamage(tgt, data.critBonus[my.skills[index]])
				damages.push({
					...hit,
					key: 'hurricaneKicks',
					index: tgt,
					enhancedDamage: enhancedDamage,
					hitBonus: data.hitBonus[my.skills[index]],
				})
			}
		}
		if (my.buffFlags.mimeStrike) damages = mimeStrikeHit(damages)
		combat.txDamageMob(damages)
	}
	function dragonPunch(index, data) {
		// check constraints
		config = {
			...skills.getDefaults(index, data),
			requiresFrontRow: data.requiresFrontRow,
		}
		if (skills.notReady(config)) return
		spell.expendMana(data, index)

		// process skill data
		enhancedDamage = data.enhancedDamage[my.skills[index]]
		damages = []
		for (var i=0; i<3; i++) {
			hit = {
				...stats.skillDamage(my.target, data.critBonus[my.skills[index]]),
				key: 'dragonPunch',
				index: my.target,
				damageType: DAMAGE_TYPE.FIRE,
				enhancedDamage: enhancedDamage,
			}
			if (i < 2) hit.damage *= .33
			else hit.effects = { stagger: true }
			damages.push(hit)
		}
		if (my.buffFlags.mimeStrike) damages = mimeStrikeHit(damages)
		combat.txDamageMob(damages)
		spell.triggerSkillCooldown(index, data)
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
		damages = []
		hit = {
			key: 'viperStrike',
			index: my.target,
			enhancedDamage: data.enhancedDamage[my.skills[index]],
			hitBonus: data.hitBonus[my.skills[index]],
			...stats.skillDamage(my.target, data.critBonus[my.skills[index]]),
		}
		damages.push(hit)
		if (my.buffFlags.mimeStrike) damages = mimeStrikeHit(damages)
		combat.txDamageMob(damages)

		spell.triggerSkillCooldown(index, data)
		button.triggerGlobalCooldown()
	}
	function viperStrikeHit(damages) {
		let d = []
		damages.forEach(damage => {
			d.push({
				key: 'viperStrikeBuff',
				index: my.row,
				level: my.skills[damage.index],
				damage: 0
			})
		})
		combat.txBuffHero(d)
	}
	function viperStrikeHeal() {
		combat.txHotHero([{
			index: my.row,
			key: 'viperStrikeHeal',
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			damage: (buffs.viperStrikeBuff.leech[my.buffs.viperStrikeBuff.level] * my.buffs.viperStrikeBuff.stacks)
		}])
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
			effects: { stagger: true },
			buffs: [{
				i: tgt,
				row: my.row, // this identifies unique buff state/icon
				key: 'paralyze', // this sets the flag,
				duration: buffs.arclightDebuff.duration,
			}]
		})
		if (my.buffFlags.mimeStrike) damages = mimeStrikeHit(damages)
		combat.txDamageMob(damages)
		spell.triggerSkillCooldown(index, data)
		button.triggerGlobalCooldown()
	}
	function innerSanctum(index, data) {
		// check constraints
		config = {
			...skills.getDefaults(index, data),
			anyTarget: true,
			oocEnabled: true,
		}
		if (skills.notReady(config)) return
		spell.expendSpirit(data, index)

		// process skill data
		combat.txBuffHero([{
			index: my.row,
			key: 'innerSanctum',
			level: my.skills[index],
			damage: 0
		}])
		spell.triggerSkillCooldown(index, data)
		// button.triggerGlobalCooldown()

		combat.autoAttackDisable()
	}
	function spiritBarrier(index, data) {
		// check constraints
		config = {
			...skills.getDefaults(index, data),
			fixTarget: false,
			isMob: false,
			oocEnabled: true,
		}
		if (skills.notReady(config)) return
		spell.expendSpirit(data, index)

		// process skill data
		combat.txBuffHero([{
			key: 'spiritBarrier',
			index: my.target,
			level: my.skills[index],
			damage: 0
		}])
		spell.triggerSkillCooldown(index, data)
		button.triggerGlobalCooldown()
	}
}($, _, TweenMax);