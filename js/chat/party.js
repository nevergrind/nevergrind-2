var party;
(function() {
	party = {
		prefix: (sessionStorage.getItem('reloads') ? +sessionStorage.getItem('reloads') : 1),
		presence: [],
		maxPlayers: 6,
		getUniquePartyChannel,
		missionUpdate,
		length,
		upsertParty,
		isSoloOrLeading,
		notifyMissionStatus,
		listen,
		promotePlayer,
		invite,
		join,
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
	function listen(row) {
		// unsub to current party?
		socket.unsubscribe('party'+ my.partyId);
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
			router.town(data, data.route);
		}
		else {
			router.party(data, data.route);
		}
	}
	function upsertParty(data) {
		console.info('upsertParty', data);
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
				bar.addPlayerBar(party.presence.length - 1);
				bar.updatePlayerBar(data);
			}
			else {
				// broadcast and reject join with a boot
			}
		}
		auditParty(time);
	}
	function auditParty(time) {
		i=0;
		len=party.presence.length;
		for (; i<len; i++) {
			diff = time - party.presence[i].time;
			if (diff > game.heartbeatExpired) {
				removePartyMember(party.presence[i]);
			}
		}
	}
	function removePartyMember(player) {
		console.warn('removing party member: ', player.row);
		index = _.findIndex(party.presence, { row: player.row });
		_.pullAt(party.presence, [ index ]);
		bar.dom[index].playerWrap.style.display = 'none';
	}
	function getUniquePartyChannel() {
		return +(party.prefix + '0' + my.row);
	}
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
	function join(data) {
		// clicked CONFIRM
		console.info('party.join: ', data);
		my.isLeader = party.presence[0].isLeader = false;
		my.partyId = data.row;
		party.listen(data.row);
		socket.publish('party' + my.partyId, {
			msg: my.name + ' has joined the party.',
			route: 'party->join',
		});
		chat.log("You have joined the party.", "chat-warning");
		game.heartbeatSend();
		bar.getPresence();
	}
	function parse(msg) { // 2-part upper case
		var a = msg.replace(/ +/g, " ").split(" ");
		return a[1] === undefined ?
			'' : (a[1][0].toUpperCase() + a[1].substr(1).toLowerCase()).trim();
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
				bar.disband();
				mission.abort();
			}).fail(function(r) {
				chat.log(r.responseText, 'chat-warning');
			}).always(function() {
				ng.unlock();
			});
		}
	}
	function boot(name, bypass) {
		console.info('/promote ', name, bypass);
		// must be leader or bypass by auto-election when leader leaves
		var id = my.getPartyMemberIdByName(name);
		if ((party.presence[0].isLeader || bypass) && my.partyId && id) {
			$.post(app.url + 'chat/boot.php', {
				name: _.toLower(name),
				id: id
			}).done(function (data) {
				console.info('boot ', data);
			}).fail(function (r) {
				chat.log(r.responseText, 'chat-warning');
			});
		}
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
	function length() {
		var count = 0;
		party.presence.forEach(function(v) {
			if (v.name) count++;
		});
		return count;
	}
	function isSoloOrLeading() {
		var leading = 0;
		var partyLen = party.length();
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
	function promotePlayer() {
		if (party.length() > 1) {
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
})();