var whisper;
(function() {
	whisper = {
		listen,
		route
	};
	var action;
	////////////////////////////////////////////////
	function listen() {
		socket.subscribe('name' + my.name, whisper.route);
	}
	function route(data, obj) {
		data = router.normalizeInput(data, obj);
		action = data.action;
		if (data.action === 'party') {
			router.party(data, data.route);
		}
		else if (action === 'send') {
			console.info('Sent whisper: ', data);
			// report message
			router.toTown(data, data.route);
			chat.lastWhisper.name = data.name;
			// callback to sender
			$.post(app.url + 'chat/send.php', {
				action: 'receive',
				msg: parse(data.msg),
				class: 'chat-whisper',
				category: 'name' + _.toLower(data.name)
			});
		}
		// receive pong
		else if (action === 'receive') {
			if (!chat.lastWhisper.name) {
				chat.lastWhisper = {
					name: data.name
				}
			}
			data.msg = whisperTo(data) + parse(data.msg);
			router.toTown(data, 'chat->log');
		}
		// guild invite
		else if (action === 'guild-invite') {
			if (!my.guild.id) {
				console.info("guild invite received! ", data);
				toast.add(data);
			}
			else {
				socket.publish('name' + data.name, {
					action: 'guild-invite-reject',
					name: my.name
				})
			}
		}
		else if (data.action === 'guild-invite-reject') {
			chat.log(data.name + ' is already in a guild!', 'chat-warning');
		}
		// party invite
		else if (action === 'party-invite') {
			if (party.presence.length === 1) {
				toast.add(data);
			}
			else {
				socket.publish('name' + data.name, {
					action: 'party-invite-reject',
					name: my.name
				})
			}
		}
		else if (action === 'party-invite-reject') {
			chat.log(data.name + ' is already in a party!', 'chat-warning');
		}
		else if (action === 'party-confirmed') {
			party.joinConfirmed(data);
		}
		else if (action === 'party-invite-deny') {
			chat.log(data.name + " has denied your party invite.", 'chat-warning');
		}
		else if (action === 'guild-invite-deny') {
			chat.log(data.name + " has denied your guild invite.", 'chat-warning');
		}
		else if (action === 'party-accept') {
			chat.log(data.name + " has joined the party.", 'chat-warning');
		}
		else if (action === 'friend>addedMe') {
			chat.log(data.name + " has added you to "+ (my.gender === 'M' ? 'his' : 'her') +" friend list.", 'chat-warning');
		}
		else if (action === 'friend->getPresence') {
			friend.listReceived(data);
		}
		else if (action === 'friend->sendPresence') {
			friend.presenceReceived(data);
		}
		else if (data.action === 'all->received') {
			who.presenceReceived(data);
		}
		else if (data.action === 'all->byFilterReceived') {
			who.byFilterReceived(data);
		}
	}
	function parse(msg) {
		// 2-part parse lower case
		var a = msg.split("whispers: ");
		return a[1];
	}
	function whisperTo(data) {
		return 'You whispered to ' + data.name + ': ';
	}
})();