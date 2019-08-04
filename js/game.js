// game specific data
var game;
(function() {
	/** public */
	game = {
		maxPlayers: 6,
		session: {
			timer: 0
		},
		ajax: {
			interval: 15000,
			sendTime: 0,
			receiveTime: 0
		},
		questDelay: 3000,
		start: Date.now(),
		heartbeatEnabled: true,
		upsertRoom,
		removePlayer,
		initSocket,
		heartbeatSend,
		heartbeatReceived,
		requestPresence,
		exit,
		getPingColor,
		emptyScenesExcept,
		getPetName,
	};
	/** private */
	var pingStart = 0;
	var isSocketInit = false;
	var scenes = [
		'scene-town',
		'scene-dungeon',
		'scene-battle'
	];
	var pingColors = [
		'',
		'chat-warning',
		'chat-alert'
	];
	var heartbeat = {
		timer: 0,
		sendTime: 0,
		receiveTime: 0,
		interval: 5000,
		expired: 12000,
		activate,
	};
	var played = {
		timer: 0,
		playedStart,
		playedSend,
	};
	/////////////////////////////////////////////////////
	/** public */
	function initSocket() {
		// only called once
		if (!isSocketInit) {
			isSocketInit = true;
			pingStart = Date.now();
			heartbeat.activate();
			played.playedStart();
			/*sanity.party.partyStart();
			sanity.chat.chatStart();*/
			listenWhisper();
			listenFriendAlerts();
			socket.listenGuild();
			game.requestPresence();
		}
	}
	function heartbeatSend() {
		if (game.heartbeatEnabled) {
			var time = Date.now();
			// check disconnect
			var diff = time - heartbeat.receiveTime;
			console.info("%c Socket ping: ", "background: #08f", diff + 'ms');
			if (diff > heartbeat.expired) {
				console.warn('something wrong with the socket... please investigate...');
				ng.disconnect();
			}
			else {
				var obj = {
					row: my.row,
					level: my.level,
					job: my.job,
					name: my.name
				}
				if (ng.view === 'town') {
					obj.route = 'chat->hb';
					socket.publish(chat.getChannel(), obj);
				}
				else {
					obj.route = 'party->hb';
					socket.publish('party' + my.p_id, obj);
				}
				heartbeat.sendTime = time;
			}
		}
		clearTimeout(heartbeat.timer);
		heartbeat.timer = setTimeout(heartbeatSend, heartbeat.interval);
	}
	function heartbeatReceived(data) {
		if (data.name === my.name) {
			heartbeat.receiveTime = Date.now();
			var ping = ~~((heartbeat.receiveTime - heartbeat.sendTime) / 2);
			console.info("heartbeat data: ", data);

			bar.dom.socket.innerHTML =
				'<span class="'+ getPingColor(ping) +'">' + (ping) + 'ms</span>';
			bar.updateBars(data);
		}
		upsertRoom(data);
	}
	function requestPresence() {
		socket.publish(chat.getChannel(), {
			route: 'chat->getPresence'
		});
	}
	function exit() {
		// from town
		if (heartbeat.enabled) {
			chat.publishRemove();
			if (my.p_id) {
				// boot from party
				/*
				socket.publish('party' + my.p_id, {
					id: my.row,
					name: my.name,
					route: 'party->bootme'
				});
				*/
			}
			// notify friends
			socket.publish('friend' + my.name, {
				name: my.name,
				route: 'off'
			});
			socket.connection.close();
		}
	}
	function emptyScenesExcept(scene) {
		scenes.forEach(function(v) {
			if (v === scene) {
				getById(v).style.opacity = 0;
			}
			else {
				getById(v).innerHTML = '';
			}
		});
	}
	function getPetName() {
		var s1 = [
				"Jo",
				"Ge",
				"Go",
				"Gi",
				"Ja",
				"Jo",
				"Je",
				"Ji",
				"Ka",
				"Ke",
				"Ko",
				"Ki",
				"La",
				"Le",
				"Lo",
				"Li",
				"Va",
				"Ve",
				"Vo",
				"Xa",
				"Xe",
				"Xo",
				"Za",
				"Ze",
				"Zo",
				"Bo"
			],
			s2 = [
				"bek",
				"ban",
				"bar",
				"bek",
				"bob",
				"rek",
				"rar",
				"nar",
				"ran",
				"sar",
				"sek",
				"sob",
				"n",
				"s",
				"k",
				"n"
			],
			s3 = [
				"er",
				"tik",
				"n",
				"er",
				"ab",
				""
			];

		return s1[~~(rand() * s1.length)] +
			s2[~~(rand() * s2.length)]+
			s3[~~(rand() * s3.length)];
	}

	/** private */
	function activate() {
		setTimeout(function() {
			TweenMax.to('#bar-lag', .5, {
				opacity: 1
			});
		}, heartbeat.interval);
		heartbeat.sendTime = Date.now();
		heartbeat.receiveTime = Date.now();
		clearTimeout(heartbeat.timer);
		heartbeat.timer = setTimeout(heartbeatSend, heartbeat.interval);
	}
	/*function partyStart() {
		clearInterval(sanity.party.timer);
		sanity.party.timer = setInterval(function(){
			if (my.p_id) {
				sanity.party.partySend();
				sanity.party.partyCheck();
			}
		}, 5000);
	}
	function partySend() {
		console.info("Sending party heartbeats....");
		try {
			socket.publish('party' + my.p_id, {
				id: my.row,
				route: 'party->hb'
			});
		} catch (err) {
			console.info('sanity.party.partySend', err);
		}
	}
	function partyCheck() {
		var now = Date.now(),
			linkdead = [];
		for (var i=1; i<6; i++) {
			console.info("Checking: ", my.party[i].id, now - my.party[i].heartbeat > heartbeat.interval * 2)
			if (my.party[i].id &&
				!my.party[i].linkdead &&
				(now - my.party[i].heartbeat > heartbeat.interval * 2)) {
				linkdead.push(my.party[i].name);
				my.party[i].linkdead = 1;
			}
		}
		linkdead.forEach(function(name){
			socket.publish('party' + my.p_id, {
				name: name,
				route: 'party->linkdead'
			});
		});
	}*/
	/*function chatStart() {
		clearInterval(sanity.chat.timer);
		sanity.chat.timer = setInterval(sanity.chat.chatSend, 60000);
	}*/
	/*function chatSend() {
		if (ng.view === 'town') {
			$.get(app.url + 'chat/sanity-chat.php').done(function (data) {
				for (var i = 0, len = data.players.length; i < len; i++) {
					data.players[i] *= 1;
				}
				var newChatArray = [];
				chat.presence.forEach(function (v) {
					if (!data.players.includes(v)) {
						$("#chat-player-" + v).remove();
					}
					else {
						newChatArray.push(v);
					}
				});
				if (newChatArray.length) {
					chat.presence = newChatArray;
					chat.setHeader();
				}
			});
		}
	}*/
	function playedStart() {
		clearInterval(played.timer);
		played.timer = setInterval(played.playedSend, 60000);
	}
	function playedSend() {
		$.get(app.url + 'update-played.php');
	}
	function listenWhisper() {
		socket.subscribe('name' + my.name, routeToWhisper);
	}
	function routeToWhisper(data) {
		console.info('routeToWhisper', data);
		data = data[0];
		if (data.routeTo === 'party') {
			route.party(data, data.route);
		}
		else if (data.action === 'send') {
			console.info('Sent whisper: ', data);
			// report message
			route.town(data, data.route);
			chat.lastWhisper.name = data.name;
			// callback to sender
			$.post(app.url + 'chat/send.php', {
				action: 'receive',
				msg: chat.whisperParse(data.msg),
				class: 'chat-whisper',
				category: 'name' + _.toLower(data.name)
			});
		}
		// receive pong
		else if (data.action === 'receive') {
			if (!chat.lastWhisper.name) {
				chat.lastWhisper = {
					name: data.name
				}
			}
			data.msg = chat.whisperTo(data) + chat.whisperParse(data.msg);
			route.town(data, 'chat->log');
		}
		// guild invite
		else if (data.action === 'guild-invite') {
			console.info("guild invite received! ", data);
			chat.promptAdd(data);
		}
		// party invite
		else if (data.action === 'party-invite') {
			console.info("party invite received! ", data);
			chat.promptAdd(data);
		}
		else if (data.action === 'party-invite-deny') {
			chat.log(data.name + " has denied your party invite.", 'chat-warning');
		}
		else if (data.action === 'guild-invite-deny') {
			chat.log(data.name + " has denied your guild invite.", 'chat-warning');
		}
		else if (data.action === 'party-accept') {
			chat.log(data.name + " has joined the party.", 'chat-warning');
		}
		else if (data.route === 'friend>addedMe') {
			chat.log(data.name + " has added you to their friend list.", 'chat-warning');
		}
	}
	function listenFriendAlerts() {
		ng.friends.forEach(function(v){
			socket.unsubscribe('friend' + v);
			socket.subscribe('friend' + v, chat.friendNotify);
		});
	}
	function upsertRoom(player) {
		var time = Date.now();
		var index = _.findIndex(chat.presence, { row: player.row });
		if (index >= 0) {
			// update
			console.warn('updating player time', time);
			chat.presence[index].time = time;
			console.info('updating player time');
		}
		else {
			// add
			console.warn('adding player', player);
			chat.presence.push({
				row: player.row,
				job: player.job,
				level: player.level,
				name: player.name,
				time: time
			});
			var el = createElement('div');
			el.id = 'chat-player-' + player.row;
			el.innerHTML =
				'<span class="chat-player">' +
					'['+ player.level +':<span class="chat-'+ player.job +'">'+ player.name +'</span>]' +
				'</span>';
			chat.dom.chatRoom.appendChild(el);
		}
		auditRoom(time);
		chat.setHeader();
	}
	function auditRoom(time) {
		chat.presence.forEach(function(player) {
			var diff = time - player.time;
			if (diff > heartbeat.expired) {
				removePlayer(player);
			}
			console.info('diff', diff);
		})
	}
	function removePlayer(v) {
		console.info('removing player: ', v.row);
		var index = _.findIndex(chat.presence, { row: v.row });
		_.pullAt(chat.presence, [ index ]);
		var el = getById('chat-player-' + v.row);
		el !== null && el.parentNode.removeChild(el);
		chat.setHeader();
	}
	function getPingColor(ping) {
		var index;
		if (ping < 150) {
			index = 0;
		}
		else if (ping < 350) {
			index = 1;
		}
		else {
			index = 2;
		}
		return pingColors[index];
	}
})();