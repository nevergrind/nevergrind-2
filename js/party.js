var party;
(function() {
	party = {
		missionUpdate,
		length,
		isSoloOrLeading,
		notifyMissionStatus,
		promotePlayer,
	};
	//////////////////////////////////////
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