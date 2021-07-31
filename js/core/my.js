var my;
!function($, _, TweenMax, Date, undefined) {
	my = {
		//hud,
		isInvulnerable,
		stunTimeValid,
		fearTimeValid,
		paralyzeTimeValid,
		silenceTimeValid,
		chillTimeValid,
		freezeTimeValid,
		isStunned,
		isFeared,
		isParalyzed,
		isSilenced,
		isChilled,
		isFrozen,
		stunCheck,
		fearCheck,
		paralyzeCheck,
		paralyzeCheckRoll,
		silenceCheck,
		chillCheck,
		freezeCheck,
		stunMsg,
		fearMsg,
		paralyzeMsg,
		silenceMsg,
		isPunching,
		set,
		getResistObject,
		getPartyNames,
		getAvatarUrl,
		resourceTick,
		fixTarget,
		setTarget,
		tabTarget,
		partyTarget,
		clearTarget,
		initSkills,
		getMyData,
		saveCharacterData,
		shieldIsEquipped,
		skills: void 0,
		stunTimer: {},
		fearTimer: {},
		paralyzeTimer: {},
		silenceTimer: {},
		chillTimer: {},
		freezeTimer: {},
		mouse: {
			x: 0,
			y: 0
		},
		channel: '',
		lastReceivedWhisper: '',
		partyId: 0,
		leader: '',
		isLeader: true,
		zoneMobs: [],
		guild: {
			id: 0,
			rank: '',
			motd: '',
			name: ''
		},
		team: 0,
		exp: 0,
		gold: 0,
		slot: 1,
		target: -1,
		targetIsMob: true,
		hoverTarget: -1,
		avatarBg: 5,
		attackOn: false,
		hudTimer: new delayedCall(0, ''),
		quest: {},
		isAutoAttacking: false,
		buffs: {},
		buffFlags: {},
		buffIconTimers: {},
		getDiminishingStatusDurationByType,
		effects: {
			stun: { time: 0, count: 0, },
			fear: { time: 0, count: 0, },
			paralyze: { time: 0, count: 0, },
			silence: { time: 0, count: 0, },
			chill: { time: 0, count: 0, },
			freeze: { time: 0, count: 0, },
		},
		lastStunReducedCount: 0,
		lastStunFullTime: 0,
		// buffs, potions, etc that need to be cancelled on death or whatever. looping through and killing them makes this easier
	}

	const tabOrder = [0, 5, 1, 6, 2, 7, 3, 8, 4]
	const EFFECT_COOLDOWN = 15000
	let index
	let time = 0
	////////////////////////////////////
	// time valid check
	function getDiminishingStatusDurationByType(duration, type) {
		time = Date.now()
		if (time - my.effects[type].time > EFFECT_COOLDOWN) {
			my.effects[type].time = time
			my.effects[type].count = 0
		}
		else {
			// reduction
			my.effects[type].count++
			if (my.effects[type].count === 1) duration = duration * .66
			else duration = duration * .33
		}
		// console.info('getDiminishingStatusDurationByType d', duration)
		return duration
	}
	function stunTimeValid(duration) {
		// console.info('stunTimeValid', typeof my.buffs.stun, duration, my.buffs?.stun?.duration)
		return typeof my.buffs.stun === 'undefined' ||
			typeof my.buffs.stun?.duration === 'undefined' ||
			(typeof my.buffs.stun === 'object' && duration >= my.buffs.stun.duration)
	}
	function fearTimeValid(duration) {
		return typeof my.buffs.fear === 'undefined' ||
			typeof my.buffs.fear?.duration === 'undefined' ||
			(typeof my.buffs.fear === 'object' && duration >= my.buffs.fear.duration)
	}
	function paralyzeTimeValid(duration) {
		return typeof my.buffs.paralyze === 'undefined' ||
			typeof my.buffs.paralyze?.duration === 'undefined' ||
			(typeof my.buffs.paralyze === 'object' && duration >= my.buffs.paralyze.duration)
	}
	function silenceTimeValid(duration) {
		return typeof my.buffs.silence === 'undefined' ||
			typeof my.buffs.silence?.duration === 'undefined' ||
			(typeof my.buffs.silence === 'object' && duration >= my.buffs.silence.duration)
	}
	function chillTimeValid(duration) {
		return typeof my.buffs.chill === 'undefined' ||
			typeof my.buffs.chill?.duration === 'undefined' ||
			(typeof my.buffs.chill === 'object' && duration >= my.buffs.chill.duration)
	}
	function freezeTimeValid(duration) {
		return typeof my.buffs.freeze === 'undefined' ||
			typeof my.buffs?.freeze?.duration === 'undefined' ||
			(typeof my.buffs.freeze === 'object' && duration >= my.buffs.freeze.duration)
	}
	// effect resist checks
	function stunCheck() {
		return !my.isInvulnerable() && _.random(1, 100) > stats.resistStun()
	}
	function fearCheck() {
		return !my.isInvulnerable() && _.random(1, 100) > stats.resistFear()
	}
	function paralyzeCheck() {
		return !my.isInvulnerable() && _.random(1, 100) > stats.resistParalyze()
	}
	function paralyzeCheckRoll(val) {
		return !my.isInvulnerable() && my.isParalyzed() &&
			rand() > (val || ParalyzeRate) &&
			_.random(0, 100) > stats.resistParalyze()
	}
	function silenceCheck() {
		return !my.buffFlags.shimmeringOrb &&
			_.random(1, 100) > stats.resistSilence()
	}
	function chillCheck() {
		return true
	}
	function freezeCheck() {
		return true
	}
	// status effect flag check
	function isStunned() {
		return my.buffFlags.stun
	}
	function isFeared() {
		return my.buffFlags.fear
	}
	function isParalyzed() {
		return my.buffFlags.paralyze
	}
	function isSilenced() {
		return my.buffFlags.silence
	}
	function isChilled() {
		return my.buffFlags.chill
	}
	function isFrozen() {
		return my.buffFlags.freeze
	}
	function isInvulnerable() {
		return my.buffFlags.frozenBarrier ||
			my.buffFlags.jumpStrike ||
			my.buffFlags.sealOfSanctuary
	}
	function stunMsg() {
		ng.msg('You are stunned!', undefined, COLORS.red)
	}
	function fearMsg() {
		ng.msg('You are feared!', undefined, COLORS.red)
	}
	function paralyzeMsg() {
		ng.msg('You are paralyzed!', undefined, COLORS.red)
	}
	function silenceMsg() {
		ng.msg('You are silenced!', undefined, COLORS.red)
	}
	function isPunching(slot) {
		return !(typeof items.eq[slot] === 'object' && items.eq[slot].name)
	}

	/**
	 * client-side increment or set a resource value with built-in max checks
	 * also synchronizes the values in party.presence
	 * @param key
	 * @param val
	 * @param increment - increase or decrease by val (instead of absolute value)
	 */
	function set(key, val, increment = false, isRevive = false) {
		if (party.presence[0]?.isDead && !isRevive) return

		if (increment) {
			party.presence[0][key] = my[key] = my[key] + val
		}
		else {
			if (typeof party.presence[0] === 'object') {
				party.presence[0][key] = val
			}
			my[key] = val
		}

		if (key === PROP.HP) {
			if (my.hp > my.hpMax) {
				my.hp = my.hpMax
			}
			else if (my.hp <= 0) {
				if (mob.isAnyMobAlive()) {
					// allows for processing to selfDied and memberDied
					my.hp = 0
				}
				else {
					// cannot die if all mobs are dead
					my.hp = 1
				}
			}
		}
		else if (key === PROP.MP) {
			if (my.mp > my.mpMax) {
				my.mp = my.mpMax
			}
			else if (my.mp < 0) {
				my.mp = 0
			}
		}
		else if (key === PROP.SP) {
			if (my.sp > my.spMax) {
				my.sp = my.spMax
			}
			else if (my.sp < 0) {
				my.sp = 0
			}
		}
		// sync party presence values
		if (typeof party.presence[0] === 'object') {
			party.presence[0].hp = my.hp
			party.presence[0].mp = my.mp
			party.presence[0].sp = my.sp
		}
	}
	function fixTarget() {
		if (my.targetIsMob) {
			if (typeof mobs[my.target] === 'undefined' || !mob.isAlive(my.target)) {
				tabTarget({ shiftKey: false })
			}
		}
	}
	function setTarget(i) {
		if (my.hp <= 0) return
		my.target = i
		my.targetIsMob = true
		if (!mobs[my.target].name) fixTarget()
		else combat.targetChanged()
	}
	function tabTarget(event, tries = 0) {
		if (ng.view !== 'battle' || my.hp <= 0) return

		if (my.target >= mob.max) {
			// out of range - from player to mob target
			if (event.shiftKey) my.target = tabOrder[0]
			else my.target = tabOrder[tabOrder.length - 1]
		}
		index = tabOrder.findIndex(val => val === my.target)
		if (event.shiftKey) {
			if (my.target === 0) my.target = tabOrder[tabOrder.length - 1]
			else my.target = tabOrder[index - 1]
		}
		else {
			if (my.target === tabOrder[tabOrder.length - 1]) my.target = tabOrder[0]
			else my.target = tabOrder[index + 1]
		}
		my.targetIsMob = true
		if (tries > tabOrder.length) my.target = -1
		else {
			if (!mobs[my.target].name) {
				tries++
				tabTarget(event, tries)
			}
			else combat.targetChanged()
		}
	}
	function partyTarget(index, toggleEnabled = true) {
		if (ng.view === 'dungeon' ||
			ng.view === 'battle') {
			// if (timers.castBar < 1) return
			if (typeof party.presence[index] === 'object' &&
				party.presence[index].row >= 0) {
				my.targetIsMob = false
				if (toggleEnabled && my.target === party.presence[index].row) my.target = -1
				else my.target = party.presence[index].row
				combat.targetChanged()
				mob.drawTargetBar(bar.getRatio(PROP.HP), true)
			}
			else {
				chat.log('Target failed! Player not found.', CHAT.WARNING)
			}
		}
	}
	function clearTarget() {
		my.target = -1
		my.targetIsMob = true
		battle.hideTarget()
		combat.targetChanged()
	}
	function getResistObject() {
		var resp = {}
		ng.resists.forEach(type => {
			resp[type] = create.getResist(type, my)
		})
		return resp
	}

	function getPartyNames() {
		return party.presence.filter(p => p.name).map(p => p.name)
	}
	function getAvatarUrl(obj) {
		obj = obj || my
		return 'images/avatars/' + _.kebabCase(obj.race) + '-' + (obj.gender ? 'female-' : 'male-') + obj.face + '.png';
	}
	/*function hud(msg, d) {
		my.hudTimer.kill();
		DOM.hud.style.visibility = 'visible';
		DOM.hud.textContent = msg;
		if (d){
			timer.hud = TweenMax.to(DOM.hud, 5, {
				onComplete: function(){
					DOM.hud.style.visibility = 'hidden';
				}
			});
		}
	}*/
	let regenTick
	function resourceTick(type) {
		// hpRegen mpRegen spRegen
		if (my.hp >= 1 && !my.buffFlags.frozen) {
			if (type === PROP.HP) {
				regenTick = stats.hpRegen()
				if (combat.isBattleOver()) regenTick += (my.hpMax * .06)
				my.set(PROP.HP, my.hp + regenTick)
			}
			else if (type === PROP.MP) {
				regenTick = stats.mpRegen()
				if (combat.isBattleOver()) regenTick += (my.mpMax * .11)
				my.set(PROP.MP, my.mp + regenTick)
			}
			else if (type === PROP.SP) {
				my.set(PROP.SP, my.sp + stats.spRegen())
			}
		}
	}
	function initSkills() {
		// console.warn('initSkills', my.skills)
		if (my.skills === void 0) {
			if (my.job === JOB.WARRIOR) {
				my.skills = [1,1,0,1,0,0,0,0,1,0,0,0]
			}
			else if (my.job === JOB.CRUSADER) {
				my.skills = [1,1,0,0,1,0,0,0,0,1,0,0]
			}
			else if (my.job === JOB.SHADOW_KNIGHT) {
				my.skills = [1,0,1,0,0,0,1,0,1,0,0,0]
			}
			else if (my.job === JOB.MONK) {
				my.skills = [1,1,0,1,0,0,0,0,0,1,0,0]
			}
			else if (my.job === JOB.RANGER) {
				my.skills = [1,0,1,0,0,0,0,0,1,1,0,0]
			}
			else if (my.job === JOB.ROGUE) {
				my.skills = [1,0,0,1,0,1,0,0,1,0,0,0]
			}
			else if (my.job === JOB.BARD) {
				my.skills = [1,0,0,0,0,1,0,1,1,0,0,0]
			}
			else if (my.job === JOB.DRUID) {
				my.skills = [1,0,1,0,1,0,0,0,1,0,0,0]
			}
			else if (my.job === JOB.CLERIC) {
				my.skills = [1,0,0,0,0,1,0,0,1,0,1,0]
			}
			else if (my.job === JOB.SHAMAN) {
				my.skills = [1,0,1,1,0,0,0,0,1,0,0,0]
			}
			else if (my.job === JOB.WARLOCK) {
				my.skills = [1,0,1,0,1,0,0,0,1,0,0,0]
			}
			else if (my.job === JOB.ENCHANTER) {
				my.skills = [1,0,0,0,1,0,0,1,0,1,0,0]
			}
			else if (my.job === JOB.TEMPLAR) {
				my.skills = [1,0,1,0,0,0,1,0,1,0,0,0]
			}
			else if (my.job === JOB.WIZARD) {
				my.skills = [1,0,0,1,0,0,1,0,0,0,1,0]
			}

			saveCharacterData()
		}
	}

	function saveCharacterData() {
		$.post(app.url + 'character/save-data.php', {
			data: JSON.stringify(getMyData())
		})
	}
	function getMyData() {
		return _.pick(my, KEYS.MY_PROPS)
	}
	function shieldIsEquipped() {
		return typeof items.eq[13] === 'object' && items.eq[13].itemType === ITEM_TYPE.SHIELDS
	}
}($, _, TweenMax, Date);