var router;
(function() {
	router = {
		normalizeInput,
		toTown,
		toParty,
		toGuild,
	}
	///////////////////////////////////////////////////////
	function normalizeInput(arr, obj) {
		return typeof arr[0] === 'object' ?
			arr[0] : obj;
	}
	function toTown(data, r) {
		if (r === 'chat->hb') {
			game.heartbeatReceived(data)
		}
		else if (r === 'chat->log') {
			console.info('chat->log', data)
			if (data.class === 'chat-emote') {
				chat.log(data.name + ' ' + data.msg, data.class)
			}
			else if (data.name === my.name) {
				chat.log(chat.prepare(data), data.class)
			}
			else if (!ng.ignore.includes(data.name)) {
				console.warn('MADE IT', data)
				chat.log(chat.prepare(data), data.class)
			}
			else {
				warn("Message from " + data.name + " has been ignored.")
			}
		}
		else if (r === 'chat->add') {
			// console.info('chat.presence', data.row, chat.presence);
			game.upsertRoom(data)
		}
		else if (r === 'chat->remove') {
			game.removePlayer(data)
		}
		else if (r === 'chat->getPresence') {
			game.heartbeatSend()
		}
	}
	function toParty(data, r) {
		if (r === 'party->hb') game.heartbeatReceivedParty(data)
		else if (r === 'party->abandon') mission.abandonReceived(data)
		else if (r === 'party->embarkReceived') mission.embarkReceived(data)
		else if (r === 'party->notifyJoin') party.notifyJoin(data)
		else if (r === 'party->inviteAccepted') party.joinAck(data)
		else if (r === 'party->disband') party.disbandReceived(data)
		else if (r === 'party->promote') party.promoteReceived(data)
		else if (r === 'party->boot') party.bootReceived(data)
		else if (r === 'party->getPresence') game.heartbeatSend()
	}
	function toGuild(data, r) {
		if (r === 'guild->hasJoined') guild.hasJoined(data)
		else if (r === 'guild->quit') guild.hasDisbanded(data)
		else if (r === 'guild->boot') guild.wasBooted(data)
		else if (r === 'guild->promote') guild.wasPromoted(data)
		else if (r === 'guild->demoteReceived') guild.demoteReceived(data)
		else if (r === 'guild->leader') guild.wasLeader(data)
		else if (r === 'guild->motd') guild.zmqMotd(data)
	}
})();