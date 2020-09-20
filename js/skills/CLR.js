!function($, _, TweenMax, undefined) {
	skill.CLR = {
		smite,
		deliverance,
		condemnation,
		sacredRevelation,
		holySanctuary,
		forceOfGlory,
		circleOfPrayer,
		guardianAngel,
		divineLight,
		bindingGrace,
		sealOfRedemption,
		zealousResolve,
	}
	///////////////////////////////////////////
	let i, splashIndex, tgt, hit, hate, damage
	let damages = []
	///////////////////////////////////////////
	function smite(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, smiteCompleted)
	}
	function smiteCompleted() {
		combat.txDamageMob([{
			key: 'smite',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage(spell.config.target)
		}])
	}

	function deliverance(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, deliveranceCompleted)
	}
	function deliveranceCompleted() {
		combat.txDamageMob([{
			key: 'deliverance',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage(spell.config.target),
			isBlighted: true,
		}])
		spell.triggerCooldown(spell.config.skillIndex)
	}
	function condemnation(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, condemnationCompleted)
	}
	function condemnationCompleted() {
		splashIndex = -1
		tgt = 0
		damages = []
		for (i=0; i<3; i++) {
			tgt = battle.getSplashTarget(splashIndex++)
			damages.push({
				key: 'condemnation',
				index: tgt,
				spellType: spell.data.spellType,
				damageType: spell.data.damageType,
				...stats.spellDamage(tgt),
				isBlighted: true,
			})
		}
		combat.txDamageMob(damages)
		spell.triggerCooldown(spell.config.skillIndex)
	}
	function sacredRevelation(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, sacredRevelationCompleted)
	}
	function sacredRevelationCompleted() {
		splashIndex = -1
		tgt = 0
		damages = []
		for (var i=0; i<3; i++) {
			tgt = battle.getSplashTarget(splashIndex++)
			damages.push({
				key: 'sacredRevelation',
				index: tgt,
				spellType: spell.data.spellType,
				damageType: spell.data.damageType,
				buffs: [{
					i: tgt, // target
					row: my.row, // this identifies unique buff state/icon
					key: 'stun', // this sets the flag,
					duration: 3,
				}],
				...stats.spellDamage(tgt),
			})
		}
		combat.txDamageMob(damages)
		spell.triggerCooldown(spell.config.skillIndex)
	}
	function holySanctuary(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
			anyTarget: true,
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, holySanctuaryCompleted)
	}
	function holySanctuaryCompleted() {
		damages = []
		for (var i=0; i<mob.max; i++) {
			hit = stats.spellDamage(i)
			damages.push({
				index: i,
				key: 'holySanctuary',
				spellType: spell.data.spellType,
				damageType: spell.data.damageType,
				...hit
			})
		}
		combat.txDamageMob(damages)
		spell.triggerCooldown(spell.config.skillIndex)
	}
	function forceOfGlory(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, forceOfGloryCompleted)
	}
	function forceOfGloryCompleted() {
		combat.txDamageMob([{
			key: 'forceOfGlory',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			buffs: [{
				i: spell.config.target, // target
				row: my.row, // this identifies unique buff state/icon
				key: 'stun', // this sets the flag,
				duration: 5,
			}],
			...stats.spellDamage(spell.config.target)
		}])
		spell.triggerCooldown(spell.config.skillIndex)
	}
	function bindingGrace(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
			fixTarget: false,
			isMob: false,
			oocEnabled: true,
			targetOther: true,
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, bindingGraceCompleted)
	}
	function bindingGraceCompleted() {
		damages = []
		damages.push({
			index: my.row,
			name: my.name,
			key: 'bindingGrace',
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage(my.row)
		})
		damages.push({
			index: spell.config.target,
			name: spell.config.targetName,
			key: 'bindingGrace',
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage(spell.config.target)
		})
		combat.txHotHero(damages)
		spell.triggerCooldown(spell.config.skillIndex)
	}
	function guardianAngel(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
			fixTarget: false,
			isMob: false,
			oocEnabled: true,
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, guardianAngelCompleted)
	}
	function guardianAngelCompleted() {
		damages = []
		damages.push({
			index: spell.config.target,
			key: 'guardianAngel',
			spellType: spell.data.spellType,
			level: my.skills[spell.config.skillIndex],
			...stats.spellDamage(spell.config.target, -100)
		})
		combat.txBuffHero(damages)
		spell.triggerCooldown(spell.config.skillIndex)
	}
	function divineLight(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
			fixTarget: false,
			isMob: false,
			oocEnabled: true,
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, divineLightCompleted)
	}
	function divineLightCompleted() {
		damages = []
		damages.push({
			index: spell.config.target,
			name: spell.config.targetName,
			key: 'divineLight',
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage(spell.config.target)
		})
		combat.txHotHero(damages)
	}
	function circleOfPrayer(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
			oocEnabled: true,
			anyTarget: true,
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, circleOfPrayerCompleted)
	}
	function circleOfPrayerCompleted() {
		damages = []
		party.presence.forEach(p => {
			damages.push({
				index: p.row,
				name: p.name,
				key: 'circleOfPrayer',
				spellType: spell.data.spellType,
				damageType: spell.data.damageType,
				...stats.spellDamage(p.row)
			})
		})
		combat.txHotHero(damages)
	}
	function sealOfRedemption(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
			fixTarget: false,
			isMob: false,
			oocEnabled: true,
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, sealOfRedemptionCompleted)
	}
	function sealOfRedemptionCompleted() {
		damages = []
		damages.push({
			index: spell.config.target,
			key: 'sealOfRedemption',
			spellType: spell.data.spellType,
			level: my.skills[spell.config.skillIndex],
			...stats.spellDamage(spell.config.target, -100)
		})
		combat.txBuffHero(damages)
	}
	function zealousResolve(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
			fixTarget: false,
			isMob: false,
			oocEnabled: true,
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, zealousResolveCompleted)
	}
	function zealousResolveCompleted() {
		damages = []
		damages.push({
			index: spell.config.target,
			key: 'zealousResolve',
			spellType: spell.data.spellType,
			level: my.skills[spell.config.skillIndex],
			...stats.spellDamage(spell.config.target, -100)
		})
		combat.txBuffHero(damages)
	}

}($, _, TweenMax);