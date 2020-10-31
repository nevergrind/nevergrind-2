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
			...stats.spellDamage(spell.config.target)
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
					let splashIndex = -1
					let damages = []
					for (i=0; i<3; i++) {
						let tgt = battle.getSplashTarget(splashIndex++, originalTarget)
						damages.push({
							key: 'fissure',
							index: tgt,
							spellType: spell.data.spellType,
							damageType: spell.data.damageType,
							...stats.spellDamage(tgt),
						})
					}
					combat.txDamageMob(damages)
				})
			}(j)
		}
		spell.triggerSkillCooldown(spell.config.skillIndex)
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
				...stats.spellDamage(tgt),
			})
		}
		combat.txDamageMob(damages)
		spell.triggerSkillCooldown(spell.config.skillIndex)
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
					let splashIndex = -1
					let damages = []
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
							...stats.spellDamage(tgt),
						})
					}
					combat.txDamageMob(damages)
				})
			}(j)
		}
		spell.triggerSkillCooldown(spell.config.skillIndex)
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
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage(spell.config.target, -100)
		})
		combat.txDotMob(damages)
	}
	function moltenBoulder(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
			requiresFrontRow: data.requiresFrontRow,
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, moltenBoulderCompleted)
	}
	function moltenBoulderCompleted() {
		let i = 0
		let tgt = spell.config.target
		let increment = tgt <= 2
		let spellType = spell.data.spellType
		let damageType = spell.data.damageType
		let tgts = []

		while (tgt >= 0 && tgt <= 4) {
			i++
			tgts.push(tgt)
			if (increment) tgt++
			else tgt--
		}
		tgts.reverse()
		const len = tgts.length
		// console.info('moltenBoulder', tgts)
		delayedCall(1, () => {
			tgts.forEach((tgt, i) => {
				delayedCall(i * .333, () => {
					let damages = []
					damages.push({
						key: 'moltenBoulder',
						index: tgt,
						spellType: spellType,
						damageType: damageType,
						...stats.spellDamage(tgt)
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
							damageType: spell.data.damageType,
							...stats.spellDamage(tgt, -100)
						})
						dots[0].damage *= .5
						combat.txDotMob(dots)
					}
					// console.info('moltenBoulder', i, 'target', tgt, damages[Zero].damage)
					combat.txDamageMob(damages)
				})
			})
		})
		spell.triggerSkillCooldown(spell.config.skillIndex)
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
		splashIndex = -1
		damages = []
		for (i=0; i<3; i++) {
			tgt = battle.getSplashTarget(splashIndex++)
			damages.push({
				key: 'barbedThicket',
				index: tgt,
				spellType: spell.data.spellType,
				damageType: spell.data.damageType,
				effects: { stagger: true },
				...stats.spellDamage(tgt),
			})
		}
		combat.txDamageMob(damages)
		spell.triggerSkillCooldown(spell.config.skillIndex)
	}
	function tornado(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
			anyTarget: true,
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, tornadoCompleted)
	}
	function tornadoCompleted() {
		spell.config.target = battle.getRandomTarget()
		damages = []
		damages.push({
			key: 'tornado',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage(spell.config.target)
		})
		damages.push({
			key: 'tornado',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			buffs: [{
				i: spell.config.target,
				row: my.row, // this identifies unique buff state/icon
				key: 'chill', // this sets the flag,
				duration: 30,
			}],
			...stats.spellDamage(spell.config.target)
		})
		combat.txDamageMob(damages)
		spell.triggerSkillCooldown(spell.config.skillIndex)
	}
	function naturesTouch(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
			fixTarget: false,
			isMob: false,
			oocEnabled: true,
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, naturesTouchCompleted)
	}
	function naturesTouchCompleted() {
		damages = []
		damages.push({
			index: spell.config.target,
			name: spell.config.targetName,
			key: 'naturesTouch',
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage(spell.config.target)
		})
		hit = stats.spellDamage(spell.config.target, -100)
		damages.push({
			index: spell.config.target,
			key: 'naturesTouchHot',
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			damage: ~~(hit.damage * .5),
		})
		combat.txHotHero(damages)
	}
	function mossBreath(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
			fixTarget: false,
			isMob: false,
			oocEnabled: true,
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, mossBreathCompleted)
	}
	function mossBreathCompleted() {
		damages = []
		party.presence.forEach(p => {
			damages.push({
				index: p.row,
				name: p.name,
				key: 'mossBreath',
				spellType: spell.data.spellType,
				damageType: spell.data.damageType,
				...stats.spellDamage(p.row)
			})
		})
		combat.txHotHero(damages)
	}
	function synthesize(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
			fixTarget: false,
			isMob: false,
			oocEnabled: true,
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, synthesizeCompleted)
	}
	function synthesizeCompleted() {
		damages = []
		damages.push({
			index: spell.config.target,
			key: 'synthesize',
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage(spell.config.target, -100)
		})
		combat.txHotHero(damages)
	}
	function branchSpirit(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
			fixTarget: false,
			isMob: false,
			oocEnabled: true,
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, branchSpiritCompleted)
	}
	function branchSpiritCompleted() {
		damages = []
		damages.push({
			index: spell.config.target,
			key: 'branchSpirit',
			spellType: spell.data.spellType,
			level: my.skills[spell.config.skillIndex],
			...stats.spellDamage(spell.config.target, -100)
		})
		combat.txBuffHero(damages)
	}
}($, _, TweenMax);