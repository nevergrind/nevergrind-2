var stats = {};
(function($, TweenMax, _, undefined) {
	stats = {
		cache: {},
		str,
		sta,
		agi,
		dex,
		wis,
		intel,
		cha,
		armor,
		attack,
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
	var offensiveJobs = ['SHD', 'MNK', 'ROG', 'RNG']
	var defensiveJobs = ['WAR', 'CRU', 'SHD']
	var averagePunchJobs = ['WAR', 'CRU', 'SHD', 'ROG', 'RNG', 'BRD']
	var wisCasterJobs = ['DRU', 'CLR', 'SHM']
	var intCasterJobs = ['NEC', 'ENC', 'SUM', 'WIZ']
	var allCasterJobs = ['CLR', 'DRU', 'SHM', 'BRD', 'NEC', 'ENC', 'SUM', 'WIZ']
	var hybridJobs = ['CRU', 'SHD', 'RNG']
	var twoHandBluntAverageJobs = ['WAR', 'CRU', 'SHD', 'CLR', 'DRU', 'SHM', 'NEC', 'ENC', 'SUM', 'WIZ']
	var tankJobs = ['WAR', 'CRU', 'SHD']
	var averageArcherJobs = ['WAR', 'CRU', 'SHD', 'ROG', 'BRD']
	var averagePiercingJobs = ['WAR', 'BRD', 'SHM', 'NEC', 'ENC', 'SUM', 'WIZ']
	var averageOneHandSlashJobs = ['WAR', 'CRU', 'SHD', 'BRD', 'DRU']
	let isCrit = false
	let chance, weaponSkill, enhanceDamage, addedDamage
	let resistPercent
	let vulpineMp = 0
	let vulpineSp = 0
	let resistStatusVal = 0
	let value = 0
	var val, base, i, len, type, min, max, atk, h2h, atk, stat, dps

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
		'WAR': 10,
		'CRU': 9,
		'SHD': 9,
		'MNK': 7,
		'ROG': 7,
		'RNG': 7,
		'BRD': 7,
		'DRU': 7,
		'CLR': 7,
		'SHM': 7,
		'NEC': 6,
		'ENC': 6,
		'SUM': 6,
		'WIZ': 6,
	}
	const mpTier = {
		'WAR': 2,
		'CRU': 3,
		'SHD': 3,
		'MNK': 2,
		'ROG': 2,
		'RNG': 3,
		'BRD': 3,
		'DRU': 4,
		'CLR': 4,
		'SHM': 4,
		'NEC': 5,
		'ENC': 5,
		'SUM': 5,
		'WIZ': 5,
	}
	const spTier = {
		'WAR': 2,
		'CRU': 3,
		'SHD': 3,
		'MNK': 2,
		'ROG': 2,
		'RNG': 3,
		'BRD': 4,
		'DRU': 5,
		'CLR': 5,
		'SHM': 5,
		'NEC': 3,
		'ENC': 5,
		'SUM': 3,
		'WIZ': 3,
	}

	function str(fresh) {
		return my.str +
			create.raceAttrs[my.race][0] +
			create.jobAttrs[my.jobLong][0] + getEqTotal('str') + getEqTotal('allStats')
	}
	function sta(fresh) {
		return my.sta +
			create.raceAttrs[my.race][1] +
			create.jobAttrs[my.jobLong][1] + getEqTotal('sta') + getEqTotal('allStats')
	}
	function agi(fresh) {
		return my.agi +
			create.raceAttrs[my.race][2] +
			create.jobAttrs[my.jobLong][2] + getEqTotal('agi') + getEqTotal('allStats')
	}
	function dex(fresh) {
		return my.dex +
			create.raceAttrs[my.race][3] +
			create.jobAttrs[my.jobLong][3] + getEqTotal('dex') + getEqTotal('allStats')
	}
	function wis(fresh) {
		return my.wis +
			create.raceAttrs[my.race][4] +
			create.jobAttrs[my.jobLong][4] + getEqTotal('wis') + getEqTotal('allStats')
	}
	function intel(fresh) {
		return my.intel +
			create.raceAttrs[my.race][5] +
			create.jobAttrs[my.jobLong][5] + getEqTotal('intel') + getEqTotal('allStats')
	}
	function cha(fresh) {
		return my.cha +
			create.raceAttrs[my.race][6] +
			create.jobAttrs[my.jobLong][6] + getEqTotal('cha') + getEqTotal('allStats')
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
			stats.cache.armor = round(stats.cache.armor)
		}
		return stats.cache.armor
	}
	function armorReductionRatio() {
		// max of 75% reduction
		return (stats.armor() > 3000 ? 3000 : stats.armor()) / 4000
	}

	function attack(type) {
		atk = 0
		type = type || items.eq[12].weaponSkill
		atk = getEqTotal('attack') + (getEqTotal('str') * .33)
		// offense
		atk += (offense() * 1.66)
		// primary weapon
		if (type === 'One-hand Slash') atk += (oneHandSlash() * 2.66)
		else if (type === 'One-hand Blunt') atk += (oneHandBlunt() * 2.66)
		else if (type === 'Piercing') atk += (piercing() * 2.66)
		else if (type === 'Two-hand Slash') atk += (twoHandSlash() * 2.66)
		else if (type === 'Two-hand Blunt') atk += (twoHandBlunt() * 2.66)
		else if (type === 'Archery') atk += (archery() * 2.66)
		else if (type === 'Hand-to-Hand') atk += (handToHand() * 2.66)
		//info('stats.missChance', type, ~~atk)
		// buffs
		if (my.buffFlags.spiritOfTheHunter) {
			atk += skills.RNG[11].spellDamage(my.buffs.spiritOfTheHunter.level)
		}
		return ~~atk
		//else atk += (handToHand() * (my.job === 'MNK' ? 2.66 : .33))
	}
	function offense(fresh) {
		return getStatTotal('offense') + getEqTotal('allSkills')
	}
	function defense(fresh) {
		return getStatTotal('defense') + getEqTotal('allSkills')
	}
	function oneHandSlash(fresh) {
		return getStatTotal('oneHandSlash') + getEqTotal('allSkills')
	}
	function oneHandBlunt(fresh) {
		return getStatTotal('oneHandBlunt') + getEqTotal('allSkills')
	}
	function piercing(fresh) {
		return getStatTotal('piercing') + getEqTotal('allSkills')
	}
	function twoHandSlash(fresh) {
		return getStatTotal('twoHandSlash') + getEqTotal('allSkills')
	}
	function twoHandBlunt(fresh) {
		return getStatTotal('twoHandBlunt') + getEqTotal('allSkills')
	}
	function handToHand(fresh) {
		return getStatTotal('handToHand') + getEqTotal('allSkills')
	}
	function archery(fresh) {
		return getStatTotal('archery') + getEqTotal('allSkills')
	}
	function dualWield(fresh) {
		return getStatTotal('dualWield') + getEqTotal('allSkills')
	}
	function doubleAttack(fresh) {
		return getStatTotal('doubleAttack') + getEqTotal('allSkills')
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
		return getStatTotal('dodge') + getEqTotal('allSkills')
	}
	function parry(fresh) {
		return getStatTotal('parry') + getEqTotal('allSkills')
	}
	function riposte(fresh) {
		return getStatTotal('riposte') + getEqTotal('allSkills')
	}
	function dodgeChance(fresh) {
		return dodge() / 2500 + (agi() / 2000)
	}
	function parryChance(fresh) {
		return parry() / 2500 + (dex() / 2000)
	}
	function riposteChance(fresh) {
		return riposte() / 2500 + (dex() / 2000)
	}
	function critChance(fresh) {
		if (fresh || typeof stats.cache.crit === 'undefined') {
			stats.cache.crit = ( (dex() / 75) + ng.dimRetCrit(getEqTotal('crit')) ) / 100
		}
		return stats.cache.crit
	}
	function spellDamage(forceCrit, getNonCrit) {
		max = spell.data.spellDamage(my.skills[spell.index])
		// console.info('spellDamage 1', max)
		// enhance by type % and ALL%
		enhanceDamage = getEqTotal('enhance'+ _.capitalize(spell.data.damageType))
		enhanceDamage += getEqTotal('enhanceAll')
		// wis boosts conjuration
		if (my[spell.data.spellType] === 'conjuration') enhanceDamage += (stats.wis() / 15)
		else if (my[spell.data.spellType] === 'evocation') enhanceDamage += (stats.intel() / 15)
		else if (my[spell.data.spellType] === 'alteration') enhanceDamage += (stats.cha() / 15)

		max = max * (1 + (enhanceDamage / 100))
		// add spell damage by type and ALL
		addedDamage = getEqTotal('addedSpell'+ _.capitalize(spell.data.damageType))
		addedDamage += getEqTotal('addedSpellAll')

		if (my.buffFlags.mirrorImage) addedDamage += my.buffs.mirrorImage.damage

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
		weaponSkill = items.eq[12]?.name ? items.eq[12].weaponSkill : 'Hand-to-Hand'
		atk = attack(weaponSkill)
		if (items.eq[12].minDamage) {
			min = items.eq[12].minDamage
			max = items.eq[12].maxDamage
		}
		else {
			h2h = handToHand()
			if (my.job === 'MNK') {
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
		weaponSkill = items.eq[12]?.name ? items.eq[12].weaponSkill : 'Hand-to-Hand'
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
			if (my.job === 'MNK') {
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
		weaponSkill = items.eq[13]?.name ? items.eq[13].weaponSkill : 'Hand-to-Hand'
		atk = attack(weaponSkill)
		if (items.eq[13].minDamage) {
			min = items.eq[13].minDamage
			max = items.eq[13].maxDamage
		}
		else {
			h2h = handToHand()
			if (my.job === 'MNK') {
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
		}
		return stats.cache.resistLightning
	}
	function resistFire(fresh) {
		if (fresh || typeof stats.cache.resistFire === 'undefined') {
			stats.cache.resistFire = getStatTotal('resistFire') + getEqTotal('resistAll')
			stats.cache.resistFire += my.buffFlags.manaShell ? buffs.manaShell.resistAll[my.buffs.manaShell.level] : 0
		}
		return stats.cache.resistFire
	}
	function resistIce(fresh) {
		if (fresh || typeof stats.cache.resistIce === 'undefined') {
			stats.cache.resistIce = getStatTotal('resistIce') + getEqTotal('resistAll')
			stats.cache.resistIce += my.buffFlags.manaShell ? buffs.manaShell.resistAll[my.buffs.manaShell.level] : 0
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
		else if (my.job === 'ROG') return base + _.min([my.level * 5, 240])
		else if (averageOneHandSlashJobs.includes(my.job)) return base + my.level * 4
		else return 0
	}
	function oneHandBluntMax(fresh) {
		if (my.race === 'Barbarian') base = 10
		else if (my.race === 'Half Elf') base = 5
		else base = 0
		if (my.job === 'MNK') return base + my.level * 5
		else if (my.job === 'RNG') return base + _.min([my.level * 5, 240])
		else if (my.job === 'ROG') return base + _.min([my.level * 5, 225])
		else return base + my.level * 4
	}
	function piercingMax(fresh) {
		if (my.race === 'Halfling') base = 10
		else if (my.race === 'Half Elf') base = 5
		else base = 0
		if (my.job === 'ROG') return base + my.level * 5
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
		if (my.job === 'MNK') return base + my.level * 5
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
		if (my.job === 'MNK') return base + my.level * 5
		else if (my.job === 'RNG') return base + _.min([my.level * 5, 225])
		else if (twoHandBluntAverageJobs.includes(my.job)) return base + my.level * 4
		else return 0
	}
	function dualWieldMax(fresh) {
		base = my.race === 'Half Elf' ? 5 : 0
		if (my.job === 'MNK' ||
			my.job === 'ROG' && my.level >= 13 ||
			my.job === 'RNG' && my.level >= 17) {
			return base + my.level * 5
		}
		else if (
			my.job === 'WAR' && my.level >= 13 ||
			my.job === 'BRD' && my.level >= 17) {
			return base + my.level * 4
		}
		else return 0
	}
	function doubleAttackMax(fresh) {
		base = my.race === 'Half Elf' ? 5 : 0
		if (
			my.job === 'CRU' && my.level >= 20 ||
			my.job === 'SHD' && my.level >= 20 ||
			my.job === 'MNK' && my.level >= 15 ||
			my.job === 'ROG' && my.level >= 16 ||
			my.job === 'RNG' && my.level >= 20) {
			return base + my.level * 5
		}
		else if (my.job === 'WAR' && my.level >= 15) return base + my.level * 4
		else return 0
	}
	function dodgeMax(fresh) {
		if (my.race === 'Halfling') base = 10
		else if (my.race === 'Half Elf') base = 5
		else base = 0
		if (
			(my.job === 'ROG' && my.level >= 4) ||
			(my.job === 'BRD' && my.level >= 10)) {
			return base + my.level * 4
		}
		else if (
			(my.job === 'WAR' && my.level >= 6) ||
			(my.job === 'CRU' && my.level >= 10) ||
			(my.job === 'SHD' && my.level >= 10) ||
			(my.job === 'MNK') ||
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
			(my.job === 'WAR' && my.level >= 10) ||
			(my.job === 'CRU' && my.level >= 17)) {
			return base + my.level * 5
		}
		else if (
			(my.job === 'SHD' && my.level >= 17) ||
			(my.job === 'RNG' && my.level >= 18)) {
			return base + my.level * 4
		}
		else if (
			(my.job === 'MNK' && my.level >= 12) ||
			(my.job === 'ROG' && my.level >= 12)) {
			return base + my.level * 3
		}
		else return 0
	}
	function riposteMax(fresh) {
		base = my.race === 'Half Elf' ? 5 : 0
		if (
			(my.job === 'WAR' && my.level >= 25) ||
			(my.job === 'SHD' && my.level >= 30)) {
			return base + my.level * 5
		}
		else if (
			(my.job === 'CRU' && my.level >= 30) ||
			(my.job === 'MNK' && my.level >= 35)) {
			return base + my.level * 4
		}
		else if (
			(my.job === 'ROG' && my.level >= 30) ||
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
	function hpMax(fresh) {
		value = ~~(
			((stats.sta() * hpTier[my.job]) * (my.level / 50) +
				(my.level * (hpTier[my.job] * 2.5) + 20)) * hpPercentBonus()
			+ getEqTotal('hp')
		)
		if (my.buffFlags.sealOfRedemption) value += (my.buffs.sealOfRedemption.damage)
		if (my.buffFlags.zealousResolve) value += (my.buffs.zealousResolve.damage)
		return value
	}
	function mpMax(fresh) {
		return ~~(
			((stats.intel() * mpTier[my.job]) * (my.level / 50) +
				(my.level * (mpTier[my.job] * 2.5) + 12)) * mpPercentBonus()
			+ getEqTotal('mp')
		)
	}

	function spMax(fresh) {
		return ~~(
			((stats.cha() * spTier[my.job]) * (my.level / 50) +
				(my.level * (spTier[my.job] * 2.5) + 8)) +
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
		return ~~(baseHpRegen() + getEqTotal('hpRegen'))
	}
	function mpRegen(fresh) {
		return ~~(baseMpRegen() + getEqTotal('mpRegen'))
	}
	function spRegen(fresh) {
		return ~~(baseSpRegen() + getEqTotal('spRegen'))
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
			if (my.buffFlags.bulwark) stats.cache.phyMit += skills.WAR[9].mitigation[my.buffs.bulwark.level]
		}
		return stats.cache.phyMit
	}
	function magMit(fresh) {
		if (fresh || typeof stats.cache.magMit === 'undefined') {
			stats.cache.magMit = getEqTotal('magMit')
			if (my.buffFlags.bulwark) stats.cache.magMit += skills.WAR[9].mitigation[my.buffs.bulwark.level]
		}
		return stats.cache.magMit
	}
	function leech(fresh) {
		return getEqTotal('leech')
	}
	function wraith(fresh) {
		return getEqTotal('wraith')
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
			if (stats.cache.resistParalyze > 50) stats.cache.resistParalyze = 50
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
			if (stats.cache.resistFear > 50) stats.cache.resistFear = 50
		}
		return stats.cache.resistFear
	}
	function resistStun(fresh) {
		// can't do anything
		if (fresh || typeof stats.cache.resistFear === 'undefined') {
			stats.cache.resistStun = getEqTotal('resistStun')
			if (stats.cache.resistStun > 50) stats.cache.resistStun = 50
		}
		return stats.cache.resistStun
	}
	function resistSilence(fresh) {
		// cannot cast spells
		if (fresh || typeof stats.cache.resistFear === 'undefined') {
			stats.cache.resistSilence = getEqTotal('resistSilence')
			stats.cache.resistSilence += my.buffFlags.manaShell ? buffs.manaShell.silence[my.buffs.manaShell.level] : 0
			if (stats.cache.resistSilence > 50) stats.cache.resistSilence = 50
		}
		return stats.cache.resistSilence
	}
})($, TweenMax, _);