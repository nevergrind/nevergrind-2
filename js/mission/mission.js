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
		getQuestData,
		getTitle,
		getRewards,
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
						'<div id="mission-title">'+ mission.getTitle(mission.id, mission.questId) +'</div>' +
						'<div id="mission-level">'+ levelHtml(mission.id, mission.questId) + '</div>' +
					'</div>' +
					'<div id="mission-embark" class="ng-btn">Embark!</div>'
				}
				else {
					questHtml += '<div id="mission-waiting-msg">Waiting for the party leader to select a mission.</div>'
				}
			questHtml += '</div>' +
		'</div>'

		questHtml += '<div id="mission-counter" class="aside-frame text-shadow">'
		zones.forEach(zone => {
			if (my.level + 4 >= zone.level) {
				questHtml +=
				'<div class="mission-zone-headers '+ getOpenMenuClass(zone.level) + ' '+ combat.considerClass[combat.getLevelDifferenceIndex(zone.level)] +'" data-id="'+ zone.id +'">'+
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
		let html = '';
		let questId = 0
		let levelDiffClass
		let considerIndex
		zones[zone.id].missions.forEach((quest, questIndex) => {
			considerIndex = combat.getLevelDifferenceIndex(mission.getQuestData(zone.id, questIndex).level)
			levelDiffClass = combat.considerClass[considerIndex]
			html += '<div class="mission-quest-item ellipsis ' + levelDiffClass +'" '+
				'data-id="'+ zone.id +'" ' +
				'data-quest="'+ questIndex +'">' +
				mission.getTitle(zone.id, questIndex) +
			'</div>'
			questId++
		})

		if (!html) {
			html = '<div class="mission-quest-item">No missions found.</div>';
		}
		return html;
	}
	function levelHtml(zoneId, questId) {
		return 'Lv.' + zones[zoneId].missions[questId].level
	}
	function clickQuest() {
		var id = this.dataset.id * 1
		var questId = this.dataset.quest * 1
		if (id >= 0 && party.presence[0].isLeader) {
			console.info("QUEST SELECTED: ", id, questId, title)
			mission.id = id
			mission.questId = questId
			// console.info("zone name: ", zones[mission.id].name)
			querySelector('#mission-preview').src = getZonePreviewImg(questId)
			$("#mission-title").html(mission.getTitle(mission.id, mission.questId));
			querySelector('#mission-level').innerHTML = levelHtml(mission.id, mission.questId)
			audio.playSound('click-12')
		}
		else {
			// TODO: non-party member needs to see something... EMBARK?
			audio.playSound('beep-3')
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
			audio.playSound('click-3')
		}
		else {
			// open menu
			var e = that.find('.mission-plus')
			e.attr('src', 'images/ui/minus.png')
			e.removeClass().addClass(minusClasses)
			$("#mission-quest-list-wrap-" + z.id).css('display', 'block')
			z.isOpen = 1
			audio.playSound('click-2')
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
			audio.playSound('click-4', '', 1, 500)
			mission.inProgress = true
			mission.isCompleted = false
			// test mission defaults for fast test mission start-up
			if (!app.isApp && !mission.id && Config.enablePageUpZoning) {
				// setup some mission data
				test.setupMissionData()
			}
			if (!_.size(dungeon.map)) {
				dungeon.map = Grid.createMap(mission.getQuestData(mission.id, mission.questId).size)
				dungeon.createHallwayMobs()
				dungeon.map.rooms.forEach(dungeon.getRoomMobCount)
				dungeon.setBossRoom()
				map.init(dungeon.map)
			}
			console.info('embark', mission.id, mission.questId)
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
		console.info("MISSION UPDATE! ", data.id, data.questId, data)
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
		ng.msg('Mission started: ' + mission.getTitle(mission.id, mission.questId))
		let questDelay = app.isApp ? 3 : 0
		audio.playSound('click-4', '', 1, 500)
		delayedCall(questDelay, dungeon.rxGo)
	}
	function isQuestCompleted() {
		const type = mission.getQuestData(mission.id, mission.questId).type
		if (type === QUEST_TYPES.kill) {
			return !dungeon.map.rooms.find(r => r.boss).isAlive
		}
		else if (type === QUEST_TYPES.explore) {

		}
		else if (type === QUEST_TYPES.find) {

		}
		else if (type === QUEST_TYPES.slay) {

		}
		else {
			return false
		}
	}

	/**
	 * Returns the quest data object based on zone and quest index
	 * @param zoneId
	 * @param questId
	 * @returns {*}
	 */
	function getQuestData(zoneId, questId) {
		return zones[zoneId].missions[questId]
	}

	/**
	 * returns mission title based on mission id and quest type
	 * @param id
	 * @returns {string}
	 */
	function getTitle(zoneId, questId) {
		// console.info('getTitle', typeof id, id)
		const questObj = zones[zoneId].missions[questId]
		if (questObj.type === QUEST_TYPES.kill) {
			return 'Kill ' + questObj.bossName
		}
		else if (questObj.type === QUEST_TYPES.explore) {
			return 'Explore 90% of rooms '
		}
		else if (questObj.type === QUEST_TYPES.find) {
			return 'Find 5 items'
		}
		else if (questObj.type === QUEST_TYPES.slay) {
			return 'Slay 8 orcs'
		}
		else return ''
	}

	function getQuestExp(level) {
		// @1 6 @50 1275
		let expMultiplier = Math.max(.06 - (level * .01), .01)
		let exp = battle.expThreshold[level + 1] * expMultiplier
		// penalize for party members that are much higher
		if (party.expBrokenByAll()) exp = 0
		return exp
	}

	function getQuestGold(level) {
		return 15 + level * 5
	}

	function getRewards() {
		const questData = mission.getQuestData(mission.id, mission.questId)
		const type = questData.type
		const size = questData.size
		let exp = 0
		let gold = 0
		if (type === QUEST_TYPES.kill) {
			gold = getQuestGold(questData.level) * .5
			exp = getQuestExp(questData.level) * .75
		}
		else if (type === QUEST_TYPES.explore) {
			gold = getQuestGold(questData.level) * 1.5
			exp = getQuestExp(questData.level)
		}
		else if (type === QUEST_TYPES.find) {
			gold = getQuestGold(questData.level) * 1.25
			exp = getQuestExp(questData.level) * 1.25
		}
		else if (type === QUEST_TYPES.slay) {
			gold = getQuestGold(questData.level)
			exp = getQuestExp(questData.level) * 1.5
		}

		// NOTE: exp value 6-1275
		// NOTE: gold value 20-265
		// map size
		if (size === MAP_SIZES.small) {
			// do nothing
		}
		else if (size === MAP_SIZES.medium) {
			exp = exp * 1.35
			gold = gold * 1.35
		}
		else if (size === MAP_SIZES.large) {
			exp = exp * 2
			gold = gold * 2
		}
		gold = ~~gold
		exp = ~~exp
		// add exp and gold values
		if (gold) {
			mob.earnedGold += battle.addGold(gold, true)
		}
		if (exp) {
			mob.earnedExp += battle.addExp(exp, true)
		}
	}
})(TweenMax, $, _);