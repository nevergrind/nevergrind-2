// game specific data
var game;
(function() {
	/** public */
	game = {
		heartbeatDifference: app.isApp ? 18000 : 18000,
		session: {
			timer: new delayedCall(0, '')
		},
		pingHistory: [],
		questDelay: 3,
		start: Date.now(),
		heartbeatEnabled: true,
		upsertRoom,
		removePlayer,
		initSocket,
		heartbeatSend,
		heartbeatReceived,
		heartbeatReceivedParty,
		getPresence,
		emptyScenesExcept,
		getPetName,
		played,
		getCachedMinutes,
		initPlayedCache,
	};
	/** private */
	var pingStart = 0;
	var isSocketInit = false;
	var scenes = [
		'scene-town',
		'scene-dungeon',
		'scene-battle'
	];
	var heartbeat = {
		timer: new delayedCall(0, ''),
		sendTime: 0,
		receiveTime: 0,
		interval: 5000,
		activate,
	};
	function initPlayedCache() {
		game.storageId = 'played' + my.row;
		if (localStorage.getItem(game.storageId) === null) {
			localStorage.setItem(game.storageId, 0);
		}
	}
	var played = {
		timer: new delayedCall(0, ''),
		interval: 60000
	};
	// pooled variables
	var time;
	var index;
	var diff;
	var obj;
	var ping;
	var el;
	/////////////////////////////////////////////////////
	/** public */
	function initSocket() {
		// only called once
		if (!isSocketInit) {
			isSocketInit = true;
			pingStart = Date.now();
			heartbeat.activate();
			playedStart();
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
			if (diff > game.heartbeatDifference) {
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
			console.info("%c town heartbeatReceived: ", "background: #0bf", data.name, data);
			heartbeat.receiveTime = Date.now();
			ping = ~~((heartbeat.receiveTime - heartbeat.sendTime) / 2);
			bar.updatePing(ping);
		}
		upsertRoom(data);
	}
	function heartbeatReceivedParty(data) {
		console.info('%c party' + my.partyId + ' heartbeatReceivedParty', "background: #0ff", data.name, data);
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
			if (diff > game.heartbeatDifference) {
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
	function emptyScenesExcept(scene) {
		scenes.forEach(function(v) {
			if (v === scene) {
				getById(v).style.opacity = 0;
			}
			else {
				getById(v).innerHTML = '';
			}
		});
		$('#town-bg').remove()
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
		delayedCall(heartbeat.interval, function() {
			TweenMax.to('#bar-lag', .5, {
				opacity: 1
			});
		});
		heartbeat.sendTime = Date.now();
		heartbeat.receiveTime = Date.now();
		heartbeatTimeout();
	}
	function listenFriendAlerts() {
		ng.friends.forEach(function(v){
			socket.unsubscribe('friend' + v);
			socket.subscribe('friend' + v, friend.notify);
		});
	}
	function playedStart() {
		clearInterval(played.timer);
		played.timer = setInterval(playedSend, played.interval);
	}
	function playedSend() {
		updateCachedMinutes()
		$.get(app.url + 'ping.php')
	}
	function played() {
		$.post(app.url + 'chat/played.php', {
			minutes: getCachedMinutes()
		}).done(function(r) {
			chat.log("Character created: " + toCreateString(r.created), 'chat-warning')
			chat.log("Total character playtime: " + toPlaytime(r.playtime), 'chat-whisper')
			localStorage.setItem(game.storageId, 0)
		});
	}
	function updateCachedMinutes() {
		localStorage.setItem(game.storageId, getCachedMinutes() + 1)
	}
	function getCachedMinutes() {
		return +localStorage.getItem(game.storageId);

	}
	function toCreateString(d) {
		d = new Date(d);
		return d.toDateString() + ' ' + d.toLocaleTimeString();
	}
	function toPlaytime(minLeft) {
		var d = 0,
			h = 0;

		if (minLeft >= 1440) {
			d = floor(minLeft / 1440);
			minLeft = (minLeft % 1440);
		}
		if (minLeft >= 60) {
			h = floor(minLeft / 60);
			minLeft = (minLeft % 60);
		}
		var m = minLeft,
			dayStr = '',
			hourStr = '',
			minStr = '';
		if (d) {
			dayStr += d + (d > 1 ? ' days' : ' day');
		}
		if (h) {
			hourStr += h + (h > 1 ? ' hours' : ' hour');
		}
		// minutes
		minStr = m;
		if (m !== 1) {
			minStr += ' minutes';
		}
		else {
			minStr += ' minute';
		}

		if (d && h && m) {
			dayStr += ', ';
		}
		else if (d) {
			dayStr += ' ';
		}

		if (h) {
			hourStr += ', ';
		}

		if (d || h) {
			minStr = 'and ' + minStr;
		}
		return dayStr + hourStr + minStr;
	}
})();