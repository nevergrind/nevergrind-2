var combat;
!function($, _, TweenMax, PIXI, Math, Power1, Power3, Linear, undefined) {
	combat = {
		textId: 0,
		rxUpdateDamage,
		popupDamage,
		targetChanged,
		initCombatTextLayer,
		updateCombatTextLayer,
		toggleAutoAttack,
		txDamageMob,
		processDamages,
		isValidTarget,
		getDiffClass,
		autoAttackDisable,
	}
	var el, w, h, i, len, damageArr

	let levelDiff = 0

	const textDuration = 1
	const textDistanceY = 150
	const textDistanceX = 80
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
	///////////////////////////////////////////
	function isValidTarget() {
		return my.target >= 0 && my.target < mob.max
	}
	function processDamages(d) {
		if (typeof mobs[d.index] === 'undefined' || !mobs[d.index].name) {
			d.damage = 0
			return d
		}
		if (my.level > mobs[d.index]) {
			levelDiff = 0
		}

		// check for things that immediately set to 0
		// dodge
		if (!d.isPiercing && Math.random() * 100 < mobs[d.index].dodge) {
			warn('dodged!')
			d.damage = 0
			return d
		}

		// info('processDamages', d)
		if (d.damageType === 'physical') {
			// riposte
			if (!d.isPiercing && Math.random() * 100 < mobs[d.index].riposte) {
				warn('riposted!')
				d.damage = 0
				return d
			}
			// parry
			if (!d.isPiercing && Math.random() * 100 < mobs[d.index].parry) {
				warn('parried!')
				d.damage = 0
				return d
			}
			// enhancedDamage



			// reduce enhancedDamage

			d.damage *= d.enhancedDamage
			// damage penalties
			if (d.requiresFrontRow && d.index > 4 ||
				d.index === -1) {
				d.damage = 0
			}
			if (d.damageType === 'physical' &&
				!d.isRanged &&
				d.index > 4) {
				// physical on back row
				d.damage *= .5
			}
			// mob armor

			// +add spell damage

		}
		else {
			// mob magic resists
			info('fire:', d.index, mobs[d.index])
			d.damage *= mobs[d.index].resist[d.damageType]

		}
		// final sanity checks
		d.damage = d.damage < 1 ? ceil(d.damage) : round(d.damage)
		return d
	}
	function toggleAutoAttack() {
		if (!my.isAutoAttacking) autoAttackEnable()
		else autoAttackDisable()
	}
	function autoAttackEnable() {
		if (my.isAutoAttacking) return
		my.isAutoAttacking = true
		button.primaryAttack()
		button.secondaryAttack()
		el = querySelector('#main-attack-wrap')
		el.classList.remove('active')
		el.classList.add('active')
	}
	function autoAttackDisable() {
		if (!my.isAutoAttacking) return
		my.isAutoAttacking = false
		el = querySelector('#main-attack-wrap')
		el.classList.remove('active')
	}
	function endCombat() {
		warn('battle is over!')
		autoAttackDisable()
		querySelector('#mob-target-wrap').style.display = 'none'
		delayedCall(5, dungeon.go)
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
		mobs[o.index].hp -= o.damage
		if (!o.hate) o.hate = 1
		party.damage[o.row] += (o.damage * o.hate)

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
			}
		}
	}
	function txDamageMob(damages) {
		damages = damages.map(combat.processDamages)
		damageArr = []
		len = damages.length
		for (i=0; i<len; i++) {
			if (damages[i].damage > 0) {
				updateMobHp({
					row: my.row,
					index: damages[i].index,
					damage: damages[i].damage,
				})
				damageArr.push({
					r: my.row,
					i: damages[i].index,
					d: damages[i].damage,
					c: damages[i].isCrit,
				})
				info('tx processHit: ', damages[i].damage)
			}
		}
		socket.publish('party' + my.partyId, {
			route: 'party->damage',
			d: damageArr
		}, true)
	}
	function rxUpdateDamage(data) {
		len = data.d.length
		for (var i=0; i<len; i++) {
			updateMobHp({
				row: data.d[i].r,
				index: data.d[i].i,
				damage: data.d[i].d,
				crit: data.d[i].c
			})
			info('rx processing damage : ', data.d[i].d)
		}
	}
	function popupDamage(index, damage, isCrit) {
		const basicText = new PIXI.Text(damage + '', isCrit ? combatTextCritStyle : combatTextRegularStyle)
		basicText.anchor.set(0.5)
		basicText.id = 'text-' + combat.textId++
		basicText.x = mob.centerX[index]
		basicText.y = env.maxHeight - mob.bottomY[index] - mobs[index].clickAliveH * mobs[2].size
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
			startAt: { pixi: { brightness: isCrit ? 3 : 7, saturate: isCrit ? 3 : 7 }},
			pixi: { brightness: 1, saturate: 1 },

		})

		x = _.random(-textDistanceX, textDistanceX)
		TweenMax.to(basicText, textDuration, {
			x: x < 0 ? '-=' + (x * -1) : '+=' + x,
			ease: Linear.easeOut
		})
	}
	function initCombatTextLayer() {
		combat.text = new PIXI.Application({
			width: 1920,
			height: 1080,
			transparent: true
		});
		// style
		combat.text.view.id = 'combat-text'
		combat.text.view.style.position = 'absolute'
		combat.text.view.style.zIndex = 1
		combat.text.view.style.pointerEvents = 'none'
		querySelector('#scene-battle').appendChild(combat.text.view)
		updateCombatTextLayer()
	}
	function updateCombatTextLayer() {
		w = window.innerWidth
		h = ~~(combat.text.screen.height / env.maxHeight * window.innerHeight)
		combat.text.view.style.width = w + 'px';
		combat.text.view.style.height = h + 'px';
	}
	function removeText(id) {
		el = pix.getId(combat.text, id)
		combat.text.stage.removeChild(el)
	}
	function targetChanged() {
		let index = 0
		for (el of querySelectorAll('.mob-details')) {
			if (index !== my.hoverTarget) {
				el.classList.remove('targeted', 'block-imp')
			}
			else {
				el.classList.remove('targeted')
			}
			index++
		}
		info('targetChanged my.target =>', my.target, mobs[my.target].level, mobs[my.target])
		if (combat.isValidTarget()){
			querySelector('#mob-details-' + my.target).classList.add('targeted', 'block-imp')
		}
		battle.updateTarget(true)
	}
	function getDiffClass(minQuestLvl) {
		var resp = 'con-grey';
		if (minQuestLvl >= my.level + 3) resp = 'con-red';
		else if (minQuestLvl > my.level) resp = 'con-yellow';
		else if (minQuestLvl === my.level) resp = 'con-white';
		else if (minQuestLvl >= ~~(my.level * .88) ) resp = 'con-high-blue';
		else if (minQuestLvl >= ~~(my.level * .77) ) resp = 'con-low-blue';
		else if (minQuestLvl >= ~~(my.level * .66) ) resp = 'con-green';
		return resp;
	}
}($, _, TweenMax, PIXI, Math, Power1, Power3, Linear);