!function($, _, TweenMax, undefined) {
	skill.NEC = {
		maxCurseOfShadows: 0,
		venomBolt,
		explosivePlague,
		explosivePlagueExplode,
		bloodFire,
		demonicPact,
		hauntingVision,
		icingDeath,
		curseOfShadows,
		gleamOfMadness,
		drainSoul,
		breathOfTheDead,
		defiledSpirit,
		bloodSacrifice,
	}
	///////////////////////////////////////////
	let enhancedDamage, hit, config, i, key, splashIndex, tgt, damages = []
	///////////////////////////////////////////
	function venomBolt(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, venomBoltCompleted)
	}
	function venomBoltCompleted() {
		combat.txDamageMob([{
			key: 'venomBolt',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage()
		}])
	}
	function explosivePlague(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, explosivePlagueCompleted)
	}
	function explosivePlagueCompleted() {
		damages = []
		damages.push({
			key: 'explosivePlague',
			index: spell.config.target,
			damageType: spell.data.damageType,
			spellType: spell.data.spellType,
			...stats.spellDamage(false, true)
		})
		combat.txDotMob(damages)
	}
	function explosivePlagueExplode(index, damage) {
		splashIndex = -2
		damages = []
		for (i=0; i<5; i++) {
			tgt = battle.getSplashTarget(splashIndex++, index)
			damages.push({
				key: 'explosivePlagueExplosion',
				index: tgt,
				damageType: spell.data.damageType,
				damage: damage * 4,
			})
		}
		combat.txDamageMob(damages)
	}
	function bloodFire(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, bloodFireCompleted)
	}
	function bloodFireCompleted() {
		// dd
		combat.txDamageMob([{
			key: 'bloodFire',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage()
		}])
		// dot
		damages = []
		damages.push({
			key: 'bloodFire',
			index: spell.config.target,
			damageType: spell.data.damageType,
			spellType: spell.data.spellType,
			...stats.spellDamage(false, true)
		})
		combat.txDotMob(damages)
	}
	function demonicPact(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, demonicPactCompleted)
	}
	function demonicPactCompleted() {
		// dd
		combat.txDamageMob([{
			key: 'demonicPact',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage()
		}])
		// dot
		damages = []
		damages.push({
			key: 'demonicPact',
			index: spell.config.target,
			damageType: spell.data.damageType,
			spellType: spell.data.spellType,
			level: my.skills[spell.index],
			...stats.spellDamage(false, true)
		})
		combat.txDotMob(damages)
		spell.triggerCooldown(spell.config.skillIndex)
	}
	function hauntingVision(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, hauntingVisionCompleted)
	}
	function hauntingVisionCompleted() {
		splashIndex = -1
		damages = []
		for (var i=0; i<3; i++) {
			tgt = battle.getSplashTarget(splashIndex++)
			damages.push({
				key: 'hauntingVision',
				index: tgt,
				spellType: spell.data.spellType,
				damageType: spell.data.damageType,
				...stats.spellDamage(),
				buffs: [{
					i: tgt, // target
					row: my.row, // this identifies unique buff state/icon
					key: 'fear', // this sets the flag,
					duration: 12,
				}],
			})
		}
		combat.txDamageMob(damages)
	}
	function icingDeath(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, icingDeathCompleted)
	}
	function icingDeathCompleted() {
		splashIndex = -1
		damages = []
		for (var i=0; i<3; i++) {
			tgt = battle.getSplashTarget(splashIndex++)
			damages.push({
				key: 'icingDeath',
				index: tgt,
				spellType: spell.data.spellType,
				damageType: spell.data.damageType,
				...stats.spellDamage(),
				buffs: [{
					i: tgt, // target
					row: my.row, // this identifies unique buff state/icon
					key: 'chill', // this sets the flag,
					duration: 6,
				}],
			})
		}
		combat.txDamageMob(damages)
		spell.triggerCooldown(spell.config.skillIndex)
	}
	function curseOfShadows(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, curseOfShadowsCompleted)
	}
	function curseOfShadowsCompleted() {
		combat.txDotMob([{
			key: 'curseOfShadows',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage(),
		}])
	}
	function gleamOfMadness(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, gleamOfMadnessCompleted)
	}
	function gleamOfMadnessCompleted() {
		combat.txDamageMob([{
			key: 'gleamOfMadness',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage()
		}])
	}
	function drainSoul(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, drainSoulCompleted)
	}
	function drainSoulCompleted() {
		combat.txDamageMob([{
			key: 'drainSoul',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage()
		}])
	}
	function breathOfTheDead(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, breathOfTheDeadCompleted)
	}
	function breathOfTheDeadCompleted() {
		combat.txDamageMob([{
			key: 'breathOfTheDead',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage()
		}])
	}
	function defiledSpirit(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, defiledSpiritCompleted)
	}
	function defiledSpiritCompleted() {
		combat.txDamageMob([{
			key: 'defiledSpirit',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage()
		}])
	}
	function bloodSacrifice(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, bloodSacrificeCompleted)
	}
	function bloodSacrificeCompleted() {
		combat.txDamageMob([{
			key: 'bloodSacrifice',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage()
		}])
	}

}($, _, TweenMax);