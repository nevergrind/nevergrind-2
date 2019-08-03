var socket;
(function() {
	socket = {
		connection: void 0,
		enabled: 0,
		emptyArray: [],
		noExcludeObj: { exclude_me: false },
		initialConnection: 1,
		subs: {}, // active channel subscriptions - required to unsub
		subscribe: subscribe,
		unsubscribe: unsubscribe,
		publish: publish,
		registerSubscription: registerSubscription,
		joinGame: joinGame,
		init: init,
		routeMainChat: routeMainChat,
		listenParty: listenParty,
		listenGuild: listenGuild,
	}
	////////////////////////////////////////
	function subscribe(topic, callback) {
		topic = _.toLower(topic);
		if (typeof socket.subs[topic] !== 'object' ||
			!socket.subs[topic].active) {
			console.info("subscribing:", topic, callback.name);
			socket.session.subscribe(topic, callback).then(registerSubscription);
		}
	}
	function publish(topic, obj) {
		topic = _.toLower(topic);
		console.info('publishing: ', topic, obj);
		socket.session.publish(topic, socket.emptyArray, obj, socket.noExcludeObj);
	}
	function registerSubscription(sub) {
		console.info('registerSubscription', sub);
		socket.subs[sub.topic] = sub;
	}
	function unsubscribe(channel) {
		channel = _.toLower(channel);
		if (typeof socket.subs[channel] === 'object') {
			try {
				console.warn("Trying to unsubscribe from:");
				console.info(socket.subs[channel]);
				socket.session.unsubscribe(socket.subs[channel]);
			}
			catch(err) {
				console.warn('Could not unsubscribe: ', err);
			}
		}
	}
	function joinGame() {
		(function retry(){
			if (socket.enabled){
				socket.unsubscribe('title' + my.channel);
				socket.unsubscribe('game' + game.id);
				// game updates
				socket.subscribe('game' + game.id, joinGameCallback);
			}
			else {
				setTimeout(retry, 100);
			}
		})();
	}
	function joinGameCallback(data) {
		if (ng.ignore.indexOf(data[0].account) === -1){
			title.chatReceive(data[0]);
		}
	}
	function listenWhisper() {
		socket.subscribe('name' + my.name, routeToWhisper);
	}
	function listenFriendAlerts() {
		ng.friends.forEach(function(v){
			socket.unsubscribe('friend' + v);
			socket.subscribe('friend' + v, chat.friendNotify);
		});
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
	function init() {
		socket.connection = new autobahn.Connection({
			url: app.socketUrl,
			realm: 'realm1'
		});
		socket.connection.onopen = connectionSuccess;
		socket.connection.open();
	}
	function routeMainChat(data, obj) {
		data = typeof data[0] === 'object' ?
			data[0] : obj;
		console.info('rx ', data, obj);
		route.town(data, data.route);
	}
	function connectionSuccess(session) {
		console.warn("Connection successful!", session);
		socket.session = session;
		socket.enabled = 1;
		// chat updates
		if (socket.initialConnection) {
			socket.initialConnection = 0;

			// subscribe to admin broadcasts
			socket.subscribe('adminbroadcast', routeToAdmin);
			test.socketSub();
			//return;
			(function retry(){
				if (my.name){
					game.heartbeatListen();
					listenWhisper();
					listenFriendAlerts();
					socket.listenGuild();
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
			socket.publish('friend' + my.name, {
				name: my.name,
				route: 'on'
			});
		}
	}
	function routeToAdmin(data) {
		console.info('rx ', data[0]);
		route.town(data[0], data[0].route);
	}
	function listenParty(row) {
		// unsub to current party?
		socket.unsubscribe('party'+ my.p_id);
		// sub to party
		my.p_id = row;
		try {
			// for some reason I need this when I rejoin town; whatever
			socket.subscribe('party' + row, routeToParty);
		}
		catch (err) {
			console.info('socket.listenParty ', err);
		}
	}
	function routeToParty(data, obj) {
		data = typeof data[0] === 'object' ?
			data[0] : obj;
		if (data.route === 'chat->log') {
			route.town(data, data.route);
		}
		else {
			route.party(data, data.route);
		}
		// console.info('party rx ', topic, data);
	}
	function listenGuild() {
		// subscribe to test guild for now
		if (my.guild.id) {
			my.guild.motd && chat.log('Guild Message of the day: ' + my.guild.motd, 'chat-guild');
			socket.subscribe(my.guildChannel(), routeToGuild);
		}
	}
	function routeToGuild(data) {
		data = data[0];
		console.info('rx ', data);
		if (data.route === 'chat->log') {
			route.town(data, data.route);
		}
		else {
			route.guild(data, data.route);
		}
	}
})();