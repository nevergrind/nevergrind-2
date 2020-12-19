mobSkills = {};
!function($, _, TweenMax, Linear, Math, undefined) {
	mobSkills = {
		dots: {},
		decideSkill,
		getMobsThatNeedsHealing,
		stunPlayer,
		stunPlayerEffect,
		modifyMobStatsByClass,
		getRandomSkillByJob,
		// mob skills
		autoAttack,
		slam,
		divineJudgment,
		divineGrace,
		layHands,
		bloodTerror,
		decayingDoom,
		harmTouch,
		craneKick,
		hadoken,
		dragonPunch,
		backstab,
		widowStrike,
		trueshotStrike,
		burningEmbers,
		shockNova,
		bellow,
		starfire,
		lightningBlast,
		blizzard,
		naturesTouch,
		smite,
		forceOfGlory,
		divineLight,
		frostRift,
		scourge,
		affliction,
		mysticalGlow,
		venomBolt,
		bloodfire,
		panicStrike,
		engulfingDarkness,
		mindBlitz,
		staticSuffocation,
		subversion,
		lavaBolt,
		staticStorm,
		arclight,
		glacialSpike,
		fireBolt,
		iceBolt,
		magicMissiles,
		lightningBolt,
		fireball,
		WAR: [
			{ chance: .08, key: 'slam' },
		],
		CRU: [
			{ chance: .05, key: 'slam' },
			{ chance: .12, key: 'divineJudgment' },
			{ chance: 0, key: 'divineGrace', maxHeal: 1 },
			{ chance: 0, key: 'layHands' },
		],
		SHD: [
			{ chance: .05, key: 'slam' },
			{ chance: .09, key: 'bloodTerror' },
			{ chance: .13, key: 'decayingDoom' },
			{ chance: 0, key: 'harmTouch' },
		],
		MNK: [
			{ chance: .02, key: 'slam', },
			{ chance: .09, key: 'craneKick' },
			{ chance: .17, key: 'hadoken' },
			{ chance: .25, key: 'dragonPunch' },
		],
		ROG: [
			{ chance: .05, key: 'slam', },
			{ chance: .07, key: 'backstab' },
			{ chance: .1, key: 'widowStrike' },
		],
		RNG: [
			{ chance: .05, key: 'slam', },
			{ chance: .07, key: 'trueshotStrike' },
			{ chance: .15, key: 'burningEmbers' },
			{ chance: .19, key: 'shockNova' },
		],
		BRD: [ // should boost regen and resists too?
			{ chance: .05, key: 'slam', },
			{ chance: .1, key: 'bellow' },
		],
		DRU: [
			{ chance: .03, key: 'slam', },
			{ chance: .1, key: 'starfire' },
			{ chance: .1, key: 'lightningBlast' },
			{ chance: .1, key: 'blizzard' },
			{ chance: 0, key: 'naturesTouch', maxHeal: 2 },
		],
		CLR: [
			{ chance: .03, key: 'slam', },
			{ chance: .1, key: 'smite' },
			{ chance: .12, key: 'forceOfGlory' },
			{ chance: 0, key: 'divineLight', maxHeal: 3 },
		],
		SHM: [
			{ chance: .03, key: 'slam', },
			{ chance: .1, key: 'frostRift' },
			{ chance: .12, key: 'scourge' },
			{ chance: .15, key: 'affliction' },
			{ chance: 0, key: 'mysticalGlow', maxHeal: 2 },
		],
		WLK: [
			{ chance: .02, key: 'slam', },
			{ chance: .1, key: 'venomBolt' },
			{ chance: .12, key: 'bloodfire' },
			{ chance: .15, key: 'panicStrike' },
			{ chance: .15, key: 'engulfingDarkness' },
		],
		ENC: [
			{ chance: .02, key: 'slam', },
			{ chance: .1, key: 'mindBlitz' },
			{ chance: .12, key: 'staticSuffocation' },
			{ chance: .15, key: 'subversion' },
		],
		TMP: [
			{ chance: .02, key: 'slam', },
			{ chance: .05, key: 'lavaBolt', },
			{ chance: .1, key: 'staticStorm' },
			{ chance: .12, key: 'arclight' },
			{ chance: .15, key: 'glacialSpike' },
		],
		WIZ: [
			{ chance: .02, key: 'slam', },
			{ chance: .1, key: 'fireBolt' },
			{ chance: .12, key: 'iceBolt' },
			{ chance: .15, key: 'magicMissiles' },
			{ chance: .15, key: 'lightningBolt' },
			{ chance: .15, key: 'fireball' },
		],
	}
	let mobDamage = {}, mobDamages


	///////////////////////////////////////////
	function getRandomSkillByJob(job) {
		let r = rand()
		let skill = {}
		let len = mobSkills[job].length
		let i = len - 1
		while (i >= 0) {
			if (r < mobSkills[job][i].chance) {
				skill = mobSkills[job][i]
			}
			i--
		}
		return skill
	}

	// const mobHealThreshold = .99
	const mobHealThreshold = .4
	function getMobsThatNeedsHealing() {
		return mobs.filter(m => ((m.hp / m.hpMax) < mobHealThreshold))
	}
	function decideSkill(index, row) {
		if (row <= 0) return // player row not found?
		if (mob.isParalyzed(index) && rand() < ParalyzeRate) {
			mobDamages = [{
				row: row,
				isParalyzed: true,
			}]
		}
		else {
			mobDamages = []

			// should this mob try to heal?
			let injuredMobs = mobSkills.getMobsThatNeedsHealing()
			let injuredMobLen = injuredMobs.length
			let jobData = mobSkills[mobs[index].job]
			let jobHealData = jobData.find(s => s.maxHeal)

			// harm touch
			if (mobs[index].job === JOB.SHADOW_KNIGHT &&
				!mobs[index].usedHarmTouch
				&& rand() < .1666) {
				mobDamages = [mobSkills.harmTouch(index, row)]
			}
			// lay hands
			else if (mobs[index].job === JOB.CRUSADER &&
				!mobs[index].usedLayHands &&
				rand() < .1 &&
				injuredMobLen >= 1) {
				mobDamages = [mobSkills.layHands(index, getHealTarget())]
			}
			// all heals
			else if (typeof jobHealData === 'object' &&
				typeof jobHealData.maxHeal === 'number' &&
				mobs[index].healCount < jobHealData.maxHeal &&
				rand() < .1 &&
				injuredMobLen >= 1) {
				// must have a heal spell, be below heal count max, and find an injured mob
				mobDamages = [mobSkills.divineGrace(index, getHealTarget())]
			}
			// DoTs and DDs
			else {
				// see if a random skill is used or auto attack
				let skillData = mobSkills.getRandomSkillByJob(mobs[index].job)
				// console.info('picked', skillData)
				if (skillData.key) {
					// find skill names
					if (skillData.key === 'slam') {
						mobDamages = [mobSkills.slam(index, row)]
					}
					else if (skillData.key === 'divineJudgment') {
						mobDamages = [mobSkills.divineJudgment(index, row)]
					}
					else if (skillData.key === 'bloodTerror') {
						mobDamages = [mobSkills.bloodTerror(index, row)]
					}
					else if (skillData.key === 'decayingDoom') {
						mobDamages = [mobSkills.decayingDoom(index, row)]
					}
					else if (skillData.key === 'craneKick') {
						mobDamages = [mobSkills.craneKick(index, row)]
					}
					else if (skillData.key === 'hadoken') {
						mobDamages = [mobSkills.hadoken(index, row)]
					}
					else if (skillData.key === 'dragonPunch') {
						mobDamages = [mobSkills.dragonPunch(index, row)]
					}
				}
				else {
					// auto attack
					regularAttack()
				}
			}
			///////////////////////////////////////////////////////////
			function getHealTarget() {
				return injuredMobs[_.random(0, injuredMobLen - 1)].index
			}
		}
		// default just in case
		if (!mobDamages.length) regularAttack()
		else {
			if (mobDamages[0].ticks) {
				// TODO: Add logic for checking if it has been cast on that row with the last ticks * 3 seconds
				let indexRow = index +'-'+ row +'-'+ mobDamages[0].key
				let duration = mobDamages[0].ticks * 3000
				if (typeof mobSkills.dots[indexRow] === 'number' &&
					Date.now() - mobSkills.dots[indexRow] < duration) {
					// not long enough - do a single attack
					regularAttack()
				}
				else {
					mobSkills.dots[indexRow] = Date.now()
				}
			}
		}
		combat.txDamageHero(index, mobDamages)
		////////////////////////////////////////////////////
		function regularAttack() {
			mobDamages = [mobSkills.autoAttack(index, row)]
			if (rand() * 100 < mobs[index].doubleAttack) {
				mobDamages.push(mobSkills.autoAttack(index, row))
			}
		}
	}
	function slam(i, row) {
		return {
			row: row,
			key: 'slam',
			damage: ~~_.random(ceil(mobs[i].attack * .6), mobs[i].attack * 1.2),
		}
	}
	function divineJudgment(i, row) {
		return {
			row: row,
			key: 'divineJudgment',
			damage: ~~_.random(ceil(mobs[i].int * 1.4), mobs[i].int * 1.6),
			damageType: DAMAGE_TYPE.ARCANE,
		}
	}
	function divineGrace(i, tgt) {
		return {
			isHeal: true,
			index: tgt,
			key: 'divineGrace',
			damage: ~~_.random(ceil(mobs[i].int * 18), mobs[i].int * 20),
			damageType: DAMAGE_TYPE.ARCANE,
		}
	}
	function layHands(i, tgt) {
		return {
			isHeal: true,
			index: tgt,
			key: 'layHands',
			damage: ~~_.random(ceil(mobs[i].int * 70), mobs[i].int * 75),
			damageType: DAMAGE_TYPE.ARCANE,
		}
	}
	function bloodTerror(i, row) {
		return {
			row: row,
			key: 'bloodTerror',
			ticks: 7,
			damage: mobs[i].int * 3.3,
			damageType: DAMAGE_TYPE.BLOOD,
		}
	}
	function decayingDoom(i, row) {
		return {
			row: row,
			key: 'decayingDoom',
			ticks: 12,
			damage: mobs[i].int * 5.8,
			damageType: DAMAGE_TYPE.ARCANE,
		}
	}
	function harmTouch(i, row) {
		return {
			row: row,
			key: 'harmTouch',
			damage: ~~_.random(ceil(mobs[i].int * 8.6), mobs[i].int * 9),
			damageType: DAMAGE_TYPE.VOID,
		}
	}
	function craneKick(i, row) {
		return {
			row: row,
			key: 'craneKick',
			damage: ~~_.random(ceil(mobs[i].attack * 1.6), mobs[i].attack * 1.8),
		}
	}
	function hadoken(i, row) {
		return {
			row: row,
			key: 'hadoken',
			damage: ~~_.random(ceil(mobs[i].int * 1.8), mobs[i].int * 2),
			damageType: DAMAGE_TYPE.ARCANE,
		}
	}
	function dragonPunch(i, row) {
		return {
			row: row,
			key: 'dragonPunch',
			damage: ~~_.random(ceil(mobs[i].attack * 1.6), mobs[i].attack * 2.4),
			damageType: DAMAGE_TYPE.FIRE,
		}
	}
	function backstab(i, row) {

	}
	function widowStrike(i, row) {

	}
	function trueshotStrike(i, row) {

	}
	function burningEmbers(i, row) {

	}
	function shockNova(i, row) {

	}
	function bellow(i, row) {

	}
	function starfire(i, row) {

	}
	function lightningBlast(i, row) {

	}
	function blizzard(i, row) {

	}
	function naturesTouch(i, row) {

	}
	function smite(i, row) {

	}
	function forceOfGlory(i, row) {

	}
	function divineLight(i, row) {

	}
	function frostRift(i, row) {

	}
	function scourge(i, row) {

	}
	function affliction(i, row) {

	}
	function mysticalGlow(i, row) {

	}
	function venomBolt(i, row) {

	}
	function bloodfire(i, row) {

	}
	function panicStrike(i, row) {

	}
	function engulfingDarkness(i, row) {

	}
	function mindBlitz(i, row) {

	}
	function staticSuffocation(i, row) {

	}
	function subversion(i, row) {

	}
	function lavaBolt(i, row) {

	}
	function staticStorm(i, row) {

	}
	function arclight(i, row) {

	}
	function glacialSpike(i, row) {

	}
	function fireBolt(i, row) {

	}
	function iceBolt(i, row) {

	}
	function magicMissiles(i, row) {

	}
	function lightningBolt(i, row) {

	}
	function fireball(i, row) {

	}
	function autoAttack(i, row, isPiercing) {
		mobDamage = {
			row: row,
			damage: ~~_.random(ceil(mobs[i].attack * .2), mobs[i].attack),
		}
		if (isPiercing) {
			mobDamage.isPiercing = isPiercing
		}
		return mobDamage
	}
	function getValueByLevel(config, val) {
		// adjusts value based on what it is at max level
		return config.level * val / mob.maxLevel
	}
	function modifyMobStatsByClass(config) {
		//if (typeof config.job === 'undefined') config.job = JOB.WARRIOR
		// base resources
		config.hp = ~~((25 + ((config.level - 1) * 220) * config.hp) * party.presence.length)
		//config.mpMax = config.mp = ~~(10 + ((config.level - 1) * 15) * config.mp)
		//config.spMax = config.sp = ~~(10 + ((config.level - 1) * 15) * config.sp)
		config.attack = ~~(3 + (config.level * 1.66))
		config.int = ~~(3 + (config.level * 1.66))
		config.dodge = 0
		config.parry = 0
		config.riposte = 0
		config.doubleAttack = 0
		// class modifications
		if (config.job === JOB.WARRIOR) {
			config.hp = ~~(config.hp * 1.2)
			config.attack = ~~(config.attack * 1.1)
			if (config.level >= 6) config.dodge = getValueByLevel(config, 7.5)
			if (config.level >= 10) config.parry = getValueByLevel(config, 12.5)
			if (config.level >= 15) config.doubleAttack = getValueByLevel(config, 25)
			if (config.level >= 25) config.riposte = getValueByLevel(config, 12.5)
		}
		else if (config.job === JOB.CRUSADER) {
			config.hp = ~~(config.hp * 1.1)
			config.attack = ~~(config.attack * 1.1)
			config.int = ~~(config.int * 1.1)
			if (config.level >= 10) config.dodge = getValueByLevel(config, 7.5)
			if (config.level >= 17) config.parry = getValueByLevel(config, 12.5)
			if (config.level >= 20) config.doubleAttack = getValueByLevel(config, 33)
			if (config.level >= 30) config.riposte = getValueByLevel(config, 10)
		}
		else if (config.job === JOB.SHADOW_KNIGHT) {
			config.hp = ~~(config.hp * 1.2)
			config.attack = ~~(config.attack * 1.1)
			config.int = ~~(config.int * 1.1)
			if (config.level >= 10) config.dodge = getValueByLevel(config, 7.5)
			if (config.level >= 17) config.parry = getValueByLevel(config, 10)
			if (config.level >= 20) config.doubleAttack = getValueByLevel(config, 33)
			if (config.level >= 30) config.riposte = getValueByLevel(config, 12.5)
		}
		else if (config.job === JOB.MONK) {
			config.attack = ~~(config.attack * 1.15)
			config.dodge = getValueByLevel(config, 7.5)
			if (config.level >= 12) config.parry = getValueByLevel(config, 7.5)
			if (config.level >= 15) config.doubleAttack = getValueByLevel(config, 40)
			if (config.level >= 35) config.riposte = getValueByLevel(config, 10)
		}
		else if (config.job === JOB.ROGUE) {
			config.attack = ~~(config.attack * 1.15)
			if (config.level >= 4) config.dodge = getValueByLevel(config, 10)
			if (config.level >= 17) config.parry = getValueByLevel(config, 7.5)
			if (config.level >= 16) config.doubleAttack = getValueByLevel(config, 40)
			if (config.level >= 30) config.riposte = getValueByLevel(config, 7.5)
		}
		else if (config.job === JOB.RANGER) {
			config.attack = ~~(config.attack * 1.15)
			config.int = ~~(config.int * 1.1)
			if (config.level >= 8) config.dodge = getValueByLevel(config, 7.5)
			if (config.level >= 18) config.parry = getValueByLevel(config, 10)
			if (config.level >= 20) config.doubleAttack = getValueByLevel(config, 40)
			if (config.level >= 35) config.riposte = getValueByLevel(config, 7.5)
		}
		else if (config.job === JOB.BARD) {
			config.attack = ~~(config.attack * 1.05)
			config.int = ~~(config.int * 1.1)
			if (config.level >= 10) config.dodge = getValueByLevel(config, 10)
			if (config.level >= 17) config.doubleAttack = getValueByLevel(config, 12)
			// cannot dispel bard songs
		}
		else if (config.job === JOB.DRUID) {
			config.int = ~~(config.int * 1.2)
			if (config.level >= 15) config.dodge = getValueByLevel(config, 5)
		}
		else if (config.job === JOB.CLERIC) {
			config.int = ~~(config.int * 1.2)
			if (config.level >= 15) config.dodge = getValueByLevel(config, 5)
		}
		else if (config.job === JOB.SHAMAN) {
			config.attack = ~~(config.attack * 1.05)
			config.int = ~~(config.int * 1.2)
			if (config.level >= 15) config.dodge = getValueByLevel(config, 5)
		}
		else if (config.job === JOB.WARLOCK) {
			config.hp = ~~(config.hp * .9)
			config.int = ~~(config.int * 1.3)
			if (config.level >= 22) config.dodge = getValueByLevel(config, 5)
		}
		else if (config.job === JOB.ENCHANTER) {
			config.hp = ~~(config.hp * .9)
			config.int = ~~(config.int * 1.3)
			if (config.level >= 22) config.dodge = getValueByLevel(config, 5)
		}
		else if (config.job === JOB.TEMPLAR) {
			config.hp = ~~(config.hp * .9)
			config.int = ~~(config.int * 1.3)
			if (config.level >= 22) config.dodge = getValueByLevel(config, 5)
		}
		else if (config.job === JOB.WIZARD) {
			config.hp = ~~(config.hp * .9)
			config.int = ~~(config.int * 1.3)
			if (config.level >= 22) config.dodge = getValueByLevel(config, 5)
		}
		config.hpMax = config.hp
	}
	function stunPlayer() {
		let damages = []
		damages.push({
			index: my.row,
			key: 'slam',
			duration: 3,
		})
		combat.txBuffHero(damages)
	}
	function stunPlayerEffect() {
		const stunDuration = 3
		spell.cancelSpell()
		button.pauseAutoAttack()
		my.stunTimer = TweenMax.to(timers, stunDuration, {
			startAt: { stunTimer: 0 },
			stunTimer: 1,
			ease: Power0.easeIn,
			onComplete: stunPlayerComplete,
		})
		animateStun()
		///////////////////////////
		function stunPlayerComplete() {
			button.resumeAutoAttack()
		}
		function animateStun() {
			ask.mobStun({
				index: my.row,
				key: 'particle-small-default',
				duration: stunDuration
			}, false)
		}
	}
}($, _, TweenMax, Linear, Math);