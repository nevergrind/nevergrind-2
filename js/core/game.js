// game specific data
var game;
(function(TweenMax, clearTimeout, setTimeout, _, $, localStorage, undefined) {
	/** public */
	game = {
		maxTimeout: app.isApp ? 18000 : 18000,
		session: {
			timer: 0
		},
		pingHistory: [],
		start: Date.now(),
		upsertRoom,
		removePlayer,
		initSocket,
		heartbeatSend,
		heartbeatReceived,
		heartbeatReceivedParty,
		getPresence,
		showScene,
		getPetName,
		played,
		getCachedMinutes,
		initPlayedCache,
		updateChat,
		updateParty,
		txPartyResources,
		toPlaytime,
	};
	/** private */
	var pingStart = 0;
	var isSocketInit = false;
	var heartbeat = {
		timer: new delayedCall(0, ''),
		sendTime: 0,
		receiveTime: 0,
		interval: 5,
		activate,
	}
	const scenes = ['#scene-town', '#scene-dungeon', '#scene-battle']
	const filterBrightnessDark = { filter: 'brightness(0)' }
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
	let partyData
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
			updateParty()
			guild.listen();
			game.getPresence();
		}
	}
	function heartbeatTick() {
		heartbeatSend()
		heartbeatTimeout()
	}
	function heartbeatSend() {
		time = Date.now();
		if (time - ng.clearConsoleTime > 1800000) {
			ng.clearConsoleTime = time
			// console.clear()
		}
		// check disconnect
		diff = time - heartbeat.receiveTime;
		if (diff > game.maxTimeout) {
			// console.warn('something wrong with the socket... please investigate...');
			ng.disconnect();
		}
		else {
			// insert regen tick logic here

			my.resourceTick(PROP.HP)
			my.resourceTick(PROP.MP)
			my.resourceTick(PROP.SP)
			if (ng.view === 'battle') {
				mob.resourceTick()
			}

			if (ng.view === 'town') {
				updateChat()
			}
			// party traffic
			updateParty()
			// console.info("%c heartbeatSend:", "background: #1e1", diff + 'ms');

			heartbeat.sendTime = time;
		}
	}
	function updateChat() {
		obj = {
			row: my.row,
			level: my.level,
			job: my.job,
			name: my.name,
			route: 'chat->hb',
		}
		socket.publish(chat.getChannel(), obj, true)
		upsertRoom(obj)
	}
	function updateParty() {
		obj = {
			route: 'p->hb',
			row: my.row,
			level: my.level,
			job: my.job,
			name: my.name,
			isLeader: typeof party.presence[0] === 'object' ? party.presence[0].isLeader : true
		}
		partyData = {
			...obj,
			..._.pick(my, KEYS.PARTY_PROPS)
		}
		socket.publish('party' + my.partyId, partyData)
	}
	function txPartyResources(changedResourceObj) {
		// broadcast health update for party member and animate attack
		if (party.hasMoreThanOnePlayer()) {
			partyData = {
				route: 'p->HP',
				row: my.row,
				...changedResourceObj
			}
			socket.publish('party' + my.partyId, partyData, true)
		}
	}
	function heartbeatTimeout() {
		clearTimeout(heartbeat.timer)
		heartbeat.timer = setTimeout(heartbeatTick, heartbeat.interval * 1000)
	}
	function heartbeatReceived(data) {
		/*if (data.name === my.name) {
			// console.info("%c town heartbeatReceived: ", "background: #025", data.name, data);
			// console.info('socket rx', socket.published, socket.received)
			heartbeat.receiveTime = Date.now();
			ping = ~~((heartbeat.receiveTime - heartbeat.sendTime) / 2);
			bar.updatePing(ping);
		}*/
		upsertRoom(data)
	}
	function heartbeatReceivedParty(data) {
		// console.info('%c party' + my.partyId + ' heartbeatReceivedParty', "background: #048", data.name, data);
		if (data.name === my.name) {
			heartbeat.receiveTime = Date.now();
			ping = ~~((heartbeat.receiveTime - heartbeat.sendTime) / 2);
			bar.updatePing(ping);
		}
		party.upsertParty(data);
	}
	function getPresence() {
		socket.publish(chat.getChannel(), {
			route: 'chat->getPresence'
		});
	}
	function upsertRoom(player) {
		// console.info('upsertRoom', player)
		time = Date.now();
		index = _.findIndex(chat.presence, { row: player.row });
		if (index >= 0) {
			// update
			chat.presence[index].time = time;
		}
		else {
			// add
			// console.warn('adding player', player);
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
				'<span data-row="'+ player.row +'" data-name="'+ player.name +'" class="chat-player">' +
					'['+ player.level +':<span class="chat-'+ player.job +'">'+ player.name +'</span>]' +
				'</span>';
			query.el('#chat-room').appendChild(el);
		}
		auditRoom(time);
		chat.setHeader();
	}
	function auditRoom(time) {
		chat.presence.forEach(function(player) {
			diff = time - player.time;
			if (diff > game.maxTimeout) {
				removePlayer(player);
			}
		})
	}
	function removePlayer(player) {
		// console.info('removing player: ', player.row);
		index = _.findIndex(chat.presence, { row: player.row });
		_.pullAt(chat.presence, [ index ]);
		el = getElementById('chat-player-' + player.row);
		el !== null && el.parentNode.removeChild(el);
		chat.setHeader();
	}
	function showScene(currentScene) {
		TweenMax.set('#sky-wrap', filterBrightnessDark)
		scenes.forEach(v => {
			if (v === '#' + currentScene) {
				// this is the new scene - prep fading in
				querySelector(v).style.filter = 'brightness(0)'
			}
			else {
				// not the new scene
				/*if (v === '#scene-town' &&
					currentScene !== 'town') {
					querySelector(v).innerHTML = ''
				}*/
			}
		})
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
		delayedCall(heartbeat.interval, () => {
			TweenMax.to('#bar-lag', .5, {
				opacity: 1
			});
		});
		heartbeat.sendTime = Date.now()
		heartbeat.receiveTime = Date.now()
		heartbeatTimeout()
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
			chat.log("Character created: " + toCreateString(r.created), CHAT.WARNING)
			chat.log("Total character playtime: " + game.toPlaytime(r.playtime), 'chat-whisper')
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
	function initPlayedCache() {
		game.storageId = 'played' + my.row;
		if (localStorage.getItem(game.storageId) === null) {
			localStorage.setItem(game.storageId, 0);
		}
	}
})(TweenMax, clearTimeout, setTimeout, _, $, localStorage);