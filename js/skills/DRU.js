!function($, _, TweenMax, undefined) {
	skill.DRU = {
		starfire,
		fissure,
		lightningBlast,
		blizzard,
		toxicSpores,
		moltenBoulder,
		barbedThicket,
		tornado,
		naturesTouch,
		mossBreath,
		synthesize,
		branchSpirit,
	}
	///////////////////////////////////////////
	let enhancedDamage, hit, config, i, splashIndex, tgt, damages = []
	///////////////////////////////////////////
	function starfire(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, starfireCompleted)
	}
	function starfireCompleted() {
		combat.txDamageMob([{
			key: 'starfire',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage()
		}])
	}
	function fissure(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, fissureCompleted)
	}
	function fissureCompleted() {
		let originalTarget = my.target
		for (var j=0; j<5; j++) {
			!function(j) {
				delayedCall(j + 1, () => {
					splashIndex = -1
					damages = []
					for (i=0; i<3; i++) {
						tgt = battle.getSplashTarget(splashIndex++, originalTarget)
						damages.push({
							key: 'fissure',
							index: tgt,
							spellType: spell.data.spellType,
							damageType: spell.data.damageType,
							...stats.spellDamage(),
						})
					}
					combat.txDamageMob(damages)
				})
			}(j)
		}
		timers.skillCooldowns[spell.config.skillIndex] = 0
		button.processButtonTimers(spell.config.skillIndex, skills.lastData)
	}
	function lightningBlast(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, lightningBlastCompleted)
	}
	function lightningBlastCompleted() {
		splashIndex = -1
		damages = []
		for (i=0; i<3; i++) {
			tgt = battle.getSplashTarget(splashIndex++)
			damages.push({
				key: 'lightningBlast',
				index: tgt,
				spellType: spell.data.spellType,
				damageType: spell.data.damageType,
				...stats.spellDamage(),
			})
		}
		combat.txDamageMob(damages)
		timers.skillCooldowns[spell.config.skillIndex] = 0
		button.processButtonTimers(spell.config.skillIndex, skills.lastData)
	}
	function blizzard(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, blizzardCompleted)
	}
	function blizzardCompleted() {
		let originalTarget = my.target
		for (var j=0; j<5; j++) {
			!function(j) {
				delayedCall((j + 1) * 1.5, () => {
					splashIndex = -1
					damages = []
					for (i=0; i<3; i++) {
						tgt = battle.getSplashTarget(splashIndex++, originalTarget)
						damages.push({
							key: 'blizzard',
							index: tgt,
							spellType: spell.data.spellType,
							damageType: spell.data.damageType,
							buffs: [{
								i: tgt,
								row: my.row, // this identifies unique buff state/icon
								key: 'chill', // this sets the flag,
								duration: 2.5,
							}],
							...stats.spellDamage(),
						})
					}
					combat.txDamageMob(damages)
				})
			}(j)
		}
		timers.skillCooldowns[spell.config.skillIndex] = 0
		button.processButtonTimers(spell.config.skillIndex, skills.lastData)
	}
	function toxicSpores(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, toxicSporesCompleted)
	}
	function toxicSporesCompleted() {
		damages = []
		damages.push({
			key: 'toxicSpores',
			index: spell.config.target,
			damageType: 'poison',
			isPiercing: true,
			...stats.spellDamage(false, true)
		})
		combat.txDotMob(damages)
	}
	function moltenBoulder(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
			requiresFrontRow: true,
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, moltenBoulderCompleted)
	}
	function moltenBoulderCompleted() {
		let i = 0
		let tgt = spell.config.target
		let isFrontRow = tgt <= 4
		let increment
		if (isFrontRow) increment = tgt <= 2
		else increment = tgt <= 6
		let spellType = spell.data.spellType
		let damageType = spell.data.damageType
		let tgts = []

		while (
			isFrontRow && tgt >= 0 && tgt <= 4 ||
			!isFrontRow && tgt >= 5 && tgt <= mob.max - 1
		) {
			i++
			tgts.push(tgt)
			if (increment) tgt++
			else tgt--
		}
		tgts.reverse()
		const len = tgts.length
		console.info('moltenBoulder', tgts)
		delayedCall(1, () => {
			tgts.forEach((tgt, i) => {
				delayedCall(i * .333, () => {
					let damages = []
					damages.push({
						key: 'moltenBoulder',
						index: tgt,
						spellType: spellType,
						damageType: damageType,
						...stats.spellDamage()
					})
					if (i + 1 < len) {
						damages[0].damage *= .3
					}
					else {
						// add 50% damage via dot to final target
						let dots = []
						dots.push({
							key: 'moltenBoulder',
							index: tgt,
							damageType: 'fire',
							isPiercing: true,
							...stats.spellDamage(false, true)
						})
						dots[0].damage *= .5
						combat.txDotMob(dots)
					}
					console.info('moltenBoulder', i, 'target', tgt, damages[0].damage)
					combat.txDamageMob(damages)
				})
			})
		})
		timers.skillCooldowns[spell.config.skillIndex] = 0
		button.processButtonTimers(spell.config.skillIndex, skills.lastData)
	}
	function barbedThicket(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, barbedThicketCompleted)
	}
	function barbedThicketCompleted() {
		combat.txDamageMob([{
			key: 'barbedThicket',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage()
		}])
	}
	function tornado(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, tornadoCompleted)
	}
	function tornadoCompleted() {
		combat.txDamageMob([{
			key: 'tornado',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage()
		}])
	}
	function naturesTouch(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, naturesTouchCompleted)
	}
	function naturesTouchCompleted() {
		combat.txDamageMob([{
			key: 'naturesTouch',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage()
		}])
	}
	function mossBreath(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, mossBreathCompleted)
	}
	function mossBreathCompleted() {
		combat.txDamageMob([{
			key: 'mossBreath',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage()
		}])
	}
	function synthesize(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, synthesizeCompleted)
	}
	function synthesizeCompleted() {
		combat.txDamageMob([{
			key: 'synthesize',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage()
		}])
	}
	function branchSpirit(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, branchSpiritCompleted)
	}
	function branchSpiritCompleted() {
		combat.txDamageMob([{
			key: 'fireBolt',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage()
		}])
	}
}($, _, TweenMax);