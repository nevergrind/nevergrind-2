var button;
!function(TweenMax, $, _, Linear, Power4, undefined) {
	button = {
		pauseAutoAttack,
		resumeAutoAttack,
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
		getPunchDps,
		initialized: false,
		autoAttackSpeed: 3,
	}
	var name, hit
	let speed = 0
	let speedHaste = 1
	let mySwingSpeed = 0
	const globalCooldownDur = 2.5
	let globalHaste = 1
	let damages
	const globalHasteCap = .4
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
		TweenMax.set(el, CSS.DISPLAY_BLOCK)
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

		textEl.innerHTML = getSkillTimeString(skillData.cooldownTime)
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
		TweenMax.set(selector, CSS.DISPLAY_BLOCK)
		let args = {
			el: selector,
			key: 'globalCooldown',
		}
		// haste
		globalHaste = 1
		if (my.buffFlags.frenzy) globalHaste -= buffs.frenzy.haste[my.buffs.frenzy.level]
		if (my.buffFlags.augmentation) globalHaste -= buffs.augmentation.haste[my.buffs.augmentation.level]
		if (globalHaste < globalHasteCap) globalHaste = globalHasteCap

		TweenMax.to(timers, globalCooldownDur * globalHaste, {
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
		// console.info('triggerSkill', name)
		if (typeof skill[my.job][name] === FUNCTION) {
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
		// piercing is a riposte
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
			if (cannotAutoAttack()) {
				// non-ripostes are held back by these conditions
				if (my.isAutoAttacking) timers['primaryAttackCall'] = delayedCall(.1, primaryAttack)
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
		hit = stats.autoAttackDamage()
		damages.push({
			key: 'autoAttack',
			index: index,
			isPiercing: isPiercing,
			...hit
		})
		// double attack?
		if (!isPiercing &&
			my.level >= skills.doubleAttack[my.job].level) {
			combat.levelSkillCheck('doubleAttack')
			if (Math.random() < successfulDoubleAttack()) {
				hit = stats.autoAttackDamage()
				damages.push({
					key: 'autoAttack',
					index: index,
					...hit
				})
			}
		}
		combat.txDamageMob(damages)
		startSwing('primaryAttack')
	}
	function secondaryAttack() {
		// console.warn('secondaryAttack')
		if (ng.view !== 'battle' ||
			!my.isAutoAttacking ||
			timers.secondaryAttack < 1 ||
			my.hp <= 0 ||
			!isOffhandingWeapon()) return

		if (cannotAutoAttack()) {
			if (my.isAutoAttacking) timers['secondaryAttackCall'] = delayedCall(.1, secondaryAttack)
			return
		}
		if (my.target === -1) return

		if (my.level >= skills.dualWield[my.job].level) {
			combat.levelSkillCheck('dualWield')
			if (successfulDualWield()) {
				hit = stats.offhandDamage()
				damages = []
				damages.push({
					key: 'autoAttack',
					index: my.target,
					...hit
				})
				if (my.level >= skills.doubleAttack[my.job].level) {
					if (Math.random() < successfulDoubleAttack()) {
						hit = stats.offhandDamage()
						damages.push({
							key: 'autoAttack',
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
	function cannotAutoAttack() {
		return timers.castBar < 1 ||
			!my.targetIsMob ||
			my.buffFlags.frozenBarrier
	}

	const CALL = 'Call'
	const CYCLE = 'Cycle'
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
			timers[key + CALL].kill()
			timers[key + CALL] = delayedCall(mySwingSpeed, button[key])
			return
		}

		TweenMax.set(el, CSS.DISPLAY_BLOCK)
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
		mySwingSpeed = getAttackSpeed(slot)

		timers[key + CYCLE] = TweenMax.to(timers, mySwingSpeed, to)
		// console.info('startSwing', key, timers[key])
		timers[key + CALL].kill()
		timers[key + CALL] = delayedCall(mySwingSpeed, button[key])
	}
	function pauseAutoAttack() {
		timers['primaryAttack' + CYCLE].pause()
		timers['secondaryAttack' + CYCLE].pause()
		timers['primaryAttack' + CALL].pause()
		timers['secondaryAttack' + CALL].pause()
	}
	function resumeAutoAttack() {
		timers['primaryAttack' + CYCLE].resume()
		timers['secondaryAttack' + CYCLE].resume()
		timers['primaryAttack' + CALL].resume()
		timers['secondaryAttack' + CALL].resume()
	}
	function getPunchDps(min, max) {
		return (((min + max) / 2) / button.autoAttackSpeed)
	}
	function getAttackSpeed(slot) {
		// weapon or punch speed?
		if (typeof items.eq[slot] === OBJECT) speed = items.eq[slot].speed
		else speed = button.autoAttackSpeed
		speedHaste = 1
		// buffs
		if (my.buffFlags.spiritOfTheHunter) speedHaste -= .2
		// debuffs
		if (speedHaste < .25) speedHaste = .25
		else if (speedHaste > 2) speedHaste = 2
		return speed * speedHaste
	}
	function handleButtonStart(o) {
		TweenMax.set(o.el, {
			scale: 1,
			opacity: 1,
			overwrite: true,
		})
	}

	function handleButtonUpdate(o) {
		/*if (o.type === 'singleGlobal') {

		}*/
		if (typeof o.index === NUMBER) {
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
	const flashGradient = 'radial-gradient(50% 50% at 50% 50%, #ffff, #27f8 66%, #0490 100%)'
	function handleButtonComplete(o, checkGlobalInProgress) {
		if (checkGlobalInProgress &&
			timers.globalCooldown < 1) {
			let duration = globalCooldownDur - (timers.globalCooldown * globalCooldownDur)
			// console.info('handleButtonComplete', o.el, duration)
			TweenMax.set(o.el, CSS.DISPLAY_BLOCK)
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
			// console.info('handleButtonComplete FLASH', o.el)
			// button flash
			TweenMax.to(o.el, .5, {
				startAt: {
					scale: 1,
					opacity: 1,
					background: flashGradient,
				},
				scale: .75,
				opacity: 0,
			})
		}
	}
	function updateSkillTime(obj) {
		obj.remaining--
		obj.el.innerHTML = getSkillTimeString(obj.remaining)
		/*TweenMax.to(obj.el, 1, {
			startAt: { scale: 1.05 },
			scale: 1,
			ease: Power4.easeNone
		})*/
	}
	function getSkillTimeString(time) {
		if (time >= 100) {
			return (~~(time / 60)) + 'm'
		}
		else {
			return !time ? '' : time
		}

	}
	function setAll() {
		TweenMax.set('#button-wrap', {
			startAt: CSS.DISPLAY_FLEX,
		})
		if (!button.initialized) {
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
				s += '<div id="skill-btn-'+ i +'" class="skill-btn job-skill-btn" data-index="'+ i +'">' +
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
		updateBtnEnabled()
	}
	function updateBtnEnabled() {
		querySelectorAll('#skill-btn-wrap .skill-btn').forEach((el, i) => {
			el.classList.remove('skill-disabled')
			if (my.skills[i] === 0) el.classList.add('skill-disabled')
		})
	}
	function hide() {
		TweenMax.set('#button-wrap', CSS.DISPLAY_NONE);
	}
}(TweenMax, $, _, Linear, Power4);