var party;
(function() {
	party = {
		prefix: (sessionStorage.getItem('reloads') ? +sessionStorage.getItem('reloads') : 1),
		presence: [],
		maxPlayers: 6,
		getUniquePartyChannel,
		missionUpdate,
		upsertParty,
		notifyMissionStatus,
		listen,
		invite,
		inviteReceived,
		joinAck,
		joinConfirmed,
		notifyJoin,
		promoteReceived,
		boot,
		bootReceived,
		disbandReceived,
		parse,
		promote,
		disband,
	};
	party.prefix++;
	sessionStorage.setItem('reloads', party.prefix);
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
		if (my.partyId) {
			socket.unsubscribe('party' + my.partyId);
		}

		// sub to party
		my.partyId = row;
		try {
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

	/**
	 * Only check leader on the last loop or if it's a single remove
	 * @param player
	 * @param checkLeader
	 */
	function removePartyMember(player, checkLeader = true) {
		if (typeof player === 'object') {
			index = _.findIndex(party.presence, { row: player.row });
			console.warn('removing party member: index', index, 'row', player.row);
			_.pullAt(party.presence, [ index ]);
			bar.dom[player.row] = undefined;
			$('#bar-player-wrap-' + player.row).remove();
			// elect new leader - only possible if timed out
			if (checkLeader) {
				if (player.isLeader && party.presence.length > 1) {
					electLeader();
				}
				if (party.presence.length === 1) {
					getById('bar-is-leader-' + my.row).classList.add('none');
				}
			}
		}
	}
	function getUniquePartyChannel(increment) {
		if (increment) {
			// only increment if previously set
			party.prefix++;
			sessionStorage.setItem('reloads', party.prefix);
		}
		return +(party.prefix + '0' + my.row);
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
	function inviteReceived(data) {
		// clicked CONFIRM - request join ack
		console.info('party.inviteReceived: ', data);
		socket.publish('party' + data.row, {
			route: 'party->inviteReceived',
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
		my.isLeader = party.presence[0].isLeader = false;
		my.partyId = data.row;
		party.listen(data.row);
		chat.log("You have joined the party.", "chat-warning");
		setTimeout(() => {
			socket.publish('party' + my.partyId, {
				msg: my.name + ' has joined the party.',
				route: 'party->notifyJoin',
			});
		}, 100)
	}
	/**
	 * Notify party of new member and get bar state
	 * @param data
	 */
	function notifyJoin(data) {
		console.info('party.notifyJoin ', data);
		chat.log(data.msg, 'chat-warning');
		// refresh party bars
		socket.publish('party' + my.partyId, {
			route: 'party->getPresence',
		});
	}
	function boot(name, bypass) {
		console.info('/boot ', name, bypass);
		if (ng.view === 'battle') {
			chat.log("You cannot boot party members during battle!", "chat-warning");
		}
		else {
			if (my.name === name) {
				chat.log('You cannot boot yourself! Try disbanding instead.');
			}
			else {
				// must be leader or bypass by auto-election when leader leaves
				if ((party.presence[0].isLeader || bypass) && party.presence.length > 1 && name) {
					socket.publish('party' + my.partyId, {
						name: name,
						leader: my.name,
						route: 'party->boot',
					});
				}
			}
		}
	}
	function bootReceived(data) {
		console.warn('party.bootReceived ', data);
		if (data.name === my.name) {
			var i = party.maxPlayers - 1;
			for (; i > 0; i--) {
				removePartyMember(party.presence[i], i === 1);
			}
			party.listen(party.getUniquePartyChannel());
			chat.log(data.leader + " has booted you from the party!", 'chat-warning');
		}
		else {
			var index = _.findIndex(party.presence, { name: data.name });
			removePartyMember(party.presence[index]);
			chat.log(data.name + " has been booted from the party.", 'chat-warning');
		}
	}
	function disband() {
		if (ng.view === 'battle') {
			chat.log("You cannot disband the party during battle!", "chat-warning");
		}
		else {
			if (party.presence.length > 1) {
				my.isLeader = party.presence[0].isLeader = true;
				socket.publish('party' + my.partyId, {
					name: my.name,
					route: 'party->disband',
				});
				// stuff for disbander
				my.quest.level && ng.msg('Mission abandoned: '+ my.quest.title);
				chat.log('You disbanded the party.');
				var i = party.maxPlayers - 1;
				for (; i > 0; i--) {
					removePartyMember(party.presence[i], i === 1);
				}
				party.listen(party.getUniquePartyChannel(true));
			}
			mission.abort();
			mission.initQuest();
		}
	}
	function disbandReceived(data) {
		if (data.name !== my.name) {
			console.warn('disbandReceived', data);
			var index = _.findIndex(party.presence, { name: data.name });
			chat.log(data.name + " has disbanded the party.", 'chat-warning');
			removePartyMember(party.presence[index]);
		}
	}
	function electLeader() {
		var player = _.minBy(party.presence, 'row');
		var index;
		console.warn("Electing a new leader!", player);
		if (player.name === my.name) {
			index = 0;
			my.isLeader = party.presence[index].isLeader = true;
			game.heartbeatSend();
			console.warn("New leader!", player.name);
		}
		else {
			index = _.findIndex(party.presence, { row: player.row });
			party.presence[index].isLeader = true;
		}
		console.warn("LEADER INDEX: ", index, player.row);
		getById('bar-is-leader-' + player.row).classList.remove('none');
	}
	function promote(name) {
		console.info('/promote ', name);
		// must be leader or bypass by auto-election when leader leaves
		var id = _.findIndex(party.presence, { name: name });
		if (party.presence[0].isLeader) {
			if (id >= 1) {
				my.isLeader = party.presence[0].isLeader = false;
				socket.publish('party' + my.partyId, {
					route: 'party->promote',
					name: name,
					leaderRow: my.row
				});
			}
			else {
				chat.log('That player was not found in your party. Did you spell it right?');
			}
		}
		else {
			chat.log('You must be the leader to promote a party member!');
		}
	}
	function promoteReceived(data) {
		var index = _.findIndex(party.presence, { name: data.name });
		if (index >= 0) {
			chat.log(data.name + " has been promoted to party leader.", 'chat-warning');
			console.warn('index', index);
			party.presence[index].isLeader = true;
			if (!index) {
			console.warn('Look at me. I am the leader now');
				my.isLeader = true;
			}
			var oldLeader = _.findIndex(party.presence, { row: data.leaderRow });
			console.warn('oldLeader', oldLeader);
			getById('bar-is-leader-' + party.presence[index].row).classList.remove('none');
			getById('bar-is-leader-' + party.presence[oldLeader].row).classList.add('none');
		}
	}
	function parse(msg) { // 2-part upper case
		var a = msg.replace(/ +/g, " ").split(" ");
		return a[1] === undefined ?
			'' : (_.capitalize(a[1].trim()));
	}
	function missionUpdate(data) {
		console.info("MISSION UPDATE! ", data);
		mission.setQuest(data.quest);
		my.zoneMobs = data.zoneMobs;
		if (party.presence.length > 1 && !party.presence[0].isLeader) {
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
	function notifyMissionStatus(data) {
		ng.msg(data.msg, 6);
		if (data.action === 'abandon') {
			mission.abort();
		}
	}
})();