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
		txDamageMobMelee,
	}
	var el, w, h

	///////////////////////////////////////////
	function rxUpdateDamage(data) {
		data.d.forEach(processUpdateDamage)
	}
	function processUpdateDamage(hit) {
		updateMobHp(hit.i, hit.d)
		info('processing damage : ', hit.d)
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
	function updateMobHp(index, damage) {
		mobs[index].hp -= damage
		if (mobs[index].hp <= 0) {
			warn('mob is dead!')
		}
		mob.drawMobBar(index)
	}
	function txDamageMobMelee(index, damage, isCrit) {
		damage = round(damage)
		updateMobHp(index, damage)
		popupDamage(index, damage, isCrit)
		info('processing damage: ', damage)
		// post round operations
		socket.publish('party' + my.partyId, {
			route: 'party->damage',
			d: [{
				i: index,
				d: damage,
			}]
		}, true)
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
		info('targetChanged my.target', my.target)
		if (my.target >= 0 && my.target < mob.max){
			querySelector('#mob-details-' + my.target).classList.add('targeted', 'block-imp')
		}
	}
}($, _, TweenMax, PIXI);