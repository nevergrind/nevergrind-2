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
		dualWieldMax,
	}
	// jobs grouped by things for include checks
	var offensiveJobs = ['SHD', 'MNK', 'ROG', 'RNG']
	var defensiveJobs = ['WAR', 'PAL', 'SHD']
	var averagePunchJobs = ['WAR', 'PAL', 'SHD', 'ROG', 'RNG', 'BRD']
	var wisCasterJobs = ['DRU', 'CLR', 'SHM']
	var intCasterJobs = ['NEC', 'ENC', 'MAG', 'WIZ']
	var allCasterJobs = ['CLR', 'DRU', 'SHM', 'BRD', 'NEC', 'ENC', 'MAG', 'WIZ']
	var hybridJobs = ['PAL', 'SHD', 'RNG']
	var twoHandBluntAverageJobs = ['WAR', 'PAL', 'SHD', 'CLR', 'DRU', 'SHM', 'NEC', 'ENC', 'MAG', 'WIZ']
	var tankJobs = ['WAR', 'PAL', 'SHD']
	var averageArcherJobs = ['WAR', 'PAL', 'SHD', 'ROG', 'BRD']
	var averagePiercingJobs = ['WAR', 'BRD', 'SHM', 'NEC', 'ENC', 'MAG', 'WIZ']
	var averageOneHandSlashJobs = ['WAR', 'PAL', 'SHD', 'BRD', 'DRU']

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
	function dualWield() {
		return my.dualWield
	}
	function doubleAttack() {
		return my.doubleAttack
	}
	function dodge() {
		return my.dodge
	}
	function parry() {
		return my.parry
	}
	function riposte() {
		return my.riposte
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
}()