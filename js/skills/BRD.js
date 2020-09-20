!function($, _, TweenMax, undefined) {
	skill.BRD = {
		bellow,
		sonicBoom,
		euphonicDirge,
		subvertedSymphony,
		crashingChords,
		battleHymn,
		militantCadence,
		consonantChain,
		litanyOfLife,
		melodyOfMana,
		righteousRhapsody,
		getMaxRighteousRhapsody,
		chromaticSonata,
	}
	///////////////////////////////////////////
	let enhancedDamage, hit, config, i, splashIndex, tgt, damages = [], dam, key
	let maxRighteousRhapsody
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
			...stats.spellDamage(spell.config.target)
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
				...stats.spellDamage(tgt),
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
				...stats.spellDamage(tgt, -100)
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
				...stats.spellDamage(tgt, -100)
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
			...stats.spellDamage(spell.config.target),
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
		hit = stats.spellDamage(p.row, -100)
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
		hit = stats.spellDamage(p.row, -100)
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
	function consonantChain(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, consonantChainCompleted)
	}
	function consonantChainCompleted() {
		combat.txDotMob([{
			key: 'consonantChain',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage(spell.config.target),
		}])
	}
	function litanyOfLife(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
			anyTarget: true,
			oocEnabled: true,
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, litanyOfLifeCompleted)
	}
	function litanyOfLifeCompleted() {
		damages = []
		hit = stats.spellDamage(p.row, -100)
		party.presence.forEach(p => {
			damages.push({
				index: p.row,
				key: 'litanyOfLife',
				spellType: spell.data.spellType,
				level: my.skills[spell.config.skillIndex],
				...hit
			})
		})
		combat.txBuffHero(damages)
	}
	function melodyOfMana(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
			anyTarget: true,
			oocEnabled: true,
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, melodyOfManaCompleted)
	}
	function melodyOfManaCompleted() {
		damages = []
		hit = stats.spellDamage(p.row, -100)
		party.presence.forEach(p => {
			damages.push({
				index: p.row,
				key: 'melodyOfMana',
				spellType: spell.data.spellType,
				level: my.skills[spell.config.skillIndex],
				...hit
			})
		})
		combat.txBuffHero(damages)
	}
	function righteousRhapsody(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
			anyTarget: true,
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, righteousRhapsodyCompleted)
	}
	function righteousRhapsodyCompleted() {
		damages = []
		mobs.forEach(m => {
			damages.push({
				index: m.index,
				key: 'righteousRhapsody',
				spellType: spell.data.spellType,
				level: my.skills[spell.config.skillIndex],
				damage: 0,
			})
		})
		combat.txDotMob(damages)
	}
	function getMaxRighteousRhapsody(index) {
		maxRighteousRhapsody = 0
		for (key in mobs[index].buffs) {
			if (mobs[index].buffs[key].key === 'righteousRhapsody' &&
				mobs[index].buffs[key].duration > 0 && // must be active
				mobs[index].buffs[key].level > maxRighteousRhapsody) {
				maxRighteousRhapsody = mobs[index].buffs[key].level
			}
		}
		return maxRighteousRhapsody
	}
	function chromaticSonata(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
			anyTarget: true,
			oocEnabled: true,
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, chromaticSonataCompleted)
	}
	function chromaticSonataCompleted() {
		damages = []
		hit = stats.spellDamage(p.row, -100)
		party.presence.forEach(p => {
			damages.push({
				index: p.row,
				key: 'chromaticSonata',
				spellType: spell.data.spellType,
				level: my.skills[spell.config.skillIndex],
				...hit
			})
		})
		combat.txBuffHero(damages)
	}
}($, _, TweenMax);