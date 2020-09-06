!function($, _, TweenMax, undefined) {
	skill.BRD = {
		bellow,
		sonicBoom,
		euphonicDirge,
		subvertedSymphony,
		crashingChords,
		battleHymn,
		victoryJaunt,
		shackleChords,
		litanyOfLife,
		melodyOfMana,
		righteousRhapsody,
		chromaticSonnet,
	}
	///////////////////////////////////////////
	let enhancedDamage, hit, config, i, splashIndex, tgt, damages = [], dam
	///////////////////////////////////////////
	function bellow(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, bellowCompleted)
	}
	function bellowCompleted() {
		damages = [{
			key: 'bellow',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage()
		}]
		if (rand() > .75) {
			damages[0].effects = { stagger: true }
		}
		combat.txDamageMob(damages)
	}
	function sonicBoom(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, sonicBoomCompleted)
	}
	function sonicBoomCompleted() {
		splashIndex = -1
		damages = []
		for (i=0; i<3; i++) {
			tgt = battle.getSplashTarget(splashIndex++)
			damages.push({
				key: 'sonicBoom',
				index: tgt,
				spellType: spell.data.spellType,
				damageType: spell.data.damageType,
				...stats.spellDamage(),
				buffs: [{
					i: tgt, // target
					row: my.row, // this identifies unique buff state/icon
					key: 'stun', // this sets the flag,
					duration: 3,
				}],
			})
		}
		combat.txDamageMob(damages)
		spell.triggerCooldown(spell.config.skillIndex)
	}
	function euphonicDirge(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, euphonicDirgeCompleted)
	}
	function euphonicDirgeCompleted() {
		combat.txDamageMob([{
			key: 'euphonicDirge',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage()
		}])
	}
	function subvertedSymphony(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, subvertedSymphonyCompleted)
	}
	function subvertedSymphonyCompleted() {
		combat.txDamageMob([{
			key: 'subvertedSymphony',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage()
		}])
	}
	function crashingChords(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, crashingChordsCompleted)
	}
	function crashingChordsCompleted() {
		combat.txDamageMob([{
			key: 'crashingChords',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage()
		}])
	}
	function battleHymn(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, battleHymnCompleted)
	}
	function battleHymnCompleted() {
		combat.txDamageMob([{
			key: 'battleHymn',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage()
		}])
	}
	function victoryJaunt(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, victoryJauntCompleted)
	}
	function victoryJauntCompleted() {
		combat.txDamageMob([{
			key: 'victoryJaunt',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage()
		}])
	}
	function shackleChords(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, shackleChordsCompleted)
	}
	function shackleChordsCompleted() {
		combat.txDamageMob([{
			key: 'shackleChords',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage()
		}])
	}
	function litanyOfLife(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, litanyOfLifeCompleted)
	}
	function litanyOfLifeCompleted() {
		combat.txDamageMob([{
			key: 'litanyOfLife',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage()
		}])
	}
	function melodyOfMana(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, melodyOfManaCompleted)
	}
	function melodyOfManaCompleted() {
		combat.txDamageMob([{
			key: 'melodyOfMana',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage()
		}])
	}
	function righteousRhapsody(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, righteousRhapsodyCompleted)
	}
	function righteousRhapsodyCompleted() {
		combat.txDamageMob([{
			key: 'righteousRhapsody',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage()
		}])
	}
	function chromaticSonnet(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, chromaticSonnetCompleted)
	}
	function chromaticSonnetCompleted() {
		combat.txDamageMob([{
			key: 'chromaticSonnet',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage()
		}])
	}
}($, _, TweenMax);