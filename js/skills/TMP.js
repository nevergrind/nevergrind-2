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
		let firstTargets = [-2, -1, 0, 1, 2]
		for (var i=0; i<15; i++) {
			!function(i) {
				let splashIndex
				if (i <= 4) {
					// guarantee at least one hit per 5x
					splashIndex = _.random(0, firstTargets.length)
					splashIndex = firstTargets.splice(splashIndex, 1)
					splashIndex = splashIndex[0]
				}
				else splashIndex = _.random(-2, 2)
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
		// damage
		splashIndex = -1
		damages = []
		for (i=0; i<3; i++) {
			tgt = battle.getSplashTarget(splashIndex++)
			damages.push({
				key: 'staticStorm',
				index: tgt,
				spellType: spell.data.spellType,
				damageType: spell.data.damageType,
				...stats.spellDamage(),
				effects: { stagger: true },
			})
		}
		combat.txDamageMob(damages)
		// debuff component
		splashIndex = -1
		damages = []
		for (i=0; i<3; i++) {
			tgt = battle.getSplashTarget(splashIndex++)
			damages.push({
				key: 'staticStorm',
				index: tgt,
				spellType: spell.data.spellType,
				damageType: spell.data.damageType,
				damage: 0,
			})
		}
		combat.txDotMob(damages)
		spell.triggerCooldown(spell.config.skillIndex)
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
		let originalTarget = spell.config.target
		let targets = originalTarget <= 4 ? [0,1,2,3,4] : [5,6,7,8]
		for (let i=0; i<10; i++) {
			!function(i) {
				delayedCall(1 + (i * 1), fireWallBurn, [targets])
			}(i)
		}
		spell.triggerCooldown(spell.config.skillIndex)
	}
	function fireWallBurn(targets) {
		let damages = []
		targets.forEach(tgt => {
			damages.push({
				key: 'fireWall',
				index: tgt,
				spellType: spell.data.spellType,
				damageType: spell.data.damageType,
				...stats.spellDamage()
			})
		})
		combat.txDamageMob(damages)
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
		let originalTarget = spell.config.target
		let spellType = spell.data.spellType
		let damageType = spell.data.damageType
		let splashIndex = -2
		damages = []
		for (var i=0; i<5; i++) {
			let tgt = battle.getSplashTarget(splashIndex++, originalTarget)
			hit = stats.spellDamage()
			if (tgt !== originalTarget) hit.damage *= .5
			let buffs = [{
				i: tgt, // target
				row: my.row, // this identifies unique buff state/icon
				key: 'chill', // this sets the flag,
				duration: 12,
			}]
			if (tgt === originalTarget) {
				buffs.push({
					i: tgt, // target
					row: my.row, // this identifies unique buff state/icon
					key: 'freeze', // this sets the flag,
					duration: 4,
				})
			}
			damages.push({
				key: 'glacialSpike',
				index: tgt,
				spellType: spellType,
				damageType: damageType,
				...hit,
				buffs: buffs,
			})
		}
		combat.txDamageMob(damages)
		spell.triggerCooldown(spell.config.skillIndex)
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
		damages = []
		damages.push({
			key: 'primordialSludge',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: 'poison',
			...stats.spellDamage(false, true)
		})
		combat.txDotMob(damages)
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
		damages = []
		damages.push({
			key: 'arclight',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: 'lightning',
			...stats.spellDamage(false, true)
		})
		combat.txDotMob(damages)
		spell.triggerCooldown(spell.config.skillIndex)
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