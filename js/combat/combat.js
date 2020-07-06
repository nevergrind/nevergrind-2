var combat;
!function($, _, TweenMax, PIXI, Math, Power1, Power3, Linear, undefined) {
	combat = {
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
		rxUpdateDamage,
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
		levelSkillCheck,
		skillLevelChance,
		endCombat,
		updateHeroResource,
		txHotHero,
		rxHotHero,
		txBuffHero,
		rxBuffHero,
		selfDied,
	}
	var el, w, h, i, len, damageArr, hit, damages, buffArr, index, hotData, buffData, key, resist, resistPenalty
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

	///////////////////////////////////////////
	function levelSkillCheck(name) {
		name = _.camelCase(name)
		if (my.level >= skills[name][my.job].level &&
			my[name] < stats.getPropMax(name)) { //TODO: Dynamic max
			if (rand() < skillLevelChance(name)) {
				my[name]++
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

		// dodge
		if (!d.isPiercing &&
			Math.random() * 100 < mobs[d.index].dodge) {
			d.damage = 0
			combat.popupDamage(d.index, 'DODGE!')
			return d
		}

		// info('processDamagesMob', d)
		if (d.damageType === 'physical') {
			// check for things that immediately set to 0
			if (Math.random() < stats.missChance(d.index, d.weaponSkill)) {
				// chat.log('Your attack misses ' + ng.getArticle(d.index) + ' ' + mobs[d.index].name + '!')
				d.damage = 0
				combat.popupDamage(d.index, 'MISS!')
				return d
			}
			// riposte
			if (!d.isPiercing &&
				timers.castBar < 1 &&
				Math.random() * 100 < mobs[d.index].riposte) {
				d.damage = 0
				combat.txDamageHero(d.index, [ mob.getMobDamage(d.index, my.row, true) ])
				combat.popupDamage(d.index, 'RIPOSTE!')
				return d
			}
			// parry
			if (!d.isPiercing &&
				timers.castBar < 1 &&
				Math.random() * 100 < mobs[d.index].parry) {
				d.damage = 0
				combat.popupDamage(d.index, 'PARRY!')
				return d
			}
			// enhancedDamage
			d.enhancedDamage += stats.enhanceDamageToMobType(combat.mobType[mobs[d.index].img])

			// reduce enhancedDamage
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

			//console.info('combat damage', d)
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
			if (mobs[d.index].buffFlags.igniteArmor) mobArmor += .15
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
		resistPenalty = 0
		if (mobs[d.index].level > my.level) {
			// 20% when 3 levels higher
			resistPenalty = Math.pow(mobs[d.index].level - my.level + 1, 2.16) / 100
		}
		resist -= resistPenalty
		if (resist < .25) resist = .25

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
		if (!o.hate) o.hate = o.damage
		mobs[o.index].hp -= o.damage
		party.damage[o.row] += o.damage

		// alive
		mob.hit(o.index)
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
	}
	function txDamageMob(damages) {
		damages = damages.map(processDamagesMob)
		console.warn('damages', damages)
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
				updateMobHp(damages[i])
				damageArr.push(damages[i])
			}
		}
		if (myDamage) {
			leechHp += myDamage * (stats.leech() / resourceLeechDivider)
			if (leechHp >= 1) {
				updateHeroResource('hp', ~~leechHp)
				leechHp = leechHp % 1
			}
			wraithMp += myDamage * (stats.wraith() / resourceLeechDivider)
			if (wraithMp >= 1) {
				updateHeroResource('mp', ~~wraithMp)
				wraithMp = wraithMp % 1
			}
		}
		if (damageArr.length && party.hasMoreThanOnePlayer()) {
			let damageData = {
				route: 'p->damage',
				damages: damageArr
			}
			if (buffArr.length) damageData.buffs = buffArr
			// console.info('tx processHit: ', damageData)
			socket.publish('party' + my.partyId, damageData, true)
		}
		buffArr.length && battle.processBuffs(buffArr)
	}
	function rxUpdateDamage(data) {
		// damages
		len = data.damages.length
		buffArr = []
		for (i=0; i<len; i++) {
			updateMobHp(data.damages[i])
			// console.info('rxUpdateDamage : ', data.damages)
		}
		// buffs
		if (typeof data.buffs === 'object') {
			data.buffs.forEach(buff => buffArr.push(buff))
		}
		buffArr.length && battle.processBuffs(buffArr)
	}

	function selfDied() {
		warn('You died!')
		// subtract XP
		if (!ng.isApp) {
			// really just for testing
			party.presence[0].hp = my.hp = 0
			bar.updateBar('hp')
		}
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
		if (my.hp <= 0 && !bypassDeath) {
			console.warn('updateHeroResource you are dead - no action taken')
			return
		}
		party.presence[0][type] = my[type] += addValue
		// sanity check
		if (my[type] < 0) {
			party.presence[0][type] = my[type] = 0
		}
		if (my[type] > my[type + 'Max']) {
			party.presence[0][type] = my[type] = my[type + 'Max']
		}
		// special cases
		if (type === 'hp') {
			if (my.hp <= 0) {
				// death
				if (ng.isApp) selfDied()
				else party.presence[0].hp = my.hp = my.hpMax // testing
			}
		}
		bar.updateBar(type)
	}
	function processDamagesHero(index, d) {
		console.info('txDamageHero', index, d)
		if (my.hp <= 0) {
			d.damage = 0
			return d
		}
		// check for things that immediately set to 0
		// check miss
		if (Math.random() < mob.missChance(mobs[index].level)) {
			chat.log(ng.getArticle(index, true) + ' ' + mobs[index].name + ' tries to hit YOU, but misses!')
			d.damage = 0
			return d
		}
		console.info('processDamagesHero', index, d)
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
			// magic debuffs
			if (mobs[index].buffFlags.suppressingVolley) d.damage *= .5

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
			if (amountReduced < .25) amountReduced = .25
			d.damage *= amountReduced
		}
		else {
			// magMit
			if (my.buffFlags.shimmeringOrb) reduceShimmeringOrbDamage(d)
			d.damage -= stats.magMit()

			// mob magic resists
			console.info(d.damageType, index)
			d.damage *= stats.getResistPercent(d.damageType)
		}
		// final sanity checks
		d.damage = d.damage < 1 ? 1 : round(d.damage)
		if (my.buffFlags.guardianAngel) reduceGuardianAngelDamage(d)
		combat.levelSkillCheck('defense')
		return d
	}
	function txDamageHero(index, damages) {
		// damages is an object with indices that point to player row (target)
		processDamageToMe(index, damages)
		mob.animateAttack(index)
		// animate mob for other players and check if they were hit
		if (party.hasMoreThanOnePlayer()) {
			socket.publish('party' + my.partyId, {
				route: 'p->hit',
				i: index,
				d: damages,
			}, true)
		}
	}
	function rxDamageHero(data) {
		// mob is hitting me
		damages = data.d
		processDamageToMe(data.i, damages)
		console.info('rxDamageHero: ', damages)
		mob.animateAttack(data.i)
	}
	function processDamageToMe(index, damages) {
		if (damages.findIndex(dam => dam.row === my.row) >= 0) {
			// something hit me
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
			game.updatePartyResources({
				hp: my.hp,
				hpMax: my.hpMax,
			})
		}
	}
	function popupDamage(index, damage, isCrit) {
		const basicText = new PIXI.Text(damage + '', isCrit ? combatTextCritStyle : combatTextRegularStyle)
		basicText.anchor.set(0.5)
		basicText.id = 'text-' + combat.textId++
		mobs[index].hitCount++
		basicText.x = mob.centerX[index]
		basicText.y = env.maxHeight - mob.bottomY[index] - mobs[index].clickAliveH * mobs[2].size + ((mobs[index].hitCount % 5) * 20)
		//info('basicText', basicText)
		combat.text.stage.addChild(basicText)
		TweenMax.to(basicText, textDuration * .6, {
			y: '-=' + textDistanceY + '',
			onComplete: function() {
				TweenMax.to(basicText, textDuration * .4, {
					y: '+=' + textDistanceY * .5 + '',
					alpha: 0,
					onComplete: removeText,
					onCompleteParams: [ basicText.id ],
					ease: Power1.easeIn
				})
			},
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
	}

	function txHotHero(index, data) {
		// damages is an object with indices that point to player row (target)
		console.info('txHotHero', index, data)
		if (data.index === my.row) {
			processHealToMe(data)
		}
		else {
			let name = party.getNameByRow(data.index)
			if (name) {
				socket.publish('name' + name, {
					action: 'p->HoT',
					data: _.pick(data, ['damage', 'index', 'key'])
				}, true)
			}
		}
	}
	function rxHotHero(data) {
		console.info('rxHotHero: ', data)
		processHealToMe(data.data)
	}
	function processHealToMe(buff) {
		console.info('processHealToMe', buff)
		if (buffs[buff.key].duration > 0) {
			let keyRow = buff.key + '-' + buff.index
			// cancel/overwrite existing buff timer data keyRow: duration, function
			if (typeof my.buffs[keyRow] === 'object' &&
				typeof my.buffs[keyRow].timer === 'object') {
				my.buffs[keyRow].timer.kill()
				my.buffs[keyRow].hotTicks.kill()
				battle.removeBuff(buff.key, keyRow)
			}
			// setup buff timer data
			my.buffs[keyRow] = {
				row: buff.index,
				key: buff.key,
				duration: buffs[buff.key].duration,
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
			let healAmount = Math.round(buff.damage / buffs[buff.key].ticks)
			my.buffs[keyRow].hotTicks = TweenMax.to({}, buffs[buff.key].interval, {
				repeat: buffs[buff.key].ticks,
				onRepeat: onHotTick,
				onRepeatParams: [buff, healAmount],
			})
			battle.addMyBuff(buff.key, keyRow)
			chat.log(buffs[buff.key].msg(buff), 'chat-heal')
		}
		else {
			let healAmount = buff.damage
			chat.log(buffs[buff.key].msg(buff), 'chat-heal')
			updateHeroResource('hp', healAmount)
			game.updatePartyResources({
				hp: my.hp,
				hpMax: my.hpMax,
			})
		}
	}
	function onHotTick(buff, healAmount) {
		chat.log(buffs[buff.key].name + ' heals you for ' + healAmount + ' health.', 'chat-heal')
		updateHeroResource('hp', healAmount)
	}

	// buff hero
	function txBuffHero(index, data) {
		// damages is an object with indices that point to player row (target)
		console.info('txBuffHero', data, spell.config.targetName)
		if (spell.config.targetName === my.name) {
			processBuffToMe(data)
		}
		else {
			buffData = data.map(buff => {
				return _.pick(buff, ['damage', 'index', 'key', 'level'])
			})
			socket.publish('name' + spell.config.targetName, {
				action: 'p->buff',
				//data: data,
				data: buffData,
			}, true)
		}
	}
	function rxBuffHero(data) {
		console.info('rxBuffHero: ', data)
		processBuffToMe(data.data)
	}
	function processBuffToMe(data) {
		console.info('processBuffToMe', data)
		chat.log(buffs[data[0].key].msg(), 'chat-heal')
		data.forEach(buff => {
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
		h = ~~(combat.text.screen.height / env.maxHeight * window.innerHeight)
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
	function reduceGuardianAngelDamage(d) {
		chat.log(buffs.guardianAngel.msgAbsorb, 'chat-buff')
		console.info('reduceGuardianAngelDamage', my.buffs.guardianAngel.damage)
		if (d.damage > my.buffs.guardianAngel.damage) {
			d.damage -= my.buffs.guardianAngel.damage
			my.buffs.guardianAngel.damage = 0
			battle.removeBuff('guardianAngel')
		}
		else {
			my.buffs.guardianAngel.damage -= d.damage
			d.damage = 0

		}
	}
}($, _, TweenMax, PIXI, Math, Power1, Power3, Linear);