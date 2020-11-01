!function($, _, TweenMax, undefined) {
	skill.SHD = {
		shadowBreak,
		deathStrike,
		deathStrikeHeal,
		crescentCleave,
		doomThrust,
		astralBlade,
		ravagingPlague,
		decayingDoom,
		bloodTerror,
		lifeTap,
		vampiricFeast,
		sanguineHarvest,
		procSanguineHarvest,
		markOfRemphan,
		getHighestMarkOfRemphan,
	}
	let enhancedDamage, hit, config, i, splashIndex, tgt, damages = [], dam, key
	///////////////////////////////////////////
	function shadowBreak(index, data) {
		// check constraints
		config = {
			...skills.getDefaults(index, data),
		}
		if (skills.notReady(config)) return
		spell.expendMana(data, index)

		// process skill data
		let tgt = my.target
		enhancedDamage = data.enhancedDamage[my.skills[index]]
		if (my.shieldIsEquipped()) enhancedDamage += .5
		damages = []
		damages.push({
			...stats.skillDamage(tgt, data.critBonus[my.skills[index]]),
			key: 'shadowBreak',
			index: tgt,
			enhancedDamage: enhancedDamage,
			hitBonus: data.hitBonus[my.skills[index]],
		})
		combat.txDamageMob(damages)
		button.triggerGlobalCooldown()
	}
	function deathStrike(index, data) {
		// check constraints
		config = {
			...skills.getDefaults(index, data),
		}
		if (skills.notReady(config)) return
		spell.expendMana(data, index)

		// process skill data
		enhancedDamage = data.enhancedDamage[my.skills[index]]
		damages = []
		damages.push({
			...stats.skillDamage(my.target, data.critBonus[my.skills[index]]),
			key: 'deathStrike',
			index: my.target,
			enhancedDamage: enhancedDamage,
			hitBonus: data.hitBonus[my.skills[index]],
		})
		combat.txDamageMob(damages)
		spell.triggerSkillCooldown(index, data)
		button.triggerGlobalCooldown()
	}
	function deathStrikeHeal(hit) {
		combat.txHotHero([{
			index: my.row,
			key: 'deathStrikeHeal',
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			damage: Math.max(1, round(hit.damage * .2))
		}])
	}
	function crescentCleave(index, data) {
		// check constraints
		config = {
			...skills.getDefaults(index, data),
		}
		if (skills.notReady(config)) return
		spell.expendMana(data, index)

		enhancedDamage = data.enhancedDamage[my.skills[index]]
		damages = []
		splashIndex = -1
		for (var i=0; i<3; i++) {
			tgt = battle.getSplashTarget(splashIndex++)
			damages.push({
				...stats.skillDamage(tgt, data.critBonus[my.skills[index]]),
				key: 'crescentCleave',
				index: tgt,
				enhancedDamage: enhancedDamage,
				hitBonus: data.hitBonus[my.skills[index]],
			})
		}
		combat.txDamageMob(damages)
		spell.triggerSkillCooldown(index, data)
	}
	function doomThrust(index, data) {
		// check constraints
		config = {
			...skills.getDefaults(index, data),
			isRanged: true,
		}
		if (skills.notReady(config)) return
		spell.expendMana(data, index)

		// process skill data
		enhancedDamage = data.enhancedDamage[my.skills[index]]
		damages = []
		damages.push({
			...stats.skillDamage(my.target, data.critBonus[my.skills[index]]),
			key: 'doomThrust',
			index: my.target,
			enhancedDamage: enhancedDamage,
			hitBonus: data.hitBonus[my.skills[index]],
		})
		combat.txDamageMob(damages)
		spell.triggerSkillCooldown(index, data)
		button.triggerGlobalCooldown()
	}
	function astralBlade(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, astralBladeCompleted)
	}
	function astralBladeCompleted() {
		let originalTarget = my.target
		let firstTargets = [-2, -1, 0, 1, 2]
		for (var i=0; i<12; i++) {
			!function(i) {
				let splashIndex
				if (i <= 4) {
					// guarantee at least one hit per 5x
					splashIndex = _.random(0, firstTargets.length - 1)
					splashIndex = firstTargets.splice(splashIndex, 1)
					splashIndex = splashIndex[0]
				}
				else {
					splashIndex = _.random(-2, 2)
				}
				let tgt = battle.getSplashTarget(splashIndex, originalTarget)
				delayedCall(i * .1, () => {
					combat.txDamageMob([{
						key: 'astralBlade',
						index: tgt,
						spellType: spell.data.spellType,
						damageType: spell.data.damageType,
						...stats.spellDamage(tgt),
					}])
				})
			}(i)
		}
		spell.triggerSkillCooldown(spell.config.skillIndex)
	}
	function ravagingPlague(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, ravagingPlagueCompleted)
	}
	function ravagingPlagueCompleted() {
		// dd
		combat.txDamageMob([{
			key: 'ravagingPlague',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage(spell.config.target)
		}])
		// dot
		damages = []
		hit = stats.spellDamage(spell.config.target, -100)
		hit.damage *= 2
		damages.push({
			key: 'ravagingPlague',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...hit
		})
		combat.txDotMob(damages)
	}
	function decayingDoom(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, decayingDoomCompleted)
	}
	function decayingDoomCompleted() {
		// dd
		combat.txDamageMob([{
			key: 'decayingDoom',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage(spell.config.target)
		}])
		// dot
		damages = []
		hit = stats.spellDamage(spell.config.target, -100)
		hit.damage *= 2
		damages.push({
			key: 'decayingDoom',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...hit
		})
		combat.txDotMob(damages)
	}
	function bloodTerror(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, bloodTerrorCompleted)
	}
	function bloodTerrorCompleted() {
		combat.txDotMob([{
			key: 'bloodTerror',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage(spell.config.target, -100),
		}])

		combat.txDamageMob([{
			key: 'bloodTerror',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			damage: 0,
			buffs: [{
				i: spell.config.target, // target
				row: my.row, // this identifies unique buff state/icon
				key: 'fear', // this sets the flag,
				duration: 12,
			}],
		}])
		spell.triggerSkillCooldown(spell.config.skillIndex)
	}
	function lifeTap(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, lifeTapCompleted)
	}
	function lifeTapCompleted() {
		damages = []
		hit = stats.spellDamage(spell.config.target, -100)
		damages.push({
			key: 'lifeTap',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			cannotResist: true,
			...hit,
		})
		// console.info('drainSoul', hit)
		combat.txDamageMob(damages)
		combat.txHotHero([{
			index: my.row,
			key: 'lifeTapHeal',
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...hit
		}])
		spell.triggerSkillCooldown(spell.config.skillIndex)
	}
	function vampiricFeast(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
			anyTarget: true,
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, vampiricFeastCompleted)
	}
	function vampiricFeastCompleted() {
		damages = []
		let heals = []
		for (let i = 0; i<mob.max; i++) {
			if (mob.isAlive(i)) {
				hit = stats.spellDamage(i, -100)
				damages.push({
					key: 'vampiricFeast',
					index: i,
					spellType: spell.data.spellType,
					damageType: spell.data.damageType,
					cannotResist: true,
					...hit,
				})
				heals.push({
					index: my.row,
					key: 'vampiricFeastHeal',
					spellType: spell.data.spellType,
					damageType: spell.data.damageType,
					...hit
				})
			}
		}
		combat.txDamageMob(damages)
		combat.txHotHero(heals)
		spell.triggerSkillCooldown(spell.config.skillIndex)
	}
	function sanguineHarvest(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
			fixTarget: false,
			isMob: false,
			oocEnabled: true,
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, sanguineHarvestCompleted)
	}
	function sanguineHarvestCompleted() {
		damages = []
		damages.push({
			index: spell.config.target,
			key: 'sanguineHarvest',
			spellType: spell.data.spellType,
			level: my.skills[spell.config.skillIndex],
			...stats.spellDamage(spell.config.target, -100),
		})
		combat.txBuffHero(damages)
	}
	function procSanguineHarvest(index) {
		combat.txDamageMob([{
			key: 'sanguineHarvestProc',
			index: index,
			spellType: PROP.EVOCATION,
			damageType: DAMAGE_TYPE.ARCANE,
			cannotResist: true,
			damage: buffs.sanguineHarvest.lifeTap[my.buffs.sanguineHarvest.level],
		}])
		combat.txHotHero([{
			index: my.row,
			key: 'sanguineHarvestHeal',
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			damage: buffs.sanguineHarvest.lifeTap[my.buffs.sanguineHarvest.level]
		}])
	}
	function markOfRemphan(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, markOfRemphanCompleted)
	}
	function markOfRemphanCompleted() {
		combat.txDotMob([{
			key: 'markOfRemphan',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			level: my.skills[spell.config.skillIndex],
			damage: 0,
		}])

		combat.txDamageMob([{
			key: 'markOfRemphan',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage(spell.config.target),
		}])
	}
	let maxRemphan = 0
	function getHighestMarkOfRemphan(index) {
		maxRemphan = 0
		for (key in mobs[index].buffs) {
			if (mobs[index].buffs[key].key === 'markOfRemphan' &&
				mobs[index].buffs[key].duration > 0 &&
				mobs[index].buffs[key].level > maxRemphan) {
				maxRemphan = mobs[index].buffs[key].level
			}
		}
		return maxRemphan
	}
}($, _, TweenMax);