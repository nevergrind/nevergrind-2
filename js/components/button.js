var button;
!function(TweenMax, $, _, Linear, Power4, undefined) {
	button = {
		initialized: false,
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
	}
	var arr, damage, name, hit

	let damages
	const displayBlock = { display: 'block' }
	const displayNone = { display: 'none' }
	/////////////////////////////

	function isOffhandingWeapon() {
		return item.offhandWeaponTypes.includes(items.eq[13].itemType)
	}

	$("#button-wrap")
		.on('click', '.job-skill-btn', handleSkillButtonClick)
		.on('click', '#primary-attack-btn', primaryAttack)
		.on('click', '#secondary-attack-btn', secondaryAttack)

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
			onCompleteParams: [ args ],
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
		TweenMax.to(timers, 2, {
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
		name = _.camelCase(skills[my.job][index].name)
		console.info('triggerSkill', name)
		if (my.hp <= 0) {
			warn('You are dead')
			if (ng.isApp) return
		}
		if (typeof skill[my.job][name] === 'function') {
			skill[my.job][name](index, skills[my.job][index])
		}
		else {
			warn('This skill function is not defined!', name)
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
	function primaryAttack() {
		if (ng.view !== 'battle' || timers.primaryAttack < 1 || my.hp <= 0) return
		my.fixTarget()
		if (my.target === -1) return
		damages = []

		hit = stats.damage()
		damages.push({
			index: my.target,
			...hit
		})
		// double attack?
		if (my.level >= skills.doubleAttack[my.job].level) {
			combat.levelSkillCheck('doubleAttack')
			if (Math.random() < successfulDoubleAttack()) {
				hit = stats.damage()
				damages.push({
					index: my.target,
					...hit
				})
			}
		}
		combat.txDamageMob(damages)

		timers.primaryAttack = 0
		let el = querySelector('#skill-timer-primary-rotate')
		TweenMax.set(el, {
			display: 'block'
		})
		let o = {
			el: el,
			key: 'primaryAttack',
		}
		TweenMax.to(timers, items.eq[12].speed, {
			primaryAttack: 1,
			onStart: handleButtonStart,
			onStartParams: [ o ],
			onUpdate: handleButtonUpdate,
			onUpdateParams: [ o ],
			onComplete: handleButtonComplete,
			onCompleteParams: [ o ],
			ease: Linear.easeNone
		})
		delays.primaryAttack.kill()
		delays.primaryAttack = delayedCall(items.eq[12].speed, autoAttackPrimary)
	}
	function secondaryAttack() {
		if (ng.view !== 'battle' || timers.secondaryAttack < 1 || !isOffhandingWeapon() || my.hp <= 0) return
		my.fixTarget()
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

		let el = querySelector('#skill-timer-secondary-rotate')
		if (el !== null) {
			timers.secondaryAttack = 0
			TweenMax.set(el, {
				display: 'block'
			})
			let args = {
				el: el,
				key: 'secondaryAttack',
			}
			TweenMax.to(timers, items.eq[13].speed, {
				secondaryAttack: 1,
				onStart: handleButtonStart,
				onStartParams: [ args ],
				onUpdate: handleButtonUpdate,
				onUpdateParams: [ args ],
				onComplete: handleButtonComplete,
				onCompleteParams: [ args ],
				ease: Linear.easeNone
			})
			delays.secondaryAttack.kill()
			delays.secondaryAttack = delayedCall(items.eq[13].speed, autoAttackSecondary)
		}
	}
	function autoAttackPrimary() {
		if (my.isAutoAttacking) primaryAttack()
	}
	function autoAttackSecondary() {
		if (my.isAutoAttacking) secondaryAttack()
	}
	function handleButtonStart(o) {
		TweenMax.set(o.el, {
			scale: 1,
			alpha: 1,
		})
	}

	function handleButtonUpdate(o) {
		if (typeof o.index === 'number') {
			TweenMax.set(o.el, {
				background: 'conic-gradient(#0000 ' + timers.skillCooldowns[o.index] + 'turn, #000d ' + timers.skillCooldowns[o.index] + 'turn)'
			})
		}
		else {
			TweenMax.set(o.el, {
				background: 'conic-gradient(#0000 ' + timers[o.key] + 'turn, #000d ' + timers[o.key] + 'turn)'
			})
		}
	}
	function handleButtonComplete(o) {
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
				'<img id="primary-attack-btn" class="skill-img" src="'+ bar.getItemSlotImage('eq', 12) +'">' +
				'<div id="skill-timer-primary-rotate" class="no-pointer skill-timer-rotate"></div>' +
			'</div>'
			if (isOffhandingWeapon()) {
				s += '<div class="skill-btn">' +
					'<img id="secondary-attack-btn" class="skill-img" src="'+ bar.getItemSlotImage('eq', 13) +'">' +
					'<div id="skill-timer-secondary-rotate" class="no-pointer skill-timer-rotate"></div>' +
				'</div>'
			}
		s += '</div>' +
		'<div id="skill-btn-wrap">'
		// skill buttons
		for (var i=0; i<12; i++) {
			s +=
			'<div id="skill-btn-'+ i +'" class="skill-btn job-skill-btn" data-index="'+ i +'">' +
				'<img class="skill-img" src="images/skills/'+ my.job +'/'+ i +'.png">' +
				'<div id="skill-timer-'+ i +'-rotate" class="skill-timer-rotate"></div>' +
				'<div id="skill-timer-'+ i +'" class="skill-timer"></div>' +
			'</div>'
		}
		s += '</div>'

		querySelector('#button-wrap').innerHTML = s;
		button.initialized = true
	}
	function hide() {
		TweenMax.set('#button-wrap', {
			display: 'none'
		});
	}
}(TweenMax, $, _, Linear, Power4);