var button;
!function(TweenMax, $, _, Linear, Power4, undefined) {
	button = {
		pauseAutoAttack,
		resumeAutoAttack,
		startSwing,
		setAll,
		triggerGlobalCooldown,
		updateWeaponPanel,
		handlePotionSlotContextClick,
		getPotionPanelHtml,
		updatePotionPanel,
		hasPotionByType,
		getHighestPotion,
		handleButtonStart,
		handleButtonUpdate,
		handleButtonComplete,
		updateSkillTime,
		primaryAttack,
		secondaryAttack,
		triggerSkill,
		processPotionTimers,
		processSkillTimers,
		init,
		getPunchDps,
		hpPotion: -1,
		mpPotion: -1,
		spPotion: -1,
		initialized: false,
		autoAttackSpeed: 3,
	}
	let name, hit
	let mySwingSpeed = 0
	const POTION_COOLDOWN = 60
	const GLOBAL_COOLDOWN_DURATION = 2.5
	const HYBRID_AUTO_ATTACKERS = [JOB.CRUSADER, JOB.SHADOW_KNIGHT, JOB.RANGER, JOB.BARD]
	let damages
	const BUTTON_FLASH = {
		startAt: {
			scale: 1,
			opacity: 1,
			background: 'radial-gradient(50% 50% at 50% 50%, #ffff, #27f8 66%, #0490 100%)',
		},
		scale: .75,
		opacity: 0,
	}
	const hotkeys = [
		{ special: '', hotkey: '1' },
		{ special: '', hotkey: '2' },
		{ special: '', hotkey: '3' },
		{ special: '', hotkey: '4' },
		{ special: '', hotkey: '5' },
		{ special: '', hotkey: '6' },
		{ special: 'S+', hotkey: '1' },
		{ special: 'S+', hotkey: '2' },
		{ special: 'S+', hotkey: '3' },
		{ special: 'S+', hotkey: '4' },
		{ special: 'S+', hotkey: '5' },
		{ special: 'S+', hotkey: '6' },
	]
	/////////////////////////////

	function init() {
		$("#button-wrap")
			.on('click', '.job-skill-btn', handleSkillButtonClick)
			.on('click', '#skill-primary-attack-btn', combat.toggleAutoAttack)
			.on('click', '#skill-secondary-attack-btn', combat.toggleAutoAttack)
	}

	function canOffhandWeapon() {
		return item.offhandWeaponTypes.includes(items.eq[13].itemType)
			|| (skills.dualWield[my.job].level
				&& my.level >= skills.dualWield[my.job].level
				&& !items.eq[13].name
				&& items.eq[12].weaponSkill !== 'Two-hand Slash'
				&& items.eq[12].weaponSkill !== 'Two-hand Blunt') // punching
	}

	function processPotionTimers(potionType) {
		let el = querySelector('#skill-timer-' + potionType + '-rotate')
		TweenMax.set(el, CSS.DISPLAY_BLOCK)
		let key = potionType + 'Potion'
		let args = {
			el: el, // element rotating
			key: key
		}
		let timerObj = {
			onStart: handleButtonStart,
			onStartParams: [ args ],
			onUpdate: handleButtonKeyUpdate,
			onUpdateParams: [ args ],
			onComplete: handleButtonComplete,
			onCompleteParams: [ args, true ],
			ease: Linear.easeNone
		}
		timerObj.startAt = {}
		timerObj.startAt[key] = 0
		timerObj[key] = 1
		// timers
		timers[potionType + 'Potion'] = 0
		timers[potionType + 'PotionTimer'].kill()
		timers[potionType + 'PotionTimer'] = TweenMax.to(timers, POTION_COOLDOWN, timerObj)

		// number countdown
		let textEl = querySelector('#skill-timer-' + potionType)
		textEl.innerHTML = getSkillTimeString(POTION_COOLDOWN)
		let textObj = {
			el: textEl,
			remaining: POTION_COOLDOWN
		}

		TweenMax.to(textObj, 1, {
			repeat: POTION_COOLDOWN,
			onRepeat: button.updateSkillTime,
			onRepeatParams: [ textObj ]
		})
	}
	//////////////////////////////////
	function processSkillTimers(index, skillData) {
		let el = querySelector('#skill-timer-' + index + '-rotate')
		// processSkillTimers
		// console.info('processSkillTimers', index, skillData)
		TweenMax.set(el, CSS.DISPLAY_BLOCK)
		let args = {
			el: el, // element rotating
			index: index,
		}
		let timerObj = {
			startAt: { [index]: 0 },
			onStart: handleButtonStart,
			onStartParams: [ args ],
			onUpdate: handleButtonUpdate,
			onUpdateParams: [ args ],
			onComplete: handleButtonComplete,
			onCompleteParams: [ args, true ],
			ease: Linear.easeNone
		}
		timerObj[index] = .999 // because it may be interrupted by a global upon recovery
		// rotation animation
		timers.skillCooldowns[index] = 0
		timers.skillCooldownTimers[index].kill()
		// for easier testing of skills with long cooldowns
		/*if (!app.isApp && skillData.cooldownTime > 0) {
			skillData.cooldownTime = 3
		}*/
		timers.skillCooldownTimers[index] = TweenMax.to(timers.skillCooldowns, skillData.cooldownTime, timerObj)
		// number countdown
		let textEl = querySelector('#skill-timer-' + index)
		textEl.innerHTML = getSkillTimeString(skillData.cooldownTime)
		let textObj = {
			el: textEl,
			remaining: skillData.cooldownTime
		}

		TweenMax.to(textObj, 1, {
			repeat: skillData.cooldownTime,
			onRepeat: button.updateSkillTime, // updates number
			onRepeatParams: [ textObj ]
		})
	}

	function triggerGlobalCooldown() {
		if (timers.globalCooldown !== 1) return
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

		TweenMax.to(timers, getCooldownSpeed(), {
			globalCooldown: 1,
			onStart: handleButtonStart,
			onStartParams: [ args ],
			onUpdate: handleButtonKeyUpdate,
			onUpdateParams: [ args ],
			onComplete: handleButtonComplete,
			onCompleteParams: [ args ],
			ease: Linear.easeNone
		})
	}
	function getCooldownSpeed() {
		return GLOBAL_COOLDOWN_DURATION * stats.getSkillSpeed()
	}
	function triggerSkill(index) {
		if (my.hp <= 0) return
		if (ng.view === 'battle' || ng.view === 'dungeon') {
			name = _.camelCase(skills[my.job][index].name)
			// console.info('triggerSkill', name)
			if (typeof skill[my.job][name] === 'function') {
				skill[my.job][name](index, skills[my.job][index])
				if (!my.isAutoAttacking) {
					if (Config.autoAttackEnabled) {
						setTimeout(combat.autoAttackEnable)
					}
				}
			}
			else {
				chat.log('This skill is not defined:' + name, CHAT.WARNING)
			}
		}
		else if (ng.view === 'town') {
			chat.log('You cannot cast in town.', CHAT.WARNING)
		}
	}
	function handleSkillButtonClick() {
		triggerSkill(this.dataset.index * 1)
	}

	function successfulDoubleAttack() {
		return my.doubleAttack / 600
	}

	let autoSlot = 0
	function getAutoAttackKey(isPrimary) {
		autoSlot = isPrimary ? 12 : 13
		return 'autoAttack'
			+ (typeof items.eq[autoSlot].weaponSkill === 'undefined'
				? 'Hand-to-hand'
				: items.eq[autoSlot].weaponSkill)
			+ (isPrimary ? '' : 'Secondary')
	}
	function primaryAttack(isPiercing, index) {
		// piercing is a riposte
		if (isPiercing) {
			if (ng.view !== 'battle' || my.hp <= 0) return
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

		if (my.paralyzeCheckRoll()) {
			my.paralyzeMsg()
		}
		else {
			damages = []
			hit = stats.primaryAutoAttackDamage(index)
			damages.push({
				key: getAutoAttackKey(true),
				index: index,
				isPiercing: isPiercing,
				...hit
			})
			// double attack?
			if (!isPiercing &&
				my.level >= skills.doubleAttack[my.job].level) {
				combat.levelSkillCheck(PROP.DOUBLE_ATTACK)
				if (Math.random() < successfulDoubleAttack()) {
					hit = stats.primaryAutoAttackDamage(index)
					damages.push({
						key: getAutoAttackKey(true),
						index: index,
						...hit
					})
				}
			}
			combat.txDamageMob(damages)
		}
		startSwing('primaryAttack')
	}

	function secondaryAttack() {
		if (ng.view !== 'battle' ||
			!my.isAutoAttacking ||
			timers.secondaryAttack < 1 ||
			my.hp <= 0 ||
			!canOffhandWeapon()) return

		if (cannotAutoAttack()) {
			if (my.isAutoAttacking) timers['secondaryAttackCall'] = delayedCall(.1, secondaryAttack)
			return
		}
		if (my.target === -1) return

		if (my.paralyzeCheckRoll()) {
			my.paralyzeMsg()
		}
		else {
			if (my.level >= skills.dualWield[my.job].level) {
				combat.levelSkillCheck(PROP.DUAL_WIELD)
				if (Math.random() < successfulDualWield()) {
					hit = stats.secondaryAutoAttackDamage(my.target)
					damages = []
					damages.push({
						key: getAutoAttackKey(false),
						index: my.target,
						...hit
					})
					if (my.level >= skills.doubleAttack[my.job].level) {
						if (Math.random() < successfulDoubleAttack()) {
							hit = stats.secondaryAutoAttackDamage(my.target)
							damages.push({
								key: getAutoAttackKey(false),
								index: my.target,
								...hit
							})
						}
					}
					combat.txDamageMob(damages)
				}
			}
		}
		startSwing('secondaryAttack')
		///////////////////////////
		function successfulDualWield() {
			return my.dualWield / 350
		}
	}
	function cannotAutoAttack() {
		return (!HYBRID_AUTO_ATTACKERS.includes(my.job) && timers.castBar < 1) ||
			!my.targetIsMob ||
			my.buffFlags.frozenBarrier ||
			my.isStunned()
	}

	const CALL = 'Call'
	const CYCLE = 'Cycle'
	function startSwing(key) {
		timers[key] = 0
		let slot, el
		if (key === 'primaryAttack') {
			slot = 12
			el = '#skill-timer-primary-rotate'
		}
		else {
			slot = 13
			el = '#skill-timer-secondary-rotate'
		}

		if (!HYBRID_AUTO_ATTACKERS.includes(my.job) && timers.castBar < 1) {
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
			startAt: { [key]: 0 },
			onStart: handleButtonStart,
			onStartParams: [ o ],
			onUpdate: handleButtonKeyUpdate,
			onUpdateParams: [ o ],
			onComplete: handleButtonComplete,
			onCompleteParams: [ o ],
			ease: Linear.easeNone
		}
		to.startAt = {}
		to.startAt[key] = 0
		to[key] = 1
		mySwingSpeed = stats.getAttackSpeed(slot)

		timers[key + CYCLE] = TweenMax.to(timers, mySwingSpeed, to)
		// console.info('startSwing', key, timers[key])
		timers[key + CALL].kill()
		timers[key + CALL] = delayedCall(mySwingSpeed, button[key])
	}
	function pauseAutoAttack() {
		if (!HYBRID_AUTO_ATTACKERS.includes(my.job)) {
			timers['primaryAttack' + CYCLE].pause()
			timers['secondaryAttack' + CYCLE].pause()
			timers['primaryAttack' + CALL].pause()
			timers['secondaryAttack' + CALL].pause()
		}
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
	function handleButtonStart(o) {
		TweenMax.set(o.el, {
			background: '',
			scale: 1,
			opacity: 1,
			overwrite: 1,
		})
	}

	function handleButtonKeyUpdate(o) {
		// other timer skills by key
		TweenMax.set(o.el, {
			overwrite: 1,
			opacity: 1,
			background: 'conic-gradient(#0000 ' + timers[o.key] + 'turn, #000d ' + timers[o.key] + 'turn)'
		})
	}

	function handleButtonUpdate(o) {
		// skill number
		TweenMax.set(o.el, {
			overwrite: 1,
			opacity: 1,
			background: 'conic-gradient(#0000 ' + timers.skillCooldowns[o.index] + 'turn, #000d ' + timers.skillCooldowns[o.index] + 'turn)'
		})
	}

	function handleButtonComplete(o, checkGlobalInProgress) {
		if (checkGlobalInProgress && timers.globalCooldown < 1) {
			let duration = getCooldownSpeed() - (timers.globalCooldown * getCooldownSpeed())
			TweenMax.set(o.el, CSS.DISPLAY_BLOCK)
			let args = {
				el: o.el,
				index: o.index,
				key: 'globalCooldown',
			}
			const GlobalStart = { globalCooldown: 0 }
			TweenMax.to(GlobalStart, duration, {
				overwrite: 1,
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
			TweenMax.to(o.el, .5, BUTTON_FLASH)
			if (typeof o.index === 'number') {
				// complete reset in actuality to avoid collision with globalCooldown
				timers.skillCooldowns[o.index] = 1
			}
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
		if (time >= 100) return (~~(time / 60)) + 'm'
		else return !time ? '' : time

	}
	function getWeaponButtonHtml() {
		return `
		<div id="auto-attack-flash" class="no-pointer"></div>
		<div class="skill-btn">
			<img id="skill-primary-attack-btn" class="skill-img skill-btn-tooltip" src="${bar.getItemSlotImage('eq', 12, true)}">
			<div id="skill-timer-primary-rotate" class="no-pointer skill-timer-rotate"></div>
		</div>
		${getOffhandWeaponHtml()}`
	}
	function getOffhandWeaponHtml() {
		let str = `<div class="skill-btn ${canOffhandWeapon() ? '' : 'no-pointer dead-button'}">`
			if (canOffhandWeapon()) {
				str += `<img id="skill-secondary-attack-btn" class="skill-img skill-btn-tooltip" src="${bar.getItemSlotImage('eq', 13, true)}">
			<div id="skill-timer-secondary-rotate" class="no-pointer skill-timer-rotate"></div>`
			}
		str += `</div>`
		return str
	}
	function updateWeaponPanel() {
		let el = querySelector('#main-attack-wrap')
		if (!!el) el.innerHTML = getWeaponButtonHtml()
	}
	function getPotionPanelHtml() {
		return `
		<div id="potion-hp" class="potion-slot popover-icons">
			<img id="potion-hp-img" class="potion-slot-children" src="${button.getHighestPotion('hp').img}">
			<div id="skill-timer-hp-rotate" class="skill-timer-rotate potion-slot-children"></div>
			<div id="skill-timer-hp" class="skill-timer potion-slot-children"></div>
		</div>
		<div id="potion-mp" class="potion-slot popover-icons">
			<img id="potion-mp-img" class="potion-slot-children" src="${button.getHighestPotion('mp').img}">
			<div id="skill-timer-mp-rotate" class="skill-timer-rotate potion-slot-children"></div>
			<div id="skill-timer-mp" class="skill-timer potion-slot-children"></div>
		</div>
		<div id="potion-sp" class="potion-slot popover-icons">
			<img id="potion-sp-img" class="potion-slot-children" src="${button.getHighestPotion('sp').img}">
			<div id="skill-timer-sp-rotate" class="skill-timer-rotate potion-slot-children"></div>
			<div id="skill-timer-sp" class="skill-timer potion-slot-children"></div>
		</div>
		`
	}
	const potionTypes = [
		'hp',
		'mp',
		'sp',
	]
	function updatePotionPanel() {
		potionTypes.forEach(type => {
			let el = querySelector('#potion-'+ type +'-img')
			if (!!el) {
				el.src = button.getHighestPotion(type).img
			}
		})
	}

	function handlePotionSlotContextClick(event) {
		let type = this.id.split('-')[1]
		if (button[type + 'Potion'] < 0) return
		let index = items.inv.findIndex(i =>
			i.itemSubType === type && i.imgIndex === button[type + 'Potion'])

		if (index > -1 && items.inv[index].use) {
			item.useItem('inv', index)
		}
		return false // context disabled
	}
	function hasPotionByType(potionType) {
		return button.getHighestPotion(potionType).img.includes('blank')
	}
	function getHighestPotion(potionType) {
		let img = 'blank'
		let highestLevel = -1
		items.inv.forEach(i => {
			if (i.itemSubType === potionType &&
				i.imgIndex > highestLevel) {
				img = i.itemSubType + i.imgIndex
				button[i.itemSubType + 'Potion'] = highestLevel = i.imgIndex
			}
		})
		return {
			img: 'images/items/potion/' + img + '.png'
		}
	}
	function getHotkeySpecial(i) {
		return hotkeys[i].special
	}
	function getHotkey(i) {
		return hotkeys[i].hotkey
	}
	function setAll() {
		TweenMax.set('#button-wrap', CSS.DISPLAY_FLEX)
		if (!button.initialized) {
			var s = '';
			// base attack buttons
			s += `
			<div id="main-attack-wrap">
				${getWeaponButtonHtml()}
			</div>
			<div id="potion-wrap" class="text-shadow">
				${getPotionPanelHtml()}
			</div>
			<div id="skill-col">
				<div id="exp-bar-wrap">
					<div id="exp-bar"></div>
					<div id="exp-bar-grid"></div>
				</div>
				<div id="skill-btn-wrap">`
			// skill buttons
			for (var i=0; i<12; i++) {
				s += `<div id="skill-btn-${i}" class="skill-btn job-skill-btn skill-btn-tooltip" data-index="${i}">
					<div id="skill-btn-hotkey-${i}" class="skill-btn-hotkey text-shadow">
						<div class="skill-btn-hotkey-value">${getHotkeySpecial(i)}${getHotkey(i)}</div>
					</div>
					<img id="skill-${i}" class="skill-img" src="images/skills/${my.job}/${i}.png">
					<div id="skill-timer-${i}-rotate" class="skill-timer-rotate"></div>
					<div id="skill-timer-${i}" class="skill-timer"></div>
				</div>`
			}
			s += `</div>
			</div>
			<div id="status-panel-wrap" class="no-pointer">
				<div id="cast-bar-wrap" class="flex-column no-pointer">
					<div id="cast-bar-base" class="flex-column flex-max stag-blue">
						<div id="cast-bar-flex">
							<img id="cast-bar-icon" />
							<div id="cast-bar-parent">
								<div id="cast-bar">
									<img id="cast-bar-glow" src="images/ui/cast-bar-glow.png">
								</div>
								<div id="cast-bar-name" class="text-shadow3"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
			`

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
}(TweenMax, $, _, Linear, Power4);