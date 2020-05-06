var button;
(function(TweenMax, $, _) {
	button = {
		initialized: 0,
		setAll,
		hide,
	}
	var arr, damage
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
		info('primaryAttack')
		my.fixTarget()
		if (my.target === -1) return
		arr = stats.damage()
		damage = _.random(arr[0], arr[1])
		damage && combat.damageMobMelee(my.target, damage)
	}
	function secondaryAttack() {
		info('secondaryAttack')
		my.fixTarget()
		if (my.target === -1) return
		arr = stats.offhandDamage()
		damage = _.random(arr[0], arr[1])
		damage && combat.damageMobMelee(my.target, damage)
	}
	function setAll() {
		var s = '';
		// base attack buttons
		s += '<div id="main-attack-wrap">' +
			'<div id="primary-attack-btn" class="skill-btn repeat-line-bg">' +
				'<img class="skill-img" src="'+ bar.getItemSlotImage('eq', 12) +'">' +
				'<div id="skill-timer-primary" class="no-pointer skill-timer"></div>' +
			'</div>'
			if (isOffhandingWeapon()) {
				s += '<div id="secondary-attack-btn" class="skill-btn repeat-line-bg">' +
					'<img class="skill-img" src="'+ bar.getItemSlotImage('eq', 13) +'">' +
					'<div id="skill-timer-secondary" class="no-pointer skill-timer"></div>' +
				'</div>'
			}
		s += '</div>' +
		'<div id="skill-btn-wrap">'
		// skill buttons
		for (var i=0; i<12; i++) {
			s +=
			'<div id="skill-btn-'+ i +'" class="skill-btn job-skill-btn" data-index="'+ i +'">' +
				'<img class="skill-img" src="images/skills/'+ my.job +'/'+ i +'.png">' +
				'<div id="skill-timer-'+ i +'" class="no-pointer skill-timer"></div>' +
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
})(TweenMax, $, _);