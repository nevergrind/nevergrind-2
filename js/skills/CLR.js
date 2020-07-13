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
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage()
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
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage(),
			isBlighted: true,
		}])
		timers.skillCooldowns[spell.config.skillIndex] = 0
		button.processButtonTimers(spell.config.skillIndex, skills.lastData)
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
				index: tgt,
				spellType: spell.data.spellType,
				damageType: spell.data.damageType,
				...stats.spellDamage(),
				isBlighted: true,
			})
		}
		combat.txDamageMob(damages)
		timers.skillCooldowns[spell.config.skillIndex] = 0
		button.processButtonTimers(spell.config.skillIndex, skills.lastData)
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
			//TODO: STUN
			damages.push({
				index: tgt,
				spellType: spell.data.spellType,
				damageType: spell.data.damageType,
				stun: 3,
				...stats.spellDamage(),
			})
		}
		combat.txDamageMob(damages)
		timers.skillCooldowns[spell.config.skillIndex] = 0
		button.processButtonTimers(spell.config.skillIndex, skills.lastData)
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
			hit = stats.spellDamage()
			damages.push({
				index: i,
				key: 'holySanctuary',
				spellType: spell.data.spellType,
				damageType: spell.data.damageType,
				hate: -hit.damage,
				...hit
			})
		}
		combat.txDamageMob(damages)
		timers.skillCooldowns[spell.config.skillIndex] = 0
		button.processButtonTimers(spell.config.skillIndex, skills.lastData)
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
		// TODO: STUN
		combat.txDamageMob([{
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			stun: 5,
			...stats.spellDamage()
		}])
		timers.skillCooldowns[spell.config.skillIndex] = 0
		button.processButtonTimers(spell.config.skillIndex, skills.lastData)
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
			...stats.spellDamage()
		})
		damages.push({
			index: spell.config.target,
			name: spell.config.targetName,
			key: 'bindingGrace',
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage()
		})
		combat.txHotHero(damages)
		timers.skillCooldowns[spell.config.skillIndex] = 0
		button.processButtonTimers(spell.config.skillIndex, skills.lastData)
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
			...stats.spellDamage(false, true) // forceCrit, getNonCrit
		})
		combat.txBuffHero(damages)
		timers.skillCooldowns[spell.config.skillIndex] = 0
		button.processButtonTimers(spell.config.skillIndex, skills.lastData)
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
			...stats.spellDamage()
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
				...stats.spellDamage()
			})
		})
		combat.txHotHero(damages)
	}
	function sealOfRedemption(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, sealOfRedemptionCompleted)
	}
	function sealOfRedemptionCompleted() {

	}
	function zealousResolve(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, zealousResolveCompleted)
	}
	function zealousResolveCompleted() {

	}

}($, _, TweenMax);