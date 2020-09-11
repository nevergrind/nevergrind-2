var stats = {};
(function($, TweenMax, _, undefined) {
	stats = {
		memo: {},
		enhancedDamageToHumanoids,
		enhancedDamageToBeasts,
		enhancedDamageToUndead,
		enhancedDamageToDemons,
		enhancedDamageToDragonkin,
		enhancedDamageToMystical,
		enhancedDamageToGiants,
		addBlood,
		addPoison,
		addArcane,
		addLightning,
		addFire,
		addIce,
		str,
		sta,
		agi,
		dex,
		wis,
		intel,
		cha,
		armor,
		attack,
		offense,
		defense,
		oneHandSlash,
		oneHandBlunt,
		piercing,
		twoHandSlash,
		twoHandBlunt,
		handToHand,
		archery,
		dualWield,
		doubleAttack,
		dodge,
		parry,
		riposte,
		spellDamage,
		autoAttackDamage,
		damage,
		offhandDamage,
		rangedDamage,
		getResistPercent,
		resistBlood,
		resistPoison,
		resistArcane,
		resistLightning,
		resistFire,
		resistIce,
		resistPhysical,
		getPropMax,
		setAllResources,
		critChance,
		hpMax,
		mpMax,
		spMax,
		hpRegen,
		mpRegen,
		spRegen,
		armorReductionRatio,
		getEqTotal,
		getStatTotal,
		dodgeChance,
		parryChance,
		riposteChance,
		missChance,
		ignoreTargetArmor,
		reduceTargetArmor,
		phyMit,
		magMit,
		leech,
		wraith,
		damageTakenToMana,
		damageTakenToSpirit,
		hpKill,
		mpKill,
		spKill,
		resistParalyze,
		resistFear,
		resistStun,
		resistSilence,
		getAttackSpeed,
		getSkillSpeed,
		getCastingSpeed,
	}
	// jobs grouped by things for include checks
	const offensiveJobs = [JOB.SHADOW_KNIGHT, JOB.MONK, JOB.ROGUE, JOB.RANGER]
	const defensiveJobs = [JOB.WARRIOR, JOB.CRUSADER, JOB.SHADOW_KNIGHT]
	const averagePunchJobs = [JOB.WARRIOR, JOB.CRUSADER, JOB.SHADOW_KNIGHT, JOB.ROGUE, JOB.RANGER, JOB.BARD]
	const wisCasterJobs = [JOB.DRUID, JOB.CLERIC, JOB.SHAMAN]
	const intCasterJobs = [JOB.WARLOCK, JOB.ENCHANTER, JOB.TEMPLAR, JOB.WIZARD]
	const allCasterJobs = [JOB.CLERIC, JOB.DRUID, JOB.SHAMAN, JOB.BARD, JOB.WARLOCK, JOB.ENCHANTER, JOB.TEMPLAR, JOB.WIZARD]
	const hybridJobs = [JOB.CRUSADER, JOB.SHADOW_KNIGHT, JOB.RANGER]
	const twoHandBluntAverageJobs = [JOB.WARRIOR, JOB.CRUSADER, JOB.SHADOW_KNIGHT, JOB.CLERIC, JOB.DRUID, JOB.SHAMAN, JOB.WARLOCK, JOB.ENCHANTER, JOB.TEMPLAR, JOB.WIZARD]
	const tankJobs = [JOB.WARRIOR, JOB.CRUSADER, JOB.SHADOW_KNIGHT]
	const averageArcherJobs = [JOB.WARRIOR, JOB.CRUSADER, JOB.SHADOW_KNIGHT, JOB.ROGUE, JOB.BARD]
	const averagePiercingJobs = [JOB.WARRIOR, JOB.BARD, JOB.SHAMAN, JOB.WARLOCK, JOB.ENCHANTER, JOB.TEMPLAR, JOB.WIZARD]
	const averageOneHandSlashJobs = [JOB.WARRIOR, JOB.CRUSADER, JOB.SHADOW_KNIGHT, JOB.BARD, JOB.DRUID]
	let isCrit = false
	let chance, weaponSkill, enhanceDamage, addedDamage
	let resistPercent
	let value = 0
	let speed = 0
	let speedHaste = 1
	let skillHaste = 1
	let castHaste = 1
	let val, base, i, len, type, min, max, totalAttack, h2h, atk, stat, dps

	const failedWeaponDamage = {
		min: 0,
		max: 0,
		damage: 0,
		damageType: DAMAGE_TYPE.PHYSICAL,
		isCrit: false
	}
	const failedRangeDamage = {
		min: 0,
		max: 0,
		damage: 0,
		weaponSkill: 'Archery',
		damageType: DAMAGE_TYPE.PHYSICAL,
		isCrit: false
	}
	const hpTier = {
		WAR: 10,
		CRU: 9,
		SHD: 9,
		MNK: 7,
		ROG: 7,
		RNG: 7,
		BRD: 7,
		DRU: 7,
		CLR: 7,
		SHM: 7,
		WLK: 6,
		ENC: 6,
		TMP: 6,
		WIZ: 6,
	}
	const mpTier = {
		WAR: 2,
		CRU: 3,
		SHD: 3,
		MNK: 2,
		ROG: 2,
		RNG: 3,
		BRD: 3,
		DRU: 4,
		CLR: 4,
		SHM: 4,
		WLK: 5,
		ENC: 5,
		TMP: 5,
		WIZ: 5,
	}
	const spTier = {
		WAR: 2,
		CRU: 3,
		SHD: 3,
		MNK: 2,
		ROG: 2,
		RNG: 3,
		BRD: 4,
		DRU: 5,
		CLR: 5,
		SHM: 5,
		WLK: 3,
		ENC: 5,
		TMP: 3,
		WIZ: 3,
	}

	function str(fresh) {
		if (fresh || typeof stats.memo.str === Undefined) {
			stats.memo.str = my.str + create.raceAttrs[my.race][0] + create.jobAttrs[my.jobLong][0] + getEqTotal(PROP.STR) + getEqTotal(PROP.ALL_STATS)
			if (my.buffFlags.borealTalisman) {
				stats.memo.str += buffs.borealTalisman.str[my.buffs.borealTalisman.level]
			}
			if (my.buffFlags.battleHymn) {
				stats.memo.str += buffs.battleHymn.str[my.buffs.battleHymn.level]
			}
		}
		return stats.memo.str
	}
	function sta(fresh) {
		if (fresh || typeof stats.memo.sta === Undefined) {
			stats.memo.sta = my.sta + create.raceAttrs[my.race][1] + create.jobAttrs[my.jobLong][1] + getEqTotal(PROP.STA) + getEqTotal(PROP.ALL_STATS)
			if (my.buffFlags.borealTalisman) {
				stats.memo.sta += buffs.borealTalisman.sta[my.buffs.borealTalisman.level]
			}
		}
		return stats.memo.sta
	}
	function agi(fresh) {
		if (fresh || typeof stats.memo.agi === Undefined) {
			stats.memo.agi = my.agi + create.raceAttrs[my.race][2] + create.jobAttrs[my.jobLong][2] + getEqTotal(PROP.AGI) + getEqTotal(PROP.ALL_STATS)
			if (my.buffFlags.augmentation) {
				stats.memo.agi += buffs.augmentation.agi[my.buffs.augmentation.level]
			}

			if (fresh) {
				dodgeChance(true)
				armor(true)
			}
		}
		return stats.memo.agi
	}
	function dex(fresh) {
		if (fresh || typeof stats.memo.dex === Undefined) {
			stats.memo.dex = my.dex + create.raceAttrs[my.race][3] + create.jobAttrs[my.jobLong][3] + getEqTotal(PROP.DEX) + getEqTotal(PROP.ALL_STATS)
			if (my.buffFlags.augmentation) {
				stats.memo.dex += buffs.augmentation.dex[my.buffs.augmentation.level]
			}
			if (my.buffFlags.battleHymn) {
				stats.memo.dex += buffs.battleHymn.dex[my.buffs.battleHymn.level]
			}

			if (fresh) {
				parryChance(true)
				riposteChance(true)
				critChance(true)
			}
		}
		return stats.memo.dex
	}
	function wis(fresh) {
		if (fresh || typeof stats.memo.wis === Undefined) {
			stats.memo.wis = my.wis + create.raceAttrs[my.race][4] + create.jobAttrs[my.jobLong][4] + getEqTotal(PROP.WIS) + getEqTotal(PROP.ALL_STATS)
		}
		return stats.memo.wis
	}
	function intel(fresh) {
		if (fresh || typeof stats.memo.intel === Undefined) {
			stats.memo.intel = my.intel + create.raceAttrs[my.race][5] + create.jobAttrs[my.jobLong][5] + getEqTotal(PROP.INTEL) + getEqTotal(PROP.ALL_STATS)
			if (my.buffFlags.clarity) {
				stats.memo.intel += buffs.clarity.intel[my.buffs.clarity.level]
			}
			mpMax(true)
		}
		return stats.memo.intel
	}
	function cha(fresh) {
		if (fresh || typeof stats.memo.cha === Undefined) {
			stats.memo.cha = my.cha + create.raceAttrs[my.race][6] + create.jobAttrs[my.jobLong][6] + getEqTotal(PROP.CHA) + getEqTotal(PROP.ALL_STATS)
			if (my.buffFlags.vampiricAllure) {
				stats.memo.cha += buffs.vampiricAllure.cha[my.buffs.vampiricAllure.level]
			}
			if (my.buffFlags.conviction) {
				stats.memo.cha += buffs.conviction.cha[my.buffs.conviction.level]
			}
			spMax(true)
		}
		return stats.memo.cha
	}
	function armor(fresh) {
		if (fresh || typeof stats.memo.armor === Undefined) {
			stats.memo.armor = ((agi() * .66) +(defense() * 3.3)) + getEqTotal('armor')
			if (my.buffFlags.zealousResolve) {
				stats.memo.armor += (my.buffs.zealousResolve.damage * buffs.zealousResolve.armorRatio)
			}
			if (my.buffFlags.intrepidShout) {
				stats.memo.armor += buffs.intrepidShout.armor[my.buffs.intrepidShout.level]
			}
			if (my.buffFlags.branchSpirit) {
				stats.memo.armor += (my.buffs.branchSpirit.damage * buffs.branchSpirit.armorRatio)
			}
			if (my.buffFlags.lichForm) {
				stats.memo.armor += buffs.lichForm.armor[my.buffs.lichForm.level]
			}
			if (my.buffFlags.chromaticSonata) {
				stats.memo.armor += buffs.chromaticSonata.armor[my.buffs.chromaticSonata.level]
			}
			stats.memo.armor = round(stats.memo.armor)
		}
		return stats.memo.armor
	}
	function armorReductionRatio() {
		// max of 75% reduction
		return (stats.armor() > 3000 ? 3000 : stats.armor()) / 4000
	}

	function attack(type, fresh) {
		type = type || items.eq[12].weaponSkill
		if (fresh || typeof stats.memo.attack === Undefined) {
			stats.memo.attack = getEqTotal(PROP.ATTACK) + (str() * .35)
			// console.info('stats.missChance', type, ~~stats.memo.attack)
			// buffs
			if (my.buffFlags.spiritOfTheHunter) {
				stats.memo.attack += buffs.spiritOfTheHunter.attackBonus[my.buffs.spiritOfTheHunter.level]
			}
			if (my.buffFlags.branchSpirit) {
				stats.memo.attack += (my.buffs.branchSpirit.damage * buffs.branchSpirit.attackRatio)
			}
		}

		totalAttack = stats.memo.attack
		totalAttack += (offense() * 1.66)
		// by weapon type
		if (type === LABEL.ONE_HAND_SLASH) totalAttack += (oneHandSlash() * 2.66)
		else if (type === 'One-hand Blunt') totalAttack += (oneHandBlunt() * 2.66)
		else if (type === 'Piercing') totalAttack += (piercing() * 2.66)
		else if (type === 'Two-hand Slash') totalAttack += (twoHandSlash() * 2.66)
		else if (type === 'Two-hand Blunt') totalAttack += (twoHandBlunt() * 2.66)
		else if (type === 'Archery') totalAttack += (archery() * 2.66)
		else if (type === 'Hand-to-Hand') totalAttack += (handToHand() * 2.66)

		totalAttack = ~~totalAttack

		return totalAttack
		//else atk += (handToHand() * (my.job === JOB.MONK ? 2.66 : .33))
	}
	function offense(fresh) {
		if (fresh || typeof stats.memo.offense === Undefined) {
			stats.memo.offense = getStatTotal(PROP.OFFENSE) + getEqTotal(PROP.ALL_SKILLS)
		}
		return stats.memo.offense
	}
	function defense(fresh) {
		if (fresh || typeof stats.memo.defense === Undefined) {
			stats.memo.defense = getStatTotal(PROP.DEFENSE) + getEqTotal(PROP.ALL_SKILLS)
		}
		return stats.memo.defense
	}
	function oneHandSlash(fresh) {
		if (fresh || typeof stats.memo.oneHandSlash === Undefined) {
			stats.memo.oneHandSlash = getStatTotal(PROP.ONE_HAND_SLASH) + getEqTotal(PROP.ALL_SKILLS)
		}
		return stats.memo.oneHandSlash
	}
	function oneHandBlunt(fresh) {
		if (fresh || typeof stats.memo.oneHandBlunt === Undefined) {
			stats.memo.oneHandBlunt = getStatTotal(PROP.ONE_HAND_BLUNT) + getEqTotal(PROP.ALL_SKILLS)
		}
		return stats.memo.oneHandBlunt
	}
	function piercing(fresh) {
		if (fresh || typeof stats.memo.piercing === Undefined) {
			stats.memo.piercing = getStatTotal(PROP.PIERCING) + getEqTotal(PROP.ALL_SKILLS)
		}
		return stats.memo.piercing
	}
	function twoHandSlash(fresh) {
		if (fresh || typeof stats.memo.twoHandSlash === Undefined) {
			stats.memo.twoHandSlash = getStatTotal(PROP.TWO_HAND_SLASH) + getEqTotal(PROP.ALL_SKILLS)
		}
		return stats.memo.twoHandSlash
	}
	function twoHandBlunt(fresh) {
		if (fresh || typeof stats.memo.twoHandBlunt === Undefined) {
			stats.memo.twoHandBlunt = getStatTotal(PROP.TWO_HAND_BLUNT) + getEqTotal(PROP.ALL_SKILLS)
		}
		return stats.memo.twoHandBlunt
	}
	function handToHand(fresh) {
		if (fresh || typeof stats.memo.handToHand === Undefined) {
			stats.memo.handToHand = getStatTotal(PROP.HAND_TO_HAND) + getEqTotal(PROP.ALL_SKILLS)
		}
		return stats.memo.handToHand
	}
	function archery(fresh) {
		if (fresh || typeof stats.memo.archery === Undefined) {
			stats.memo.archery = getStatTotal(PROP.ARCHERY) + getEqTotal(PROP.ALL_SKILLS)
		}
		return stats.memo.archery
	}
	function dualWield(fresh) {
		if (fresh || typeof stats.memo.dualWield === Undefined) {
			stats.memo.dualWield = getStatTotal(PROP.DUAL_WIELD) + getEqTotal(PROP.ALL_SKILLS)
		}
		return stats.memo.dualWield
	}
	function doubleAttack(fresh) {
		if (fresh || typeof stats.memo.doubleAttack === Undefined) {
			stats.memo.doubleAttack = getStatTotal(PROP.DOUBLE_ATTACK) + getEqTotal(PROP.ALL_SKILLS)
		}
		return stats.memo.doubleAttack
	}
	function missChance(index, weaponSkill, hitBonus = 0) {
		chance = .2
		// 24 is about how much attack you get per level (21.6?)
		chance += ((mobs[index].level * 24) - stats.attack(weaponSkill)) / 2400
		if (my.level < mobs[index].level) {
			chance += ((mobs[index].level - my.level) / 40)
		}
		// console.info('stats.missChance before',  chance, hitBonus)
		if (hitBonus !== 0) chance -= (hitBonus / 100)
		if (mobs[index].buffFlags.faerieFlame) chance -= .12
		// console.info('stats.missChance after', chance)
		// limit check
		if (chance > .5) chance = .5
		else if (chance < .05) chance = .05
		return chance

	}
	function dodge(fresh) {
		if (fresh || typeof stats.memo.dodge === Undefined) {
			stats.memo.dodge = getStatTotal(PROP.DODGE) + getEqTotal(PROP.ALL_SKILLS)
		}
		return stats.memo.dodge
	}
	function parry(fresh) {
		if (fresh || typeof stats.memo.parry === Undefined) {
			stats.memo.parry = getStatTotal(PROP.PARRY) + getEqTotal(PROP.ALL_SKILLS)
		}
		return stats.memo.parry
	}
	function riposte(fresh) {
		if (fresh || typeof stats.memo.riposte === Undefined) {
			stats.memo.riposte = getStatTotal(PROP.RIPOSTE) + getEqTotal(PROP.ALL_SKILLS)
		}
		return stats.memo.riposte
	}
	function dodgeChance(fresh) {
		if (fresh || typeof stats.memo.dodgeChance === Undefined) {
			stats.memo.dodgeChance = dodge() / 2500 + (agi() / 2000)
		}
		return stats.memo.dodgeChance
	}
	function parryChance(fresh) {
		if (fresh || typeof stats.memo.parryChance === Undefined) {
			stats.memo.parryChance = parry() / 2500 + (dex() / 2000)
		}
		return stats.memo.parryChance
	}
	function riposteChance(fresh) {
		if (fresh || typeof stats.memo.riposteChance === Undefined) {
			stats.memo.riposteChance = riposte() / 2500 + (dex() / 2000)
		}
		return stats.memo.riposteChance
	}
	function critChance(fresh) {
		if (fresh || typeof stats.memo.crit === Undefined) {
			stats.memo.crit = ( (dex() / 75) + ng.dimRetCrit(getEqTotal(PROP.CRIT)) ) / 100
		}
		return stats.memo.crit
	}
	function addBlood(fresh) {
		if (fresh || typeof stats.memo.addBlood === Undefined) {
			stats.memo.addBlood = getEqTotal(PROP.ADD_BLOOD)
		}
		return stats.memo.addBlood
	}
	function addPoison(fresh) {
		if (fresh || typeof stats.memo.addPoison === Undefined) {
			stats.memo.addPoison = getEqTotal(PROP.ADD_POISON)
			if (my.buffFlags.profaneSpirit) {
				stats.memo.addPoison += buffs.profaneSpirit.addPoison[my.buffs.profaneSpirit.level]
			}
		}
		return stats.memo.addPoison
	}
	function addArcane(fresh) {
		if (fresh || typeof stats.memo.addArcane === Undefined) {
			stats.memo.addArcane = getEqTotal(PROP.ADD_ARCANE)
		}
		return stats.memo.addArcane
	}
	function addLightning(fresh) {
		if (fresh || typeof stats.memo.addLightning === Undefined) {
			stats.memo.addLightning = getEqTotal(PROP.ADD_LIGHTNING)
			if (my.buffFlags.phaseBlade) {
				stats.memo.addLightning += buffs.phaseBlade.addLightning[my.buffs.phaseBlade.level]
			}
		}
		return stats.memo.addLightning
	}
	function addFire(fresh) {
		if (fresh || typeof stats.memo.addFire === Undefined) {
			stats.memo.addFire = getEqTotal(PROP.ADD_FIRE)
			if (my.buffFlags.moltenAegis) {
				stats.memo.addFire += buffs.moltenAegis.addFire[my.buffs.moltenAegis.level]
			}
		}
		return stats.memo.addFire
	}
	function addIce(fresh) {
		if (fresh || typeof stats.memo.addIce === Undefined) {
			stats.memo.addIce = getEqTotal(PROP.ADD_ICE)
		}
		return stats.memo.addIce
	}
	function addSpellBlood(fresh) {
		if (fresh || typeof stats.memo.addSpellBlood === Undefined) {
			stats.memo.addSpellBlood = getEqTotal(PROP.ADD_SPELL_BLOOD)
		}
		return stats.memo.addSpellBlood
	}
	function addSpellPoison(fresh) {
		if (fresh || typeof stats.memo.addSpellPoison === Undefined) {
			stats.memo.addSpellPoison = getEqTotal(PROP.ADD_SPELL_POISON)
		}
		return stats.memo.addSpellPoison
	}
	function addSpellArcane(fresh) {
		if (fresh || typeof stats.memo.addSpellArcane === Undefined) {
			stats.memo.addSpellArcane = getEqTotal(PROP.ADD_SPELL_ARCANE)
		}
		return stats.memo.addSpellArcane
	}
	function addSpellLightning(fresh) {
		if (fresh || typeof stats.memo.addSpellLightning === Undefined) {
			stats.memo.addSpellLightning = getEqTotal(PROP.ADD_SPELL_LIGHTNING)
		}
		return stats.memo.addSpellLightning
	}
	function addSpellFire(fresh) {
		if (fresh || typeof stats.memo.addSpellFire === Undefined) {
			stats.memo.addSpellFire = getEqTotal(PROP.ADD_SPELL_FIRE)
		}
		return stats.memo.addSpellFire
	}
	function addSpellIce(fresh) {
		if (fresh || typeof stats.memo.addSpellIce === Undefined) {
			stats.memo.addSpellIce = getEqTotal(PROP.ADD_SPELL_ICE)
		}
		return stats.memo.addSpellIce
	}
	function addSpellAll(fresh) {
		if (fresh || typeof stats.memo.addSpellAll === Undefined) {
			stats.memo.addSpellAll = getEqTotal(PROP.ADD_SPELL_ALL)
			if (my.buffFlags.celestialFrenzy) {
				stats.memo.addSpellAll += buffs.celestialFrenzy.addSpellAll[my.buffs.celestialFrenzy.level]
			}
		}
		return stats.memo.addSpellAll
	}
	function enhanceBlood(fresh) {
		if (fresh || typeof stats.memo.addSpellIce === Undefined) {
			stats.memo.enhanceBlood = getEqTotal(PROP.ENHANCE_BLOOD)
		}
		return stats.memo.enhanceBlood
	}
	function enhancePoison(fresh) {
		if (fresh || typeof stats.memo.addSpellIce === Undefined) {
			stats.memo.enhancePoison = getEqTotal(PROP.ENHANCE_POISON)
		}
		return stats.memo.enhancePoison
	}
	function enhanceArcane(fresh) {
		if (fresh || typeof stats.memo.enhanceArcane === Undefined) {
			stats.memo.enhanceArcane = getEqTotal(PROP.ENHANCE_ARCANE)
		}
		return stats.memo.enhanceArcane
	}
	function enhanceLightning(fresh) {
		if (fresh || typeof stats.memo.enhanceLightning === Undefined) {
			stats.memo.enhanceLightning = getEqTotal(PROP.ENHANCE_LIGHTNING)
		}
		return stats.memo.enhanceLightning
	}
	function enhanceFire(fresh) {
		if (fresh || typeof stats.memo.enhanceFire === Undefined) {
			stats.memo.enhanceFire = getEqTotal(PROP.ENHANCE_FIRE)
		}
		return stats.memo.enhanceFire
	}
	function enhanceIce(fresh) {
		if (fresh || typeof stats.memo.enhanceIce === Undefined) {
			stats.memo.enhanceIce = getEqTotal(PROP.ENHANCE_ICE)
		}
		return stats.memo.enhanceIce
	}
	function enhanceAll(fresh) {
		if (fresh || typeof stats.memo.enhanceAll === Undefined) {
			stats.memo.enhanceAll = getEqTotal(PROP.ENHANCE_ALL)
		}
		return stats.memo.enhanceAll
	}
	function spellDamage(forceCrit, getNonCrit) {
		max = spell.data.spellDamage(my.skills[spell.index])
		// console.info('spellDamage 1', max)
		// enhance by type % and ALL%
		if (spell.data.damageType === DAMAGE_TYPE.BLOOD) enhanceDamage = enhanceBlood()
		else if (spell.data.damageType === DAMAGE_TYPE.POISON) enhanceDamage = enhancePoison()
		else if (spell.data.damageType === DAMAGE_TYPE.ARCANE) enhanceDamage = enhanceArcane()
		else if (spell.data.damageType === DAMAGE_TYPE.LIGHTNING) enhanceDamage = enhanceLightning()
		else if (spell.data.damageType === DAMAGE_TYPE.FIRE) enhanceDamage = enhanceFire()
		else if (spell.data.damageType === DAMAGE_TYPE.ICE) enhanceDamage = enhanceIce()
		enhanceDamage += enhanceAll()

		// wis boosts conjuration
		if (my[spell.data.spellType] === PROP.CONJURATION) enhanceDamage += (stats.wis() / 15)
		else if (my[spell.data.spellType] === PROP.EVOCATION) enhanceDamage += (stats.intel() / 15)
		else if (my[spell.data.spellType] === PROP.ALTERATION) enhanceDamage += (stats.cha() / 15)

		if (my.buffFlags.lichForm) {
			if (spell.data.damageType === DAMAGE_TYPE.POISON || spell.data.damageType === DAMAGE_TYPE.BLOOD) {
				enhanceDamage = buffs.lichForm.enhancePnB[my.buffs.lichForm.level]
				// console.info('lichForm', buffs.lichForm.enhancePnB[my.buffs.lichForm.level])
			}
		}

		max = max * (1 + (enhanceDamage / 100))
		// add spell damage by type and ALL
		if (spell.data.damageType === DAMAGE_TYPE.BLOOD) addedDamage = addSpellBlood()
		else if (spell.data.damageType === DAMAGE_TYPE.POISON) addedDamage = addSpellPoison()
		else if (spell.data.damageType === DAMAGE_TYPE.ARCANE) addedDamage = addSpellArcane()
		else if (spell.data.damageType === DAMAGE_TYPE.LIGHTNING) addedDamage = addSpellLightning()
		else if (spell.data.damageType === DAMAGE_TYPE.FIRE) addedDamage = addSpellFire()
		else if (spell.data.damageType === DAMAGE_TYPE.ICE) addedDamage = addSpellIce()
		addedDamage += addSpellAll()

		if (my.buffFlags.mirrorImage) {
			addedDamage += my.buffs.mirrorImage.damage
		}

		max += addedDamage
		min = max * spell.data.spellVariance
		// console.info('spellDamage 2', min, max)
		// crit?
		if (getNonCrit) isCrit = false
		else isCrit = forceCrit || stats.critChance() > rand()

		if (isCrit) {
			min *= 1.5
			max *= 1.5
		}

		if (min < 1) min = 1
		if (max < 1) max = 1
		min = ~~min
		max = ~~max

		return {
			min: min,
			max: max,
			damage: _.random(min, max),
			isCrit: isCrit,
		}
	}
	function autoAttackDamage(getNonCrit) {
		min = 1
		max = 1
		weaponSkill = typeof items.eq[12] === TYPE.OBJECT && items.eq[12].name ? items.eq[12].weaponSkill : 'Hand-to-Hand'
		atk = attack(weaponSkill)
		if (items.eq[12].minDamage) {
			min = items.eq[12].minDamage
			max = items.eq[12].maxDamage
		}
		else {
			h2h = handToHand()
			if (my.job === JOB.MONK) {
				max = 4 + (h2h / 2) // 125
				min = 1 + (h2h / 8) // 31.25 about 26 dps at 250
			}
			else {
				min = 1 + (h2h / 16)
				max = 2 + (h2h / 9)
			}
		}
		min = min * (1 + (atk * .002))
		max = max * (1 + (atk * .002))

		if (typeof getNonCrit === Undefined) {
			isCrit = stats.critChance() > rand()

			if (isCrit) {
				if (item.twoHandWeaponTypes.includes(items.eq[12].itemType)) {
					min *= 2
					max *= 2
				}
				else {
					min *= 1.5
					max *= 1.5
				}
			}
		}

		combat.levelSkillCheck(weaponSkill)
		return {
			min: min,
			max: max,
			damage: _.random(min, max),
			isCrit: isCrit,
			enhancedDamage: 1,
			weaponSkill: weaponSkill,
			damageType: DAMAGE_TYPE.PHYSICAL,
		}
	}
	function damage(skipSkillChecks, forceCrit, getNonCrit) {
		// normalized damage for skills
		min = 1
		max = 1
		weaponSkill = typeof items.eq[12] === TYPE.OBJECT && items.eq[12].name ? items.eq[12].weaponSkill : 'Hand-to-Hand'
		atk = attack(weaponSkill)
		 // get normalized DPS value for min/max
		if (weaponSkill !== 'Hand-to-Hand') {
			if (item.twoHandWeaponTypes.includes(items.eq[12].itemType)) {
				dps = tooltip.getDps(items.eq[12])
				max = dps * 1.5
				min = max * .8
			}
			else {
				dps = tooltip.getDps(items.eq[12])
				max = dps * 2
				min = max * .88
			}
		}
		else {
			h2h = handToHand()
			if (my.job === JOB.MONK) {
				max = 4 + (h2h / 2) // 125
				min = 1 + (h2h / 8) // 31.25 about 26 dps at 250
				dps = button.getPunchDps(min, max)
				max = dps * 2
				min = max * .88
			}
			else {
				min = 1 + (h2h / 16)
				max = 2 + (h2h / 9)
				dps = button.getPunchDps(min, max)
				max = dps * 2
				min = max * .88
			}
		}
		min = min * (1 + (atk * .002))
		max = max * (1 + (atk * .002))

		if (getNonCrit) isCrit = false
		else isCrit = forceCrit || stats.critChance() > rand()

		if (isCrit) {
			if (item.twoHandWeaponTypes.includes(items.eq[12].itemType)) {
				min *= 2
				max *= 2
			}
			else {
				min *= 1.5
				max *= 1.5
			}
		}

		if (!skipSkillChecks) {
			combat.levelSkillCheck(weaponSkill)
		}
		return {
			min: min,
			max: max,
			damage: _.random(min, max),
			isCrit: isCrit,
			enhancedDamage: 1,
			weaponSkill: weaponSkill,
			damageType: DAMAGE_TYPE.PHYSICAL,
		}
	}
	function offhandDamage() {
		if (!my.dualWield) return failedWeaponDamage
		min = 1
		max = 1
		weaponSkill = typeof items.eq[13] === TYPE.OBJECT && items.eq[13].name ? items.eq[13].weaponSkill : 'Hand-to-Hand'
		atk = attack(weaponSkill)
		if (items.eq[13].minDamage) {
			min = items.eq[13].minDamage
			max = items.eq[13].maxDamage
		}
		else {
			h2h = handToHand()
			if (my.job === JOB.MONK) {
				min = 1 + (h2h / 12)
				max = 4 + (h2h / 4.5)
			}
			else {
				min = 1 + (h2h / 16)
				max = 2 + (h2h / 9)
			}
		}
		min = min * (1 + (atk * .002))
		max = max * (1 + (atk * .002))

		isCrit = stats.critChance() > rand()
		if (isCrit) {
			min *= 1.5
			max *= 1.5
		}

		combat.levelSkillCheck(weaponSkill)
		combat.levelSkillCheck(PROP.DUAL_WIELD)
		return {
			min: min,
			max: max,
			damage: _.random(min, max),
			isCrit: isCrit,
			enhancedDamage: 1,
			weaponSkill: weaponSkill,
			damageType: DAMAGE_TYPE.PHYSICAL,
		}
	}
	function rangedDamage() {
		min = 1
		max = 1
		atk = attack('Archery')
		if (!my.archery || items.eq[14].itemType !== 'bows') return failedRangeDamage

		dps = tooltip.getDps(items.eq[14])
		max = dps * 1.5
		min = max * .8

		min = min * (1 + (atk * .002))
		max = max * (1 + (atk * .002))

		isCrit = stats.critChance() > rand()
		if (isCrit) {
			min *= 2
			max *= 2
		}

		combat.levelSkillCheck('Archery')
		return {
			min: min,
			max: max,
			damage: _.random(min, max),
			isCrit: isCrit,
			enhancedDamage: 1,
			isPiercing: true,
			isRanged: true,
			weaponSkill: 'Archery',
			damageType: DAMAGE_TYPE.PHYSICAL,
		}
	}
	function getResistPercent(type) {
		resistPercent = 1
		if (type === DAMAGE_TYPE.BLOOD) resistPercent = 1 - (resistBlood() / 400)
		else if (type === DAMAGE_TYPE.POISON) resistPercent = 1 - (resistPoison() / 400)
		else if (type === DAMAGE_TYPE.ARCANE) resistPercent = 1 - (resistArcane() / 400)
		else if (type === DAMAGE_TYPE.LIGHTNING) resistPercent = 1 - (resistLightning() / 400)
		else if (type === DAMAGE_TYPE.FIRE) resistPercent = 1 - (resistFire() / 400)
		else if (type === DAMAGE_TYPE.ICE) resistPercent = 1 - (resistIce() / 400)
		if (resistPercent < .25) resistPercent = .25
		return resistPercent
	}
	function resistAll() {
		value = 0
		if (my.buffFlags.manaShell) {
			value += buffs.manaShell.resistAll[my.buffs.manaShell.level]
		}
		if (my.buffFlags.chromaticSonata) {
			value += buffs.chromaticSonata.resistAll[my.buffs.chromaticSonata.level]
		}
		return value
	}
	function resistBlood(fresh) {
		if (fresh || typeof stats.memo.resistBlood === Undefined) {
			stats.memo.resistBlood = getStatTotal(PROP.RESIST_BLOOD) + getEqTotal(PROP.RESIST_ALL) + resistAll()
			if (my.buffFlags.sealOfRedemption) {
				stats.memo.resistBlood += buffs.sealOfRedemption.resistBlood[my.buffs.sealOfRedemption.level]
			}
			stats.memo.resistBlood = round(stats.memo.resistBlood)
		}
		return stats.memo.resistBlood
	}
	function resistPoison(fresh) {
		if (fresh || typeof stats.memo.resistPoison === Undefined) {
			stats.memo.resistPoison = getStatTotal(PROP.RESIST_POISON) + getEqTotal(PROP.RESIST_ALL) + resistAll()
			if (my.buffFlags.profaneSpirit) {
				stats.memo.resistPoison += buffs.profaneSpirit.resistPoison[my.buffs.profaneSpirit.level]
			}
		}
		return stats.memo.resistPoison
	}
	function resistArcane(fresh) {
		if (fresh || typeof stats.memo.resistArcane === Undefined) {
			stats.memo.resistArcane = getStatTotal(PROP.RESIST_ARCANE) + getEqTotal(PROP.RESIST_ALL) + resistAll()
		}
		return stats.memo.resistArcane
	}
	function resistLightning(fresh) {
		if (fresh || typeof stats.memo.resistLightning === Undefined) {
			stats.memo.resistLightning = getStatTotal(PROP.RESIST_LIGHTNING) + getEqTotal(PROP.RESIST_ALL) + resistAll()
			if (my.buffFlags.phaseBlade) {
				stats.memo.resistLightning += buffs.phaseBlade.resistLightning[my.buffs.phaseBlade.level]
			}
		}
		return stats.memo.resistLightning
	}
	function resistFire(fresh) {
		if (fresh || typeof stats.memo.resistFire === Undefined) {
			stats.memo.resistFire = getStatTotal(PROP.RESIST_FIRE) + getEqTotal(PROP.RESIST_ALL) + resistAll()
			if (my.buffFlags.moltenAegis) {
				stats.memo.resistFire += buffs.moltenAegis.resistFire[my.buffs.moltenAegis.level]
			}
		}
		return stats.memo.resistFire
	}
	function resistIce(fresh) {
		if (fresh || typeof stats.memo.resistIce === Undefined) {
			stats.memo.resistIce = getStatTotal(PROP.RESIST_ICE) + getEqTotal(PROP.RESIST_ALL) + resistAll()
			if (my.buffFlags.borealTalisman) {
				stats.memo.resistIce += buffs.borealTalisman.resistIce[my.buffs.borealTalisman.level]
			}
		}
		return stats.memo.resistIce
	}
	function resistPhysical(fresh) {
		if (fresh || typeof stats.memo.resistPhysical === Undefined) {
			stats.memo.resistPhysical = 1 - (getEqTotal(PROP.RESIST_PHYSICAL) / 400)
			if (stats.memo.resistPhysical < .5) stats.memo.resistPhysical = .5
		}
		return stats.memo.resistPhysical
	}
	// adds my raw value plus equipment
	function getStatTotal(attr) {
		val = my[attr] || 0
		i = 0
		for (; i<15; i++) {
			if (items.eq[i][attr]) val += items.eq[i][attr]
		}
		return val
	}
	// equipped value only
	function getEqTotal(attr) {
		val = 0
		i = 0
		for (; i<15; i++) {
			if (items.eq[i][attr]) val += items.eq[i][attr]
		}
		return val
	}
	function getPropMax(prop, fresh) {
		var resp = 0
		if (prop === PROP.OFFENSE) resp = offenseMax(fresh)
		else if (prop === PROP.DEFENSE) resp = defenseMax(fresh)
		else if (prop === PROP.ONE_HAND_SLASH) resp = oneHandSlashMax(fresh)
		else if (prop === PROP.ONE_HAND_BLUNT) resp = oneHandBluntMax(fresh)
		else if (prop === PROP.PIERCING) resp = piercingMax(fresh)
		else if (prop === PROP.ARCHERY) resp = archeryMax(fresh)
		else if (prop === PROP.HAND_TO_HAND) resp = handToHandMax(fresh)
		else if (prop === PROP.TWO_HAND_SLASH) resp = twoHandSlashMax(fresh)
		else if (prop === PROP.TWO_HAND_BLUNT) resp = twoHandBluntMax(fresh)
		else if (prop === PROP.DUAL_WIELD) resp = dualWieldMax(fresh)
		else if (prop === PROP.DOUBLE_ATTACK) resp = doubleAttackMax(fresh)
		else if (prop === PROP.DODGE) resp = dodgeMax(fresh)
		else if (prop === PROP.PARRY) resp = parryMax(fresh)
		else if (prop === PROP.RIPOSTE) resp = riposteMax(fresh)
		else if (prop === PROP.ALTERATION) resp = alterationMax(fresh)
		else if (prop === PROP.EVOCATION) resp = evocationMax(fresh)
		else if (prop === PROP.CONJURATION) resp = conjurationMax(fresh)
		return resp
	}
	function offenseMax(fresh) {
		if (fresh || typeof stats.memo.offenseMax === Undefined) {
			if (my.race === RACE.HALFLING) base = 10
			else if (my.race === RACE.HALF_ELF) base = 5
			else base = 0
			if (offensiveJobs.includes(my.job)) stats.memo.offenseMax = base + my.level * 5
			else if (intCasterJobs.includes(my.job)) stats.memo.offenseMax = base + my.level * 3
			else stats.memo.offenseMax = base + my.level * 4
		}
		return stats.memo.offenseMax
	}
	function defenseMax(fresh) {
		if (fresh || typeof stats.memo.defenseMax === Undefined) {
			base = my.race === RACE.DWARF ? 5 : 0
			if (defensiveJobs.includes(my.job)) stats.memo.defenseMax = base + my.level * 5
			else if (intCasterJobs.includes(my.job)) stats.memo.defenseMax = base + my.level * 3
			else stats.memo.defenseMax = base + my.level * 4
		}
		return stats.memo.defenseMax
	}
	function oneHandSlashMax(fresh) {
		if (fresh || typeof stats.memo.oneHandSlashMax === Undefined) {
			if (my.race === RACE.HUMAN) base = 10
			else if (my.race === RACE.HALF_ELF) base = 5
			else base = 0
			if (my.job === JOB.RANGER) stats.memo.oneHandSlashMax = base + my.level * 5
			else if (my.job === JOB.ROGUE) stats.memo.oneHandSlashMax = base + _.min([my.level * 5, 240])
			else if (averageOneHandSlashJobs.includes(my.job)) stats.memo.oneHandSlashMax = base + my.level * 4
			else stats.memo.oneHandSlashMax = 0
		}
		return stats.memo.oneHandSlashMax

	}
	function oneHandBluntMax(fresh) {
		if (fresh || typeof stats.memo.oneHandBluntMax === Undefined) {
			if (my.race === RACE.BARBARIAN) base = 10
			else if (my.race === RACE.HALF_ELF) base = 5
			else base = 0
			if (my.job === JOB.MONK) stats.memo.oneHandBluntMax = base + my.level * 5
			else if (my.job === JOB.RANGER) stats.memo.oneHandBluntMax = base + _.min([my.level * 5, 240])
			else if (my.job === JOB.ROGUE) stats.memo.oneHandBluntMax = base + _.min([my.level * 5, 225])
			else stats.memo.oneHandBluntMax = base + my.level * 4
		}
		return stats.memo.oneHandBluntMax

	}
	function piercingMax(fresh) {
		if (fresh || typeof stats.memo.piercingMax === Undefined) {
			if (my.race === RACE.HALFLING) base = 10
			else if (my.race === RACE.HALF_ELF) base = 5
			else base = 0
			if (my.job === JOB.ROGUE) stats.memo.piercingMax = base + my.level * 5
			else if (my.job === JOB.RANGER) stats.memo.piercingMax = base + _.min([my.level * 5, 240])
			else if (averagePiercingJobs.includes(my.job)) stats.memo.piercingMax = base + my.level * 4
			else stats.memo.piercingMax = 0
		}
		return stats.memo.piercingMax

	}
	function archeryMax(fresh) {
		if (fresh || typeof stats.memo.archeryMax === Undefined) {
			base = my.race === RACE.HALF_ELF ? 5 : 0
			if (my.job === JOB.RANGER) stats.memo.archeryMax = base + my.level * 5
			else if (averageArcherJobs.includes(my.job)) stats.memo.archeryMax = base + my.level * 2
			else stats.memo.archeryMax = 0
		}
		return stats.memo.archeryMax
	}
	function handToHandMax(fresh) {
		if (fresh || typeof stats.memo.handToHandMax === Undefined) {
			base = my.race === RACE.HALF_ELF ? 5 : 0
			if (my.job === JOB.MONK) stats.memo.handToHandMax = base + my.level * 5
			else if (averagePunchJobs.includes(my.job)) stats.memo.handToHandMax = base + my.level * 2
			else stats.memo.handToHandMax = my.level
		}
		return stats.memo.handToHandMax
	}
	function twoHandSlashMax(fresh) {
		if (fresh || typeof stats.memo.twoHandSlashMax === Undefined) {
			if (my.race === RACE.HUMAN || my.race === RACE.ORC) base = 10
			else if (my.race === RACE.HALF_ELF) base = 5
			else base = 0
			if (my.job === JOB.RANGER) {
				stats.memo.twoHandSlashMax = base + _.min([my.level * 5, 225])
			}
			else if (tankJobs.includes(my.job)) {
				stats.memo.twoHandSlashMax = base + my.level * 4
			}
			else stats.memo.twoHandSlashMax = 0
		}
		return stats.memo.twoHandSlashMax
	}
	function twoHandBluntMax(fresh) {
		if (fresh || typeof stats.memo.twoHandBluntMax === Undefined) {
			if (my.race === RACE.BARBARIAN || my.race === RACE.ORC) base = 10
			else if (my.race === RACE.HALF_ELF) base = 5
			else base = 0
			if (my.job === JOB.MONK) {
				stats.memo.twoHandBluntMax = base + my.level * 5
			}
			else if (my.job === JOB.RANGER) {
				stats.memo.twoHandBluntMax = base + _.min([my.level * 5, 225])
			}
			else if (twoHandBluntAverageJobs.includes(my.job)) {
				stats.memo.twoHandBluntMax = base + my.level * 4
			}
			else stats.memo.twoHandBluntMax = 0
		}
		return stats.memo.twoHandBluntMax
	}
	function dualWieldMax(fresh) {
		if (fresh || typeof stats.memo.dualWieldMax === Undefined) {
			base = my.race === RACE.HALF_ELF ? 5 : 0
			if (my.job === JOB.MONK ||
				my.job === JOB.ROGUE && my.level >= 13 ||
				my.job === JOB.RANGER && my.level >= 17) {
				stats.memo.dualWieldMax = base + my.level * 5
			}
			else if (
				my.job === JOB.WARRIOR && my.level >= 13 ||
				my.job === JOB.BARD && my.level >= 17) {
				stats.memo.dualWieldMax = base + my.level * 4
			}
			else stats.memo.dualWieldMax = 0
		}
		return stats.memo.dualWieldMax
	}
	function doubleAttackMax(fresh) {
		if (fresh || typeof stats.memo.doubleAttackMax === Undefined) {
			base = my.race === RACE.HALF_ELF ? 5 : 0
			if (
				my.job === JOB.CRUSADER && my.level >= 20 ||
				my.job === JOB.SHADOW_KNIGHT && my.level >= 20 ||
				my.job === JOB.MONK && my.level >= 15 ||
				my.job === JOB.ROGUE && my.level >= 16 ||
				my.job === JOB.RANGER && my.level >= 20) {
				stats.memo.doubleAttackMax = base + my.level * 5
			}
			else if (my.job === JOB.WARRIOR && my.level >= 15) {
				stats.memo.doubleAttackMax = base + my.level * 4
			}
			else stats.memo.doubleAttackMax = 0
		}
		return stats.memo.doubleAttackMax
	}
	function dodgeMax(fresh) {
		if (fresh || typeof stats.memo.dodgeMax === Undefined) {
			if (my.race === RACE.HALFLING) base = 10
			else if (my.race === RACE.HALF_ELF) base = 5
			else base = 0
			if (
				(my.job === JOB.ROGUE && my.level >= 4) ||
				(my.job === JOB.BARD && my.level >= 10)) {
				stats.memo.dodgeMax = base + my.level * 4
			}
			else if (
				(my.job === JOB.WARRIOR && my.level >= 6) ||
				(my.job === JOB.CRUSADER && my.level >= 10) ||
				(my.job === JOB.SHADOW_KNIGHT && my.level >= 10) ||
				(my.job === JOB.MONK) ||
				(my.job === JOB.RANGER && my.level >= 8)) {
				stats.memo.dodgeMax = base + my.level * 3
			}
			else if (
				wisCasterJobs.includes(my.job) && my.level >= 15 ||
				intCasterJobs.includes(my.job) && my.level >= 22) {
				stats.memo.dodgeMax = base + my.level * 2
			}
			else stats.memo.dodgeMax = 0
		}
		return stats.memo.dodgeMax

	}
	function parryMax(fresh) {
		if (fresh || typeof stats.memo.parryMax === Undefined) {
			base = my.race === RACE.HALF_ELF ? 5 : 0
			if (
				(my.job === JOB.WARRIOR && my.level >= 10) ||
				(my.job === JOB.CRUSADER && my.level >= 17)) {
				stats.memo.parryMax = base + my.level * 5
			}
			else if (
				(my.job === JOB.SHADOW_KNIGHT && my.level >= 17) ||
				(my.job === JOB.RANGER && my.level >= 18)) {
				stats.memo.parryMax = base + my.level * 4
			}
			else if (
				(my.job === JOB.MONK && my.level >= 12) ||
				(my.job === JOB.ROGUE && my.level >= 12)) {
				stats.memo.parryMax = base + my.level * 3
			}
			else stats.memo.parryMax = 0
		}
		return stats.memo.parryMax
	}
	function riposteMax(fresh) {
		if (fresh || typeof stats.memo.riposteMax === Undefined) {
			base = my.race === RACE.HALF_ELF ? 5 : 0
			if (
				(my.job === JOB.WARRIOR && my.level >= 25) ||
				(my.job === JOB.SHADOW_KNIGHT && my.level >= 30)) {
				stats.memo.riposteMax = base + my.level * 5
			}
			else if (
				(my.job === JOB.CRUSADER && my.level >= 30) ||
				(my.job === JOB.MONK && my.level >= 35)) {
				stats.memo.riposteMax = base + my.level * 4
			}
			else if (
				(my.job === JOB.ROGUE && my.level >= 30) ||
				(my.job === JOB.RANGER && my.level >= 35)) {
				stats.memo.riposteMax = base + my.level * 3
			}
			else stats.memo.riposteMax = 0
		}
		return stats.memo.riposteMax
	}
	function alterationMax(fresh) {
		if (fresh || typeof stats.memo.alterationMax === Undefined) {
			base = my.race === RACE.DWARF || my.race === RACE.SERAPH ? 5 : 0
			if (allCasterJobs.includes(my.job)) stats.memo.alterationMax = base + my.level * 5
			else if (hybridJobs.includes(my.job)) stats.memo.alterationMax = base + my.level * 5
			else stats.memo.alterationMax = 0
		}
		return stats.memo.alterationMax
	}
	function evocationMax(fresh) {
		if (fresh || typeof stats.memo.evocationMax === Undefined) {
			if (my.race === RACE.HIGH_ELF) base = 10
			else if (my.race === RACE.SERAPH) base = 5
			else base = 0
			if (allCasterJobs.includes(my.job)) stats.memo.evocationMax = base + my.level * 5
			else if (hybridJobs.includes(my.job)) stats.memo.evocationMax = base + my.level * 5
			else stats.memo.evocationMax = 0
		}
		return stats.memo.evocationMax
	}
	function conjurationMax(fresh) {
		if (fresh || typeof stats.memo.conjurationMax === Undefined) {
			if (my.race === RACE.TROLL) base = 10
			else if (my.race === RACE.SERAPH) base = 5
			else base = 0
			if (allCasterJobs.includes(my.job)) stats.memo.conjurationMax = base + my.level * 5
			else if (hybridJobs.includes(my.job)) stats.memo.conjurationMax = base + my.level * 5
			else stats.memo.conjurationMax = 0
		}
		return stats.memo.conjurationMax
	}
	function setAllResources() {
		my.set(PROP.HP_MAX, hpMax())
		my.set(PROP.MP_MAX, mpMax())
		my.set(PROP.SP_MAX, spMax())

		if (my.hp > my.hpMax) my.set(PROP.HP, my.hpMax)
		if (my.mp > my.mpMax) my.set(PROP.MP, my.mpMax)
		if (my.sp > my.spMax) my.set(PROP.SP, my.spMax)
	}

	let baseResource = 0
	const hpBase = 80
	const mpBase = 60
	const spBase = 40
	function hpMax(fresh) {
		if (fresh || typeof stats.memo.hpMax === Undefined) {
			baseResource = hpBase + (
				stats.sta() * hpTier[my.job]) * (my.level / 50) +
				(my.level * (hpTier[my.job] * 2.5)
			)
			stats.memo.hpMax = ~~(baseResource * hpPercentBonus() + getEqTotal(PROP.HP))
			if (my.buffFlags.sealOfRedemption) {
				stats.memo.hpMax += (my.buffs.sealOfRedemption.damage)
			}
			if (my.buffFlags.zealousResolve) {
				stats.memo.hpMax += (my.buffs.zealousResolve.damage)
			}
		}
		return stats.memo.hpMax
		////////////////////////////////
		function hpPercentBonus() {
			let bonus = 1 + (getStatTotal(PROP.INCREASE_HP_PERCENT) / 100)
			if (my.buffFlags.militantCadence) {
				bonus += buffs.militantCadence.hpPercent[my.buffs.militantCadence.level]
			}
			return bonus
		}
	}
	let percentBonus = 0
	function mpMax(fresh) {
		if (fresh || typeof stats.memo.mpMax === Undefined) {
			baseResource = mpBase + (
				(stats.intel() * mpTier[my.job]) * (my.level / 50) +
				(my.level * (mpTier[my.job] * 2.5))
			)
			stats.memo.mpMax = ~~(baseResource * mpPercentBonus() + getEqTotal(PROP.MP))
		}
		return stats.memo.mpMax
		////////////////////////////////
		function mpPercentBonus() {
			let bonus = 1 + (getStatTotal(PROP.INCREASE_MP_PERCENT) / 100)
			if (my.buffFlags.militantCadence) {
				bonus += buffs.militantCadence.mpPercent[my.buffs.militantCadence.level]
			}
			return bonus
		}
	}
	function spMax(fresh) {
		if (fresh || typeof stats.memo.spMax === Undefined) {
			baseResource = (spBase +
				((stats.cha() * spTier[my.job]) * (my.level / 50) +
				(my.level * (spTier[my.job] * 2.5)))
			)
			stats.memo.spMax = ~~(baseResource * spPercentBonus() + getEqTotal(PROP.SP))
		}
		return stats.memo.spMax
		////////////////////////////////
		function spPercentBonus() {
			let bonus = 1 + (getStatTotal('increaseSpPercent') / 100)
			if (my.buffFlags.militantCadence) {
				bonus += buffs.militantCadence.spPercent[my.buffs.militantCadence.level]
			}
			return bonus
		}
	}
	// troll 9, normal 5
	function baseHpRegen(fresh) {
		if (fresh || typeof stats.memo.baseHpRegen === Undefined) {
			stats.memo.baseHpRegen = (my.race === RACE.TROLL ? 3 : 1) +
				(my.level * (my.race === RACE.TROLL ? .12 : .08))
		}
		return stats.memo.baseHpRegen
	}
	// high elf 16, normal 10
	function baseMpRegen(fresh) {
		if (fresh || typeof stats.memo.baseMpRegen === Undefined) {
			stats.memo.baseMpRegen = (my.race === RACE.HIGH_ELF ? 4 : 2) +
				(my.level * (my.race === RACE.HIGH_ELF ? .24 : .16))
		}
		return stats.memo.baseMpRegen
	}
	// human 16, normal 10
	function baseSpRegen(fresh) {
		if (fresh || typeof stats.memo.baseSpRegen === Undefined) {
			stats.memo.baseSpRegen = (my.race === RACE.HUMAN ? 4 : 2) +
				(my.level * (my.race === RACE.HUMAN ? .24 : .16))
		}
		return stats.memo.baseSpRegen
	}
	function hpRegen(fresh) {
		if (fresh || typeof stats.memo.hpRegen === Undefined) {
			stats.memo.hpRegen = ~~(baseHpRegen() + getEqTotal(PROP.HP_REGEN))
			if (my.buffFlags.branchSpirit) {
				stats.memo.hpRegen += buffs.branchSpirit.hpRegen[my.buffs.branchSpirit.level]
			}
			if (my.buffFlags.litanyOfLife) {
				stats.memo.hpRegen += buffs.litanyOfLife.hpRegen[my.buffs.litanyOfLife.level]
			}
			if (my.buffFlags.lichForm) {
				stats.memo.hpRegen -= buffs.lichForm.hpRegen[my.buffs.lichForm.level]
			}
		}
		// console.info(PROP.HP_REGEN, stats.memo.hpRegen)
		return stats.memo.hpRegen
	}
	function mpRegen(fresh) {
		if (fresh || typeof stats.memo.mpRegen === Undefined) {
			stats.memo.mpRegen = ~~(baseMpRegen() + getEqTotal(PROP.MP_REGEN))
			if (my.buffFlags.lichForm) {
				stats.memo.mpRegen += buffs.lichForm.mpRegen[my.buffs.lichForm.level]
			}
			if (my.buffFlags.clarity) {
				stats.memo.mpRegen += buffs.clarity.mpRegen[my.buffs.clarity.level]
			}
			if (my.buffFlags.melodyOfMana) {
				stats.memo.mpRegen += buffs.melodyOfMana.mpRegen[my.buffs.melodyOfMana.level]
			}
		}
		// console.info('mpRegen', stats.memo.mpRegen)
		return stats.memo.mpRegen
	}
	function spRegen(fresh) {
		if (fresh || typeof stats.memo.spRegen === Undefined) {
			stats.memo.spRegen = ~~(baseSpRegen() + getEqTotal(PROP.SP_REGEN))
			if (my.buffFlags.conviction) {
				stats.memo.mpRegen += buffs.conviction.spRegen[my.buffs.conviction.level]
			}
		}
		return stats.memo.spRegen
	}
	function ignoreTargetArmor(fresh) {
		if (fresh || typeof stats.memo.ignoreTargetArmor === Undefined) {
			stats.memo.ignoreTargetArmor = items.eq.some(eq => eq.ignoreTargetArmor)
		}
		return stats.memo.ignoreTargetArmor
	}
	function reduceTargetArmor(fresh) {
		if (fresh || typeof stats.memo.reduceTargetArmor === Undefined) {
			stats.memo.reduceTargetArmor = items.eq.some(eq => eq.reduceTargetArmor)
		}
		return stats.memo.reduceTargetArmor
	}
	function enhancedDamageToHumanoids(fresh) {
		if (fresh || typeof stats.memo.enhancedDamageToHumanoids === Undefined) {
			stats.memo.enhancedDamageToHumanoids = getEqTotal(PROP.ENHANCED_DAMAGE_TO_HUMANOIDS) / 100
		}
		return stats.memo.enhancedDamageToHumanoids
	}
	function enhancedDamageToBeasts(fresh) {
		if (fresh || typeof stats.memo.enhancedDamageToBeasts === Undefined) {
			stats.memo.enhancedDamageToBeasts = getEqTotal(PROP.ENHANCED_DAMAGE_TO_BEASTS) / 100
		}
		return stats.memo.enhancedDamageToBeasts
	}
	function enhancedDamageToUndead(fresh) {
		if (fresh || typeof stats.memo.enhancedDamageToUndead === Undefined) {
			stats.memo.enhancedDamageToUndead = getEqTotal(PROP.ENHANCED_DAMAGE_TO_UNDEAD) / 100
		}
		return stats.memo.enhancedDamageToUndead
	}
	function enhancedDamageToDemons(fresh) {
		if (fresh || typeof stats.memo.enhancedDamageToDemons === Undefined) {
			stats.memo.enhancedDamageToDemons = getEqTotal(PROP.ENHANCED_DAMAGE_TO_DEMONS) / 100
		}
		return stats.memo.enhancedDamageToDemons
	}
	function enhancedDamageToDragonkin(fresh) {
		if (fresh || typeof stats.memo.enhancedDamageToDragonkin === Undefined) {
			stats.memo.enhancedDamageToDragonkin = getEqTotal(PROP.ENHANCED_DAMAGE_TO_DRAGONKIN) / 100
		}
		return stats.memo.enhancedDamageToDragonkin
	}
	function enhancedDamageToMystical(fresh) {
		if (fresh || typeof stats.memo.enhancedDamageToMystical === Undefined) {
			stats.memo.enhancedDamageToMystical = getEqTotal(PROP.ENHANCED_DAMAGE_TO_MYSTICAL) / 100
		}
		return stats.memo.enhancedDamageToMystical
	}
	function enhancedDamageToGiants(fresh) {
		if (fresh || typeof stats.memo.enhancedDamageToGiants === Undefined) {
			stats.memo.enhancedDamageToGiants = getEqTotal(PROP.ENHANCED_DAMAGE_TO_GIANTS) / 100
		}
		return stats.memo.enhancedDamageToGiants
	}
	function phyMit(fresh) {
		if (fresh || typeof stats.memo.phyMit === Undefined) {
			stats.memo.phyMit = getEqTotal(PROP.PHY_MIT)
			if (my.buffFlags.bulwark) {
				stats.memo.phyMit += buffs.bulwark.mitigation[my.buffs.bulwark.level]
			}
		}
		return stats.memo.phyMit
	}
	function magMit(fresh) {
		if (fresh || typeof stats.memo.magMit === Undefined) {
			stats.memo.magMit = getEqTotal(PROP.MAG_MIT)
			if (my.buffFlags.bulwark) {
				stats.memo.magMit += buffs.bulwark.mitigation[my.buffs.bulwark.level]
			}
		}
		return stats.memo.magMit
	}
	function leech(fresh) {
		if (fresh || typeof stats.memo.leech === Undefined) {
			stats.memo.leech = getEqTotal(PROP.LEECH)
			if (my.buffFlags.vampiricAllure) {
				stats.memo.leech += buffs.vampiricAllure.leech[my.buffs.vampiricAllure.level]
			}
		}
		return stats.memo.leech
	}
	function wraith(fresh) {
		if (fresh || typeof stats.memo.wraith === Undefined) {
			stats.memo.wraith = getEqTotal(PROP.WRAITH)
			if (my.buffFlags.vampiricAllure) {
				stats.memo.wraith += buffs.vampiricAllure.leech[my.buffs.vampiricAllure.level]
			}
		}
		return stats.memo.wraith
	}
	function damageTakenToMana(fresh) {
		if (fresh || typeof stats.memo.damageTakenToMana === Undefined) {
			stats.memo.damageTakenToMana = getEqTotal(PROP.DAMAGE_TAKEN_TO_MANA)
			if (stats.memo.damageTakenToMana > 50) stats.memo.damageTakenToMana = 50
		}
		return stats.memo.damageTakenToMana
	}
	function damageTakenToSpirit(fresh) {
		if (fresh || typeof stats.memo.damageTakenToSpirit === Undefined) {
			stats.memo.damageTakenToSpirit = getEqTotal(PROP.DAMAGE_TAKEN_TO_SPIRIT)
			if (stats.memo.damageTakenToSpirit > 50) stats.memo.damageTakenToSpirit = 50
		}
		return stats.memo.damageTakenToSpirit
	}
	function hpKill(fresh) {
		if (fresh || typeof stats.memo.hpKill === Undefined) {
			stats.memo.hpKill = getEqTotal(PROP.HP_KILL)
		}
		return stats.memo.hpKill
	}
	function mpKill(fresh) {
		if (fresh || typeof stats.memo.mpKill === Undefined) {
			stats.memo.mpKill = getEqTotal(PROP.MP_KILL)
		}
		return stats.memo.mpKill
	}
	function spKill(fresh) {
		if (fresh || typeof stats.memo.spKill === Undefined) {
			stats.memo.spKill = getEqTotal(PROP.SP_KILL)
		}
		return stats.memo.spKill
	}
	function resistParalyze(fresh) {
		// cannot change targets or use melee skills? (auto attack works)
		if (fresh || typeof stats.memo.resistParalyze === Undefined) {
			stats.memo.resistParalyze = getEqTotal(PROP.RESIST_PARALYZE)
			if (stats.memo.resistParalyze > 50) {
				stats.memo.resistParalyze = 50
			}
		}
		return stats.memo.resistParalyze
	}
	function resistFear(fresh) {
		// all skill/spell damage output halved
		if (fresh || typeof stats.memo.resistFear === Undefined) {
			stats.memo.resistFear = getEqTotal(PROP.RESIST_FEAR)
			if (my.buffFlags.intrepidShout) {
				stats.memo.resistFear += buffs.intrepidShout.resistFear[my.buffs.intrepidShout.level]
			}
			if (stats.memo.resistFear > 50) {
				stats.memo.resistFear = 50
			}
		}
		return stats.memo.resistFear
	}
	function resistStun(fresh) {
		// can't do anything
		if (fresh || typeof stats.memo.resistStun === Undefined) {
			stats.memo.resistStun = getEqTotal(PROP.RESIST_STUN)
			if (stats.memo.resistStun > 50) {
				stats.memo.resistStun = 50
			}
		}
		return stats.memo.resistStun
	}
	function resistSilence(fresh) {
		// cannot cast spells
		if (fresh || typeof stats.memo.resistSilence === Undefined) {
			stats.memo.resistSilence = getEqTotal(PROP.RESIST_SILENCE)
			if (my.buffFlags.manaShell) {
				stats.memo.resistSilence += buffs.manaShell.silence[my.buffs.manaShell.level]
			}
			if (stats.memo.resistSilence > 50) {
				stats.memo.resistSilence = 50
			}
		}
		return stats.memo.resistSilence
	}

	function getAttackSpeed(slot) {
		// weapon or punch speed?
		if (typeof items.eq[slot] === TYPE.OBJECT) speed = items.eq[slot].speed
		else speed = button.autoAttackSpeed
		speedHaste = 1
		// buffs
		if (my.buffFlags.spiritOfTheHunter) speedHaste -= buffs.spiritOfTheHunter.attackHaste
		if (my.buffFlags.battleHymn) speedHaste -= buffs.battleHymn.attackHaste
		// debuffs
		if (speedHaste < .25) speedHaste = .25
		else if (speedHaste > 2) speedHaste = 2
		return speed * speedHaste
	}
	function getSkillSpeed() {
		skillHaste = 1
		if (my.buffFlags.frenzy) skillHaste -= buffs.frenzy.skillHaste[my.buffs.frenzy.level]
		if (my.buffFlags.augmentation) skillHaste -= buffs.augmentation.skillHaste[my.buffs.augmentation.level]
		if (skillHaste < .5) skillHaste = .5
		else if (skillHaste > 2) skillHaste = 2
		return skillHaste
	}

	function getCastingSpeed() {
		castHaste = 1
		if (my.buffFlags.celestialFrenzy) castHaste -= buffs.celestialFrenzy.castingHaste
		if (my.buffFlags.melodyOfMana) castHaste -= buffs.melodyOfMana.castingHaste
		if (castHaste < .5) castHaste = .5
		else if (castHaste > 2) castHaste = 2
		// console.info('getCastingSpeed', spell.castTime * castHaste)
		return spell.castTime * castHaste
	}
})($, TweenMax, _);