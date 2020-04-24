var my;
!function($, _, TweenMax, undefined) {
	my = {
		hud,
		Party,
		clearHud,
		getResistObject,
		getPartyNames,
		getAvatarUrl,
		getNewLeaderName,
		getPartySlotByRow,
		isLowestPartyIdMine,
		resourceTick,
		checkForDeath,
		initSkills,
		saveCharacterData,
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
		tgt: 1,
		attackOn: false,
		hudTimer: new delayedCall(0, ''),
		selectedZone: 0,
		selectedMissionTitle: '',
		quest: {},
		// buffs, potions, etc that need to be cancelled on death or whatever. looping through and killing them makes this easier
		timers: [],
	}

	const dataProps = [
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
	]
	////////////////////////////////////

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
	function isLowestPartyIdMine() {
		var lowestId = party.presence[0].id;
		party.presence.forEach(function(v) {
			if (v.id && v.id < lowestId) {
				lowestId = v.id;
			}
		});
		return lowestId === party.presence[0].id;
	}
	function getAvatarUrl(obj) {
		obj = obj || my
		return 'images/avatars/' + _.kebabCase(obj.race) + '-' + (obj.gender ? 'female-' : 'male-') + obj.face + '.png';
	}
	function getNewLeaderName() {
		var lowestId = party.presence[0].id,
			name = party.presence[0].name;
		party.presence.forEach(function(v) {
			if (v.id && v.id < lowestId) {
				name = v.name;
			}
		});
		return name;
	}
	function getPartySlotByRow(row) {
		var slot = 0;
		party.presence.forEach(function(v, i) {
			if (v.id === row) {
				slot = i;
			}
		});
		return slot;
	}
	function Party(isLeader) {
		return {
			row: 0, // not updated from server - failing at life
			id: 0, // when updated
			name: '',
			isLeader: isLeader || false,
			job: '',
			level: 0,
			hp: 0,
			hpMax: 0,
			mp: 0,
			mpMax: 0,
			isHidden: true,
			heartbeat: Date.now()
		};
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
	function clearHud() {
		my.hudTimer.kill();
		DOM.hud.style.visibility = 'hidden';
	}
	function resourceTick(type) {
		if (my.view === 'battle' || !app.isApp) {
			my[type] += stats[type + 'Regen']()
			if (my[type] > my[type + 'Max']) my[type] = my[type + 'Max']
		}
	}
	function checkForDeath() {

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
			data: JSON.stringify(_.pick(my, dataProps))
		})
	}
}($, _, TweenMax);