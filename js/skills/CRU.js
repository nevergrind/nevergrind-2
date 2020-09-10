!function($, _, TweenMax, undefined) {
	skill.CRU = {
		zealousSlam,
		rebuke,
		vengeance,
		holyShock,
		sealOfDamnation,
		holyWrath,
		divineJudgment,
		blessedHammer,
		sealOfRedemption,
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
	function rebuke(index, data) {
		// check constraints
		config = {
			...skills.getDefaults(index),
		}
		if (skills.notReady(config)) return

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
	function vengeance(index, data) {
		// check constraints
		config = {
			...skills.getDefaults(index),
		}
		if (skills.notReady(config)) return

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
	function holyShock(index, data) {
		// check constraints
		config = {
			...skills.getDefaults(index),
		}
		if (skills.notReady(config)) return

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
	function sealOfDamnation(index, data) {
		// check constraints
		config = {
			...skills.getDefaults(index),
		}
		if (skills.notReady(config)) return

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
	function sealOfRedemption(index, data) {
		// check constraints
		config = {
			...skills.getDefaults(index),
		}
		if (skills.notReady(config)) return

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