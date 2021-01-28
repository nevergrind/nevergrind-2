var my;
!function($, _, TweenMax, Date, undefined) {
	my = {
		//hud,
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
		stunMod,
		effects: {
			stun: { timestamp: 0, count: 0, },
			fear: { timestamp: 0, count: 0, },
			paralyze: { timestamp: 0, count: 0, },
			silence: { timestamp: 0, count: 0, },
			chill: { timestamp: 0, count: 0, },
			freeze: { timestamp: 0, count: 0, },
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
	function stunMod(duration, type) {
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
		return duration
	}
	function stunTimeValid(duration) {
		return duration >= my.buffs.stun.duration
	}
	function fearTimeValid(duration) {
		return duration >= my.buffs.fear.duration
	}
	function paralyzeTimeValid(duration) {
		return duration >= my.buffs.paralyze.duration
	}
	function silenceTimeValid(duration) {
		return duration >= my.buffs.silence.duration
	}
	function chillTimeValid(duration) {
		return duration >= my.buffs.chill.duration
	}
	function freezeTimeValid(duration) {
		return duration >= my.buffs.freeze.duration
	}
	// effect resist checks
	function stunCheck() {
		return _.random(1, 100) > stats.resistStun()
	}
	function fearCheck() {
		return _.random(1, 100) > stats.resistFear()
	}
	function paralyzeCheck() {
		return _.random(1, 100) > stats.resistParalyze()
	}
	function paralyzeCheckRoll(val) {
		return my.isParalyzed() &&
			rand() > (val || ParalyzeRate) &&
			_.random(0, 100) > stats.resistParalyze()
	}
	function silenceCheck() {
		return _.random(1, 100) > stats.resistSilence()
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
	function stunMsg() {
		chat.log('You are stunned!', CHAT.WARNING)
	}
	function fearMsg() {
		chat.log('You are feared!', CHAT.WARNING)
	}
	function paralyzeMsg() {
		chat.log('You are paralyzed!', CHAT.WARNING)
	}
	function silenceMsg() {
		chat.log('You are silenced!', CHAT.WARNING)
	}
	function isPunching(slot) {
		return !(typeof items.eq[slot] === 'object' && items.eq[slot].name)
	}
	function set(key, val, increment) {
		if (increment) {
			party.presence[0][key] = my[key] += val
		}
		else {
			if (typeof party.presence[0] === 'object') party.presence[0][key] = val
			my[key] = val
		}
	}
	function fixTarget() {
		if (typeof mobs[my.target] === 'undefined' || !mob.isAlive(my.target)) {
			tabTarget({ shiftKey: false })
		}
	}
	function setTarget(i) {
		if (timers.castBar < 1 || my.hp <= 0) return
		my.target = i
		my.targetIsMob = true
		if (!mobs[my.target].name) fixTarget()
		else combat.targetChanged()
	}
	function tabTarget(event, tries = 0) {
		if (ng.view !== 'battle' || timers.castBar < 1 || my.hp <= 0) return

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
	function partyTarget(index) {
		if (timers.castBar < 1) return
		if (typeof party.presence[index] === 'object' &&
			party.presence[index].row >= 0) {
			my.targetIsMob = false
			if (my.target === party.presence[index].row) my.target = -1
			else my.target = party.presence[index].row
			combat.targetChanged()
		}
		else {
			chat.log('Target failed! Player not found.', CHAT.WARNING)
		}
	}
	function getResistObject() {
		var resp = {}
		ng.resists.forEach(function(type) {
			resp[type] = create.getResist(type, my)
		})
		return resp
	}

	function getPartyNames() {
		var a = [];
		party.presence.forEach(function(v){
			v.name && a.push(v.name);
		});
		return a;
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
	function resourceTick(type) {
		// hpRegen mpRegen spRegen
		if (my.hp > 0 && !my.buffFlags.frozen) {
			if (type === PROP.HP) {
				my.hp += stats.hpRegen()
				if (my.hp > my.hpMax) my.hp = my.hpMax
			}
			else if (type === PROP.MP) {
				my.mp += stats.mpRegen()
				if (my.mp > my.mpMax) my.mp = my.mpMax
			}
			else if (type === PROP.SP) {
				my.sp += stats.spRegen()
				if (my.sp > my.spMax) my.sp = my.spMax
			}
		}
	}
	function initSkills() {
		// console.warn('initSkills', my.skills)
		if (my.skills === void 0) {
			my.skills = [0,0,0,0,0,0,0,0,0,0,0,0]
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