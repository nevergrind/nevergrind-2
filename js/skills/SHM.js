!function($, _, TweenMax, undefined) {
	skill.SHM = {
		frostRift,
		poisonNova,
		scourge,
		poisonBolt,
		vampiricGaze,
		getMaxVampiricGaze,
		glacialShard,
		affliction,
		devouringSwarm,
		devouringSwarmHeal,
		rejuvinate,
		mysticalGlow,
		mysticalGlowActive,
		vampiricAllure,
		borealTalisman,

	}
	///////////////////////////////////////////
	let enhancedDamage, hit, config, i, splashIndex, tgt, damages = [], maxGaze, key, glowActive
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
				duration: buffs.frostRift.chillDuration,
			}],
			...stats.spellDamage(spell.config.target)
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
			if (mob.isAlive(i)) {
				damages.push({
					key: 'poisonNova',
					index: i,
					spellType: spell.data.spellType,
					damageType: spell.data.damageType,
					...stats.spellDamage(i)
				})
			}
		}
		console.info('nova', damages)
		combat.txDamageMob(damages)
		spell.triggerSkillCooldown(spell.config.skillIndex)
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
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage(spell.config.target)
		}])
		// AE DoT damage
		damages = []
		hit = stats.spellDamage(spell.config.target, -100)
		hit.damage *= buffs.scourge.dotModifier
		damages.push({
			key: 'scourge',
			index: spell.config.target,
			damageType: spell.data.damageType,
			spellType: spell.data.spellType,
			...hit
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
			...stats.spellDamage(spell.config.target)
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
	function getMaxVampiricGaze(index) {
		maxGaze = 0
		for (key in mobs[index].buffs) {
			if (mobs[index].buffs[key].key === 'vampiricGaze' &&
				mobs[index].buffs[key].duration > 0 && // must be active
				mobs[index].buffs[key].level > maxGaze) {
				maxGaze = buffs.vampiricGaze.hpLeech[mobs[index].buffs[key].level]
			}
		}
		return maxGaze
	}
	function vampiricGazeCompleted() {
		damages = []
		damages.push({
			key: 'vampiricGaze',
			index: spell.config.target,
			damageType: spell.data.damageType,
			spellType: spell.data.spellType,
			level: my.skills[spell.index],
			...stats.spellDamage(spell.config.target, -100)
		})
		// console.info('vampiricGaze', damages[Zero])
		combat.txDotMob(damages)
		spell.triggerSkillCooldown(spell.config.skillIndex)
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
		let spellType = spell.data.spellType
		let damageType = spell.data.damageType
		damages = []
		battle.getConeTargets(spell.config.target).forEach(tgt => {
			damages.push({
				key: 'glacialShard',
				index: tgt,
				spellType: spellType,
				damageType: damageType,
				...stats.spellDamage(tgt),
				buffs: [{
					i: tgt, // target
					row: my.row, // this identifies unique buff state/icon
					key: 'freeze', // this sets the flag,
					duration: buffs.glacialShard.freezeDuration,
				}],
			})
		})
		combat.txDamageMob(damages)
		spell.triggerSkillCooldown(spell.config.skillIndex)
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
			spellType: spell.data.spellType,
			...stats.spellDamage(spell.config.target, -100)
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
			spellType: spell.data.spellType,
			...stats.spellDamage(spell.config.target, -100)
		})
		combat.txDotMob(damages)
		spell.triggerSkillCooldown(spell.config.skillIndex)
	}
	function devouringSwarmHeal(data) {
		// combat.updateMyResource(PROP.HP, ~~(data.damage * buffs.devouringSwarm.healRatio))
		combat.txHotHero([{
			index: my.row,
			key: 'devouringSwarmHeal',
			spellType: buffs[data.key].spellType,
			damageType: buffs[data.key].damageType,
			damage: ~~(data.damage * buffs.devouringSwarm.healRatio)
		}])
	}
	function rejuvinate(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
			fixTarget: true,
			isMob: false,
			oocEnabled: true,
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, rejuvinateCompleted)
	}
	function rejuvinateCompleted() {
		damages = []
		damages.push({
			index: spell.config.target,
			name: spell.config.targetName,
			key: 'rejuvinate',
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage(spell.config.target)
		})
		hit = stats.spellDamage(spell.config.target, -100)
		damages.push({
			index: spell.config.target,
			key: 'rejuvinateHot',
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			damage: ~~(hit.damage * buffs.rejuvinateHot.tickPercent),
		})
		combat.txHotHero(damages)
	}
	function mysticalGlow(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
			fixTarget: true,
			isMob: false,
			oocEnabled: true,
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, mysticalGlowCompleted)
	}
	function mysticalGlowCompleted() {
		combat.txHotHero([{
			index: spell.config.target,
			key: 'mysticalGlow',
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage(spell.config.target, -100)
		}])
	}
	function mysticalGlowActive() {
		glowActive = false
		for (key in my.buffs) {
			if (my.buffs[key].key === 'mysticalGlow' &&
				my.buffs[key].duration > 0) {
				glowActive = true
			}
		}
		return glowActive
	}
	function vampiricAllure(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
			fixTarget: true,
			isMob: false,
			oocEnabled: true,
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, vampiricAllureCompleted)
	}
	function vampiricAllureCompleted() {
		damages = []
		damages.push({
			index: spell.config.target,
			key: 'vampiricAllure',
			spellType: spell.data.spellType,
			level: my.skills[spell.config.skillIndex],
			...stats.spellDamage(spell.config.target, -100)
		})
		combat.txBuffHero(damages)
	}
	function borealTalisman(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
			fixTarget: true,
			isMob: false,
			oocEnabled: true,
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, borealTalismanCompleted)
	}
	function borealTalismanCompleted() {
		damages = []
		damages.push({
			index: spell.config.target,
			key: 'borealTalisman',
			spellType: spell.data.spellType,
			level: my.skills[spell.config.skillIndex],
			...stats.spellDamage(spell.config.target, -100)
		})
		combat.txBuffHero(damages)
	}

}($, _, TweenMax);