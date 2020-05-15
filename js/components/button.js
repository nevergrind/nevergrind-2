var button;
!function(TweenMax, $, _, Linear) {
	button = {
		initialized: 0,
		setAll,
		hide,
	}
	var arr, damage, o
	/////////////////////////////

	function isOffhandingWeapon() {
		return item.offhandWeaponTypes.includes(items.eq[13].itemType)
	}

	$("#button-wrap")
		.on('click', '.job-skill-btn', handleButtonClick)
		.on('click', '#primary-attack-btn', primaryAttack)
		.on('click', '#secondary-attack-btn', secondaryAttack)

	//////////////////////////////////
	function handleButtonClick() {
		var index = this.dataset.index * 1;
		console.info('CLICKED SKILL: ', index);
		info('clicked: ', skills[my.job][index].name)

	}
	function primaryAttack() {
		if (timers.primaryAttack < 1) return
		my.fixTarget()
		if (my.target === -1) return
		arr = stats.damage()
		damage = _.random(arr[0], arr[1])
		info('primaryAttack damage:', damage)
		damage && combat.damageMobMelee(my.target, damage)

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
			onUpdate: btnUpdate,
			onUpdateParams: [ o ],
			onComplete: btnComplete,
			onCompleteParams: [ o ],
			ease: Linear.easeNone
		})


	}
	function secondaryAttack() {
		if (timers.secondaryAttack < 1) return
		info('secondaryAttack')
		my.fixTarget()
		if (my.target === -1) return
		arr = stats.offhandDamage()
		damage = _.random(arr[0], arr[1])
		info('secondaryAttack damage', damage)
		damage && combat.damageMobMelee(my.target, damage)

		timers.secondaryAttack = 0
		let el = querySelector('#skill-timer-secondary-rotate')
		TweenMax.set(el, {
			display: 'block'
		})
		let o = {
			el: el,
			key: 'secondaryAttack',
		}
		TweenMax.to(timers, items.eq[12].speed, {
			secondaryAttack: 1,
			onUpdate: btnUpdate,
			onUpdateParams: [ o ],
			onComplete: btnComplete,
			onCompleteParams: [ o ],
			ease: Linear.easeNone
		})

	}
	function triggerGlobalCooldown() {
		timers.globalCooldown = 0
		let selector = []
		timers.skillCooldowns.forEach((skill, index) => {
			skill === 1 && selector.push('#skill-timer-'+ index +'-rotate')
		})
		selector = selector.join(', ')
		TweenMax.set(selector, {
			display: 'block'
		})
		let o = {
			el: selector,
			key: 'globalCooldown',
		}
		TweenMax.to(timers, 1.5, {
			globalCooldown: 1,
			onUpdate: btnUpdate,
			onUpdateParams: [ o ],
			onComplete: btnComplete,
			onCompleteParams: [ o ],
			ease: Linear.easeNone
		})
	}
	function btnUpdate(o) {
		TweenMax.set(o.el, {
			background: 'conic-gradient(#0000 ' + timers[o.key] + 'turn, #000d ' + timers[o.key] + 'turn)'
		})
	}
	function btnComplete(o) {
		TweenMax.set(o.el, {
			display: 'none'
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
				'<div id="skill-timer-'+ i +'" class="skill-timer"></div>' +
				'<div id="skill-timer-'+ i +'-rotate" class="skill-timer-rotate"></div>' +
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
}(TweenMax, $, _, Linear);