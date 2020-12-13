mobSkills = {};
!function($, _, TweenMax, Linear, Math, undefined) {
	mobSkills = {
		decideSkill,
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
		stunPlayer,
		stunPlayerEffect,
		modifyMobStatsByClass,
		skillNameByJob,
		/*Slam: {
			name: 'Slam',
			stunDuration: 3
		},*/
		WAR: [
			{ chance: .08, name: 'Slam' },
		],
		CRU: [
			{ chance: .07, name: 'Slam' },
			{ chance: .4, name: 'Divine Judgment' },
			{ chance: 0, name: 'Divine Grace', type: 'heal' },
			{ chance: 0, name: 'Lay Hands' },
		],
		SHD: [
			{ chance: .07, name: 'Slam' },
			{ chance: .07, name: 'Blood Terror' },
			{ chance: .09, name: 'Decaying Doom' },
			{ chance: 0, name: 'Harm Touch' },
		],
		MNK: [
			{ chance: .05, name: 'Slam', },
			{ chance: .07, name: 'Crane Kick' },
			{ chance: .11, name: 'Hadoken' },
			{ chance: .15, name: 'Dragon Punch' },
		],
		ROG: [
			{ chance: .05, name: 'Slam', },
			{ chance: .07, name: 'Backstab' },
			{ chance: .1, name: 'Widow Strike' },
		],
		RNG: [
			{ chance: .05, name: 'Slam', },
			{ chance: .07, name: 'Trueshot Strike' },
			{ chance: .15, name: 'Burning Embers' },
			{ chance: .19, name: 'Shock Nova' },
		],
		BRD: [ // should boost regen and resists too?
			{ chance: .05, name: 'Slam', },
			{ chance: .1, name: 'Bellow' },
		],
		DRU: [
			{ chance: .03, name: 'Slam', },
			{ chance: .1, name: 'Starfire' },
			{ chance: .1, name: 'Lightning Blast' },
			{ chance: .1, name: 'Blizzard' },
			{ chance: 0, name: 'Nature\'s Touch', type: 'heal' },
		],
		CLR: [
			{ chance: .03, name: 'Slam', },
			{ chance: .1, name: 'Smite' },
			{ chance: .12, name: 'Force of Glory' },
			{ chance: 0, name: 'Divine Light', type: 'heal' },
		],
		SHM: [
			{ chance: .03, name: 'Slam', },
			{ chance: .1, name: 'Frost Rift' },
			{ chance: .12, name: 'Scourge' },
			{ chance: .15, name: 'Affliction' },
			{ chance: 0, name: 'Mystical Glow', type: 'heal' },
		],
		WLK: [
			{ chance: .02, name: 'Slam', },
			{ chance: .1, name: 'Venom Bolt' },
			{ chance: .12, name: 'Bloodfire' },
			{ chance: .15, name: 'Panic Strike' },
			{ chance: .15, name: 'Engulfing Darkness' },
		],
		ENC: [
			{ chance: .02, name: 'Slam', },
			{ chance: .1, name: 'Mind Blitz' },
			{ chance: .12, name: 'Static Suffocation' },
			{ chance: .15, name: 'Subversion' },
		],
		TMP: [
			{ chance: .02, name: 'Slam', },
			{ chance: .05, name: 'Lava Bolt', },
			{ chance: .1, name: 'Static Storm' },
			{ chance: .12, name: 'Arclight' },
			{ chance: .15, name: 'Glacial Spike' },
		],
		WIZ: [
			{ chance: .02, name: 'Slam', },
			{ chance: .1, name: 'Fire Bolt' },
			{ chance: .12, name: 'Ice Bolt' },
			{ chance: .15, name: 'Magic Missiles' },
			{ chance: .15, name: 'Lightning Bolt' },
			{ chance: .15, name: 'Fireball' },
		],

	}
	let mobDamage = {}, mobDamages


	///////////////////////////////////////////
	function skillNameByJob(job) {
		let r = rand()
		let name = ''
		let len = mobSkills[job].length
		let i = len - 1
		while (i >= 0) {
			if (r < mobSkills[job][i].chance) {
				name = mobSkills[job][i].name
			}
			i--
		}
		return name
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
			// select a skill to use
			let skillName = mobSkills.skillNameByJob(mobs[index].job)
			if (skillName) {
			// if (true) {
				if (skillName === 'Slam') {
					mobDamages = [mobSkills.slam(index, row)]
				}
				else if (skillName === 'Divine Judgment') {
					mobDamages = [mobSkills.divineJudgment(index, row)]
				}

				// TODO: heal branch in here at some point?
			}
			else {
				// auto attack
				mobDamages = [mobSkills.autoAttack(index, row)]
				if (rand() * 100 < mobs[index].doubleAttack) {
					mobDamages.push(mobSkills.autoAttack(index, row))
				}
			}
			// console.info(index, skillName, mobDamages)
		}
		combat.txDamageHero(index, mobDamages)

	}
	function slam(i, row) {
		return {
			row: row,
			key: 'Slam',
			damage: ~~_.random(ceil(mobs[i].attack * .6), mobs[i].attack * 1.2),
		}
	}
	function divineJudgment(i, row) {
		return {
			row: row,
			key: 'Divine Judgment',
			damage: ~~_.random(ceil(mobs[i].int * 1.4), mobs[i].int * 1.6),
			damageType: DAMAGE_TYPE.ARCANE,
		}
	}
	function divineGrace(i, row) {

	}
	function layHands(i, row) {

	}
	function bloodTerror(i, row) {

	}
	function decayingDoom(i, row) {

	}
	function harmTouch(i, row) {

	}
	function craneKick(i, row) {

	}
	function hadoken(i, row) {

	}
	function dragonPunch(i, row) {

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