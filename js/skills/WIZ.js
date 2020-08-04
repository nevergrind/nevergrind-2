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
	let enhancedDamage, hit, config
	let damages = []
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
				duration: 8,
			}],
		}])
		/*
		buffs: [{
			i: tgt, // target
			isMob: config.isMob, // no idea what this is for
			row: my.row, // this identifies unique buff state/icon
			key: 'suppressingVolley', // this sets the flag
		}],
		 */
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
		combat.txDamageMob([{
			key: 'magicMissiles',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage()
		}])
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
		combat.txDamageMob([{
			key: 'fireball',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage()
		}])
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
		combat.txDamageMob([{
			key: 'chainLightning',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage()
		}])
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
		combat.txDamageMob([{
			key: 'frostNova',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage()
		}])
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
		combat.txDamageMob([{
			key: 'meteor',
			index: spell.config.target,
			spellType: spell.data.spellType,
			damageType: spell.data.damageType,
			...stats.spellDamage()
		}])
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