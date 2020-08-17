!function($, _, TweenMax, undefined) {
	skill.NEC = {
		maxPact: 0,
		venomBolt,
		explosivePlague,
		explosivePlagueExplode,
		bloodFire,
		demonicPact,
		getMaxDemonicPact,
		hauntingVision,
		summonSkeleton,
		sanguinePact,
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
		timers.skillCooldowns[spell.config.skillIndex] = 0
		button.processButtonTimers(spell.config.skillIndex, skills.lastData)
	}
	function getMaxDemonicPact(index) {
		skill.NEC.maxPact = 0
		for (key in mobs[index].buffs) {
			if (mobs[index].buffs[key].key === 'demonicPact' &&
				mobs[index].buffs[key].duration > 0 && // must be active
				mobs[index].buffs[key].level > skill.NEC.maxPact) {
				skill.NEC.maxPact = mobs[index].buffs[key].level
			}
		}
		return skill.NEC.maxPact
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
			let tgt = battle.getSplashTarget(splashIndex++)
			damages.push({
				key: 'hauntingVision',
				index: tgt,
				damageType: spell.data.damageType,
				spellType: spell.data.spellType,
				...stats.spellDamage(false, true),
				buffs: [{
					i: tgt, // target
					row: my.row, // this identifies unique buff state/icon
					key: 'fear', // this sets the flag,
					duration: buffs.hauntingVision.duration,
				}],
			})
		}
		combat.txDotMob(damages)
	}
	function summonSkeleton(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, summonSkeletonCompleted)
	}
	function summonSkeletonCompleted() {
		combat.txDamageMob([{
			key: 'summonSkeleton',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage()
		}])
	}
	function sanguinePact(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, sanguinePactCompleted)
	}
	function sanguinePactCompleted() {
		combat.txDamageMob([{
			key: 'sanguinePact',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage()
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