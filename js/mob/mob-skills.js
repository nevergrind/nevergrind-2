mobSkills = {};
!function($, _, TweenMax, Linear, Math, undefined) {
	mobSkills = {
		decideSkill,
		autoAttack,
		slam,
		stunPlayer,
		stunPlayerEffect,
		modifyMobStatsByClass,
		Slam: {
			name: 'Slam',
			stunDuration: 3
		}
	}
	let mobDamage = {}, mobDamages
	///////////////////////////////////////////
	function decideSkill(index, row) {
		if (row <= 0) return // player row not found?
		if (mob.isParalyzed(index) && rand() < ParalyzeRate) {
			mobDamages = [{
				row: row,
				isParalyzed: true,
			}]
		}
		else {
			// select a skill to use
			let r = rand()
			if (r < mobs[index].skillChance) {
			// if (true) {
				// do a skill!
				let len = mobs[index].skills.length
				let skillIndex = _.random(1, len) - 1
				let skillName = mobs[index].skills[skillIndex]
				// console.info(index, skillIndex, skillName)
				if (skillName === 'Slam') {
					mobDamages = [mobSkills.slam(index, row)]
				}

				// TODO: heal branch in here at some point?
			}
			else {
				mobDamages = [mobSkills.autoAttack(index, row)]
				if (Math.random() * 100 < mobs[index].doubleAttack) {
					mobDamages.push(mobSkills.autoAttack(index, row))
				}
			}
		}
		// console.info('decideSkill', index, mobDamages)
		combat.txDamageHero(index, mobDamages)

	}
	function slam(i, row) {
		mobDamage = {
			row: row,
			key: 'Slam',
			damage: ~~_.random(ceil(mobs[i].attack * .6), mobs[i].attack * 1.2),
		}
		// console.info('slam', mobDamage)
		return mobDamage
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
		config.dodge = 0
		config.parry = 0
		config.riposte = 0
		config.doubleAttack = 0
		config.skillChance = .1
		// class modifications
		if (config.job === JOB.WARRIOR) {
			config.hp = ~~(config.hp * 1.2)
			config.attack = ~~(config.attack * 1.1)
			if (config.level >= 6) config.dodge = getValueByLevel(config, 7.5)
			if (config.level >= 10) config.parry = getValueByLevel(config, 12.5)
			if (config.level >= 15) config.doubleAttack = getValueByLevel(config, 25)
			if (config.level >= 25) config.riposte = getValueByLevel(config, 12.5)
			config.skills = [
				'Slam',
			];
		}
		else if (config.job === JOB.CRUSADER) {
			config.hp = ~~(config.hp * 1.1)
			config.attack = ~~(config.attack * 1.1);
			if (config.level >= 10) config.dodge = getValueByLevel(config, 7.5)
			if (config.level >= 17) config.parry = getValueByLevel(config, 12.5)
			if (config.level >= 20) config.doubleAttack = getValueByLevel(config, 33)
			if (config.level >= 30) config.riposte = getValueByLevel(config, 10)
			config.skills = [
				'Slam',
				'Divine Grace',
				'Imbued Force',
				'Lay Hands',
			];
		}
		else if (config.job === JOB.SHADOW_KNIGHT) {
			config.hp = ~~(config.hp * 1.2)
			config.attack = ~~(config.attack * 1.1);
			if (config.level >= 10) config.dodge = getValueByLevel(config, 7.5)
			if (config.level >= 17) config.parry = getValueByLevel(config, 10)
			if (config.level >= 20) config.doubleAttack = getValueByLevel(config, 33)
			if (config.level >= 30) config.riposte = getValueByLevel(config, 12.5)
			config.skills = [
				'Slam',
				'Engulfing Darkness',
				'Fear',
				'Venom Bolt',
			];
		}
		else if (config.job === JOB.MONK) {
			config.attack = ~~(config.attack * 1.15);
			config.dodge = getValueByLevel(config, 7.5)
			if (config.level >= 12) config.parry = getValueByLevel(config, 7.5)
			if (config.level >= 15) config.doubleAttack = getValueByLevel(config, 40)
			if (config.level >= 35) config.riposte = getValueByLevel(config, 10)
			config.skills = [
				'Shadow Kick',
				'Dragon Punch',
			];
		}
		else if (config.job === JOB.ROGUE) {
			config.attack = ~~(config.attack * 1.15);
			if (config.level >= 4) config.dodge = getValueByLevel(config, 10)
			if (config.level >= 17) config.parry = getValueByLevel(config, 7.5)
			if (config.level >= 16) config.doubleAttack = getValueByLevel(config, 40)
			if (config.level >= 30) config.riposte = getValueByLevel(config, 7.5)
			config.skills = [
				'Backstab',
				'Widow Strike'
			];
		}
		else if (config.job === JOB.RANGER) {
			config.attack = ~~(config.attack * 1.15);
			if (config.level >= 8) config.dodge = getValueByLevel(config, 7.5)
			if (config.level >= 18) config.parry = getValueByLevel(config, 10)
			if (config.level >= 20) config.doubleAttack = getValueByLevel(config, 40)
			if (config.level >= 35) config.riposte = getValueByLevel(config, 7.5)
			config.skills = [
				'Light Healing',
				'Faerie Flame',
				'Burning Embers',
				'Charged Bolts',
			];
		}
		else if (config.job === JOB.BARD) {
			config.attack = ~~(config.attack * 1.05);
			if (config.level >= 10) config.dodge = getValueByLevel(config, 10)
			if (config.level >= 17) config.doubleAttack = getValueByLevel(config, 12)
			// cannot dispel bard songs
			config.skills = [
				'Psalm of Flames', // damage shield, FR boost
				'Psalm of Frost', // damage shield, CR boost
				'Elemental Rhythms', // LR, FR, CR
				'Guardian Rhythms', // BR, PR, AR
				'Chant of Battle', // damage shield, FR boost
				'Hymn of Shielding', // % physical damage reduction
				'Hymn of Soothing', // regen hp, mp
			];
		}
		else if (config.job === JOB.DRUID) {
			if (config.level >= 15) config.dodge = getValueByLevel(config, 5)
			config.skills = [
				'Regrowth',
				'Lightning Blast',
				'Starfire',
				'Drifting Death',
			];
		}
		else if (config.job === JOB.CLERIC) {
			if (config.level >= 15) config.dodge = getValueByLevel(config, 5)
			config.skills = [
				'Holy Light',
				'Smite',
				'Imbued Force'
			];
		}
		else if (config.job === JOB.SHAMAN) {
			config.attack = ~~(config.attack * 1.05);
			if (config.level >= 15) config.dodge = getValueByLevel(config, 5)
			config.skills = [
				'Rekindle',
				'Static Shock',
				'Frost Shock',
				'Envenom',
				'Slumber',
			];
		}
		else if (config.job === JOB.WARLOCK) {
			config.hp = ~~(config.hp * .9)
			if (config.level >= 22) config.dodge = getValueByLevel(config, 5)
			config.skills = [
				'Blood Boil',
				'Engulfing Darkness',
				'Fear',
				'Venom Bolt',
			];
		}
		else if (config.job === JOB.ENCHANTER) {
			config.hp = ~~(config.hp * .9)
			if (config.level >= 22) config.dodge = getValueByLevel(config, 5)
			config.skills = [
				'Gravity Flux',
				'Runic Shield',
				'Alacrity',
				'Fiery Enchant',
				'Glacial Enchant',
			];
		}
		else if (config.job === JOB.TEMPLAR) {
			config.hp = ~~(config.hp * .9)
			if (config.level >= 22) config.dodge = getValueByLevel(config, 5)
			config.skills = [
				'Lava Bolt',
				'Frozen Orb',
				'Psionic Storm',
			];
		}
		else if (config.job === JOB.WIZARD) {
			config.hp = ~~(config.hp * .9)
			if (config.level >= 22) config.dodge = getValueByLevel(config, 5)
			config.skills = [
				'Ice Bolt',
				'Arcane Missiles',
				'Lightning Strike',
				'Glacial Spike',
			];
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
			ask.stun({
				index: my.row,
				key: 'particle-small-default',
				duration: stunDuration
			}, false)
		}
	}
}($, _, TweenMax, Linear, Math);