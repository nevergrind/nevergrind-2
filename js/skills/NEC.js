!function($, _, TweenMax, undefined) {
	skill.NEC = {
		venomBolt,
		explosivePlague,
		bloodFire,
		demonicPact,
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
	let enhancedDamage, hit, config, i, splashIndex, tgt, damages = []
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
		combat.txDamageMob([{
			key: 'explosivePlague',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage()
		}])
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
		combat.txDamageMob([{
			key: 'bloodFire',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage()
		}])
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
		combat.txDamageMob([{
			key: 'demonicPact',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage()
		}])
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
		combat.txDamageMob([{
			key: 'hauntingVision',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage()
		}])
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