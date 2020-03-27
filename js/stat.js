var stat;
!function() {
	stat = {
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
		damageString,
		resistBlood,
		resistPoison,
		resistArcane,
		resistLightning,
		resistFire,
		resistIce,
		getPropMax,
		setResources,
		maxHp,
		maxMp,
		maxSp,
	}
	// jobs grouped by things for include checks
	var offensiveJobs = ['SHD', 'MNK', 'ROG', 'RNG']
	var defensiveJobs = ['WAR', 'PAL', 'SHD']
	var averagePunchJobs = ['WAR', 'PAL', 'SHD', 'ROG', 'RNG', 'BRD']
	var wisCasterJobs = ['DRU', 'CLR', 'SHM']
	var intCasterJobs = ['NEC', 'ENC', 'SUM', 'WIZ']
	var allCasterJobs = ['CLR', 'DRU', 'SHM', 'BRD', 'NEC', 'ENC', 'SUM', 'WIZ']
	var hybridJobs = ['PAL', 'SHD', 'RNG']
	var twoHandBluntAverageJobs = ['WAR', 'PAL', 'SHD', 'CLR', 'DRU', 'SHM', 'NEC', 'ENC', 'SUM', 'WIZ']
	var tankJobs = ['WAR', 'PAL', 'SHD']
	var averageArcherJobs = ['WAR', 'PAL', 'SHD', 'ROG', 'BRD']
	var averagePiercingJobs = ['WAR', 'BRD', 'SHM', 'NEC', 'ENC', 'SUM', 'WIZ']
	var averageOneHandSlashJobs = ['WAR', 'PAL', 'SHD', 'BRD', 'DRU']

	const hpTier = {
		'WAR': 5,
		'PAL': 4.5,
		'SHD': 4.5,
		'MNK': 4,
		'ROG': 4,
		'RNG': 4,
		'BRD': 4,
		'DRU': 3.5,
		'CLR': 3.5,
		'SHM': 3.5,
		'NEC': 3,
		'ENC': 3,
		'SUM': 3,
		'WIZ': 3,
	}
	const mpTier = {
		'WAR': 1,
		'PAL': 3,
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
		'WAR': 1,
		'PAL': 3,
		'SHD': 3,
		'MNK': 2,
		'ROG': 2,
		'RNG': 3,
		'BRD': 5,
		'DRU': 4.5,
		'CLR': 5,
		'SHM': 4.5,
		'NEC': 2.5,
		'ENC': 5,
		'SUM': 2.5,
		'WIZ': 2.5,
	}
	var val
	var i
	var len
	var type
	var min
	var max
	var atk
	var h2h

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
		else val += (handToHand() * (my.job === 'MNK' ? 2.66 : .33))
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
	function damage() {
		min = 1
		max = 1
		atk = attack()
		if (items.eq[12].minDamage) {
			min = items.eq[12].minDamage
			max = items.eq[12].maxDamage
		}
		else {
			// TODO: Calculate punching damage
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

		return [~~min, ~~max]
	}
	function damageString(damage) {
		return damage[0] + '–' + damage[1]
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
		else if (prop === 'alteration' || prop === 'conjuration' || prop === 'evocation') resp = spellMax()
		return resp
	}
	function offenseMax() {
		if (offensiveJobs.includes(my.job)) return my.level * 5
		else if (intCasterJobs.includes(my.job)) return my.level * 3
		else return my.level * 4
	}
	function defenseMax() {
		if (defensiveJobs.includes(my.job)) return my.level * 5
		else if (intCasterJobs.includes(my.job)) return my.level * 3
		else return my.level * 4
	}
	function oneHandSlashMax() {
		if (my.job === 'RNG') return my.level * 5
		else if (my.job === 'ROG') return _.min([my.level * 5, 240])
		else if (averageOneHandSlashJobs.includes(my.job)) return my.level * 4
		else return 0
	}
	function oneHandBluntMax() {
		if (my.job === 'MNK') return my.level * 5
		else if (my.job === 'RNG') return _.min([my.level * 5, 240])
		else if (my.job === 'ROG') return _.min([my.level * 5, 225])
		else return my.level * 4
	}
	function piercingMax() {
		if (my.job === 'ROG') return my.level * 5
		else if (my.job === 'RNG') return _.min([my.level * 5, 240])
		else if (averagePiercingJobs.includes(my.job)) return my.level * 4
		else return 0
	}
	function archeryMax() {
		if (my.job === 'RNG') return my.level * 5
		else if (averageArcherJobs.includes(my.job)) return my.level * 2
		else return 0
	}
	function handToHandMax() {
		if (my.job === 'MNK') return my.level * 5
		else if (averagePunchJobs.includes(my.job)) return my.level * 2
		else return my.level
	}
	function twoHandSlashMax() {
		if (my.job === 'RNG') return _.min([my.level * 5, 225])
		else if (tankJobs.includes(my.job)) return my.level * 4
		else return 0
	}
	function twoHandBluntMax() {
		if (my.job === 'MNK') return my.level * 5
		else if (my.job === 'RNG') return _.min([my.level * 5, 225])
		else if (twoHandBluntAverageJobs.includes(my.job)) return my.level * 4
		else return 0
	}
	function dualWieldMax() {
		if (my.job === 'MNK' ||
			my.level === 'ROG' && my.level >= 13 ||
			my.level === 'RNG' && my.level >= 17) {
			return my.level * 5
		}
		else if (
			my.job === 'WAR' && my.level >= 13 ||
			my.job === 'BRD' && my.level >= 17) {
			return my.level * 4
		}
		else return 0
	}
	function doubleAttackMax() {
		if (
			my.job === 'PAL' && my.level >= 20 ||
			my.job === 'SHD' && my.level >= 20 ||
			my.job === 'MNK' && my.level >= 15 ||
			my.job === 'ROG' && my.level >= 16 ||
			my.job === 'RNG' && my.level >= 20) {
			return my.level * 5
		}
		else if (my.job === 'WAR' && my.level >= 15) return my.level * 4
		else return 0
	}
	function dodgeMax() {
		if (
			(my.job === 'ROG' && my.level >= 4) ||
			(my.job === 'BRD' && my.level >= 10)) {
			return my.level * 4
		}
		else if (
			(my.job === 'WAR' && my.level >= 6) ||
			(my.job === 'PAL' && my.level >= 10) ||
			(my.job === 'SHD' && my.level >= 10) ||
			(my.job === 'MNK') ||
			(my.job === 'RNG' && my.level >= 8)) {
			return my.level * 3
		}
		else if (
			wisCasterJobs.includes(my.job) && my.level >= 15 ||
			intCasterJobs.includes(my.job) && my.level >= 22) {
			return my.level * 2
		}
		else return 0
	}
	function parryMax() {
		if (
			(my.job === 'WAR' && my.level >= 10) ||
			(my.job === 'PAL' && my.level >= 17)) {
			return my.level * 5
		}
		else if (
			(my.job === 'SHD' && my.level >= 17) ||
			(my.job === 'RNG' && my.level >= 18)) {
			return my.level * 4
		}
		else if (
			(my.job === 'MNK' && my.level >= 12) ||
			(my.job === 'ROG' && my.level >= 12)) {
			return my.level * 3
		}
		else return 0
	}
	function riposteMax() {
		if (
			(my.job === 'WAR' && my.level >= 25) ||
			(my.job === 'SHD' && my.level >= 30)) {
			return my.level * 5
		}
		else if (
			(my.job === 'PAL' && my.level >= 30) ||
			(my.job === 'MNK' && my.level >= 35)) {
			return my.level * 4
		}
		else if (
			(my.job === 'ROG' && my.level >= 30) ||
			(my.job === 'RNG' && my.level >= 35)) {
			return my.level * 3
		}
		else return 0
	}
	function spellMax() {
		if (allCasterJobs.includes(my.job)) return my.level * 5
		else if (hybridJobs.includes(my.job) && my.level >= 9) return my.level * 4
		else return 0
	}
	function setResources() {
		my.maxHp = maxHp()
		my.maxMp = maxMp()
		my.maxSp = maxSp()
	}
	function maxHp() {
		return ~~(
			((stat.sta() * hpTier[my.job]) * (my.level / 50) +
				(my.level * (hpTier[my.job] * 2.5) + 20)) * hpPercentBonus()
			+ getEqTotal('hp') + getBuffTotal('hp')
		)
	}
	function maxMp() {
		return ~~(
			((stat.intel() * mpTier[my.job]) * (my.level / 50) +
				(my.level * (mpTier[my.job] * 2.5) + 12)) * mpPercentBonus()
			+ getEqTotal('mp') + getBuffTotal('mp')
		)
	}

	function maxSp() {
		return ~~(
			((stat.cha() * spTier[my.job]) * (my.level / 50) +
				(my.level * (spTier[my.job] * 2.5) + 8)) +
			getEqTotal('sp') + getBuffTotal('sp')
		)
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
}()