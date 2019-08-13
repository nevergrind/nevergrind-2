var party;
(function() {
	party = {
		prefix: (sessionStorage.getItem('reloads') ? +sessionStorage.getItem('reloads') : 1),
		presence: [],
		maxPlayers: 6,
		getUniquePartyChannel,
		missionUpdate,
		upsertParty,
		isSoloOrLeading,
		notifyMissionStatus,
		listen,
		promotePlayer,
		invite,
		joinRequest,
		joinAck,
		joinConfirmed,
		notifyJoin,
		getPresence,
		notifyPromote,
		notifyBoot,
		partyDisband,
		notifyDisband,
		parse,
		promote,
		disband,
		boot,
	};
	sessionStorage.setItem('reloads', party.prefix + 1);
	var time;
	var index;
	var player;
	var i;
	var len;
	var diff;
	//////////////////////////////////////
	/**
	 * unsubs current party channel and subs the new one
	 * @param row
	 */
	function listen(row) {
		// unsub to current party?
		my.partyId && socket.unsubscribe('party'+ my.partyId);
		// sub to party
		my.partyId = row;
		try {
			// for some reason I need this when I rejoin town; whatever ???
			socket.subscribe('party' + row, route);
		}
		catch (err) {
			console.info('socket.listen ', err);
		}
	}
	function route(data, obj) {
		data = router.normalizeInput(data, obj);
		if (data.route === 'chat->log') {
			router.toTown(data, data.route);
		}
		else {
			router.toParty(data, data.route);
		}
	}
	function upsertParty(data) {
		if (my.partyId !== data.partyId) return;
		time = Date.now();
		index = _.findIndex(party.presence, { row: data.row });
		player = party.presence[index];
		if (index >= 0) {
			// update
			player.time = time;
			player.hp = data.hp;
			player.maxHp = data.maxHp;
			player.mp = data.mp;
			player.maxMp = data.maxMp;
			player.job = data.job;
			player.name = data.name;
			player.row = data.row;
			player.level = data.level;
			bar.updatePlayerBar(data);
		}
		else {
			// add
			if (party.presence.length < party.maxPlayers) {
				console.warn('adding party member', party.presence.length, data);
				party.presence.push({
					time: time,
					hp: data.hp,
					maxHp: data.maxHp,
					mp: data.mp,
					maxMp: data.maxMp,
					job: data.job,
					name: data.name,
					row: data.row,
					level: data.level,
				});
				var len = party.presence.length - 1;
				bar.addPlayer(party.presence[len], data.row);
				bar.updatePlayerBar(data);
			}
			else {
				// broadcast and reject join with a boot
			}
		}
		auditParty(time);
	}
	function auditParty(time) {
		// do not change to a for loop
		party.presence.forEach(function(player) {
			diff = time - player.time;
			if (diff > game.heartbeatExpired) {
				removePartyMember(player);
			}
		})
	}
	function removePartyMember(player) {
		if (typeof player === 'object') {
			console.warn('removing party member: ', player.row);
			index = _.findIndex(party.presence, { row: player.row });
			_.pullAt(party.presence, [ index ]);
			bar.dom[player.row] = undefined;
			$('#bar-player-wrap-' + player.row).remove();
			// elect new leader - only possible if timed out
			if (player.isLeader && party.presence.length > 1) {
				electLeader();
			}
			if (party.presence.length === 1) {
				getById('bar-is-leader-' + my.row).classList.add('none');
			}
		}
	}
	function getUniquePartyChannel() {
		return +(party.prefix + '0' + my.row);
	}
	function promote(name, bypass) {
		console.info('/promote ', name, bypass);
		// must be leader or bypass by auto-election when leader leaves
		var id = my.getPartyMemberIdByName(name);
		if ((party.presence[0].isLeader || bypass) && my.partyId && id) {
			$.post(app.url + 'chat/promote.php', {
				name: _.toLower(name),
				leaderId: id
			}).done(function (data) {
				// console.info('promote ', data);
			}).fail(function (r) {
				chat.log(r.responseText, 'chat-warning');
			});
		}
	}

	/**
	 * LEADER: Sends invite to player
	 * @param name
	 */
	function invite(name) {
		if (my.name === name) {
			chat.log("You can't invite yourself to a party.", "chat-warning");
		}
		else if (!party.presence[0].isLeader) {
			chat.log("Only the party leader may send invites.", "chat-warning");
		}
		else if (my.quest.level) {
			chat.log("You cannot invite adventurers to the party after starting the mission.", "chat-warning");
		}
		else if (ng.view !== 'town') {
			chat.log("You cannot invite adventurers from the depths of a dungeon.", "chat-warning");
		}
		else {
			if (name) {
				chat.log('Sent party invite to '+ name +'.', 'chat-warning');
				console.info('name', name);
				socket.publish('name' + name, {
					action: 'party-invite',
					row: my.partyId,
					msg: my.name + ' has invited you to join his party.',
					name: my.name,
					css: 'prompt-party-invite',
				});
			}
			else {
				chat.log("Syntax: /invite Bob", "chat-warning");
			}
		}
	}

	/**
	 * REQUESTER: player has requested or accepted invite to party
	 * @param data
	 */
	function joinRequest(data) {
		// clicked CONFIRM - request join ack
		console.info('party.joinRequest: ', data);
		socket.publish('party' + data.row, {
			route: 'party->joinRequest',
			name: my.name.toLowerCase(),
		});
	}
	/**
	 * LEADER: leader confirms invite request is valid
	 * @param data
	 */
	function joinAck(data) {
		console.warn('joinAck', data);
		console.info(party.presence.length, party.presence[0].isLeader);
		if (party.presence.length < party.maxPlayers && party.presence[0].isLeader) {
			socket.publish('name' + data.name, {
				action: 'party-confirmed',
				row: my.partyId
			});
			console.warn('length: ', party.presence.length)
			party.presence.length === 1 && getById('bar-is-leader-' + my.row).classList.remove('none');
		}
	}
	/**
	 * REQUESTER: party join request has been confirmed by leader
	 * @param data
	 */
	function joinConfirmed(data) {
		console.warn('joinConfirmed', data);
		party.presence[0].isLeader = false;
		my.partyId = data.row;
		party.listen(data.row);
		socket.publish('party' + my.partyId, {
			msg: my.name + ' has joined the party.',
			route: 'party->notifyJoin',
		});
		chat.log("You have joined the party.", "chat-warning");
		//game.heartbeatSend();
	}
	/**
	 * Notify party of new member and get bar state
	 * @param data
	 */
	function notifyJoin(data) {
		console.info('party.notifyJoin ', data);
		chat.log(data.msg, 'chat-warning');
		// refresh party bars
		party.getPresence();
	}
	/**
	 * Get current state of party via requesting heartbeats
	 */
	function getPresence() {
		socket.publish('party' + my.partyId, {
			route: 'party->getPresence',
		});
	}
	function notifyPromote(data) {
		chat.log(data.name + " has been promoted to party leader.", 'chat-warning');
		// refresh party bars
		party.getPresence();
	}
	function boot(name, bypass) {
		console.info('/boot ', name, bypass);
		if (my.name === name) {
			chat.log('You cannot boot yourself! Try disbanding instead.');
		}
		else {
			// must be leader or bypass by auto-election when leader leaves
			if ((party.presence[0].isLeader || bypass) && my.partyId && name) {
				socket.publish('party' + my.partyId, {
					name: name,
					leader: my.name,
					route: 'party->boot',
				});
			}
		}
	}
	function notifyBoot(data) {
		console.info('party.notifyBoot ', data);
		if (data.name === my.name) {
			chat.log(data.leader + " has booted you from the party!", 'chat-warning');
			party.listen(party.getUniquePartyChannel());
			for (var i=1; i<party.maxPlayers; i++) {
				removePartyMember(party.presence[i]);
			}
		}
		else {
			var index = _.findIndex(party.presence, { name: data.name });
			chat.log(data.name + " has been booted from the party.", 'chat-warning');
			removePartyMember(party.presence[index]);
		}
	}
	function electLeader() {
		var player = _.minBy(party.presence, 'row');
		var index;
		console.warn("Electing a new leader!", player);
		if (player.name === my.name) {
			index = 0;
			game.heartbeatSend();
			console.warn("New leader!", player.name);
		}
		else {
			index = _.findIndex(party.presence, { row: player.row });
		}
		console.warn("LEADER INDEX: ", index);
		party.presence[index].isLeader = true;
		getById('bar-is-leader-' + player.row).classList.remove('none');
	}
	function promotePlayer() {
		if (party.presence.length > 1) {
			var name = '';
			party.presence.forEach(function(v, i) {
				if (i) {
					if (v) {
						name = v.name;
					}
				}
			});
			name && chat.sendMsg('/promote ' + name);
		}
	}
	function partyDisband(data) {
		var index = 0,
			name = '',
			electNewLeader = 0;
		// did the leader disband or somehow get booted?
		party.presence.forEach(function(v, i) {
			if (data.row === v.id) {
				index = i;
				name = v.name;
				if (v.isLeader) {
					electNewLeader = 1;
				}
			}
		});
		// disbanded player found
		if (index) {
			// reset client data to default
			party.presence[index] = my.Party();
			getById('bar-player-wrap-' + index).style.display = 'none';
			chat.log(name + " has disbanded the party.", 'chat-warning');
			// elect new leader if client's id is lowest
			if (electNewLeader && my.isLowestPartyIdMine()) {
				party.promote(my.getNewLeaderName(), 1);
			}
		}
		// disband if it's me
		// console.info('disband: ', data.row, my.id);
		data.row === my.row && chat.sendMsg('/disband');
	}
	function notifyDisband() {
		party.presence.forEach(function(v, i){
			if (i) {
				// set client value
				party.presence[i] = my.Party();
			}
		});
		bar.hideParty();
		// update server
		socket.unsubscribe('party'+ my.partyId);
		my.partyId = my.row;
		party.presence[0].isLeader = false;
		getById('bar-is-leader-' + my.row).style.display = 'none';
	}
	function disband() {
		if (ng.view === 'battle') {
			chat.log("You cannot disband the party during battle!", "chat-warning");
		}
		else {
			var count = party.presence.length;
			$.post(app.url + 'chat/disband.php', {
				count: count
			}).done(function(r){
				// console.info('disband ', r);
				if (count > 1) {

				}
				if (my.partyId) {
					my.quest.level && ng.msg('Mission abandoned: '+ my.quest.title);
				}
				mission.initQuest();
				party.notifyDisband();
				mission.abort();
			}).fail(function(r) {
				chat.log(r.responseText, 'chat-warning');
			}).always(function() {
				ng.unlock();
			});
		}
	}
	function parse(msg) { // 2-part upper case
		var a = msg.replace(/ +/g, " ").split(" ");
		return a[1] === undefined ?
			'' : (a[1][0].toUpperCase() + a[1].substr(1).toLowerCase()).trim();
	}
	function missionUpdate(data) {
		console.info("MISSION UPDATE! ", data);
		mission.setQuest(data.quest);
		my.zoneMobs = data.zoneMobs;
		if (my.partyId && !party.presence[0].isLeader) {
			$.post(app.url + 'mission/update-quest.php', {
				quest: data.quest
			}).done(function (data) {
				console.info('missionUpdate ', data);
				town.aside.selected === 'town-mission' && mission.showEmbark();
				mission.updateTitle();
				chat.log("Now departing for " + my.quest.zone +"...", "chat-warning");
				TweenMax.to('#scene-town', 3, {
					startAt: { opacity: 1 },
					delay: 2,
					opacity: 0,
					ease: Power4.easeOut
				});
				setTimeout(function() {
					mission.embark();
				}, game.questDelay);
			});
		}
	}
	function isSoloOrLeading() {
		var leading = 0;
		var partyLen = party.presence.length;
		if (partyLen === 1 || partyLen > 1 && party.presence[0].isLeader) {
			leading = 1;
		}
		return leading;
	}
	function notifyMissionStatus(data) {
		ng.msg(data.msg, 6);
		if (data.action === 'abandon') {
			mission.abort();
		}
	}
})();