var party;
(function(Date, _, $) {
	party = {
		prefix: (sessionStorage.getItem('reloads') ? +sessionStorage.getItem('reloads') : 1),
		presence: [],
		color: [
			'#e11',
			'#05b',
			'#dd0',
			'#080',
			'#0dd',
			'#a0f',
		],
		maxPlayers: 5,
		damage: {},
		getUniquePartyChannel,
		upsertPartyResource,
		upsertParty,
		listen,
		invite,
		inviteAccepted,
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
		hasMoreThanOnePlayer,
		getIndexByRow,
		getNameByRow,
		isSomeoneAlive,
		isAlive,
		aliveByIndex,
		isChilled,
		isFrozen,
	};
	party.prefix++;
	sessionStorage.setItem('reloads', party.prefix);
	var time, index, diff, updateHp = false, updateMp = false, updateSp = false
	const resourceKeys = [PROP.HP, PROP.MP, PROP.SP, PROP.HP_MAX, PROP.MP_MAX, PROP.SP_MAX]
	//////////////////////////////////////
	function isSomeoneAlive() {
		return party.presence.some(party.isAlive)
	}
	function isAlive(p) {
		return p.hp > 0 && p.row > 0 && Date.now() - p.time < game.maxTimeout
	}
	function aliveByIndex(i) {
		return typeof party.presence[i] === 'object' &&
			party.presence[i].row > 0 &&
			party.presence[i].hp > 0 &&
			Date.now() - party.presence[i].time < game.maxTimeout
	}
	function isChilled(row) {
		return party.presence[party.getIndexByRow(row)].isChilled
	}
	function isFrozen(row) {
		return party.presence[party.getIndexByRow(row)].isFrozen
	}
	function getIndexByRow(row) {
		return party.presence.findIndex(member => member.row === row)
	}
	function getNameByRow(row) {
		return _.find(party.presence, {
			row: row
		}).name
	}
	function hasMoreThanOnePlayer() {
		return party.presence.length > 1
	}
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
			// console.info('socket.listen ', err);
		}
	}
	function route(data, obj) {
		data = router.normalizeInput(data, obj);
		if (data.route === 'chat->log') router.toTown(data, data.route)
		else router.toParty(data, data.route)
	}
	function checkUpdateBars(data, player) {
		if (data.hp !== player.hp ||
			data.hpMax !== player.hpMax) {
			player.hp = data.hp;
			player.hpMax = data.hpMax;
			bar.updateBar(PROP.HP, data)
		}
		if (data.mp !== player.mp ||
			data.mpMax !== player.mpMax) {
			player.mp = data.mp;
			player.mpMax = data.mpMax;
			bar.updateBar(PROP.MP, data)
		}
		if (data.sp !== player.sp ||
			data.spMax !== player.spMax) {
			player.sp = data.sp;
			player.spMax = data.spMax;
			bar.updateBar(PROP.SP, data)
		}
	}
	function upsertPartyResource(data) {
		updateHp = false
		updateMp = false
		updateSp = false
		index = party.getIndexByRow(data.row)
		let player = party.presence[index]
		if (index >= 0) {
			// console.info('upsertPartyResource', data)
			for (var key in data) {
				if (resourceKeys.includes(key)) {
					player[key] = data[key]
					if (key === PROP.HP) updateHp = true
					if (key === PROP.MP) updateMp = true
					if (key === PROP.SP) updateSp = true
				}
			}
			updateHp && bar.updateBar(PROP.HP, data)
			updateMp && bar.updateBar(PROP.MP, data)
			updateSp && bar.updateBar(PROP.SP, data)
		}
	}
	function upsertParty(data) {
		// if (my.partyId !== data.partyId) return;
		time = Date.now()
		index = party.getIndexByRow(data.row)
		let p = party.presence[index]
		if (index >= 0) {
			// update
			checkUpdateBars(data, p)
			p.time = time
			p.job = data.job
			p.name = _.capitalize(data.name)
			p.row = data.row
			p.level = data.level
			p.avatar = data.avatar
			bar.updatePlayerBar(data)
		}
		else {
			// not found - add!
			if (party.presence.length < party.maxPlayers) {
				// console.warn('adding party member', party.presence.length, data);
				party.presence.push({
					time: time,
					hp: data.hp,
					hpMax: data.hpMax,
					mp: data.mp,
					mpMax: data.mpMax,
					sp: data.sp,
					spMax: data.spMax,
					job: data.job,
					name: _.capitalize(data.name),
					row: data.row,
					level: data.level,
					avatar: data.avatar,
					isChilled: false,
					isFrozen: false,
					hitCount: 0,
				});
				console.info('player', _.cloneDeep(player))
				var len = party.presence.length - 1
				bar.addPlayer(party.presence[len], data.row)
				checkUpdateBars(data, party.presence[len])
				bar.updatePlayerBar(data)
				player.updateAllPlayerSprites()
			}
			else {
				// broadcast and reject join with a boot
			}
		}
		auditParty(time);
	}
	function auditParty(time) {
		// do not change to a for loop
		party.presence.forEach(player => {
			diff = time - player.time;
			if (diff > game.maxTimeout) {
				removePartyMember(player);
			}
		})
	}

	/**
	 * Only check leader on the last loop or if it's a single remove
	 * @param player
	 * @param checkLeader
	 */
	function removePartyMember(p, checkLeader = true) {
		if (typeof p === 'object') {
			index = party.getIndexByRow(p.row)
			// console.warn('removing party member: index', index, 'row', p.row)
			_.pullAt(party.presence, [ index ])
			bar.dom[p.row] = undefined
			$('#bar-player-wrap-' + p.row).remove()
			// elect new leader - only possible if timed out
			// console.info('checkLeader', checkLeader)
			if (checkLeader) {
				// console.info('electLeader', p.isLeader, party.presence.length)
				// console.info('party', _.cloneDeep(party.presence))
				if (p.isLeader && party.hasMoreThanOnePlayer()) {
					electLeader()
				}
				if (party.presence.length === 1) {
					my.isLeader = party.presence[0].isLeader = true
					getElementById('bar-name-' + my.row).classList.remove('chat-gold')
				}
			}
			console.warn("REMOVING PARTY MEMBER", _.cloneDeep(party.presence))
			player.updateAllPlayerSprites()
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
		if (my.name === name) chat.log("You can't invite yourself to a party.", CHAT.WARNING)
		else if (!party.presence[0].isLeader) chat.log("Only the party leader may send invites.", CHAT.WARNING)
		else if (mission.inProgress) chat.log("You cannot invite adventurers to the party after starting the mission.", CHAT.WARNING)
		else if (ng.view !== 'town') chat.log("You cannot invite adventurers from the depths of a dungeon.", CHAT.WARNING)
		else {
			if (name) {
				chat.log('Sent party invite to '+ name +'.', CHAT.WARNING);
				// console.info('name', name);
				socket.publish('name' + name, {
					action: 'party-invite',
					row: my.partyId,
					msg: my.name + ' has invited you to a party.',
					name: my.name
				});
			}
			else {
				chat.log("Syntax: /invite Bob", CHAT.WARNING);
			}
		}
	}

	/**
	 * REQUESTER: player has requested or accepted invite to party
	 * @param data
	 */
	function inviteAccepted(data) {
		// clicked CONFIRM - request join ack
		// console.info('party.inviteAccepted: ', data);
		socket.publish('party' + data.row, {
			route: 'p->inviteAccepted',
			name: my.name.toLowerCase(),
		})
	}
	/**
	 * LEADER: leader confirms invite request is valid
	 * @param data
	 */
	function joinAck(data) {
		// console.warn('joinAck', data);
		// console.info(party.presence.length, party.presence[Zero].isLeader);
		if (party.presence.length < party.maxPlayers && party.presence[0].isLeader) {
			socket.publish('name' + data.name, {
				action: 'party-confirmed',
				row: my.partyId
			});
			// console.warn('length: ', party.presence.length)
			party.presence.length === 1 && getElementById('bar-name-' + my.row).classList.add('chat-gold');
		}
	}
	/**
	 * REQUESTER: party join request has been confirmed by leader
	 * @param data
	 */
	function joinConfirmed(data) {
		// console.warn('joinConfirmed', data);
		my.isLeader = party.presence[0].isLeader = false;
		my.partyId = data.row;
		party.listen(data.row);
		chat.log("You have joined the party.", CHAT.WARNING)
		query.resetCache()
		delayedCall(.1, () => {
			socket.publish('party' + my.partyId, {
				msg: my.name + ' has joined the party.',
				route: 'p->notifyJoin',
			});
		})
	}
	/**
	 * Notify party of new member and get bar state
	 * @param data
	 */
	function notifyJoin(data) {
		// console.info('party.notifyJoin ', data);
		chat.log(data.msg, CHAT.WARNING);
		// refresh party bars
		socket.publish('party' + my.partyId, {
			route: 'p->getPresence',
		});
	}
	function boot(name, bypass) {
		// console.info('/boot ', name, bypass);
		if (ng.view === 'battle') {
			chat.log("You cannot boot party members during battle!", CHAT.WARNING);
		}
		else {
			if (my.name === name) {
				chat.log('You cannot boot yourself! Try disbanding instead.');
			}
			else {
				// must be leader or bypass by auto-election when leader leaves
				if ((party.presence[0].isLeader || bypass) && party.hasMoreThanOnePlayer() && name) {
					socket.publish('party' + my.partyId, {
						name: name,
						leader: my.name,
						route: 'p->boot',
					});
				}
			}
		}
	}
	function bootReceived(data) {
		// console.warn('party.bootReceived ', data);
		if (data.name === my.name) {
			var i = party.maxPlayers - 1;
			for (; i > 0; i--) {
				removePartyMember(party.presence[i], i === 1);
			}
			party.listen(party.getUniquePartyChannel());
			chat.log(data.leader + " has booted you from the party!", CHAT.WARNING);
		}
		else {
			var index = party.getNameByRow(data.name)
			removePartyMember(party.presence[index]);
			chat.log(data.name + " has been booted from the party.", CHAT.WARNING);
		}
	}
	function disband() {
		if (party.presence.length === 1) {
			chat.log('You are not in a party. Try to abandon the mission instead.', CHAT.WARNING);
		}
		else if (ng.view === 'battle') {
			chat.log("You cannot disband the party during battle!", CHAT.WARNING);
		}
		else {
			if (party.hasMoreThanOnePlayer()) {
				my.isLeader = party.presence[0].isLeader = true;
				socket.publish('party' + my.partyId, {
					name: my.name,
					route: 'p->disband',
				});
				// stuff for disbander
				mission.inProgress && ng.msg('Mission abandoned: '+ quests[mission.questId].title)
				chat.log('You disbanded the party.')
				var i = party.maxPlayers - 1;
				for (; i > 0; i--) {
					removePartyMember(party.presence[i], i === 1);
				}
				party.listen(party.getUniquePartyChannel(true));
			}
			chat.log('Mission abandoned!', CHAT.WARNING);
			mission.abort();
			mission.resetLocalQuestData();
		}
	}
	function disbandReceived(data) {
		if (data.name !== my.name) {
			// console.warn('disbandReceived', data);
			var index = party.getNameByRow(data.name)
			chat.log(data.name + " has disbanded the party.", CHAT.WARNING);
			removePartyMember(party.presence[index]);
		}
	}
	function electLeader() {
		var player = _.minBy(party.presence, 'row');
		var index;
		// console.warn("Electing a new leader!", player);
		if (player.name === my.name) {
			index = 0;
			my.isLeader = party.presence[index].isLeader = true;
			game.updateParty();
			// console.warn("New leader!", player.name);
		}
		else {
			index = party.getIndexByRow(player.row)
			party.presence[index].isLeader = true;
		}
		// console.warn("LEADER INDEX: ", index, player.row);
		getElementById('bar-name-' + player.row).classList.add('chat-gold');
	}
	function promote(name) {
		// console.info('/promote ', name);
		// must be leader or bypass by auto-election when leader leaves
		var id = party.getNameByRow(name)

		if (party.presence[0].isLeader) {
			if (id >= 1) {
				my.isLeader = party.presence[0].isLeader = false;
				socket.publish('party' + my.partyId, {
					route: 'p->promote',
					name: name,
					leaderRow: my.row
				});
			}
			else {
				chat.log('That player was not found in your party. Did you spell it right?')
			}
		}
		else {
			chat.log('You must be the leader to promote a party member!')
		}
	}
	function promoteReceived(data) {
		var index = party.getNameByRow(data.name)
		if (index >= 0) {
			chat.log(data.name + " has been promoted to party leader.", CHAT.WARNING)
			// console.warn('index', index)
			party.presence[index].isLeader = true
			if (!index) {
				// console.warn('Look at me. I am the leader now')
				my.isLeader = true
			}
			var oldLeader = party.getIndexByRow(data.leaderRow)
			// console.warn('oldLeader', oldLeader)
			getElementById('bar-name-' + party.presence[index].row).classList.add('chat-gold')
			getElementById('bar-name-' + party.presence[oldLeader].row).classList.remove('chat-gold')
		}
	}
	function parse(msg) { // 2-part upper case
		var a = msg.replace(/ +/g, " ").split(" ")
		return a[1] === void 0 ?
			'' : (_.capitalize(a[1].trim()))
	}
})(Date, _, $);