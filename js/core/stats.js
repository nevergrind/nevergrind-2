var stats = {};
(function($, TweenMax, _, undefined) {
	stats = {
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
		damage,
		offhandDamage,
		rangedDamage,
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
		armor,
		armorReductionRatio,
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
	var val, base, i, len, type, min, max, atk, h2h

	function str() {
		return my.str +
			create.raceAttrs[my.race][0] +
			create.jobAttrs[my.jobLong][0] + getEqTotal('str')
	}
	function sta() {
		return my.sta +
			create.raceAttrs[my.race][1] +
			create.jobAttrs[my.jobLong][1] + getEqTotal('sta')
	}
	function agi() {
		return my.agi +
			create.raceAttrs[my.race][2] +
			create.jobAttrs[my.jobLong][2] + getEqTotal('agi')
	}
	function dex() {
		return my.dex +
			create.raceAttrs[my.race][3] +
			create.jobAttrs[my.jobLong][3] + getEqTotal('dex')
	}
	function wis() {
		return my.wis +
			create.raceAttrs[my.race][4] +
			create.jobAttrs[my.jobLong][4] + getEqTotal('wis')
	}
	function intel() {
		return my.intel +
			create.raceAttrs[my.race][5] +
			create.jobAttrs[my.jobLong][5] + getEqTotal('intel')
	}
	function cha() {
		return my.cha +
			create.raceAttrs[my.race][6] +
			create.jobAttrs[my.jobLong][6] + getEqTotal('cha')
	}
	function armor() {
		return ~~((agi() * .66) +(defense() * 3.3)) + getEqTotal('armor')
	}
	function armorReductionRatio() {
		// max of 75% reduction
		return (my.armor > 3000 ? 3000 : my.armor) / 4000
	}

	function attack() {
		val = 0
		type = items.eq[12].itemType
		for (i = 0; i<= 14; i++) {
			if (items.eq[i].attack) val += items.eq[i].attack
		}
		// offense
		val += (offense() * 1.66)
		// primary weapon
		if (type === 'oneHandSlashers') val += (oneHandSlash() * 2.66)
		else if (type === 'oneHandBlunts' || type === 'focus') val += (oneHandBlunt() * 2.66)
		else if (type === 'piercers') val += (piercing() * 2.66)
		else if (type === 'twoHandSlashers') val += (twoHandSlash() * 2.66)
		else if (type === 'twoHandBlunts' || type === 'staves') val += (twoHandBlunt() * 2.66)
		else if (type === 'archery') val += (archery() * 2.66)
		//else val += (handToHand() * (my.job === 'MNK' ? 2.66 : .33))
		else val += (handToHand() * 2.66)
		return ~~val
	}
	function offense() {
		return getStatTotal('offense')
	}
	function defense() {
		return getStatTotal('defense')
	}
	function oneHandSlash() {
		return getStatTotal('oneHandSlash')
	}
	function oneHandBlunt() {
		return getStatTotal('oneHandBlunt')
	}
	function piercing() {
		return getStatTotal('piercing')
	}
	function twoHandSlash() {
		return getStatTotal('twoHandSlash')
	}
	function twoHandBlunt() {
		return getStatTotal('twoHandBlunt')
	}
	function handToHand() {
		return getStatTotal('handToHand')
	}
	function archery() {
		return getStatTotal('archery')
	}
	function dualWield() {
		return getStatTotal('dualWield')
	}
	function doubleAttack() {
		return getStatTotal('doubleAttack')
	}
	function dodge() {
		return getStatTotal('dodge')
	}
	function parry() {
		return getStatTotal('parry')
	}
	function riposte() {
		return getStatTotal('riposte')
	}
	function critChance() {
		//return ( ((5) + getEqTotal('crit') ) / 100)
		return (ng.dimRetCrit(5 + getEqTotal('crit')) ) / 100
	}
	function damage(skipSkillChecks, forceCrit) {
		min = 1
		max = 1
		atk = attack()
		if (items.eq[12].minDamage) {
			min = items.eq[12].minDamage
			max = items.eq[12].maxDamage
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

		isCrit = forceCrit || my.crit > rand()
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
			combat.levelSkillCheck(typeof items.eq[12] === 'object' ? items.eq[12].weaponSkill : 'handToHand')
		}
		return {
			min: min,
			max: max,
			damage: _.random(min, max),
			isCrit: isCrit,
			enhancedDamage: 1,
			damageType: 'physical',
		}
	}
	function offhandDamage() {
		if (!my.dualWield) return [0, 0, false]
		min = 1
		max = 1
		atk = attack()
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

		isCrit = my.crit > rand()
		if (isCrit) {
			min *= 1.5
			max *= 1.5
		}

		combat.levelSkillCheck(typeof items.eq[13] === 'object' ? items.eq[13].weaponSkill : 'handToHand')
		combat.levelSkillCheck('dualWield')
		return {
			min: min,
			max: max,
			damage: _.random(min, max),
			isCrit: isCrit,
			enhancedDamage: 1,
			damageType: 'physical',
		}
	}
	function rangedDamage() {
		min = 1
		max = 1
		atk = attack()
		if (!my.archery || items.eq[14].itemType !== 'bows') return [0, 0, false]
		min = items.eq[14].minDamage * (1 + (atk * .002))
		max = items.eq[14].maxDamage * (1 + (atk * .002))

		isCrit = my.crit > rand()
		if (isCrit) {
			min *= 2
			max *= 2
		}

		combat.levelSkillCheck('archery')
		return {
			min: min,
			max: max,
			damage: _.random(min, max),
			isCrit: isCrit,
			enhancedDamage: 1,
			isRanged: true,
			damageType: 'physical',
		}
	}
	function resistBlood() {
		return getStatTotal('resistBlood')
	}
	function resistPoison() {
		return getStatTotal('resistPoison')
	}
	function resistArcane() {
		return getStatTotal('resistArcane')
	}
	function resistLightning() {
		return getStatTotal('resistLightning')
	}
	function resistFire() {
		return getStatTotal('resistFire')
	}
	function resistIce() {
		return getStatTotal('resistIce')
	}
	function getStatTotal(attr) {
		val = my[attr] || 0
		i = 0
		for (; i<15; i++) {
			if (items.eq[i][attr]) val += items.eq[i][attr]
		}
		return val
	}
	function getEqTotal(attr) {
		val = 0
		i = 0
		for (; i<15; i++) {
			if (items.eq[i][attr]) val += items.eq[i][attr]
		}
		return val
	}
	function getPropMax(prop) {
		var resp = 0
		if (prop === 'offense') resp = offenseMax()
		else if (prop === 'defense') resp = defenseMax()
		else if (prop === 'oneHandSlash') resp = oneHandSlashMax()
		else if (prop === 'oneHandBlunt') resp = oneHandBluntMax()
		else if (prop === 'piercing') resp = piercingMax()
		else if (prop === 'archery') resp = archeryMax()
		else if (prop === 'handToHand') resp = handToHandMax()
		else if (prop === 'twoHandSlash') resp = twoHandSlashMax()
		else if (prop === 'twoHandBlunt') resp = twoHandBluntMax()
		else if (prop === 'dualWield') resp = dualWieldMax()
		else if (prop === 'doubleAttack') resp = doubleAttackMax()
		else if (prop === 'dodge') resp = dodgeMax()
		else if (prop === 'parry') resp = parryMax()
		else if (prop === 'riposte') resp = riposteMax()
		else if (prop === 'alteration') resp = alterationMax()
		else if (prop === 'evocation') resp = evocationMax()
		else if (prop === 'conjuration') resp = conjurationMax()
		return resp
	}
	function offenseMax() {
		if (my.race === 'Halfling') base = 10
		else if (my.race === 'Half Elf') base = 5
		else base = 0
		if (offensiveJobs.includes(my.job)) return base + my.level * 5
		else if (intCasterJobs.includes(my.job)) return base + my.level * 3
		else return base + my.level * 4
	}
	function defenseMax() {
		base = my.race === 'Dwarf' ? 5 : 0
		if (defensiveJobs.includes(my.job)) return base + my.level * 5
		else if (intCasterJobs.includes(my.job)) return base + my.level * 3
		else return base + my.level * 4
	}
	function oneHandSlashMax() {
		if (my.race === 'Human') base = 10
		else if (my.race === 'Half Elf') base = 5
		else base = 0
		if (my.job === 'RNG') return base + my.level * 5
		else if (my.job === 'ROG') return base + _.min([my.level * 5, 240])
		else if (averageOneHandSlashJobs.includes(my.job)) return base + my.level * 4
		else return 0
	}
	function oneHandBluntMax() {
		if (my.race === 'Barbarian') base = 10
		else if (my.race === 'Half Elf') base = 5
		else base = 0
		if (my.job === 'MNK') return base + my.level * 5
		else if (my.job === 'RNG') return base + _.min([my.level * 5, 240])
		else if (my.job === 'ROG') return base + _.min([my.level * 5, 225])
		else return base + my.level * 4
	}
	function piercingMax() {
		if (my.race === 'Halfling') base = 10
		else if (my.race === 'Half Elf') base = 5
		else base = 0
		if (my.job === 'ROG') return base + my.level * 5
		else if (my.job === 'RNG') return base + _.min([my.level * 5, 240])
		else if (averagePiercingJobs.includes(my.job)) return base + my.level * 4
		else return 0
	}
	function archeryMax() {
		base = my.race === 'Half Elf' ? 5 : 0
		if (my.job === 'RNG') return base + my.level * 5
		else if (averageArcherJobs.includes(my.job)) return base + my.level * 2
		else return 0
	}
	function handToHandMax() {
		base = my.race === 'Half Elf' ? 5 : 0
		if (my.job === 'MNK') return base + my.level * 5
		else if (averagePunchJobs.includes(my.job)) return base + my.level * 2
		else return my.level
	}
	function twoHandSlashMax() {
		if (my.race === 'Human' || my.race === 'Orc') base = 10
		else if (my.race === 'Half Elf') base = 5
		else base = 0
		if (my.job === 'RNG') return base + _.min([my.level * 5, 225])
		else if (tankJobs.includes(my.job)) return base + my.level * 4
		else return 0
	}
	function twoHandBluntMax() {
		if (my.race === 'Barbarian' || my.race === 'Orc') base = 10
		else if (my.race === 'Half Elf') base = 5
		else base = 0
		if (my.job === 'MNK') return base + my.level * 5
		else if (my.job === 'RNG') return base + _.min([my.level * 5, 225])
		else if (twoHandBluntAverageJobs.includes(my.job)) return base + my.level * 4
		else return 0
	}
	function dualWieldMax() {
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
	function doubleAttackMax() {
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
	function dodgeMax() {
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
	function parryMax() {
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
	function riposteMax() {
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
	function alterationMax() {
		base = my.race === 'Dwarf' || my.race === 'Seraph' ? 5 : 0
		if (allCasterJobs.includes(my.job)) return base + my.level * 5
		else if (hybridJobs.includes(my.job)) return base + my.level * 4
		else return 0
	}
	function evocationMax() {
		if (my.race === 'High Elf') base = 10
		else if (my.race === 'Seraph') base = 5
		else base = 0
		if (allCasterJobs.includes(my.job)) return base + my.level * 5
		else if (hybridJobs.includes(my.job)) return base + my.level * 4
		else return 0
	}
	function conjurationMax() {
		if (my.race === 'Troll') base = 10
		else if (my.race === 'Seraph') base = 5
		else base = 0
		if (allCasterJobs.includes(my.job)) return base + my.level * 5
		else if (hybridJobs.includes(my.job)) return base + my.level * 4
		else return 0
	}
	function setAllResources() {
		my.hpMax = hpMax()
		my.mpMax = mpMax()
		my.spMax = spMax()
	}
	function hpMax() {
		return ~~(
			((stats.sta() * hpTier[my.job]) * (my.level / 50) +
				(my.level * (hpTier[my.job] * 2.5) + 20)) * hpPercentBonus()
			+ getEqTotal('hp') + getBuffTotal('hp')
		)
	}
	function mpMax() {
		return ~~(
			((stats.intel() * mpTier[my.job]) * (my.level / 50) +
				(my.level * (mpTier[my.job] * 2.5) + 12)) * mpPercentBonus()
			+ getEqTotal('mp') + getBuffTotal('mp')
		)
	}

	function spMax() {
		return ~~(
			((stats.cha() * spTier[my.job]) * (my.level / 50) +
				(my.level * (spTier[my.job] * 2.5) + 8)) +
			getEqTotal('sp') + getBuffTotal('sp')
		)
	}
	// troll 9, normal 5
	function baseHpRegen() {
		return (my.race === 'Troll' ? 3 : 1) + (my.level * (my.race === 'Troll' ? .12 : .08))
	}
	// high elf 16, normal 10
	function baseMpRegen() {
		return (my.race === 'High Elf' ? 4 : 2) + (my.level * (my.race === 'High Elf' ? .24 : .16))
	}
	// human 16, normal 10
	function baseSpRegen() {
		return (my.race === 'Human' ? 4 : 2) + (my.level * (my.race === 'Human' ? .24 : .16))
	}
	function hpRegen() {
		return ~~(baseHpRegen() + getEqTotal('hpRegen') + getBuffTotal('hpRegen'))
	}
	function mpRegen() {
		return ~~(baseMpRegen() + getEqTotal('mpRegen') + getBuffTotal('mpRegen'))
	}
	function spRegen() {
		return ~~(baseSpRegen() + getEqTotal('spRegen') + getBuffTotal('spRegen'))
	}

	function hpPercentBonus() {
		return 1 + (getStatTotal('increaseHpPercent') / 100);
	}
	function mpPercentBonus() {
		return 1 + (getStatTotal('increaseMpPercent') / 100);
	}
	function getBuffTotal(attr) {
		val = 0
		i = 0
		len = buff.length
		for (; i<len; i++) {
			if (buff[i][attr]) val += buff[i][attr]
		}
		return val
	}
})($, TweenMax, _, );