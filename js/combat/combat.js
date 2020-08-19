var combat;
!function($, _, TweenMax, PIXI, Math, Power1, Power3, Linear, undefined) {
	combat = {
		MAX_DAMAGE: 999999999,
		textId: 0,
		considerClass: [
			'con-grey',
			'con-green',
			'con-low-blue',
			'con-high-blue',
			'con-white',
			'con-yellow',
			'con-red',
		],
		mobType: {
			'balrog': 'Demons',
			'ice-golem': 'Mystical',
			'stone-golem': 'Mystical',
			'iron-golem': 'Mystical',
			'treant': 'Mystical',
			'spider': 'Beasts',
			'wolf': 'Beasts',
			'rat': 'Beasts',
			'snake': 'Beasts',
			'dragonkin': 'Dragonkin',
			'lizardman': 'Humanoids',
			'dragon': 'Dragonkin',
			'dragon-fire': 'Dragonkin',
			'dragon-poison': 'Dragonkin',
			'dragon-frost': 'Dragonkin',
			'dragon-plains': 'Dragonkin',
			'dragon-water': 'Dragonkin',
			'dragon-forest': 'Dragonkin',
			'dragon-desert': 'Dragonkin',
			'ghoul': 'Undead',
			'mummy': 'Undead',
			'skeleton': 'Undead',
			'zombie': 'Undead',
			'vampire': 'Undead',
			'goblin': 'Humanoids',
			'hobgoblin': 'Humanoids',
			'kobold': 'Humanoids',
			'orc': 'Humanoids',
			'griffon': 'Mystical',
			'harpy': 'Mystical',
			'werewolf': 'Mystical',
			'centaur': 'Mystical',
			'cerberus': 'Demons',
			'fungoid': 'Humanoids',
			'gargoyle': 'Mystical',
			'beetle': 'Beasts',
			'imp': 'Demons',
			'minotaur': 'Mystical',
			'aviak': 'Humanoids',
			'elephant': 'Beasts',
			'lion': 'Beasts',
			'crocodile': 'Beasts',
			'rhino': 'Beasts',
			'lioness': 'Beasts',
			'bear': 'Beasts',
			'toadlok': 'Humanoids',
			'giant': 'Giants',
			'ice-giant': 'Giants',
			'fire-giant': 'Giants',
			'spectre': 'Undead',
			'angler': 'Humanoids',
			'evil-eye': 'Mystical',
			'unicorn': 'Mystical',
			'scorpion': 'Beasts',
		},
		rxDamageMob,
		popupDamage,
		targetChanged,
		initCombatTextLayer,
		updateCombatTextLayer,
		toggleAutoAttack,
		txDamageMob,
		isValidTarget,
		getDiffIndex,
		autoAttackDisable,
		processDamagesHero,
		txDamageHero,
		rxDamageHero,
		txDotMob,
		rxDotMob,
		levelSkillCheck,
		skillLevelChance,
		endCombat,
		updateHeroResource,
		txHotHero,
		rxHotHero,
		txBuffHero,
		rxBuffHero,
		selfDied,
		processStatBuffsToMe,
	}
	var el, w, h, i, len, damageArr, hit, damages, buffArr, index, hotData, buffData, key, resist, resistPenalty
	let txHpUpdate = false
	let battleTextInitialized = false
	const textDuration = 1
	const textDistanceY = 150
	const textDistanceX = 150
	const combatTextRegularStyle = {
		fontFamily: 'Play',
		fontSize: 36,
		fill: ['#048', '#ee8', '#ee8', '#048'],
		stroke: '#025',
		strokeThickness: 3,
	}
	const combatTextCritStyle = {
		fontFamily: 'Play',
		fontSize: 36,
		fontWeight: 'bold',
		fill: ['#ffd700', '#ffe', '#ffe', '#ffd700'],
		stroke: '#430',
		strokeThickness: 3,
	}
	const addedDamageTypes = ['addBlood', 'addPoison', 'addArcane', 'addLightning', 'addFire', 'addIce']
	const resourceLeechDivider = 1000
	let chance = 0
	let addedDamage
	let totalDamage = 0
	let myDamage = 0
	let leechHp = 0
	let wraithMp = 0
	let vulpineMp = 0
	let vulpineSp = 0
	let mobArmor = 1
	let blockMsg = ''
	let hate = 0
	let healAmount = 0
	let enhanceHeal = 0

	///////////////////////////////////////////
	function levelSkillCheck(name) {
		name = _.camelCase(name)
		if (skills[name]) {
			if (my.level >= skills[name][my.job].level &&
				my[name] < stats.getPropMax(name)) { //TODO: Dynamic max
				if (rand() < skillLevelChance(name)) {
					my[name]++
					stats.cache = {}
					chat.log('You got better at ' +skills.getName(name) + '! (' + my[name] + ')', 'chat-skill')
					if (bar.windowsOpen.character) {
						if (bar.activeTab === 'character') {
							ng.html('#char-stat-col-2', bar.charStatColTwoHtml())
						}
						else if (bar.activeTab === 'passiveSkills') {
							querySelector('#inv-skills-wrap').innerHTML = bar.getSkillBarHtml()
						}
					}
				}
			}
		}
	}
	function skillLevelChance(name) {
		// from 20% at 1 down to about 1% at 140+
		chance = (20 - (my[name] / 10)) / 100
		if (chance < .01) chance = .01 // beyond 140 skill has a 1/100 chance
		return chance
	}
	function isValidTarget() {
		if (my.targetIsMob) return my.target >= 0 && my.target < mob.max
		else return my.target >= 0
	}
	function processDamagesMob(d) {
		if (typeof mobs[d.index] === 'undefined' || !mobs[d.index].name || my.hp <= 0) {
			d.damage = 0
			return d
		}
		//console.info('asdfasdf', d)

		if (d.damageType === 'physical') {
			// check for things that immediately set to 0
			if (rand() < stats.missChance(d.index, d.weaponSkill)) {
				// chat.log('Your attack misses ' + ng.getArticle(d.index) + ' ' + mobs[d.index].name + '!')
				d.damage = 0
				combat.popupDamage(d.index, 'MISS!')
				return d
			}
			if (!d.isPiercing) {
				if (rand() * 100 < mobs[d.index].dodge) {
					d.damage = 0
					combat.popupDamage(d.index, 'DODGE!')
					return d
				}
				else if (timers.castBar < 1) {
					if (rand() * 100 < mobs[d.index].riposte) {
						d.damage = 0
						combat.txDamageHero(d.index, [ mob.getMobDamage(d.index, my.row, true) ])
						combat.popupDamage(d.index, 'RIPOSTE!')
						return d
					}
					else if (rand() * 100 < mobs[d.index].parry) {
						d.damage = 0
						combat.popupDamage(d.index, 'PARRY!')
						return d
					}
				}
			}
			// enhancedDamage
			d.enhancedDamage += stats.enhanceDamageToMobType(combat.mobType[mobs[d.index].img])
			if (mobs[d.index].mobType === 'undead' || mobs[d.index].mobType === 'humanoid') {
				if (d.weaponSkill === 'One-hand Blunt' || d.weaponSkill === 'Two-hand Blunt') {
					d.enhancedDamage += .25
				}
			}
			else if (mobs[d.index].mobType === 'beast') {
				if (d.weaponSkill === 'One-hand Slash' || d.weaponSkill === 'Two-hand Slash') {
					d.enhancedDamage += .25
				}
			}
			else if (mobs[d.index].mobType === 'mystical') {
				if (d.weaponSkill === 'Piercing') {
					d.enhancedDamage += .25
				}
			}
			if (mobs[d.index].buffFlags.demonicPact) d.enhancedDamage += .15

			// console.info('d.enhancedDamage', d.enhancedDamage)

			// reduce enhancedDamage
			d.damage *= d.enhancedDamage

			// modify mob armor for self
			if (mobs[d.index].armor < 1) {
				if (stats.someIgnoreTargetArmor()) {
					mobs[d.index].armor = 1
				}
				if (stats.someReduceTargetArmor()) {
					mobs[d.index].armor += .001
				}
			}
			if (mobs[d.index].armor > 1) mobs[d.index].armor = 1
			// modify mob armor for all (buffs)
			mobArmor = mobs[d.index].armor
			// higher REDUCES armor
			if (mobs[d.index].buffFlags.igniteArmor) mobArmor += .15
			if (mobs[d.index].buffFlags.bloodFire) mobArmor += .1

			if (mobArmor > 1) mobArmor = 1
			// console.info('mobArmor', d.index, mobArmor)
			d.damage *= mobArmor

			// +add spell damage
			addedDamage = 0
			addedDamageTypes.forEach(elType => {
				addedDamage += (stats.getEqTotal(elType) * mobs[d.index].resist[elType])
			})
			addedDamage += stats.getEqTotal('addAll')


			// damage penalties
			if (d.requiresFrontRow && !battle.targetIsFrontRow(d.index)) {
				d.damage = 0
			}
			if (d.damageType === 'physical' &&
				!d.isRanged &&
				d.index > 4) {
				// physical on back row
				d.damage *= .5
			}
			// effects
			if (mobs[d.index].buffFlags.vampiricGaze) {
				// small boost to make it slightly stronger at lower levels
				processLeech(skill.SHM.getMaxVampiricGaze(d.index) + .5)
			}
		}
		else {
			// mob magic resists
			d.enhancedDamage = 1
			if (d.isBlighted &&
				(mobs[d.index].mobType === 'undead' || mobs[d.index].mobType === 'demon')) {
				console.warn("isBlighted", d)
				d.enhancedDamage += .5
			}
			d.damage *= d.enhancedDamage
			d.damage *= getMobResist(d)

		}
		// final sanity checks
		d.damage = d.damage < 1 ? 1 : round(d.damage)
		combat.levelSkillCheck('offense')
		return d
	}
	function getMobResist(d) {
		resist = mobs[d.index].resist[d.damageType]
		//console.info('getMobResist', d.index, d.damageType, resist)
		if (d.damageType === 'blood') {
			if (mobs[d.index].buffFlags.curseOfShadows) resist += .2
		}
		else if (d.damageType === 'poison') {
			if (mobs[d.index].buffFlags.curseOfShadows) resist += .2
		}
		else if (d.damageType === 'arcane') {
			if (mobs[d.index].buffFlags.curseOfShadows) resist += .2
		}
		else if (d.damageType === 'lightning') {

		}
		else if (d.damageType === 'fire') {

		}
		else if (d.damageType === 'ice') {

		}
		resistPenalty = 0
		if (mobs[d.index].level > my.level) {
			// 20% when 3 levels higher
			resistPenalty = Math.pow(mobs[d.index].level - my.level + 1, 2.16) / 100
		}
		resist -= resistPenalty
		if (resist < .25) resist = .25
		else if (resist > 2) resist = 2 // cannot lower resists beyond -100%
		//console.info('getMobResist', d.index, d.damageType, resist)
		return resist
	}
	function toggleAutoAttack() {
		if (!my.isAutoAttacking) autoAttackEnable()
		else autoAttackDisable()
	}
	function autoAttackEnable() {
		if (ng.view !== 'battle' ||
			my.hp <= 0) return
		my.isAutoAttacking = true
		button.primaryAttack()
		button.secondaryAttack()
		el = querySelector('#main-attack-wrap')
		el.classList.remove('active')
		el.classList.add('active')
	}
	function autoAttackDisable() {
		my.isAutoAttacking = false
		el = querySelector('#main-attack-wrap')
		el.classList.remove('active')
	}
	function endCombat() {
		mob.killAttacks(true)
		mob.hideMobTargets()
		battle.hideTarget()
		battle.killMobBuffTimers()
		battle.killTargetBuffTimers()
	}

	function isBattleOver() {
		var resp = true
		var i = 0
		while (i < mob.max) {
			if (mobs[i].name) resp = false
			i++
		}
		return resp
	}

	function updateMobHp(o) {
		console.info('updateMobHp updateHate obj', _.clone(o))
		if (typeof buffs[o.key] === 'object') {
			if (buffs[o.key].hate === undefined) o.hate = 1
			else o.hate = buffs[o.key].hate
		}
		else {
			// default damage hate value
			o.hate = 1
		}
		// console.info('updateHate hate val', o.hate)
		mobs[o.index].hp -= o.damage
		party.damage[o.row] += o.damage

		// alive
		mob.hit(o.index, false, o.damage)
		popupDamage(o.index, o.damage, o.isCrit)
		mob.updateHate(o)
		mob.drawMobBar(o.index)
		if (mobs[o.index].hp <= 0) {
			warn('mob is dead!')
			mob.death(o.index)
			my.fixTarget()
			if (isBattleOver()) {
				endCombat()
				ng.view = 'dungeon'
				delayedCall(5, dungeon.go, [true])
			}
		}
		processEffects(o)
		if (o.key && typeof animateSkill[key] === 'function') {

		}
	}
	function processEffects(o) {
		if (typeof o.effects === 'object') {
			// console.info('processEffects')
			// non-duration effects that are not buffs, but apply instantly
			if (o.effects.stagger) mobEffects.stagger(o.index)
		}
	}
	function processLeech(leechValue) {
		leechValue = processHeal(leechValue)
		leechHp += leechValue
		if (leechHp >= 1) {
			updateHeroResource('hp', ~~leechHp)
			leechHp = leechHp % 1
		}
	}
	function processWraith(wraithValue) {
		wraithMp += wraithValue
		if (wraithMp >= 1) {
			updateHeroResource('mp', ~~wraithMp)
			wraithMp = wraithMp % 1
		}
	}
	const damageKeys = [
		'damage',
		'key',
		'index',
		'row',
		'effects'
	]
	function txDamageMob(damages) {
		damages = damages.map(processDamagesMob)
		console.warn('txDamageMob', damages)
		damageArr = []
		buffArr = []
		len = damages.length
		myDamage = 0
		for (i=0; i<len; i++) {
			if (damages[i].damage > 0) {
				myDamage += damages[i].damage
				damages[i].row = my.row
				if (typeof damages[i].buffs === 'object') {
					// buffs only get added if it hits
					damages[i].buffs.forEach(buff => buffArr.push(buff))
				}
				damageArr.push(damages[i])
			}
		}
		if (myDamage) {
			if (stats.leech()) {
				processLeech(myDamage * (stats.leech() / resourceLeechDivider))
			}
			if (stats.wraith()) {
				processWraith(myDamage * (stats.wraith() / resourceLeechDivider))
			}
		}
		if (damageArr.length) {
			let damageData = {
				route: 'p->damage',
				damages: damageArr.map(dam => _.pick(dam, damageKeys))
			}
			// optionally adds buffs key if it exists
			if (buffArr.length) damageData.buffs = buffArr
			console.info('txDamageMob: ', _.cloneDeep(damageData))
			socket.publish('party' + my.partyId, damageData)
		}
	}
	function rxDamageMob(data) {
		// damages
		len = data.damages.length
		buffArr = []
		for (i=0; i<len; i++) {
			console.info('txDamageMob : ', data.damages)
			updateMobHp(data.damages[i])
			if (data.damages[i].key === 'devouringSwarm') skill.SHM.devouringSwarmHeal(data.damages[i])
		}
		// buffs
		if (typeof data.buffs === 'object') {
			data.buffs.forEach(buff => buffArr.push(buff))
		}
		buffArr.length && battle.processBuffs(buffArr)
	}
	const dotKeys = [
		'damage',
		'index',
		'level',
	]
	function txDotMob(damages) {
		// only checks dodge?
		// console.info('txDotMob 1', damages)
		damages = damages.map(processDamagesMob)
		damageArr = []
		len = damages.length
		for (i=0; i<len; i++) {
			if (damages[i].damage > 0) {
				damages[i].row = my.row
				damageArr.push(damages[i])
			}
		}
		// optionally adds buffs key if it exists
		if (damageArr.length) {
			damageArr = damageArr.map(dam => _.pick(dam, dotKeys))
			let dotData = {
				route: 'p->dot',
				key: damages[0].key,
				row: my.row,
				damages: damageArr
			}
			// console.info('txDotMob 2 ', _.cloneDeep(dotData))
			socket.publish('party' + my.partyId, dotData)
		}
	}
	function rxDotMob(data) {
		len = data.damages.length
		damages = data.damages
		// console.info('txDotMob 3', data)
		for (i=0; i<len; i++) {
			let rowKey = data.key +'-'+ data.row
			if (my.row === data.row) {
				// kill buffs
				if (typeof mobs[damages[i].index].buffs[rowKey] === 'object') {
					if (typeof mobs[damages[i].index].buffs[rowKey].timer === 'object') {
						mobs[damages[i].index].buffs[rowKey].timer.kill()
					}
					if (typeof mobs[damages[i].index].buffs[rowKey].dotTicks === 'object') {
						mobs[damages[i].index].buffs[rowKey].dotTicks.kill()
					}
				}
				console.info('rxDotMob data', data)
				console.info('rxDotMob duration', damages[i])

				battle.processBuffs([{
					i: damages[i].index,
					level: damages[i].level,
					row: data.row,
					key: data.key,
				}])

				let damPerTick = round(damages[i].damage / buffs[data.key].ticks)
				// interval only exists on caster's client - broadcasts on tick
				mobs[damages[i].index].buffs[rowKey].dotTicks = TweenMax.to({},
					buffs[data.key].interval, {
					repeat: buffs[data.key].ticks,
					onRepeat: onDotTick,
					onRepeatParams: [damages[i].index, data.key, damPerTick],
				})
			}
			else {
				if (typeof mobs[damages[i].index].buffs[rowKey] === 'object') {
					if (typeof mobs[damages[i].index].buffs[rowKey].timer === 'object') {
						mobs[damages[i].index].buffs[rowKey].timer.kill()
					}
				}
				battle.processBuffs([{
					i: damages[i].index,
					row: data.row,
					key: data.key,
				}])
			}
		}
	}
	function onDotTick(index, key, damage) {
		combat.txDamageMob([{
			key: key,
			index: index,
			spellType: buffs[key].spellType,
			damageType: buffs[key].damageType,
			isDot: true,
			isPiercing: true,
			damage: damage,
		}])
		for (var k in mobs[index].buffs) {
			// console.info('onDotTick', k, mobs[index].buffs[k].row, mobs[index].buffs[k].duration)
			if (mobs[index].buffs[k].key === 'explosivePlague' &&
				my.row === mobs[index].buffs[k].row &&
				mobs[index].buffs[k].duration === 0) {
				// console.info('onDotTick DONE!', k, mobs[index].buffs[k])
				skill.NEC.explosivePlagueExplode(index, damage)
			}
		}
	}

	function selfDied() {
		warn('You died!')
		// subtract XP
		if (!ng.isApp) {
			// really just for testing
			my.set('hp', 0)
			bar.updateBar('hp')
		}
		timers.clearMy()
		autoAttackDisable()
		battle.subtractExpPenalty()
		if (!party.isSomeoneAlive()) {
			mob.killAttacks(true)
		}
		battle.reckonGXL()
		animateMyDeath()
	}
	// damage hero functions
	function updateHeroResource(type, addValue, bypassDeath) {
		/**
		 * when hero's hp, mp, sp increments or decrements
		 */
		if (my.hp <= 0 && !bypassDeath) {
			console.warn('updateHeroResource you are dead - no action taken')
			return
		}
		my.set(type, addValue, true)
		// sanity check
		if (my[type] < 0) my.set(type, 0)
		else if (my[type] > my[type + 'Max']) my.set(type, my[type + 'Max'])
		// special cases
		if (type === 'hp') {
			if (my.hp <= 0) {
				// death
				if (ng.isApp) selfDied()
				else my.set('hp', my.hpMax) // testing
			}
		}
		bar.updateBar(type)
	}
	function processDamagesHero(index, d) {
		if (my.hp <= 0) {
			d.damage = 0
			return d
		}
		// check for things that immediately set to 0
		// check invulnerable
		if (my.buffFlags.frozenBarrier ||
			my.buffFlags.jumpStrike) {
			chat.log(ng.getArticle(index, true) + ' ' + mobs[index].name + ' tries to hit YOU, but you are invulnerable!')
			d.damage = 0
			return d
		}
		// check miss
		if (rand() < mob.missChance(mobs[index].level)) {
			chat.log(ng.getArticle(index, true) + ' ' + mobs[index].name + ' tries to hit YOU, but misses!')
			d.damage = 0
			return d
		}
		// console.info('processDamagesHero', index, d)
		// dodge
		if (skills.dodge[my.job].level &&
			my.level >= skills.dodge[my.job].level) {
			combat.levelSkillCheck('dodge')
			if (!d.isPiercing &&
				rand() < stats.dodgeChance()) {
				chat.log(ng.getArticle(index, true) + ' ' + mobs[index].name + ' tries to hit YOU, but you dodged!')
				d.damage = 0
				return d
			}
		}
		// info('processDamages', d)
		if (d.damageType === 'physical') {
			// riposte
			if (skills.riposte[my.job].level &&
				my.level >= skills.riposte[my.job].level) {
				combat.levelSkillCheck('riposte')
				if (!d.isPiercing &&
					rand() < stats.riposteChance()) {
					chat.log(ng.getArticle(index, true) + ' ' +mobs[index].name + ' tries to hit YOU, but you riposted!')
					button.primaryAttack(true, index)
					d.damage = 0
					return d
				}
			}
			// parry
			if (skills.parry[my.job].level &&
				my.level >= skills.parry[my.job].level) {
				combat.levelSkillCheck('parry')
				if (!d.isPiercing &&
					rand() < stats.parryChance()) {
					chat.log(ng.getArticle(index, true) + ' ' +mobs[index].name + ' tries to hit YOU, but you parried!')
					d.damage = 0
					button.startSwing('primaryAttack')
					return d
				}
			}

			// phyMit
			d.damage -= stats.phyMit()

			// enhancedDamage ?

			// shield block? maxes 75% reduction of damage; skips armor
			let amountReduced = 1 - stats.armorReductionRatio()

			if (items.eq[13].blockRate &&
				rand() * 100 < items.eq[13].blockRate) {
				amountReduced -= .25
				d.blocked = round(d.damage * .25)
				if (d.blocked < 0) d.blocked = 0
			}
			if (mobs[index].buffFlags.suppressingVolley) amountReduced -= .5
			if (amountReduced < .25) amountReduced = .25
			d.damage *= amountReduced
		}
		else {
			// magMit
			if (my.buffFlags.shimmeringOrb) reduceShimmeringOrbDamage(d)
			d.damage -= stats.magMit()

			// my magic resists
			console.info(d.damageType, index)
			d.damage *= stats.getResistPercent(d.damageType)
		}
		// final sanity checks
		d.damage = d.damage < 1 ? 1 : round(d.damage)
		// shield damage
		if (my.buffFlags.guardianAngel) reduceMagicShieldDamage(d, 'guardianAngel')
		if (my.buffFlags.mirrorImage) reduceMagicShieldDamage(d, 'mirrorImage')
		combat.levelSkillCheck('defense')
		return d
	}
	function txDamageHero(index, damages) {
		// damages is an object with indices that point to player row (target)
		// TODO: Single player mode should bypass publishes everywhere...? lots of work
		socket.publish('party' + my.partyId, {
			route: 'p->hit',
			i: index,
			d: damages,
		})
	}
	function rxDamageHero(data) {
		// mob is hitting me
		damages = data.d
		processDamageToMe(data.i, damages)
		console.info('rxDamageHero: ', damages.length, data)
	}
	function processDamageToMe(index, damages) {
		if (damages.findIndex(dam => dam.row === my.row) >= 0) {
			// something hit me - single or double hit
			console.info('processDamageToMe', damages[0].damage)
			damages = damages.map(dam => processDamagesHero(index, dam))
			len = damages.length
			totalDamage = 0
			for (i=0; i<len; i++) {
				if (damages[i].damage > 0) {
					totalDamage += damages[i].damage
					updateHeroResource('hp', -damages[i].damage)
					if (damages[i].isPiercing) {
						chat.log(ng.getArticle(index, true) + ' ' + mobs[index].name + ' ripostes and hits YOU for ' + damages[i].damage + ' damage!', 'chat-alert')
					}
					else {
						blockMsg = ''
						if (damages[i].blocked) {
							blockMsg = ' ('+ damages[i].blocked +' blocked)'
						}
						chat.log(ng.getArticle(index, true) + ' ' + mobs[index].name + ' hits YOU for ' + damages[i].damage + ' damage!'+ blockMsg, 'chat-alert')
					}
					if (damages[i].damageType === 'physical') {
						spell.knockback()
					}
					//console.info('tx processHit: ', damages[i].damage)
				}
			}
			animatePlayerFrames()
			if (totalDamage) {
				// damageTakenToMana vulpineMp
				vulpineMp += totalDamage * (stats.damageTakenToMana() / resourceLeechDivider)
				if (vulpineMp >= 1) {
					updateHeroResource('mp', ~~vulpineMp)
					vulpineMp = vulpineMp % 1
				}
				vulpineSp += totalDamage * (stats.damageTakenToSpirit() / resourceLeechDivider)
				if (vulpineSp >= 1) {
					updateHeroResource('sp', ~~vulpineSp)
					vulpineSp = vulpineSp % 1
				}
			}
			game.txPartyResources({
				hp: my.hp,
				hpMax: my.hpMax,
			})
		}
		// animate
		damages.forEach(dam => {
			console.info('processDamageToMe', index, dam.row)
			mob.animateAttack(index, dam.row)
		})
	}
	function popupDamage(index, damage, isCrit) {
		const basicText = new PIXI.Text(damage + '', isCrit ? combatTextCritStyle : combatTextRegularStyle)
		basicText.anchor.set(0.5)
		basicText.id = 'text-' + combat.textId++
		mobs[index].hitCount++
		basicText.x = mob.centerX[index]
		basicText.y = expanse.maxHeight - mob.bottomY[index] - mobs[index].clickAliveH * mobs[2].size + ((mobs[index].hitCount % 5) * 20)
		//info('basicText', basicText)
		combat.text.stage.addChild(basicText)
		TweenMax.to(basicText, textDuration * .6, {
			y: '-=' + textDistanceY + '',
			onComplete: popupDamageFade,
			ease: Power3.easeOut
		})
		TweenMax.to(basicText, textDuration * .5, {
			startAt: { pixi: {scale: 2}},
			pixi: { scale: 1 },
		})
		TweenMax.to(basicText, textDuration, {
			startAt: { pixi: { brightness: isCrit ? 5 : 12, saturate: isCrit ? 5 : 12 }},
			pixi: { brightness: 1, saturate: 1 },
		})

		x = _.random(-textDistanceX, textDistanceX)
		TweenMax.to(basicText, textDuration, {
			x: x < 0 ? '-=' + (x * -1) : '+=' + x,
			ease: Linear.easeOut
		})
		/////////////////////////
		function popupDamageFade() {
			TweenMax.to(basicText, textDuration * .4, {
				y: '+=' + textDistanceY * .5 + '',
				alpha: 0,
				onComplete: removeText,
				onCompleteParams: [ basicText.id ],
				ease: Power1.easeIn
			})
		}
	}

	const healKeys = ['damage', 'index', 'key']
	function txHotHero(data) {
		// damages is an object with indices that point to player row (target)
		data = data.map(heal => _.pick(heal, healKeys))
		console.info('txHotHero', data)
		socket.publish('party' + my.partyId, {
			route: 'p->heal',
			row: my.row,
			heals: data
		})
	}
	function rxHotHero(data) {
		console.info('rxHotHero: ', data)
		data.heals.forEach(heal => {
			if (buffs[heal.key]?.duration > 0) hotToMe(data.row, heal)
			else healToMe(data.row, heal)
		})
	}
	function processHeal(value) {
		enhanceHeal = 1
		if (skill.SHM.mysticalGlowActive()) enhanceHeal += .2
		return round(value * enhanceHeal)
	}
	function healToMe(row, heal) {
		hate = 0
		console.info('healToMe rxHotHero', _.clone(heal))
		hate += heal.damage * (buffs[heal.key].hate ?? 1)
		if (my.row === heal.index) {
			// healing ME
			healAmount = processHeal(heal.damage)
			chat.log(buffs[heal.key].msg(heal), 'chat-heal')
			updateHeroResource('hp', healAmount)
			// let everyone know I got the heal
			game.txPartyResources({
				hp: my.hp,
				hpMax: my.hpMax,
			})
		}
		if (~~hate > 0) {
			mob.addHateHeal({
				row: row,
				hate: ~~hate
			})
		}
	}
	function hotToMe(row, heal) {
		console.info('hotToMe rxHotHero', row, heal)
		hate = 0
		hate += heal.damage * (buffs[heal.key].hate ?? 1)
		if (my.row === heal.index) {
			// HoT
			let keyRow = heal.key + '-' + heal.index
			// cancel/overwrite existing buff timer data keyRow: duration, function
			if (typeof my.buffs[keyRow] === 'object' &&
				typeof my.buffs[keyRow].timer === 'object') {
				my.buffs[keyRow].timer.kill()
				my.buffs[keyRow].hotTicks.kill()
				battle.removeBuff(heal.key, keyRow)
			}
			// setup buff timer data
			my.buffs[keyRow] = {
				row: heal.index,
				key: heal.key,
				duration: buffs[heal.key].duration,
			}
			my.buffs[keyRow].timer = TweenMax.to(
				my.buffs[keyRow],
				my.buffs[keyRow].duration, {
				duration: 0,
				ease: Linear.easeNone,
				onComplete: battle.removeMyBuffFlag,
				onCompleteParams: [keyRow],
			})
			my.buffFlags[keyRow] = true
			healAmount = Math.round(heal.damage / buffs[heal.key].ticks)
			// long-term heals synthesize, etc
			if (buffs[heal.key].addPerTick) healAmount += buffs[heal.key].addPerTick
			my.buffs[keyRow].hotTicks = TweenMax.to({}, buffs[heal.key].interval, {
				repeat: buffs[heal.key].ticks,
				onRepeat: onHotTick,
				onRepeatParams: [heal, healAmount],
			})
			battle.addMyBuff(heal.key, keyRow)
			chat.log(buffs[heal.key].msg(heal), 'chat-heal')
		}
		if (~~hate > 0) {
			mob.addHateHeal({
				row: row,
				hate: ~~hate
			})
		}
	}
	function onHotTick(buff, healAmount) {
		healAmount = processHeal(healAmount)
		if (!app.isApp) {
			chat.log(buffs[buff.key].name + ' heals you for ' + healAmount + ' health.', 'chat-heal')
		}
		updateHeroResource('hp', healAmount)
	}

	// buff hero
	function txBuffHero(data) {
		console.info('txBuffHero', data)
		data = data.map(buff => _.pick(buff, ['damage', 'index', 'key', 'level']))
		socket.publish('party' + my.partyId, {
			route: 'p->buff',
			row: my.row,
			buffs: data
		})
	}
	function rxBuffHero(data) {
		console.info('rxBuffHero: ', data)
		processBuffToMe(data)
	}
	function processBuffToMe(data) {
		hate = 0
		console.info('processBuffToMe', data)
		data.buffs.forEach(buff => {
			console.info('updateHate', _.clone(buff))
			if (buffs[buff.key].hate) {
				hate += ~~(buff.damage * buffs[buff.key].hate)
			}
			// console.info('updateHate hate', hate)

			if (my.row === buff.index) {
				let key = buff.key
				// check level of buff - cancel if lower
				if (typeof my.buffs[key] === 'object') {
					if (buff.level < my.buffs[key].level) {
						// buff is lower level -
						if (//no timer but has damage
							typeof my.buffs[key].duration === 'undefined' && my.buffs[key].damage > 0 ||
							// timer-based active
							my.buffs[key].duration > 0) {
							// duration not defined or still active
							chat.log(buffs[buff.key].name + ' failed to take hold.', 'chat-warning')
							return
						}
					}

					// cancel/overwrite existing buff timer data keyRow: duration, function
					if (typeof my.buffs[key].timer === 'object') {
						my.buffs[key].timer.kill()
					}
				}

				chat.log(buffs[buff.key].msg(), 'chat-heal')
				battle.removeBuff(key)
				// setup buff timer data
				my.buffs[key] = {
					row: buff.index,
					key: buff.key,
				}
				// optional keys
				if (buff.level) my.buffs[key].level = buff.level
				// sets shield type damage absorption shimmeringOrb, guardianAngel, etc
				if (buff.damage) my.buffs[key].damage = buff.damage

				// not timer based - my.buffFlags[key] must be set to false via depletion
				if (buffs[buff.key].duration > 0) {
					// timer based
					console.warn('adding buff - dur:', buffs[buff.key].duration)
					my.buffs[key].duration = buffs[buff.key].duration
					my.buffs[key].timer = TweenMax.to(my.buffs[key], my.buffs[key].duration, {
						duration: 0,
						ease: Linear.easeNone,
						onComplete: battle.removeMyBuffFlag,
						onCompleteParams: [key],
					})
				}
				my.buffFlags[key] = true
				battle.addMyBuff(buff.key, key)
				processStatBuffsToMe(key)
			}
		})
		if (~~hate > 0) {
			mob.addHateHeal({
				row: data.row,
				hate: hate
			})
		}
	}

	function processStatBuffsToMe(key) {
		console.info('processStatBuffsToMe key!', key)
		if (key === 'spiritOfTheHunter') {
			cacheBustAttack()
			updateCharStatColTwo()
		}
		else if (key === 'sealOfRedemption') {
			stats.resistBlood(true)
			bar.updateAllResistsDOM()
			my.set('hpMax', stats.hpMax())
			bar.updateBar('hp')
			txHpChange()
		}
		else if (key === 'zealousResolve') {
			cacheBustArmor()
			my.set('hpMax', stats.hpMax())
			bar.updateBar('hp')
			txHpChange()
		}
		else if (key === 'bulwark') {
			stats.phyMit(true)
			stats.magMit(true)
		}
		else if (key === 'intrepidShout') {
			cacheBustArmor()
			stats.resistFear(true)
		}
		else if (key === 'frozenBarrier') {
			// delayed call to allow for
			if (my.buffFlags.frozenBarrier) skill.WIZ.frozenBarrierEffect()
			else {
				// do nothing?
			}
		}
		else if (key === 'manaShell') {
			stats.resistSilence(true)
			stats.resistBlood(true)
			stats.resistPoison(true)
			stats.resistArcane(true)
			stats.resistLightning(true)
			stats.resistFire(true)
			stats.resistIce(true)
			bar.updateAllResistsDOM()
		}
		else if (key === 'branchSpirit') {
			cacheBustArmor()
			cacheBustAttack()
			stats.hpRegen(true)
			my.set('hpMax', stats.hpMax())
			bar.updateBar('hp')
			txHpChange()
		}
		else if (key === 'vampiricAllure') {
			stats.leech(true)
			stats.wraith(true)
			stats.cha(true)
			updateCharStatColTwo()
		}
		else if (key === 'borealTalisman') {
			stats.resistIce(true)
			stats.str(true)
			stats.sta(true)
			my.set('hpMax', stats.hpMax())
			bar.updateBar('hp')
			txHpChange()
			cacheBustAttack()
			bar.updateAllResistsDOM()
			updateCharStatColOne()
		}
		////////////////////////////////
		function cacheBustAttack() {
			stats.offense(true)
			stats.attack(void 0, true)
			updateCharStatColTwo()
		}
		function cacheBustArmor() {
			// utility function that busts armor cache and updates DOM
			stats.armor(true)
			updateCharStatColOne()
		}
	}
	
	function updateCharStatColOne() {
		if (bar.windowsOpen.character && bar.activeTab === 'character') {
			ng.html('#char-stat-col-1', bar.charStatColOneHtml())
		}
	}
	function updateCharStatColTwo() {
		if (bar.windowsOpen.character && bar.activeTab === 'character') {
			ng.html('#char-stat-col-2', bar.charStatColTwoHtml())
		}
	}

	function txHpChange() {
		console.info('processStatBuffsToMe tx!', key)
		game.txPartyResources({
			hp: my.hp,
			hpMax: my.hpMax,
		})
	}
	function animatePlayerFrames() {
		TweenMax.to('#bar-card-bg-' + my.row, .5, {
			startAt: { opacity: .5 },
			opacity: 0
		})
	}
	function initCombatTextLayer() {
		if (battleTextInitialized) return
		battleTextInitialized = true
		combat.text = new PIXI.Application({
			width: 1920,
			height: 1080,
			transparent: true
		});
		// style
		combat.text.view.id = 'combat-text'
		combat.text.view.style.position = 'absolute'
		combat.text.view.style.zIndex = 2
		combat.text.view.style.pointerEvents = 'none'
		querySelector('#scene-battle').appendChild(combat.text.view)
		updateCombatTextLayer()
	}
	function updateCombatTextLayer() {
		w = window.innerWidth
		h = ~~(combat.text.screen.height / expanse.maxHeight * window.innerHeight)
		combat.text.view.style.width = w + 'px';
		combat.text.view.style.height = h + 'px';

		battle.layer.view.style.width = w + 'px';
		battle.layer.view.style.height = h + 'px';
	}
	function removeText(id) {
		el = pix.getId(combat.text, id)
		combat.text.stage.removeChild(el)
	}
	function targetChanged() {
		if (my.hp <= 0) return
		if (my.targetIsMob) targetChangedToMob()
		else targetChangedToPlayer()
		console.info('targetChanged my.target =>', my.target, my.targetIsMob)
		battle.updateTarget(true)
	}
	function targetChangedToPlayer() {
		// remove mob targeting
		index = 0
		for (el of querySelectorAll('.mob-details')) {
			if (index++ !== my.hoverTarget) el.classList.remove('targeted', 'block-imp')
		}
		// remove player
		for (el of querySelectorAll('.player-targeted')) {
			el.classList.remove('player-targeted')
		}
		if (my.target === -1) {
			battle.hideTarget()
		}
		else {
			el = querySelector('#bar-player-wrap-' + my.target)
			el.classList.add('player-targeted')
		}
	}
	function targetChangedToMob() {
		index = 0
		for (el of querySelectorAll('.mob-details')) {
			if (index++ !== my.hoverTarget) el.classList.remove('targeted', 'block-imp')
			else el.classList.remove('targeted')
		}
		for (el of querySelectorAll('.player-targeted')) {
			el.classList.remove('player-targeted')
		}
		if (combat.isValidTarget()){
			querySelector('#mob-details-' + my.target).classList.add('targeted', 'block-imp')
		}
	}
	function getDiffIndex(level) {
		var resp = 0
		if (level >= my.level + 3) resp = 6
		else if (level > my.level) resp = 5
		else if (level === my.level) resp = 4
		else if (level >= ~~(my.level * .88) ) resp = 3
		else if (level >= ~~(my.level * .77) ) resp = 2
		else if (level >= ~~(my.level * .66) ) resp = 1
		return resp
	}
	function animateMyDeath() {
		let el = querySelector('#scene-battle')
		let o = {
			grayscale: 0,
			saturate: 1,
			contrast: 1,
			brightness: 1,
		}
		TweenMax.to(o, 3, {
			grayscale: .666,
			saturate: 5,
			contrast: 5,
			brightness: .333,
			onUpdate: setFilter,
			onUpdateParams: [o]
		})
		function setFilter(o) {
			TweenMax.set(el, {
				filter: 'grayscale(1) sepia(1) saturate('+ o.saturate +') hue-rotate(-30deg) contrast('+ o.contrast +') brightness('+ o.brightness +') grayscale('+ o.grayscale +') '
			})
		}
	}
	function reduceShimmeringOrbDamage(d) {
		let val = skills.RNG[10].magMit[my.buffs.shimmeringOrb.level]
		d.damage -= val
		console.info('reduceShimmeringOrbDamage remaining', my.buffs.shimmeringOrb.damage)
		my.buffs.shimmeringOrb.damage -= val
		if (my.buffs.shimmeringOrb.damage <= 0) {
			my.buffs.shimmeringOrb.damage = 0
			battle.removeBuff('shimmeringOrb')
		}
	}
	function reduceMagicShieldDamage(d, key) {
		chat.log(buffs[key].msgAbsorb, 'chat-buff')
		if (d.damage > my.buffs[key].damage) {
			d.damage -= my.buffs[key].damage
			my.buffs[key].damage = 0
			battle.removeBuff(key)
		}
		else {
			my.buffs[key].damage -= d.damage
			d.damage = 0
		}

	}
}($, _, TweenMax, PIXI, Math, Power1, Power3, Linear);