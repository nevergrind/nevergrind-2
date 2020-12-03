var combat;
!function($, _, TweenMax, PIXI, Math, Power1, Power3, Linear, undefined) {
	combat = {
		txHpChange,
		txMpChange,
		txSpChange,
		txAllChange,
		getAddedDamage,
		rxDamageMob,
		popupDamage,
		targetChanged,
		initCombatTextLayer,
		updateCanvasLayer,
		toggleAutoAttack,
		txDamageMob,
		isValidTarget,
		getDiffIndex,
		autoAttackEnable,
		autoAttackDisable,
		processDamagesHero,
		txDamageHero,
		rxDamageHero,
		txDotMob,
		rxDotMob,
		levelSkillCheck,
		skillLevelChance,
		endCombat,
		updateMyResource,
		txHotHero,
		rxHotHero,
		txBuffHero,
		rxBuffHero,
		selfDied,
		processStatBuffsToMe,
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
			[MOB_TYPE.DRAGONKIN]: 'Dragonkin',
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
			[MOB_TYPE.GIANT]: 'Giants',
			'ice-giant': 'Giants',
			'fire-giant': 'Giants',
			'spectre': 'Undead',
			'angler': 'Humanoids',
			'evil-eye': 'Mystical',
			'unicorn': 'Mystical',
			'scorpion': 'Beasts',
		},
	}
	var el, w, h, i, len, damageArr, hit, damages, procDamage, procHit, buffArr, index, hotData, buffData, key, resist, resistPenalty
	let txHpUpdate = false
	let battleTextInitialized = false
	const TextDuration = 1
	const TextDistanceX = 200
	const TextDistanceY = 150
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
	const addedDamageTypes = [{
		add: PROP.ADD_BLOOD,
		resist: DAMAGE_TYPE.BLOOD,
	}, {
		add: PROP.ADD_POISON,
		resist: DAMAGE_TYPE.POISON,
	}, {
		add: PROP.ADD_ARCANE,
		resist: DAMAGE_TYPE.ARCANE,
	}, {
		add: PROP.ADD_LIGHTNING,
		resist: DAMAGE_TYPE.LIGHTNING,
	}, {
		add: PROP.ADD_FIRE,
		resist: DAMAGE_TYPE.FIRE,
	}, {
		add: PROP.ADD_ICE,
		resist: DAMAGE_TYPE.ICE,
	}]
	const resourceLeechDivider = 1000
	let chance = 0
	let addedDamage = 0
	let amountReduced = 0
	let totalAddedDamage = 0
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
	let enhanceDamageToMobType = 0

	///////////////////////////////////////////
	function levelSkillCheck(name) {
		name = _.camelCase(name)
		if (skills[name]) {
			if (my.level >= skills[name][my.job].level &&
				my[name] < stats.getPropMax(name)) { //TODO: Dynamic max
				if (rand() < skillLevelChance(name)) {
					my[name]++
					stats.memo = {}
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
		if (typeof mobs[d.index] === 'undefined' ||
			!mobs[d.index].name
			|| my.hp <= 0) {
			d.damage = 0
			return d
		}
		// console.info('damageType', d.damageType)

		// MAGIC cannot miss, dodge, etc
		if (d.damageType === DAMAGE_TYPE.PHYSICAL) {
			// check for things that immediately set to 0
			if (d.requiresFrontRow && !battle.targetIsFrontRow(d.index)) {
				d.damage = 0
				return d
			}
			if (rand() < stats.missChance(d.index, d.weaponSkill, d.hitBonus)) {
				d.damage = 0
				combat.popupDamage(d.index, 'MISS!')
				return d
			}
			if (rand() * 100 < mob.dodgeChance(d.index)) {
				d.damage = 0
				combat.popupDamage(d.index, 'DODGE!')
				return d
			}
			if (!d.isPiercing) {
				if (timers.castBar < 1) {
					if (rand() * 100 < mob.riposteChance(d.index)) {
						d.damage = 0
						combat.txDamageHero(d.index, [ mob.getMobDamage(d.index, my.row, true) ])
						combat.popupDamage(d.index, 'RIPOSTE!')
						return d
					}
					else if (rand() * 100 < mob.parryChance(d.index)) {
						d.damage = 0
						combat.popupDamage(d.index, 'PARRY!')
						return d
					}
				}
			}
			// mob type bonuses
			d.enhancedDamage += getEnhancedDamageByMobType(d)
			// enhancedDamage
			if (mobs[d.index].buffFlags.demonicPact) {
				d.enhancedDamage += buffs.demonicPact.bonusDamage
			}
			if (mobs[d.index].buffFlags.ruptureDot) {
				d.enhancedDamage += buffs.ruptureDot.bonusDamage
			}
			if (my.buffFlags.branchSpirit) {
				d.enhancedDamage += buffs.branchSpirit.bonusDamage
			}
			if (my.buffFlags.prowl) {
				d.enhancedDamage += buffs.prowl.bonusDamage[my.buffs.prowl.level]
			}
			// console.warn('1 enhancedDamage', d.damage)
			d.damage *= d.enhancedDamage
			// console.warn('2 d.damage', d.enhancedDamage, d.damage)

			// reduce enhancedDamage

			// modify mob armor for self
			if (mobs[d.index].armor < 1) {
				if (stats.ignoreTargetArmor()) {
					mobs[d.index].armor = 1
				}
				if (stats.reduceTargetArmor()) {
					mobs[d.index].armor += .001
				}
				if (d.key === 'shadowBreak') {
					mobs[d.index].armor += .01
				}
				if (mobs[d.index].armor > 1) mobs[d.index].armor = 1
			}
			if (mobs[d.index].armor > 1) mobs[d.index].armor = 1
			// modify mob armor for all (buffs)
			mobArmor = mobs[d.index].armor
			// higher REDUCES armor
			if (mobs[d.index].buffFlags.burningEmbers) mobArmor += buffs.burningEmbers.debuffArmor
			if (mobs[d.index].buffFlags.bloodFire) mobArmor += buffs.bloodFire.debuffArmor
			if (mobs[d.index].buffFlags.subvertedSymphony) mobArmor += buffs.subvertedSymphony.debuffArmor
			if (mobs[d.index].buffFlags.decayingDoom) mobArmor += buffs.decayingDoom.debuffArmor

			if (mobArmor > 1) mobArmor = 1
			// console.info('mobArmor', d.index, mobArmor)
			d.damage *= mobArmor
			// console.warn('3', mobArmor, d.damage)

			// damage penalties
			if (!d.isRanged &&
				d.index > 4) {
				// physical on back row
				if (!mobs[d.index].buffFlags.engulfingDarkness) {
					d.damage *= .5
				}
			}
			if (my.buffFlags.sealOfSanctuary) {
				d.damage *= buffs.sealOfSanctuary.reducedDamage[my.buffs.sealOfSanctuary.level]
			}
			// +add spell damage
			d.damage += getAddedDamage(d.index)
			// console.warn('4 added', getAddedDamage(d.index), d.damage)
			// effects
			if (mobs[d.index].buffFlags.vampiricGaze) {
				// small boost to make it slightly stronger at lower levels
				processLeech(skill.SHM.getMaxVampiricGaze(d.index))
			}
			combat.levelSkillCheck(PROP.OFFENSE)
		}
		else {
			// mob magic resists
			// console.warn('1 enhancedDamage', d.enhancedDamage)
			if (!d.enhancedDamage) d.enhancedDamage = 1
			// console.warn('2 enhancedDamage', d.enhancedDamage)
			if (mobs[d.index].mobType === MOB_TYPE.UNDEAD) {
				if (d.isBlighted) {
					d.enhancedDamage += .5
				}
				if (d.key === 'icingDeath') {
					d.enhancedDamage += .5
				}
			}
			else if (mobs[d.index].mobType === MOB_TYPE.DEMON) {
				if (d.isBlighted) {
					d.enhancedDamage += .5
				}
			}
			d.damage *= d.enhancedDamage
			if (!d.cannotResist) d.damage *= mob.getMobResist(d)

		}

		if (mobs[d.index].buffFlags.stasisField) {
			// console.info('stasisField', buffs.stasisField.pveMitigationRatio)
			d.damage *= buffs.stasisField.pveMitigationRatio
		}
		// console.info('combat', d)
		// final sanity checks
		if (d.damage <= 0) d.damage = 0
		else if (d.damage < 1) d.damage = 1
		else d.damage = round(d.damage)
		// console.warn('d.damage enhancedDamage 5', d.damage)
		return d
	}

	function getEnhancedDamageByMobType(d) {
		enhanceDamageToMobType = 0
		if (mobs[d.index].mobType === MOB_TYPE.HUMANOID) {
			/*if (d.weaponSkill === 'One-hand Blunt' ||
				d.weaponSkill === 'Two-hand Blunt') {
				enhanceDamageToMobType += .25
			}*/
			enhanceDamageToMobType += stats.enhancedDamageToHumanoids()
		}
		else if (mobs[d.index].mobType === MOB_TYPE.DEMON) {
			enhanceDamageToMobType += stats.enhancedDamageToDemons()
		}
		else if (mobs[d.index].mobType === MOB_TYPE.BEAST) {
			/*if (d.weaponSkill === LABEL.ONE_HAND_SLASH ||
				d.weaponSkill === 'Two-hand Slash') {
				enhanceDamageToMobType += .25
			}*/
			enhanceDamageToMobType += stats.enhancedDamageToBeasts()
		}
		else if (mobs[d.index].mobType === MOB_TYPE.DRAGONKIN) {
			enhanceDamageToMobType += stats.enhancedDamageToDragonkin()
		}
		else if (mobs[d.index].mobType === MOB_TYPE.MYSTICAL) {
			/*if (d.weaponSkill === 'Piercing') {
				enhanceDamageToMobType += .25
			}*/
			enhanceDamageToMobType += stats.enhancedDamageToMystical()
		}
		else if (mobs[d.index].mobType === MOB_TYPE.UNDEAD) {
			/*if (d.weaponSkill === 'One-hand Blunt' ||
				d.weaponSkill === 'Two-hand Blunt') {
				enhanceDamageToMobType += .25
			}*/
			enhanceDamageToMobType += stats.enhancedDamageToUndead()
		}
		else if (mobs[d.index].mobType === MOB_TYPE.GIANT) {
			enhanceDamageToMobType += stats.enhancedDamageToGiants()
		}
		return enhanceDamageToMobType
	}
	function getAddedDamage(index) {
		totalAddedDamage = 0
		totalAddedDamage += stats.addBlood() * mobs[index].resist.blood
		totalAddedDamage += stats.addPoison() * mobs[index].resist.poison
		totalAddedDamage += stats.addArcane() * mobs[index].resist.arcane
		totalAddedDamage += stats.addLightning() * mobs[index].resist.lightning
		totalAddedDamage += stats.addFire() * mobs[index].resist.fire
		totalAddedDamage += stats.addIce() * mobs[index].resist.ice
		// console.info('getAddedDamage 3', index, totalAddedDamage)
		return totalAddedDamage
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
		// console.info('updateMobHp updateHate obj', _.clone(o))
		if (typeof buffs[o.key] === 'object') {
			if (typeof buffs[o.key].hate === 'undefined') o.hate = 1
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
		combat.popupDamage(o.index, o.damage, o)
		mob.updateHate(o)
		mob.drawMobBar(o.index)
		if (mobs[o.index].hp <= 0) {
			// console.warn('mob is dead!')
			if (timers.castBar < 1
				&& my.target === o.index) {
				spell.cancelSpell()
			}
			mob.death(o.index)
			my.fixTarget()
			if (isBattleOver()) {
				endCombat()
				ng.view = 'dungeon'
				delayedCall(5, dungeon.go, [true])
			}
		}
		// console.info('object', o)
		ask.processAnimations(o, true)
		processEffects(o)
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
			// console.info('processLeech', leechHp)
			updateMyResource(PROP.HP, ~~leechHp)
			leechHp = leechHp % 1
		}
	}
	function processWraith(wraithValue) {
		wraithMp += wraithValue
		if (wraithMp >= 1) {
			updateMyResource(PROP.MP, ~~wraithMp)
			wraithMp = wraithMp % 1
		}
	}
	function filterImpossibleMobTargets(m) {
		return m.index >=0 && m.index < mob.max && mob.isAlive(m.index)
	}

	function triggerEffect(key, damages) {
		// console.info('triggerEffect', damages[0]);
		// heals
		if (key === 'devouringSwarm') skill.SHM.devouringSwarmHeal(damages[0])
		else if (key === 'deathStrike') skill.SHD.deathStrikeHeal(damages[0])
		// buffs
		else if (key === 'hyperStrike') skill.MNK.hyperStrikeHit(damages)
		else if (key === 'viperStrike') skill.MNK.viperStrikeHit(damages)
		else if (key === 'sonicStrike') skill.ROG.sonicStrikeHit(damages[0])
		else if (key === 'fadedStrike') skill.ROG.fadedStrikeHit(damages[0])
		else if (key === 'risingFuror') skill.ROG.risingFurorHit(damages[0])
		else if (key === 'mirageStrike') skill.ROG.mirageStrikeHit(damages[0])
		// dots
		else if (key === 'tigerStrike') skill.MNK.tigerStrikeDot(damages[0])
		else if (key === 'rupture') skill.WAR.ruptureDot(damages[0])
		else if (key === 'doomThrust') skill.SHD.doomThrustDot(damages[0])
		else if (key === 'lacerate') skill.ROG.lacerateDot(damages[0])
		else if (key === 'widowStrike') skill.ROG.widowStrikeDot(damages[0])
	}

	function triggerProc(damageType, index, key) {
		// extra procs that happen for certain skills
		// must hit in order to trigger DoTs, buffs, etc
		if (damageType === DAMAGE_TYPE.PHYSICAL) {
			if (my.buffFlags.sanguineHarvest &&
				rand() < buffs.sanguineHarvest.procRate) {
				skill.SHD.procSanguineHarvest(index)
			}
		}
	}

	let damageData
	function txDamageMob(damages) {
		// console.info('txDamageMob b4', damages, damages[0].damage)
		damages = damages.filter(filterImpossibleMobTargets).map(processDamagesMob)
		// console.info('txDamageMob after', damages, damages[0].damage)
		damageArr = []
		buffArr = []
		len = damages.length
		myDamage = 0
		for (i=0; i<len; i++) {
			if (damages[i].damage > 0 ||
				typeof buffs[damages[i].key] === 'object' &&
				buffs[damages[i].key].isDebuff) {
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
			damageData = {
				route: 'p->damage',
				damages: damageArr.map(dam => _.pick(dam, KEYS.DAMAGE_MOB))
			}
			// optionally adds buffs key if it exists
			if (buffArr.length) damageData.buffs = buffArr
			// console.warn('txDamageMob: ', _.cloneDeep(damageData))
			socket.publish('party' + my.partyId, damageData)

			triggerEffect(damageData.damages[0].key, damageData.damages, damages[0].enhancedDamage)
			damageArr.forEach(d => {
				triggerProc(d.damageType, d.index, d.key)
			})
		}
	}
	function rxDamageMob(data) {
		// damages
		len = data.damages.length
		for (i=0; i<len; i++) {
			// console.info('txDamageMob : ', data.damages[i])
			updateMobHp(data.damages[i])
		}
		// console.info('rx', data);
		if (data.damages[0].key === 'jubilee') {
			// process hate reduction on all clients for player data.row
			party.presence.forEach(p => {
				if (data.damages[0].row !== p.row) {
					mob.feignHate(p.row)
				}
			})
		}
		/*

		if (typeof data.damages === 'object') {
			mob.resetAllHate()
		}
		*/
		// buffs
		// console.info('bufffffs::::', data.buffs)
		if (typeof data.buffs === 'object') {
			buffArr = []
			data.buffs.forEach(buff => buffArr.push(buff))
			buffArr.length && battle.processBuffs(buffArr)
		}
	}

	function txDotMob(damages) {
		// only checks dodge?
		// console.info('txDotMob 1', damages)
		damages = damages.filter(filterImpossibleMobTargets).map(processDamagesMob)
		// console.info('txDotMob 2', damages)
		damageArr = []
		len = damages.length
		for (i=0; i<len; i++) {
			if (damages[i].damage > 0 || buffs[damages[i].key].isDebuff) {
				damages[i].row = my.row
				damageArr.push(damages[i])
			}
		}
		// console.info('txDotMob 1.5', damages)
		// optionally adds buffs key if it exists
		if (damageArr.length) {
			damageArr = damageArr.map(dam => _.pick(dam, KEYS.DOT_MOB))
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
				// dot was cast by me, so we must kill our own buffs
				// if (buff.level < my.buffs[key].level) {
				// console.info('rxDotMob', damages[i].index)
				if (typeof mobs[damages[i].index] === 'object' &&
					typeof mobs[damages[i].index].buffs[rowKey] === 'object') {
					if (typeof mobs[damages[i].index].buffs[rowKey].timer === 'object') {
						mobs[damages[i].index].buffs[rowKey].timer.kill()
					}
					if (typeof mobs[damages[i].index].buffs[rowKey].dotTicks === 'object') {
						mobs[damages[i].index].buffs[rowKey].dotTicks.kill()
					}
				}
				// console.info('rxDotMob data', data)
				// console.info('rxDotMob duration', damages[i])

				battle.processBuffs([{
					i: damages[i].index,
					level: damages[i].level,
					row: data.row,
					key: data.key,
				}])

				let damPerTick = round(damages[i].damage / buffs[data.key].ticks)
				// interval only exists on caster's client - broadcasts on tick
				// console.info('buffs', buffs[data.key], damPerTick)
				mobs[damages[i].index].buffs[rowKey].dotTicks = TweenMax.to('', buffs[data.key].interval, {
					repeat: buffs[data.key].ticks,
					onRepeat: onDotTick,
					onRepeatParams: [damages[i].index, data.key, damPerTick],
				})
			}
			else {
				// dot was cast by someone else
				if (typeof mobs[damages[i].index].buffs[rowKey] === 'object') {
					if (typeof mobs[damages[i].index].buffs[rowKey].timer === 'object') {
						mobs[damages[i].index].buffs[rowKey].timer.kill()
					}
				}
				battle.processBuffs([{
					i: damages[i].index,
					level: damages[i].level, // needed???
					row: data.row,
					key: data.key,
				}])
			}
			ask.processAnimations({
				index: damages[i]. index,
				key: data.key,
			})
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
			isDebuff: !!(buffs[key].isDebuff),
			damage: damage,
		}])
		for (var k in mobs[index].buffs) {
			// console.info('onDotTick', k, mobs[index].buffs[k].row, mobs[index].buffs[k].duration)
			if (mobs[index].buffs[k].key === 'explosivePlague' &&
				my.row === mobs[index].buffs[k].row &&
				mobs[index].buffs[k].duration === 0) {
				// console.info('onDotTick DONE!', k, mobs[index].buffs[k])
				skill.WLK.explosivePlagueExplode(index, damage)
			}
		}
	}

	function selfDied() {
		// console.warn('You died!')
		// subtract XP
		if (!ng.isApp) {
			// really just for testing
			my.set(PROP.HP, 0)
			bar.updateBar(PROP.HP, my)
		}
		timers.clearMy()
		autoAttackDisable()
		spell.cancelSpell()
		battle.subtractExpPenalty()
		if (!party.isSomeoneAlive()) {
			mob.killAttacks(true)
		}
		battle.reckonGXL()
		animateMyDeath()
	}
	function triggerOnMyDeath() {
		// on death - must be done before health is subtracted
		if (my.buffFlags.profaneSpirit) {
			battle.removeBuff('profaneSpirit')
			skill.WLK.profaneSpiritExplosion()
		}
	}
	// damage hero functions
	function updateMyResource(type, addValue, bypassDeath) {
		/**
		 * when hero's hp, mp, sp increments or decrements
		 */
		if (my.hp <= 0 && !bypassDeath) {
			// console.warn('updateMyResource you are dead - no action taken')
			return
		}
		if (type === PROP.HP) {
			if (my.hp + addValue <= 0) triggerOnMyDeath()
		}
		my.set(type, addValue, true)
		// sanity check
		if (my[type] < 0) my.set(type, 0)
		else if (my[type] > my[type + 'Max']) my.set(type, my[type + 'Max'])
		// special cases
		if (type === PROP.HP) {
			if (my.hp <= 0) {
				// death
				if (ng.isApp) selfDied()
				else my.set(PROP.HP, my.hpMax) // testing
			}
		}
		bar.updateBar(type, my)
	}
	function processDamagesHero(index, d) {
		if (my.hp <= 0) {
			d.damage = 0
			return d
		}
		// check for things that immediately set to 0
		// check invulnerable
		if (my.buffFlags.frozenBarrier ||
			my.buffFlags.jumpStrike ||
			my.buffFlags.sealOfSanctuary) {
			chat.log(ng.getArticle(index, true) + ' ' + mobs[index].name + ' tries to hit YOU, but you are invulnerable!')
			d.damage = 0
			return d
		}
		// check miss
		if (rand() < mob.missChance(index)) {
			chat.log(ng.getArticle(index, true) + ' ' + mobs[index].name + ' tries to hit YOU, but misses!')
			d.damage = 0
			return d
		}
		// console.info('processDamagesHero', index, d)
		// dodge
		if (skills.dodge[my.job].level &&
			my.level >= skills.dodge[my.job].level) {
			combat.levelSkillCheck(PROP.DODGE)
			if (!d.isPiercing &&
				rand() < stats.dodgeChance()) {
				chat.log(ng.getArticle(index, true) + ' ' + mobs[index].name + ' tries to hit YOU, but you dodged!')
				d.damage = 0
				return d
			}
		}
		// console.info('processDamages', d)
		if (d.damageType === DAMAGE_TYPE.PHYSICAL) {
			// riposte
			if (skills.riposte[my.job].level &&
				my.level >= skills.riposte[my.job].level || skill.CRU.vengeanceOn) {

				if (!skill.CRU.vengeanceOn) combat.levelSkillCheck(PROP.RIPOSTE)

				if (!d.isPiercing &&
					rand() < stats.riposteChance() || skill.CRU.vengeanceOn) {
					skill.CRU.vengeanceOn = false
					chat.log(ng.getArticle(index, true) + ' ' +mobs[index].name + ' tries to hit YOU, but you riposted!')
					button.primaryAttack(true, index)
					d.damage = 0
					return d
				}
			}
			// parry
			if (skills.parry[my.job].level &&
				my.level >= skills.parry[my.job].level) {
				combat.levelSkillCheck(PROP.PARRY)
				if (!d.isPiercing &&
					rand() < stats.parryChance()) {
					chat.log(ng.getArticle(index, true) + ' ' +mobs[index].name + ' tries to hit YOU, but you parried!')
					d.damage = 0
					button.startSwing('primaryAttack')
					return d
				}
			}

			if (my.buffs.mirageStrikeBuff && my.buffs.mirageStrikeBuff.stacks) {
				skill.ROG.updateMirageStrikeBuff()
				d.damage = 0
				return d
			}

			// phyMit
			if (my.buffFlags.shimmeringOrb) buffMitigatesDamage(d, 'shimmeringOrb')
			if (my.buffFlags.sereneSigil) buffMitigatesDamage(d, 'sereneSigil')
			d.damage -= stats.phyMit()

			// enhancedDamage ?

			// shield block? maxes 75% reduction of damage; skips armor
			amountReduced = 1 - stats.armorReductionRatio()

			if (items.eq[13].blockRate &&
				rand() * 100 < items.eq[13].blockRate) {
				amountReduced -= .25
				d.blocked = round(d.damage * .25)
				if (d.blocked < 0) d.blocked = 0
			}
			if (mobs[index].buffFlags.sealOfDamnation) amountReduced -= buffs.sealOfDamnation.reduceDamage
			if (skill.MNK.isMendingAuraActive()) {
				amountReduced -= buffs.mendingAura.damageReduced[my.buffs['mendingAura-' + my.row].level]
				chat.log(buffs.mendingAura.msgReduced, CHAT.HEAL)
			}
			if (mob.isFeared(index)) amountReduced -= .5
			if (my.buffFlags.prowl) amountReduced -= .5

			// console.info('reduce', amountReduced)
			if (amountReduced < .25) amountReduced = .25
			// armor, shield, debuff reduction
			d.damage *= amountReduced
			// magic prop reduction
			d.damage *= stats.resistPhysical()
		}
		else {
			// magMit
			if (my.buffFlags.shimmeringOrb) buffMitigatesDamage(d, 'shimmeringOrb')
			if (my.buffFlags.sereneSigil) buffMitigatesDamage(d, 'sereneSigil')
			if (my.buffFlags.spiritBarrier) buffMitigatesDamage(d, 'spiritBarrier')
			d.damage -= stats.magMit()

			amountReduced = 1
			if (mob.isFeared(index)) amountReduced -= .5
			if (amountReduced < .25) amountReduced = .25
			d.damage *= amountReduced

			// my magic resists
			// console.info(d.damageType, index)
			d.damage *= stats.getResistPercent(d.damageType)
		}

		if (mobs[index].buffFlags.stasisField) {
			d.damage -= buffs.stasisField.evpMitigation[skill.ENC.getHighestStasis(index)]
		}
		// final sanity checks
		d.damage = d.damage < 1 ? 1 : round(d.damage)
		// shield damage
		if (my.buffFlags.guardianAngel) reduceMagicShieldDamage(d, 'guardianAngel')
		if (my.buffFlags.mirrorImage) reduceMagicShieldDamage(d, 'mirrorImage')
		combat.levelSkillCheck(PROP.DEFENSE)
		return d
	}
	function txDamageHero(index, damages) {
		// damages is an object with indices that point to player row (target)
		// TODO: Single player mode should bypass publishes everywhere...? lots of work
		if (party.presence[0].isLeader) {
			// console.info('txDamageHero', index, damages)
			socket.publish('party' + my.partyId, {
				route: 'p->hit',
				i: index,
				d: damages,
			})
		}
	}
	function rxDamageHero(data) {
		// mob is hitting me
		// console.info('rxDamageHero', data)
		let hits = data.d
		hits = hits.map(d => {
			// set some default values to avoid broadcasting them all the time
			if (!d.damageType) d.damageType = DAMAGE_TYPE.PHYSICAL
			if (!d.key) d.key = 'autoAttack'
			return d
		})
		// NOTE: possible for one mob to attack multiple PCs at once (AE breath, etc)

		// console.info('rxDamageHero: ', damages.length, data)
		if (hits[0].isParalyzed) {
			chat.log(ng.getArticle(data.i, true) + ' ' + mobs[data.i].name + ' is paralyzed!', CHAT.WARNING)
		}
		else {
			processDamageToMe(data.i, hits)
		}
	}
	function processDamageToMe(index, hits) {
		// NOTE should be all from ONE mob of the same attack TYPE, but MANY possible PC targets
		// always animate
		mob.animateAttack(index, hits[0].row)
		totalDamage = 0
		hits.forEach(hit => {
			if (hit.row !== my.row) return
			hit = processDamagesHero(index, hit)
			// console.info('hit', hit)
			if (hit.damage > 0) {
				totalDamage += hit.damage
				updateMyResource(PROP.HP, -hit.damage)
				if (hit.isPiercing) {
					if (hit.key === 'autoAttack') {
						chat.log(ng.getArticle(index, true) + ' ' + mobs[index].name + ' ripostes and hits YOU for ' + hit.damage + ' damage!', CHAT.ALERT)
					}
				}
				else {
					blockMsg = ''
					if (hit.blocked) {
						blockMsg = ' ('+ hit.blocked +' blocked)'
					}
					chat.log(ng.getArticle(index, true) + ' ' + mobs[index].name + ' hits YOU for ' + hit.damage + ' damage!'+ blockMsg, CHAT.ALERT)
				}
				if (hit.damageType === DAMAGE_TYPE.PHYSICAL) {
					spell.knockback()
				}
				// console.info('tx processHit: ', hit.damage)
			}
		})
		if (totalDamage > 0) {
			animatePlayerFrames()
			// damageTakenToMana vulpineMp
			vulpineMp += totalDamage * (stats.damageTakenToMana() / resourceLeechDivider)
			if (vulpineMp >= 1) {
				updateMyResource(PROP.MP, ~~vulpineMp)
				vulpineMp = vulpineMp % 1
			}
			vulpineSp += totalDamage * (stats.damageTakenToSpirit() / resourceLeechDivider)
			if (vulpineSp >= 1) {
				updateMyResource(PROP.SP, ~~vulpineSp)
				vulpineSp = vulpineSp % 1
			}
			game.txPartyResources({
				hp: my.hp,
				hpMax: my.hpMax,
			})
		}
		// only do this stuff if it hits me
	}

	const TextFoo = {
		startAt: { pixi: {scale: 2}},
		pixi: { scale: 1 },
	}
	const TextBar = {
		startAt: { pixi: { brightness: 3, contrast: 3 }},
		pixi: { brightness: .75, contrast: .75 },
	}
	function popupDamage(index, damage, o = {}) {
		if (typeof damage === 'number' && damage <= 0) return
		const basicText = new PIXI.Text(damage + '', o.isCrit ? combatTextCritStyle : combatTextRegularStyle)
		basicText.anchor.set(0.5)
		basicText.id = 'text-' + combat.textId++
		mobs[index].hitCount++
		basicText.x = mob.centerX[index]
		basicText.y = ask.centerY(index, true) + ((mobs[index].hitCount % 5) * 20)
		// console.info('basicText', basicText)
		combat.text.stage.addChild(basicText)
		if (o.isDot) {
			TweenMax.to(basicText, TextDuration, {
				y: '-=' + TextDistanceY * 1.5 + '',
				ease: Power2.easeOut,
				onComplete: removeText,
				onCompleteParams: [ basicText.id ],
			})
		}
		else {
			TweenMax.to(basicText, TextDuration * .6, {
				y: '-=' + TextDistanceY + '',
				onComplete: popupDamageFade,
				ease: Power3.easeOut
			})
			x = _.random(-TextDistanceX, TextDistanceX)
			TweenMax.to(basicText, TextDuration, {
				x: x < 0 ? '-=' + (x * -1) : '+=' + x,
				ease: Linear.easeOut
			})
		}
		TweenMax.to(basicText, TextDuration * .5, TextFoo)
		TweenMax.to(basicText, TextDuration, TextBar)
		/////////////////////////
		function popupDamageFade() {
			TweenMax.to(basicText, TextDuration * .4, {
				y: '+=' + TextDistanceY * .5 + '',
				alpha: 0,
				onComplete: removeText,
				onCompleteParams: [ basicText.id ],
				ease: Power1.easeIn
			})
		}
		function removeText(id) {
			el = pix.getId(combat.text, id)
			combat.text.stage.removeChild(el)
		}
	}

	function txHotHero(data) {
		// damages is an object with indices that point to player row (target)
		data = data.map(heal => _.pick(heal, KEYS.HEAL_HERO))
		// console.info('txHotHero', data)
		socket.publish('party' + my.partyId, {
			route: 'p->heal',
			row: my.row,
			heals: data
		})
	}
	function rxHotHero(data) {
		// console.info('rxHotHero: ', data)
		data.heals.forEach(heal => {
			if (typeof buffs[heal.key] === 'object' && buffs[heal.key].duration > 0) hotToMe(data.row, heal)
			else healToMe(data.row, heal)
		})
		if (data.heals[0].key === 'mendingAura') {
			// process hate reduction on all clients for player data.row
			mob.feignHate(data.row)
		}
	}
	let addHealPower = 0
	function processHeal(value) {
		enhanceHeal = 1
		addHealPower = 0
		if (skill.SHM.mysticalGlowActive()) enhanceHeal += buffs.mysticalGlow.enhanceHealing
		if (my.buffFlags.spiritBarrier) {
			enhanceHeal += buffs.spiritBarrier.enhanceHealing
			addHealPower += buffs.spiritBarrier.addHealPower[my.buffs.spiritBarrier.level]
		}
		// console.info('enhanceHealing', enhanceHeal, addHealPower)
		return round((value * enhanceHeal) + addHealPower)
	}
	function healToMe(row, heal) {
		hate = 0
		// console.info('healToMe rxHotHero', _.clone(heal))
		hate += heal.damage * (typeof buffs[heal.key].hate === 'number' ? buffs[heal.key].hate : 1)
		if (my.row === heal.index) {
			// healing ME
			heal.damage = processHeal(heal.damage)
			console.info('insta heal!', heal.damage)
			if (heal.damage > 0) {
				chat.log(buffs[heal.key].msg(heal), CHAT.HEAL)
				updateMyResource(PROP.HP, heal.damage)
				// let everyone know I got the heal
				game.txPartyResources({
					hp: my.hp,
					hpMax: my.hpMax,
				})
			}
			ask.processAnimations(heal)
		}
		if (~~hate !== 0) {
			mob.addHateHeal({
				row: row,
				hate: ~~hate
			})
		}
	}
	function hotToMe(row, heal) {
		hate = 0
		hate += heal.damage * (typeof buffs[heal.key].hate === 'number' ? buffs[heal.key].hate : 1)
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
				level: heal.level,
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
			if (buffs[heal.key].minimumValue) healAmount = _.max([buffs[heal.key].minimumValue, healAmount])
			my.buffs[keyRow].hotTicks = TweenMax.to(EmptyObject, buffs[heal.key].interval, {
				repeat: buffs[heal.key].ticks,
				onRepeat: onHotTick,
				onRepeatParams: [heal, healAmount],
			})
			battle.addMyBuff(heal.key, keyRow)
			// console.info('dot heal!', heal.damage)
			chat.log(buffs[heal.key].msg(heal), CHAT.HEAL)
			ask.processAnimations(heal)
		}
		// console.info('hotToMe rxHotHero', row, hate)
		if (~~hate !== 0) {
			mob.addHateHeal({
				row: row,
				hate: ~~hate
			})
		}
	}
	function onHotTick(buff, healAmount) {
		// console.info('healAmount b4', healAmount)
		healAmount = processHeal(healAmount)
		// console.info('healAmount b5', healAmount)
		chat.log(buffs[buff.key].name + ' heals you for ' + healAmount + ' health.', CHAT.HEAL)
		updateMyResource(PROP.HP, healAmount)
	}

	// buff hero
	function txBuffHero(data) {
		// console.info('txBuffHero', data)
		data = data.map(buff => _.pick(buff, KEYS.BUFF_HERO))
		socket.publish('party' + my.partyId, {
			route: 'p->buff',
			row: my.row,
			buffs: data
		})
	}
	function rxBuffHero(data) {
		// console.info('rxBuffHero: ', data)
		processBuffToMe(data)
	}
	function processBuffToMe(data) {
		hate = 0
		// console.info('processBuffToMe', data)
		data.buffs.forEach(buff => {
			if (buffs[buff.key].hate) {
				hate += ~~(buff.damage * buffs[buff.key].hate)
			}
			// console.info('updateHate hate', hate)

			if (my.row === buff.index) {
				let key = buff.key
				let previousStack = typeof my.buffs[key] === 'object' ?
						my.buffs[key].stacks : void 0
				// check level of buff - cancel if lower
				if (typeof my.buffs[key] === 'object') {
					if (buff.level < my.buffs[key].level) {
						// buff is lower level -
						if (//no timer but has damage
							typeof my.buffs[key].duration === 'undefined' && my.buffs[key].damage > 0 ||
							// timer-based active
							my.buffs[key].duration > 0) {
							// duration not defined or still active
							chat.log(buffs[buff.key].name + ' failed to take hold.', CHAT.WARNING)
							return
						}
					}

					// cancel/overwrite existing buff timer data keyRow: duration, function
					if (typeof my.buffs[key].timer === 'object') {
						my.buffs[key].timer.kill()
					}
				}
				battle.lastBuffAlreadyActive = my.buffFlags[key]
				chat.log(buffs[key].msg(), CHAT.HEAL)
				if (buffs[key].stacks === void 0) {
					battle.removeBuff(key)
				}
				// setup buff timer data
				my.buffs[key] = {
					row: buff.index,
					key: buff.key,
					stacks: previousStack
				}
				// optional keys
				if (buff.level) my.buffs[key].level = buff.level
				// sets shield type damage absorption shimmeringOrb, guardianAngel, sereneSigil etc
				if (buff.damage) my.buffs[key].damage = buff.damage
				if (buffs[key].stacks) {
					if (typeof my.buffs[key].stacks === 'number') {
						if (my.buffs[key].stacks < buffs[key].stacks) {
							my.buffs[key].stacks++
						}
					}
					else my.buffs[key].stacks = 1
				}

				// not timer based - my.buffFlags[key] must be set to false via depletion
				if (buffs[buff.key].duration > 0) {
					// timer based
					// console.warn('adding buff - dur:', buffs[buff.key].duration)
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
				processStatBuffsToMe(key, data.row)
				ask.processAnimations(buff)
			}
		})
		if (~~hate > 0) {
			mob.addHateHeal({
				row: data.row,
				hate: hate
			})
		}
	}

	function processStatBuffsToMe(key, buffedByRow) {
		// console.info('processStatBuffsToMe key!', key)
		if (key === 'spiritOfTheHunter') {
			bustAttack()
			updateCharStatColTwo()
		}
		else if (key === 'sealOfRedemption') {
			stats.resistBlood(true)
			bar.updateAllResistsDOM()
			my.set(PROP.HP_MAX, stats.hpMax())
			bar.updateBar(PROP.HP, my)
			txHpChange()
		}
		else if (key === 'zealousResolve') {
			stats.armor(true)
			updateCharStatColOne()
			my.set(PROP.HP_MAX, stats.hpMax())
			bar.updateBar(PROP.HP, my)
			txHpChange()
		}
		else if (key === 'bulwark') {
			stats.phyMit(true)
			stats.magMit(true)
		}
		else if (key === 'guardianAngel') {
			stats.resistFear(true)
		}
		else if (key === 'intrepidShout') {
			stats.armor(true)
			updateCharStatColOne()
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
			updateAllResists()
		}
		else if (key === 'branchSpirit') {
			stats.armor(true)
			updateCharStatColOne()
			bustAttack()
			updateCharStatColTwo()
			stats.hpRegen(true)
			my.set(PROP.HP_MAX, stats.hpMax())
			bar.updateBar(PROP.HP, my)
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
			bustSta()
			txHpChange()
			bustAttack()
			updateCharStatColTwo()
			bar.updateAllResistsDOM()
			updateCharStatColOne()
		}
		else if (key === 'lichForm') {
			stats.armor(true)
			updateCharStatColOne()
		}
		else if (key === 'profaneSpirit') {
			stats.resistPoison(true)
			stats.addPoison(true)
			bar.updateAllResistsDOM()
			updateCharStatColOne()
		}
		else if (key === 'phaseBlade') {
			stats.resistLightning(true)
			stats.addLightning(true)
			bar.updateAllResistsDOM()
		}
		else if (key === 'augmentation') {
			bustAgi()
			bustDex()
			updateCharStatColOne()
		}
		else if (key === 'clarity') {
			stats.intel(true)
			updateCharStatColTwo()
			my.set(PROP.MP_MAX, stats.mpMax())
			bar.updateBar(PROP.MP, my)
			txMpChange()
		}
		else if (key === 'conviction') {
			stats.cha(true)
			updateCharStatColTwo()
			my.set(PROP.SP_MAX, stats.spMax())
			bar.updateBar(PROP.SP, my)
			txSpChange()
		}
		else if (key === 'celestialFrenzy') {
			stats.cha(true)
			updateCharStatColTwo()
			my.set(PROP.SP_MAX, stats.spMax())
			bar.updateBar(PROP.SP, my)
			txSpChange()
		}
		else if (key === 'battleHymn') {
			bustDex()
			updateCharStatColOne()
			bustAttack()
			updateCharStatColTwo()
		}
		else if (key === 'militantCadence') {
			my.set(PROP.HP_MAX, stats.hpMax(true))
			bar.updateBar(PROP.HP, my)
			my.set(PROP.MP_MAX, stats.mpMax(true))
			bar.updateBar(PROP.MP, my)
			my.set(PROP.SP_MAX, stats.spMax(true))
			bar.updateBar(PROP.SP, my)
			txAllChange()
		}
		else if (key === 'litanyOfLife') {
			stats.hpRegen(true)
		}
		else if (key === 'melodyOfMana') {
			stats.mpRegen(true)
		}
		else if (key === 'chromaticSonata') {
			stats.armor(true)
			updateCharStatColOne()
			updateAllResists()
		}
		else if (key === 'consecrateBuff') {
			updateAllResists()
		}
		else if (key === 'sanguineHarvest') {
			stats.hpKill(true)
		}
		else if (key === 'viperStrikeBuff') {
			my.buffFlags.viperStrikeBuff && skill.MNK.viperStrikeHeal()
		}
		else if (key === 'spiritBarrier') {
			updateAllResists()
		}
		else if (key === 'fadedStrikeBuff') {
			updateAllResists()
			stats.dodge(true)
		}
		else if (key === 'risingFurorBuff') {
			// nothing required
		}
		else if (key === 'talismanOfTreachery') {
			bustAgi()
			stats.addPoison(true)
			bustAttack()
			updateCharStatColOne()
			updateCharStatColTwo()
		}
		////////////////////////////////
		function updateAllResists() {
			stats.resistSilence(true)
			stats.resistBlood(true)
			stats.resistPoison(true)
			stats.resistArcane(true)
			stats.resistLightning(true)
			stats.resistFire(true)
			stats.resistIce(true)
			bar.updateAllResistsDOM()
		}
		function bustAttack() {
			stats.str(true)
			stats.offense(true)
			stats.attack(void 0, true)
		}
		function bustStr() {
			stats.str(true)
			stats.attack(void 0, true)
		}
		function bustSta() {
			stats.sta(true)
			my.set(PROP.HP_MAX, stats.hpMax())
			bar.updateBar(PROP.HP, my)
		}
		function bustAgi() {
			stats.agi(true)
			stats.armor(true)
			stats.dodgeChance(true)
		}
		function bustDex() {
			stats.dex(true)
			stats.parryChance(true)
			stats.riposteChance(true)
			stats.critChance(true)
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
	}

	function txHpChange() {
		// console.info('processStatBuffsToMe tx!', key)
		game.txPartyResources({
			hp: my.hp,
			hpMax: my.hpMax,
		})
	}

	function txMpChange() {
		// console.info('processStatBuffsToMe tx!', key)
		game.txPartyResources({
			mp: my.mp,
			mpMax: my.mpMax,
		})
	}
	function txSpChange() {
		// console.info('processStatBuffsToMe tx!', key)
		game.txPartyResources({
			sp: my.sp,
			spMax: my.spMax,
		})
	}
	function txAllChange() {
		// console.info('processStatBuffsToMe tx!', key)
		game.txPartyResources({
			hp: my.hp,
			hpMax: my.hpMax,
			mp: my.mp,
			mpMax: my.mpMax,
			sp: my.sp,
			spMax: my.spMax,
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
			width: MaxWidth,
			height: MaxHeight,
			transparent: true
		});
		// style
		combat.text.view.id = 'combat-text'
		combat.text.view.style.position = 'absolute'
		combat.text.view.style.zIndex = 2
		combat.text.view.style.pointerEvents = 'none'
		querySelector('#scene-battle').appendChild(combat.text.view)
		updateCanvasLayer()
	}
	function updateCanvasLayer() {
		w = window.innerWidth
		if (combat.text !== void 0) {
			h = ~~(combat.text.screen.height / MaxHeight * window.innerHeight)
			combat.text.view.style.width = w + 'px'
			combat.text.view.style.height = h + 'px'

			battle.layer.view.style.width = w + 'px'
			battle.layer.view.style.height = h + 'px'
		}
		if (dungeon.layer.view !== void 0) {
			h = ~~(dungeon.layer.screen.height / MaxHeight * window.innerHeight)
			dungeon.layer.view.style.width = w + 'px'
			dungeon.layer.view.style.height = h + 'px'
		}


	}
	function targetChanged() {
		if (my.hp <= 0) return
		if (my.targetIsMob) targetChangedToMob()
		else targetChangedToPlayer()
		// console.info('targetChanged my.target =>', my.target, my.targetIsMob)
		battle.updateTarget(true)
		////////////////////////////////////////
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
	function buffMitigatesDamage(d, key) {
		let val = buffs[key].mitigation[my.buffs[key].level]
		d.damage -= val
		// console.info('buffMitigatesDamage remaining', my.buffs[key].damage)
		my.buffs[key].damage -= val
		if (my.buffs[key].damage <= 0) {
			my.buffs[key].damage = 0
			battle.removeBuff(key)
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