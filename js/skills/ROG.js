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
		lacerateDot,
		backstab,
		widowStrike,
		widowStrikeDot,
		dazzleThrust,
		mirageStrike,
		mirageStrikeHit,
		updateMirageStrikeBuff,
		flashStrike,
		getHighestFlashPowder,
		talismanOfTreachery,
		prowl,
	}
	let enhancedDamage, hit, config, i, splashIndex, tgt, damages = [], dam, key, el, maxFlashPowder
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
			hit = stats.skillDamage(tgt, skills.ROG[1].critBonus[my.skills[damage.index]])
			hit.damage *= buffs.sonicStrike.novaDamage
			damages.push({
				...hit,
				key: 'sonicStrikeNova',
				index: tgt,
				damageType: DAMAGE_TYPE.ARCANE,
				effects: { stagger: skills.ROG[1].staggers },
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
				duration: buffs.fadedStrike.chillDuration,
			}],
		}
		damages.push(hit)

		combat.txDamageMob(damages)
		spell.triggerSkillCooldown(index, data)
		button.triggerGlobalCooldown()
	}
	function fadedStrikeHit(damage) {
		let d = []
		d.push({
			key: 'fadedStrikeBuff',
			index: my.row,
			level: my.skills[damage.index],
			damage: 0
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
		d.push({
			key: 'risingFurorBuff',
			index: my.row,
			level: my.skills[damage.index],
			damage: 0
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
	function lacerateDot(hit) {
		combat.txDotMob([{
			key: 'lacerateDot',
			index: hit.index,
			damageType: buffs.lacerateDot.damageType,
			damage: round(hit.damage * buffs.lacerateDot.dotModifier)
		}])
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
			isRanged: data.isRanged,
			isPiercing: data.isPiercing,
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
		damages.push({
			...stats.skillDamage(my.target, data.critBonus[my.skills[index]]),
			key: 'widowStrike',
			index: my.target,
			enhancedDamage: enhancedDamage,
			hitBonus: data.hitBonus[my.skills[index]],
		})
		combat.txDamageMob(damages)
		spell.triggerSkillCooldown(index, data)
		button.triggerGlobalCooldown()
	}
	function widowStrikeDot(hit) {
		combat.txDotMob([{
			key: 'widowStrikeDot',
			index: hit.index,
			damageType: buffs.widowStrikeDot.damageType,
			damage: round(hit.damage * buffs.widowStrikeDot.dotModifier)
		}])
	}
	function dazzleThrust(index, data) {
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
			key: 'dazzleThrust',
			index: my.target,
			enhancedDamage: enhancedDamage,
			hitBonus: data.hitBonus[my.skills[index]],
			buffs: [{
				i: my.target, // target
				row: my.row, // this identifies unique buff state/icon
				key: 'stun', // this sets the flag,
				duration: buffs.dazzleThrust.stunDuration,
			}],
		})
		combat.txDamageMob(damages)
		spell.triggerSkillCooldown(index, data)
		button.triggerGlobalCooldown()
	}
	function mirageStrike(index, data) {
		config = {
			...skills.getDefaults(index, data),
		}
		if (skills.notReady(config, data)) return
		spell.expendSpirit(data, index)

		// process skill data
		enhancedDamage = data.enhancedDamage[my.skills[index]]
		damages = []
		damages.push({
			...stats.skillDamage(my.target, data.critBonus[my.skills[index]]),
			key: 'mirageStrike',
			index: my.target,
			enhancedDamage: enhancedDamage,
			hitBonus: data.hitBonus[my.skills[index]],
		})
		combat.txDamageMob(damages)
		spell.triggerSkillCooldown(index, data)
		button.triggerGlobalCooldown()
	}
	function mirageStrikeHit(damage) {
		combat.txBuffHero([{
			key: 'mirageStrikeBuff',
			index: my.row,
			level: my.skills[damage.index],
			damage: 0
		}])
	}
	function updateMirageStrikeBuff() {
		my.buffs.mirageStrikeBuff.stacks--
		if (my.buffs.mirageStrikeBuff.stacks) {
			el = querySelector('#mybuff-mirageStrike')
			if (!!el) el.textContent = my.buffs.mirageStrikeBuff.stacks
			chat.log(buffs.mirageStrikeBuff.fadeMsg, CHAT.HEAL)
		}
		else {
			battle.removeBuff('mirageStrikeBuff')
		}
	}
	function flashStrike(index, data) {
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
			key: 'flashStrike',
			index: my.target,
			isRanged: data.isRanged,
			isPiercing: data.isPiercing,
			enhancedDamage: enhancedDamage,
			damageType: data.damageType,
			hitBonus: data.hitBonus[my.skills[index]],
			buffs: [{
				i: my.target, // target
				row: my.row, // this identifies unique buff state/icon
				level: my.skills[index],
				key: 'flashStrike', // this sets the flag
			}],
		}
		damages.push(hit)

		combat.txDamageMob(damages)
		spell.triggerSkillCooldown(index, data)
		button.triggerGlobalCooldown()
	}
	function getHighestFlashPowder(index) {
		maxFlashPowder = 0
		for (key in mobs[index].buffs) {
			if (mobs[index].buffs[key].key === 'flashStrike' &&
				mobs[index].buffs[key].duration > 0 && // must be active
				mobs[index].buffs[key].level > maxFlashPowder) {
				maxFlashPowder = mobs[index].buffs[key].level
			}
		}
		return maxFlashPowder
	}
	function talismanOfTreachery(index, data) {
		config = {
			...skills.getDefaults(index, data),
			fixTarget: false,
			isMob: false,
			oocEnabled: true,
		}
		if (skills.notReady(config, data)) return
		spell.expendSpirit(data, index)

		// process skill data
		combat.txBuffHero([{
			key: 'talismanOfTreachery',
			index: my.target,
			level: my.skills[index],
			damage: 0
		}])
		spell.triggerSkillCooldown(index, data)
		button.triggerGlobalCooldown()
	}
	function prowl(index, data) {
		config = {
			...skills.getDefaults(index, data),
			anyTarget: true,
			oocEnabled: true,
		}
		if (skills.notReady(config, data)) return
		spell.expendSpirit(data, index)

		// process skill data
		combat.txBuffHero([{
			index: my.row,
			key: 'prowl',
			level: my.skills[index],
			damage: 0
		}])
		spell.triggerSkillCooldown(index, data)
	}

}($, _, TweenMax);