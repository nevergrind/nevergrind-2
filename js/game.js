// game specific data
var game;
(function() {
	game = {
		maxPlayers: 6,
		init: 0,
		session: {
			timer: 0
		},
		questDelay: 3000,
		pingColors: [
			'',
			'chat-warning',
			'chat-alert'
		],
		start: Date.now(),
		scenes: [
			'scene-town',
			'scene-dungeon',
			'scene-battle'
		],
		heartbeat: {
			enabled: 1,
			timer: 0,
			success: 0,
			fails: 0,
			successiveFails: 0,
			attempts: 0,
		},
		socket: {
			timer: 0,
			checkTimer: 0,
			sendTime: 0,
			receiveTime: 0,
			interval: 5000,
			expired: 16000,
			start: socketStart,
			send: socketSend,
			checkTimeout: socketCheckTimeout,
			heartbeatCallback: socketHeartbeatCallback,
		},
		played: {
			timer: 0,
			start: playedStart,
			send: playedSend,
		},
		oneWay: oneWay,
		roundTrip: roundTrip,
		pingColor: pingColor,
		start: start,
		updateChatRoomStart: updateChatRoomStart,
		heartbeatStart: heartbeatStart,
		heartbeatSend: heartbeatSend,
		heartbeatCallbackFail: heartbeatCallbackFail,
		sanity: {
			party: {
				timer: 0,
				start: partyStart,
				send: partySend,
				check: partyCheck,
			},
			chat: {
				timer: 0,
				start: chatStart,
				send: chatSend,
			}
		},
		exit: exit,
		resync: resync,
		emptyScenesExcept: emptyScenesExcept,
		getPetName: getPetName,
	}
	///////////////////////////////////////////////
	function oneWay() {
		return ~~((Date.now() - game.pingStart) / 2);
	}
	function roundTrip() {
		return Date.now() - game.pingStart;
	}
	function pingColor(ping) {
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
		return game.pingColors[index];
	}
	function start() {
		// only called once
		if (!game.init) {
			game.init = 1;
			clearTimeout(game.session.timer);
			game.updateChatRoomStart();
			game.heartbeatStart();
			game.socket.start();
			game.played.start();
			game.sanity.party.start();
			game.sanity.chat.start();
		}
	}
	function updateChatRoomStart() {
		setInterval(chat.updateChannel, 15000);
	}
	function heartbeatStart() {
		game.pingStart = Date.now();
		$.ajax({
			type: 'GET',
			url: app.url + 'server/heartbeat-first.php'
		}).done(function (data) {
			data.name = my.name;
			game.heartbeat.timer = setTimeout(game.heartbeatSend, 5000);
			bar.updateBars(data);
		});
	}
	function heartbeatSend() {
		console.info("%c Last heartbeat interval: ", "background: #ff0", Date.now() - game.pingStart +'ms');
		game.pingStart = Date.now();
		clearTimeout(game.heartbeat.timer);
		if (game.heartbeat.enabled) {
			$.ajax({
				type: 'GET',
				url: app.url + 'server/heartbeat.php'
			}).done(function (data) {
				game.heartbeat.success++;
				if (game.heartbeat.successiveFails) {
					// this does nothing right now, but maybe later?!
					game.resync();
				}
				game.heartbeat.successiveFails = 0;
				console.info("heartbeat data: ", data);
				data.name = my.name;
				bar.updateBars(data);
			}).fail(function(data){
				game.heartbeatCallbackFail(data);
			}).always(function() {
				game.heartbeat.timer = setTimeout(game.heartbeatSend, 5000);
				game.heartbeat.attempts++;
				var ping = game.pingoneWay();
				console.info("%c Ping: ", 'background: #0f0', ping +'ms', "Ratio: " + ((game.heartbeat.success / game.heartbeat.attempts)*100) + "%");

				bar.dom.ping.innerHTML =
					'<span class="'+ game.pingColor(ping) +'">' + (ping) + 'ms</span>';
			});
		}
		else {
			game.heartbeatCallbackFail({
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
	function socketStart() {
		setTimeout(function() {
			TweenMax.to('#bar-lag', .5, {
				opacity: 1
			});
		}, game.socket.interval);
		game.socket.sendTime = Date.now();
		game.socket.receiveTime = Date.now();
		clearInterval(game.socket.checkTimer);
		game.socket.checkTimer = setInterval(game.socket.checkTimeout, game.socket.interval);
		clearInterval(game.socket.timer);
		game.socket.timer = setInterval(game.socket.send, game.socket.interval);
	}
	function socketSend() {
		// console.info("%c Last socket send: ", "background: #0ff", Date.now() - game.socket.sendTime);
		game.socket.sendTime = Date.now();
		socket.publish('hb:' + my.name, {});
	}
	function socketCheckTimeout() {
		// longer than interval plus checkTolerance? disconnect (failed 2x)
		var diff = Date.now() - game.socket.receiveTime;

		console.info("%c Socket ping: ", "background: #08f", diff + 'ms');
		if (diff > game.socket.expired) {
			ng.disconnect();
		}
	}
	function socketHeartbeatCallback() {
		game.socket.receiveTime = Date.now();
		var ping = game.socket.receiveTime - game.socket.sendTime;
		bar.dom.socket.innerHTML =
			'<span class="'+ game.pingColor(ping) +'">' + (ping) + 'ms</span>';
	}
	function playedStart() {
		clearInterval(game.played.timer);
		game.played.timer = setInterval(game.played.send, 60000);
	}
	function playedSend() {
		$.ajax({
			type: 'GET',
			url: app.url + 'server/update-played.php'
		}).always(function(){
			!app.isLocal && console.clear();
		});
	}
	function partyStart() {
		clearInterval(game.sanity.party.timer);
		game.sanity.party.timer = setInterval(function(){
			if (my.p_id) {
				game.sanity.party.send();
				game.sanity.party.check();
			}
		}, 5000);
	}
	function partySend() {
		console.info("Sending party heartbeats....");
		try {
			socket.publish('party:' + my.p_id, {
				id: my.row,
				route: 'party->hb'
			});
		} catch (err) {
			console.info('sanity.party.send', err);
		}
	}
	function partyCheck() {
		var now = Date.now(),
			linkdead = [];
		for (var i=1; i<6; i++) {
			console.info("Checking: ", my.party[i].id, now - my.party[i].heartbeat > game.socket.interval * 2)
			if (my.party[i].id &&
				!my.party[i].linkdead &&
				(now - my.party[i].heartbeat > game.socket.interval * 2)) {
				linkdead.push(my.party[i].name);
				my.party[i].linkdead = 1;
			}
		}
		linkdead.forEach(function(name){
			socket.publish('party:' + my.p_id, {
				name: name,
				route: 'party->linkdead'
			});
		});
	}
	function chatStart() {
		clearInterval(game.sanity.chat.timer);
		game.sanity.chat.timer = setInterval(game.sanity.chat.send, 60000);
	}
	function chatSend() {
		if (ng.view === 'town') {
			$.ajax({
				type: 'GET',
				url: app.url + 'server/chat/sanity-chat.php'
			}).done(function (data) {
				for (var i = 0, len = data.players.length; i < len; i++) {
					data.players[i] *= 1;
				}
				var newChatArray = [];
				chat.inChannel.forEach(function (v) {
					if (!~data.players.indexOf(v)) {
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
		if (socket.enabled) {
			chat.broadcastRemove();
			if (my.p_id) {
				// boot from party
				/*
				socket.publish('party:' + my.p_id, {
					id: my.row,
					name: my.name,
					route: 'party->bootme'
				});
				*/
			}
			// notify friends
			socket.publish('friend:' + my.name, {
				name: my.name,
				route: 'off'
			});
			socket.session.close();
		}
	}
	function resync() {
		// do nothing!
	}
	function emptyScenesExcept(scene) {
		game.scenes.forEach(function(v) {
			if (v === scene) {
				document.getElementById(v).style.opacity = 0;
			}
			else {
				document.getElementById(v).innerHTML = '';
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

		return s1[~~(Math.random() * s1.length)] +
			s2[~~(Math.random() * s2.length)]+
			s3[~~(Math.random() * s3.length)];
	}
})();