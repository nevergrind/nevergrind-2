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
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, sealOfDamnationCompleted)
	}
	function sealOfDamnationCompleted() {
		combat.txDamageMob([{
			key: 'sealOfDamnation',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage(),
			buffs: [{
				i: spell.config.target, // target
				row: my.row, // this identifies unique buff state/icon
				key: 'sealOfDamnation', // this sets the flag
			}],
		}])
		spell.triggerCooldown(spell.config.skillIndex)
	}
	function holyWrath(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, holyWrathCompleted)
	}
	function holyWrathCompleted() {
		combat.txDamageMob([{
			key: 'holyWrath',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			buffs: [{
				i: spell.config.target, // target
				row: my.row, // this identifies unique buff state/icon
				key: 'stun', // this sets the flag,
				duration: spell.data.stunDuration,
			}],
			...stats.spellDamage()
		}])
		spell.triggerCooldown(spell.config.skillIndex)
	}
	function divineJudgment(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, divineJudgmentCompleted)
	}
	function divineJudgmentCompleted() {
		combat.txDamageMob([{
			key: 'divineJudgment',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage()
		}])
	}
	function blessedHammer(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, blessedHammerCompleted)
	}
	function blessedHammerCompleted() {
		combat.txDamageMob([{
			key: 'blessedHammer',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage()
		}])
	}
	function sanctuary(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, sanctuaryCompleted)
	}
	function sanctuaryCompleted() {
		combat.txDamageMob([{
			key: 'sanctuary',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage()
		}])
	}
	function divineGrace(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, divineGraceCompleted)
	}
	function divineGraceCompleted() {
		combat.txDamageMob([{
			key: 'divineGrace',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage()
		}])
	}
	function benevolence(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, benevolenceCompleted)
	}
	function benevolenceCompleted() {
		combat.txDamageMob([{
			key: 'benevolence',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage()
		}])
	}
	function jubilee(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, jubileeCompleted)
	}
	function jubileeCompleted() {
		combat.txDamageMob([{
			key: 'jubilee',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage()
		}])
	}

}($, _, TweenMax);