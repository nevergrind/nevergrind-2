var combat;
!function($, _, TweenMax, PIXI, undefined) {
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
	}
	var el, w, h, i, len

	///////////////////////////////////////////
	function processDamages(d) {
		// check for things that immediately set to 0
		// dodge, parry, riposte

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


		// damage penalties

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
	function updateMobHp(index, damage, isCrit) {
		mobs[index].hp -= damage
		if (mobs[index].hp <= 0) {
			warn('mob is dead!')
			// mob.death(index)
		}
		else {
			// alive
			mob.hit(index)
			popupDamage(index, damage, isCrit)
		}
		mob.drawMobBar(index)
	}
	function txDamageMob(damages) {
		damages = damages.map(combat.processDamages)
		len = damages.length
		for (i=0; i<len; i++) {
			if (damages[i].damage > 0) {
				updateMobHp(damages[i].index, damages[i].damage)
				// popupDamage(damages[i].index, damages[i].damage, damages[i].isCrit)
				info('tx processHit: ', damages[i].damage)
				socket.publish('party' + my.partyId, {
					route: 'party->damage',
					d: arrOfDamage
				}, true)
			}
		}
	}
	function rxUpdateDamage(data) {
		data.d.forEach(processUpdateDamage)
	}
	function processUpdateDamage(hit) {
		updateMobHp(hit.i, hit.d, hit.c)
		info('rx processing damage : ', hit.d)
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
		// info('targetChanged my.target', my.target)
		if (my.target >= 0 && my.target < mob.max){
			querySelector('#mob-details-' + my.target).classList.add('targeted', 'block-imp')
		}
	}
}($, _, TweenMax, PIXI);