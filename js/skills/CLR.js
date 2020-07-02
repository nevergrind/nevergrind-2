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
		divineEmbrace,
		sealOfRedemption,
		zealousResolve,
	}
	///////////////////////////////////////////
	let i, splashIndex, tgt
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

	}
	function holySanctuary(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, holySanctuaryCompleted)
	}
	function holySanctuaryCompleted() {

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

	}
	function circleOfPrayer(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, circleOfPrayerCompleted)
	}
	function circleOfPrayerCompleted() {

	}
	function guardianAngel(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, guardianAngelCompleted)
	}
	function guardianAngelCompleted() {

	}
	function divineLight(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, divineLightCompleted)
	}
	function divineLightCompleted() {

	}
	function divineEmbrace(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, divineEmbraceCompleted)
	}
	function divineEmbraceCompleted() {

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