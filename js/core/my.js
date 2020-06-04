var my;
!function($, _, TweenMax, undefined) {
	my = {
		hud,
		getResistObject,
		getPartyNames,
		getAvatarUrl,
		resourceTick,
		checkForDeath,
		fixTarget,
		setTarget,
		tabTarget,
		initSkills,
		getMyData,
		cacheStatValues,
		saveCharacterData,
		dataProps: [
			'str',
			'sta',
			'agi',
			'dex',
			'wis',
			'intel',
			'cha',
			'offense',
			'defense',
			'oneHandSlash',
			'twoHandSlash',
			'oneHandBlunt',
			'twoHandBlunt',
			'piercing',
			'archery',
			'handToHand',
			'dodge',
			'parry',
			'riposte',
			'dualWield',
			'doubleAttack',
			'alteration',
			'conjuration',
			'evocation',
			'skills',
		],
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
		gold: 0,
		slot: 1,
		target: -1,
		hoverTarget: -1,
		avatarBg: 5,
		attackOn: false,
		hudTimer: new delayedCall(0, ''),
		quest: {},
		isAutoAttacking: false
		// buffs, potions, etc that need to be cancelled on death or whatever. looping through and killing them makes this easier
	}

	const tabOrder = [0, 5, 1, 6, 2, 7, 3, 8, 4]
	let index
	////////////////////////////////////
	function fixTarget() {
		if (typeof mobs[my.target] === 'undefined' || !mobs[my.target].name) {
			tabTarget({ shiftKey: false })
		}
	}
	function setTarget(i) {
		my.target = i
		if (!mobs[my.target].name) fixTarget()
		else combat.targetChanged()
	}
	function tabTarget(event, tries) {
		if (typeof tries === 'undefined') tries = 0
		index = tabOrder.findIndex(val => val === my.target)
		if (event.shiftKey) {
			if (my.target === 0) my.target = tabOrder[tabOrder.length - 1]
			else my.target = tabOrder[index - 1]
		}
		else {
			if (my.target === tabOrder[tabOrder.length - 1]) my.target = tabOrder[0]
			else my.target = tabOrder[index + 1]
		}
		if (tries > tabOrder.length) my.target = -1
		else {
			if (!mobs[my.target].name) {
				tries++
				tabTarget(event, tries)
			}
			else combat.targetChanged()
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
	function hud(msg, d) {
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
	}
	function resourceTick(type) {
		// hpRegen mpRegen spRegen
		if (my.hp > 0) {
			my[type] += stats[type + 'Regen']()
			if (my[type] > my[type + 'Max']) my[type] = my[type + 'Max']
		}
	}
	function checkForDeath() {
		if (my.hp <= 0) {
			warn("Oh no, I am dead")
		}
	}
	function initSkills() {
		warn('initSkills', my.skills)
		if (my.skills === void 0) {
			my.skills = [1,0,0,0,0,0,0,0,0,0,0,0]
			saveCharacterData()
		}
	}

	function saveCharacterData() {
		$.post(app.url + 'character/save-data.php', {
			data: JSON.stringify(getMyData())
		})
	}
	function getMyData() {
		return _.pick(my, my.dataProps)
	}
	function cacheStatValues() {
		my.crit = stats.critChance()
		my.armor = stats.armor()
	}
}($, _, TweenMax);