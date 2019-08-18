var socket;
(function() {
	socket = {
		connection: void 0,
		enabled: 0,
		emptyArray: [],
		noExcludeObj: { exclude_me: false },
		excludeObj: { exclude_me: true },
		initialConnection: 1,
		subs: {}, // active channel subscriptions - required to unsub
		subscribe,
		unsubscribe,
		publish,
		init,
		routeMainChat,
	}
	////////////////////////////////////////
	function subscribe(topic, callback) {
		topic = _.toLower(topic);
		if (typeof socket.subs[topic] !== 'object' ||
			!socket.subs[topic].active) {
			//console.info("subscribing:", topic, callback.name);
			socket.session.subscribe(topic, callback).then(registerSubscription);
		}
	}
	function publish(topic, obj, exclude) {
		topic = _.toLower(topic);
		//console.info('publishing: ', topic, obj);
		socket.session.publish(
			topic,
			socket.emptyArray,
			obj,
			exclude ? socket.excludeObj : socket.noExcludeObj
		);
	}
	function registerSubscription(sub) {
		//console.info('registerSubscription', sub);
		socket.subs[sub.topic] = sub;
	}
	function unsubscribe(channel) {
		channel = _.toLower(channel);
		if (typeof socket.subs[channel] === 'object') {
			try {
				console.warn('Trying to unsubscribe from:', channel);
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
		if (!ng.ignore.includes(data[0].account)){
			title.chatReceive(data[0]);
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
		data = router.normalizeInput(data, obj);
		router.toTown(data, data.route);
	}
	function connectionSuccess(session) {
		console.warn("Connection successful!", session);
		socket.session = session;
		socket.enabled = 1;
		// chat updates
		if (socket.initialConnection) {
			socket.initialConnection = 0;

			// subscribe to admin broadcasts
			socket.subscribe('allbroadcast', broadcast.route);
			test.socketSub();
			//return;
			(function retry(){
				if (my.name){
					game.initSocket();
				}
				else {
					setTimeout(retry, 200);
				}
			})();
			// notify friends I'm online
			socket.publish('friend' + my.name, {
				name: my.name,
				route: 'on'
			});
		}
	}
})();