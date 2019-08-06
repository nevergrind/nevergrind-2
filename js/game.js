// game specific data
var game;
(function() {
	/** public */
	game = {
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
		heartbeatReceivedParty,
		heartbeatTimeout,
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
			whisper.listen();
			party.listen(my.row);
			listenFriendAlerts();
			guild.listen();
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
				};
				if (ng.view === 'town') {
					obj.route = 'chat->hb';
					socket.publish(chat.getChannel(), obj);
				}
				if (my.partyCount() > 1 || ng.view !== 'town') {
					// don't broadcast if it's just me in town
					// always broadcast while out of town
					obj.route = 'party->hb';
					socket.publish('party' + my.p_id, Object.assign(obj,
						_.pick(party.presence[0], [
							'hp', 'maxHp', 'mp', 'maxMp', 'isLeader'
						])
					));
				}
				heartbeat.sendTime = time;
			}
		}
		heartbeatTimeout();
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
	function heartbeatReceivedParty(data) {
		console.info('%c party heartbeat.receive id:', "background: #0ff", data);
		heartbeat.receiveTime = Date.now();
		var index = 0;
		// check everyone except me
		party.presence.forEach(function(v, i) {
			if (i && v.id === party.presence[i].id) {
				index = i;
			}
		})
		if (index) {
			my.updateHeartbeat(index);
		}
	}
	function heartbeatTimeout() {
		clearTimeout(heartbeat.timer);
		heartbeat.timer = setTimeout(heartbeatSend, heartbeat.interval);
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
		heartbeatTimeout();
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
			console.info("Checking: ", party.presence[i].id, now - party.presence[i].heartbeat > heartbeat.interval * 2)
			if (party.presence[i].id &&
				!party.presence[i].linkdead &&
				(now - party.presence[i].heartbeat > heartbeat.interval * 2)) {
				linkdead.push(party.presence[i].name);
				party.presence[i].linkdead = 1;
			}
		}
		linkdead.forEach(function(name){
			socket.publish('party' + my.p_id, {
				name: name,
				route: 'party->linkdead'
			});
		});
	}*/
	function playedStart() {
		clearInterval(played.timer);
		played.timer = setInterval(played.playedSend, 60000);
	}
	function playedSend() {
		$.get(app.url + 'update-played.php');
	}
	function listenFriendAlerts() {
		ng.friends.forEach(function(v){
			socket.unsubscribe('friend' + v);
			socket.subscribe('friend' + v, friend.notify);
		});
	}
	function upsertRoom(player) {
		var time = Date.now();
		var index = _.findIndex(chat.presence, { row: player.row });
		if (index >= 0) {
			// update
			chat.presence[index].time = time;
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