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
			// console.info('chat->log', data)
			if (data.class === 'chat-emote') {
				chat.log(data.name + ' ' + data.msg, data.class)
			}
			else if (data.name === my.name) {
				chat.log(chat.prepare(data), data.class)
			}
			else if (!ng.ignore.includes(data.name)) {
				// console.warn('MADE IT', data)
				chat.log(chat.prepare(data), data.class)
			}
			else {
				// console.warn("Message from " + data.name + " has been ignored.")
			}
		}
		else if (r === 'chat->add') {
			// console.info('chat.presence', data.row, chat.presence);
			game.upsertRoom(data)
		}
		else if (r === 'chat->remove') game.removePlayer(data)
		else if (r === 'chat->getPresence') game.updateChat()
	}
	function toParty(data, r) {
		if (r === 'p->hb') game.heartbeatReceivedParty(data)
		else if (r === 'p->returnToTown') mission.rxReturnToTown(data)
		else if (r === 'p->embarkReceived') mission.embarkReceived(data)
		else if (r === 'p->notifyJoin') party.notifyJoin(data)
		else if (r === 'p->inviteAccepted') party.joinAck(data)
		else if (r === 'p->disband') party.disbandReceived(data)
		else if (r === 'p->promote') party.promoteReceived(data)
		else if (r === 'p->boot') party.bootReceived(data)
		else if (r === 'p->getPresence') game.updateParty()
		else if (r === 'p->enterHallway') map.rxEnterHallway(data)
		else if (r === 'p->enterRoomForward') dungeon.rxEnterRoomForward(data)
		else if (r === 'p->enterRoomBackward') dungeon.rxEnterRoomBackward(data)
		else if (r === 'p->walkForward') dungeon.rxWalkForward(data)
		else if (r === 'p->walkBackward') dungeon.rxWalkBackward(data)
		else if (r === 'p->walkStop') dungeon.rxWalkStop(data)
		else if (r === 'p->goBattle') battle.go(data)
		else if (r === 'p->damage') combat.rxDamageMob(data)
		else if (r === 'p->effect') mobSkills.rxPlayerEffect(data)
		else if (r === 'p->dot') combat.rxDotMob(data)
		else if (r === 'p->mobTick') mob.rxMobResourceTick(data)
		else if (r === 'p->hit') combat.rxDamageHero(data)
		else if (r === 'p->HP') party.upsertPartyResource(data)
		else if (r === 'p->hate') mob.addHateHeal(data)
		else if (r === 'p->heal') combat.rxHotHero(data)
		else if (r === 'p->buff') combat.rxBuffHero(data)
		else if (r === 'p->casting') party.casting(data)
		else if (r === 'p->checkWipe') party.rxCheckWipe(data)
		else if (r === 'p->roomCleared') map.rxRoomCleared(data)
		else if (r === 'p->mobRespawn') map.rxMobRespawn(data)
	}
	function toGuild(data, route) {
		if (route === 'guild->hasJoined') guild.hasJoined(data)
		else if (route === 'guild->quit') guild.hasDisbanded(data)
		else if (route === 'guild->boot') guild.wasBooted(data)
		else if (route === 'guild->promote') guild.wasPromoted(data)
		else if (route === 'guild->demoteReceived') guild.demoteReceived(data)
		else if (route === 'guild->leader') guild.wasLeader(data)
		else if (route === 'guild->motd') guild.zmqMotd(data)
	}
})();