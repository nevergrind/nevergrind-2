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
		data = router.normalizeInput(data, obj)
		action = data.action
		if (data.action === 'party') {
			router.party(data, data.route)
		}
		else if (action === 'send') {
			console.info('Sent whisper: ', data)
			// report message
			router.toTown(data, data.route)
			chat.lastWhisper.name = data.name
			console.info('data send', data)
			// callback to sender
			socket.publish('name' + _.toLower(data.name), {
				job: my.job,
				name: my.name,
				level: my.level,
				action: 'receive',
				msg: data.msg,
				class: 'chat-whisper',
				route: 'chat->log',
			})
		}
		// receive pong
		else if (action === 'receive') {
			if (!chat.lastWhisper.name) {
				chat.lastWhisper = {
					name: data.name
				}
			}
			console.info('data receive', _.cloneDeep(data))
			data.msg = 'To ' + chat.getPrefix(data) + ': ' + data.msg;
			// router.toTown(data, 'chat->log');
			chat.log(data.msg, data.class)
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
		else if (action === 'toast-busy') chat.log(data.name + ' is busy right now.', 'chat-warning')
		else if (action === 'party-invite-reject') chat.log(data.name + ' is already in a party!', 'chat-warning')
		else if (action === 'party-confirmed') party.joinConfirmed(data)
		else if (action === 'party-accept') chat.log(data.name + " has joined the party.", 'chat-warning')
		else if (action === 'party-invite-decline') chat.log(data.name + " has declined to join the party.", 'chat-warning')
		else if (action === 'guild-invite-decline') chat.log(data.name + " has declined to join the guild.", 'chat-warning')
		else if (action === 'friend>addedMe') {
			chat.log(data.name + " has added you to "+ (my.gender === 'M' ? 'his' : 'her') +" friend list.", 'chat-warning');
		}
		else if (action === 'friend->getPresence') friend.listReceived(data)
		else if (action === 'friend->sendPresence') friend.presenceReceived(data)
		else if (data.action === 'all->received') who.presenceReceived(data)
		else if (data.action === 'all->byFilterReceived') who.byFilterReceived(data)
		else if (data.action === 'trade-request') trade.handleRequest(data)
		else if (data.action === 'trade-reject-busy') trade.rejectTradeBusy(data)
		else if (data.action === 'trade-request-decline') trade.declineTrade(data)
		else if (data.action === 'trade-start') trade.tradeStartResp(data)
		else if (data.action === 'trade-close-received') trade.tradeClosedReceived(data)
	}
})();