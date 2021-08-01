var stats = {};
(function($, TweenMax, _, undefined) {
	stats = {
		memo: {},
		critFromBuffBonus,
		clearCache,
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
		primaryAutoAttackDamage,
		skillDamage,
		secondaryAutoAttackDamage,
		rangedDamage,
		getResistPercent,
		resistAll,
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
	let val, base, i, len, type, min, max, dynamicAttackBonus, h2h, atk, stat, dps
	let baseValue = 1
	let obj = {}

	const FailedWeaponDamage = {
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
		isCrit: false,
		enhancedDamage: 1,
		isPiercing: false,
		isRanged: true,
		weaponSkill: 'Archery',
		damageType: DAMAGE_TYPE.PHYSICAL,
	}
	const hpTier = {
		[JOB.WARRIOR]: 10,
		[JOB.CRUSADER]: 9,
		[JOB.SHADOW_KNIGHT]: 9,
		[JOB.MONK]: 7,
		[JOB.ROGUE]: 7,
		[JOB.RANGER]: 7,
		[JOB.BARD]: 7,
		[JOB.DRUID]: 7,
		[JOB.CLERIC]: 7,
		[JOB.SHAMAN]: 7,
		[JOB.WARLOCK]: 6,
		[JOB.ENCHANTER]: 6,
		[JOB.TEMPLAR]: 6,
		[JOB.WIZARD]: 6,
	}
	const mpTier = {
		[JOB.WARRIOR]: 2,
		[JOB.CRUSADER]: 3,
		[JOB.SHADOW_KNIGHT]: 3,
		[JOB.MONK]: 2,
		[JOB.ROGUE]: 2,
		[JOB.RANGER]: 3,
		[JOB.BARD]: 3,
		[JOB.DRUID]: 4,
		[JOB.CLERIC]: 4,
		[JOB.SHAMAN]: 4,
		[JOB.WARLOCK]: 5,
		[JOB.ENCHANTER]: 5,
		[JOB.TEMPLAR]: 5,
		[JOB.WIZARD]: 5,
	}
	const spTier = {
		[JOB.WARRIOR]: 2,
		[JOB.CRUSADER]: 3,
		[JOB.SHADOW_KNIGHT]: 3,
		[JOB.MONK]: 2,
		[JOB.ROGUE]: 2,
		[JOB.RANGER]: 3,
		[JOB.BARD]: 4,
		[JOB.DRUID]: 5,
		[JOB.CLERIC]: 5,
		[JOB.SHAMAN]: 5,
		[JOB.WARLOCK]: 3,
		[JOB.ENCHANTER]: 5,
		[JOB.TEMPLAR]: 3,
		[JOB.WIZARD]: 3,
	}

	function str(fresh) {
		if (fresh || typeof stats.memo.str === 'undefined') {
			stats.memo.str = setStat(my.str + create.raceAttrs[my.race][0] + create.jobAttrs[my.jobLong][0] + getEqTotal(PROP.STR) + getEqTotal(PROP.ALL_STATS))
			if (my.buffFlags.borealTalisman) {
				stats.memo.str.value += buffs.borealTalisman.str[my.buffs.borealTalisman.level]
			}
			if (my.buffFlags.battleHymn) {
				stats.memo.str.value += buffs.battleHymn.str[my.buffs.battleHymn.level]
			}
			setColor(stats.memo.str)
		}
		return stats.memo.str
	}
	function sta(fresh) {
		if (fresh || typeof stats.memo.sta === 'undefined') {
			stats.memo.sta = setStat(my.sta + create.raceAttrs[my.race][1] + create.jobAttrs[my.jobLong][1] + getEqTotal(PROP.STA) + getEqTotal(PROP.ALL_STATS))
			if (my.buffFlags.borealTalisman) {
				stats.memo.sta.value += buffs.borealTalisman.sta[my.buffs.borealTalisman.level]
			}
			setColor(stats.memo.sta)
		}
		return stats.memo.sta
	}
	function agi(fresh) {
		if (fresh || typeof stats.memo.agi === 'undefined') {
			stats.memo.agi = setStat(my.agi + create.raceAttrs[my.race][2] + create.jobAttrs[my.jobLong][2] + getEqTotal(PROP.AGI) + getEqTotal(PROP.ALL_STATS))
			if (my.buffFlags.augmentation) {
				stats.memo.agi.value += buffs.augmentation.agi[my.buffs.augmentation.level]
			}
			if (my.buffFlags.talismanOfTreachery) {
				stats.memo.agi.value += buffs.talismanOfTreachery.agi[my.buffs.talismanOfTreachery.level]
			}
			if (fresh) {
				dodgeChance(true)
				armor(true)
			}
			setColor(stats.memo.agi)
		}
		return stats.memo.agi
	}
	function dex(fresh) {
		if (fresh || typeof stats.memo.dex === 'undefined') {
			stats.memo.dex = setStat(my.dex + create.raceAttrs[my.race][3] + create.jobAttrs[my.jobLong][3] + getEqTotal(PROP.DEX) + getEqTotal(PROP.ALL_STATS))
			if (my.buffFlags.augmentation) {
				stats.memo.dex.value += buffs.augmentation.dex[my.buffs.augmentation.level]
			}
			if (my.buffFlags.battleHymn) {
				stats.memo.dex.value += buffs.battleHymn.dex[my.buffs.battleHymn.level]
			}

			if (fresh) {
				parryChance(true)
				riposteChance(true)
				critChance(true)
			}
			setColor(stats.memo.dex)
		}
		return stats.memo.dex
	}
	function wis(fresh) {
		if (fresh || typeof stats.memo.wis === 'undefined') {
			stats.memo.wis = setStat(my.wis + create.raceAttrs[my.race][4] + create.jobAttrs[my.jobLong][4] + getEqTotal(PROP.WIS) + getEqTotal(PROP.ALL_STATS))
			setColor(stats.memo.wis)
		}
		return stats.memo.wis
	}
	function intel(fresh) {
		if (fresh || typeof stats.memo.intel === 'undefined') {
			stats.memo.intel = setStat(my.intel + create.raceAttrs[my.race][5] + create.jobAttrs[my.jobLong][5] + getEqTotal(PROP.INTEL) + getEqTotal(PROP.ALL_STATS))
			if (my.buffFlags.clarity) {
				stats.memo.intel.value += buffs.clarity.intel[my.buffs.clarity.level]
			}
			mpMax(true)
			setColor(stats.memo.intel)
		}
		return stats.memo.intel
	}
	function cha(fresh) {
		if (fresh || typeof stats.memo.cha === 'undefined') {
			stats.memo.cha = setStat(my.cha + create.raceAttrs[my.race][6] + create.jobAttrs[my.jobLong][6] + getEqTotal(PROP.CHA) + getEqTotal(PROP.ALL_STATS))
			if (my.buffFlags.vampiricAllure) {
				stats.memo.cha.value += buffs.vampiricAllure.cha[my.buffs.vampiricAllure.level]
			}
			if (my.buffFlags.conviction) {
				stats.memo.cha.value += buffs.conviction.cha[my.buffs.conviction.level]
			}
			spMax(true)
			setColor(stats.memo.cha)
		}
		return stats.memo.cha
	}

	let reducedArmor = 1
	function setStat(value) {
		value = round(value)
		return {
			baseValue: value,
			value: value
		}
	}
	function setColor(o) {
		o.color = o.baseValue === o.value ? 'color: style: #fff' :
			o.baseValue < o.value ? 'color: #0f0' : 'color: #f22'
		return o
	}
	function armor(fresh) {
		if (fresh || typeof stats.memo.armor === 'undefined') {
			stats.memo.armor = setStat(((agi().value * .66) +(defense() * 3.3)) + getEqTotal('armor'))
			if (my.buffFlags.zealousResolve) {
				stats.memo.armor.value += buffs.zealousResolve.armor[my.buffs.zealousResolve.level]
			}
			if (my.buffFlags.intrepidShout) {
				stats.memo.armor.value += buffs.intrepidShout.armor[my.buffs.intrepidShout.level]
			}
			if (my.buffFlags.branchSpirit) {
				stats.memo.armor.value += buffs.branchSpirit.armor[my.buffs.branchSpirit.level]
			}
			if (my.buffFlags.lichForm) {
				stats.memo.armor.value += buffs.lichForm.armor[my.buffs.lichForm.level]
			}
			if (my.buffFlags.chromaticSonata) {
				stats.memo.armor.value += buffs.chromaticSonata.armor[my.buffs.chromaticSonata.level]
			}
			reducedArmor = 1
			if (my.buffFlags.decayingDoom) {
				reducedArmor -= buffs.decayingDoom.debuffArmor
			}
			if (my.buffFlags.burningEmbers) {
				reducedArmor -= buffs.burningEmbers.debuffArmor
			}
			if (reducedArmor < .25) reducedArmor = .25
			stats.memo.armor.value = round(stats.memo.armor.value * reducedArmor)
			setColor(stats.memo.armor)
		}
		return stats.memo.armor
	}
	function armorReductionRatio() {
		// max of 75% reduction
		return 1 - ((stats.armor().value > 3000 ? 3000 : stats.armor().value) / 4000)
	}

	function attack(type, fresh) {
		type = type || items.eq[12].weaponSkill
		if (typeof type === 'undefined') {
			type = 'Hand-to-hand'
		}

		if (fresh || typeof stats.memo.attack === 'undefined') {
			stats.memo.attack = setStat(getEqTotal(PROP.ATTACK) + (str().value * .35))
			// console.info('stats.missChance', type, ~~stats.memo.attack)
			// special percentage bonuses - should only affect base (not buffs)
			// buffs
			if (my.buffFlags.spiritOfTheHunter) {
				stats.memo.attack.value += buffs.spiritOfTheHunter.attackBonus[my.buffs.spiritOfTheHunter.level]
			}
			if (my.buffFlags.talismanOfTreachery) {
				stats.memo.attack.value += buffs.talismanOfTreachery.attackBonus[my.buffs.talismanOfTreachery.level]
			}
			setColor(stats.memo.attack)
		}
		// NOTE: parts below are dynamic by type - those parts are never cached
		dynamicAttackBonus = (offense() * 1.66)
		// by weapon type
		if (type === 'One-hand Slash') dynamicAttackBonus += (oneHandSlash() * 2.66)
		else if (type === 'One-hand Blunt') dynamicAttackBonus += (oneHandBlunt() * 2.66)
		else if (type === 'Piercing') dynamicAttackBonus += (piercing() * 2.66)
		else if (type === 'Two-hand Slash') dynamicAttackBonus += (twoHandSlash() * 2.66)
		else if (type === 'Two-hand Blunt') dynamicAttackBonus += (twoHandBlunt() * 2.66)
		else if (type === 'Archery') dynamicAttackBonus += (archery() * 2.66)
		else if (type === 'Hand-to-hand') dynamicAttackBonus += (handToHand() * 2.66)

		let attackBonus = 1
		if (my.buffFlags.branchSpirit) {
			attackBonus += .2
		}

		return {
			baseValue: round(stats.memo.attack.baseValue + dynamicAttackBonus),
			value: round((stats.memo.attack.value + dynamicAttackBonus) * attackBonus),
			color: stats.memo.color
		}
		//else atk += (handToHand() * (my.job === JOB.MONK ? 2.66 : .33))
	}
	function offense(fresh) {
		if (fresh || typeof stats.memo.offense === 'undefined') {
			stats.memo.offense = getStatTotal(PROP.OFFENSE) + getEqTotal(PROP.ALL_SKILLS)
		}
		return stats.memo.offense
	}
	function defense(fresh) {
		if (fresh || typeof stats.memo.defense === 'undefined') {
			stats.memo.defense = getStatTotal(PROP.DEFENSE) + getEqTotal(PROP.ALL_SKILLS)
		}
		return stats.memo.defense
	}
	function oneHandSlash(fresh) {
		if (fresh || typeof stats.memo.oneHandSlash === 'undefined') {
			stats.memo.oneHandSlash = getStatTotal(PROP.ONE_HAND_SLASH) + getEqTotal(PROP.ALL_SKILLS)
		}
		return stats.memo.oneHandSlash
	}
	function oneHandBlunt(fresh) {
		if (fresh || typeof stats.memo.oneHandBlunt === 'undefined') {
			stats.memo.oneHandBlunt = getStatTotal(PROP.ONE_HAND_BLUNT) + getEqTotal(PROP.ALL_SKILLS)
		}
		return stats.memo.oneHandBlunt
	}
	function piercing(fresh) {
		if (fresh || typeof stats.memo.piercing === 'undefined') {
			stats.memo.piercing = getStatTotal(PROP.PIERCING) + getEqTotal(PROP.ALL_SKILLS)
		}
		return stats.memo.piercing
	}
	function twoHandSlash(fresh) {
		if (fresh || typeof stats.memo.twoHandSlash === 'undefined') {
			stats.memo.twoHandSlash = getStatTotal(PROP.TWO_HAND_SLASH) + getEqTotal(PROP.ALL_SKILLS)
		}
		return stats.memo.twoHandSlash
	}
	function twoHandBlunt(fresh) {
		if (fresh || typeof stats.memo.twoHandBlunt === 'undefined') {
			stats.memo.twoHandBlunt = getStatTotal(PROP.TWO_HAND_BLUNT) + getEqTotal(PROP.ALL_SKILLS)
		}
		return stats.memo.twoHandBlunt
	}
	function handToHand(fresh) {
		if (fresh || typeof stats.memo.handToHand === 'undefined') {
			stats.memo.handToHand = getStatTotal(PROP.HAND_TO_HAND) + getEqTotal(PROP.ALL_SKILLS)
		}
		return stats.memo.handToHand
	}
	function archery(fresh) {
		if (fresh || typeof stats.memo.archery === 'undefined') {
			stats.memo.archery = getStatTotal(PROP.ARCHERY) + getEqTotal(PROP.ALL_SKILLS)
			if (my.race === RACE.HALF_ELF) {
				stats.memo.archery += 5
			}
			else if (my.race === RACE.WOOD_ELF) {
				stats.memo.archery += 10
			}
		}
		return stats.memo.archery
	}
	function dualWield(fresh) {
		if (fresh || typeof stats.memo.dualWield === 'undefined') {
			stats.memo.dualWield = getStatTotal(PROP.DUAL_WIELD) + getEqTotal(PROP.ALL_SKILLS)
		}
		return stats.memo.dualWield
	}
	function doubleAttack(fresh) {
		if (fresh || typeof stats.memo.doubleAttack === 'undefined') {
			stats.memo.doubleAttack = getStatTotal(PROP.DOUBLE_ATTACK) + getEqTotal(PROP.ALL_SKILLS)
		}
		return stats.memo.doubleAttack
	}
	function missChance(index, weaponSkill, hitBonus = 0) {
		chance = .2
		// 24 is about how much attack you get per level (21.6?)
		chance += ((mobs[index].level * 24) - stats.attack(weaponSkill).value) / 2400
		if (my.level < mobs[index].level) {
			chance += ((mobs[index].level - my.level) / 40)
		}
		// console.info('stats.missChance before',  chance, hitBonus)
		if (hitBonus !== 0) chance -= (hitBonus / 100)
		if (mobs[index].buffFlags.markOfRemphan) {
			chance -= buffs.markOfRemphan.buffHitBonus[skill.SHD.getHighestMarkOfRemphan(index)]
		}
		if (mobs[index].buffFlags.faerieFlame) {
			chance -= buffs.faerieFlame.buffHitBonus
		}
		// console.info('stats.missChance after', chance)
		// limit check
		if (chance > .5) chance = .5
		else if (chance < .05) chance = .05
		return chance

	}
	function dodge(fresh) {
		if (fresh || typeof stats.memo.dodge === 'undefined') {
			stats.memo.dodge = getStatTotal(PROP.DODGE) + getEqTotal(PROP.ALL_SKILLS)
			if (fresh) stats.dodgeChance(true)
		}
		return stats.memo.dodge
	}
	function parry(fresh) {
		if (fresh || typeof stats.memo.parry === 'undefined') {
			stats.memo.parry = getStatTotal(PROP.PARRY) + getEqTotal(PROP.ALL_SKILLS)
			if (fresh) stats.parryChance(true)
		}
		return stats.memo.parry
	}
	function riposte(fresh) {
		if (fresh || typeof stats.memo.riposte === 'undefined') {
			stats.memo.riposte = getStatTotal(PROP.RIPOSTE) + getEqTotal(PROP.ALL_SKILLS)
			if (fresh) stats.riposteChance(true)
		}
		return stats.memo.riposte
	}
	function dodgeChance(fresh) {
		if (fresh || typeof stats.memo.dodgeChance === 'undefined') {
			stats.memo.dodgeChance = dodge() / 2500 + (agi().value / 2000)
			if (my.buffFlags.fadedStrikeBuff) {
				stats.memo.dodgeChance += (buffs.fadedStrikeBuff.dodgeChance[my.buffs.fadedStrikeBuff.level] * buffs.fadedStrikeBuff.ratioByStack[my.buffs.fadedStrikeBuff.stacks])
			}
			if (stats.memo.dodgeChance > .5) stats.memo.dodgeChance = .5
		}
		return stats.memo.dodgeChance
	}
	function parryChance(fresh) {
		if (fresh || typeof stats.memo.parryChance === 'undefined') {
			stats.memo.parryChance = parry() / 2500 + (dex().value / 2000)
			if (stats.memo.parryChance > .4) stats.memo.parryChance = .4
		}
		return stats.memo.parryChance
	}
	function riposteChance(fresh) {
		if (fresh || typeof stats.memo.riposteChance === 'undefined') {
			stats.memo.riposteChance = riposte() / 2500 + (dex().value / 2000)
			if (stats.memo.riposteChance > .3) stats.memo.riposteChance = .3
		}
		return stats.memo.riposteChance
	}
	function critChance(fresh) {
		if (fresh || typeof stats.memo.crit === 'undefined') {
			stats.memo.crit = ( (dex().value / 75) + ng.dimRetCrit(getEqTotal(PROP.CRIT)) ) / 100
			if (stats.memo.crit < .01) stats.memo.crit = .01
			else if (stats.memo.crit > .5) stats.memo.crit = .5
		}
		return stats.memo.crit
	}
	function addBlood(fresh) {
		if (fresh || typeof stats.memo.addBlood === 'undefined') {
			stats.memo.addBlood = getEqTotal(PROP.ADD_BLOOD)
		}
		return stats.memo.addBlood
	}
	function addPoison(fresh) {
		if (fresh || typeof stats.memo.addPoison === 'undefined') {
			stats.memo.addPoison = getEqTotal(PROP.ADD_POISON)
			if (my.buffFlags.profaneSpirit) {
				stats.memo.addPoison += buffs.profaneSpirit.addPoison[my.buffs.profaneSpirit.level]
			}
			if (my.buffFlags.talismanOfTreachery) {
				stats.memo.addPoison += buffs.talismanOfTreachery.addPoison[my.buffs.talismanOfTreachery.level]
			}
		}
		return stats.memo.addPoison
	}
	function addArcane(fresh) {
		if (fresh || typeof stats.memo.addArcane === 'undefined') {
			stats.memo.addArcane = getEqTotal(PROP.ADD_ARCANE)
		}
		return stats.memo.addArcane
	}
	function addLightning(fresh) {
		if (fresh || typeof stats.memo.addLightning === 'undefined') {
			stats.memo.addLightning = getEqTotal(PROP.ADD_LIGHTNING)
			if (my.buffFlags.phaseBlade) {
				stats.memo.addLightning += buffs.phaseBlade.addLightning[my.buffs.phaseBlade.level]
			}
		}
		return stats.memo.addLightning
	}
	function addFire(fresh) {
		if (fresh || typeof stats.memo.addFire === 'undefined') {
			stats.memo.addFire = getEqTotal(PROP.ADD_FIRE)
			if (my.buffFlags.moltenAegis) {
				stats.memo.addFire += buffs.moltenAegis.addFire[my.buffs.moltenAegis.level]
			}
		}
		return stats.memo.addFire
	}
	function addIce(fresh) {
		if (fresh || typeof stats.memo.addIce === 'undefined') {
			stats.memo.addIce = getEqTotal(PROP.ADD_ICE)
			if (my.race === RACE.BARBARIAN) {
				stats.memo.addIce += 5
			}
		}
		return stats.memo.addIce
	}
	function addSpellBlood(fresh) {
		if (fresh || typeof stats.memo.addSpellBlood === 'undefined') {
			stats.memo.addSpellBlood = getEqTotal(PROP.ADD_SPELL_BLOOD)
		}
		return stats.memo.addSpellBlood
	}
	function addSpellPoison(fresh) {
		if (fresh || typeof stats.memo.addSpellPoison === 'undefined') {
			stats.memo.addSpellPoison = getEqTotal(PROP.ADD_SPELL_POISON)
		}
		return stats.memo.addSpellPoison
	}
	function addSpellArcane(fresh) {
		if (fresh || typeof stats.memo.addSpellArcane === 'undefined') {
			stats.memo.addSpellArcane = getEqTotal(PROP.ADD_SPELL_ARCANE)
		}
		return stats.memo.addSpellArcane
	}
	function addSpellLightning(fresh) {
		if (fresh || typeof stats.memo.addSpellLightning === 'undefined') {
			stats.memo.addSpellLightning = getEqTotal(PROP.ADD_SPELL_LIGHTNING)
			if (my.race === RACE.WOOD_ELF) {
				stats.memo.addSpellLightning += 3
			}
		}
		return stats.memo.addSpellLightning
	}
	function addSpellFire(fresh) {
		if (fresh || typeof stats.memo.addSpellFire === 'undefined') {
			stats.memo.addSpellFire = getEqTotal(PROP.ADD_SPELL_FIRE)
			if (my.race === RACE.WOOD_ELF) {
				stats.memo.addSpellFire += 3
			}
		}
		return stats.memo.addSpellFire
	}
	function addSpellIce(fresh) {
		if (fresh || typeof stats.memo.addSpellIce === 'undefined') {
			stats.memo.addSpellIce = getEqTotal(PROP.ADD_SPELL_ICE)
			if (my.race === RACE.WOOD_ELF) {
				stats.memo.addSpellIce += 3
			}
		}
		return stats.memo.addSpellIce
	}
	function addSpellAll(fresh) {
		if (fresh || typeof stats.memo.addSpellAll === 'undefined') {
			stats.memo.addSpellAll = getEqTotal(PROP.ADD_SPELL_ALL)
			if (my.buffFlags.celestialFrenzy) {
				stats.memo.addSpellAll += buffs.celestialFrenzy.addSpellAll[my.buffs.celestialFrenzy.level]
			}
		}
		return stats.memo.addSpellAll
	}
	function enhanceBlood(fresh) {
		if (fresh || typeof stats.memo.enhanceBlood === 'undefined') {
			stats.memo.enhanceBlood = getEqTotal(PROP.ENHANCE_BLOOD)
		}
		return stats.memo.enhanceBlood
	}
	function enhancePoison(fresh) {
		if (fresh || typeof stats.memo.enhancePoison === 'undefined') {
			stats.memo.enhancePoison = getEqTotal(PROP.ENHANCE_POISON)
		}
		return stats.memo.enhancePoison
	}
	function enhanceArcane(fresh) {
		if (fresh || typeof stats.memo.enhanceArcane === 'undefined') {
			stats.memo.enhanceArcane = getEqTotal(PROP.ENHANCE_ARCANE)
		}
		return stats.memo.enhanceArcane
	}
	function enhanceLightning(fresh) {
		if (fresh || typeof stats.memo.enhanceLightning === 'undefined') {
			stats.memo.enhanceLightning = getEqTotal(PROP.ENHANCE_LIGHTNING)
		}
		return stats.memo.enhanceLightning
	}
	function enhanceFire(fresh) {
		if (fresh || typeof stats.memo.enhanceFire === 'undefined') {
			stats.memo.enhanceFire = getEqTotal(PROP.ENHANCE_FIRE)
		}
		return stats.memo.enhanceFire
	}
	function enhanceIce(fresh) {
		if (fresh || typeof stats.memo.enhanceIce === 'undefined') {
			stats.memo.enhanceIce = getEqTotal(PROP.ENHANCE_ICE)
		}
		return stats.memo.enhanceIce
	}
	function enhanceAll(fresh) {
		if (fresh || typeof stats.memo.enhanceAll === 'undefined') {
			stats.memo.enhanceAll = getEqTotal(PROP.ENHANCE_ALL)
		}
		return stats.memo.enhanceAll
	}
	let critBuffBonus = 0
	function critFromBuffBonus(index) {
		critBuffBonus = 0
		if (mob.isAlive(index) &&
			mobs[index].buffFlags.markOfRemphan) {
			critBuffBonus += buffs.markOfRemphan.buffCritBonus[skill.SHD.getHighestMarkOfRemphan(index)]
		}
		return critBuffBonus
	}
	function getWeaponSkill(slot) {
		return my.isPunching(slot)
			? LABEL.HAND_TO_HAND
			: items.eq[slot].weaponSkill
	}

	/**
	 * Spell damage processing
	 * @param index
	 * @param critMod
	 * @param config
	 * @returns {{damage: number, min: number, max: number, isCrit: (*|boolean)}}
	 */
	function spellDamage(index = 0, critMod = 0, config, isRankUp = false) {
		if (!config) config = { ...spell.data }
		let spellRank = isRankUp ?
			Math.min(MAX_SKILL_LEVEL, my.skills[config.index] + 1) :
			my.skills[config.index]
		// console.info('spellRank', isRankUp, spellRank)
		let min
		let max = config.spellDamage(spellRank)
		// enhance by type % and ALL%
		let enhanceDamage = 0
		let addedDamage = 0

		if (config.damageType === DAMAGE_TYPE.BLOOD) enhanceDamage = enhanceBlood()
		else if (config.damageType === DAMAGE_TYPE.POISON) enhanceDamage = enhancePoison()
		else if (config.damageType === DAMAGE_TYPE.ARCANE) enhanceDamage = enhanceArcane()
		else if (config.damageType === DAMAGE_TYPE.LIGHTNING) enhanceDamage = enhanceLightning()
		else if (config.damageType === DAMAGE_TYPE.FIRE) enhanceDamage = enhanceFire()
		else if (config.damageType === DAMAGE_TYPE.ICE) enhanceDamage = enhanceIce()
		enhanceDamage += enhanceAll()

		// wis boosts conjuration
		if (my[config.spellType] === PROP.CONJURATION) enhanceDamage += (stats.wis().value / 15)
		else if (my[config.spellType] === PROP.EVOCATION) enhanceDamage += (stats.intel().value / 15)
		else if (my[config.spellType] === PROP.ALTERATION) enhanceDamage += (stats.cha().value / 15)

		if (my.buffFlags.lichForm) {
			if (config.damageType === DAMAGE_TYPE.POISON || config.damageType === DAMAGE_TYPE.BLOOD) {
				enhanceDamage = buffs.lichForm.enhancePnB[my.buffs.lichForm.level]
				// console.info('lichForm', buffs.lichForm.enhancePnB[my.buffs.lichForm.level])
			}
		}

		max = max * (1 + (enhanceDamage / 100))
		// add spell damage by type and ALL
		if (config.damageType === DAMAGE_TYPE.BLOOD) addedDamage = addSpellBlood()
		else if (config.damageType === DAMAGE_TYPE.POISON) addedDamage = addSpellPoison()
		else if (config.damageType === DAMAGE_TYPE.ARCANE) addedDamage = addSpellArcane()
		else if (config.damageType === DAMAGE_TYPE.LIGHTNING) addedDamage = addSpellLightning()
		else if (config.damageType === DAMAGE_TYPE.FIRE) addedDamage = addSpellFire()
		else if (config.damageType === DAMAGE_TYPE.ICE) addedDamage = addSpellIce()
		addedDamage += addSpellAll()

		if (my.buffFlags.mirrorImage && !config.isTooltip) {
			addedDamage += my.buffs.mirrorImage.damage
		}

		max += addedDamage
		min = max * config.spellVariance
		// console.info('spellDamage 2', min, max)
		// crit?
		let isCrit = mob.isAlive(index) && ((critMod / 100) + critFromBuffBonus(index) + stats.critChance()) > rand()

		if (isCrit) {
			min *= 1.5
			max *= 1.5
		}
		if (my.isFeared()) {
			// DoTs were already calculated
			min *= .5
			max *= .5
		}

		if (min < 1) min = 1
		if (max < 1) max = 1

		return {
			min: ~~min,
			max: ~~max,
			damage: _.random(min, max),
			isCrit: isCrit,
		}
	}

	/**
	 * Melee damage processing
	 * @param index
	 * @param critMod
	 * @param skipSkillChecks
	 * @returns {{damage: number, weaponSkill: (string), min: number, max: number, isCrit: (*|boolean), enhancedDamage: number, damageType: string}}
	 */
	function skillDamage(index = 0, critMod = 0, skipSkillChecks = false) {
		// normalized damage for skills
		min = 1
		max = 1
		weaponSkill = typeof items.eq[12] === 'object' && items.eq[12].name ?
			items.eq[12].weaponSkill : LABEL.HAND_TO_HAND
		atk = attack(weaponSkill).value
		 // get normalized DPS value for min/max
		if (weaponSkill !== LABEL.HAND_TO_HAND) {
			dps = tooltip.getDps(items.eq[12])
			if (item.twoHandWeaponTypes.includes(items.eq[12].itemType)) {
				max = dps * 1.5
				min = max * .8
			}
			else {
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

		isCrit = mob.isAlive(index) && ((critMod / 100) + critFromBuffBonus(index) + stats.critChance()) > rand()
		// console.info('critChance', ((critMod / 100) + critFromBuffBonus(index) + stats.critChance()))

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
		if (my.isFeared()) {
			// DoTs were already calculated
			min *= .5
			max *= .5
		}

		if (!skipSkillChecks) {
			combat.levelSkillCheck(weaponSkill)
		}
		// console.warn('min max', min, max)
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

	/**
	 * Primary auto attack damage processing
	 * @param index
	 * @param skipSkillCheck
	 * @returns {{damage: number, weaponSkill: string, min: number, max: number, isCrit: boolean, enhancedDamage: number, damageType: string}}
	 */
	function primaryAutoAttackDamage(index = 0, skipSkillCheck = false) {
		min = 1
		max = 1
		weaponSkill = getWeaponSkill(12)
		atk = attack(weaponSkill).value
		if (weaponSkill === LABEL.HAND_TO_HAND) {
			if (my.job === JOB.MONK) {
				max = 4 + (handToHand() / 2) // 125
				min = 1 + (handToHand() / 8) // 31.25 about 26 dps at 250
			}
			else {
				min = 1 + (handToHand() / 16)
				max = 2 + (handToHand() / 9)
			}
		}
		else {
			min = items.eq[12].minDamage
			max = items.eq[12].maxDamage
		}
		min = min * (1 + (atk * .002))
		max = max * (1 + (atk * .002))

		isCrit = (critFromBuffBonus(index) + stats.critChance()) > rand()

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
		if (my.isFeared()) {
			// DoTs were already calculated
			min *= .5
			max *= .5
		}

		if (!skipSkillCheck) {
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

	/**
	 * Secondary auto attack damage processing
	 * @param index
	 * @param skipSkillCheck
	 * @returns {{damage: number, weaponSkill: string, min: number, max: number, isCrit: boolean, enhancedDamage: number, damageType: string}|{damage: number, min: number, max: number, isCrit: boolean, damageType: string}}
	 */
	function secondaryAutoAttackDamage(index = 0, skipSkillCheck = false) {
		if (!my.dualWield) return FailedWeaponDamage
		min = 1
		max = 1
		weaponSkill = getWeaponSkill(13)
		atk = attack(weaponSkill).value
		if (weaponSkill === LABEL.HAND_TO_HAND) {
			if (my.job === JOB.MONK) {
				max = 4 + (handToHand() / 2) // 125
				min = 1 + (handToHand() / 8) // 31.25 about 26 dps at 250
			}
			else {
				min = 1 + (handToHand() / 16)
				max = 2 + (handToHand() / 9)
			}
		}
		else {
			min = items.eq[13].minDamage
			max = items.eq[13].maxDamage
		}
		min = min * (1 + (atk * .002))
		max = max * (1 + (atk * .002))

		isCrit = (critFromBuffBonus(index) + stats.critChance()) > rand()
		if (isCrit) {
			min *= 1.5
			max *= 1.5
		}
		if (my.isFeared()) {
			// DoTs were already calculated
			min *= .5
			max *= .5
		}

		if (!skipSkillCheck) {
			combat.levelSkillCheck(weaponSkill)
			combat.levelSkillCheck(PROP.DUAL_WIELD)
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

	/**
	 * Ranged attack damage processing
	 * @param index
	 * @param critMod
	 * @param skipSkillCheck
	 * @returns {{damage: number, weaponSkill: string, min: number, max: number, isCrit: (*|boolean), isPiercing: boolean, enhancedDamage: number, damageType: string, isRanged: boolean}|{damage: number, weaponSkill: string, min: number, max: number, isCrit: boolean, damageType: string}}
	 */
	function rangedDamage(index = 0, critMod = 0, skipSkillCheck = false) {
		min = 1
		max = 1
		atk = attack('Archery').value
		if (!my.archery || items.eq[14].itemType !== ITEM_TYPE.BOWS) {
			if (my.job === JOB.RANGER) {
				min = 1 + ~~(my.level * .1)
				max = 2 + ~~(my.level * .5)
				dps = tooltip.getDps({
					minDamage: min,
					maxDamage: max,
					speed: 4
				})
			}
			else {
				return failedRangeDamage
			}
		}
		else {
			dps = tooltip.getDps(items.eq[14])
		}

		max = dps * 1.5
		min = max * .8

		min = min * (1 + (atk * .002))
		max = max * (1 + (atk * .002))

		isCrit = mob.isAlive(index) && ((critMod / 100) + critFromBuffBonus(index) + stats.critChance()) > rand()
		if (isCrit) {
			min *= 2
			max *= 2
		}
		if (my.isFeared()) {
			// DoTs were already calculated
			min *= .5
			max *= .5
		}

		if (!skipSkillCheck) combat.levelSkillCheck('Archery')
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

	function getResistPercent(type, getUiValue = false) {
		resistPercent = 1
		if (type === DAMAGE_TYPE.BLOOD) resistPercent = 1 - (resistBlood() / RESIST_CAP)
		else if (type === DAMAGE_TYPE.POISON) resistPercent = 1 - (resistPoison() / RESIST_CAP)
		else if (type === DAMAGE_TYPE.ARCANE) resistPercent = 1 - (resistArcane() / RESIST_CAP)
		else if (type === DAMAGE_TYPE.LIGHTNING) resistPercent = 1 - (resistLightning() / RESIST_CAP)
		else if (type === DAMAGE_TYPE.FIRE) resistPercent = 1 - (resistFire() / RESIST_CAP)
		else if (type === DAMAGE_TYPE.ICE) resistPercent = 1 - (resistIce() / RESIST_CAP)
		if (resistPercent < .25) resistPercent = .25
		if (getUiValue) {
			resistPercent = round((1 - resistPercent) * 100)
		}
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
		if (my.buffFlags.consecrateBuff) {
			value += ((my.buffs.consecrateBuff.stacks * my.buffs.consecrateBuff.level) * buffs.consecrateBuff.resistPerStack)
		}
		if (my.buffFlags.spiritBarrier) {
			value += buffs.spiritBarrier.resistAll[my.buffs.spiritBarrier.level]
		}
		if (my.buffFlags.fadedStrikeBuff) {
			value += ~~(buffs.fadedStrikeBuff.resistAll[my.buffs.fadedStrikeBuff.level] * buffs.fadedStrikeBuff.ratioByStack[my.buffs.fadedStrikeBuff.stacks])
		}
		return value
	}
	function resistBlood(fresh) {
		if (fresh || typeof stats.memo.resistBlood === 'undefined') {
			stats.memo.resistBlood = getStatTotal(PROP.RESIST_BLOOD) + getEqTotal(PROP.RESIST_ALL) + resistAll()
			if (my.buffFlags.sealOfRedemption) {
				stats.memo.resistBlood += buffs.sealOfRedemption.resistBlood[my.buffs.sealOfRedemption.level]
			}

			stats.memo.resistBlood = round(stats.memo.resistBlood)
			if (stats.memo.resistBlood > 75) stats.memo.resistBlood = 75
		}
		return stats.memo.resistBlood
	}
	function resistPoison(fresh) {
		if (fresh || typeof stats.memo.resistPoison === 'undefined') {
			stats.memo.resistPoison = getStatTotal(PROP.RESIST_POISON) + getEqTotal(PROP.RESIST_ALL) + resistAll()
			if (my.buffFlags.profaneSpirit) {
				stats.memo.resistPoison += buffs.profaneSpirit.resistPoison[my.buffs.profaneSpirit.level]
			}

			stats.memo.resistPoison = round(stats.memo.resistPoison)
			if (stats.memo.resistPoison > 75) stats.memo.resistPoison = 75
		}
		return stats.memo.resistPoison
	}
	function resistArcane(fresh) {
		if (fresh || typeof stats.memo.resistArcane === 'undefined') {
			stats.memo.resistArcane = getStatTotal(PROP.RESIST_ARCANE) + getEqTotal(PROP.RESIST_ALL) + resistAll()
			stats.memo.resistArcane = round(stats.memo.resistArcane)
			if (stats.memo.resistArcane > 75) stats.memo.resistArcane = 75
		}
		return stats.memo.resistArcane
	}
	function resistLightning(fresh) {
		if (fresh || typeof stats.memo.resistLightning === 'undefined') {
			stats.memo.resistLightning = getStatTotal(PROP.RESIST_LIGHTNING) + getEqTotal(PROP.RESIST_ALL) + resistAll()
			if (my.buffFlags.phaseBlade) {
				stats.memo.resistLightning += buffs.phaseBlade.resistLightning[my.buffs.phaseBlade.level]
			}

			stats.memo.resistLightning = round(stats.memo.resistLightning)
			if (stats.memo.resistLightning > 75) stats.memo.resistLightning = 75
		}
		return stats.memo.resistLightning
	}
	function resistFire(fresh) {
		if (fresh || typeof stats.memo.resistFire === 'undefined') {
			stats.memo.resistFire = getStatTotal(PROP.RESIST_FIRE) + getEqTotal(PROP.RESIST_ALL) + resistAll()
			if (my.buffFlags.moltenAegis) {
				stats.memo.resistFire += buffs.moltenAegis.resistFire[my.buffs.moltenAegis.level]
			}

			stats.memo.resistFire = round(stats.memo.resistFire)
			if (stats.memo.resistFire > 75) stats.memo.resistFire = 75
		}
		return stats.memo.resistFire
	}
	function resistIce(fresh) {
		if (fresh || typeof stats.memo.resistIce === 'undefined') {
			stats.memo.resistIce = getStatTotal(PROP.RESIST_ICE) + getEqTotal(PROP.RESIST_ALL) + resistAll()
			if (my.buffFlags.borealTalisman) {
				stats.memo.resistIce += buffs.borealTalisman.resistIce[my.buffs.borealTalisman.level]
			}

			stats.memo.resistIce = round(stats.memo.resistIce)
			if (stats.memo.resistIce > 75) stats.memo.resistIce = 75
		}
		return stats.memo.resistIce
	}
	function resistPhysical(fresh) {
		if (fresh || typeof stats.memo.resistPhysical === 'undefined') {
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
		if (fresh || typeof stats.memo.offenseMax === 'undefined') {
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
		if (fresh || typeof stats.memo.defenseMax === 'undefined') {
			base = my.race === RACE.DWARF ? 5 : 0
			if (defensiveJobs.includes(my.job)) stats.memo.defenseMax = base + my.level * 5
			else if (intCasterJobs.includes(my.job)) stats.memo.defenseMax = base + my.level * 3
			else stats.memo.defenseMax = base + my.level * 4
		}
		return stats.memo.defenseMax
	}
	function oneHandSlashMax(fresh) {
		if (fresh || typeof stats.memo.oneHandSlashMax === 'undefined') {
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
		if (fresh || typeof stats.memo.oneHandBluntMax === 'undefined') {
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
		if (fresh || typeof stats.memo.piercingMax === 'undefined') {
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
		if (fresh || typeof stats.memo.archeryMax === 'undefined') {
			base = my.race === RACE.HALF_ELF ? 5 : 0
			if (my.job === JOB.RANGER) stats.memo.archeryMax = base + my.level * 5
			else if (averageArcherJobs.includes(my.job)) stats.memo.archeryMax = base + my.level * 2
			else stats.memo.archeryMax = 0
		}
		return stats.memo.archeryMax
	}
	function handToHandMax(fresh) {
		if (fresh || typeof stats.memo.handToHandMax === 'undefined') {
			base = my.race === RACE.HALF_ELF ? 5 : 0
			if (my.job === JOB.MONK) stats.memo.handToHandMax = base + my.level * 5
			else if (averagePunchJobs.includes(my.job)) stats.memo.handToHandMax = base + my.level * 2
			else stats.memo.handToHandMax = my.level
		}
		return stats.memo.handToHandMax
	}
	function twoHandSlashMax(fresh) {
		if (fresh || typeof stats.memo.twoHandSlashMax === 'undefined') {
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
		if (fresh || typeof stats.memo.twoHandBluntMax === 'undefined') {
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
		if (fresh || typeof stats.memo.dualWieldMax === 'undefined') {
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
		if (fresh || typeof stats.memo.doubleAttackMax === 'undefined') {
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
		if (fresh || typeof stats.memo.dodgeMax === 'undefined') {
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
		if (fresh || typeof stats.memo.parryMax === 'undefined') {
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
		if (fresh || typeof stats.memo.riposteMax === 'undefined') {
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
		if (fresh || typeof stats.memo.alterationMax === 'undefined') {
			base = (my.race === RACE.DWARF || my.race === RACE.SERAPH) ? 5 : 0
			if (allCasterJobs.includes(my.job)) stats.memo.alterationMax = base + my.level * 5
			else if (HybridJobs.includes(my.job)) stats.memo.alterationMax = base + my.level * 5
			else stats.memo.alterationMax = 0
		}
		return stats.memo.alterationMax
	}
	function evocationMax(fresh) {
		if (fresh || typeof stats.memo.evocationMax === 'undefined') {
			if (my.race === RACE.HIGH_ELF) base = 10
			else if (my.race === RACE.SERAPH) base = 5
			else base = 0
			if (allCasterJobs.includes(my.job)) stats.memo.evocationMax = base + my.level * 5
			else if (HybridJobs.includes(my.job)) stats.memo.evocationMax = base + my.level * 5
			else stats.memo.evocationMax = 0
		}
		return stats.memo.evocationMax
	}
	function conjurationMax(fresh) {
		if (fresh || typeof stats.memo.conjurationMax === 'undefined') {
			if (my.race === RACE.TROLL) base = 10
			else if (my.race === RACE.SERAPH) base = 5
			else base = 0
			if (allCasterJobs.includes(my.job)) stats.memo.conjurationMax = base + my.level * 5
			else if (HybridJobs.includes(my.job)) stats.memo.conjurationMax = base + my.level * 5
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
		if (fresh || typeof stats.memo.hpMax === 'undefined') {
			baseResource = hpBase + (
				stats.sta().value * hpTier[my.job]) * (my.level / 50) +
				(my.level * (hpTier[my.job] * 2.5)
			)
			stats.memo.hpMax = ~~(baseResource * hpPercentBonus() + getEqTotal(PROP.HP))
			if (my.buffFlags.sealOfRedemption) {
				stats.memo.hpMax += buffs.sealOfRedemption.hpMax[my.buffs.sealOfRedemption.level]
			}
			if (my.buffFlags.zealousResolve) {
				stats.memo.hpMax += buffs.zealousResolve.hpMax[my.buffs.zealousResolve.level]
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
		if (fresh || typeof stats.memo.mpMax === 'undefined') {
			baseResource = mpBase + (
				(stats.intel().value * mpTier[my.job]) * (my.level / 50) +
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
		if (fresh || typeof stats.memo.spMax === 'undefined') {
			baseResource = (spBase +
				(
					(
						(stats.wis().value * spTier[my.job] * .5) +
						(stats.cha().value * spTier[my.job] * .5)
					) * (my.level / 50) +
					(my.level * (spTier[my.job] * 2.5))
				)
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
		if (fresh || typeof stats.memo.baseHpRegen === 'undefined') {
			if (my.race === RACE.TROLL) {
				stats.memo.baseHpRegen = 4 + (my.level * .12)
			}
			else {
				stats.memo.baseHpRegen = 2 + (my.level * .08)
			}
		}
		return stats.memo.baseHpRegen
	}
	// high elf 16, normal 10
	function baseMpRegen(fresh) {
		if (fresh || typeof stats.memo.baseMpRegen === 'undefined') {
			if (my.race === RACE.HIGH_ELF) {
				stats.memo.baseMpRegen = (4 + (my.level * .24))
			}
			else {
				stats.memo.baseMpRegen = (2 + (my.level * .16))
			}
		}
		return stats.memo.baseMpRegen
	}
	// human 16, normal 10
	function baseSpRegen(fresh) {
		if (fresh || typeof stats.memo.baseSpRegen === 'undefined') {
			if (my.race === RACE.HUMAN) {
				stats.memo.baseSpRegen = (4 + (my.level * .24))
			}
			else {
				stats.memo.baseSpRegen = (2 + (my.level * .16))
			}
		}
		return stats.memo.baseSpRegen
	}
	function hpRegen(fresh) {
		if (fresh || typeof stats.memo.hpRegen === 'undefined') {
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
		if (fresh || typeof stats.memo.mpRegen === 'undefined') {
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
		if (fresh || typeof stats.memo.spRegen === 'undefined') {
			stats.memo.spRegen = ~~(baseSpRegen() + getEqTotal(PROP.SP_REGEN))
			if (my.buffFlags.conviction) {
				stats.memo.spRegen += buffs.conviction.spRegen[my.buffs.conviction.level]
			}
		}
		return stats.memo.spRegen
	}
	function ignoreTargetArmor(fresh) {
		if (fresh || typeof stats.memo.ignoreTargetArmor === 'undefined') {
			stats.memo.ignoreTargetArmor = items.eq.some(eq => eq.ignoreTargetArmor)
		}
		return stats.memo.ignoreTargetArmor
	}
	function reduceTargetArmor(fresh) {
		if (fresh || typeof stats.memo.reduceTargetArmor === 'undefined') {
			stats.memo.reduceTargetArmor = items.eq.some(eq => eq.reduceTargetArmor)
		}
		return stats.memo.reduceTargetArmor
	}
	function enhancedDamageToHumanoids(fresh) {
		if (fresh || typeof stats.memo.enhancedDamageToHumanoids === 'undefined') {
			stats.memo.enhancedDamageToHumanoids = getEqTotal(PROP.ENHANCED_DAMAGE_TO_HUMANOIDS) / 100
		}
		return stats.memo.enhancedDamageToHumanoids
	}
	function enhancedDamageToBeasts(fresh) {
		if (fresh || typeof stats.memo.enhancedDamageToBeasts === 'undefined') {
			stats.memo.enhancedDamageToBeasts = getEqTotal(PROP.ENHANCED_DAMAGE_TO_BEASTS) / 100
		}
		return stats.memo.enhancedDamageToBeasts
	}
	function enhancedDamageToUndead(fresh) {
		if (fresh || typeof stats.memo.enhancedDamageToUndead === 'undefined') {
			stats.memo.enhancedDamageToUndead = getEqTotal(PROP.ENHANCED_DAMAGE_TO_UNDEAD) / 100
		}
		return stats.memo.enhancedDamageToUndead
	}
	function enhancedDamageToDemons(fresh) {
		if (fresh || typeof stats.memo.enhancedDamageToDemons === 'undefined') {
			stats.memo.enhancedDamageToDemons = getEqTotal(PROP.ENHANCED_DAMAGE_TO_DEMONS) / 100
		}
		return stats.memo.enhancedDamageToDemons
	}
	function enhancedDamageToDragonkin(fresh) {
		if (fresh || typeof stats.memo.enhancedDamageToDragonkin === 'undefined') {
			stats.memo.enhancedDamageToDragonkin = getEqTotal(PROP.ENHANCED_DAMAGE_TO_DRAGONKIN) / 100
		}
		return stats.memo.enhancedDamageToDragonkin
	}
	function enhancedDamageToMystical(fresh) {
		if (fresh || typeof stats.memo.enhancedDamageToMystical === 'undefined') {
			stats.memo.enhancedDamageToMystical = getEqTotal(PROP.ENHANCED_DAMAGE_TO_MYSTICAL) / 100
		}
		return stats.memo.enhancedDamageToMystical
	}
	function enhancedDamageToGiants(fresh) {
		if (fresh || typeof stats.memo.enhancedDamageToGiants === 'undefined') {
			stats.memo.enhancedDamageToGiants = getEqTotal(PROP.ENHANCED_DAMAGE_TO_GIANTS) / 100
		}
		return stats.memo.enhancedDamageToGiants
	}
	function phyMit(fresh) {
		if (fresh || typeof stats.memo.phyMit === 'undefined') {
			stats.memo.phyMit = getEqTotal(PROP.PHY_MIT)
			if (my.buffFlags.bulwark) {
				stats.memo.phyMit += buffs.bulwark.mitigation[my.buffs.bulwark.level]
			}
		}
		return stats.memo.phyMit
	}
	function magMit(fresh) {
		if (fresh || typeof stats.memo.magMit === 'undefined') {
			stats.memo.magMit = getEqTotal(PROP.MAG_MIT)
			if (my.buffFlags.bulwark) {
				stats.memo.magMit += buffs.bulwark.mitigation[my.buffs.bulwark.level]
			}
		}
		return stats.memo.magMit
	}
	function leech(fresh) {
		if (fresh || typeof stats.memo.leech === 'undefined') {
			stats.memo.leech = getEqTotal(PROP.LEECH)
			if (my.race === RACE.DARK_ELF) {
				stats.memo.leech += 5
			}
			if (my.buffFlags.vampiricAllure) {
				stats.memo.leech += buffs.vampiricAllure.leech[my.buffs.vampiricAllure.level]
			}
		}
		return stats.memo.leech
	}
	function wraith(fresh) {
		if (fresh || typeof stats.memo.wraith === 'undefined') {
			stats.memo.wraith = getEqTotal(PROP.WRAITH)
			if (my.buffFlags.vampiricAllure) {
				stats.memo.wraith += buffs.vampiricAllure.leech[my.buffs.vampiricAllure.level]
			}
		}
		return stats.memo.wraith
	}
	function damageTakenToMana(fresh) {
		if (fresh || typeof stats.memo.damageTakenToMana === 'undefined') {
			stats.memo.damageTakenToMana = getEqTotal(PROP.DAMAGE_TAKEN_TO_MANA)
			if (stats.memo.damageTakenToMana > 50) stats.memo.damageTakenToMana = 50
		}
		return stats.memo.damageTakenToMana
	}
	function damageTakenToSpirit(fresh) {
		if (fresh || typeof stats.memo.damageTakenToSpirit === 'undefined') {
			stats.memo.damageTakenToSpirit = getEqTotal(PROP.DAMAGE_TAKEN_TO_SPIRIT)
			if (stats.memo.damageTakenToSpirit > 50) stats.memo.damageTakenToSpirit = 50
		}
		return stats.memo.damageTakenToSpirit
	}
	function hpKill(fresh) {
		if (fresh || typeof stats.memo.hpKill === 'undefined') {
			stats.memo.hpKill = getEqTotal(PROP.HP_KILL)
			if (my.buffFlags.sanguineHarvest) {
				stats.memo.hpKill += buffs.sanguineHarvest.hpKill[my.buffs.sanguineHarvest.level]
			}
		}
		return stats.memo.hpKill
	}
	function mpKill(fresh) {
		if (fresh || typeof stats.memo.mpKill === 'undefined') {
			stats.memo.mpKill = getEqTotal(PROP.MP_KILL)
		}
		return stats.memo.mpKill
	}
	function spKill(fresh) {
		if (fresh || typeof stats.memo.spKill === 'undefined') {
			stats.memo.spKill = getEqTotal(PROP.SP_KILL)
		}
		return stats.memo.spKill
	}
	function resistParalyze(fresh) {
		// cannot change targets or use melee skills? (auto attack works)
		if (fresh || typeof stats.memo.resistParalyze === 'undefined') {
			stats.memo.resistParalyze = getEqTotal(PROP.RESIST_PARALYZE)
			if (stats.memo.resistParalyze > 50) {
				stats.memo.resistParalyze = 50
			}
		}
		return stats.memo.resistParalyze
	}
	function resistFear(fresh) {
		// all skill/spell damage output halved
		if (fresh || typeof stats.memo.resistFear === 'undefined') {
			stats.memo.resistFear = getEqTotal(PROP.RESIST_FEAR)
			if (my.buffFlags.intrepidShout) {
				stats.memo.resistFear += buffs.intrepidShout.resistFear[my.buffs.intrepidShout.level]
			}
			if (my.buffFlags.prowl) {
				stats.memo.resistFear += buffs.prowl.resistFear[my.buffs.prowl.level]
			}
			if (my.buffFlags.guardianAngel) {
				stats.memo.resistFear += buffs.guardianAngel.resistFear
			}
			if (my.race === RACE.HUMAN) {
				stats.memo.resistFear += 15
			}
			if (stats.memo.resistFear > 50) {
				stats.memo.resistFear = 50
			}
		}
		return stats.memo.resistFear
	}
	function resistStun(fresh) {
		// can't do anything
		if (fresh || typeof stats.memo.resistStun === 'undefined') {
			stats.memo.resistStun = getEqTotal(PROP.RESIST_STUN)
			if (my.race === RACE.ORC) {
				stats.memo.resistStun += 15
			}
			if (stats.memo.resistStun > 50) {
				stats.memo.resistStun = 50
			}
		}
		return stats.memo.resistStun
	}
	function resistSilence(fresh) {
		// cannot cast spells
		if (fresh || typeof stats.memo.resistSilence === 'undefined') {
			stats.memo.resistSilence = getEqTotal(PROP.RESIST_SILENCE)
			if (my.buffFlags.manaShell) {
				stats.memo.resistSilence += buffs.manaShell.silence[my.buffs.manaShell.level]
			}
			if (my.race === RACE.GNOME) {
				stats.memo.resistSilence += 15
			}
			if (stats.memo.resistSilence > 50) {
				stats.memo.resistSilence = 50
			}
		}
		return stats.memo.resistSilence
	}

	/**
	 * Auto attack speed
	 * @param slot
	 * @returns {number}
	 */
	function getAttackSpeed(slot) {
		// weapon or punch speed?
		speed = my.isPunching(slot)
			? button.autoAttackSpeed
			: items.eq[slot].speed
		speedHaste = 1
		// buffs
		if (my.buffFlags.spiritOfTheHunter) speedHaste -= buffs.spiritOfTheHunter.attackHaste
		if (my.buffFlags.battleHymn) speedHaste -= buffs.battleHymn.attackHaste
		if (my.buffFlags.risingFurorBuff) {
			speedHaste -= buffs.risingFurorBuff.attackHaste[my.buffs.risingFurorBuff.stacks]
		}
		// debuffs
		if (my.buffFlags.prowl) speedHaste += buffs.prowl.attackHaste
		if (my.isChilled()) speedHaste += .5
		// limit
		if (speedHaste < .25) speedHaste = .25
		else if (speedHaste > 2) speedHaste = 2
		// console.info('attackSpeed', speedHaste)
		return speed * speedHaste
	}

	/**
	 * GCD speed
	 * @returns {number}
	 */
	function getSkillSpeed() {
		skillHaste = 1
		if (my.buffFlags.frenzy) skillHaste -= buffs.frenzy.skillHaste[my.buffs.frenzy.level]
		if (my.buffFlags.augmentation) skillHaste -= buffs.augmentation.skillHaste[my.buffs.augmentation.level]
		if (my.buffFlags.hyperStrike) skillHaste -= buffs.hyperStrike.skillHaste[my.buffs.hyperStrike.stacks]
		// debuffs
		if (my.isChilled()) skillHaste += .5
		// console.info('getSkillSpeed', skillHaste)
		if (skillHaste < .5) skillHaste = .5
		else if (skillHaste > 2) skillHaste = 2
		return skillHaste
	}

	/**
	 * casting haste speed
	 * @returns {number}
	 */
	function getCastingSpeed() {
		castHaste = 1
		// console.info('getCastingSpeed', castHaste)
		if (my.buffFlags.celestialFrenzy) castHaste -= buffs.celestialFrenzy.castingHaste
		if (my.buffFlags.melodyOfMana) castHaste -= buffs.melodyOfMana.castingHaste
		if (castHaste < .5) castHaste = .5
		else if (castHaste > 2) castHaste = 2
		// console.info('getCastingSpeed', spell.castTime * castHaste)
		// if (!Config.enableFastCast) spell.castTime = 1
		// console.info('getCastingSpeed', castHaste)
		return spell.castTime * castHaste
	}

	function clearCache() {
		stats.memo = {}
	}
})($, TweenMax, _);