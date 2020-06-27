var button;
!function(TweenMax, $, _, Linear, Power4, undefined) {
	button = {
		startSwing,
		setAll,
		hide,
		triggerGlobalCooldown,
		handleButtonStart,
		handleButtonUpdate,
		handleButtonComplete,
		updateSkillTime,
		primaryAttack,
		secondaryAttack,
		triggerSkill,
		processButtonTimers,
		init,
		initialized: false,
	}
	var name, hit

	let globalCooldownDur = 2
	let damages
	const displayBlock = { display: 'block' }
	/////////////////////////////

	function init() {
		$("#button-wrap")
			.on('click', '.job-skill-btn', handleSkillButtonClick)
			.on('click', '#skill-primary-attack-btn', combat.toggleAutoAttack)
			.on('click', '#skill-secondary-attack-btn', combat.toggleAutoAttack)
	}

	function isOffhandingWeapon() {
		return item.offhandWeaponTypes.includes(items.eq[13].itemType)
	}

	//////////////////////////////////
	function processButtonTimers(index, skillData) {
		let el = querySelector('#skill-timer-' + index + '-rotate')
		// processButtonTimers
		TweenMax.set(el, displayBlock)
		let args = {
			el: el,
			index: index,
		}
		let timerObj = {
			onStart: handleButtonStart,
			onStartParams: [ args ],
			onUpdate: handleButtonUpdate,
			onUpdateParams: [ args ],
			onComplete: handleButtonComplete,
			onCompleteParams: [ args, true ],
			ease: Linear.easeNone
		}
		timerObj[index] = 1

		let textEl = querySelector('#skill-timer-' + index)
		let textObj = {
			el: textEl,
			remaining: skillData.cooldownTime
		}

		textEl.innerHTML = skillData.cooldownTime
		TweenMax.to(textObj, 1, {
			repeat: skillData.cooldownTime,
			onRepeat: button.updateSkillTime,
			onRepeatParams: [ textObj ]
		})
		TweenMax.to(timers.skillCooldowns, skillData.cooldownTime, timerObj)
	}
	function triggerGlobalCooldown() {
		timers.globalCooldown = 0
		let selector = []
		timers.skillCooldowns.forEach((skill, index) => {
			if (skill === 1) {
				selector.push('#skill-timer-'+ index +'-rotate')
			}
		})
		selector = selector.join(', ')
		TweenMax.set(selector, displayBlock)
		let args = {
			el: selector,
			key: 'globalCooldown',
		}
		TweenMax.to(timers, globalCooldownDur, {
			globalCooldown: 1,
			onStart: handleButtonStart,
			onStartParams: [ args ],
			onUpdate: handleButtonUpdate,
			onUpdateParams: [ args ],
			onComplete: handleButtonComplete,
			onCompleteParams: [ args ],
			ease: Linear.easeNone
		})
	}
	function triggerSkill(index) {
		if (my.hp <= 0) return

		name = _.camelCase(skills[my.job][index].name)
		console.info('triggerSkill', name)
		if (typeof skill[my.job][name] === 'function') {
			skill[my.job][name](index, skills[my.job][index])
		}
		else {
			chat.log('This skill is not defined:' + name, 'chat-warning')
		}
	}
	function handleSkillButtonClick() {
		triggerSkill(this.dataset.index * 1)
	}

	function successfulDoubleAttack() {
		return my.doubleAttack / 600
	}
	function successfulDualWield() {
		return my.dualWield / 350
	}
	function primaryAttack(isPiercing, index) {
		if (isPiercing) {
			if (ng.view !== 'battle' ||
			my.hp <= 0) return
		}
		else {
			if (ng.view !== 'battle' ||
				!my.isAutoAttacking ||
				timers.primaryAttack < 1 ||
				my.hp <= 0) return
		}

		if (!isPiercing) {
			if (timers.castBar < 1 || !my.targetIsMob) {
				// non-ripostes are held back by these conditions ^
				if (my.isAutoAttacking) delays['primaryAttack'] = delayedCall(.1, primaryAttack)
				return
			}
		}

		if (typeof index === 'undefined') {
			// ripostes target index - makes it possible to riposte while targeting party
			my.fixTarget()
			if (my.target === -1) return
			index = my.target
		}

		damages = []
		hit = stats.damage()
		damages.push({
			index: index,
			isPiercing: isPiercing,
			...hit
		})
		// double attack?
		if (!isPiercing &&
			my.level >= skills.doubleAttack[my.job].level) {
			combat.levelSkillCheck('doubleAttack')
			if (Math.random() < successfulDoubleAttack()) {
				hit = stats.damage()
				damages.push({
					index: index,
					...hit
				})
			}
		}
		combat.txDamageMob(damages)
		startSwing('primaryAttack')
	}
	function secondaryAttack() {
		warn('secondaryAttack')
		if (ng.view !== 'battle' ||
			!my.isAutoAttacking ||
			timers.secondaryAttack < 1 ||
			my.hp <= 0 ||
			!isOffhandingWeapon()) return

		if (timers.castBar < 1 || !my.targetIsMob) {
			if (my.isAutoAttacking) delays['secondaryAttack'] = delayedCall(.1, secondaryAttack)
			return
		}
		if (my.target === -1) return

		if (my.level >= skills.dualWield[my.job].level) {
			combat.levelSkillCheck('dualWield')
			if (successfulDualWield()) {
				hit = stats.offhandDamage()
				damages = []
				damages.push({
					index: my.target,
					...hit
				})
				if (my.level >= skills.doubleAttack[my.job].level) {
					if (Math.random() < successfulDoubleAttack()) {
						hit = stats.damage()
						damages.push({
							index: my.target,
							...hit
						})
					}
				}
				combat.txDamageMob(damages)
			}
		}

		startSwing('secondaryAttack')
	}
	function startSwing(key) {
		timers[key] = 0
		let slot, el
		if (key === 'primaryAttack') {
			slot = 12
			el = querySelector('#skill-timer-primary-rotate')
		}
		else {
			slot = 13
			el = querySelector('#skill-timer-secondary-rotate')
		}

		if (timers.castBar < 1) {
			// TODO: FIX THIS SHIT
			// cannot auto attack while casting
			console.info('casting...', Date.now())
			delays[key] = delayedCall(.1, startSwing, [key])
			return
		}

		TweenMax.set(el, { display: 'block' })
		let o = {
			el: el,
			key: key,
		}
		let to = {
			onStart: handleButtonStart,
			onStartParams: [ o ],
			onUpdate: handleButtonUpdate,
			onUpdateParams: [ o ],
			onComplete: handleButtonComplete,
			onCompleteParams: [ o ],
			ease: Linear.easeNone
		}
		to.startAt = {}
		to.startAt[key] = 0
		to[key] = 1

		TweenMax.to(timers, items.eq[slot].speed, to)
		delays[key].kill()
		delays[key] = delayedCall(items.eq[slot].speed, button[key])
	}
	function handleButtonStart(o) {
		TweenMax.set(o.el, {
			scale: 1,
			alpha: 1,
		})
	}

	function handleButtonUpdate(o) {
		/*if (o.type === 'singleGlobal') {

		}*/
		if (typeof o.index === 'number') {
			// skill
			TweenMax.set(o.el, {
				background: 'conic-gradient(#0000 ' + timers.skillCooldowns[o.index] + 'turn, #000d ' + timers.skillCooldowns[o.index] + 'turn)'
			})
		}
		else {
			// global
			TweenMax.set(o.el, {
				background: 'conic-gradient(#0000 ' + timers[o.key] + 'turn, #000d ' + timers[o.key] + 'turn)'
			})
		}
	}
	function handleButtonComplete(o, checkGlobalInProgress) {
		if (checkGlobalInProgress &&
			timers.globalCooldown < 1) {
			let duration = globalCooldownDur - (timers.globalCooldown * globalCooldownDur)
			TweenMax.set(o.el, displayBlock)
			let newTimer = {
				globalCooldown: 1
			}
			let args = {
				el: o.el,
				key: 'globalCooldown',
			}
			TweenMax.to(newTimer, duration, {
				globalCooldown: 1,
				onStart: handleButtonStart,
				onStartParams: [ args ],
				onUpdate: handleButtonUpdate,
				onUpdateParams: [ args ],
				onComplete: handleButtonComplete,
				onCompleteParams: [ args ],
				ease: Linear.easeNone
			})
		}
		else {
			// button flash
			TweenMax.to(o.el, .5, {
				startAt: {
					scale: 1,
					alpha: 1,
					background: 'radial-gradient(50% 50% at 50% 50%, #ffff, #27f8 66%, #0490 100%)',
				},
				scale: .75,
				alpha: 0,
			})
		}
	}
	function updateSkillTime(obj) {
		obj.remaining--
		obj.el.innerHTML = !obj.remaining ? '' : obj.remaining
		TweenMax.to(obj.el, 1, {
			startAt: { scale: 1.15 },
			scale: 1,
			ease: Power4.easeNone
		})
	}
	function setAll() {
		TweenMax.set('#button-wrap', {
			startAt: { display: 'flex' },
		})
		if (button.initialized) return
		var s = '';
		// base attack buttons
		s += '<div id="main-attack-wrap">' +
			'<div class="skill-btn">' +
				'<img id="skill-primary-attack-btn" class="skill-img popover-icons" src="'+ bar.getItemSlotImage('eq', 12) +'">' +
				'<div id="skill-timer-primary-rotate" class="no-pointer skill-timer-rotate"></div>' +
			'</div>'
			if (isOffhandingWeapon()) {
				s += '<div class="skill-btn">' +
					'<img id="skill-secondary-attack-btn" class="skill-img popover-icons" src="'+ bar.getItemSlotImage('eq', 13) +'">' +
					'<div id="skill-timer-secondary-rotate" class="no-pointer skill-timer-rotate"></div>' +
				'</div>'
			}
		s += '</div>' +
		'<div id="skill-col">' +
			'<div id="exp-bar-wrap">' +
				'<div id="exp-bar"></div>' +
				'<div id="exp-bar-grid"></div>' +
			'</div>' +
			'<div id="skill-btn-wrap">'
		// skill buttons
		for (var i=0; i<12; i++) {
			s +=
			'<div id="skill-btn-'+ i +'" class="skill-btn job-skill-btn" data-index="'+ i +'">' +
				'<img id="skill-'+ i +'" class="skill-img popover-icons" src="images/skills/'+ my.job +'/'+ i +'.png">' +
				'<div id="skill-timer-'+ i +'-rotate" class="skill-timer-rotate"></div>' +
				'<div id="skill-timer-'+ i +'" class="skill-timer"></div>' +
			'</div>'
		}
		s += '</div>' +
		'</div>'

		querySelector('#button-wrap').innerHTML = s;
		button.initialized = true
		battle.drawExpBar(0, 0)
	}
	function hide() {
		TweenMax.set('#button-wrap', {
			display: 'none'
		});
	}
}(TweenMax, $, _, Linear, Power4);