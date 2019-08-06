var party;
(function() {
	party = {
		missionUpdate,
		length,
		isSoloOrLeading,
		notifyMissionStatus,
		promotePlayer,
		invite,
		join,
		parse,
		promote,
		disband,
		boot,
	};
	//////////////////////////////////////
	function invite(name) {
		if (my.name === name) {
			chat.log("You can't invite yourself to a party.", "chat-warning");
		}
		else if (my.p_id && !my.party[0].isLeader) {
			chat.log("Only the party leader may send invites.", "chat-warning");
		}
		else if (my.quest.level) {
			chat.log("You cannot invite adventurers to the party after starting the mission.", "chat-warning");
		}
		else if (ng.view !== 'town') {
			chat.log("You cannot invite adventurers from the depths of a dungeon.", "chat-warning");
		}
		else {
			if (name) {
				chat.log('Sent party invite to '+ name +'.', 'chat-warning');
				console.info('name', name);
				$.post(app.url + 'party/invite.php', {
					player: _.toLower(name)
				}).done(function(r){
					console.info('invite ', r);
					if (r.newParty) {
						my.party[0].isLeader = 1;
						bar.updatePlayerBar(0);
					}
					socket.listenParty(r.p_id);
				}).fail(function(r){
					chat.log(r.responseText, 'chat-warning');
				});
			}
			else {
				chat.log("Syntax: /invite [player_name]", "chat-warning");
			}
		}
	}
	function promote(name, bypass) {
		console.info('/promote ', name, bypass);
		// must be leader or bypass by auto-election when leader leaves
		var id = my.getPartyMemberIdByName(name);
		if ((my.party[0].isLeader || bypass) && my.p_id && id) {
			$.post(app.url + 'chat/promote.php', {
				name: _.toLower(name),
				leaderId: id
			}).done(function (data) {
				// console.info('promote ', data);
			}).fail(function (r) {
				chat.log(r.responseText, 'chat-warning');
			});
		}
	}
	function join(z) {
		// clicked CONFIRM
		console.info('party.join: ', z);
		$.post(app.url + 'chat/party-join.php', {
			row: z.row,
			cId: z.cId
		}).done(function(data){
			console.info("party-join.php ", data);
			chat.log("You have joined the party.", "chat-warning");
			socket.listenParty(z.row);
			bar.getParty();
		}).fail(function(data){
			console.info("Oh no", data);
			chat.log(data.responseText, 'chat-warning');
		});
	}
	function parse(msg) { // 2-part upper case
		var a = msg.replace(/ +/g, " ").split(" ");
		return a[1] === undefined ?
			'' : (a[1][0].toUpperCase() + a[1].substr(1).toLowerCase()).trim();
	}
	function disband() {
		if (ng.view === 'battle') {
			chat.log("You cannot disband the party during battle!", "chat-warning");
		}
		else {
			var count = my.partyCount();
			$.post(app.url + 'chat/disband.php', {
				count: count
			}).done(function(r){
				// console.info('disband ', r);
				if (count > 1) {

				}
				if (my.p_id) {
					my.quest.level && ng.msg('Mission abandoned: '+ my.quest.title);
				}
				mission.initQuest();
				bar.disband();
				mission.abort();
			}).fail(function(r) {
				chat.log(r.responseText, 'chat-warning');
			}).always(function() {
				ng.unlock();
			});
		}
	}
	function boot(name, bypass) {
		console.info('/promote ', name, bypass);
		// must be leader or bypass by auto-election when leader leaves
		var id = my.getPartyMemberIdByName(name);
		if ((my.party[0].isLeader || bypass) && my.p_id && id) {
			$.post(app.url + 'chat/boot.php', {
				name: _.toLower(name),
				id: id
			}).done(function (data) {
				console.info('boot ', data);
			}).fail(function (r) {
				chat.log(r.responseText, 'chat-warning');
			});
		}
	}
	function missionUpdate(data) {
		console.info("MISSION UPDATE! ", data);
		mission.setQuest(data.quest);
		my.zoneMobs = data.zoneMobs;
		if (my.p_id && !my.party[0].isLeader) {
			$.post(app.url + 'mission/update-quest.php', {
				quest: data.quest
			}).done(function (data) {
				console.info('missionUpdate ', data);
				town.aside.selected === 'town-mission' && mission.showEmbark();
				mission.updateTitle();
				chat.log("Now departing for " + my.quest.zone +"...", "chat-warning");
				TweenMax.to('#scene-town', 3, {
					startAt: { opacity: 1 },
					delay: 2,
					opacity: 0,
					ease: Power4.easeOut
				});
				setTimeout(function() {
					mission.embark();
				}, game.questDelay);
			});
		}
	}
	function length() {
		var count = 0;
		my.party.forEach(function(v) {
			if (v.name) count++;
		});
		return count;
	}
	function isSoloOrLeading() {
		var leading = 0;
		var partyLen = party.length();
		if (partyLen === 1 || partyLen > 1 && my.party[0].isLeader) {
			leading = 1;
		}
		return leading;
	}
	function notifyMissionStatus(data) {
		ng.msg(data.msg, 6);
		if (data.action === 'abandon') {
			mission.abort();
		}
	}
	function promotePlayer() {
		if (party.length() > 1) {
			var name = '';
			my.party.forEach(function(v, i) {
				if (i) {
					if (v) {
						name = v.name;
					}
				}
			});
			name && chat.sendMsg('/promote ' + name);
		}
	}
})();