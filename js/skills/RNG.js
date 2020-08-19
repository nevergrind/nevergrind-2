!function($, _, TweenMax, Linear, undefined) {
	skill.RNG = {
		crossSlash,
		explosiveShot,
		trueshotStrike,
		spreadShot,
		bladeStorm,
		suppressingVolley,
		ignite,
		igniteCompleted,
		shockNova,
		faerieFlame,
		fungalGrowth,
		shimmeringOrb,
		spiritOfTheHunter,
	}
	let enhancedDamage, hit, config
	let damages = []
	///////////////////////////////////////////
	function crossSlash(index, data) {
		console.info('crossSlash', index)
		// check constraints
		config = {
			...skills.getDefaults(index),
			requiresFrontRow: true,
		}
		if (skills.notReady(config)) return
		// process skill data
		enhancedDamage = data.enhancedDamage[my.skills[index]]
		damages = []

		for (var i = my.target - 1; i<=my.target+1; i++) {
			if (i <= 4) {
				hit = stats.damage()
				damages.push({
					...hit,
					key: 'crossSlash',
					index: i,
					enhancedDamage: enhancedDamage,
					requiresFrontRow: true,
				})
			}
		}
		combat.txDamageMob(damages)
		// animate timers
		spell.triggerCooldown(index, data)
		button.triggerGlobalCooldown()
	}

	function explosiveShot(index, data) {
		// check constraints
		config = {
			...skills.getDefaults(index),
		}
		if (skills.notReady(config)) return
		// process skill data
		enhancedDamage = data.enhancedDamage[my.skills[index]]
		damages = []
		let splashIndex = -1
		let tgt
		for (var i=0; i<3; i++) {
			tgt = battle.getSplashTarget(splashIndex++)
			hit = stats.rangedDamage(tgt)
			damages.push({
				...hit,
				key: 'explosiveShot',
				index: tgt,
				enhancedDamage: enhancedDamage,
				damageType: 'fire',
			})
		}
		combat.txDamageMob(damages)

		// animate timers
		spell.triggerCooldown(index, data)
		button.triggerGlobalCooldown()
	}
	function trueshotStrike(index, data) {
		// check constraints
		config = {
			...skills.getDefaults(index),
		}
		if (skills.notReady(config)) return

		// process skill data
		let tgt = my.target
		enhancedDamage = data.enhancedDamage[my.skills[index]]
		damages = []
		hit = stats.rangedDamage(tgt)
		damages.push({
			...hit,
			key: 'trueshotStrike',
			index: tgt,
			isPiercing: true,
			enhancedDamage: enhancedDamage,
		})
		combat.txDamageMob(damages)

		// animate timers
		spell.triggerCooldown(index, data)
		button.triggerGlobalCooldown()
	}
	function spreadShot(index, data) {
		// check constraints
		config = {
			...skills.getDefaults(index),
		}
		if (skills.notReady(config)) return
		// select targets
		let targets = [my.target]
		mobs.forEach((mob, index) => {
			if (mob.name) {
				if (!targets.includes(index) && targets.length < 5) {
					targets.push(index)
				}
			}
		})
		// process skill data
		enhancedDamage = data.enhancedDamage[my.skills[index]]
		damages = []
		targets.forEach(target => {
			hit = stats.rangedDamage(target)
			damages.push({
				...hit,
				key: 'spreadShot',
				index: target,
				enhancedDamage: enhancedDamage,
			})
		})
		combat.txDamageMob(damages)

		// animate timers
		spell.triggerCooldown(index, data)
		button.triggerGlobalCooldown()
	}
	function bladeStorm(index, data) {
		// check constraints
		config = {
			...skills.getDefaults(index),
		}
		if (skills.notReady(config)) return
		// process skill data
		enhancedDamage = data.enhancedDamage[my.skills[index]]
		let tgt = my.target
		let hits = 5
		damages = []
		for (var i=0; i<hits; i++) {
			let finalBlow = i === hits - 1
			hit = stats.damage(false, finalBlow)
			hit.damage = finalBlow ? hit.damage * 4 : hit.damage
			damages.push({
				...hit,
				key: 'bladeStorm',
				index: tgt,
				isPiercing: true,
				enhancedDamage: enhancedDamage,
			})
		}
		combat.txDamageMob(damages)

		// animate timers
		spell.triggerCooldown(index, data)
		button.triggerGlobalCooldown()
	}
	function suppressingVolley(index, data) {
		// check constraints
		config = {
			...skills.getDefaults(index),
		}
		if (skills.notReady(config)) return

		// process skill data
		enhancedDamage = data.enhancedDamage[my.skills[index]]
		damages = []
		let splashIndex = -1
		let tgt
		for (var i=0; i<3; i++) {
			tgt = battle.getSplashTarget(splashIndex++)
			hit = stats.rangedDamage(tgt)
			damages.push({
				...hit,
				index: tgt,
				key: 'suppressingVolley',
				enhancedDamage: enhancedDamage,
				buffs: [{
					i: tgt, // target
					row: my.row, // this identifies unique buff state/icon
					key: 'suppressingVolley', // this sets the flag
				}],
			})
		}
		combat.txDamageMob(damages)
		// animate timers
		spell.triggerCooldown(index, data)
		button.triggerGlobalCooldown()
		// special effects
	}
	function ignite(index, data) {
		if (timers.castBar < 1) return
		// check constraints
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config)) return
		spell.startCasting(index, data, igniteCompleted)
	}
	function igniteCompleted() {
		damages = []
		damages.push({
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			buffs: [{
				i: spell.config.target, // target
				row: my.row, // this identifies unique buff state/icon
				key: 'igniteArmor', // this sets the flag
			}],
			...stats.spellDamage()
		})
		combat.txDamageMob(damages)
	}
	function shockNova(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
			anyTarget: true,
		}
		if (skills.notReady(spell.config)) return
		spell.startCasting(index, data, shockNovaCompleted)
	}
	function shockNovaCompleted() {
		damages = []
		for (var i=0; i<mob.max; i++) {
			if (mobs[i].hp > 0) {
				damages.push({
					index: i,
					spellType: spell.data.spellType,
					damageType: spell.data.damageType,
					isMob: spell.config.isMob,
					effects: { stagger: true },
					...stats.spellDamage()
				})
			}
		}
		combat.txDamageMob(damages)
	}
	function faerieFlame(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config)) return
		spell.startCasting(index, data, faerieFlameCompleted)
	}
	function faerieFlameCompleted() {
		damages = []
		damages.push({
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			buffs: [{
				i: spell.config.target, // target
				row: my.row, // this identifies unique buff state/icon
				key: 'faerieFlame', // this sets the flag
			}],
			...stats.spellDamage()
		})
		combat.txDamageMob(damages)
	}
	function fungalGrowth(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
			fixTarget: false,
			isMob: false,
			oocEnabled: true,
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, fungalGrowthCompleted)
	}
	function fungalGrowthCompleted() {
		combat.txHotHero([{
			index: spell.config.target,
			key: 'fungalGrowth',
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage(false, true) // force crit, get non-crit,
		}])
	}
	function shimmeringOrb(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
			fixTarget: false,
			isMob: false,
			oocEnabled: true,
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, shimmeringOrbCompleted)
	}
	function shimmeringOrbCompleted() {
		damages = []
		damages.push({
			index: spell.config.target,
			key: 'shimmeringOrb',
			spellType: spell.data.spellType,
			level: my.skills[spell.config.skillIndex],
			...stats.spellDamage(false, true) // forceCrit, getNonCrit
		})
		combat.txBuffHero(damages)
		spell.triggerCooldown(spell.config.skillIndex)
	}

	function spiritOfTheHunter(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
			fixTarget: false,
			isMob: false,
			oocEnabled: true,
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, spiritOfTheHunterCompleted)
	}
	function spiritOfTheHunterCompleted() {
		damages = []
		damages.push({
			index: spell.config.target,
			key: 'spiritOfTheHunter',
			spellType: spell.data.spellType,
			level: my.skills[spell.config.skillIndex],
			...stats.spellDamage(false, true) // forceCrit, getNonCrit
		})
		combat.txBuffHero(damages)
		spell.triggerCooldown(spell.config.skillIndex)
	}
}($, _, TweenMax, Linear);