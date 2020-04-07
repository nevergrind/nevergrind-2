var my;
(function() {
	my = {
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
		slot: 1,
		tgt: 1,
		attackOn: false,
		hudTimer: new delayedCall(0, ''),
		selectedZone: 0,
		selectedMissionTitle: '',
		quest: {},
		hud,
		Party,
		clearHud,
		getResistObject,
		getPartyNames,
		getAvatarUrl,
		getNewLeaderName,
		processInv,
		processEq,
		getPartySlotByRow,
		isLowestPartyIdMine,
	}
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
			maxHp: 0,
			mp: 0,
			maxMp: 0,
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

	function processInv(obj) {
		for (var i=0; i<item.MAX_INVENTORY; i++) {
			items.inv[i] = {}
		}
		for (var key in obj) {
			items.inv[key] = JSON.parse(obj[key].data)
			items.inv[key].row = obj[key].row
			items.inv[key].name = obj[key].name
		}
	}

	function processEq(obj) {
		for (var i=0; i<item.MAX_EQUIPMENT; i++) {
			items.eq[i] = {}
		}
		for (var key in obj) {
			items.eq[key] = JSON.parse(obj[key].data)
			items.eq[key].row = obj[key].row
			items.eq[key].name = obj[key].name
		}
	}
})();