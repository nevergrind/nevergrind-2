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
		damage,
		damageString,
		resistBlood,
		resistPoison,
		resistArcane,
		resistLightning,
		resistFire,
		resistIce,
		getPropMax,
	}
	// jobs grouped by things for include checks
	var offensiveJobs = ['SHD', 'MNK', 'ROG', 'RNG']
	var defensiveJobs = ['WAR', 'PAL', 'SHD']
	var intCasterJobs = ['NEC', 'ENC', 'MAG', 'WIZ']
	var averagePunchJobs = ['WAR', 'PAL', 'SHD', 'ROG', 'RNG', 'BRD']
	var dualWieldJobs = ['MNK', 'ROG', 'RNG']
	var doubleAttackJobs = ['MNK', 'ROG', 'RNG', 'SHD', 'PAL']
	var averageDodgeJobs = ['WAR', 'PAL', 'SHD', 'MNK', 'RNG']
	var allCasterJobs = ['CLR', 'DRU', 'SHM', 'BRD', 'NEC', 'ENC', 'MAG', 'WIZ']

	function str() {
		return my.str +
			create.raceAttrs[my.race][0] +
			create.jobAttrs[my.jobLong][0]
	}
	function sta() {
		return my.sta +
			create.raceAttrs[my.race][1] +
			create.jobAttrs[my.jobLong][1]
	}
	function agi() {
		return my.agi +
			create.raceAttrs[my.race][2] +
			create.jobAttrs[my.jobLong][2]
	}
	function dex() {
		return my.dex +
			create.raceAttrs[my.race][3] +
			create.jobAttrs[my.jobLong][3]
	}
	function wis() {
		return my.wis +
			create.raceAttrs[my.race][4] +
			create.jobAttrs[my.jobLong][4]
	}
	function intel() {
		return my.intel +
			create.raceAttrs[my.race][5] +
			create.jobAttrs[my.jobLong][5]
	}
	function cha() {
		return my.cha +
			create.raceAttrs[my.race][6] +
			create.jobAttrs[my.jobLong][6]
	}
	function armor() {
		var val = ~~((agi() * .66) +(defense() * 3.3))
		for (var i = 0; i<= 14; i++) {
			if (eq[i].armor) val += eq[i].armor
		}
		return val
	}
	function attack() {
		var val = 0
		var type = eq[12].itemType
		for (var i = 0; i<= 14; i++) {
			if (eq[i].attack) val += eq[i].attack
		}
		// offense
		val += (offense() * 1.66)
		// primary weapon
		if (type === 'oneHandSlashers') val += (oneHandSlash() * 2.66)
		else if (type === 'oneHandBlunts') val += (oneHandBlunt() * 2.66)
		else if (type === 'piercers') val += (piercing() * 2.66)
		else if (type === 'twoHandSlashers') val += (twoHandSlash() * 2.66)
		else if (type === 'twoHandBlunts') val += (twoHandBlunt() * 2.66)
		else if (type === 'bows') val += (archery() * 2.66)
		else val += (handToHand() * (my.job === 'MNK' ? 2.66 : .33))
		return ~~val
	}
	function offense() {
		var val = my.offense
		for (var i = 0; i<= 14; i++) {
			if (eq[i].offense) val += eq[i].offense
		}
		return val
	}
	function defense() {
		var val = my.defense
		for (var i = 0; i<= 14; i++) {
			if (eq[i].defense) val += eq[i].defense
		}
		return val
	}
	function oneHandSlash() {
		var val = my.oneHandSlash
		for (var i = 0; i<= 14; i++) {
			if (eq[i].oneHandSlash) val += eq[i].oneHandSlash
		}
		return val
	}
	function oneHandBlunt() {
		var val = my.oneHandBlunt
		for (var i = 0; i<= 14; i++) {
			if (eq[i].oneHandBlunt) val += eq[i].oneHandBlunt
		}
		return val
	}
	function piercing() {
		var val = my.piercing
		for (var i = 0; i<= 14; i++) {
			if (eq[i].piercing) val += eq[i].piercing
		}
		return val
	}
	function twoHandSlash() {
		var val = my.twoHandSlash
		for (var i = 0; i<= 14; i++) {
			if (eq[i].twoHandSlash) val += eq[i].twoHandSlash
		}
		return val
	}
	function twoHandBlunt() {
		var val = my.twoHandBlunt
		for (var i = 0; i<= 14; i++) {
			if (eq[i].twoHandBlunt) val += eq[i].twoHandBlunt
		}
		return val
	}
	function handToHand() {
		var val = my.handToHand
		for (var i = 0; i<= 14; i++) {
			if (eq[i].handToHand) val += eq[i].handToHand
		}
		return val
	}
	function archery() {
		var val = my.archery
		for (var i = 0; i<= 14; i++) {
			if (eq[i].archery) val += eq[i].archery
		}
		return val
	}
	function damage() {
		var min = 1
		var max = 1
		var atk = attack()
		if (eq[12].minDamage) {
			min = eq[12].minDamage
			max = eq[12].maxDamage
		}
		else {
			// TODO: Calculate punching damage
			var h2h = handToHand()
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
		return my.resistBlood
	}
	function resistPoison() {
		return my.resistPoison
	}
	function resistArcane() {
		return my.resistArcane
	}
	function resistLightning() {
		return my.resistLightning
	}
	function resistFire() {
		return my.resistFire
	}
	function resistIce() {
		return my.resistIce
	}
	/*
	allProps: [
		'offense',
		'defense',
		'oneHandSlash',
		'oneHandBlunt',
		'piercing',
		'archery',
		'handToHand',
		'twoHandSlash',
		'twoHandBlunt',
		'dualWield',
		'doubleAttack',
		'dodge',
		'parry',
		'riposte',
		'alteration',
		'conjuration',
		'evocation',
	],
	 */
	function getPropMax(prop) {
		var resp = 2
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
		else if (prop === 'conjuration') resp = conjurationMax()
		else if (prop === 'evocation') resp = evocationMax()
		return resp
	}
	function offenseMax() {
		if (offensiveJobs.includes(my.job)) {
			return my.level * 5
		}
		else if (intCasterJobs.includes(my.job)) {
			return my.level * 3
		}
		else return my.level * 4
	}
	function defenseMax() {
		if (defensiveJobs.includes(my.job)) {
			return my.level * 5
		}
		else if (intCasterJobs.includes(my.job)) {
			return my.level * 3
		}
		else return my.level * 4
	}
	function oneHandSlashMax() {
		if (my.job === 'RNG') return my.level * 5
		else if (my.job === 'ROG') return _.min([my.level * 5, 240])
		else return my.level * 4
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
		else return my.level * 4
	}
	function archeryMax() {
		if (my.job === 'RNG') return my.level * 5
		else return my.level * 2
	}
	function handToHandMax() {
		if (my.job === 'MNK') return my.level * 5
		else if (averagePunchJobs.includes(my.job)) return my.level * 2
		else return my.level
	}
	function twoHandSlashMax() {
		if (my.job === 'RNG') return _.min([my.level * 5, 225])
		else return my.level * 4
	}
	function twoHandBluntMax() {
		if (my.job === 'MNK') return my.level * 5
		else if (my.job === 'RNG') return _.min([my.level * 5, 225])
		else return my.level * 4
	}
	function dualWieldMax() {
		if (dualWieldJobs.includes(my.job)) return my.level * 5
		else return my.level * 4
	}
	function doubleAttackMax() {
		if (doubleAttackJobs.includes(my.job)) return my.level * 5
		else return my.level * 4
	}
	function dodgeMax() {
		if (my.job === 'ROG' || my.job === 'BRD') return my.level * 4
		else if (averageDodgeJobs.includes(my.job)) return my.level * 3
		else return my.level * 2
	}
	function parryMax() {
		if (my.job === 'WAR' || my.job === 'PAL') return my.level * 5
		else if (my.job === 'SHD' || my.job === 'RNG') return my.level * 4
		else return my.level * 3
	}
	function riposteMax() {
		if (my.job === 'WAR' || my.job === 'SHD') return my.level * 5
		else if (my.job === 'PAL' || my.job === 'MNK') return my.level * 4
		else return my.level * 3
	}
	function alterationMax() {
		if (allCasterJobs.includes(my.job)) return my.level * 5
		else return my.level * 4
	}
	function conjurationMax() {
		if (allCasterJobs.includes(my.job)) return my.level * 5
		else return my.level * 4
	}
	function evocationMax() {
		if (allCasterJobs.includes(my.job)) return my.level * 5
		else return my.level * 4
	}
}()