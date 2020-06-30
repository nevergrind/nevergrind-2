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
	let enhancedDamage, hit, config
	let lastData = {}
	let damages = []
	///////////////////////////////////////////
	function smite(index, data) {
		if (timers.castBar < 1) return
		spell.config = spell.getSpellConfig(index, data)
		if (skills.notReady(spell.config)) return
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
		spell.config = spell.getSpellConfig(index, data)
		if (skills.notReady(spell.config)) return
		spell.startCasting(index, data, smiteCompleted)
	}
	function deliveranceCompleted() {

	}
	function condemnation(index, data) {
		console.info('trueshotArrow', index)
		// check constraints
		// process skill data
		// animate timers
	}
	function condemnationCompleted() {

	}
	function sacredRevelation(index, data) {
		console.info('spreadShot', index)
		// check constraints
		// process skill data
		// animate timers
	}
	function sacredRevelationCompleted() {

	}
	function holySanctuary(index, data) {
		console.info('bladeStorm', index)
		// check constraints
		// process skill data
		// animate timers
	}
	function holySanctuaryCompleted() {

	}
	function forceOfGlory(index, data) {
		console.info('suppressingVolley', index)
		// check constraints
		// process skill data
		// animate timers
	}
	function forceOfGloryCompleted() {

	}
	function circleOfPrayer(index, data) {
		console.info('ignite', index)
		// check constraints
		// process skill data
		// animate timers
	}
	function circleOfPrayerCompleted() {

	}
	function guardianAngel(index, data) {
		console.info('shockNova', index)
		// check constraints
		// process skill data
		// animate timers
	}
	function guardianAngelCompleted() {

	}
	function divineLight(index, data) {
		console.info('faerieFlame', index)
		// check constraints
		// process skill data
		// animate timers
	}
	function divineLightCompleted() {

	}
	function divineEmbrace(index, data) {
		console.info('fungalGrowth', index)
		// check constraints
		// process skill data
		// animate timers
	}
	function divineEmbraceCompleted() {

	}
	function sealOfRedemption(index, data) {
		console.info('shimmeringOrb', index)
		// check constraints
		// process skill data
		// animate timers
	}
	function sealOfRedemptionCompleted() {

	}
	function zealousResolve(index, data) {
		console.info('spiritOfTheHunter', index)
		// check constraints
		// process skill data
		// animate timers
	}
	function zealousResolveCompleted() {

	}

}($, _, TweenMax);