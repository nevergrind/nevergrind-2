var mission;
(function() {
	mission = {
		data: {},
		loaded: 0,
		delegated: 0,
		quests: [],
		setMissionMenusAllOpen,
		init,
		asideHtmlHead,
		asideHtml,
		asideFooter,
		embark,
		resetLocalQuestData,
		abandon,
		abandonReceived,
		abort,
		embarkReceived,
	};
	var minusClasses = 'fa-minus-square mission-minus'
	var plusClasses = 'fa-plus-square mission-plus'
	var reversedZones = []
	///////////////////////////////////////////////
	function setMissionMenusAllOpen() {
		zones.forEach(function(v) {
			v.isOpen = 0;
		});
	}
	function getOpenMenuClass(level) {
		return (level <= my.level && level > ~~(my.level * .66)) ? 'mission-open-menu' : ''
	}
	function getDiffClass(minQuestLvl) {
		var resp = 'con-grey';
		if (minQuestLvl >= my.level + 3) {
			resp = 'con-red';
		}
		else if (minQuestLvl > my.level) {
			resp = 'con-yellow';
		}
		else if (minQuestLvl === my.level) {
			resp = 'con-white';
		}
		else if (minQuestLvl >= ~~(my.level * .88) ) {
			resp = 'con-high-blue';
		}
		else if (minQuestLvl >= ~~(my.level * .77) ) {
			resp = 'con-low-blue';
		}
		else if (minQuestLvl >= ~~(my.level * .66) ) {
			resp = 'con-green';
		}
		return resp;
	}
	function init() {

		// delegation
		if (!mission.delegated) {
			mission.delegated = 1;
			$("#scene-town").on('click', '.mission-zone-headers', function() {
				toggleZone($(this));
			}).on('click', '.mission-quest-item', function() {
				clickQuest($(this));
			})
				.on('click', '#mission-embark', mission.embark)
				.on('click', '#mission-abandon', mission.abandon);
		}
	}
	function showEmbark() {
		$("#mission-help").css('display', 'none');
		$("#mission-embark").css('display', 'block');
	}
	function updateTitle() {
		$("#mission-title").html(my.selectedMissionTitle);
	}
	function asideHtmlHead() {
		var headMsg = 'Mission Counter',
			helpMsg = 'The party leader must select a zone and embark to begin!',
			embarkClass = 'none',
			helpClass = 'block';

		if (party.presence[0].isLeader) {
			// is solo or a leader
			headMsg = 'Select A Mission';
			helpMsg = 'Select a quest from any zone and embark to venture forth!';
		}
		if (my.quest.level) {
			headMsg = my.quest.title;
			embarkClass = 'block';
			helpClass = 'none';
		}

		var s =
		'<div id="mission-wrap" class="aside-frame text-center">' +
			'<div id="mission-title">'+ headMsg +'</div>' +
			'<div id="mission-embark" class="ng-btn '+ embarkClass +'">Embark!</div>' +
			'<div id="mission-help" class=" '+ helpClass +'">'+ helpMsg +'</div>' +
		'</div>';
		return s;
	}
	function asideHtml() {
		var s = ''
		if (!reversedZones.length) {
			reversedZones = zones.reverse()
		}
		reversedZones.forEach(function(zone) {
			if (my.level + 4 >= zone.level) {
				s +=
				'<div class="mission-zone-headers '+ getOpenMenuClass(zone.level) + ' '+ getDiffClass(zone.level) +'" data-id="'+ zone.id +'">'+
					'<i class="mission-tree-btn far fa-plus-square mission-plus text-shadow"></i>'+
					'<div>' + zone.name + '</div>' +
				'</div>' +
				'<div id="mission-quest-list-wrap-'+ zone.id +'" class="mission-quest-list">';
					s += getMissionRowHtml(zone);
				s += '</div>';
				console.info('zone', zone);
			}
		})
		return s
	}
	function getMissionRowHtml(data) {
		var html = '';
		var zoneId = data.id;
		data.missions.forEach(function(mission){
			html +=
				'<div class="mission-quest-item ellipsis ' + getDiffClass(mission.level) +'" '+
					'data-id="'+ zoneId +'" ' +
					'data-title="'+ mission.title +'">' +
					mission.title +
				'</div>';
		});

		if (!html) {
			html = '<div class="mission-quest-item">No missions found.</div>';
		}
		return html;
	}
	function asideFooter() {
		var s = '';
		if (party.presence[0].isLeader) {
			s +=
			'<div id="mission-footer" class="aside-frame text-shadow">' +
				'<div id="mission-abandon" class="ng-btn ng-btn-alert">Abandon Mission</div>' +
			'</div>';
		}
		return s;
	}
	function clickQuest(that) {
		var id = that.data('id') * 1;
		var title = that.data('title');
		if (id && party.presence[0].isLeader) {
			console.info("QUEST SELECTED: ", id, title);
			my.selectedZone = id;
			my.selectedMissionTitle = title;
			showEmbark();
			updateTitle();
		}
		else {
			// TODO: non-party member needs to see something... EMBARK?
		}
	}

	function toggleZone(that) {
		var zoneId = that.data('id') * 1
		var index = zones.findIndex(zone => zone.id === zoneId);
		var zone = zones[index];

		console.info('JSON ', _.cloneDeep(zone));
		console.info(index, "isOpen: ", zone.isOpen, zone);

		if (zone.isOpen) {
			// close menu
			var e = that.find('.mission-minus');
			e.removeClass(minusClasses).addClass(plusClasses);
			$("#mission-quest-list-wrap-" + zone.id).css('display', 'none');
			zone.isOpen = 0;
		}
		else {
			// open menu
			var e = that.find('.mission-plus');
			e.removeClass(plusClasses).addClass(minusClasses);
			$("#mission-quest-list-wrap-" + zone.id).css('display', 'block');
			zone.isOpen = 1;
		}
	}
	function resetLocalQuestData() {
		my.selectedZone = 0;
		my.selectedMissionTitle = '';
		my.quest = {};
	}
	function abandon() {
		// clicked flag
		if (!my.quest.level) {
			chat.log("You have not started a mission!", 'chat-warning');
		}
		else if (!party.presence[0].isLeader) {
			chat.log("Only party leaders can abandon missions, but you can /disband the party to quit.", 'chat-warning');
		}
		else if (ng.view !== 'dungeon') {
			chat.log("You cannot abandon missions while in combat!", 'chat-warning');
		}
		else {
			socket.publish('party' + my.partyId, {
				route: 'party->abandon',
				msg: my.name + ' has abandoned the mission.',
				popupMsg: 'Mission abandoned: ' + my.quest.title,
				quest: getQuestData(my.selectedZone, my.selectedMissionTitle)
			})
		}
	}

	function abandonReceived(data) {
		info(arguments.callee.name, data)
		chat.log(data.msg, 'chat-warning')
		ng.msg(data.popupMsg, 4)
		mission.abort()
	}
	function abort() {
		if (ng.view === 'dungeon') {
			button.hide()
			chat.log('Returning to town...', 'chat-warning')
			ng.lock(1)

			// init client and transition back to town
			resetLocalQuestData();

			TweenMax.to('#scene-dungeon', 2, {
				delay: 2,
				opacity: 0,
				onComplete: function() {
					// rejoin main chat
					town.go()
					chat.joinChannel('town', 1)
					game.getPresence()
					TweenMax.delayedCall(.5, function() {
						game.heartbeatSend()
						chat.modeChange({
							mode: '/say'
						})
					})
					ng.unlock()
				}
			});
		}
	}

	function embark() {
		if (party.presence[0].isLeader) {
			var data = {
				route: 'party->embarkReceived',
				quest: getQuestData(my.selectedZone, my.selectedMissionTitle)
			}
			console.info('embark isLeader!', data)
			socket.publish('party' + my.partyId, data)
			$(".close-aside").trigger('click')
		}
	}

	function embarkReceived(data) {
		console.info("MISSION UPDATE! ", data)
		setQuest(data.quest)
		$(".close-aside").trigger('click')
		chat.log('Now departing for ' + my.quest.zone + '...', 'chat-warning')
		ng.lock(1)
		TweenMax.to('#scene-town', 3, {
			startAt: { opacity: 1 },
			delay: 1,
			opacity: 0,
			ease: Power4.easeOut
		});
		ng.msg('Mission started: ' + my.quest.title)
		TweenMax.delayedCall(game.questDelay, dungeon.go)
	}

	function setQuest(data) {
		console.info("SETTING QUEST", data)
		my.selectedZone = data.id
		my.selectedMissionTitle = data.title
		my.quest = data
		my.zoneMobs = data.mobs
	}

	function getQuestData(id, title) {
		var zone = _.find(zones, { id: id })
		var mission = _.find(zone.missions, { title: title })
		return {
			id: zone.id,
			title: mission.title,
			zone: zone.name,
			level: mission.level,
			description: mission.description,
			mobs: zone.mobs
		}
	}
})();