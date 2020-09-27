var my;
!function($, _, TweenMax, undefined) {
	my = {
		//hud,
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
		// buffs, potions, etc that need to be cancelled on death or whatever. looping through and killing them makes this easier
	}

	const tabOrder = [0, 5, 1, 6, 2, 7, 3, 8, 4]
	let index
	////////////////////////////////////
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
		if (typeof mobs[my.target] === 'undefined' || !mobs[my.target].name) {
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
		return typeof items.eq[13] === 'object' && items.eq[13].itemType === 'shields'
	}
}($, _, TweenMax);