var my;
(function() {
	my = {
		lastDifficulty: 'Very Easy',
		mouse: {
			x: 0,
			y: 0
		},
		channel: '',
		lastReceivedWhisper: '',
		p_id: 0,
		leader: '',
		isLeader: 1,
		zoneMobs: [],
		guild: {
			id: 0,
			rank: '',
			memberNumber: 0,
			motd: '',
			members: 0,
			name: ''
		},
		team: 0,
		slot: 1,
		tgt: 1,
		attackOn: false,
		hudTimer: ng.TDC(),
		selectedQuest: '',
		quest: {},
		hud,
		Party,
		clearHud,
		partyCount,
		getPartyNames,
		getNewLeaderName,
		getPartySlotByRow,
		isLowestPartyIdMine,
		updateHeartbeat,
		getPartyMemberIdByName,
	}
	////////////////////////////////////
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
	function getPartyMemberIdByName(name) {
		var id = 0;
		party.presence.forEach(function(v) {
			if (v.name === name) {
				id = v.id;
			}
		});
		return id;
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
	function partyCount() {
		var count = 0;
		party.presence.forEach(function(v) {
			if (v.name) {
				count++;
			}
		});
		return count;
	}
	function Party() {
		return {
			row: 0, // not updated from server - failing at life
			id: 0, // when updated
			name: '',
			isLeader: 0,
			job: '',
			level: 0,
			hp: 0,
			maxHp: 0,
			mp: 0,
			maxMp: 0,
			isHidden: true,
			heartbeat: Date.now()
		}
	}
	function updateHeartbeat(s) {
		party.presence[s].heartbeat = Date.now();
		party.presence[s].linkdead = 0;
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
})();