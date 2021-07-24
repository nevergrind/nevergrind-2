!function($, _, TweenMax, Linear, undefined) {
	skill.RNG = {
		crossSlash,
		explosiveShot,
		trueshotStrike,
		spreadShot,
		bladeStorm,
		suppressingVolley,
		getHighestSuppressingVolleyStack,
		burningEmbers,
		burningEmbersCompleted,
		shockNova,
		faerieFlame,
		fungalGrowth,
		shimmeringOrb,
		spiritOfTheHunter,
	}
	let enhancedDamage, hit, config, tgt, maxSuppressingVolleyStack, key
	let damages = []
	///////////////////////////////////////////
	function crossSlash(index, data) {
		// console.info('crossSlash', index)
		// check constraints
		config = {
			...skills.getDefaults(index, data),
			requiresFrontRow: data.requiresFrontRow,
		}
		if (skills.notReady(config, data)) return
		spell.expendMana(data, index)

		// process skill data
		enhancedDamage = data.enhancedDamage[my.skills[index]]
		damages = []

		for (var i = my.target - 1; i<=my.target+1; i++) {
			if (i <= 4) {
				hit = stats.skillDamage(i, data.critBonus[my.skills[index]])
				damages.push({
					...hit,
					key: 'crossSlash',
					index: i,
					enhancedDamage: enhancedDamage,
					hitBonus: data.hitBonus[my.skills[index]],
					requiresFrontRow: data.requiresFrontRow,
				})
			}
		}
		combat.txDamageMob(damages)
		// animate timers
		button.triggerGlobalCooldown()
	}

	function explosiveShot(index, data) {
		// check constraints
		config = {
			...skills.getDefaults(index, data),
		}
		if (skills.notReady(config, data)) return
		spell.expendMana(data, index)

		// process skill data
		enhancedDamage = data.enhancedDamage[my.skills[index]]
		damages = []
		battle.getConeTargets(my.target).forEach(tgt => {
			hit = stats.rangedDamage(tgt, data.critBonus[my.skills[index]])
			damages.push({
				...hit,
				key: 'explosiveShot',
				index: tgt,
				addDamageBypass: data.addDamageBypass,
				enhancedDamage: enhancedDamage,
				hitBonus: data.hitBonus[my.skills[index]],
				damageType: data.damageType,
			})
			console.info('damages', damages)
		})
		combat.txDamageMob(damages)

		// animate timers
		spell.triggerSkillCooldown(index, data)
		button.triggerGlobalCooldown()
	}
	function trueshotStrike(index, data) {
		// check constraints
		config = {
			...skills.getDefaults(index, data),
		}
		if (skills.notReady(config, data)) return
		spell.expendMana(data, index)

		// process skill data
		let tgt = my.target
		enhancedDamage = data.enhancedDamage[my.skills[index]]
		damages = []
		hit = stats.rangedDamage(tgt, data.critBonus[my.skills[index]])
		// console.info('trueshot', data);
		damages.push({
			...hit,
			key: 'trueshotStrike',
			index: tgt,
			isPiercing: data.isPiercing,
			enhancedDamage: enhancedDamage,
			hitBonus: data.hitBonus[my.skills[index]],
		})
		combat.txDamageMob(damages)

		// animate timers
		spell.triggerSkillCooldown(index, data)
		button.triggerGlobalCooldown()
	}
	function spreadShot(index, data) {
		// check constraints
		config = {
			...skills.getDefaults(index, data),
		}
		if (skills.notReady(config, data)) return
		spell.expendMana(data, index)

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
			hit = stats.rangedDamage(target, data.critBonus[my.skills[index]])
			damages.push({
				...hit,
				key: 'spreadShot',
				index: target,
				enhancedDamage: enhancedDamage,
				hitBonus: data.hitBonus[my.skills[index]],
			})
		})
		combat.txDamageMob(damages)

		// animate timers
		spell.triggerSkillCooldown(index, data)
		button.triggerGlobalCooldown()
	}
	function bladeStorm(index, data) {
		// check constraints
		config = {
			...skills.getDefaults(index, data),
		}
		if (skills.notReady(config, data)) return
		spell.expendMana(data, index)

		// process skill data
		enhancedDamage = data.enhancedDamage[my.skills[index]]
		let tgt = my.target
		let hits = 5
		damages = []
		for (var i=0; i<hits; i++) {
			let finalBlow = i === hits - 1
			hit = stats.skillDamage(tgt, finalBlow ? 100 : data.critBonus[my.skills[index]], false)
			hit.damage = finalBlow ? hit.damage * 4 : hit.damage
			damages.push({
				...hit,
				key: 'bladeStorm',
				index: tgt,
				enhancedDamage: enhancedDamage,
				hitBonus: data.hitBonus[my.skills[index]],
			})
		}
		combat.txDamageMob(damages)

		socket.publish('party' + my.partyId, {
			route: 'p->damage',
			animate: true,
			row: my.row,
			index: tgt,
			key: 'bladeStorm',
		})
		// animate timers
		spell.triggerSkillCooldown(index, data)
		button.triggerGlobalCooldown()
	}
	function suppressingVolley(index, data) {
		// check constraints
		config = {
			...skills.getDefaults(index, data),
		}
		if (skills.notReady(config, data)) return
		spell.expendMana(data, index)

		// process skill data
		enhancedDamage = data.enhancedDamage[my.skills[index]]
		damages = []
		battle.getConeTargets(my.target).forEach(tgt => {
			hit = stats.rangedDamage(tgt, data.critBonus[my.skills[index]])
			damages.push({
				...hit,
				index: tgt,
				key: 'suppressingVolley',
				enhancedDamage: enhancedDamage,
				hitBonus: data.hitBonus[my.skills[index]],
				buffs: [{
					i: tgt, // target
					row: my.row, // this identifies unique buff state/icon
					key: 'suppressingVolley', // this sets the flag
				}],
			})
		})
		combat.txDamageMob(damages)
		// animate timers
		spell.triggerSkillCooldown(index, data)
		button.triggerGlobalCooldown()
		// special effects
	}
	function getHighestSuppressingVolleyStack(index) {
		maxSuppressingVolleyStack = 0
		for (key in mobs[index].buffs) {
			if (mobs[index].buffs[key].key === 'suppressingVolley' &&
				mobs[index].buffs[key].duration > 0 && // must be active
				mobs[index].buffs[key].stacks > maxSuppressingVolleyStack) {
				maxSuppressingVolleyStack = mobs[index].buffs[key].stacks
			}
		}
		return maxSuppressingVolleyStack

	}
	function burningEmbers(index, data) {
		if (timers.castBar < 1) return
		// check constraints
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, burningEmbersCompleted)
	}
	function burningEmbersCompleted() {
		damages = []
		damages.push({
			index: spell.config.target,
			key: 'burningEmbers',
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			buffs: [{
				i: spell.config.target, // target
				row: my.row, // this identifies unique buff state/icon
				key: 'burningEmbers', // this sets the flag
			}],
			...stats.spellDamage(spell.config.target)
		})
		combat.txDamageMob(damages)
		spell.triggerSkillCooldown(spell.config.skillIndex)
	}
	function shockNova(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
			anyTarget: true,
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, shockNovaCompleted)
	}
	function shockNovaCompleted() {
		damages = []
		for (var i=0; i<mob.max; i++) {
			if (mob.isAlive(i)) {
				damages.push({
					index: i,
					key: 'shockNova',
					spellType: spell.data.spellType,
					damageType: spell.data.damageType,
					isMob: spell.config.isMob,
					effects: { stagger: spell.data.staggers },
					...stats.spellDamage(i)
				})
			}
		}
		combat.txDamageMob(damages)
		spell.triggerSkillCooldown(spell.config.skillIndex)
	}
	function faerieFlame(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, faerieFlameCompleted)
	}
	function faerieFlameCompleted() {
		damages = []
		damages.push({
			index: spell.config.target,
			key: 'faerieFlame',
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			buffs: [{
				i: spell.config.target, // target
				row: my.row, // this identifies unique buff state/icon
				key: 'faerieFlame', // this sets the flag
			}],
			...stats.spellDamage(spell.config.target)
		})
		combat.txDamageMob(damages)
		spell.triggerSkillCooldown(spell.config.skillIndex)
	}
	function fungalGrowth(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
			fixTarget: false,
			isMob: false,
			oocEnabled: true,
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, fungalGrowthCompleted)
	}
	function fungalGrowthCompleted() {
		combat.txHotHero([{
			index: spell.config.target,
			key: 'fungalGrowth',
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage(spell.config.target, -100)
		}])
	}
	function shimmeringOrb(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
			fixTarget: false,
			isMob: false,
			oocEnabled: true,
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, shimmeringOrbCompleted)
	}
	function shimmeringOrbCompleted() {
		damages = []
		damages.push({
			index: spell.config.target,
			key: 'shimmeringOrb',
			spellType: spell.data.spellType,
			level: my.skills[spell.config.skillIndex],
			...stats.spellDamage(spell.config.target, -100)
		})
		combat.txBuffHero(damages)
		spell.triggerSkillCooldown(spell.config.skillIndex)
	}

	function spiritOfTheHunter(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
			fixTarget: false,
			isMob: false,
			oocEnabled: true,
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, spiritOfTheHunterCompleted)
	}
	function spiritOfTheHunterCompleted() {
		damages = []
		damages.push({
			index: spell.config.target,
			key: 'spiritOfTheHunter',
			spellType: spell.data.spellType,
			level: my.skills[spell.config.skillIndex],
			...stats.spellDamage(spell.config.target, -100)
		})
		combat.txBuffHero(damages)
		spell.triggerSkillCooldown(spell.config.skillIndex)
	}
}($, _, TweenMax, Linear);