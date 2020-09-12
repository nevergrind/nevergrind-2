!function($, _, TweenMax, undefined) {
	skill.CRU = {
		zealousSlam,
		rebuke,
		vengeance,
		consecrate,
		sealOfDamnation,
		holyWrath,
		divineJudgment,
		blessedHammer,
		sanctuary,
		divineGrace,
		benevolence,
		jubilee,
	}
	let enhancedDamage, hit, config, i, splashIndex, tgt, damages = [], dam, key
	///////////////////////////////////////////
	function zealousSlam(index, data) {
		// check constraints
		config = {
			...skills.getDefaults(index),
		}
		if (skills.notReady(config)) return
		spell.expendMana(data, index)

		// process skill data
		let tgt = my.target
		enhancedDamage = data.enhancedDamage[my.skills[index]]
		damages = []
		hit = {
			...stats.damage(),
			key: 'zealousSlam',
			index: tgt,
			enhancedDamage: enhancedDamage,
			hitBonus: data.hitBonus[my.skills[index]],
		}
		if (rand() > .9) hit.effects = { stagger: true }
		damages.push(hit)
		combat.txDamageMob(damages)
		// animate timers
		button.triggerGlobalCooldown()
	}
	function rebuke(index, data) {
		// check constraints
		config = {
			...skills.getDefaults(index),
		}
		if (skills.notReady(config)) return
		spell.expendMana(data, index)

		// process skill data
		enhancedDamage = data.enhancedDamage[my.skills[index]]
		damages = []
		splashIndex = -1
		for (var i=0; i<3; i++) {
			tgt = battle.getSplashTarget(splashIndex++)
			hit = stats.damage(tgt)
			damages.push({
				...hit,
				key: 'rebuke',
				index: tgt,
				enhancedDamage: enhancedDamage,
				hitBonus: data.hitBonus[my.skills[index]],
				effects: { stagger: true },
			})
		}
		combat.txDamageMob(damages)
		spell.triggerCooldown(index, data)
		button.triggerGlobalCooldown()
	}
	function vengeance(index, data) {
		// check constraints
		config = {
			...skills.getDefaults(index),
			requiresFrontRow: true,
		}
		if (skills.notReady(config)) return
		spell.expendMana(data, index)

		// process skill data
		let tgt = my.target
		enhancedDamage = data.enhancedDamage[my.skills[index]]
		if (mobs[tgt].target === my.row) {
			enhancedDamage += .25
		}
		damages = []
		damages.push({
			...stats.damage(),
			key: 'vengeance',
			index: tgt,
			requiresFrontRow: data.requiresFrontRow,
			enhancedDamage: enhancedDamage,
			hitBonus: data.hitBonus[my.skills[index]],
		})
		combat.txDamageMob(damages)
		spell.triggerCooldown(index, data)
		button.triggerGlobalCooldown()
	}
	function consecrate(index, data) {
		// check constraints
		config = {
			...skills.getDefaults(index),
		}
		if (skills.notReady(config)) return
		spell.expendMana(data, index)

		// process skill data
		let originalTarget = my.target
		enhancedDamage = data.enhancedDamage[my.skills[index]]
		damages = []
		let splashIndex = -2
		for (i=0; i<5; i++) {
			tgt = battle.getSplashTarget(splashIndex++)
			hit = stats.damage()
			if (originalTarget !== tgt) hit.damage *= .5
			damages.push({
				...hit,
				key: 'consecrate',
				index: tgt,
				damageType: originalTarget === tgt ? DAMAGE_TYPE.PHYSICAL : DAMAGE_TYPE.ARCANE,
				enhancedDamage: enhancedDamage,
				hitBonus: data.hitBonus[my.skills[index]],
			})
		}
		combat.txDamageMob(damages)
		spell.triggerCooldown(index, data)
		button.triggerGlobalCooldown()

		combat.txBuffHero([{
			key: 'consecrate',
			index: my.row,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			level: my.skills[index],
			damage: 0
		}])
	}
	function sealOfDamnation(index, data) {
		// check constraints
		config = {
			...skills.getDefaults(index),
		}
		if (skills.notReady(config)) return
		spell.expendMana(data, index)

		// process skill data
		let tgt = my.target
		enhancedDamage = data.enhancedDamage[my.skills[index]]
		if (typeof items.eq[13] === TYPE.OBJECT &&
			items.eq[13].itemType === 'shields') enhancedDamage += .5
		damages = []
		damages.push({
			...stats.damage(),
			key: 'shieldBash',
			index: tgt,
			enhancedDamage: enhancedDamage,
		})
		// console.info('shieldBash', damages)
		combat.txDamageMob(damages)

		// animate timers
		button.triggerGlobalCooldown()
	}
	function holyWrath(index, data) {
		// check constraints
		config = {
			...skills.getDefaults(index),
		}
		if (skills.notReady(config)) return
		spell.expendMana(data, index)

		// process skill data
		let tgt = my.target
		enhancedDamage = data.enhancedDamage[my.skills[index]]
		if (typeof items.eq[13] === TYPE.OBJECT &&
			items.eq[13].itemType === 'shields') enhancedDamage += .5
		damages = []
		damages.push({
			...stats.damage(),
			key: 'shieldBash',
			index: tgt,
			enhancedDamage: enhancedDamage,
		})
		// console.info('shieldBash', damages)
		combat.txDamageMob(damages)

		// animate timers
		button.triggerGlobalCooldown()
	}
	function divineJudgment(index, data) {
		// check constraints
		config = {
			...skills.getDefaults(index),
		}
		if (skills.notReady(config)) return
		spell.expendMana(data, index)

		// process skill data
		let tgt = my.target
		enhancedDamage = data.enhancedDamage[my.skills[index]]
		if (typeof items.eq[13] === TYPE.OBJECT &&
			items.eq[13].itemType === 'shields') enhancedDamage += .5
		damages = []
		damages.push({
			...stats.damage(),
			key: 'shieldBash',
			index: tgt,
			enhancedDamage: enhancedDamage,
		})
		// console.info('shieldBash', damages)
		combat.txDamageMob(damages)

		// animate timers
		button.triggerGlobalCooldown()
	}
	function blessedHammer(index, data) {
		// check constraints
		config = {
			...skills.getDefaults(index),
		}
		if (skills.notReady(config)) return
		spell.expendMana(data, index)

		// process skill data
		let tgt = my.target
		enhancedDamage = data.enhancedDamage[my.skills[index]]
		if (typeof items.eq[13] === TYPE.OBJECT &&
			items.eq[13].itemType === 'shields') enhancedDamage += .5
		damages = []
		damages.push({
			...stats.damage(),
			key: 'shieldBash',
			index: tgt,
			enhancedDamage: enhancedDamage,
		})
		// console.info('shieldBash', damages)
		combat.txDamageMob(damages)

		// animate timers
		button.triggerGlobalCooldown()
	}
	function sanctuary(index, data) {
		// check constraints
		config = {
			...skills.getDefaults(index),
		}
		if (skills.notReady(config)) return
		spell.expendSpirit(data, index)

		// process skill data
		let tgt = my.target
		enhancedDamage = data.enhancedDamage[my.skills[index]]
		if (typeof items.eq[13] === TYPE.OBJECT &&
			items.eq[13].itemType === 'shields') enhancedDamage += .5
		damages = []
		damages.push({
			...stats.damage(),
			key: 'shieldBash',
			index: tgt,
			enhancedDamage: enhancedDamage,
		})
		// console.info('shieldBash', damages)
		combat.txDamageMob(damages)

		// animate timers
		button.triggerGlobalCooldown()
	}
	function divineGrace(index, data) {
		// check constraints
		config = {
			...skills.getDefaults(index),
		}
		if (skills.notReady(config)) return
		spell.expendSpirit(data, index)

		// process skill data
		let tgt = my.target
		enhancedDamage = data.enhancedDamage[my.skills[index]]
		if (typeof items.eq[13] === TYPE.OBJECT &&
			items.eq[13].itemType === 'shields') enhancedDamage += .5
		damages = []
		damages.push({
			...stats.damage(),
			key: 'shieldBash',
			index: tgt,
			enhancedDamage: enhancedDamage,
		})
		// console.info('shieldBash', damages)
		combat.txDamageMob(damages)

		// animate timers
		button.triggerGlobalCooldown()
	}
	function benevolence(index, data) {
		// check constraints
		config = {
			...skills.getDefaults(index),
		}
		if (skills.notReady(config)) return
		spell.expendSpirit(data, index)

		// process skill data
		let tgt = my.target
		enhancedDamage = data.enhancedDamage[my.skills[index]]
		if (typeof items.eq[13] === TYPE.OBJECT &&
			items.eq[13].itemType === 'shields') enhancedDamage += .5
		damages = []
		damages.push({
			...stats.damage(),
			key: 'shieldBash',
			index: tgt,
			enhancedDamage: enhancedDamage,
		})
		// console.info('shieldBash', damages)
		combat.txDamageMob(damages)

		// animate timers
		button.triggerGlobalCooldown()
	}
	function jubilee(index, data) {
		// check constraints
		config = {
			...skills.getDefaults(index),
		}
		if (skills.notReady(config)) return
		spell.expendSpirit(data, index)

		// process skill data
		let tgt = my.target
		enhancedDamage = data.enhancedDamage[my.skills[index]]
		if (typeof items.eq[13] === TYPE.OBJECT &&
			items.eq[13].itemType === 'shields') enhancedDamage += .5
		damages = []
		damages.push({
			...stats.damage(),
			key: 'shieldBash',
			index: tgt,
			enhancedDamage: enhancedDamage,
		})
		// console.info('shieldBash', damages)
		combat.txDamageMob(damages)

		// animate timers
		button.triggerGlobalCooldown()
	}

}($, _, TweenMax);