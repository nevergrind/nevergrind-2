!function($, _, TweenMax, undefined) {
	skill.TMP = {
		lavaBolt,
		thunderclap,
		frozenOrb,
		staticStorm,
		fireWall,
		glacialSpike,
		primordialSludge,
		arclight,
		primevalWithering,
		lavaShield,
		lucidEnergy,
		etherealFocus,
	}
	///////////////////////////////////////////
	let enhancedDamage, hit, config, i, splashIndex, tgt, damages = [], dam
	///////////////////////////////////////////
	function lavaBolt(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, lavaBoltCompleted)
	}
	function lavaBoltCompleted() {
		combat.txDamageMob([{
			key: 'lavaBolt',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage()
		}])
	}
	function thunderclap(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, thunderclapCompleted)
	}
	function thunderclapCompleted() {
		let tgt = my.target
		for (var i=0; i<3; i++) {
			!function(i) {
				delayedCall(i * .1, () => {
					damages = []
					dam = {
						key: 'thunderclap',
						index: tgt,
						spellType: spell.data.spellType,
						damageType: spell.data.damageType,
						...stats.spellDamage(),
					}
					if (i === 2) {
						dam.buffs = [{
							i: tgt, // target
							row: my.row, // this identifies unique buff state/icon
							key: 'stun', // this sets the flag,
							duration: 1,
						}]
					}
					damages.push(dam)
					combat.txDamageMob(damages)
				})
			}(i)
		}
		spell.triggerCooldown(spell.config.skillIndex)
	}
	function frozenOrb(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, frozenOrbCompleted)
	}
	function frozenOrbCompleted() {
		let originalTarget = my.target
		for (var i=0; i<15; i++) {
			!function(i) {
				let splashIndex = _.random(-2, 2)
				let tgt = battle.getSplashTarget(splashIndex, originalTarget)
				if (mob.isAlive(tgt)) {
					delayedCall(i * .1, () => {
						combat.txDamageMob([{
							key: 'frozenOrb',
							index: tgt,
							spellType: spell.data.spellType,
							damageType: spell.data.damageType,
							...stats.spellDamage(),
							buffs: [{
								i: tgt, // target
								row: my.row, // this identifies unique buff state/icon
								key: 'chill', // this sets the flag,
								duration: 7,
							}]
						}])
					})
				}
			}(i)
		}
		spell.triggerCooldown(spell.config.skillIndex)
	}
	function staticStorm(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, staticStormCompleted)
	}
	function staticStormCompleted() {
		combat.txDamageMob([{
			key: 'staticStorm',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage()
		}])
	}
	function fireWall(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, fireWallCompleted)
	}
	function fireWallCompleted() {
		combat.txDamageMob([{
			key: 'fireWall',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage()
		}])
	}
	function glacialSpike(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, glacialSpikeCompleted)
	}
	function glacialSpikeCompleted() {
		combat.txDamageMob([{
			key: 'glacialSpike',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage()
		}])
	}
	function primordialSludge(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, primordialSludgeCompleted)
	}
	function primordialSludgeCompleted() {
		combat.txDamageMob([{
			key: 'primordialSludge',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage()
		}])
	}
	function arclight(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, arclightCompleted)
	}
	function arclightCompleted() {
		combat.txDamageMob([{
			key: 'arclight',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage()
		}])
	}
	function primevalWithering(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, primevalWitheringCompleted)
	}
	function primevalWitheringCompleted() {
		combat.txDamageMob([{
			key: 'primevalWithering',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage()
		}])
	}
	function lavaShield(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, lavaShieldCompleted)
	}
	function lavaShieldCompleted() {
		combat.txDamageMob([{
			key: 'lavaShield',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage()
		}])
	}
	function lucidEnergy(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, lucidEnergyCompleted)
	}
	function lucidEnergyCompleted() {
		combat.txDamageMob([{
			key: 'lucidEnergy',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage()
		}])
	}
	function etherealFocus(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, etherealFocusCompleted)
	}
	function etherealFocusCompleted() {
		combat.txDamageMob([{
			key: 'etherealFocus',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage()
		}])
	}

}($, _, TweenMax);