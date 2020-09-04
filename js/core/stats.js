var stats = {};
(function($, TweenMax, _, undefined) {
	stats = {
		cache: {},
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
		someIgnoreTargetArmor,
		someReduceTargetArmor,
		enhanceDamageToMobType,
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
	}
	// jobs grouped by things for include checks
	var offensiveJobs = [JOB.SHADOW_KNIGHT, JOB.MONK, JOB.ROGUE, 'RNG']
	var defensiveJobs = [JOB.WARRIOR, JOB.CRUSADER, JOB.SHADOW_KNIGHT]
	var averagePunchJobs = [JOB.WARRIOR, JOB.CRUSADER, JOB.SHADOW_KNIGHT, JOB.ROGUE, 'RNG', JOB.BARD]
	var wisCasterJobs = [JOB.DRUID, JOB.CLERIC, JOB.SHAMAN]
	var intCasterJobs = [JOB.WARLOCK, JOB.ENCHANTER, JOB.TEMPLAR, JOB.WIZARD]
	var allCasterJobs = [JOB.CLERIC, JOB.DRUID, JOB.SHAMAN, JOB.BARD, JOB.WARLOCK, JOB.ENCHANTER, JOB.TEMPLAR, JOB.WIZARD]
	var hybridJobs = [JOB.CRUSADER, JOB.SHADOW_KNIGHT, 'RNG']
	var twoHandBluntAverageJobs = [JOB.WARRIOR, JOB.CRUSADER, JOB.SHADOW_KNIGHT, JOB.CLERIC, JOB.DRUID, JOB.SHAMAN, JOB.WARLOCK, JOB.ENCHANTER, JOB.TEMPLAR, JOB.WIZARD]
	var tankJobs = [JOB.WARRIOR, JOB.CRUSADER, JOB.SHADOW_KNIGHT]
	var averageArcherJobs = [JOB.WARRIOR, JOB.CRUSADER, JOB.SHADOW_KNIGHT, JOB.ROGUE, JOB.BARD]
	var averagePiercingJobs = [JOB.WARRIOR, JOB.BARD, JOB.SHAMAN, JOB.WARLOCK, JOB.ENCHANTER, JOB.TEMPLAR, JOB.WIZARD]
	var averageOneHandSlashJobs = [JOB.WARRIOR, JOB.CRUSADER, JOB.SHADOW_KNIGHT, JOB.BARD, JOB.DRUID]
	let isCrit = false
	let chance, weaponSkill, enhanceDamage, addedDamage
	let resistPercent
	let vulpineMp = 0
	let vulpineSp = 0
	let resistStatusVal = 0
	let value = 0
	var val, base, i, len, type, min, max, totalAttack, h2h, atk, stat, dps

	const failedWeaponDamage = {
		min: 0,
		max: 0,
		damage: 0,
		damageType: 'physical',
		isCrit: false
	}
	const failedRangeDamage = {
		min: 0,
		max: 0,
		damage: 0,
		weaponSkill: 'Archery',
		damageType: 'physical',
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
		if (fresh || typeof stats.cache.str === 'undefined') {
			stats.cache.str = my.str + create.raceAttrs[my.race][0] + create.jobAttrs[my.jobLong][0] + getEqTotal('str') + getEqTotal('allStats')
			if (my.buffFlags.borealTalisman) {
				stats.cache.str += buffs.borealTalisman.str[my.buffs.borealTalisman.level]
			}
		}
		return stats.cache.str
	}
	function sta(fresh) {
		if (fresh || typeof stats.cache.sta === 'undefined') {
			stats.cache.sta = my.sta + create.raceAttrs[my.race][1] + create.jobAttrs[my.jobLong][1] + getEqTotal('sta') + getEqTotal('allStats')
			if (my.buffFlags.borealTalisman) {
				stats.cache.sta += buffs.borealTalisman.sta[my.buffs.borealTalisman.level]
			}
		}
		return stats.cache.sta
	}
	function agi(fresh) {
		if (fresh || typeof stats.cache.agi === 'undefined') {
			stats.cache.agi = my.agi + create.raceAttrs[my.race][2] + create.jobAttrs[my.jobLong][2] + getEqTotal('agi') + getEqTotal('allStats')
			if (my.buffFlags.augmentation) {
				stats.cache.agi += buffs.augmentation.stats[my.buffs.augmentation.level]
			}

			if (fresh) {
				dodgeChance(true)
				armor(true)
			}
		}
		return stats.cache.agi
	}
	function dex(fresh) {
		if (fresh || typeof stats.cache.dex === 'undefined') {
			stats.cache.dex = my.dex + create.raceAttrs[my.race][3] + create.jobAttrs[my.jobLong][3] + getEqTotal('dex') + getEqTotal('allStats')
			if (my.buffFlags.augmentation) {
				stats.cache.dex += buffs.augmentation.stats[my.buffs.augmentation.level]
			}

			if (fresh) {
				parryChance(true)
				riposteChance(true)
				critChance(true)
			}
		}
		return stats.cache.dex
	}
	function wis(fresh) {
		if (fresh || typeof stats.cache.wis === 'undefined') {
			stats.cache.wis = my.wis + create.raceAttrs[my.race][4] + create.jobAttrs[my.jobLong][4] + getEqTotal('wis') + getEqTotal('allStats')
		}
		return stats.cache.wis
	}
	function intel(fresh) {
		if (fresh || typeof stats.cache.intel === 'undefined') {
			stats.cache.intel = my.intel + create.raceAttrs[my.race][5] + create.jobAttrs[my.jobLong][5] + getEqTotal('intel') + getEqTotal('allStats')
			if (my.buffFlags.clarity) {
				stats.cache.intel += buffs.clarity.intel[my.buffs.clarity.level]
			}
			mpMax(true)
		}
		return stats.cache.intel
	}
	function cha(fresh) {
		if (fresh || typeof stats.cache.cha === 'undefined') {
			stats.cache.cha = my.cha + create.raceAttrs[my.race][6] + create.jobAttrs[my.jobLong][6] + getEqTotal('cha') + getEqTotal('allStats')
			if (my.buffFlags.vampiricAllure) {
				stats.cache.cha += buffs.vampiricAllure.cha[my.buffs.vampiricAllure.level]
			}
			if (my.buffFlags.conviction) {
				stats.cache.cha += buffs.conviction.cha[my.buffs.conviction.level]
			}
			spMax(true)
		}
		return stats.cache.cha
	}
	function armor(fresh) {
		if (fresh || typeof stats.cache.armor === 'undefined') {
			stats.cache.armor = ((agi() * .66) +(defense() * 3.3)) + getEqTotal('armor')
			if (my.buffFlags.zealousResolve) {
				stats.cache.armor += (my.buffs.zealousResolve.damage * buffs.zealousResolve.armorRatio)
			}
			if (my.buffFlags.intrepidShout) {
				stats.cache.armor += buffs.intrepidShout.armor[my.buffs.intrepidShout.level]
			}
			if (my.buffFlags.branchSpirit) {
				stats.cache.armor += (my.buffs.branchSpirit.damage * buffs.branchSpirit.armorRatio)
			}
			if (my.buffFlags.lichForm) {
				stats.cache.armor += buffs.lichForm.armor[my.buffs.lichForm.level]
			}
			stats.cache.armor = round(stats.cache.armor)
		}
		return stats.cache.armor
	}
	function armorReductionRatio() {
		// max of 75% reduction
		return (stats.armor() > 3000 ? 3000 : stats.armor()) / 4000
	}

	function attack(type, fresh) {
		type = type || items.eq[12].weaponSkill
		if (fresh || typeof stats.cache.attack === 'undefined') {
			stats.cache.attack = getEqTotal('attack') + (str() * .35)
			// console.info('stats.missChance', type, ~~stats.cache.attack)
			// buffs
			if (my.buffFlags.spiritOfTheHunter) {
				stats.cache.attack += buffs.spiritOfTheHunter.attackBonus[my.buffs.spiritOfTheHunter.level]
			}
			if (my.buffFlags.branchSpirit) {
				stats.cache.attack += (my.buffs.branchSpirit.damage * buffs.branchSpirit.attackRatio)
			}
		}

		totalAttack = stats.cache.attack
		totalAttack += (offense() * 1.66)
		// by weapon type
		if (type === 'One-hand Slash') totalAttack += (oneHandSlash() * 2.66)
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
		if (fresh || typeof stats.cache.offense === 'undefined') {
			stats.cache.offense = getStatTotal('offense') + getEqTotal('allSkills')
		}
		return stats.cache.offense
	}
	function defense(fresh) {
		if (fresh || typeof stats.cache.defense === 'undefined') {
			stats.cache.defense = getStatTotal('defense') + getEqTotal('allSkills')
		}
		return stats.cache.defense
	}
	function oneHandSlash(fresh) {
		if (fresh || typeof stats.cache.oneHandSlash === 'undefined') {
			stats.cache.oneHandSlash = getStatTotal('oneHandSlash') + getEqTotal('allSkills')
		}
		return stats.cache.oneHandSlash
	}
	function oneHandBlunt(fresh) {
		if (fresh || typeof stats.cache.oneHandBlunt === 'undefined') {
			stats.cache.oneHandBlunt = getStatTotal('oneHandBlunt') + getEqTotal('allSkills')
		}
		return stats.cache.oneHandBlunt
	}
	function piercing(fresh) {
		if (fresh || typeof stats.cache.piercing === 'undefined') {
			stats.cache.piercing = getStatTotal('piercing') + getEqTotal('allSkills')
		}
		return stats.cache.piercing
	}
	function twoHandSlash(fresh) {
		if (fresh || typeof stats.cache.twoHandSlash === 'undefined') {
			stats.cache.twoHandSlash = getStatTotal('twoHandSlash') + getEqTotal('allSkills')
		}
		return stats.cache.twoHandSlash
	}
	function twoHandBlunt(fresh) {
		if (fresh || typeof stats.cache.twoHandBlunt === 'undefined') {
			stats.cache.twoHandBlunt = getStatTotal('twoHandBlunt') + getEqTotal('allSkills')
		}
		return stats.cache.twoHandBlunt
	}
	function handToHand(fresh) {
		if (fresh || typeof stats.cache.handToHand === 'undefined') {
			stats.cache.handToHand = getStatTotal('handToHand') + getEqTotal('allSkills')
		}
		return stats.cache.handToHand
	}
	function archery(fresh) {
		if (fresh || typeof stats.cache.archery === 'undefined') {
			stats.cache.archery = getStatTotal('archery') + getEqTotal('allSkills')
		}
		return stats.cache.archery
	}
	function dualWield(fresh) {
		if (fresh || typeof stats.cache.dualWield === 'undefined') {
			stats.cache.dualWield = getStatTotal('dualWield') + getEqTotal('allSkills')
		}
		return stats.cache.dualWield
	}
	function doubleAttack(fresh) {
		if (fresh || typeof stats.cache.doubleAttack === 'undefined') {
			stats.cache.doubleAttack = getStatTotal('doubleAttack') + getEqTotal('allSkills')
		}
		return stats.cache.doubleAttack
	}
	function missChance(index, weaponSkill) {
		chance = .2
		// 24 is about how much attack you get per level (21.6?)
		chance += ((mobs[index].level * 24) - stats.attack(weaponSkill)) / 2400
		if (my.level < mobs[index].level) {
			chance += ((mobs[index].level - my.level) / 40)
		}
		// console.info('stats.missChance before', weaponSkill, chance)
		if (mobs[index].buffFlags.faerieFlame) chance -= .12
		// console.info('stats.missChance after', weaponSkill, chance)
		// limit check
		if (chance > .5) chance = .5
		else if (chance < .05) chance = .05
		return chance

	}
	function dodge(fresh) {
		if (fresh || typeof stats.cache.dodge === 'undefined') {
			stats.cache.dodge = getStatTotal('dodge') + getEqTotal('allSkills')
		}
		return stats.cache.dodge
	}
	function parry(fresh) {
		if (fresh || typeof stats.cache.parry === 'undefined') {
			stats.cache.parry = getStatTotal('parry') + getEqTotal('allSkills')
		}
		return stats.cache.parry
	}
	function riposte(fresh) {
		if (fresh || typeof stats.cache.riposte === 'undefined') {
			stats.cache.riposte = getStatTotal('riposte') + getEqTotal('allSkills')
		}
		return stats.cache.riposte
	}
	function dodgeChance(fresh) {
		if (fresh || typeof stats.cache.dodgeChance === 'undefined') {
			stats.cache.dodgeChance = dodge() / 2500 + (agi() / 2000)
		}
		return stats.cache.dodgeChance
	}
	function parryChance(fresh) {
		if (fresh || typeof stats.cache.parryChance === 'undefined') {
			stats.cache.parryChance = parry() / 2500 + (dex() / 2000)
		}
		return stats.cache.parryChance
	}
	function riposteChance(fresh) {
		if (fresh || typeof stats.cache.riposteChance === 'undefined') {
			stats.cache.riposteChance = riposte() / 2500 + (dex() / 2000)
		}
		return stats.cache.riposteChance
	}
	function critChance(fresh) {
		if (fresh || typeof stats.cache.crit === 'undefined') {
			stats.cache.crit = ( (dex() / 75) + ng.dimRetCrit(getEqTotal('crit')) ) / 100
		}
		return stats.cache.crit
	}
	function addBlood(fresh) {
		if (fresh || typeof stats.cache.addBlood === 'undefined') {
			stats.cache.addBlood = getEqTotal('addBlood')
		}
		return stats.cache.addBlood
	}
	function addPoison(fresh) {
		if (fresh || typeof stats.cache.addPoison === 'undefined') {
			stats.cache.addPoison = getEqTotal('addPoison')
			if (my.buffFlags.profaneSpirit) {
				stats.cache.addPoison += buffs.profaneSpirit.addPoison[my.buffs.profaneSpirit.level]
			}
		}
		return stats.cache.addPoison
	}
	function addArcane(fresh) {
		if (fresh || typeof stats.cache.addArcane === 'undefined') {
			stats.cache.addArcane = getEqTotal('addArcane')
		}
		return stats.cache.addArcane
	}
	function addLightning(fresh) {
		if (fresh || typeof stats.cache.addLightning === 'undefined') {
			stats.cache.addLightning = getEqTotal('addLightning')
			if (my.buffFlags.phaseBlade) {
				stats.cache.addLightning += buffs.phaseBlade.addLightning[my.buffs.phaseBlade.level]
			}
		}
		return stats.cache.addLightning
	}
	function addFire(fresh) {
		if (fresh || typeof stats.cache.addFire === 'undefined') {
			stats.cache.addFire = getEqTotal('addFire')
			if (my.buffFlags.moltenAegis) {
				stats.cache.addFire += buffs.moltenAegis.addFire[my.buffs.moltenAegis.level]
			}
		}
		return stats.cache.addFire
	}
	function addIce(fresh) {
		if (fresh || typeof stats.cache.addIce === 'undefined') {
			stats.cache.addIce = getEqTotal('addIce')
		}
		return stats.cache.addIce
	}
	function addSpellBlood(fresh) {
		if (fresh || typeof stats.cache.addSpellBlood === 'undefined') {
			stats.cache.addSpellBlood = getEqTotal('addSpellBlood')
		}
		return stats.cache.addSpellBlood
	}
	function addSpellPoison(fresh) {
		if (fresh || typeof stats.cache.addSpellPoison === 'undefined') {
			stats.cache.addSpellPoison = getEqTotal('addSpellPoison')
		}
		return stats.cache.addSpellPoison
	}
	function addSpellArcane(fresh) {
		if (fresh || typeof stats.cache.addSpellArcane === 'undefined') {
			stats.cache.addSpellArcane = getEqTotal('addSpellArcane')
		}
		return stats.cache.addSpellArcane
	}
	function addSpellLightning(fresh) {
		if (fresh || typeof stats.cache.addSpellLightning === 'undefined') {
			stats.cache.addSpellLightning = getEqTotal('addSpellLightning')
		}
		return stats.cache.addSpellLightning
	}
	function addSpellFire(fresh) {
		if (fresh || typeof stats.cache.addSpellFire === 'undefined') {
			stats.cache.addSpellFire = getEqTotal('addSpellFire')
		}
		return stats.cache.addSpellFire
	}
	function addSpellIce(fresh) {
		if (fresh || typeof stats.cache.addSpellIce === 'undefined') {
			stats.cache.addSpellIce = getEqTotal('addSpellIce')
		}
		return stats.cache.addSpellIce
	}
	function addSpellAll(fresh) {
		if (fresh || typeof stats.cache.addSpellAll === 'undefined') {
			stats.cache.addSpellAll = getEqTotal('addSpellAll')
			if (my.buffFlags.celestialFrenzy) {
				stats.cache.addSpellAll += buffs.celestialFrenzy.addSpellAll[my.buffs.celestialFrenzy.level]
			}
		}
		return stats.cache.addSpellAll
	}
	function enhanceBlood(fresh) {
		if (fresh || typeof stats.cache.addSpellIce === 'undefined') {
			stats.cache.enhanceBlood = getEqTotal('enhanceBlood')
		}
		return stats.cache.enhanceBlood
	}
	function enhancePoison(fresh) {
		if (fresh || typeof stats.cache.addSpellIce === 'undefined') {
			stats.cache.enhancePoison = getEqTotal('enhancePoison')
		}
		return stats.cache.enhancePoison
	}
	function enhanceArcane(fresh) {
		if (fresh || typeof stats.cache.enhanceArcane === 'undefined') {
			stats.cache.enhanceArcane = getEqTotal('enhanceArcane')
		}
		return stats.cache.enhanceArcane
	}
	function enhanceLightning(fresh) {
		if (fresh || typeof stats.cache.enhanceLightning === 'undefined') {
			stats.cache.enhanceLightning = getEqTotal('enhanceLightning')
		}
		return stats.cache.enhanceLightning
	}
	function enhanceFire(fresh) {
		if (fresh || typeof stats.cache.enhanceFire === 'undefined') {
			stats.cache.enhanceFire = getEqTotal('enhanceFire')
		}
		return stats.cache.enhanceFire
	}
	function enhanceIce(fresh) {
		if (fresh || typeof stats.cache.enhanceIce === 'undefined') {
			stats.cache.enhanceIce = getEqTotal('enhanceIce')
		}
		return stats.cache.enhanceIce
	}
	function enhanceAll(fresh) {
		if (fresh || typeof stats.cache.enhanceAll === 'undefined') {
			stats.cache.enhanceAll = getEqTotal('enhanceAll')
		}
		return stats.cache.enhanceAll
	}
	function spellDamage(forceCrit, getNonCrit) {
		max = spell.data.spellDamage(my.skills[spell.index])
		// console.info('spellDamage 1', max)
		// enhance by type % and ALL%
		if (spell.data.damageType === 'blood') enhanceDamage = enhanceBlood()
		else if (spell.data.damageType === 'poison') enhanceDamage = enhancePoison()
		else if (spell.data.damageType === 'arcane') enhanceDamage = enhanceArcane()
		else if (spell.data.damageType === 'lightning') enhanceDamage = enhanceLightning()
		else if (spell.data.damageType === 'fire') enhanceDamage = enhanceFire()
		else if (spell.data.damageType === 'ice') enhanceDamage = enhanceIce()
		enhanceDamage += enhanceAll()

		// wis boosts conjuration
		if (my[spell.data.spellType] === 'conjuration') enhanceDamage += (stats.wis() / 15)
		else if (my[spell.data.spellType] === 'evocation') enhanceDamage += (stats.intel() / 15)
		else if (my[spell.data.spellType] === 'alteration') enhanceDamage += (stats.cha() / 15)

		if (my.buffFlags.lichForm) {
			if (spell.data.damageType === 'poison' || spell.data.damageType === 'blood') {
				enhanceDamage = buffs.lichForm.enhancePnB[my.buffs.lichForm.level]
				// console.info('lichForm', buffs.lichForm.enhancePnB[my.buffs.lichForm.level])
			}
		}

		max = max * (1 + (enhanceDamage / 100))
		// add spell damage by type and ALL
		if (spell.data.damageType === 'blood') addedDamage = addSpellBlood()
		else if (spell.data.damageType === 'poison') addedDamage = addSpellPoison()
		else if (spell.data.damageType === 'arcane') addedDamage = addSpellArcane()
		else if (spell.data.damageType === 'lightning') addedDamage = addSpellLightning()
		else if (spell.data.damageType === 'fire') addedDamage = addSpellFire()
		else if (spell.data.damageType === 'ice') addedDamage = addSpellIce()
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

		if (typeof getNonCrit === 'undefined') {
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
			damageType: 'physical',
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
			damageType: 'physical',
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
		combat.levelSkillCheck('dualWield')
		return {
			min: min,
			max: max,
			damage: _.random(min, max),
			isCrit: isCrit,
			enhancedDamage: 1,
			weaponSkill: weaponSkill,
			damageType: 'physical',
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
			damageType: 'physical',
		}
	}
	function getResistPercent(type) {
		resistPercent = 1
		if (type === 'blood') resistPercent = 1 - (resistBlood() / 400)
		else if (type === 'poison') resistPercent = 1 - (resistPoison() / 400)
		else if (type === 'arcane') resistPercent = 1 - (resistArcane() / 400)
		else if (type === 'lightning') resistPercent = 1 - (resistLightning() / 400)
		else if (type === 'fire') resistPercent = 1 - (resistFire() / 400)
		else if (type === 'ice') resistPercent = 1 - (resistIce() / 400)
		if (resistPercent < .25) resistPercent = .25
		return resistPercent
	}
	function resistBlood(fresh) {
		if (fresh || typeof stats.cache.resistBlood === 'undefined') {
			stats.cache.resistBlood = getStatTotal('resistBlood') + getEqTotal('resistAll')
			if (my.buffFlags.sealOfRedemption) {
				stats.cache.resistBlood += (buffs.sealOfRedemption.base + (my.buffs.sealOfRedemption.level * buffs.sealOfRedemption.bloodPerLevel))
			}
			stats.cache.resistBlood += my.buffFlags.manaShell ? buffs.manaShell.resistAll[my.buffs.manaShell.level] : 0
			stats.cache.resistBlood = round(stats.cache.resistBlood)
		}
		return stats.cache.resistBlood
	}
	function resistPoison(fresh) {
		if (fresh || typeof stats.cache.resistPoison === 'undefined') {
			stats.cache.resistPoison = getStatTotal('resistPoison') + getEqTotal('resistAll')
			stats.cache.resistPoison += my.buffFlags.manaShell ? buffs.manaShell.resistAll[my.buffs.manaShell.level] : 0
			if (my.buffFlags.profaneSpirit) {
				stats.cache.resistPoison += buffs.profaneSpirit.resistPoison[my.buffs.profaneSpirit.level]
			}
		}
		return stats.cache.resistPoison
	}
	function resistArcane(fresh) {
		if (fresh || typeof stats.cache.resistArcane === 'undefined') {
			stats.cache.resistArcane = getStatTotal('resistArcane') + getEqTotal('resistAll')
			stats.cache.resistArcane += my.buffFlags.manaShell ? buffs.manaShell.resistAll[my.buffs.manaShell.level] : 0
		}
		return stats.cache.resistArcane
	}
	function resistLightning(fresh) {
		if (fresh || typeof stats.cache.resistLightning === 'undefined') {
			stats.cache.resistLightning = getStatTotal('resistLightning') + getEqTotal('resistAll')
			stats.cache.resistLightning += my.buffFlags.manaShell ? buffs.manaShell.resistAll[my.buffs.manaShell.level] : 0
			if (my.buffFlags.phaseBlade) {
				stats.cache.resistLightning += buffs.phaseBlade.resistLightning[my.buffs.phaseBlade.level]
			}
		}
		return stats.cache.resistLightning
	}
	function resistFire(fresh) {
		if (fresh || typeof stats.cache.resistFire === 'undefined') {
			stats.cache.resistFire = getStatTotal('resistFire') + getEqTotal('resistAll')
			stats.cache.resistFire += my.buffFlags.manaShell ? buffs.manaShell.resistAll[my.buffs.manaShell.level] : 0
			if (my.buffFlags.moltenAegis) {
				stats.cache.resistFire += buffs.moltenAegis.resistFire[my.buffs.moltenAegis.level]
			}
		}
		return stats.cache.resistFire
	}
	function resistIce(fresh) {
		if (fresh || typeof stats.cache.resistIce === 'undefined') {
			stats.cache.resistIce = getStatTotal('resistIce') + getEqTotal('resistAll')
			if (my.buffFlags.manaShell) {
				stats.cache.resistIce += buffs.manaShell.resistAll[my.buffs.manaShell.level]
			}
			if (my.buffFlags.borealTalisman) {
				stats.cache.resistIce += buffs.borealTalisman.resistIce[my.buffs.borealTalisman.level]
			}
		}
		return stats.cache.resistIce
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
		if (prop === 'offense') resp = offenseMax(fresh)
		else if (prop === 'defense') resp = defenseMax(fresh)
		else if (prop === 'oneHandSlash') resp = oneHandSlashMax(fresh)
		else if (prop === 'oneHandBlunt') resp = oneHandBluntMax(fresh)
		else if (prop === 'piercing') resp = piercingMax(fresh)
		else if (prop === 'archery') resp = archeryMax(fresh)
		else if (prop === 'handToHand') resp = handToHandMax(fresh)
		else if (prop === 'twoHandSlash') resp = twoHandSlashMax(fresh)
		else if (prop === 'twoHandBlunt') resp = twoHandBluntMax(fresh)
		else if (prop === 'dualWield') resp = dualWieldMax(fresh)
		else if (prop === 'doubleAttack') resp = doubleAttackMax(fresh)
		else if (prop === 'dodge') resp = dodgeMax(fresh)
		else if (prop === 'parry') resp = parryMax(fresh)
		else if (prop === 'riposte') resp = riposteMax(fresh)
		else if (prop === 'alteration') resp = alterationMax(fresh)
		else if (prop === 'evocation') resp = evocationMax(fresh)
		else if (prop === 'conjuration') resp = conjurationMax(fresh)
		return resp
	}
	function offenseMax(fresh) {
		if (my.race === 'Halfling') base = 10
		else if (my.race === 'Half Elf') base = 5
		else base = 0
		if (offensiveJobs.includes(my.job)) return base + my.level * 5
		else if (intCasterJobs.includes(my.job)) return base + my.level * 3
		else return base + my.level * 4
	}
	function defenseMax(fresh) {
		base = my.race === 'Dwarf' ? 5 : 0
		if (defensiveJobs.includes(my.job)) return base + my.level * 5
		else if (intCasterJobs.includes(my.job)) return base + my.level * 3
		else return base + my.level * 4
	}
	function oneHandSlashMax(fresh) {
		if (my.race === 'Human') base = 10
		else if (my.race === 'Half Elf') base = 5
		else base = 0
		if (my.job === 'RNG') return base + my.level * 5
		else if (my.job === JOB.ROGUE) return base + _.min([my.level * 5, 240])
		else if (averageOneHandSlashJobs.includes(my.job)) return base + my.level * 4
		else return 0
	}
	function oneHandBluntMax(fresh) {
		if (my.race === 'Barbarian') base = 10
		else if (my.race === 'Half Elf') base = 5
		else base = 0
		if (my.job === JOB.MONK) return base + my.level * 5
		else if (my.job === 'RNG') return base + _.min([my.level * 5, 240])
		else if (my.job === JOB.ROGUE) return base + _.min([my.level * 5, 225])
		else return base + my.level * 4
	}
	function piercingMax(fresh) {
		if (my.race === 'Halfling') base = 10
		else if (my.race === 'Half Elf') base = 5
		else base = 0
		if (my.job === JOB.ROGUE) return base + my.level * 5
		else if (my.job === 'RNG') return base + _.min([my.level * 5, 240])
		else if (averagePiercingJobs.includes(my.job)) return base + my.level * 4
		else return 0
	}
	function archeryMax(fresh) {
		base = my.race === 'Half Elf' ? 5 : 0
		if (my.job === 'RNG') return base + my.level * 5
		else if (averageArcherJobs.includes(my.job)) return base + my.level * 2
		else return 0
	}
	function handToHandMax(fresh) {
		base = my.race === 'Half Elf' ? 5 : 0
		if (my.job === JOB.MONK) return base + my.level * 5
		else if (averagePunchJobs.includes(my.job)) return base + my.level * 2
		else return my.level
	}
	function twoHandSlashMax(fresh) {
		if (my.race === 'Human' || my.race === 'Orc') base = 10
		else if (my.race === 'Half Elf') base = 5
		else base = 0
		if (my.job === 'RNG') return base + _.min([my.level * 5, 225])
		else if (tankJobs.includes(my.job)) return base + my.level * 4
		else return 0
	}
	function twoHandBluntMax(fresh) {
		if (my.race === 'Barbarian' || my.race === 'Orc') base = 10
		else if (my.race === 'Half Elf') base = 5
		else base = 0
		if (my.job === JOB.MONK) return base + my.level * 5
		else if (my.job === 'RNG') return base + _.min([my.level * 5, 225])
		else if (twoHandBluntAverageJobs.includes(my.job)) return base + my.level * 4
		else return 0
	}
	function dualWieldMax(fresh) {
		base = my.race === 'Half Elf' ? 5 : 0
		if (my.job === JOB.MONK ||
			my.job === JOB.ROGUE && my.level >= 13 ||
			my.job === 'RNG' && my.level >= 17) {
			return base + my.level * 5
		}
		else if (
			my.job === JOB.WARRIOR && my.level >= 13 ||
			my.job === JOB.BARD && my.level >= 17) {
			return base + my.level * 4
		}
		else return 0
	}
	function doubleAttackMax(fresh) {
		base = my.race === 'Half Elf' ? 5 : 0
		if (
			my.job === JOB.CRUSADER && my.level >= 20 ||
			my.job === JOB.SHADOW_KNIGHT && my.level >= 20 ||
			my.job === JOB.MONK && my.level >= 15 ||
			my.job === JOB.ROGUE && my.level >= 16 ||
			my.job === 'RNG' && my.level >= 20) {
			return base + my.level * 5
		}
		else if (my.job === JOB.WARRIOR && my.level >= 15) return base + my.level * 4
		else return 0
	}
	function dodgeMax(fresh) {
		if (my.race === 'Halfling') base = 10
		else if (my.race === 'Half Elf') base = 5
		else base = 0
		if (
			(my.job === JOB.ROGUE && my.level >= 4) ||
			(my.job === JOB.BARD && my.level >= 10)) {
			return base + my.level * 4
		}
		else if (
			(my.job === JOB.WARRIOR && my.level >= 6) ||
			(my.job === JOB.CRUSADER && my.level >= 10) ||
			(my.job === JOB.SHADOW_KNIGHT && my.level >= 10) ||
			(my.job === JOB.MONK) ||
			(my.job === 'RNG' && my.level >= 8)) {
			return base + my.level * 3
		}
		else if (
			wisCasterJobs.includes(my.job) && my.level >= 15 ||
			intCasterJobs.includes(my.job) && my.level >= 22) {
			return base + my.level * 2
		}
		else return 0
	}
	function parryMax(fresh) {
		base = my.race === 'Half Elf' ? 5 : 0
		if (
			(my.job === JOB.WARRIOR && my.level >= 10) ||
			(my.job === JOB.CRUSADER && my.level >= 17)) {
			return base + my.level * 5
		}
		else if (
			(my.job === JOB.SHADOW_KNIGHT && my.level >= 17) ||
			(my.job === 'RNG' && my.level >= 18)) {
			return base + my.level * 4
		}
		else if (
			(my.job === JOB.MONK && my.level >= 12) ||
			(my.job === JOB.ROGUE && my.level >= 12)) {
			return base + my.level * 3
		}
		else return 0
	}
	function riposteMax(fresh) {
		base = my.race === 'Half Elf' ? 5 : 0
		if (
			(my.job === JOB.WARRIOR && my.level >= 25) ||
			(my.job === JOB.SHADOW_KNIGHT && my.level >= 30)) {
			return base + my.level * 5
		}
		else if (
			(my.job === JOB.CRUSADER && my.level >= 30) ||
			(my.job === JOB.MONK && my.level >= 35)) {
			return base + my.level * 4
		}
		else if (
			(my.job === JOB.ROGUE && my.level >= 30) ||
			(my.job === 'RNG' && my.level >= 35)) {
			return base + my.level * 3
		}
		else return 0
	}
	function alterationMax(fresh) {
		base = my.race === 'Dwarf' || my.race === 'Seraph' ? 5 : 0
		if (allCasterJobs.includes(my.job)) return base + my.level * 5
		else if (hybridJobs.includes(my.job)) return base + my.level * 5
		else return 0
	}
	function evocationMax(fresh) {
		if (my.race === 'High Elf') base = 10
		else if (my.race === 'Seraph') base = 5
		else base = 0
		if (allCasterJobs.includes(my.job)) return base + my.level * 5
		else if (hybridJobs.includes(my.job)) return base + my.level * 5
		else return 0
	}
	function conjurationMax(fresh) {
		if (my.race === 'Troll') base = 10
		else if (my.race === 'Seraph') base = 5
		else base = 0
		if (allCasterJobs.includes(my.job)) return base + my.level * 5
		else if (hybridJobs.includes(my.job)) return base + my.level * 5
		else return 0
	}
	function setAllResources() {
		my.set('hpMax', hpMax())
		my.set('mpMax', mpMax())
		my.set('spMax', spMax())

		if (my.hp > my.hpMax) my.set('hp', my.hpMax)
		if (my.mp > my.mpMax) my.set('mp', my.mpMax)
		if (my.sp > my.spMax) my.set('sp', my.spMax)
	}

	const hpBase = 80
	const mpBase = 60
	const spBase = 40
	function hpMax(fresh) {
		value = ~~(
			((stats.sta() * hpTier[my.job]) * (my.level / 50) +
				(my.level * (hpTier[my.job] * 2.5) + hpBase)) * hpPercentBonus()
			+ getEqTotal('hp')
		)
		if (my.buffFlags.sealOfRedemption) {
			value += (my.buffs.sealOfRedemption.damage)
		}
		if (my.buffFlags.zealousResolve) {
			value += (my.buffs.zealousResolve.damage)
		}
		return value
	}
	function mpMax(fresh) {
		if (fresh || typeof stats.cache.hpRegen === 'undefined') {
			stats.cache.mpMax = ~~(
				((stats.intel() * mpTier[my.job]) * (my.level / 50) +
					(my.level * (mpTier[my.job] * 2.5) + mpBase)) * mpPercentBonus()
				+ getEqTotal('mp')
			)
		}
		return stats.cache.mpMax
	}

	function spMax(fresh) {
		return ~~(
			((stats.cha() * spTier[my.job]) * (my.level / 50) +
				(my.level * (spTier[my.job] * 2.5) + spBase)) +
			getEqTotal('sp')
		)
	}
	// troll 9, normal 5
	function baseHpRegen(fresh) {
		return (my.race === 'Troll' ? 3 : 1) + (my.level * (my.race === 'Troll' ? .12 : .08))
	}
	// high elf 16, normal 10
	function baseMpRegen(fresh) {
		return (my.race === 'High Elf' ? 4 : 2) + (my.level * (my.race === 'High Elf' ? .24 : .16))
	}
	// human 16, normal 10
	function baseSpRegen(fresh) {
		return (my.race === 'Human' ? 4 : 2) + (my.level * (my.race === 'Human' ? .24 : .16))
	}
	function hpRegen(fresh) {
		if (fresh || typeof stats.cache.hpRegen === 'undefined') {
			stats.cache.hpRegen = ~~(baseHpRegen() + getEqTotal('hpRegen'))
			if (my.buffFlags.branchSpirit) {
				stats.cache.hpRegen += ceil(1 + (my.buffs.branchSpirit.level * buffs.branchSpirit.regenPerLevel))
			}
			if (my.buffFlags.lichForm) {
				stats.cache.hpRegen -= buffs.lichForm.hpRegen[my.buffs.lichForm.level]
			}
		}
		return stats.cache.hpRegen
	}
	function mpRegen(fresh) {
		if (fresh || typeof stats.cache.mpRegen === 'undefined') {
			stats.cache.mpRegen = ~~(baseMpRegen() + getEqTotal('mpRegen'))
			if (my.buffFlags.lichForm) {
				stats.cache.mpRegen += buffs.lichForm.mpRegen[my.buffs.lichForm.level]
			}
			if (my.buffFlags.clarity) {
				stats.cache.mpRegen += buffs.clarity.mpRegen[my.buffs.clarity.level]
			}
		}
		return stats.cache.mpRegen
	}
	function spRegen(fresh) {
		if (fresh || typeof stats.cache.spRegen === 'undefined') {
			stats.cache.spRegen = ~~(baseSpRegen() + getEqTotal('spRegen'))
			if (my.buffFlags.conviction) {
				stats.cache.mpRegen += buffs.conviction.spRegen[my.buffs.conviction.level]
			}
		}
		return stats.cache.spRegen
	}

	function hpPercentBonus(fresh) {
		return 1 + (getStatTotal('increaseHpPercent') / 100);
	}
	function mpPercentBonus(fresh) {
		return 1 + (getStatTotal('increaseMpPercent') / 100);
	}
	function someIgnoreTargetArmor(fresh) {
		return items.eq.some(eq => eq.ignoreTargetArmor)
	}
	function someReduceTargetArmor(fresh) {
		return items.eq.some(eq => eq.reduceTargetArmor)
	}
	function enhanceDamageToMobType(mobType) {
		return getEqTotal('enhancedDamageTo' + mobType) / 100
	}
	function phyMit(fresh) {
		if (fresh || typeof stats.cache.phyMit === 'undefined') {
			stats.cache.phyMit = getEqTotal('phyMit')
			if (my.buffFlags.bulwark) {
				stats.cache.phyMit += buffs.bulwark.mitigation[my.buffs.bulwark.level]
			}
		}
		return stats.cache.phyMit
	}
	function magMit(fresh) {
		if (fresh || typeof stats.cache.magMit === 'undefined') {
			stats.cache.magMit = getEqTotal('magMit')
			if (my.buffFlags.bulwark) {
				stats.cache.magMit += buffs.bulwark.mitigation[my.buffs.bulwark.level]
			}
		}
		return stats.cache.magMit
	}
	function leech(fresh) {
		if (fresh || typeof stats.cache.leech === 'undefined') {
			stats.cache.leech = getEqTotal('leech')
			if (my.buffFlags.vampiricAllure) {
				stats.cache.leech += buffs.vampiricAllure.leech[my.buffs.vampiricAllure.level]
			}
		}
		return stats.cache.leech
	}
	function wraith(fresh) {
		if (fresh || typeof stats.cache.wraith === 'undefined') {
			stats.cache.wraith = getEqTotal('wraith')
			if (my.buffFlags.vampiricAllure) {
				stats.cache.wraith += buffs.vampiricAllure.leech[my.buffs.vampiricAllure.level]
			}
		}
		return stats.cache.wraith
	}
	function damageTakenToMana(fresh) {
		vulpineMp = getEqTotal('damageTakenToMana')
		if (vulpineMp > 50) vulpineMp = 50
		return vulpineMp
	}
	function damageTakenToSpirit(fresh) {
		vulpineSp = getEqTotal('damageTakenToSpirit')
		if (vulpineSp > 50) vulpineSp = 50
		return vulpineSp
	}
	function hpKill(fresh) {
		return getEqTotal('hpKill')
	}
	function mpKill(fresh) {
		return getEqTotal('mpKill')
	}
	function spKill(fresh) {
		return getEqTotal('spKill')
	}
	function resistParalyze(fresh) {
		// cannot change targets or use melee skills? (auto attack works)
		resistStatusVal = getEqTotal('resistParalyze')
		if (fresh || typeof stats.cache.resistParalyze === 'undefined') {
			stats.cache.resistParalyze = getEqTotal('resistParalyze')
			if (stats.cache.resistParalyze > 50) {
				stats.cache.resistParalyze = 50
			}
		}
		return stats.cache.resistParalyze
	}
	function resistFear(fresh) {
		// all skill/spell damage output halved
		if (fresh || typeof stats.cache.resistFear === 'undefined') {
			stats.cache.resistFear = getEqTotal('resistFear')
			if (my.buffFlags.intrepidShout) {
				stats.cache.resistFear += buffs.intrepidShout.base + (buffs.intrepidShout.fearPerLevel * my.buffs.intrepidShout.level)
			}
			if (stats.cache.resistFear > 50) {
				stats.cache.resistFear = 50
			}
		}
		return stats.cache.resistFear
	}
	function resistStun(fresh) {
		// can't do anything
		if (fresh || typeof stats.cache.resistStun === 'undefined') {
			stats.cache.resistStun = getEqTotal('resistStun')
			if (stats.cache.resistStun > 50) {
				stats.cache.resistStun = 50
			}
		}
		return stats.cache.resistStun
	}
	function resistSilence(fresh) {
		// cannot cast spells
		if (fresh || typeof stats.cache.resistSilence === 'undefined') {
			stats.cache.resistSilence = getEqTotal('resistSilence')
			if (my.buffFlags.manaShell) {
				stats.cache.resistSilence += buffs.manaShell.silence[my.buffs.manaShell.level]
			}
			if (stats.cache.resistSilence > 50) {
				stats.cache.resistSilence = 50
			}
		}
		return stats.cache.resistSilence
	}
})($, TweenMax, _);