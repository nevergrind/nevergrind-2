var whisper;
(function() {
	whisper = {
		listen,
		route
	}
	////////////////////////////////////////////////
	function listen() {
		socket.subscribe('name' + my.name, whisper.route);
	}
	function route(data, obj) {
		data = router.normalizeInput(data, obj);
		if (data.action === 'party') {
			router.party(data, data.route);
		}
		else if (data.action === 'send') {
			console.info('Sent whisper: ', data);
			// report message
			router.town(data, data.route);
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
			router.town(data, 'chat->log');
		}
		// guild invite
		else if (data.action === 'guild-invite') {
			console.info("guild invite received! ", data);
			toast.add(data);
		}
		// party invite
		else if (data.action === 'party-invite') {
			toast.add(data);
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
})();