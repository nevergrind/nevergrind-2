var whisper;
(function() {
	whisper = {
		listen,
		route
	};
	var r;
	////////////////////////////////////////////////
	function listen() {
		socket.subscribe('name' + my.name, whisper.route);
	}

	function route(data, obj) {
		data = router.normalizeInput(data, obj)
		r = data.action
		if (r === 'party') {
			router.party(data, data.route)
		}
		else if (r === 'send') {
			// console.info('Sent whisper: ', data)
			// report message
			router.toTown(data, data.route)
			chat.lastWhisper.name = data.name
			// console.info('data send', data)
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
		else if (r === 'receive') {
			if (!chat.lastWhisper.name) {
				chat.lastWhisper = {
					name: data.name
				}
			}
			// console.info('data receive', _.cloneDeep(data))
			data.msg = 'To ' + chat.getPrefix(data) + ': ' + data.msg;
			// router.toTown(data, 'chat->log');
			chat.log(data.msg, data.class)
		}
		// guild invite
		else if (r === 'guild-invite') {
			if (!my.guild.id) {
				// console.info("guild invite received! ", data);
				toast.add(data);
			}
			else {
				socket.publish('name' + data.name, {
					action: 'guild-invite-reject',
					name: my.name
				})
			}
		}
		else if (r === 'guild-invite-reject') {
			chat.log(data.name + ' is already in a guild!', 'chat-warning');
		}
		// party invite
		else if (r === 'party-invite') {
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
		else if (r === 'toast-busy') chat.log(data.name + ' is busy right now.', 'chat-warning')
		else if (r === 'party-invite-reject') chat.log(data.name + ' is already in a party!', 'chat-warning')
		else if (r === 'party-confirmed') party.joinConfirmed(data)
		else if (r === 'party-accept') chat.log(data.name + " has joined the party.", 'chat-warning')
		else if (r === 'party-invite-decline') chat.log(data.name + " has declined to join the party.", 'chat-warning')
		else if (r === 'guild-invite-decline') chat.log(data.name + " has declined to join the guild.", 'chat-warning')
		else if (r === 'friend>addedMe') {
			chat.log(data.name + " has added you to "+ (my.gender === 'M' ? 'his' : 'her') +" friend list.", 'chat-warning');
		}
		else if (r === 'friend->getPresence') friend.listReceived(data)
		else if (r === 'friend->sendPresence') friend.presenceReceived(data)
		else if (r === 'all->received') who.presenceReceived(data)
		else if (r === 'all->byFilterReceived') who.byFilterReceived(data)
		else if (r === 'trade-request') trade.handleRequest(data)
		else if (r === 'trade-reject-busy') trade.rejectTradeBusy(data)
		else if (r === 'trade-request-decline') trade.declineTrade(data)
		else if (r === 'trade-start') trade.tradeStartResp(data)
		else if (r === 'trade-close-received') trade.rxTradeClosedReceived(data)
		else if (r === 'trade-update') trade.rxTradeUpdate(data)
		else if (r === 'trade-update-gold') trade.rxUpdateGold(data)
		else if (r === 'trade-processing') trade.rxProcessing(data)
		else if (r === 'trade-send-slots') trade.rxSlotsAndSend(data)
		else if (r === 'trade-update-inventory') trade.rxUpdateInventory(data)
		else if (r === 'p->HoT') combat.rxHotHero(data)
		else if (r === 'p->buff') combat.rxBuffHero(data)
	}
})();