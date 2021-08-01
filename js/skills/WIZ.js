!function($, _, TweenMax, undefined) {
	skill.WIZ = {
		fireBolt,
		iceBolt,
		lightningBolt,
		magicMissiles,
		fireball,
		chainLightning,
		frostNova,
		meteor,
		frozenBarrier,
		frozenBarrierEffect,
		mirrorImage,
		manaShell,
		deepFreeze,
	}
	///////////////////////////////////////////
	let enhancedDamage, hit, config, i, splashIndex, tgt, damages = []
	///////////////////////////////////////////
	function fireBolt(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, fireBoltCompleted)
	}
	function fireBoltCompleted() {
		combat.txDamageMob([{
			key: 'fireBolt',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage(spell.config.target)
		}])
	}
	function iceBolt(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, iceBoltCompleted)
	}
	function iceBoltCompleted() {
		combat.txDamageMob([{
			key: 'iceBolt',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			buffs: [{
				i: spell.config.target, // target
				row: my.row, // this identifies unique buff state/icon
				key: 'chill', // this sets the flag,
				duration: buffs.iceBolt.chillDuration,
			}],
			...stats.spellDamage(spell.config.target),
		}])
	}
	function lightningBolt(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, lightningBoltCompleted)
	}
	function lightningBoltCompleted() {
		combat.txDamageMob([{
			key: 'lightningBolt',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage(spell.config.target)
		}])
	}
	function magicMissiles(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, magicMissilesCompleted)
	}
	function magicMissilesCompleted() {
		let tgt = spell.config.target
		let spellType = spell.data.spellType
		let damageType = spell.data.damageType
		for (var i=0; i<3; i++) {
			!function(i) {
				const damages = {
					key: 'magicMissiles',
					index: tgt,
					spellType: spellType,
					damageType: damageType,
					...stats.spellDamage(tgt)
				}
				delayedCall(i * .5, () => {
					combat.txDamageMob([damages])
				})
			}(i)
		}
	}
	function fireball(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, fireballCompleted)
	}
	function fireballCompleted() {
		splashIndex = -1
		damages = []
		battle.getConeTargets(spell.config.target).forEach(tgt => {
			damages.push({
				key: 'fireball',
				index: tgt,
				spellType: spell.data.spellType,
				damageType: spell.data.damageType,
				...stats.spellDamage(tgt),
			})
		})
		combat.txDamageMob(damages)
		spell.triggerSkillCooldown(spell.config.skillIndex)
	}
	function chainLightning(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, chainLightningCompleted)
	}
	function chainLightningCompleted() {
		let spellType = spell.data.spellType
		let damageType = spell.data.damageType

		battle.getConeTargets(spell.config.target, 5).forEach((tgt, i) => {
			const damages = {
				key: 'chainLightning',
				index: tgt,
				spellType: spellType,
				damageType: damageType,
				...stats.spellDamage(tgt)
			}
			delayedCall(i * .125, () => {
				combat.txDamageMob([damages])
			})
		})
		spell.triggerSkillCooldown(spell.config.skillIndex)
	}
	function frostNova(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, frostNovaCompleted)
	}
	function frostNovaCompleted() {
		damages = []
		for (i=0; i<mob.max; i++) {
			if (mob.isAlive(i)) {
				damages.push({
					key: 'frostNova',
					index: i,
					spellType: spell.data.spellType,
					damageType: spell.data.damageType,
					buffs: [{
						i: i, // target
						row: my.row, // this identifies unique buff state/icon
						key: 'chill', // this sets the flag,
						duration: buffs.frostNova.chillDuration,
					}],
					...stats.spellDamage(i)
				})
			}
		}
		combat.txDamageMob(damages)
		spell.triggerSkillCooldown(spell.config.skillIndex)
	}
	function meteor(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, meteorCompleted)
	}
	function meteorCompleted() {
		let tgt = spell.config.target
		let spellType = spell.data.spellType
		let damageType = spell.data.damageType

		socket.publish('party' + my.partyId, {
			route: 'p->damage',
			animate: true,
			row: my.row,
			index: tgt,
			key: 'meteorLaunch',
		})

		if (mob.isAlive(tgt)) {
			const damages = []
			damages.push({
				key: 'meteor',
				index: tgt,
				spellType: spellType,
				damageType: damageType,
				...stats.spellDamage(tgt)
			})
			// AE DoT damage
			splashIndex = -2
			const dotDamages = []
			delayedCall(2, () => {
				for (var i=0; i<5; i++) {
					tgt = battle.getSplashTarget(splashIndex++)
					dotDamages.push({
						key: 'meteorStrike',
						index: tgt,
						damageType: damageType,
						...stats.spellDamage(tgt, -100)
					})
					dotDamages[i].damage = round(dotDamages[i].damage * .35)
					if (dotDamages[i].damage < 1) dotDamages[i].damage = 1
				}
				combat.txDamageMob(damages)
				combat.txDotMob(dotDamages)
			})
		}

		spell.triggerSkillCooldown(spell.config.skillIndex)
	}
	function frozenBarrier(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
			anyTarget: true,
			oocEnabled: true,
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, frozenBarrierCompleted)
	}
	function frozenBarrierCompleted() {
		damages = []
		damages.push({
			index: my.row,
			key: 'frozenBarrier',
			spellType: spell.data.spellType,
			level: my.skills[spell.config.skillIndex],
			...stats.spellDamage(spell.config.target, -100)
		})
		combat.txBuffHero(damages)
		spell.triggerSkillCooldown(spell.config.skillIndex)
	}
	function frozenBarrierEffect() {
		let val = round(my.buffs.frozenBarrier.damage / 8)
		timers.frozenBarrier.kill()
		timers.frozenBarrier = TweenMax.to(EMPTY_OBJECT, 1, {
			repeat: 8,
			onRepeat: () => {
				if (my.hp > 0) {
					combat.updateMyResource(PROP.HP, val)
					combat.updateMyResource(PROP.MP, val)
				}
			},
		})
	}
	function mirrorImage(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
			anyTarget: true,
			oocEnabled: true,
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, mirrorImageCompleted)
	}
	function mirrorImageCompleted() {
		let damages = []
		if (typeof my.buffs.mirrorImage === 'object' &&
			typeof my.buffs.mirrorImage.damage === 'number' &&
			my.buffs.mirrorImage.damage >= 1) {
			my.buffs.mirrorImage.damage = 0
		}
		damages.push({
			index: my.row,
			key: 'mirrorImage',
			spellType: spell.data.spellType,
			level: my.skills[spell.config.skillIndex],
			...stats.spellDamage(spell.config.target, -100)
		})
		combat.txBuffHero(damages)
		spell.triggerSkillCooldown(spell.config.skillIndex)
	}
	function manaShell(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
			fixTarget: false,
			isMob: false,
			oocEnabled: true,
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, manaShellCompleted)
	}
	function manaShellCompleted() {
		damages = []
		damages.push({
			index: spell.config.target,
			key: 'manaShell',
			spellType: spell.data.spellType,
			level: my.skills[spell.config.skillIndex],
			damage: 0,
		})
		combat.txBuffHero(damages)
	}
	function deepFreeze(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, deepFreezeCompleted)
	}
	function deepFreezeCompleted() {
		combat.txDamageMob([{
			key: 'deepFreeze',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			buffs: [{
				i: spell.config.target, // target
				row: my.row, // this identifies unique buff state/icon
				key: 'freeze', // this sets the flag,
				duration: buffs.deepFreeze.freezeDuration,
			}],
			...stats.spellDamage(spell.config.target)
		}])
		spell.triggerSkillCooldown(spell.config.skillIndex)
	}

}($, _, TweenMax);