var mission;
(function(TweenMax, $, _, undefined) {
	mission = {
		inProgress: false,
		isCompleted: false, // assure the victory screen is only shown once
		data: {},
		loaded: 0,
		delegated: 0,
		quests: [],
		id: 0, // zone id
		title: '',
		init,
		getMissionBodyHtml,
		embark,
		resetLocalQuestData,
		txReturnToTown,
		rxReturnToTown,
		embarkReceived,
		toggleZone,
		clickQuest,
		getZoneKey,
		getZoneImg,
		isQuestCompleted,
	};
	var questHtml
	var that = {}
	const minusClasses = 'mission-tree-btn mission-minus'
	const plusClasses = 'mission-tree-btn mission-plus'

	///////////////////////////////////////////////
	function init() {
		resetLocalQuestData()
	}
	function resetLocalQuestData() {
		mission.id = 0
		mission.questId = 0
	}
	function getOpenMenuClass(level) {
		return (level <= my.level && level > ~~(my.level * .66)) ? 'mission-open-menu' : ''
	}
	function getMissionBodyHtml() {
		questHtml = '<div id="various-body" class="flex-column flex-max">'

		questHtml = '<div id="mission-wrap" class="flex-row aside-frame">' +
			'<img id="mission-preview" src="images/battle/salubrin-haven-hallway-1.jpg">' +
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
		zones.forEach(function(z) {
			if (my.level + 4 >= z.level) {
				questHtml +=
				'<div class="mission-zone-headers '+ getOpenMenuClass(z.level) + ' '+ combat.considerClass[combat.getLevelDifferenceIndex(z.level)] +'" data-id="'+ z.id +'">'+
					'<img class="mission-tree-btn mission-plus" src="images/ui/plus.png">'+
					'<div>' + z.name + '</div>' +
				'</div>' +
				'<div id="mission-quest-list-wrap-'+ z.id +'" class="mission-quest-list">' +
					getMissionRowHtml(z) +
				'</div>';
				// console.info('zone', zone);
			}
		})
		questHtml += '</div></div>'
		return questHtml

	}
	function getMissionRowHtml(z) {
		var html = '';
		zones[z.id].missions.forEach((questId, index) => {
			const levelDiffClass = combat.considerClass[combat.getLevelDifferenceIndex(quests[index].level)]
			html += '<div class="mission-quest-item ellipsis ' + levelDiffClass +'" '+
				'data-id="'+ z.id +'" ' +
				'data-quest="'+ index +'">' +
				quests[index].title +
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
		if (id >= 0 && party.presence[0].isLeader) {
			// console.info("QUEST SELECTED: ", id, questId, title)
			mission.id = id
			mission.questId = questId
			// console.info("zone name: ", zones[mission.id].name)
			querySelector('#mission-preview').src = getZonePreviewImg(questId)
			$("#mission-title").html(quests[mission.questId].title);
			querySelector('#mission-level').innerHTML = levelHtml()
		}
		else {
			// TODO: non-party member needs to see something... EMBARK?
		}
	}
	function getZonePreviewImg(id) {
		const zoneName = mission.getZoneKey()
		const bgType = id % 2 === 1 ? 'room' : 'hallway'
		const index = 1
		return 'images/battle/' + zoneName + '-'+ bgType + '-'+ index +'.jpg'
	}
	function getZoneKey() {
		return _.kebabCase(zones[mission.id].name.replace(/'/g, ''))
	}
	function getZoneImg() {
		const zoneName = mission.getZoneKey()
		const bgType = map.inRoom ? 'room' : 'hallway'
		const index = 1
		return 'images/battle/' + zoneName + '-'+ bgType + '-'+ index +'.jpg'
	}

	function toggleZone() {
		that = $(this)
		// console.info('toggleZone', this.dataset.id)
		var zoneId = this.dataset.id * 1
		var index = zones.findIndex(z => z.id === zoneId);
		var z = zones[index];

		// console.info('JSON ', _.cloneDeep(zone));
		// console.info(index, "isOpen: ", zone.isOpen, zone);

		if (z.isOpen) {
			// close menu
			var e = that.find('.mission-minus')
			e.attr('src', 'images/ui/plus.png')
			e.removeClass().addClass(plusClasses)
			$("#mission-quest-list-wrap-" + z.id).css('display', 'none')
			z.isOpen = 0
		}
		else {
			// open menu
			var e = that.find('.mission-plus')
			e.attr('src', 'images/ui/minus.png')
			e.removeClass().addClass(minusClasses)
			$("#mission-quest-list-wrap-" + z.id).css('display', 'block')
			z.isOpen = 1
		}
	}
	function txReturnToTown() {
		if (party.presence[0].isLeader &&
			map.isShown) {
			rxReturnToTown()
			socket.publish('party' + my.partyId, {
				route: 'p->returnToTown',
			}, true)
		}
	}
	function rxReturnToTown() {
		mission.inProgress = false
		audio.stopAmbient()
		map.hide()
		if (ng.view !== 'town') {
			chat.log('Returning to town...', CHAT.WARNING)
		}
		ng.lock(1)

		// init client and transition back to town
		resetLocalQuestData();

		TweenMax.to('#scene-dungeon', 2, {
			filter: 'brightness(0)',
			onComplete: () => {
				// rejoin main chat
				town.go()
				chat.joinChannel('town', 1, true)
				game.getPresence()
				delayedCall(.5, () => {
					game.updateChat()
					chat.modeChange(CHAT.SAY)
				})
				ng.unlock()
			}
		})
	}

	function embark() {
		if (party.presence[0].isLeader) {
			mission.inProgress = true
			mission.isCompleted = false
			if (!_.size(dungeon.map)) {
				dungeon.map = Grid.createMap(quests[mission.questId].size)
				dungeon.createHallwayMobs()
				dungeon.map.rooms.forEach(dungeon.getRoomMobCount)
				dungeon.setBossRoom()
				map.init(dungeon.map)
			}
			console.info('embark', mission.id, mission.questId)
			// test mission defaults for fast test mission start-up
			if (!app.isApp && !mission.id) {
				// setup some mission data
				mission.inProgress = true
				mission.id = 0
			}
			var data = {
				route: 'p->embarkReceived',
				id: mission.id,
				questId: mission.questId,
				grid: dungeon.map,
			}
			// console.info('embark isLeader!', data)
			socket.publish('party' + my.partyId, data)
		}
	}

	function embarkReceived(data) {
		console.info("MISSION UPDATE! ", data)
		// all party updated on mission status
		mission.inProgress = true
		mission.isCompleted = false
		mission.id = data.id
		mission.questId = data.questId
		dungeon.map = data.grid
		map.init(dungeon.map)
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
		})
		ng.msg('Mission started: ' + quests[mission.questId].title)
		let questDelay = app.isApp ? 3 : 0
		delayedCall(questDelay, dungeon.go)
	}
	function isQuestCompleted() {
		return !dungeon.map.rooms.find(r => r.boss).isAlive
	}
})(TweenMax, $, _);