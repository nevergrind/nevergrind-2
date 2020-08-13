!function($, _, TweenMax, undefined) {
	skill.SHM = {
		frostRift,
		poisonNova,
		scourge,
		poisonBolt,
		vampiricGaze,
		glacialShard,
		affliction,
		devouringSwarm,
		devouringSwarmHeal,
		rejuvinate,
		mysticalGlow,
		vampiricAllure,
		borealTalisman,

	}
	///////////////////////////////////////////
	let enhancedDamage, hit, config, i, splashIndex, tgt, damages = []
	///////////////////////////////////////////
	function frostRift(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, frostRiftCompleted)
	}
	function frostRiftCompleted() {
		combat.txDamageMob([{
			key: 'frostRift',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			buffs: [{
				i: spell.config.target,
				row: my.row, // this identifies unique buff state/icon
				key: 'chill', // this sets the flag,
				duration: 5,
			}],
			...stats.spellDamage()
		}])
	}
	function poisonNova(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, poisonNovaCompleted)
	}
	function poisonNovaCompleted() {
		damages = []
		for (i=0; i<mob.max; i++) {
			if (mobs[i].hp >= 0) {
				damages.push({
					key: 'poisonNova',
					index: i,
					spellType: spell.data.spellType,
					damageType: spell.data.damageType,
					...stats.spellDamage()
				})
			}
		}
		combat.txDamageMob(damages)
		timers.skillCooldowns[spell.config.skillIndex] = 0
		button.processButtonTimers(spell.config.skillIndex, skills.lastData)
	}
	function scourge(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, scourgeCompleted)
	}
	function scourgeCompleted() {
		combat.txDamageMob([{
			key: 'scourge',
			index: spell.config.target,
			isPiercing: true,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage()
		}])
		// AE DoT damage
		damages = []
		damages.push({
			key: 'scourge',
			index: spell.config.target,
			damageType: spell.data.damageType,
			...stats.spellDamage(false, true)
		})
		combat.txDotMob(damages)
	}
	function poisonBolt(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, poisonBoltCompleted)
	}
	function poisonBoltCompleted() {
		combat.txDamageMob([{
			key: 'poisonBolt',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage()
		}])
	}
	function vampiricGaze(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, vampiricGazeCompleted)
	}
	function vampiricGazeCompleted() {
		combat.txDamageMob([{
			key: 'vampiricGaze',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage()
		}])
	}
	function glacialShard(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, glacialShardCompleted)
	}
	function glacialShardCompleted() {
		let originalTarget = spell.config.target
		let spellType = spell.data.spellType
		let damageType = spell.data.damageType
		let splashIndex = -1
		for (var i=0; i<3; i++) {
			let tgt = battle.getSplashTarget(splashIndex++, originalTarget)
			combat.txDamageMob([{
				key: 'glacialShard',
				index: tgt,
				spellType: spellType,
				damageType: damageType,
				buffs: [{
					i: tgt, // target
					row: my.row, // this identifies unique buff state/icon
					key: 'freeze', // this sets the flag,
					duration: 3,
				}],
				...stats.spellDamage()
			}])
		}
		timers.skillCooldowns[spell.config.skillIndex] = 0
		button.processButtonTimers(spell.config.skillIndex, skills.lastData)
	}
	function affliction(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, afflictionCompleted)
	}
	function afflictionCompleted() {
		damages = []
		damages.push({
			key: 'affliction',
			index: spell.config.target,
			damageType: spell.data.damageType,
			...stats.spellDamage(false, true)
		})
		combat.txDotMob(damages)
	}
	function devouringSwarm(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, devouringSwarmCompleted)
	}
	function devouringSwarmCompleted() {
		damages = []
		damages.push({
			key: 'devouringSwarm',
			index: spell.config.target,
			damageType: spell.data.damageType,
			...stats.spellDamage(false, true)
		})
		combat.txDotMob(damages)
		timers.skillCooldowns[spell.config.skillIndex] = 0
		button.processButtonTimers(spell.config.skillIndex, skills.lastData)
	}
	function devouringSwarmHeal(data) {
		console.info('devouringSwarmHeal', ~~(data.damage * buffs.devouringSwarm.healRatio), data)
		combat.updateHeroResource('hp', ~~(data.damage * buffs.devouringSwarm.healRatio))
	}
	function rejuvinate(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, rejuvinateCompleted)
	}
	function rejuvinateCompleted() {
		combat.txDamageMob([{
			key: 'rejuvinate',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage()
		}])
	}
	function mysticalGlow(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, mysticalGlowCompleted)
	}
	function mysticalGlowCompleted() {
		combat.txDamageMob([{
			key: 'mysticalGlow',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage()
		}])
	}
	function vampiricAllure(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, vampiricAllureCompleted)
	}
	function vampiricAllureCompleted() {
		combat.txDamageMob([{
			key: 'vampiricAllure',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage()
		}])
	}
	function borealTalisman(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, borealTalismanCompleted)
	}
	function borealTalismanCompleted() {
		combat.txDamageMob([{
			key: 'borealTalisman',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage()
		}])
	}

}($, _, TweenMax);