// game specific data
var game;
(function() {
	/** public */
	game = {
		maxPlayers: 6,
		session: {
			timer: 0
		},
		questDelay: 3000,
		start: Date.now(),
		heartbeat: {
			enabled: 1,
			timer: 0,
			success: 0,
			fails: 0,
			successiveFails: 0,
			attempts: 0,
		},
		initSocket,
		heartbeatListen,
		exit,
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
	var sanity = {
		party: {
			timer: 0,
			partyStart,
			partySend,
			partyCheck,
		},
		chat: {
			timer: 0,
			chatStart,
			chatSend,
		}
	};
	var gameSocket = {
		timer: 0,
		sendTime: 0,
		receiveTime: 0,
		interval: 5000,
		expired: 16000,
		activate,
		heartbeatCallback,
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
			clearTimeout(game.session.timer);
			updateChatRoomStart();
			heartbeatStart();
			gameSocket.activate();
			played.playedStart();
			sanity.party.partyStart();
			sanity.chat.chatStart();
		}
	}
	function heartbeatListen() {
		socket.subscribe('hb' + my.name, heartbeatCallback);
	}
	function heartbeatSend() {
		console.info("%c Last heartbeat interval: ", "background: #ff0", Date.now() - pingStart +'ms');
		pingStart = Date.now();
		clearTimeout(game.heartbeat.timer);

		if (game.heartbeat.enabled) {
			$.get(app.url + 'heartbeat.php').done(function (data) {
				game.heartbeat.success++;
				if (game.heartbeat.successiveFails) {
					// this does nothing right now, but maybe later?!
					resync();
				}
				game.heartbeat.successiveFails = 0;
				console.info("heartbeat data: ", data);
				data.name = my.name;
				bar.updateBars(data);
			}).fail(heartbeatCallbackFail)
				.always(function() {
				game.heartbeat.timer = setTimeout(heartbeatSend, 5000);
				game.heartbeat.attempts++;
				var ping = ~~((Date.now() - pingStart) / 2);

				console.info("%c Ping: ", 'background: #0f0', ping +'ms', "Ratio: " + ((game.heartbeat.success / game.heartbeat.attempts)*100) + "%");

				bar.dom.ping.innerHTML =
					'<span class="'+ getPingColor(ping) +'">' + (ping) + 'ms</span>';
			});
		}
		else {
			heartbeatCallbackFail({
				responseText: "You failed to find your way back to town."
			});
		}
	}
	function heartbeatCallbackFail(data) {
		console.info('%c heartbeatCallback', 'background: #f00', data.responseText);
		game.heartbeat.fails++;
		game.heartbeat.successiveFails++;
		game.heartbeat.successiveFails > 1 && ng.disconnect(data.responseText);
	}
	function activate() {
		setTimeout(function() {
			TweenMax.to('#bar-lag', .5, {
				opacity: 1
			});
		}, gameSocket.interval);
		gameSocket.sendTime = Date.now();
		gameSocket.receiveTime = Date.now();
		clearInterval(gameSocket.timer);
		gameSocket.timer = setInterval(socketSend, gameSocket.interval);
	}
	function socketSend() {
		checkDiscoTimer();
		// console.info("%c Last socket send: ", "background: #0ff", Date.now() - gameSocket.sendTime);
		gameSocket.sendTime = Date.now();
		socket.publish('hb' + my.name, {});
	}
	function checkDiscoTimer() {
		// longer than interval plus checkTolerance? disconnect (failed 2x)
		var diff = Date.now() - gameSocket.receiveTime;

		console.info("%c Socket ping: ", "background: #08f", diff + 'ms');
		if (diff > gameSocket.expired) {
			console.warn('something wrong with the socket... please investigate...');
			ng.disconnect();
		}
	}
	function heartbeatCallback() {
		gameSocket.receiveTime = Date.now();
		var ping = gameSocket.receiveTime - gameSocket.sendTime;
		bar.dom.socket.innerHTML =
			'<span class="'+ getPingColor(ping) +'">' + (ping) + 'ms</span>';
	}
	function playedStart() {
		clearInterval(played.timer);
		played.timer = setInterval(played.playedSend, 60000);
	}
	function playedSend() {
		$.get(app.url + 'update-played.php');
	}
	function partyStart() {
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
			console.info("Checking: ", my.party[i].id, now - my.party[i].heartbeat > gameSocket.interval * 2)
			if (my.party[i].id &&
				!my.party[i].linkdead &&
				(now - my.party[i].heartbeat > gameSocket.interval * 2)) {
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
	}
	function chatStart() {
		clearInterval(sanity.chat.timer);
		sanity.chat.timer = setInterval(sanity.chat.chatSend, 60000);
	}
	function chatSend() {
		if (ng.view === 'town') {
			$.get(app.url + 'chat/sanity-chat.php').done(function (data) {
				for (var i = 0, len = data.players.length; i < len; i++) {
					data.players[i] *= 1;
				}
				var newChatArray = [];
				chat.inChannel.forEach(function (v) {
					if (!data.players.includes(v)) {
						$("#chat-player-" + v).remove();
					}
					else {
						newChatArray.push(v);
					}
				});
				if (newChatArray.length) {
					chat.inChannel = newChatArray;
					chat.setHeader();
				}
			});
		}
	}
	function exit() {
		// from town
		if (gameSocket.enabled) {
			chat.broadcastRemove();
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
	function heartbeatStart() {
		pingStart = Date.now();
		$.get(app.url + 'heartbeat-first.php').done(function (data) {
			data.name = my.name;
			game.heartbeat.timer = setTimeout(heartbeatSend, 5000);
			bar.updateBars(data);
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
	function updateChatRoomStart() {
		setInterval(chat.updateChannel, 15000);
	}
	function resync() {
		// do nothing!
	}
})();