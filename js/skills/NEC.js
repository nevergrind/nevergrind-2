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
		panicStrike,
		drainSoul,
		lichForm,
		engulfingDarkness,
		profaneSpirit,
		profaneSpiritExplosion,
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
			spellType: spell.data.spellType,
			damageType: 'blood',
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
		spell.triggerCooldown(spell.config.skillIndex)
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
	function panicStrike(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, panicStrikeCompleted)
	}
	function panicStrikeCompleted() {
		damages = []
		damages.push({
			key: 'panicStrike',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage(),
			buffs: [{
				i: spell.config.target, // target
				row: my.row, // this identifies unique buff state/icon
				key: 'fear', // this sets the flag,
				duration: 25,
			}],
		})
		combat.txDamageMob(damages)
		spell.triggerCooldown(spell.config.skillIndex)
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
		damages = []
		hit = stats.spellDamage(false, true)
		damages.push({
			key: 'drainSoul',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			cannotResist: true,
			...hit,
		})
		console.info('drainSoul', hit)
		combat.txDamageMob(damages)
		combat.txHotHero([{
			index: my.row,
			key: 'drainSoul',
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...hit
		}])
		spell.triggerCooldown(spell.config.skillIndex)
	}
	function lichForm(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
			anyTarget: true,
			oocEnabled: true,
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, lichFormCompleted)
	}
	function lichFormCompleted() {
		damages = []
		damages.push({
			index: my.row,
			key: 'lichForm',
			spellType: spell.data.spellType,
			level: my.skills[spell.config.skillIndex],
			damage: 0,
		})
		combat.txBuffHero(damages)
		spell.triggerCooldown(spell.config.skillIndex)
	}
	function engulfingDarkness(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, engulfingDarknessCompleted)
	}
	function engulfingDarknessCompleted() {
		damages = []
		damages.push({
			key: 'engulfingDarkness',
			index: spell.config.target,
			damageType: spell.data.damageType,
			spellType: spell.data.spellType,
			...stats.spellDamage(false, true)
		})
		combat.txDotMob(damages)
		spell.triggerCooldown(spell.config.skillIndex)
	}
	function profaneSpirit(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
			fixTarget: false,
			isMob: false,
			oocEnabled: true,
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, profaneSpiritCompleted)
	}
	function profaneSpiritCompleted() {
		damages = []
		damages.push({
			index: spell.config.target,
			key: 'profaneSpirit',
			spellType: spell.data.spellType,
			level: my.skills[spell.config.skillIndex],
			...stats.spellDamage(false, true)
		})
		combat.txBuffHero(damages)
	}
	function profaneSpiritExplosion(index, data) {
		spell.cancelSpell()
		spell.config = {
			...spell.getDefaults(index, data),
			anyTarget: true,
		}
		spell.startCasting(index, data, profaneSpiritExplosionCompleted)
	}
	function profaneSpiritExplosionCompleted() {
		damages = []
		for (i=0; i<mob.max; i++) {
			if (mobs[i].hp >= 0) {
				damages.push({
					key: 'profaneSpiritExplosion',
					index: i,
					spellType: '',
					damageType: 'poison',
					...stats.spellDamage()
				})
			}
		}
		combat.txDamageMob(damages)
	}

}($, _, TweenMax)