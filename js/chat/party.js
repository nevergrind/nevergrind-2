var party;
(function(Date, _, $) {
	party = {
		hasWiped: false,
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
		combatStartLength: 1,
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
		getIndexByName,
		getNameByRow,
		isSomeoneAlive,
		isAlive,
		aliveByIndex,
		isChilled,
		isFrozen,
		totalPlayers,
		casting,
		txCheckWipe,
		rxCheckWipe,
		respawn,
		reviveDeadAllies,
		memberDied,
		expBrokenByAll,
	};
	party.prefix++;
	sessionStorage.setItem('reloads', party.prefix);
	var time, index, diff, updateHp = false, updateMp = false, updateSp = false
	const resourceKeys = [PROP.HP, PROP.MP, PROP.SP, PROP.HP_MAX, PROP.MP_MAX, PROP.SP_MAX]
	//////////////////////////////////////
	function totalPlayers() {
		return party.presence.reduce((acc, v) => {
			if (v.name) acc++
			return acc
		}, 0)
	}
	function hasMoreThanOnePlayer() {
		return party.presence.length > 1
	}
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
	function getIndexByName(name) {
		return party.presence.findIndex(member => member.name === name)
	}
	function getNameByRow(row) {
		return _.find(party.presence, {
			row: row
		}).name
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
			player.hp = data.hp
			player.hpMax = data.hpMax
			bar.updateBar(PROP.HP, data)
		}
		if (data.mp !== player.mp ||
			data.mpMax !== player.mpMax) {
			player.mp = data.mp
			player.mpMax = data.mpMax
			bar.updateBar(PROP.MP, data)
		}
		if (data.sp !== player.sp ||
			data.spMax !== player.spMax) {
			player.sp = data.sp
			player.spMax = data.spMax
			bar.updateBar(PROP.SP, data)
		}
	}

	/**
	 * rx function that handles updates from party members
	 * client-side death is handled in selfDied
	 * @param data
	 */
	function upsertPartyResource(data) {
		updateHp = false
		updateMp = false
		updateSp = false
		index = party.getIndexByRow(data.row)
		let player = party.presence[index]
		if (index >= 0) {
			for (var key in data) {
				if (resourceKeys.includes(key)) {
					if (key === PROP.HP) updateHp = true
					else if (key === PROP.MP) updateMp = true
					else if (key === PROP.SP) updateSp = true

					player[key] = data[key]
				}
			}
			updateHp && bar.updateBar(PROP.HP, data)
			updateMp && bar.updateBar(PROP.MP, data)
			updateSp && bar.updateBar(PROP.SP, data)

			if (updateHp &&
				data.hp <= 0 &&
				!party.presence.isDead) {
				party.memberDied(index)
			}
		}
	}

	/**
	 * handles death actions for all party members by index
	 * @param index
	 */
	function memberDied(index) {
		// someone died
		// console.info('memberDied', index)
		if (!party.presence[index].isDead) {
			party.presence[index].isDead = true
			if (combat.lastMobHitMeName) {
				chat.log(party.presence[index].name + ' has been slain by '+ combat.lastMobHitMeName +'!', 'chat-warning')
			}
			else {
				chat.log(party.presence[index].name + ' has been slain!', 'chat-warning')
			}
			audio.playerDeath(index)
			party.txCheckWipe()
		}
	}

	/**
	 * Trigger a wipe check when a party member dies
	 */
	function txCheckWipe() {
		// console.warn('txCheckWipe')
		socket.publish('party' + my.partyId, {
			route: 'p->checkWipe',
		})
	}

	/**
	 * Triggered to determine if all party members are dead
	 * Triggers a team revival at room 0
	 */
	function rxCheckWipe() {
		if (!party.isSomeoneAlive()) {
			console.warn('TOTAL WIPE')
			if (party.presence[0].isLeader) {
				// everyone is dead and I'm the leader... kill mob attacks
				console.warn('TOTAL WIPE AND I AM LEADER')
				mob.killAllAttacks(true)
			}
			party.respawn()
		}
	}

	/**
	 * Local respawn code for each client
	 * triggered by a received rxCheckWipe to all party members
	 * Sends them to room 0 with 1 of all resources
	 */
	function respawn() {
		if (!party.hasWiped) {
			// ensure we only call this once
			party.hasWiped = true
			chat.log('The party wiped!', 'chat-warning')
			chat.log('Respawning in the safe room...', 'chat-warning')
			delayedCall(8, () => {
				party.hasWiped = false
				combat.resetTimersAndUI()
				map.endCombat(true)
				map.enterRoom(0)
				party.reviveDeadAllies()
				map.setRoom0()
				battle.go(undefined, true)
			})
		}
	}

	/**
	 * Revives all fallen allies after combat is over
	 */
	function reviveDeadAllies(isPartyWipe = true) {
		party.presence.forEach(reviveAlly)
		///////////////////////////////////
		/**
		 * revive a single ally ... if they're dead
		 * @param p
		 */
		function reviveAlly(p) {
			if (p.hp <= 0) {
				console.warn('reviveAlly!', p.row, p)
				p.isDead = false
				if (p.row === my.row) {
					// console.info('isPartyWipe', isPartyWipe)
					if (isPartyWipe) {
						my.set(PROP.HP, p.hpMax)
						my.set(PROP.MP, p.mpMax)
						my.set(PROP.SP, p.spMax)
					}
					else {
						my.set(PROP.HP, 1)
						my.set(PROP.MP, 1)
						my.set(PROP.SP, 1)
					}
				}
				else {
					if (isPartyWipe) {
						p.hp = p.hpMax
						p.mp = p.mpMax
						p.sp = p.spMax
					}
					else {
						p.hp = p.mp = p.sp = 1
					}
				}
				bar.updateBar(PROP.HP, p)
				bar.updateBar(PROP.MP, p)
				bar.updateBar(PROP.SP, p)
			}
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
					race: data.race,
					gender: data.gender,
					isChilled: false,
					isFrozen: false,
					hitCount: 0,
				});
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
			if (party.presence[index].isLeader) {
				mission.rxReturnToTown()
			}
			// console.warn('r
			// emoving party member: index', index, 'row', p.row)
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
			})
			// console.warn('length: ', party.presence.length)
			party.presence.length === 1 && getElementById('bar-name-' + my.row).classList.add('chat-gold')
		}
	}
	/**
	 * REQUESTER: party join request has been confirmed by leader
	 * @param data
	 */
	function joinConfirmed(data) {
		// console.warn('joinConfirmed', data);
		my.isLeader = party.presence[0].isLeader = false
		my.partyId = data.row
		party.listen(data.row)
		chat.log("You have joined the party.", CHAT.WARNING)
		query.resetCache()
		delayedCall(.1, () => {
			socket.publish('party' + my.partyId, {
				msg: my.name + ' has joined the party.',
				route: 'p->notifyJoin',
			})
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
		if (map.inCombat) {
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
			var index = party.presence.findIndex(p => p.name === data.name)
			removePartyMember(party.presence[index]);
			chat.log(data.name + " has been booted from the party.", CHAT.WARNING);
		}
	}
	function disband() {
		if (party.presence.length === 1) {
			chat.log('You are not in a party. Try to abandon the mission instead.', CHAT.WARNING);
		}
		else if (map.inCombat) {
			chat.log("You cannot disband the party during battle!", CHAT.WARNING);
		}
		else {
			if (party.hasMoreThanOnePlayer()) {
				my.isLeader = party.presence[0].isLeader = true;
				socket.publish('party' + my.partyId, {
					row: my.row,
					route: 'p->disband',
				});
				// stuff for disbander
				mission.inProgress && ng.msg('Mission abandoned: '+ mission.getTitle(mission.id, mission.questId))
				chat.log('You disbanded the party.')
				var i = party.maxPlayers - 1;
				for (; i > 0; i--) {
					removePartyMember(party.presence[i], i === 1);
				}
				party.listen(party.getUniquePartyChannel(true));
			}
			chat.log('Mission abandoned!', CHAT.WARNING);
			mission.rxReturnToTown();
			mission.resetLocalQuestData();
		}
	}
	function disbandReceived(data) {
		if (data.name !== my.name) {
			var index = party.getIndexByRow(data.row)
			chat.log(party.presence[index].name + " has disbanded the party.", CHAT.WARNING);
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
		if (ng.view !== 'town') {
			chat.log('You must be in town to change the party leader!', CHAT.WARNING)
			return
		}
		var id = party.getIndexByName(name)

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
		var index = party.getIndexByName(data.name)
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

	/**
	 * socket rx only
	 * Sends casting start/stop events to all party members to trigger animations
	 * @param data
	 */
	let castSpellType = ''
	function casting(data) {
		if (data.event === 'stop') {
			ask.killCastingTweens(data)
			audio.castSoundEnd(data.index, data.name, true)
		}
		else if (data.event === 'start') {
			castSpellType = data.key.split('-')[1]
			console.info('casting', data.key, data)
			if (castSpellType === 'evocation') {
				ask.castEvocation({
					index: data.index,
					key: data.key
				})
			}
			else if (castSpellType === 'conjuration') {
				ask.castConjuration({
					index: data.index,
					key: data.key
				})
			}
			else {
				ask.castAlteration({
					index: data.index,
					key: data.key
				})
			}
			audio.castSoundStart(data.index, data.name)
		}
	}

	/**
	 * returns if someone in the party is too high level for you to gain exp
	 * @type {boolean}
	 */
	let broken = false
	function expBrokenByAll() {
		broken = false
		if (my.level <= 10) {
			if (party.presence.some(p => p.level > my.level + 4)) {
				broken = true
			}
		}
		else {
			// level 20+ uses a percentage instead of a fixed penalty
			if (party.presence.some(p => p.level > my.level * 1.5)) {
				broken = true
			}
		}
		return broken
	}
})(Date, _, $);