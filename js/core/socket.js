var socket;
(function(_, $, Date, undefined) {
	socket = {
		connection: void 0,
		enabled: false,
		initialConnection: 1,
		subs: {}, // active channel subscriptions - required to unsub
		msgPerSec: 0,
		published: 0,
		received: 0,
		subscribe,
		unsubscribe,
		publish,
		init,
		routeMainChat,
	}
	const EMPTY_ARRAY = []
	let len, secs
	let broadcasts = []

	const excludeObj = { exclude_me: true }
	const includeObj = { exclude_me: false }
	////////////////////////////////////////
	function subscribe(topic, callback) {
		topic = topic.toLowerCase()
		if (typeof socket.subs[topic] !== 'object' ||
			!socket.subs[topic].active) {
			// console.info("subscribing:", topic, callback.name);
			socket.session.subscribe(topic, callback).then(registerSubscription);
		}
	}
	function registerSubscription(sub) {
		// console.info('registerSubscription', sub);
		socket.subs[sub.topic] = sub;
	}
	function publish(topic, obj, exclude) {
		topic = topic.toLowerCase()
		// console.info('publishing: ', topic, obj);
		if (typeof socket.session === 'object') {
			socket.published++
			broadcasts.push(Date.now())
			while (broadcasts.length > 100) broadcasts.shift()
			len = broadcasts.length
			secs = (Date.now() - broadcasts[0]) / 1000
			socket.msgPerSec = (len / secs).toFixed(1)
			// console.info('msgPerSec', socket.msgPerSec)

			// name channels are always exclusionary broadcasts (bad assumption)
			// if (topic.startsWith('name')) exclude = true

			socket.session.publish(
				topic,
				EMPTY_ARRAY,
				obj,
				exclude ? excludeObj : includeObj
			);
		}
	}
	function unsubscribe(channel) {
		channel = channel.toLowerCase()
		if (typeof socket.subs[channel] === 'object') {
			try {
				// console.warn('Trying to unsubscribe from:', channel);
				socket.session.unsubscribe(socket.subs[channel]);
			}
			catch(err) {
				console.warn('Could not unsubscribe: ', err);
			}
		}
	}
	/*function joinGame() {
		(function retry(){
			if (socket.enabled){
				socket.unsubscribe('title' + my.channel);
				socket.unsubscribe('game' + game.id);
				// game updates
				socket.subscribe('game' + game.id, joinGameCallback);
			}
			else {
				delayedCall(.1, retry);
			}
		})();
	}
	function joinGameCallback(data) {
		if (!ng.ignore.includes(data[0].account)){
			title.chatReceive(data[0]);
		}
	}*/
	function init() {
		socket.connection = new autobahn.Connection({
			url: 'ws://' + Config.socketUrl + ':9090',
			realm: 'realm1'
		})
		socket.connection.onopen = connectionSuccess
		socket.connection.open()
	}
	function routeMainChat(data, obj) {
		data = router.normalizeInput(data, obj);
		router.toTown(data, data.route);
	}
	function connectionSuccess(session) {
		// console.warn("Connection successful!", session);
		socket.session = session;
		if (!socket.enabled) town.socketReady()
		socket.enabled = true;
		// chat updates
		if (socket.initialConnection) {
			socket.initialConnection = 0

			// subscribe to admin broadcasts
			socket.subscribe('allbroadcast', broadcast.route)
			//return;
			!function retry() {
				if (my.name){
					game.initSocket();
				}
				else {
					delayedCall(.2, retry);
				}
			}()
			// notify friends I'm online
			socket.publish('friend' + my.name, {
				name: my.name,
				route: 'on'
			});
		}
	}
})(_, $, Date);