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
		moltenAegis,
		conviction,
		celestialFrenzy,
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
			...stats.spellDamage(spell.config.target)
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
		const spellConfig = _.cloneDeep(spell.data)
		for (var i=0; i<3; i++) {
			!function(i) {
				damages = []
				dam = {
					key: 'thunderclap',
					index: tgt,
					spellType: spell.data.spellType,
					damageType: spell.data.damageType,
					...stats.spellDamage(tgt, undefined, spellConfig),
				}
				if (i === 2) {
					dam.buffs = [{
						i: tgt, // target
						row: my.row, // this identifies unique buff state/icon
						key: 'stun', // this sets the flag,
						duration: buffs.thunderclap.stunDuration,
					}]
				}
				damages.push(dam)
				delayedCall(i * .1, () => {
					combat.txDamageMob(damages)
				})
			}(i)
		}
		spell.triggerSkillCooldown(spell.config.skillIndex)
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
		let tgts = []
		const spellType = spell.data.spellType
		const damageType = spell.data.damageType
		const spellConfig = _.cloneDeep(spell.data)

		for (var i=0; i<15; i++) {
			!function(i) {
				let splashIndex
				if (i <= 4) {
					// guarantee at least one hit per 5x
					splashIndex = _.random(0, firstTargets.length - 1)
					splashIndex = firstTargets.splice(splashIndex, 1)
					splashIndex = splashIndex[0]
				}
				else splashIndex = _.random(-2, 2)
				let tgt = battle.getSplashTarget(splashIndex, originalTarget)
				tgts.push(tgt)
				delayedCall(i * .1, () => {
					combat.txDamageMob([{
						key: 'frozenOrb',
						index: tgt,
						spellType: spellType,
						damageType: damageType,
						...stats.spellDamage(tgt, undefined, spellConfig),
						buffs: [{
							i: tgt, // target
							row: my.row, // this identifies unique buff state/icon
							key: 'chill', // this sets the flag,
							duration: buffs.frozenOrb.chillDuration,
						}]
					}])
				})
			}(i)
		}
		socket.publish('party' + my.partyId, {
			route: 'p->damage',
			animate: true,
			row: my.row,
			index: originalTarget,
			tgts: tgts,
			key: 'frozenOrb',
		})
		spell.triggerSkillCooldown(spell.config.skillIndex)
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
		const damagesDebuff = []
		battle.getConeTargets(spell.config.target).forEach(tgt => {
			damages.push({
				key: 'staticStorm',
				index: tgt,
				spellType: spell.data.spellType,
				damageType: spell.data.damageType,
				...stats.spellDamage(tgt),
				effects: { stagger: spell.data.staggers },
			})
			// debuff component
			damagesDebuff.push({
				key: 'staticStormDebuff',
				index: tgt,
				spellType: spell.data.spellType,
				damageType: spell.data.damageType,
				damage: 0,
			})
		})
		combat.txDamageMob(damages)
		combat.txDotMob(damagesDebuff)
		spell.triggerSkillCooldown(spell.config.skillIndex)
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
		let spellType = spell.data.spellType
		let damageType = spell.data.damageType
		let spellConfig = _.cloneDeep(spell.data)
		let targets = originalTarget <= 4 ? [0,1,2,3,4] : [5,6,7,8]
		for (let i=0; i<10; i++) {
			!function(i) {
				delayedCall(1 + (i * 1), fireWallBurn, [targets, spellType, damageType, spellConfig])
			}(i)
		}
		spell.triggerSkillCooldown(spell.config.skillIndex)
	}
	function fireWallBurn(targets, spellType, damageType, spellConfig) {
		let damages = []
		targets.forEach(tgt => {
			damages.push({
				key: 'fireWall',
				index: tgt,
				spellType: spellType,
				damageType: damageType,
				...stats.spellDamage(tgt, undefined, spellConfig)
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
			hit = stats.spellDamage(tgt)
			if (tgt !== originalTarget) hit.damage *= .5
			let buff = [{
				i: tgt, // target
				row: my.row, // this identifies unique buff state/icon
				key: 'chill', // this sets the flag,
				duration: buffs.glacialSpike.chillDuration,
			}]
			if (tgt === originalTarget) {
				buff.push({
					i: tgt, // target
					row: my.row, // this identifies unique buff state/icon
					key: 'freeze', // this sets the flag,
					duration: buffs.glacialSpike.freezeDuration,
				})
			}
			damages.push({
				key: 'glacialSpike',
				index: tgt,
				data: { isPrimaryTgt: tgt === originalTarget },
				spellType: spellType,
				damageType: damageType,
				...hit,
				buffs: buff,
			})
		}
		combat.txDamageMob(damages)
		spell.triggerSkillCooldown(spell.config.skillIndex)
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
			damageType: spell.data.damageType,
			...stats.spellDamage(spell.config.target, -100)
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
			damageType: spell.data.damageType,
			...stats.spellDamage(spell.config.target, -100),
		})
		combat.txDotMob(damages)

		combat.txDamageMob([{
			key: 'arclightDebuff',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			damage: 0,
			buffs: [{
				i: spell.config.target,
				row: my.row, // this identifies unique buff state/icon
				key: 'paralyze', // this sets the flag,
				duration: buffs.arclight.paralyzeDuration,
			}]
		}])

		spell.triggerSkillCooldown(spell.config.skillIndex)
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
		damages = []
		damages.push({
			key: 'primevalWithering',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage(spell.config.target, -100)
		})
		combat.txDotMob(damages)
	}
	function moltenAegis(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
			fixTarget: false,
			isMob: false,
			oocEnabled: true,
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, moltenAegisCompleted)
	}
	function moltenAegisCompleted() {
		damages = []
		damages.push({
			index: spell.config.target,
			key: 'moltenAegis',
			spellType: spell.data.spellType,
			level: my.skills[spell.config.skillIndex],
			...stats.spellDamage(spell.config.target, -100)
		})
		combat.txBuffHero(damages)
		spell.triggerSkillCooldown(spell.config.skillIndex)
	}
	function conviction(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
			fixTarget: false,
			isMob: false,
			oocEnabled: true,
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, convictionCompleted)
	}
	function convictionCompleted() {
		combat.txBuffHero([{
			key: 'conviction',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			level: my.skills[spell.config.skillIndex],
			damage: 0
		}])
	}
	function celestialFrenzy(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
			fixTarget: false,
			isMob: false,
			oocEnabled: true,
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, celestialFrenzyCompleted)
	}
	function celestialFrenzyCompleted() {
		combat.txBuffHero([{
			key: 'celestialFrenzy',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			level: my.skills[spell.config.skillIndex],
			damage: 0
		}])
	}

}($, _, TweenMax);