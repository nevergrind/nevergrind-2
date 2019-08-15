// game specific data
var game;
(function() {
	/** public */
	game = {
		heartbeatExpired: app.isApp ? 12000 : 12000,
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
		getPresence,
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
	// pooled variables
	var time;
	var index;
	var diff;
	var obj;
	var ping;
	var i;
	var len;
	var el;
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
			listenFriendAlerts();
			guild.listen();
			game.getPresence();
		}
	}
	function heartbeatSend() {
		if (game.heartbeatEnabled) {
			time = Date.now();
			// check disconnect
			diff = time - heartbeat.receiveTime;
			if (diff > game.heartbeatExpired) {
				console.warn('something wrong with the socket... please investigate...');
				ng.disconnect();
			}
			else {
				obj = {
					row: my.row,
					level: my.level,
					job: my.job,
					name: my.name
				};
				if (ng.view === 'town') {
					// town chat traffic
					obj.route = 'chat->hb';
					socket.publish(chat.getChannel(), obj);
				}
				// party traffic
				obj.route = 'party->hb';
				obj.isLeader = typeof party.presence[0] === 'object' ? party.presence[0].isLeader : true;
				socket.publish('party' + my.partyId, Object.assign(obj,
					_.pick(my, [
						'name', 'hp', 'maxHp', 'mp', 'maxMp', 'job', 'partyId'
					])
				));
				console.info("%c heartbeatSend:", "background: #1e1", diff + 'ms');

				heartbeat.sendTime = time;
			}
		}
		heartbeatTimeout();
	}
	function heartbeatReceived(data) {
		if (data.name === my.name) {
			console.info("%c town heartbeatReceived: ", "background: #0bf", data);
			heartbeat.receiveTime = Date.now();
			ping = ~~((heartbeat.receiveTime - heartbeat.sendTime) / 2);
			bar.updatePing(ping);
		}
		upsertRoom(data);
	}
	function heartbeatReceivedParty(data) {
		console.info('%c party' + my.partyId + ' heartbeatReceivedParty', "background: #0ff", data);
		if (data.name === my.name) {
			heartbeat.receiveTime = Date.now();
			ping = ~~((heartbeat.receiveTime - heartbeat.sendTime) / 2);
			bar.updatePing(ping);
		}
		party.upsertParty(data);
	}
	function heartbeatTimeout() {
		clearTimeout(heartbeat.timer);
		heartbeat.timer = setTimeout(heartbeatSend, heartbeat.interval);
	}
	function getPresence() {
		socket.publish(chat.getChannel(), {
			route: 'chat->getPresence'
		});
	}
	function upsertRoom(player) {
		time = Date.now();
		index = _.findIndex(chat.presence, { row: player.row });
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
			diff = time - player.time;
			if (diff > game.heartbeatExpired) {
				removePlayer(player);
			}
		})
	}
	function removePlayer(player) {
		console.info('removing player: ', player.row);
		index = _.findIndex(chat.presence, { row: player.row });
		_.pullAt(chat.presence, [ index ]);
		el = getById('chat-player-' + player.row);
		el !== null && el.parentNode.removeChild(el);
		chat.setHeader();
	}
	function exit() {
		// from town
		if (heartbeat.enabled) {
			chat.publishRemove();
			if (party.presence.length > 1) {
				// boot from party
				/*
				socket.publish('party' + my.partyId, {
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
			if (party.presence.length > 1) {
				sanity.party.partySend();
				sanity.party.partyCheck();
			}
		}, 5000);
	}
	function partySend() {
		console.info("Sending party heartbeats....");
		try {
			socket.publish('party' + my.partyId, {
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
			socket.publish('party' + my.partyId, {
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