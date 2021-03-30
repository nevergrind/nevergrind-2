!function($, _, TweenMax, undefined) {
	skill.CRU = {
		vengeanceOn: false,
		zealousSlam,
		rebuke,
		vengeance,
		consecrate,
		sealOfDamnation,
		holyWrath,
		divineJudgment,
		blessedHammer,
		sealOfSanctuary,
		divineGrace,
		benevolence,
		jubilee,
	}
	let enhancedDamage, hit, config, i, splashIndex, tgt, damages = [], dam, key
	///////////////////////////////////////////
	function zealousSlam(index, data) {
		// check constraints
		config = {
			...skills.getDefaults(index, data),
		}
		if (skills.notReady(config, data)) return
		spell.expendMana(data, index)

		// process skill data
		let tgt = my.target
		enhancedDamage = data.enhancedDamage[my.skills[index]]
		damages = []
		hit = {
			...stats.skillDamage(tgt, data.critBonus[my.skills[index]]),
			key: 'zealousSlam',
			index: tgt,
			isRanged: data.isRanged,
			enhancedDamage: enhancedDamage,
			hitBonus: data.hitBonus[my.skills[index]],
		}
		if (rand() < buffs.zealousSlam.staggerRate) hit.effects = { stagger: data.staggers }
		damages.push(hit)
		combat.txDamageMob(damages)
		// animate timers
		button.triggerGlobalCooldown()
	}
	function rebuke(index, data) {
		// check constraints
		config = {
			...skills.getDefaults(index, data),
		}
		if (skills.notReady(config, data)) return
		spell.expendMana(data, index)

		// process skill data
		enhancedDamage = data.enhancedDamage[my.skills[index]]
		damages = []
		splashIndex = -1
		for (var i=0; i<3; i++) {
			tgt = battle.getSplashTarget(splashIndex++)
			hit = stats.skillDamage(tgt, data.critBonus[my.skills[index]])
			damages.push({
				...hit,
				key: 'rebuke',
				index: tgt,
				enhancedDamage: enhancedDamage,
				hitBonus: data.hitBonus[my.skills[index]],
				effects: { stagger: spell.data.staggers },
			})
		}
		combat.txDamageMob(damages)
		spell.triggerSkillCooldown(index, data)
		button.triggerGlobalCooldown()
	}
	function vengeance(index, data) {
		// check constraints
		config = {
			...skills.getDefaults(index, data),
			requiresFrontRow: data.requiresFrontRow,
		}
		if (skills.notReady(config, data)) return
		spell.expendMana(data, index)

		// process skill data
		let tgt = my.target
		enhancedDamage = data.enhancedDamage[my.skills[index]]
		skill.CRU.vengeanceOn = true
		damages = []
		damages.push({
			...stats.skillDamage(tgt, data.critBonus[my.skills[index]]),
			key: 'vengeance',
			index: tgt,
			requiresFrontRow: data.requiresFrontRow,
			enhancedDamage: enhancedDamage,
			hitBonus: data.hitBonus[my.skills[index]],
		})
		combat.txDamageMob(damages)
		spell.triggerSkillCooldown(index, data)
		button.triggerGlobalCooldown()
	}
	function consecrate(index, data) {
		// check constraints
		config = {
			...skills.getDefaults(index, data),
		}
		if (skills.notReady(config, data)) return
		spell.expendMana(data, index)

		// process skill data
		let originalTarget = my.target
		enhancedDamage = data.enhancedDamage[my.skills[index]]
		damages = []
		let splashIndex = -2
		for (i=0; i<5; i++) {
			tgt = battle.getSplashTarget(splashIndex++)
			hit = stats.skillDamage(tgt, data.critBonus[my.skills[index]])
			if (originalTarget !== tgt) hit.damage *= .5
			damages.push({
				...hit,
				key: 'consecrate',
				index: tgt,
				damageType: originalTarget === tgt ? DAMAGE_TYPE.PHYSICAL : DAMAGE_TYPE.ARCANE,
				enhancedDamage: enhancedDamage,
				hitBonus: data.hitBonus[my.skills[index]],
			})
		}
		combat.txDamageMob(damages)
		spell.triggerSkillCooldown(index, data)
		button.triggerGlobalCooldown()

		combat.txBuffHero([{
			key: 'consecrateBuff',
			index: my.row,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			level: my.skills[index],
			damage: 0
		}])

		ask.consecrateBuff({index: my.row})
	}
	function sealOfDamnation(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, sealOfDamnationCompleted)
	}
	function sealOfDamnationCompleted() {
		combat.txDamageMob([{
			key: 'sealOfDamnation',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage(spell.config.target),
			buffs: [{
				i: spell.config.target, // target
				row: my.row, // this identifies unique buff state/icon
				key: 'sealOfDamnation', // this sets the flag
			}],
		}])
		spell.triggerSkillCooldown(spell.config.skillIndex)
	}
	function holyWrath(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, holyWrathCompleted)
	}
	function holyWrathCompleted() {
		combat.txDamageMob([{
			key: 'holyWrath',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			buffs: [{
				i: spell.config.target, // target
				row: my.row, // this identifies unique buff state/icon
				key: 'stun', // this sets the flag,
				duration: buffs.holyWrath.stunDuration,
			}],
			...stats.spellDamage(spell.config.target)
		}])
		spell.triggerSkillCooldown(spell.config.skillIndex)
	}
	function divineJudgment(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, divineJudgmentCompleted)
	}
	function divineJudgmentCompleted() {
		combat.txDamageMob([{
			key: 'divineJudgment',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			isBlighted: spell.data.isBlighted,
			...stats.spellDamage(spell.config.target)
		}])
		spell.triggerSkillCooldown(spell.config.skillIndex)
	}
	function blessedHammer(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
			requiresFrontRow: data.requiresFrontRow,
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, blessedHammerCompleted)
	}
	function blessedHammerCompleted() {
		let spellType = spell.data.spellType
		let damageType = spell.data.damageType
		let isBlighted = spell.data.isBlighted
		let targetPattern = [0, 1, 2, -2, -1]
		let targets = []
		for (var i=0; i<5; i++) {
			targets.push(battle.getSplashTarget(targetPattern[i]))
		}
		targets.forEach((tgt, i) => {
			delayedCall(i * .25, () => {
				damages = []
				hit = {
					key: 'blessedHammer',
					index: tgt,
					spellType: spellType,
					damageType: damageType,
					isBlighted: isBlighted,
					...stats.spellDamage(tgt),
				}
				if (rand() > .5) {
					hit.effects = { stagger: spell.data.staggers }
				}
				damages.push(hit)
				combat.txDamageMob(damages)
			})
		})
		socket.publish('party' + my.partyId, {
			route: 'p->damage',
			animate: true,
			index: targets[0],
			key: 'blessedHammer',
		})
		spell.triggerSkillCooldown(spell.config.skillIndex)
	}
	function sealOfSanctuary(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
			oocEnabled: true,
			anyTarget: true,
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, sealOfSanctuaryCompleted)
	}
	function sealOfSanctuaryCompleted() {
		combat.txBuffHero([{
			key: 'sealOfSanctuary',
			index: my.row,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			level: my.skills[spell.config.skillIndex],
			damage: 0
		}])
		spell.triggerSkillCooldown(spell.config.skillIndex)
	}
	function divineGrace(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
			fixTarget: false,
			isMob: false,
			oocEnabled: true,
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, divineGraceCompleted)
	}
	function divineGraceCompleted() {
		damages = []
		damages.push({
			index: spell.config.target,
			name: spell.config.targetName,
			key: 'divineGrace',
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage(spell.config.target)
		})
		combat.txHotHero(damages)
	}
	function benevolence(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
			oocEnabled: true,
			anyTarget: true,
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, benevolenceCompleted)
	}
	function benevolenceCompleted() {
		damages = []
		party.presence.forEach(p => {
			damages.push({
				index: p.row,
				name: p.name,
				key: 'benevolence',
				spellType: spell.data.spellType,
				damageType: spell.data.damageType,
				...stats.spellDamage(p.row)
			})
		})
		combat.txHotHero(damages)
		spell.triggerSkillCooldown(spell.config.skillIndex)
	}
	function jubilee(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
			anyTarget: true,
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, jubileeCompleted)
	}
	function jubileeCompleted() {
		damages = []
		for (var i=0; i<mob.max; i++) {
			if (mob.isAlive(i)) {
				hit = {
					index: i,
					key: 'jubilee',
					spellType: spell.data.spellType,
					damageType: spell.data.damageType,
					isMob: spell.config.isMob,
					...stats.spellDamage(i)
				}
				if (rand() > .5) {
					hit.effects = { stagger: spell.data.staggers }
				}
				damages.push(hit)
			}
		}
		combat.txDamageMob(damages)
		spell.triggerSkillCooldown(spell.config.skillIndex)
	}

}($, _, TweenMax);