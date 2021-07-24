mobSkills = {};
!function($, _, TweenMax, Linear, Math, Array, Power0, Date, undefined) {
	mobSkills = {
		dots: {},
		decideSkill,
		getMobsThatNeedsHealing,
		// tx effect
		stunPlayerTx,
		fearPlayerTx,
		paralyzePlayerTx,
		silencePlayerTx,
		chillPlayerTx,
		freezePlayerTx,
		applyEffectFilter,
		// rx effect
		txPlayerEffect,
		rxPlayerEffect,
		stunPlayerEffectRx,
		fearPlayerEffectRx,
		paralyzePlayerEffectRx,
		silencePlayerEffectRx,
		chillPlayerEffectRx,
		freezePlayerEffectRx,
		// misc
		modifyMobStatsByTierAndTraits,
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
		creepingChords,
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
		engulfingDarkness,
		bloodFire,
		panicStrike,
		gravityFlux,
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
		initFilter,
		[JOB.WARRIOR]: [
			{ chance: .99, key: 'slam' }, // STUN
		],
		[JOB.CRUSADER]: [
			{ chance: .04, key: 'slam' },
			{ chance: .12, key: 'divineJudgment' },
			{ chance: 0, key: 'divineGrace', maxHeal: 1 },
			{ chance: 0, key: 'layHands' },
		],
		[JOB.SHADOW_KNIGHT]: [
			{ chance: .04, key: 'slam' },
			{ chance: .11, key: 'bloodTerror' }, // BLOOD - FEAR
			{ chance: .16, key: 'decayingDoom' }, // ARCANE - ARMOR
			{ chance: 0, key: 'harmTouch' }, // VOID
		],
		[JOB.MONK]: [
			{ chance: .05, key: 'craneKick' },
			{ chance: .10, key: 'hadoken' }, // ARCANE
			{ chance: .15, key: 'dragonPunch' }, // FIRE
		],
		[JOB.ROGUE]: [
			{ chance: .1, key: 'backstab' },
			{ chance: .15, key: 'widowStrike' }, // POISON
		],
		[JOB.RANGER]: [
			{ chance: .07, key: 'trueshotStrike' },
			{ chance: .12, key: 'burningEmbers' }, // FIRE ARMOR
			{ chance: .16, key: 'shockNova' }, // LIGHTNING
		],
		[JOB.BARD]: [ // should boost regen and resists too?
			{ chance: .10, key: 'bellow' }, // ARCANE
			{ chance: .15, key: 'creepingChords' }, // LIGHTNING PARALYZE
		],
		[JOB.DRUID]: [
			{ chance: .1, key: 'starfire' }, // FIRE
			{ chance: .15, key: 'lightningBlast' }, // LIGHTNING SILENCE?
			{ chance: .2, key: 'blizzard' }, // ICE CHILL?
			{ chance: 0, key: 'naturesTouch', maxHeal: 2 }, // ARCANE
		],
		[JOB.CLERIC]: [
			{ chance: .1, key: 'smite' }, // ARCANE
			{ chance: .15, key: 'forceOfGlory' }, // ARCANE STUN?
			{ chance: 0, key: 'divineLight', maxHeal: 3 },
		],
		[JOB.SHAMAN]: [
			{ chance: .1, key: 'frostRift' }, // ICE CHILL
			{ chance: .15, key: 'scourge' }, // BLOOD
			{ chance: .2, key: 'affliction' }, // POISON
			{ chance: 0, key: 'mysticalGlow', maxHeal: 2 },
		],
		[JOB.WARLOCK]: [
			{ chance: .06, key: 'venomBolt' }, // POISON
			{ chance: .12, key: 'engulfingDarkness' }, // POISON
			{ chance: .19, key: 'bloodFire' }, // FIRE
			{ chance: .25, key: 'panicStrike' }, // ARCANE FEAR
		],
		[JOB.ENCHANTER]: [
			{ chance: .06, key: 'gravityFlux' }, // ARCANE STUN (brief)
			{ chance: .12, key: 'mindBlitz' }, // ARCANE SILENCE?
			{ chance: .19, key: 'staticSuffocation' }, // LIGHTNING PARALYZE
			{ chance: .25, key: 'subversion' }, // POISON
		],
		[JOB.TEMPLAR]: [
			{ chance: .06, key: 'lavaBolt', }, // FIRE
			{ chance: .12, key: 'staticStorm' }, // LIGHTNING SILENCE?
			{ chance: .19, key: 'arclight' }, // LIGHTNING PARALYZE
			{ chance: .25, key: 'glacialSpike' }, // ICE CHILL?
		],
		[JOB.WIZARD]: [
			{ chance: .05, key: 'fireBolt' }, // FIRE
			{ chance: .1, key: 'iceBolt' }, // ICE CHILL
			{ chance: .15, key: 'magicMissiles' }, // ARCANE SILENCE
			{ chance: .2, key: 'lightningBolt' }, // LIGHTNING PARALYZE
			{ chance: .25, key: 'fireball' }, // FIRE
		],
	}
	let row
	let mobDamage = {}, mobDamages
	const mobHealCooldown = 20000
	const mobStunCooldown = 24000
	const mobFearCooldown = 30000
	const mobParalyzeCooldown = 30000
	const mobSilenceCooldown = 30000
	const mobHarmTouchCooldown = 12000
	const filter = {
		freeze: { pixi: {
			colorize: '#0ff',
			colorizeAmount: 1,
		}},
		chill: { pixi: {
			colorize: '#0ff',
			colorizeAmount: .5,
		}},
		default: { pixi: {
			colorize: '#0ff',
			colorizeAmount: 0,
		}}
	}

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

		const now = Date.now()
		if (mob.isParalyzed(index) && rand() > ParalyzeRate) {
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
				!mobs[index].usedHarmTouch &&
				// have any mobs used harm touch recently?
				timers.mobEffects.every(eff => (now - eff.harmTouchTimestamp) > mobHarmTouchCooldown) &&
				rand() < .1666) {
				mobDamages = [mobSkills.harmTouch(index, row)]
				timers.mobEffects[index].harmTouchTimestamp = now
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
				(now - timers.mobEffects[index].healTimestamp) > mobHealCooldown &&
				rand() < .1 &&
				injuredMobLen >= 1) {
				// must have a heal spell, be below heal count max, and find an injured mob
				if (mobs[index].job === JOB.CRUSADER) {
					mobDamages = [mobSkills.divineGrace(index, getHealTarget())]
				}
				else if (mobs[index].job === JOB.DRUID) {
					mobDamages = [mobSkills.naturesTouch(index, getHealTarget())]
				}
				else if (mobs[index].job === JOB.CLERIC) {
					mobDamages = [mobSkills.divineLight(index, getHealTarget())]
				}
				else if (mobs[index].job === JOB.SHAMAN) {
					mobDamages = [mobSkills.mysticalGlow(index, getHealTarget())]
				}
				timers.mobEffects[index].healTimestamp = now
			}
			// DoTs and DDs
			else {
				// see if a random skill is used or auto attack
				let skillData = mobSkills.getRandomSkillByJob(mobs[index].job)
				// console.info('picked', skillData.key)
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
					else if (skillData.key === 'backstab') {
						mobDamages = [mobSkills.backstab(index, row)]
					}
					else if (skillData.key === 'widowStrike') {
						mobDamages = [mobSkills.widowStrike(index, row)]
					}
					else if (skillData.key === 'trueshotStrike') {
						mobDamages = [mobSkills.trueshotStrike(index, row)]
					}
					else if (skillData.key === 'burningEmbers') {
						mobDamages = [mobSkills.burningEmbers(index, row)]
					}
					else if (skillData.key === 'shockNova') {
						mobDamages = party.presence.filter(party.isAlive)
							.map(p => mobSkills.shockNova(index, p.row))
					}
					else if (skillData.key === 'bellow') {
						mobDamages = [mobSkills.bellow(index, row)]
					}
					else if (skillData.key === 'creepingChords') {
						mobDamages = [mobSkills.creepingChords(index, row)]
					}
					else if (skillData.key === 'starfire') {
						mobDamages = [mobSkills.starfire(index, row)]
					}
					else if (skillData.key === 'lightningBlast') {
						for (var i=0; i<5; i++) {
							mobDamages.push(mobSkills.lightningBlast(index, row))
						}
					}
					else if (skillData.key === 'blizzard') {
						for (var i=0; i<5; i++) {
							mobDamages.push(mobSkills.blizzard(index, row))
						}
					}
					else if (skillData.key === 'smite') {
						mobDamages = [mobSkills.smite(index, row)]
					}
					else if (skillData.key === 'forceOfGlory') {
						mobDamages = [mobSkills.forceOfGlory(index, row)]
					}
					else if (skillData.key === 'frostRift') {
						mobDamages = [mobSkills.frostRift(index, row)]
					}
					else if (skillData.key === 'scourge') {
						mobDamages = [mobSkills.scourge(index, row)]
					}
					else if (skillData.key === 'affliction') {
						mobDamages = [mobSkills.affliction(index, row)]
					}
					else if (skillData.key === 'venomBolt') {
						mobDamages = [mobSkills.venomBolt(index, row)]
					}
					else if (skillData.key === 'bloodFire') {
						mobDamages = [mobSkills.bloodFire(index, row)]
					}
					else if (skillData.key === 'engulfingDarkness') {
						mobDamages = [mobSkills.engulfingDarkness(index, row)]
					}
					else if (skillData.key === 'panicStrike') {
						mobDamages = [mobSkills.panicStrike(index, row)]
					}
					else if (skillData.key === 'gravityFlux') {
						mobDamages = [mobSkills.gravityFlux(index, row)]
					}
					else if (skillData.key === 'mindBlitz') {
						mobDamages = [mobSkills.mindBlitz(index, row)]
					}
					else if (skillData.key === 'staticSuffocation') {
						mobDamages = [mobSkills.staticSuffocation(index, row)]
					}
					else if (skillData.key === 'subversion') {
						mobDamages = [mobSkills.subversion(index, row)]
					}
					else if (skillData.key === 'lavaBolt') {
						mobDamages = [mobSkills.lavaBolt(index, row)]
					}
					else if (skillData.key === 'staticStorm') {
						for (var i=0; i<4; i++) {
							mobDamages.push(mobSkills.staticStorm(index, row))
						}
					}
					else if (skillData.key === 'arclight') {
						mobDamages = [mobSkills.arclight(index, row)]
					}
					else if (skillData.key === 'glacialSpike') {
						mobDamages = [mobSkills.glacialSpike(index, row)]
					}
					else if (skillData.key === 'fireBolt') {
						mobDamages = [mobSkills.fireBolt(index, row)]
					}
					else if (skillData.key === 'iceBolt') {
						mobDamages = [mobSkills.iceBolt(index, row)]
					}
					else if (skillData.key === 'magicMissiles') {
						for (var i=0; i<3; i++) {
							mobDamages.push(mobSkills.magicMissiles(index, row))
						}
					}
					else if (skillData.key === 'lightningBolt') {
						mobDamages = [mobSkills.lightningBolt(index, row)]
					}
					else if (skillData.key === 'fireball') {
						mobDamages = [mobSkills.fireball(index, row)]
					}
					// check if it violates timestamp and reset mobDamages if it's too early
					if (mobDamages[0].effect === 'stun') {
						if (now - timers.mobEffects[index].stunTimestamp > mobStunCooldown) {
							timers.mobEffects[index].stunTimestamp = now
						}
						else {
							mobDamages = []
						}
					}
					else if (mobDamages[0].effect === 'fear') {
						if (now - timers.mobEffects[index].fearTimestamp > mobFearCooldown) {
							timers.mobEffects[index].fearTimestamp = now
						}
						else {
							mobDamages = []
						}
					}
					else if (mobDamages[0].effect === 'paralyze') {
						if (now - timers.mobEffects[index].paralyzeTimestamp > mobParalyzeCooldown) {
							timers.mobEffects[index].paralyzeTimestamp = now
						}
						else {
							mobDamages = []
						}
					}
					else if (mobDamages[0].effect === 'silence') {
						if (now - timers.mobEffects[index].silenceTimestamp > mobSilenceCooldown) {
							timers.mobEffects[index].silenceTimestamp = now
						}
						else {
							mobDamages = []
						}
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
					now - mobSkills.dots[indexRow] < duration) {
					// not long enough - do a single attack
					regularAttack()
				}
				else {
					mobSkills.dots[indexRow] = now
				}
			}
		}
		mobDamages.forEach((dam, i) => {
			if (dam.isHeal) {
				if (mobs[index].buffFlags.stasisField) {
					// reduces power of a heal on a mob in stasis
					dam.damage = ~~(dam.damage * buffs.stasisField.pveMitigationRatio)
				}
			}
			dam.damage = _.max([1, round(dam.damage)])
			if (!i) combat.txDamageHero(index, dam)
			else {
				if (!dam.interval) dam.interval = 1
				// delayed casts at interval value
				!function(i) {
					delayedCall(i * dam.interval, () => {
						combat.txDamageHero(index, dam)
					})
				}(i)
			}
		})
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
			effect: 'stun',
			duration: 3,
			damage: ~~_.random(ceil(mobs[i].attack * getScaledValue(i, .6)), mobs[i].attack * getScaledValue(i, 1.2)),
		}
	}
	function divineJudgment(i, row) {
		return {
			row: row,
			key: 'divineJudgment',
			damage: ~~_.random(ceil(mobs[i].int * getScaledValue(i, 1.5)), mobs[i].int * getScaledValue(i, 1.7)),
			damageType: DAMAGE_TYPE.ARCANE,
		}
	}
	function divineGrace(i, tgt) {
		return {
			isHeal: true,
			healedBy: i,
			index: tgt,
			key: 'divineGrace',
			damage: ~~_.random(ceil(mobs[i].int * getScaledValue(i, 18)), mobs[i].int * getScaledValue(i, 20)),
			damageType: DAMAGE_TYPE.ARCANE,
		}
	}
	function layHands(i, tgt) {
		return {
			isHeal: true,
			healedBy: i,
			index: tgt,
			key: 'layHands',
			damage: ~~_.random(ceil(mobs[i].int * getScaledValue(i, 70)), mobs[i].int * getScaledValue(i, 75)),
			damageType: DAMAGE_TYPE.ARCANE,
		}
	}
	function bloodTerror(i, row) {
		return {
			row: row,
			key: 'bloodTerror',
			effect: 'fear',
			ticks: 7,
			damage: mobs[i].int * getScaledValue(i, 3.3),
			damageType: DAMAGE_TYPE.BLOOD,
		}
	}
	function decayingDoom(i, row) {
		return {
			row: row,
			key: 'decayingDoom',
			ticks: 12,
			damage: mobs[i].int * getScaledValue(i, 5.8),
			damageType: DAMAGE_TYPE.ARCANE,
		}
	}
	function harmTouch(i, row) {
		return {
			row: row,
			key: 'harmTouch',
			damage: ~~_.random(ceil(mobs[i].int * getScaledValue(i, 8.6)), mobs[i].int * getScaledValue(i, 9)),
			damageType: DAMAGE_TYPE.VOID,
		}
	}
	function craneKick(i, row) {
		return {
			row: row,
			key: 'craneKick',
			damage: ~~_.random(ceil(mobs[i].attack * getScaledValue(i, 1.6)), mobs[i].attack * getScaledValue(i, 1.8)),
		}
	}
	function hadoken(i, row) {
		return {
			row: row,
			key: 'hadoken',
			damage: ~~_.random(ceil(mobs[i].int * getScaledValue(i, 1.8)), mobs[i].int * getScaledValue(i, 2)),
			damageType: DAMAGE_TYPE.ARCANE,
		}
	}
	function dragonPunch(i, row) {
		return {
			row: row,
			key: 'dragonPunch',
			damage: ~~_.random(ceil(mobs[i].attack * getScaledValue(i, 1.6)), mobs[i].attack * getScaledValue(i, 2.4)),
			damageType: DAMAGE_TYPE.FIRE,
		}
	}
	function backstab(i, row) {
		return {
			row: row,
			key: 'backstab',
			isPiercing: true,
			damage: ~~_.random(ceil(mobs[i].attack * getScaledValue(i, 1.9)), mobs[i].attack * getScaledValue(i, 2.2)),
		}
	}
	function widowStrike(i, row) {
		return {
			row: row,
			key: 'widowStrike',
			ticks: 12,
			damage: mobs[i].int * getScaledValue(i, 6.2),
			damageType: DAMAGE_TYPE.POISON,
		}
	}
	function trueshotStrike(i, row) {
		return {
			row: row,
			key: 'trueshotStrike',
			isPiercing: true,
			damage: ~~_.random(ceil(mobs[i].attack * getScaledValue(i, 1.9)), mobs[i].attack * getScaledValue(i, 2.2)),
		}
	}
	function burningEmbers(i, row) {
		return {
			row: row,
			key: 'burningEmbers',
			ticks: 9,
			damage: mobs[i].int * getScaledValue(i, 4.8),
			damageType: DAMAGE_TYPE.FIRE,
		}
	}
	function shockNova(i, row) {
		return {
			row: row,
			key: 'shockNova',
			damage: ~~_.random(ceil(mobs[i].int * getScaledValue(i, 1.1)), mobs[i].int * getScaledValue(i, 1.25)),
			damageType: DAMAGE_TYPE.LIGHTNING,
		}
	}
	function bellow(i, row) {
		return {
			row: row,
			key: 'bellow',
			damage: ~~_.random(ceil(mobs[i].int * getScaledValue(i, 1.5)), mobs[i].int * getScaledValue(i, 1.65)),
			damageType: DAMAGE_TYPE.ARCANE,
		}
	}
	function creepingChords(i, row) {
		return {
			row: row,
			key: 'creepingChords',
			effect: 'paralyze',
			ticks: 7,
			damage: mobs[i].int * getScaledValue(i, 3.1),
			damageType: DAMAGE_TYPE.LIGHTNING,
		}
	}
	function starfire(i, row) {
		return {
			row: row,
			key: 'starfire',
			damage: ~~_.random(ceil(mobs[i].int * getScaledValue(i, 2.25)), mobs[i].int * getScaledValue(i, 2.4)),
			damageType: DAMAGE_TYPE.FIRE,
		}
	}
	function lightningBlast(i, row) {
		return {
			row: row,
			key: 'lightningBlast',
			effect: 'silence',
			interval: .1,
			duration: 5,
			damage: ~~_.random(ceil(mobs[i].int * getScaledValue(i, .77)), mobs[i].int * getScaledValue(i, .82)),
			damageType: DAMAGE_TYPE.LIGHTNING,
		}
	}
	function blizzard(i, row) {
		return {
			row: row,
			key: 'blizzard',
			effect: 'chill',
			interval: .33,
			duration: 8,
			damage: ~~_.random(ceil(mobs[i].int * getScaledValue(i, .62)), mobs[i].int * getScaledValue(i, .66)),
			damageType: DAMAGE_TYPE.ICE,
		}
	}
	function naturesTouch(i, tgt) {
		return {
			isHeal: true,
			healedBy: i,
			index: tgt,
			key: 'naturesTouch',
			damage: ~~_.random(ceil(mobs[i].int * getScaledValue(i, 23)), mobs[i].int * getScaledValue(i, 25)),
			damageType: DAMAGE_TYPE.ARCANE,
		}
	}
	function smite(i, row) {
		return {
			row: row,
			key: 'smite',
			damage: ~~_.random(ceil(mobs[i].int * getScaledValue(i, 2.1)), mobs[i].int * getScaledValue(i, 2.25)),
			damageType: DAMAGE_TYPE.ARCANE,
		}
	}
	function forceOfGlory(i, row) {
		return {
			row: row,
			key: 'forceOfGlory',
			effect: 'stun',
			duration: 4,
			damage: ~~_.random(ceil(mobs[i].int * getScaledValue(i, 2.5)), mobs[i].int * getScaledValue(i, 2.6)),
			damageType: DAMAGE_TYPE.ARCANE,
		}
	}
	function divineLight(i, tgt) {
		return {
			isHeal: true,
			healedBy: i,
			index: tgt,
			key: 'divineLight',
			damage: ~~_.random(ceil(mobs[i].int * getScaledValue(i, 28)), mobs[i].int * getScaledValue(i, 30)),
			damageType: DAMAGE_TYPE.ARCANE,
		}
	}
	function frostRift(i, row) {
		return {
			row: row,
			key: 'frostRift',
			effect: 'chill',
			duration: 12,
			damage: ~~_.random(ceil(mobs[i].int * getScaledValue(i, 1.65)), mobs[i].int * getScaledValue(i, 1.8)),
			damageType: DAMAGE_TYPE.ICE,
		}
	}
	function scourge(i, row) {
		return {
			row: row,
			key: 'scourge',
			ticks: 9,
			damage: mobs[i].int * getScaledValue(i, 4.8),
			damageType: DAMAGE_TYPE.BLOOD,
		}
	}
	function affliction(i, row) {
		return {
			row: row,
			key: 'affliction',
			ticks: 12,
			damage: mobs[i].int * getScaledValue(i, 5.4),
			damageType: DAMAGE_TYPE.POISON,
		}
	}
	function mysticalGlow(i, tgt) {
		return {
			isHeal: true,
			healedBy: i,
			index: tgt,
			key: 'mysticalGlow',
			damage: ~~_.random(ceil(mobs[i].int * getScaledValue(i, 22)), mobs[i].int * getScaledValue(i, 26)),
			damageType: DAMAGE_TYPE.ARCANE,
		}
	}
	function venomBolt(i, row) {
		return {
			row: row,
			key: 'venomBolt',
			damage: ~~_.random(ceil(mobs[i].int * getScaledValue(i, 2.25)), mobs[i].int * getScaledValue(i, 2.45)),
			damageType: DAMAGE_TYPE.POISON,
		}
	}
	function engulfingDarkness(i, row) {
		return {
			row: row,
			key: 'engulfingDarkness',
			ticks: 12,
			damage: mobs[i].int * getScaledValue(i, 6.9),
			damageType: DAMAGE_TYPE.POISON,
		}
	}
	function bloodFire(i, row) {
		return {
			row: row,
			key: 'bloodFire',
			ticks: 15,
			damage: mobs[i].int * getScaledValue(i, 8.25),
			damageType: DAMAGE_TYPE.FIRE,
		}
	}
	function panicStrike(i, row) {
		return {
			row: row,
			key: 'panicStrike',
			effect: 'fear',
			duration: 15,
			damage: ~~_.random(ceil(mobs[i].int * getScaledValue(i, 2.25)), mobs[i].int * getScaledValue(i, 2.4)),
			damageType: DAMAGE_TYPE.ARCANE,
		}
	}
	function gravityFlux(i, row) {
		return {
			row: row,
			key: 'gravityFlux',
			effect: 'stun',
			duration: .5,
			damage: ~~_.random(ceil(mobs[i].int * getScaledValue(i, 2.35)), mobs[i].int * getScaledValue(i, 2.5)),
			damageType: DAMAGE_TYPE.ARCANE,
		}
	}
	function mindBlitz(i, row) {
		return {
			row: row,
			key: 'mindBlitz',
			effect: 'silence',
			duration: 7,
			damage: ~~_.random(ceil(mobs[i].int * getScaledValue(i, 2.16)), mobs[i].int * getScaledValue(i, 2.3)),
			damageType: DAMAGE_TYPE.ARCANE,
		}
	}
	function staticSuffocation(i, row) {
		return {
			row: row,
			key: 'staticSuffocation',
			ticks: 8,
			effect: 'paralyze',
			damage: mobs[i].int * getScaledValue(i, 4.8),
			damageType: DAMAGE_TYPE.LIGHTNING,
		}
	}
	function subversion(i, row) {
		return {
			row: row,
			key: 'subversion',
			ticks: 12,
			damage: mobs[i].int * getScaledValue(i, 6.3),
			damageType: DAMAGE_TYPE.POISON,
		}
	}
	function lavaBolt(i, row) {
		return {
			row: row,
			key: 'lavaBolt',
			damage: ~~_.random(ceil(mobs[i].int * getScaledValue(i, 2.33)), mobs[i].int * getScaledValue(i, 2.48)),
			damageType: DAMAGE_TYPE.FIRE,
		}
	}
	function staticStorm(i, row) {
		return {
			row: row,
			key: 'staticStorm',
			effect: 'paralyze',
			duration: 6,
			interval: .75,
			damage: mobs[i].int * getScaledValue(i, .7),
			damageType: DAMAGE_TYPE.LIGHTNING,
		}
	}
	function arclight(i, row) {
		return {
			row: row,
			key: 'arclight',
			ticks: 6,
			effect: 'paralyze',
			damage: mobs[i].int * getScaledValue(i, 4.2),
			damageType: DAMAGE_TYPE.LIGHTNING,
		}
	}
	function glacialSpike(i, row) {
		return {
			row: row,
			key: 'glacialSpike',
			effect: 'chill',
			duration: 10,
			damage: ~~_.random(ceil(mobs[i].int * getScaledValue(i, 2.25)), mobs[i].int * getScaledValue(i, 2.38)),
			damageType: DAMAGE_TYPE.ICE,
		}
	}
	function fireBolt(i, row) {
		return {
			row: row,
			key: 'fireBolt',
			damage: ~~_.random(ceil(mobs[i].int * getScaledValue(i, 2.36)), mobs[i].int * getScaledValue(i, 2.52)),
			damageType: DAMAGE_TYPE.FIRE,
		}
	}
	function iceBolt(i, row) {
		return {
			row: row,
			key: 'iceBolt',
			effect: 'chill',
			duration: 6,
			damage: ~~_.random(ceil(mobs[i].int * getScaledValue(i, 2.1)), mobs[i].int * getScaledValue(i, 2.24)),
			damageType: DAMAGE_TYPE.ICE,
		}
	}
	function magicMissiles(i, row) {
		return {
			row: row,
			key: 'magicMissiles',
			effect: 'silence',
			interval: 1,
			duration: 4,
			damage: ~~_.random(ceil(mobs[i].int * getScaledValue(i, .66)), mobs[i].int * getScaledValue(i, .72)),
			damageType: DAMAGE_TYPE.ARCANE,
		}
	}
	function lightningBolt(i, row) {
		return {
			row: row,
			key: 'lightningBolt',
			effect: 'paralyze',
			duration: 9,
			damage: ~~_.random(ceil(mobs[i].int * getScaledValue(i, 2.4)), mobs[i].int * getScaledValue(i, 2.6)),
			damageType: DAMAGE_TYPE.LIGHTNING,
		}
	}
	function fireball(i, row) {
		return {
			row: row,
			key: 'fireball',
			damage: ~~_.random(ceil(mobs[i].int * getScaledValue(i, 2.8)), mobs[i].int * getScaledValue(i, 3)),
			damageType: DAMAGE_TYPE.FIRE,
		}
	}

	/**
	 * only uses half value at level 1
	 * uses full value at level 50
	 * 150% value at level 99
	 * @param index
	 * @param value
	 * @returns {number}
	 */
	function getScaledValue(index, value) {
		value = value * .5
		return ~~(((mobs[index].level / 50) * value) + value)
	}

	// @ 1 3 + (10 * 1.66) = 4
	// @ 5 3 + (10 * 1.66) = 11.3
	// @ 10 3 + (10 * 1.66) = 19.6
	const maxMobLevelDamageNerf = 10
	const maxDamageByLevel = []
	const minDamValues = [
		1,2,3,4,6,8, // 5
		10,12,14,16,18 // 10
	]
	for (var i=0; i<=maxMobLevelDamageNerf; i++) {
		maxDamageByLevel.push(minDamValues[i])
	}
	// console.info('maxDamageByLevel', maxDamageByLevel.length, maxDamageByLevel)
	function autoAttack(i, row, isPiercing) {
		mobDamage = {
			row: row,
			damage: ~~_.random(ceil(mobs[i].attack * .2), mobs[i].attack),
		}
		if (mobs[i].level <= 10) {
			// nerf mob damage <= 10
			mobDamage.damage = maxDamageByLevel[mobs[i].level]
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

	function getMobasdfasdf() {

	}
	/* mob health by level test code
	var a = [];
	for (var i=1; i<=99; i++) {
		var x = ~~(50 + (i - 1) * (20 + ((i / 40) * 80)))
		a.push(x)
		var diff = 0
		if (typeof a[i - 2] === 'number') {
			diff = a[i - 1] - a[i - 2]
		}
		console.info(i, x, diff)
	}
	 */
	function modifyMobStatsByClass(config) {
		//if (typeof config.job === 'undefined') config.job = JOB.WARRIOR
		// base resources
		const baseHpValue = 40
		const addedHpByLevel = (config.level - 1) * (25 + ((config.level / 33) * 75))
		const totalMobByLevelJob = (baseHpValue + addedHpByLevel) * config.hp
		const partyMultiplier = (1 + ((party.presence.length - 1) * .8))
		config.hp = ~~(totalMobByLevelJob * partyMultiplier)
		// console.info('mob health: ', config.hp, config)
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
	}

	function modifyMobStatsByTierAndTraits(config) {
		// multiplies the base amounts set by mob type
		let multi = getTierBase(config)
		multi = modifyByTraits(multi, config)

		// calculate new config values
		for (var key in multi) {
			config[key] = config[key] * multi[key]
		}
	}
	function getTierBase(config) {
		if (config.tier === MOB_TIERS.champion) {
			return {
				hp: 3,
				attack: 1.25,
				gold: 1.5,
				expPerLevel: 2,
				int: 1.5,
				size: 1.1,
			}
		}
		else if (config.tier === MOB_TIERS.unique) {
			return {
				hp: 4,
				attack: 1.25,
				gold: 3,
				expPerLevel: 2,
				int: 1.5,
				size: 1,
			}
		}
		else if (config.tier === MOB_TIERS.boss) {
			return {
				hp: 20,
				attack: 3,
				gold: 5,
				expPerLevel: 3,
				int: 3,
				size: 1,
			}
		}
		else {
			return {
				hp: 1,
				attack: 1,
				gold: 1,
				expPerLevel: 1,
				int: 1,
				size: 1,
			}
		}
	}
	function modifyByTraits(multi, config) {
		// console.info('modifyByTraits', _.cloneDeep(config))
		if (config.traits.brute) {
			multi.attack = 2.5
		}
		if (config.traits.frenzied) {
			config.speed *= .7
		}
		if (config.traits.tough) {
			if (config.tier === MOB_TIERS.champion) multi.hp = 6
			else if (config.tier === MOB_TIERS.unique) multi.hp = 8
			else if (config.tier === MOB_TIERS.boss) multi.hp = 20
			else multi.hp = 4 // ????
		}
		if (config.traits.bloodlusted) {
			config.resist.blood -= .5
		}
		if (config.traits.magister) {
			if (config.tier === MOB_TIERS.champion) multi.int = 3
			else if (config.tier === MOB_TIERS.unique) multi.int = 3
			else if (config.tier === MOB_TIERS.boss) multi.int = 6
			else multi.int = 3
			config.resist.poison -= .33
			config.resist.blood -= .33
			config.resist.arcane -= .33
			config.resist.lightning -= .33
			config.resist.fire -= .33
			config.resist.ice -= .33
		}
		if (config.traits.poisonEnchanted) {
			// damage bonus in code
			config.resist.poison -= .75
		}
		if (config.traits.lightningEnchanted) {
			// damage bonus in code
			config.resist.lightning -= .75
		}
		if (config.traits.fireEnchanted) {
			// damage bonus in code
			config.resist.fire -= .75
		}
		if (config.traits.iceEnchanted) {
			// damage bonus in code
			config.resist.ice -= .75
		}

		// impose limits on resist values
		if (config.tier === MOB_TIERS.champion) {
			for (var key in config.resist) {
				if (config.resist < .25) config.resist = .25
			}
		}
		/*console.info('modifyByTraits multi', _.cloneDeep(multi))
		console.info('modifyByTraits config', _.cloneDeep(config))*/
		return multi
	}
	// EFFECTS MOBS TO PLAYERS

	// tx status
	function stunPlayerTx(duration) {
		if (my.stunCheck()) {
			let damages = []
			damages.push({
				index: my.row,
				key: 'stun',
				effect: 'stun',
				duration: duration,
			})
			combat.txBuffHero(damages)
		}
	}
	function fearPlayerTx(duration) {
		if (my.fearCheck()) {
			let damages = []
			damages.push({
				index: my.row,
				key: 'fear',
				effect: 'fear',
				duration: duration,
			})
			combat.txBuffHero(damages)
		}
	}
	function paralyzePlayerTx(duration) {
		if (my.paralyzeCheck()) {
			let damages = []
			damages.push({
				index: my.row,
				key: 'paralyze',
				effect: 'paralyze',
				duration: duration,
			})
			combat.txBuffHero(damages)
		}
	}
	function silencePlayerTx(duration) {
		if (my.silenceCheck()) {
			let damages = []
			damages.push({
				index: my.row,
				key: 'silence',
				effect: 'silence',
				duration: duration,
			})
			combat.txBuffHero(damages)
		}
	}
	function chillPlayerTx(duration) {
		if (my.chillCheck()) {
			let damages = []
			damages.push({
				index: my.row,
				key: 'chill',
				effect: 'chill',
				duration: duration,
			})
			combat.txBuffHero(damages)
		}
	}
	function freezePlayerTx(duration) {
		if (my.freezeCheck()) {
			let damages = []
			damages.push({
				index: my.row,
				key: 'freeze',
				effect: 'freeze',
				duration: duration,
			})
			combat.txBuffHero(damages)
		}
	}


	// rx status
	function txPlayerEffect(data) {
		socket.publish('party' + my.partyId, {
			route: 'p->effect',
			row: data.row,
			duration: data.duration,
			key: data.key,
		})
	}
	function rxPlayerEffect(data) {
		if (data.key === 'stun') animateStun(data)
		else if (data.key === 'fear') animateFear(data)
		else if (data.key === 'paralyze') animateParalyze(data)
		else if (data.key === 'silence') animateSilence(data)
		else if (data.key === 'chill') animateChill(data)
		else if (data.key === 'thaw') animateThaw(data)
		else if (data.key === 'freeze') animateFreeze(data)
		else if (data.key === 'freezeThaw') animateFreezeThaw(data)
	}
	// animate status effects
	function animateStun(data) {
		ask.mobStun({
			index: party.presence[party.getIndexByRow(data.row)].row,
			key: 'particle-small-default',
			duration: data.duration
		}, false)
	}
	function animateFear(data) {
		ask.mobFear({
			index: party.presence[party.getIndexByRow(data.row)].row,
			key: 'hauntingVision',
			duration: data.duration
		}, false)
	}
	function animateParalyze(data) {
		ask.mobParalyze({
			index: party.presence[party.getIndexByRow(data.row)].row,
			key: 'palmStrikeHand',
			duration: data.duration
		}, false)
	}
	function animateSilence(data) {
		ask.mobSilence({
			index: party.presence[party.getIndexByRow(data.row)].row,
			key: 'mendingAura',
			duration: data.duration
		}, false)
	}
	function animateChill(data) {
		row = party.getIndexByRow(data.row)
		party.presence[row].isChilled = true
		if (!my.isFrozen()) {
			// TweenMax.to(players[row].sprite, .5, filter.chill)
		}
	}
	function animateThaw(data) {
		row = party.getIndexByRow(data.row)
		party.presence[row].isChilled = false
		if (!party.isChilled(data.row) && !party.isFrozen(data.row)) {
			// TweenMax.to(players[row].sprite, .5, filter.default)
		}
	}
	function animateFreeze(data) {
		row = party.getIndexByRow(data.row)
		party.presence[row].isFrozen = true
		// TweenMax.set(players[row].sprite, filter.freeze)
	}
	function animateFreezeThaw(data) {
		row = party.getIndexByRow(data.row)
		party.presence[row].isFrozen = false
		/*TweenMax.to(players[row].sprite, .5,
			party.isChilled(data.row) ?
				filter.chill : filter.default
		)*/
	}
	function applyEffectFilter(row) {
		row = party.getIndexByRow(row)
		if (party.presence[row].isFrozen) {
			// TweenMax.set(players[row].sprite, filter.freeze)
		}
		else if (party.presence[row].isChilled) {
			// TweenMax.set(players[row].sprite, filter.chill)
		}
		else {
			// TweenMax.set(players[row].sprite, filter.default)
		}
	}


	function stunPlayerEffectRx(buff) {
		spell.cancelSpell()
		button.pauseAutoAttack()
		my.stunTimer = TweenMax.to(timers, buff.duration, {
			startAt: { stunTimer: 0 },
			stunTimer: 1,
			ease: Power0.easeIn,
			onComplete: button.resumeAutoAttack,
		})
		mobSkills.txPlayerEffect({
			row: my.row,
			duration: buff.duration,
			key: buff.effect,
		})
	}
	function fearPlayerEffectRx(buff) {
		if (!my.fearTimeValid(buff.duration)) return
		my.fearTimer = TweenMax.to(timers, buff.duration, {
			startAt: { fearTimer: 0 },
			fearTimer: 1,
			ease: Power0.easeIn,
		})
		mobSkills.txPlayerEffect({
			row: my.row,
			duration: buff.duration,
			key: buff.effect,
		})
	}
	function paralyzePlayerEffectRx(buff) {
		if (!my.paralyzeTimeValid(buff.duration)) return
		my.paralyzeTimer = TweenMax.to(timers, buff.duration, {
			startAt: { paralyzeTimer: 0 },
			paralyzeTimer: 1,
			ease: Power0.easeIn,
		})
		mobSkills.txPlayerEffect({
			row: my.row,
			duration: buff.duration,
			key: buff.effect,
		})
	}
	function silencePlayerEffectRx(buff) {
		my.silenceTimer = TweenMax.to(timers, buff.duration, {
			startAt: { silenceTimer: 0 },
			silenceTimer: 1,
			ease: Power0.easeIn,
		})
		mobSkills.txPlayerEffect({
			row: my.row,
			duration: buff.duration,
			key: buff.effect,
		})
	}
	function chillPlayerEffectRx(buff) {
		if (!my.chillTimeValid(buff.duration)) return
		my.chillTimer = TweenMax.to(timers, buff.duration, {
			startAt: { chillTimer: 0 },
			chillTimer: 1,
			ease: Power0.easeIn,
			onComplete: chillPlayerComplete,
			onCompleteParams: [buff],
		})
		mobSkills.txPlayerEffect({
			row: my.row,
			duration: buff.duration,
			key: buff.effect,
		})
	}
	function chillPlayerComplete(buff) {
		mobSkills.txPlayerEffect({
			row: my.row,
			duration: buff.duration,
			key: 'thaw',
		})
	}
	function freezePlayerEffectRx(buff) {
		if (!my.freezeTimeValid(buff.duration)) return
		my.freezeTimer = TweenMax.to(timers, buff.duration, {
			startAt: { freezeTimer: 0 },
			freezeTimer: 1,
			ease: Power0.easeIn,
			onComplete: freezePlayerComplete,
			onCompleteParams: [buff],
		})
		mobSkills.txPlayerEffect({
			row: my.row,
			duration: buff.duration,
			key: buff.effect,
		})
	}
	function freezePlayerComplete(buff) {
		mobSkills.txPlayerEffect({
			row: my.row,
			duration: buff.duration,
			key: 'freezeThaw',
		})
	}

	function initFilter() {
		party.presence.forEach((p, i) => {
			// filters only work on self for now
			if (my.row === p.row) {
				/*if (my.isFrozen()) TweenMax.to(players[i].sprite, .5, filter.freeze)
				else if (my.isChilled()) TweenMax.to(players[i].sprite, .5, filter.chill)
				else TweenMax.to(players[i].sprite, .5, filter.default)*/
			}
		})
	}
}($, _, TweenMax, Linear, Math, Array, Power0, Date);