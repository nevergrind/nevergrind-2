var mission;
(function(TweenMax, $, _, undefined) {
	mission = {
		inProgress: false,
		data: {},
		loaded: 0,
		delegated: 0,
		quests: [],
		id: 0,
		title: '',
		init,
		getMissionBodyHtml,
		embark,
		resetLocalQuestData,
		abandon,
		abandonReceived,
		abort,
		embarkReceived,
		toggleZone,
		clickQuest,
		getZoneImg,
		onKilledMob,
		onClearedRoom,
	};
	var questHtml
	var html = ''
	var that = {}
	const minusClasses = 'mission-tree-btn mission-minus'
	const plusClasses = 'mission-tree-btn mission-plus'

	///////////////////////////////////////////////
	function init() {
		resetLocalQuestData()
	}
	function resetLocalQuestData() {
		mission.id = 1
		mission.questId = 1
	}
	function getOpenMenuClass(level) {
		return (level <= my.level && level > ~~(my.level * .66)) ? 'mission-open-menu' : ''
	}
	function getMissionBodyHtml() {
		questHtml = '<div id="various-body" class="flex-column flex-max">'

		questHtml = '<div id="mission-wrap" class="flex-row aside-frame">' +
			'<img id="mission-preview" src="images/battle/salubrin-den-1.png">' +
			'<div id="mission-detail-col">'
				if (party.presence[0].isLeader) {
					questHtml += '<div id="mission-details">'+
						'<div id="mission-title">'+ quests[mission.questId].title +'</div>' +
						'<div id="mission-level">'+ levelHtml() + '</div>' +
					'</div>' +
					'<div id="mission-embark" class="ng-btn">Embark!</div>'
				}
				else {
					questHtml += '<div id="mission-waiting-msg">Waiting for the party leader to select a mission.</div>'
				}
			questHtml += '</div>' +
		'</div>'

		questHtml += '<div id="mission-counter" class="aside-frame text-shadow">'
		zones.forEach(function(zone) {
			if (my.level + 4 >= zone.level) {
				questHtml +=
				'<div class="mission-zone-headers '+ getOpenMenuClass(zone.level) + ' '+ combat.considerClass[combat.getDiffIndex(zone.level)] +'" data-id="'+ zone.id +'">'+
					'<img class="mission-tree-btn mission-plus" src="images/ui/plus.png">'+
					'<div>' + zone.name + '</div>' +
				'</div>' +
				'<div id="mission-quest-list-wrap-'+ zone.id +'" class="mission-quest-list">' +
					getMissionRowHtml(zone) +
				'</div>';
				// console.info('zone', zone);
			}
		})
		questHtml += '</div></div>'
		return questHtml

	}
	function getMissionRowHtml(zone) {
		var html = '';
		zones[zone.id].missions.forEach(questId => {
			html += '<div class="mission-quest-item ellipsis ' + combat.considerClass[combat.getDiffIndex(quests[questId].level)] +'" '+
				'data-id="'+ zone.id +'" ' +
				'data-quest="'+ questId +'">' +
				quests[questId].title +
			'</div>'
		})

		if (!html) {
			html = '<div class="mission-quest-item">No missions found.</div>';
		}
		return html;
	}
	function levelHtml() {
		return 'Lv.' + quests[mission.questId].level
	}
	function clickQuest() {
		var id = this.dataset.id * 1
		var questId = this.dataset.quest * 1
		if (id && party.presence[0].isLeader) {
			// console.info("QUEST SELECTED: ", id, questId, title)
			mission.id = id
			mission.questId = questId
			// console.info("zone name: ", zones[mission.id].name)
			var png = getZoneImg()
			querySelector('#mission-preview').src = png
			$("#mission-title").html(quests[mission.questId].title);
			querySelector('#mission-level').innerHTML = levelHtml()
		}
		else {
			// TODO: non-party member needs to see something... EMBARK?
		}
	}
	function getZoneImg() {
		return 'images/battle/' + _.kebabCase(zones[mission.id].name.replace(/'/g, '')) + '-'+ quests[mission.questId].imgIndex +'.png'
	}

	function toggleZone() {
		that = $(this)
		// console.info('toggleZone', this.dataset.id)
		var zoneId = this.dataset.id * 1
		var index = zones.findIndex(zone => zone.id === zoneId);
		var zone = zones[index];

		// console.info('JSON ', _.cloneDeep(zone));
		// console.info(index, "isOpen: ", zone.isOpen, zone);

		if (zone.isOpen) {
			// close menu
			var e = that.find('.mission-minus');
			e.attr('src', 'images/ui/plus.png');
			e.removeClass().addClass(plusClasses)
			$("#mission-quest-list-wrap-" + zone.id).css('display', 'none');
			zone.isOpen = 0;
		}
		else {
			// open menu
			var e = that.find('.mission-plus');
			e.attr('src', 'images/ui/minus.png');
			e.removeClass().addClass(minusClasses)
			$("#mission-quest-list-wrap-" + zone.id).css('display', 'block');
			zone.isOpen = 1;
		}
	}
	function abandon() {
		// clicked flag
		if (!mission.inProgress) {
			chat.log("You have not started a mission!", CHAT.WARNING);
		}
		else if (!party.presence[0].isLeader) {
			chat.log("Only party leaders can abandon missions, but you can /disband the party to quit.", CHAT.WARNING);
		}
		else if (ng.view !== 'dungeon') {
			chat.log("You cannot abandon missions while in combat!", CHAT.WARNING);
		}
		else {
			socket.publish('party' + my.partyId, {
				route: 'p->abandon',
				msg: my.name + ' has abandoned the mission.',
				popupMsg: 'Mission abandoned: ' + quests[mission.questId].title
			})
		}
	}

	function abandonReceived(data) {
		// console.info('abandonReceived', data)
		chat.log(data.msg, CHAT.WARNING)
		ng.msg(data.popupMsg, 4)
		mission.abort()
	}
	function abort() {
		if (ng.view === 'dungeon') {
			mission.inProgress = false
			chat.log('Returning to town...', CHAT.WARNING)
			ng.lock(1)

			// init client and transition back to town
			resetLocalQuestData();

			TweenMax.to('#scene-dungeon', 2, {
				delay: 2,
				filter: 'brightness(0)',
				onComplete: function() {
					// rejoin main chat
					town.go()
					chat.joinChannel('town', 1, true)
					game.getPresence()
					delayedCall(.5, function() {
						game.updateChat()
						chat.modeChange(CHAT.SAY)
					})
					ng.unlock()
				}
			});
		}
	}

	function embark() {
		if (party.presence[0].isLeader) {
			mission.inProgress = true
			var data = {
				route: 'p->embarkReceived',
				id: mission.id,
				questId: mission.questId,
			}
			// console.info('embark isLeader!', data)
			socket.publish('party' + my.partyId, data)
		}
	}

	function embarkReceived(data) {
		console.info("MISSION UPDATE! ", data)
		// all party updated on mission status
		mission.inProgress = true
		mission.id = data.id
		mission.questId = data.questId
		town.closeVarious()

		chat.log('Now departing for ' + zones[mission.id].name + '!', CHAT.WARNING)
		ng.lock(1)
		TweenMax.to('#sky-wrap', 3, {
			delay: 1,
			filter: 'brightness(0)',
			ease: Power4.easeOut
		})
		TweenMax.to('#scene-town', 3, {
			startAt: { opacity: 1 },
			delay: 1,
			filter: 'brightness(0)',
			ease: Power4.easeOut
		});
		ng.msg('Mission started: ' + quests[mission.questId].title)
		let questDelay = ng.isApp ? 3 : 0
		delayedCall(questDelay, dungeon.go)
	}

	function onKilledMob(mobData) {

	}
	function onClearedRoom() {

	}
})(TweenMax, $, _);