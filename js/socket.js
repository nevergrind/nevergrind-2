var socket;
(function() {
	socket = {
		connection: void 0,
		enabled: 0,
		initialConnection: 1,
		subs: {}, // active channel subscriptions - required to unsub
		subscribe: subscribe,
		unsubscribe: unsubscribe,
		publish: publish,
		registerSubscription: registerSubscription,
		hello: hello,
		joinGame: joinGame,
		initWhisper: initWhisper,
		init: init,
		connectionSuccess: connectionSuccess,
		connectionFailure: connectionFailure,
		routeMainChat: routeMainChat,
		initFriendAlerts: initFriendAlerts,
		initParty: initParty,
		initGuild: initGuild,
	}
	////////////////////////////////////////
	function subscribe(topic, callback) {
		if (typeof socket.subs[topic] !== 'object' ||
			!socket.subs[topic].active) {
			socket.session.subscribe(topic, callback).then(registerSubscription);
		}
	}
	function publish(topic, obj, excludeMe) {
		console.info(topic, obj, excludeMe);
		socket.session.publish(topic, [], obj, {
			exclude_me: !!excludeMe
		});
	}
	function hello(arr, obj) {
		console.log("socket test received:", arr, obj);
	}
	function registerSubscription(sub) {
		console.info('registering topic', sub);
		socket.subs[sub.topic] = sub;
	}
	function unsubscribe(channel) {
		try {
			socket.session.unsubscribe(channel);
		} catch(err) {
			console.info(err);
		}
	}
	function joinGame() {
		(function retry(){
			if (socket.enabled){
				socket.unsubscribe('title:' + my.channel);
				socket.unsubscribe('game:' + game.id);
				// game updates
				console.info("Subscribing to game:" + game.id);
				socket.subscribe('game:' + game.id, joinGameCallback);
			}
			else {
				setTimeout(retry, 100);
			}
		})();
	}
	function joinGameCallback(topic, data) {
		if (ng.ignore.indexOf(data.account) === -1){
			title.chatReceive(data);
		}
	}
	function initWhisper() {
		if (socket.enabled) {
			var channel = 'hb:' + my.name;
			// heartbeat
			console.info("subscribing to heartbeat channel: ", channel);
			socket.subscribe(channel, game.socket.heartbeatCallback);
			// whisper
			channel = 'name:' + my.name;
			console.info("subscribing to whisper channel: ", channel);
			socket.subscribe(channel, routeToWhisper);
		}
	}
	function routeToWhisper(topic, data) {
		if (data.routeTo === 'party') {
			route.party(data, data.route);
		}
		else if (data.action === 'send') {
			console.info('Sent whisper: ', data);
			// report message
			route.town(data, data.route);
			chat.lastWhisper.name = data.name;
			// callback to sender
			$.ajax({
				url: app.url + 'server/chat/send.php',
				data: {
					action: 'receive',
					msg: chat.whisperParse(data.msg),
					class: 'chat-whisper',
					category: 'name:' + data.name
				}
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
	function init() {
		socket.connection = new autobahn.Connection({
			url: 'ws://ec2-34-220-110-228.us-west-2.compute.amazonaws.com:9090/',
			realm: 'realm1'
		});
		console.info('connection instantiated...');

		socket.connection.onopen = onOpen;

		function onOpen(session) {
			console.warn("Connection successful!", session);
			socket.session = session;

			socket.subscribe('test', hello);
			socket.publish('test', {
				date: Date.now()
			});
			// call/register example
			/*function add2(args) {
				return args[0] + args[1];
			}
			session.register('com.myapp.add2', add2);
			session.call('com.myapp.add2', [2, 3]).then(callDone);
			function callDone(res) {
				console.log("Result:", res);
			}*/
			socket.connectionSuccess();
		}

		socket.connection.open();
	}
	function connectionFailure(code, reason) {
		console.info('Websocket connection closed. Code: '+code+'; reason: '+reason);
		// on close/fail
		console.debug('WebSocket connection failed. Retrying...');
		socket.enabled = 0;
		setTimeout(socket.init, 100);
	}
	function routeMainChat(topic, data) {
		// console.info('rx ', topic, data);
		route.town(data, data.route);
	}
	function connectionSuccess() {
		socket.enabled = 1;
		console.info("Socket connection established with server");
		// chat updates
		if (socket.initialConnection) {
			socket.initialConnection = 0;

			// subscribe to admin broadcasts
			var admin = 'admin:broadcast';
			console.info("subscribing to channel: ", admin);
			socket.subscribe(admin, routeToAdmin);

			(function retry(){
				if (my.name){
					socket.initWhisper();
					socket.initFriendAlerts();
					socket.initGuild();
				}
				else {
					setTimeout(retry, 200);
				}
			})();

			// keep alive?
			// let everyone know I am here
			chat.broadcastAdd();
			chat.setHeader();
			// notify friends I'm online
			socket.publish('friend:' + my.name, {
				name: my.name,
				route: 'on'
			});
		}
	}
	function routeToAdmin(topic, data) {
		console.info('rx ', topic, data);
		route.town(data, data.route);
	}
	function initFriendAlerts() {
		ng.friends.forEach(function(v){
			socket.unsubscribe('friend:' + v);
			socket.subscribe('friend:' + v, chat.friendNotify);
		});
	}
	function initParty(row) {
		// unsub to current party?
		socket.unsubscribe('party:'+ my.p_id);
		// sub to party
		var party = 'party:' + row;
		my.p_id = row;
		console.info("subscribing to channel: ", party);
		try {
			// for some reason I need this when I rejoin town; whatever
			socket.subscribe(party, routeToParty);
		}
		catch (err) {
			console.info('socket.initParty ', err);
		}
	}
	function routeToParty(topic, data) {
		// console.info('party rx ', topic, data);
		if (data.route === 'chat->log') {
			route.town(data, data.route);
		}
		else {
			route.party(data, data.route);
		}
	}
	function initGuild() {
		// subscribe to test guild for now
		if (my.guild.id) {
			console.info("subscribing to guild channel: ", my.guildChannel());
			my.guild.motd && chat.log('Guild Message of the day: ' + my.guild.motd, 'chat-guild');
			socket.subscribe(my.guildChannel(), routeToGuild);
		}
	}
	function routeToGuild(topic, data) {
		console.info('rx ', topic, data);
		if (data.route === 'chat->log') {
			route.town(data, data.route);
		}
		else {
			route.guild(data, data.route);
		}
	}
})();