!function($, _, TweenMax, undefined) {
	skill.SHD = {
		shadowBreak,
		deathStrike,
		deathStrikeHeal,
		crescentCleave,
		doomThrust,
		astralBlade,
		ravagingPlague,
		decayingDoom,
		bloodTerror,
		lifeTap,
		vampiricLust,
		bloodFeast,
		markOfRemphan,
	}
	let enhancedDamage, hit, config, i, splashIndex, tgt, damages = [], dam, key
	///////////////////////////////////////////
	function shadowBreak(index, data) {
		// check constraints
		config = {
			...skills.getDefaults(index, data),
		}
		if (skills.notReady(config)) return
		spell.expendMana(data, index)

		// process skill data
		let tgt = my.target
		enhancedDamage = data.enhancedDamage[my.skills[index]]
		if (my.shieldIsEquipped()) enhancedDamage += .5
		damages = []
		damages.push({
			...stats.skillDamage(data.critBonus[my.skills[index]]),
			key: 'shadowBreak',
			index: tgt,
			enhancedDamage: enhancedDamage,
			hitBonus: data.hitBonus[my.skills[index]],
		})
		combat.txDamageMob(damages)
		button.triggerGlobalCooldown()
	}
	function deathStrike(index, data) {
		// check constraints
		config = {
			...skills.getDefaults(index, data),
		}
		if (skills.notReady(config)) return
		spell.expendMana(data, index)

		// process skill data
		enhancedDamage = data.enhancedDamage[my.skills[index]]
		damages = []
		damages.push({
			...stats.skillDamage(data.critBonus[my.skills[index]]),
			key: 'deathStrike',
			index: my.target,
			enhancedDamage: enhancedDamage,
			hitBonus: data.hitBonus[my.skills[index]],
		})
		combat.txDamageMob(damages)
		spell.triggerCooldown(index, data)
		button.triggerGlobalCooldown()
	}
	function deathStrikeHeal(hit) {
		combat.txHotHero([{
			index: my.row,
			key: 'deathStrike',
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			damage: Math.max(1, round(hit.damage * .2))
		}])
	}
	function crescentCleave(index, data) {
		// check constraints
		config = {
			...skills.getDefaults(index, data),
		}
		if (skills.notReady(config)) return
		spell.expendMana(data, index)

		enhancedDamage = data.enhancedDamage[my.skills[index]]
		damages = []
		splashIndex = -1
		for (var i=0; i<3; i++) {
			tgt = battle.getSplashTarget(splashIndex++)
			damages.push({
				...stats.skillDamage(data.critBonus[my.skills[index]]),
				key: 'crescentCleave',
				index: tgt,
				enhancedDamage: enhancedDamage,
				hitBonus: data.hitBonus[my.skills[index]],
			})
		}
		combat.txDamageMob(damages)
		spell.triggerCooldown(index, data)
	}
	function doomThrust(index, data) {
		// check constraints
		config = {
			...skills.getDefaults(index, data),
			isRanged: true,
		}
		if (skills.notReady(config)) return
		spell.expendMana(data, index)

		// process skill data
		enhancedDamage = data.enhancedDamage[my.skills[index]]
		damages = []
		damages.push({
			...stats.skillDamage(data.critBonus[my.skills[index]]),
			key: 'doomThrust',
			index: my.target,
			enhancedDamage: enhancedDamage,
			hitBonus: data.hitBonus[my.skills[index]],
		})
		combat.txDamageMob(damages)
		spell.triggerCooldown(index, data)
		button.triggerGlobalCooldown()
		// dot
		damages = []
		hit = stats.skillDamage(-100)
		damages.push({
			key: 'doomThrust',
			index: my.target,
			damageType: DAMAGE_TYPE.BLOOD,
			damage: round(hit.damage * data.dotModifier)
		})
		combat.txDotMob(damages)
	}
	function astralBlade(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, astralBladeCompleted)
	}
	function astralBladeCompleted() {
		let originalTarget = my.target
		let firstTargets = [-2, -1, 0, 1, 2]
		for (var i=0; i<12; i++) {
			!function(i) {
				let splashIndex
				if (i <= 4) {
					// guarantee at least one hit per 5x
					splashIndex = _.random(0, firstTargets.length - 1)
					splashIndex = firstTargets.splice(splashIndex, 1)
					splashIndex = splashIndex[0]
				}
				else {
					splashIndex = _.random(-2, 2)
				}
				let tgt = battle.getSplashTarget(splashIndex, originalTarget)
				delayedCall(i * .1, () => {
					combat.txDamageMob([{
						key: 'astralBlade',
						index: tgt,
						spellType: spell.data.spellType,
						damageType: spell.data.damageType,
						...stats.spellDamage(),
					}])
				})
			}(i)
		}
		spell.triggerCooldown(spell.config.skillIndex)
	}
	function ravagingPlague(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, ravagingPlagueCompleted)
	}
	function ravagingPlagueCompleted() {
		// dd
		combat.txDamageMob([{
			key: 'ravagingPlague',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage()
		}])
		// dot
		damages = []
		hit = stats.spellDamage(-100)
		hit.damage *= 2
		damages.push({
			key: 'ravagingPlague',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...hit
		})
		combat.txDotMob(damages)
	}
	function decayingDoom(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, decayingDoomCompleted)
	}
	function decayingDoomCompleted() {
		// dd
		combat.txDamageMob([{
			key: 'decayingDoom',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage()
		}])
		// dot
		damages = []
		hit = stats.spellDamage(-100)
		hit.damage *= 2
		damages.push({
			key: 'decayingDoom',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...hit
		})
		combat.txDotMob(damages)
	}
	function bloodTerror(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
			anyTarget: true,
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, bloodTerrorCompleted)
	}
	function bloodTerrorCompleted() {
		damages = []
		damages.push({
			key: 'bloodTerror',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage(-100),
		})
		combat.txDotMob(damages)
		// fear effect
		damages.push({
			key: 'bloodTerror',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			damage: 0,
			buffs: [{
				i: spell.config.target, // target
				row: my.row, // this identifies unique buff state/icon
				key: 'fear', // this sets the flag,
				duration: 12,
			}],
		})
		combat.txDamageMob(damages)
		spell.triggerCooldown(spell.config.skillIndex)
	}
	function lifeTap(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
			oocEnabled: true,
			anyTarget: true,
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, lifeTapCompleted)
	}
	function lifeTapCompleted() {
		combat.txBuffHero([{
			key: 'lifeTap',
			index: my.row,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			level: my.skills[spell.config.skillIndex],
			damage: 0
		}])
		spell.triggerCooldown(spell.config.skillIndex)
	}
	function vampiricLust(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
			fixTarget: false,
			isMob: false,
			oocEnabled: true,
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, vampiricLustCompleted)
	}
	function vampiricLustCompleted() {
		damages = []
		damages.push({
			index: spell.config.target,
			name: spell.config.targetName,
			key: 'vampiricLust',
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage()
		})
		combat.txHotHero(damages)
	}
	function bloodFeast(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
			oocEnabled: true,
			anyTarget: true,
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, bloodFeastCompleted)
	}
	function bloodFeastCompleted() {
		damages = []
		party.presence.forEach(p => {
			damages.push({
				index: p.row,
				name: p.name,
				key: 'bloodFeast',
				spellType: spell.data.spellType,
				damageType: spell.data.damageType,
				...stats.spellDamage()
			})
		})
		combat.txHotHero(damages)
		spell.triggerCooldown(spell.config.skillIndex)
	}
	function markOfRemphan(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
			anyTarget: true,
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, markOfRemphanCompleted)
	}
	function markOfRemphanCompleted() {
		damages = []
		for (var i=0; i<mob.max; i++) {
			if (mob.isAlive(i)) {
				hit = {
					index: i,
					key: 'markOfRemphan',
					spellType: spell.data.spellType,
					damageType: spell.data.damageType,
					isMob: spell.config.isMob,
					...stats.spellDamage()
				}
				if (rand() > .5) {
					hit.effects = { stagger: true }
				}
				damages.push(hit)
			}
		}
		combat.txDamageMob(damages)
		spell.triggerCooldown(spell.config.skillIndex)
	}
}($, _, TweenMax);