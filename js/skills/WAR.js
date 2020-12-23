let skill = {};
!function($, _, TweenMax, undefined) {
	skill.WAR = {
		shieldBash,
		rupture,
		ruptureDot,
		whirlwind,
		pummel,
		doubleThrow,
		shockwave,
		frenzy,
		jumpStrike,
		primalStomp,
		bulwark,
		intrepidShout,
		furiousCleave,
	}
	///////////////////////////////////////////
	let enhancedDamage, hit, config
	let damages = []

	///////////////////////////////////////////
	function shieldBash(index, data) {
		// check constraints
		config = {
			...skills.getDefaults(index, data),
		}
		if (skills.notReady(config, data)) return
		spell.expendMana(data, index)

		// process skill data
		let tgt = my.target
		enhancedDamage = data.enhancedDamage[my.skills[index]]
		if (my.shieldIsEquipped()) enhancedDamage += .5
		damages = []
		damages.push({
			...stats.skillDamage(tgt, data.critBonus[my.skills[index]]),
			key: 'shieldBash',
			index: tgt,
			enhancedDamage: enhancedDamage,
			hitBonus: data.hitBonus[my.skills[index]],
		})
		// console.info('shieldBash', damages)
		combat.txDamageMob(damages)

		// animate timers
		button.triggerGlobalCooldown()
	}
	function rupture(index, data) {
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
			key: 'rupture',
			index: my.target,
			isRanged: data.isRanged,
			isPiercing: data.isPiercing,
			enhancedDamage: enhancedDamage,
			hitBonus: data.hitBonus[my.skills[index]],
		})
		combat.txDamageMob(damages)
		button.triggerGlobalCooldown()
	}
	function ruptureDot(hit) {
		combat.txDotMob([{
			key: 'ruptureDot',
			index: hit.index,
			damageType: buffs.ruptureDot.damageType,
			damage: round(hit.damage * buffs.ruptureDot.dotModifier)
		}])
	}
	function whirlwind(index, data) {
		// check constraints
		config = {
			...skills.getDefaults(index, data),
		}
		if (skills.notReady(config, data)) return
		spell.expendMana(data, index)
		// process skill data
		enhancedDamage = data.enhancedDamage[my.skills[index]]
		damages = []
		let splashIndex = -2
		let tgt
		for (var i=0; i<5; i++) {
			tgt = battle.getSplashTarget(splashIndex++)
			hit = stats.skillDamage(tgt, data.critBonus[my.skills[index]])
			damages.push({
				...hit,
				key: 'whirlwind',
				index: tgt,
				enhancedDamage: enhancedDamage,
				hitBonus: data.hitBonus[my.skills[index]],
			})
		}
		combat.txDamageMob(damages)

		// animate timers
		spell.triggerSkillCooldown(index, data)
		button.triggerGlobalCooldown()
	}
	function pummel(index, data) {
		// check constraints
		config = {
			...skills.getDefaults(index, data),
			requiresFrontRow: data.requiresFrontRow,
		}
		if (skills.notReady(config, data)) return
		spell.expendMana(data, index)

		// process skill data
		let tgt = my.target
		enhancedDamage = data.enhancedDamage[my.skills[index]]
		damages = []
		damages.push({
			...stats.skillDamage(tgt, data.critBonus[my.skills[index]]),
			key: 'pummel',
			index: tgt,
			isPiercing: data.isPiercing,
			buffs: [{
				i: tgt, // target
				row: my.row, // this identifies unique buff state/icon
				key: 'stun', // this sets the flag,
				duration: buffs.pummel.stunDuration,
			}],
			enhancedDamage: enhancedDamage,
			hitBonus: data.hitBonus[my.skills[index]],
		})
		combat.txDamageMob(damages)

		// animate timers
		spell.triggerSkillCooldown(index, data)
		button.triggerGlobalCooldown()
	}
	function doubleThrow(index, data) {
		// check constraints
		config = {
			...skills.getDefaults(index, data),
		}
		if (skills.notReady(config, data)) return
		spell.expendMana(data, index)

		// process skill data
		let tgt = my.target
		enhancedDamage = data.enhancedDamage[my.skills[index]]
		if (battle.targetIsBackRow(tgt)) enhancedDamage += buffs.doubleThrow.doubleThrowBonus
		damages = []
		for (var i=0; i<2; i++) {
			damages.push({
				...stats.skillDamage(tgt, data.critBonus[my.skills[index]]),
				key: 'doubleThrow',
				index: tgt,
				isRanged: data.isRanged,
				effects: { stagger: spell.data.staggers },
				enhancedDamage: enhancedDamage,
				hitBonus: data.hitBonus[my.skills[index]],
			})
		}
		combat.txDamageMob(damages)

		// animate timers
		spell.triggerSkillCooldown(index, data)
		button.triggerGlobalCooldown()
	}
	function shockwave(index, data) {
		// console.info('crossSlash', index)
		// check constraints
		config = {
			...skills.getDefaults(index, data),
			anyTarget: true,
		}
		if (skills.notReady(config, data)) return
		spell.expendMana(data, index)

		// process skill data
		enhancedDamage = data.enhancedDamage[my.skills[index]]
		if (my.shieldIsEquipped()) enhancedDamage += .2
		damages = []
		for (var i = 0; i<=4; i++) {
			if (mobs[i].hp) {
				hit = stats.skillDamage(i, data.critBonus[my.skills[index]])
				damages.push({
					...hit,
					key: 'shockwave',
					index: i,
					requiresFrontRow: data.requiresFrontRow,
					effects: { stagger: spell.data.staggers },
					enhancedDamage: enhancedDamage,
					hitBonus: data.hitBonus[my.skills[index]],
				})
			}
		}
		combat.txDamageMob(damages)
		// animate timers
		spell.triggerSkillCooldown(index, data)
		button.triggerGlobalCooldown()
	}
	function frenzy(index, data) {
		config = {
			...skills.getDefaults(index, data),
			anyTarget: true,
			oocEnabled: true,
		}
		if (skills.notReady(config, data)) return
		spell.expendMana(data, index)

		combat.txBuffHero([{
			index: my.row,
			key: 'frenzy',
			level: my.skills[index],
			damage: 0
		}])

		// animate timers
		spell.triggerSkillCooldown(index, data)
	}

	const jumpStrikeDuration = 1.5
	function jumpStrike(index, data) {
		// check constraints
		config = {
			...skills.getDefaults(index, data),
		}
		if (skills.notReady(config, data)) return
		spell.expendMana(data, index)

		// buff
		combat.txBuffHero([{
			index: my.row,
			key: 'jumpStrikeBuff',
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
			hit = stats.skillDamage(tgt, data.critBonus[my.skills[index]])
			damages.push({
				...hit,
				index: tgt,
				key: 'jumpStrike',
				enhancedDamage: enhancedDamage,
				isPiercing: data.isPiercing,
				hitBonus: data.hitBonus[my.skills[index]],
			})
			combat.txDamageMob(damages)
		})

		// animate timers
		spell.triggerSkillCooldown(index, data)
		button.triggerGlobalCooldown()
	}
	function primalStomp(index, data) {
		// check constraints
		config = {
			...skills.getDefaults(index, data),
		}
		if (skills.notReady(config, data)) return
		spell.expendSpirit(data, index)

		// select targets
		let targets = []
		mobs.forEach((mob, index) => {
			if (mob.name) targets.push(index)
		})
		// process skill data
		enhancedDamage = data.enhancedDamage[my.skills[index]]
		damages = []
		targets.forEach(target => {
			hit = stats.skillDamage(target, data.critBonus[my.skills[index]])
			damages.push({
				...hit,
				key: 'primalStomp',
				index: target,
				effects: { stagger: spell.data.staggers },
				isRanged: data.isRanged,
				enhancedDamage: enhancedDamage,
				hitBonus: data.hitBonus[my.skills[index]],
			})
		})
		combat.txDamageMob(damages)

		// animate timers
		spell.triggerSkillCooldown(index, data)
		button.triggerGlobalCooldown()
	}
	function bulwark(index, data) {
		// console.info('bulwark', data)
		config = {
			...skills.getDefaults(index, data),
			anyTarget: true,
			oocEnabled: true,
		}
		if (skills.notReady(config, data)) return
		spell.expendSpirit(data, index)

		combat.txBuffHero([{
			index: my.row,
			key: 'bulwark',
			level: my.skills[index],
			damage: 0
		}])

		// animate timers
		spell.triggerSkillCooldown(index, data)
		button.triggerGlobalCooldown()
	}
	function intrepidShout(index, data) {
		// check constraints
		config = {
			...skills.getDefaults(index, data),
			anyTarget: true,
			oocEnabled: true,
		}
		if (skills.notReady(config, data)) return
		spell.expendSpirit(data, index)

		damages = []
		party.presence.forEach(p => {
			damages.push({
				index: p.row,
				key: 'intrepidShout',
				level: my.skills[index],
			})
		})
		combat.txBuffHero(damages)

		// animate timers
		spell.triggerSkillCooldown(index, data)
		button.triggerGlobalCooldown()
	}
	function furiousCleave(index, data) {
		// check constraints
		config = {
			...skills.getDefaults(index, data),
		}
		if (skills.notReady(config, data)) return
		spell.expendSpirit(data, index)
		// process skill data
		enhancedDamage = data.enhancedDamage[my.skills[index]]
		damages = []
		let splashIndex = -1
		let tgt
		for (var i=0; i<3; i++) {
			tgt = battle.getSplashTarget(splashIndex++)
			damages.push({
				...stats.skillDamage(tgt, data.critBonus[my.skills[index]]),
				key: 'furiousCleave',
				index: tgt,
				enhancedDamage: enhancedDamage,
				hitBonus: data.hitBonus[my.skills[index]],
				buffs: [{
					i: tgt, // target
					row: my.row, // this identifies unique buff state/icon
					key: 'stun', // this sets the flag,
					duration: buffs.furiousCleave.stunDuration,
				}],
			})
		}
		combat.txDamageMob(damages)
		spell.triggerSkillCooldown(index, data)
	}

}($, _, TweenMax);