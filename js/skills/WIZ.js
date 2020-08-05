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
		iceBlock,
		mirrorImages,
		counterspell,
		brainFreeze,
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
			...stats.spellDamage()
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
			...stats.spellDamage(),
			key: 'iceBolt',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			buffs: [{
				i: spell.config.target, // target
				row: my.row, // this identifies unique buff state/icon
				key: 'chill', // this sets the flag,
				duration: 16,
			}],
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
			...stats.spellDamage()
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
				delayedCall(i * .5, () => {
					combat.txDamageMob([{
						key: 'magicMissiles',
						index: tgt,
						spellType: spellType,
						damageType: damageType,
						isPiercing: true,
						...stats.spellDamage()
					}])
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
		for (i=0; i<3; i++) {
			tgt = battle.getSplashTarget(splashIndex++)
			damages.push({
				key: 'fireball',
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
	function chainLightning(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, chainLightningCompleted)
	}
	function chainLightningCompleted() {
		let i = 0
		let tgt = spell.config.target
		let isFrontRow = tgt <= 4
		let increment
		if (isFrontRow) increment = tgt <= 2
		else increment = tgt <= 7
		let spellType = spell.data.spellType
		let damageType = spell.data.damageType

		while (
			isFrontRow && tgt >= 0 && tgt <= 4 ||
			!isFrontRow && tgt >= 5 && tgt <= mob.max - 1
		) {
			!function(tgt, i) {
				delayedCall(i * .125, () => {
					combat.txDamageMob([{
						key: 'chainLightning',
						index: tgt,
						spellType: spellType,
						damageType: damageType,
						...stats.spellDamage()
					}])
				})
			}(tgt, i)

			i++
			if (increment) tgt++
			else tgt--
		}
		timers.skillCooldowns[spell.config.skillIndex] = 0
		button.processButtonTimers(spell.config.skillIndex, skills.lastData)
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
			if (mobs[i].hp >= 0) {
				damages.push({
					key: 'frostNova',
					index: i,
					spellType: spell.data.spellType,
					damageType: spell.data.damageType,
					buffs: [{
						i: i, // target
						row: my.row, // this identifies unique buff state/icon
						key: 'chill', // this sets the flag,
						duration: 8,
					}],
					...stats.spellDamage()
				})
			}
		}
		combat.txDamageMob(damages)
		timers.skillCooldowns[spell.config.skillIndex] = 0
		button.processButtonTimers(spell.config.skillIndex, skills.lastData)
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
		delayedCall(2, () => {
			if (mobs[tgt].hp >= 0) {
				let damages = []
				damages.push({
					key: 'meteor',
					index: tgt,
					isPiercing: true,
					spellType: spellType,
					damageType: damageType,
					...stats.spellDamage()
				})
				combat.txDamageMob(damages)
				// AE DoT damage
				splashIndex = -2
				damages = []
				for (var i=0; i<5; i++) {
					tgt = battle.getSplashTarget(splashIndex++)
					damages.push({
						key: 'meteorStrike',
						index: tgt,
						damageType: 'fire',
						...stats.spellDamage(false, true)
					})
					damages[i].damage = round(damages[i].damage * .35)
					if (damages[i].damage < 1) damages[i].damage = 1
				}
				combat.txDotMob(damages)
			}
		})
		timers.skillCooldowns[spell.config.skillIndex] = 0
		button.processButtonTimers(spell.config.skillIndex, skills.lastData)
	}
	function iceBlock(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, iceBlockCompleted)
	}
	function iceBlockCompleted() {
		combat.txDamageMob([{
			key: 'iceBlock',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage()
		}])
	}
	function mirrorImages(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, mirrorImagesCompleted)
	}
	function mirrorImagesCompleted() {
		combat.txDamageMob([{
			key: 'mirrorImages',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage()
		}])
	}
	function counterspell(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, counterspellCompleted)
	}
	function counterspellCompleted() {
		combat.txDamageMob([{
			key: 'counterspell',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage()
		}])
	}
	function brainFreeze(index, data) {
		if (timers.castBar < 1) return
		spell.config = {
			...spell.getDefaults(index, data),
		}
		if (skills.notReady(spell.config, data)) return
		spell.startCasting(index, data, brainFreezeCompleted)
	}
	function brainFreezeCompleted() {
		combat.txDamageMob([{
			key: 'smite',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage()
		}])
	}

}($, _, TweenMax);