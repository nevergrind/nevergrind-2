!function($, _, TweenMax, undefined) {
	skill.BRD = {
		bellow,
		sonicBoom,
		euphonicDirge,
		subvertedSymphony,
		crashingChords,
		battleHymn,
		militantCadence,
		requiemOfRestraint,
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
		splashIndex = -1
		damages = []
		for (i=0; i<3; i++) {
			tgt = battle.getSplashTarget(splashIndex++)
			damages.push({
				key: 'euphonicDirge',
				index: tgt,
				spellType: spell.data.spellType,
				damageType: spell.data.damageType,
				...stats.spellDamage(false, true)
			})
		}
		combat.txDotMob(damages)
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
		splashIndex = -1
		damages = []
		for (i=0; i<3; i++) {
			tgt = battle.getSplashTarget(splashIndex++)
			damages.push({
				key: 'subvertedSymphony',
				index: tgt,
				spellType: spell.data.spellType,
				damageType: spell.data.damageType,
				...stats.spellDamage(false, true)
			})
		}
		combat.txDotMob(damages)
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
			...stats.spellDamage(),
			buffs: [{
				i: spell.config.target,
				row: my.row, // this identifies unique buff state/icon
				key: 'paralyze', // this sets the flag,
				duration: 12,
			}]
		}])

		spell.triggerCooldown(spell.config.skillIndex)
	}
	function battleHymn(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
			anyTarget: true,
			oocEnabled: true,
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, battleHymnCompleted)
	}
	function battleHymnCompleted() {
		damages = []
		hit = stats.spellDamage(false, true) // forceCrit, getNonCrit
		party.presence.forEach(p => {
			damages.push({
				index: p.row,
				key: 'battleHymn',
				spellType: spell.data.spellType,
				level: my.skills[spell.config.skillIndex],
				...hit
			})
		})
		combat.txBuffHero(damages)
	}
	function militantCadence(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
			anyTarget: true,
			oocEnabled: true,
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, militantCadenceCompleted)
	}
	function militantCadenceCompleted() {
		damages = []
		hit = stats.spellDamage(false, true) // forceCrit, getNonCrit
		party.presence.forEach(p => {
			damages.push({
				index: p.row,
				key: 'militantCadence',
				spellType: spell.data.spellType,
				level: my.skills[spell.config.skillIndex],
				...hit
			})
		})
		combat.txBuffHero(damages)
	}
	function requiemOfRestraint(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, requiemOfRestraintCompleted)
	}
	function requiemOfRestraintCompleted() {
		combat.txDotMob([{
			key: 'requiemOfRestraint',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage(),
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