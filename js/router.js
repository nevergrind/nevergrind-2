var router;
(function() {
	router = {
		normalizeInput,
		town,
		party,
		guild,
	}
	///////////////////////////////////////////////////////
	function normalizeInput(arr, obj) {
		return typeof arr[0] === 'object' ?
			arr[0] : obj;
	}
	function town(data, r) {
		if (r === 'chat->hb') {
			game.heartbeatReceived(data);
		}
		else if (r === 'chat->log') {
			if (data.name === my.name) {
				chat.log(data.msg, data.class);
			}
			else if (ng.ignore.indexOf(data.name) === -1) {
				chat.log(data.msg, data.class);
			}
			else {
				console.info("Message from " + data.name + " has been ignored.");
			}
		}
		else if (r === 'chat->add') {
			// console.info('chat.presence', data.row, chat.presence);
			game.upsertRoom(data);
		}
		else if (r === 'chat->remove') {
			game.removePlayer(data);
		}
		else if (r === 'chat->getPresence') {
			console.warn('getPresence received! broadcasting!')
			game.heartbeatSend();
		}
	}
	function party(data, r) {
		console.info('party', data, r);
		if (r === 'party->hb') {
			game.heartbeatReceivedParty(data);
		}
		else if (r === 'party->updateBars') {
			bar.updateBars(data);
		}
		else if (r === 'party->notifyMissionStatus') {
			party.notifyMissionStatus(data);
		}
		else if (r === 'party->missionUpdate') {
			party.missionUpdate(data);
		}
		else if (r === 'party->linkdead') {
			bar.heartbeatLinkdead(data);
		}
		else if (r === 'party->join') {
			bar.partyJoin(data);
		}
		else if (r === 'party->disband') {
			bar.partyDisband(data);
		}
		else if (r === 'party->promote') {
			bar.partyPromote(data);
		}
		else if (r === 'party->boot') {
			bar.partyBoot(data);
		}
		else if (r === 'party->bootme') {
			// remove booted player
			var slot = my.getPartySlotByRow(data.id * 1),
				promote = 0;
			if (party.presence[slot].isLeader) {
				// we must promote a new leader
				promote = 1;
			}
			party.presence[slot] = my.Party();
			//console.info("%c party->bootme", "background: #ff0", promote);
			// only boot if I'm the lowest id!
			if (my.isLowestPartyIdMine()) {
				//console.info('isLowestPartyIdMine ! YES PROMOTE! ', _.cloneDeep(my.party));
				party.boot(data.name, 1);
				if (my.partyCount() === 1) {
					// disband if one-man party
					console.info('partyCount === 1 ');
					party.disband();
				}
				else if (promote) {
					// otherwise promote this player to leader
					//console.info('PROMOTING: ', my.name);
					party.promote(my.name, 1);
				}
			}
			setTimeout(bar.getParty, 1000);
		}
		else if (r === 'party->getPresence') {
			console.warn('getPresence received! broadcasting!')
			game.heartbeatSend();
		}
	}
	function guild(data, r) {
		if (r === 'guild->hasJoined') {
			guild.hasJoined(data);
		}
		else if (r === 'guild->quit') {
			guild.hasQuit(data);
		}
		else if (r === 'guild->boot') {
			guild.wasBooted(data);
		}
		else if (r === 'guild->promote') {
			guild.wasPromoted(data);
		}
		else if (r === 'guild->leader') {
			guild.wasLeader(data);
		}
		else if (r === 'guild->motd') {
			guild.zmqMotd(data);
		}
	}
})();