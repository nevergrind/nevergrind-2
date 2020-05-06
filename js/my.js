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
		tabTarget,
		initSkills,
		getMyData,
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
		target: 1,
		attackOn: false,
		hudTimer: new delayedCall(0, ''),
		quest: {},
		// buffs, potions, etc that need to be cancelled on death or whatever. looping through and killing them makes this easier
		timers: [],
	}
	var i, tries, val

	////////////////////////////////////
	function fixTarget() {
		if (!mobs[my.target].name) {
			my.target = _.findIndex(mobs, mob => mob.name)
			combat.targetChanged()
		}
	}
	function tabTarget(event) {
		if (event.shiftKey) {
			my.target--
			if (my.target < 0) my.target = mob.max - 1
		}
		else {
			my.target++
			if (++my.target >= mob.max) my.target = 0
		}
		if (!mobs[my.target].name) fixTarget(event)
		else combat.targetChanged()
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
		my[type] += stats[type + 'Regen']()
		if (my[type] > my[type + 'Max']) my[type] = my[type + 'Max']
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
}($, _, TweenMax);