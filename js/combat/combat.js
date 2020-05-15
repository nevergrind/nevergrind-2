var combat;
!function($, _, TweenMax, PIXI, undefined) {
	combat = {
		textId: 0,
		damageMobMelee,
		popupDamage,
		targetChanged,
		initCombatTextLayer,
		updateCombatTextLayer,
	}
	var el, w, h

	///////////////////////////////////////////
	function damageMobMelee(index, damage) {
		mobs[index].hp -= damage
		if (mobs[index].hp <= 0) {
			warn('mob is dead!')
		}
		mob.drawMobBar(index)
		// post round operations
		damage = round(damage)
		popupDamage(index, damage)
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
		querySelector('#scene-battle').appendChild(combat.text.view)
		updateCombatTextLayer()
	}
	function updateCombatTextLayer() {
		w = window.innerWidth
		h = ~~(combat.text.screen.height / env.maxHeight * window.innerHeight)
		combat.text.view.style.width = w + 'px';
		combat.text.view.style.height = h + 'px';
		info('updateCombatTextLayer', w, h)
	}

	const textDuration = 1
	const textDistanceY = 150
	const textDistanceX = 80
	const combatTextRegularStyle = {
		fontFamily: 'Play',
		fontSize: 36,
		// fill: ['#fff'],
		fill: ['#048', '#ee8', '#ee8', '#048'],
		stroke: '#013',
		strokeThickness: 4,
	}
	function popupDamage(index, damage) {

		const basicText = new PIXI.Text(damage + '', combatTextRegularStyle)
		basicText.anchor.set(0.5)
		basicText.id = 'text-' + combat.textId++
		basicText.x = mob.centerX[index]
		basicText.y = env.maxHeight - mob.bottomY[index] - mobs[index].clickAliveH

		combat.text.stage.addChild(basicText)

		TweenMax.to(basicText, textDuration * .6, {
			y: '-=' + textDistanceY + '',
			onComplete: function() {
				TweenMax.to(basicText, textDuration * .4, {
					y: '+=' + textDistanceY * .5 + '',
					alpha: 0,
					onComplete: removeText,
					onCompleteParams: [ basicText.id ],
					ease: Power2.easeIn
				})
			},
			ease: Power2.easeOut
		})
		TweenMax.to(basicText, textDuration * .25, {
			startAt: { pixi: {scale: 2}},
			pixi: { scale: 1 },
			ease: Back.easeInOut,
		})
		TweenMax.to(basicText, textDuration, {
			startAt: { pixi: { brightness: 7, saturate: 7 }},
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
		querySelectorAll('.mob-name')
		for (el of querySelectorAll('.mob-name')) {
			el.classList.remove('targeted')
		}
		info('targetChanged my.target', my.target)
		querySelector('#mob-name-' + my.target).classList.add('targeted')
	}
}($, _, TweenMax, PIXI);