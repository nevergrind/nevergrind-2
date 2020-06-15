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
		socket.received++
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
			game.updateChat()
		}
	}
	function toParty(data, r) {
		if (r === 'p->hb') game.heartbeatReceivedParty(data)
		else if (r === 'p->abandon') mission.abandonReceived(data)
		else if (r === 'p->embarkReceived') mission.embarkReceived(data)
		else if (r === 'p->notifyJoin') party.notifyJoin(data)
		else if (r === 'p->inviteAccepted') party.joinAck(data)
		else if (r === 'p->disband') party.disbandReceived(data)
		else if (r === 'p->promote') party.promoteReceived(data)
		else if (r === 'p->boot') party.bootReceived(data)
		else if (r === 'p->getPresence') game.updateParty()
		else if (r === 'p->goDungeon') dungeon.go(data)
		else if (r === 'p->goBattle') battle.go(data)
		else if (r === 'p->damage') combat.rxUpdateDamage(data)
		else if (r === 'p->mobTick') mob.rxMobResourceTick(data)
		else if (r === 'p->hit') combat.rxDamageHero(data)
		else if (r === 'p->HP') party.upsertPartyResource(data)
		else if (r === 'p->buff') battle.rxBuffMob(data)
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