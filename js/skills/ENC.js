!function($, _, TweenMax, undefined) {
	skill.ENC = {
		gravityFlux,
		staticSuffocation,
		mindBlitz,
		subversion,
		colorShift,
		phaseBlade,
		stasisField,
		getHighestStasis,
		shiftingEther,
		sereneSigil,
		augmentation,
		clarity,
		enthrall,
	}
	///////////////////////////////////////////
	let enhancedDamage, hit, config, i, key, splashIndex, tgt, damages = [], bonus
	///////////////////////////////////////////
	function sizeDamageBonus(index) {
		bonus = 1 + ((mobs[index].sprite.width + mobs[index].sprite.height - 750) / 5000)
 		if (bonus > 1.5) bonus = 1.5
		else if (bonus < 1) bonus = 1
		return bonus
	}
	function gravityFlux(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, gravityFluxCompleted)
	}
	function gravityFluxCompleted() {
		hit = stats.spellDamage(spell.config.target)
		hit.damage = hit.damage * sizeDamageBonus(spell.config.target)
		combat.txDamageMob([{
			key: 'gravityFlux',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...hit
		}])
	}
	function staticSuffocation(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, staticSuffocationCompleted)
	}
	function staticSuffocationCompleted() {
		// dd
		combat.txDamageMob([{
			key: 'staticSuffocation',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			effects: { stagger: true },
			...stats.spellDamage(spell.config.target)
		}])
		// dot
		damages = []
		damages.push({
			key: 'staticSuffocation',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage(spell.config.target, -100)
		})
		combat.txDotMob(damages)
	}
	function mindBlitz(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, mindBlitzCompleted)
	}
	function mindBlitzCompleted() {
		combat.txDamageMob([{
			key: 'mindBlitz',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage(spell.config.target),
			buffs: [{
				i: spell.config.target, // target
				row: my.row, // this identifies unique buff state/icon
				key: 'mindBlitzEffect', // this sets the flag
			}],
		}])
	}
	function subversion(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, subversionCompleted)
	}
	function subversionCompleted() {
		splashIndex = -1
		damages = []
		for (i=0; i<3; i++) {
			tgt = battle.getSplashTarget(splashIndex++)
			damages.push({
				key: 'subversion',
				index: tgt,
				spellType: spell.data.spellType,
				damageType: spell.data.damageType,
				...stats.spellDamage(tgt, -100)
			})
		}
		combat.txDotMob(damages)
	}
	function colorShift(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, colorShiftCompleted)
	}
	function colorShiftCompleted() {
		damages = []
		for (var i=0; i<mob.max; i++) {
			if (mobs[i].hp > 0) {
				damages.push({
					index: i,
					key: 'colorShift',
					spellType: spell.data.spellType,
					damageType: spell.data.damageType,
					isMob: spell.config.isMob,
					buffs: [{
						i: i, // target
						row: my.row, // this identifies unique buff state/icon
						key: 'stun', // this sets the flag,
						duration: 4,
					}],
					...stats.spellDamage(i)
				})
			}
		}
		combat.txDamageMob(damages)
		spell.triggerSkillCooldown(spell.config.skillIndex)
	}
	function phaseBlade(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
			fixTarget: false,
			isMob: false,
			oocEnabled: true,
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, phaseBladeCompleted)
	}
	function phaseBladeCompleted() {
		damages = []
		damages.push({
			index: spell.config.target,
			key: 'phaseBlade',
			spellType: spell.data.spellType,
			level: my.skills[spell.config.skillIndex],
			damage: 0
		})
		combat.txBuffHero(damages)
		spell.triggerSkillCooldown(spell.config.skillIndex)
	}
	function stasisField(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, stasisFieldCompleted)
	}
	function stasisFieldCompleted() {
		damages = []
		damages.push({
			key: 'stasisField',
			index: spell.config.target,
			damageType: spell.data.damageType,
			spellType: spell.data.spellType,
			damage: 0,
			buffs: [{
				i: spell.config.target, // target
				level: my.skills[spell.config.skillIndex],
				row: my.row, // this identifies unique buff state/icon
				key: 'stasisField', // this sets the flag,
				duration: buffs.stasisField.duration,
			}],
		})
		combat.txDamageMob(damages)
		spell.triggerSkillCooldown(spell.config.skillIndex)
	}
	let maxStasis = 0
	function getHighestStasis(index) {
		maxStasis = 0
		for (key in mobs[index].buffs) {
			if (mobs[index].buffs[key].key === 'stasisField' &&
				mobs[index].buffs[key].duration > 0 && // must be active
				mobs[index].buffs[key].level > maxStasis) {
				maxStasis = mobs[index].buffs[key].level
			}
		}
		return maxStasis
	}
	function shiftingEther(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, shiftingEtherCompleted)
	}
	function shiftingEtherCompleted() {
		damages = []
		damages.push({
			key: 'shiftingEther',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage(spell.config.target, -100)
		})
		combat.txDotMob(damages)
	}
	function sereneSigil(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
			fixTarget: false,
			isMob: false,
			oocEnabled: true,
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, sereneSigilCompleted)
	}
	function sereneSigilCompleted() {
		damages = []
		damages.push({
			index: spell.config.target,
			key: 'sereneSigil',
			spellType: spell.data.spellType,
			level: my.skills[spell.config.skillIndex],
			...stats.spellDamage(spell.config.target, -100)
		})
		combat.txBuffHero(damages)
		spell.triggerSkillCooldown(spell.config.skillIndex)
	}
	function augmentation(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
			fixTarget: false,
			isMob: false,
			oocEnabled: true,
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, augmentationCompleted)
	}
	function augmentationCompleted() {
		damages = []
		damages.push({
			key: 'augmentation',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			level: my.skills[spell.config.skillIndex],
			damage: 0
		})
		combat.txBuffHero(damages)
	}
	function clarity(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
			fixTarget: false,
			isMob: false,
			oocEnabled: true,
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, clarityCompleted)
	}
	function clarityCompleted() {
		combat.txBuffHero([{
			key: 'clarity',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			level: my.skills[spell.config.skillIndex],
			damage: 0
		}])
	}
	function enthrall(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, enthrallCompleted)
	}
	function enthrallCompleted() {
		splashIndex = -1
		damages = []
		for (i=0; i<3; i++) {
			tgt = battle.getSplashTarget(splashIndex++)
			damages.push({
				key: 'enthrall',
				index: tgt,
				spellType: spell.data.spellType,
				damageType: spell.data.damageType,
				...stats.spellDamage(tgt),
			})
		}
		combat.txDamageMob(damages)
		// AE DoT damage
		splashIndex = -1
		damages = []
		for (i=0; i<3; i++) {
			tgt = battle.getSplashTarget(splashIndex++)
			damages.push({
				key: 'enthrall',
				index: tgt,
				damageType: spell.data.damageType,
				spellType: spell.data.spellType,
				damage: 0
			})
		}
		combat.txDotMob(damages)
	}
}($, _, TweenMax);