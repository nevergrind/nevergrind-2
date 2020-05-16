var button;
!function(TweenMax, $, _, Linear, Power4, undefined) {
	button = {
		initialized: 0,
		setAll,
		hide,
		triggerGlobalCooldown,
		handleButtonStart,
		handleButtonUpdate,
		handleButtonComplete,
		updateSkillTime,
		primaryAttack,
		secondaryAttack,
	}
	var arr, damage, o

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
	function handleSkillButtonClick() {
		var index = this.dataset.index * 1
		var name = _.camelCase(skills[my.job][index].name)

		//info('CLICKED SKILL: ', index, name)
		if (typeof skill[my.job][name] === 'function') {
			skill[my.job][name](index, skills[my.job][index])
		}
		else {
			warn('This skill function is not defined!', name)
		}
	}
	function primaryAttack() {
		if (timers.primaryAttack < 1) return
		my.fixTarget()
		if (my.target === -1) return
		arr = stats.damage()

		damage = _.random(arr[0], arr[1])
		damage && combat.damageMobMelee(my.target, damage, arr[2])

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
		if (timers.secondaryAttack < 1) return
		my.fixTarget()
		if (my.target === -1) return
		arr = stats.offhandDamage()
		damage = _.random(arr[0], arr[1])
		damage && combat.damageMobMelee(my.target, damage, arr[2])

		timers.secondaryAttack = 0
		let el = querySelector('#skill-timer-secondary-rotate')
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
	function autoAttackPrimary() {
		if (my.isAutoAttacking) primaryAttack()
	}
	function autoAttackSecondary() {
		if (my.isAutoAttacking) secondaryAttack()
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
		TweenMax.to(timers, 1.5, {
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
	function handleButtonStart(o) {
		TweenMax.set(o.el, {
			scale: 1,
			alpha: 1,
		})
	}

	function handleButtonUpdate(o) {
		if (typeof o.index === 'number') {
			TweenMax.set(o.el, {
				background: 'conic-gradient(#0000 ' + timers.skillCooldowns[o.index] + 'turn, #000e ' + timers.skillCooldowns[o.index] + 'turn)'
			})
		}
		else {
			TweenMax.set(o.el, {
				background: 'conic-gradient(#0000 ' + timers[o.key] + 'turn, #000e ' + timers[o.key] + 'turn)'
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
		var s = '';
		// base attack buttons
		s += '<div id="main-attack-wrap">' +
			'<div class="skill-btn repeat-line-bg">' +
				'<img id="primary-attack-btn" class="skill-img" src="'+ bar.getItemSlotImage('eq', 12) +'">' +
				'<div id="skill-timer-primary-rotate" class="no-pointer skill-timer-rotate"></div>' +
			'</div>'
			if (isOffhandingWeapon()) {
				s += '<div class="skill-btn repeat-line-bg">' +
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
		TweenMax.set('#button-wrap', {
			startAt: { display: 'flex' },
		})
	}
	function hide() {
		TweenMax.set('#button-wrap', {
			display: 'none'
		});
	}
}(TweenMax, $, _, Linear, Power4);