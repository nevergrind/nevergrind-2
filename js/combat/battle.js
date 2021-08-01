var battle;
(function(TweenMax, $, _, PIXI, Linear, Object, undefined) {
	battle = {
		layer: {},
		lastBuffAlreadyActive: false,
		buffIconTimers: {},
		expThreshold: [0,
			0, 100, 220, 365, 540, 750, 1000, 1295, 1640, 2040,
			2500, 3025, 3620, 4290, 5040, 5875, 6800, 7820, 8940, 10165,
			11500, 12950, 14520, 16215, 18040, 20000, 22110, 24345, 26740, 29290,
			32000, 34875, 37920, 41140, 44540, 48125, 51900, 55870, 60040, 64415,
			69000, 73800, 78820, 84065, 89540, 95250, 101200, 107395, 113840, 120540,
			127500, 134725, 142220, 149990, 158040, 166375, 175000, 183920, 193140, 202665,
			212500, 222650, 233120, 243915, 255040, 266500, 278300, 290445, 302940, 315790,
			329000, 342575, 356520, 370840, 385540, 400625, 416110, 431970, 448240, 464915,
			482000, 499500, 517420, 535765, 554540, 573750, 593400, 613495, 634040, 655040,
			676500, 698425, 720820, 743690, 767040, 790875, 815200, 840020, 865340, 891165
		],
		earnedExpRatio: [
			0, // grey
			.4, // 40%
			.6,
			.8,
			1,
			1.1, // 110%
			1.2, // orange 110%
			1.25, // red 120%
		],
		/* exp formula
		var arr = [100];
		var inc = 120
		for (var i=1; i<99; i++) {
			var newV = (arr[arr.length - 1] + inc)
			arr.push(newV)
			// console.info('arr inc', i, ~~inc)
			inc += 20 + (i * 5);
		}
		 */
		removeBuff,
		removeAllBuffs,
		getExpBarRatio,
		nextLevel,
		getSplashTarget,
		getConeTargets,
		getRandomTarget,
		go,
		show,
		html,
		targetIsFrontRow,
		targetIsBackRow,
		updateTarget,
		loadTextures,
		loadMobTexture,
		updateMobTargetBuffs,
		processBuffs,
		addMyBuff,
		removeMyBuffIcon,
		removeMyBuffFlag,
		hideTarget,
		showTarget,
		killAllBattleTimers,
		killMobBuffTimers,
		killTargetBuffTimers,
		killMyBuffTimers,
		drawExpBar,
		addGold,
		upsertGoldExp,
		upsertLevel,
		subtractExpPenalty,
		getDeathPenaltyRatio,
		getMinMobCount,
		getMaxMobCount,
		getRandomMobCount,
		handleMobClick,
		getMobLevelByQuest,
		getMobClassNameByTier,
		getMobClassNameByLevel,
	}
	let index, buffHtml, tierHtml, traitHtml, buffEl, key, keyRow, el, i
	let tgt = {}
	let ratio = 0
	let mobBuffData = {}
	let leveled = false
	let penalty = 0
	let battleSceneInitialized = false
	let buffImage = ''
	let mobStackCount = 0
	const FLASH_DURATION = 10
	const splashOrder = [0, 5, 1, 6, 2, 7, 3, 8, 4]
	let battleLayerInitialized = false
	const FLASH_BUFF_OBJ = {
		startAt: { opacity: 1 },
		repeat: -1,
		yoyo: true,
		opacity: .5,
		ease: Linear.easeNone,
	}

	init()

	//////////////////////////////////////
	function init() {
		$('#scene-battle')
			.on('click', '.mob-alive, .mob-details', handleMobClick)
			.on('mouseenter', '.mob-alive, .mob-details', handleMobEnter)
			.on('mouseleave', '.mob-alive, .mob-details', handleMobLeave)
	}
	function getDeathPenaltyRatio() {
		ratio = 0
		if (my.level >= 5) ratio = my.level / 150 // 20% @ level 30
		if (ratio > .25) ratio = .25
		return ratio
	}
	function subtractExpPenalty() {
		penalty = ~~(getDeathPenaltyRatio() * (battle.nextLevel() - battle.expThreshold[my.level]))
		if (my.exp - penalty < battle.expThreshold[my.level]) {
			// prevent de-level
			penalty = my.exp - battle.expThreshold[my.level]
		}
		// console.info('penalty', penalty)
		if (penalty) {
			battle.upsertGoldExp(-penalty, 0)
		}
	}

	function upsertGoldExp(exp = 0, gold = 0, isQuestExp = false) {
		let leveled = false // to determine UI updates
		// console.info('upsertGoldExp', mob.earnedExp, mob.earnedGold)
		if (my.exp + exp > battle.expThreshold[MAX_HERO_LEVEL]) {
			// max possible exp value
			exp = battle.expThreshold[MAX_HERO_LEVEL] - my.exp
		}
		$.post(app.url + 'character/upsert-gx.php', {
			exp: exp,
			gold: gold,
		}).done(() => {
			my.exp += exp
			// console.info('upsertGoldExp', exp, gold)
			if (exp > 0) {
				if (isQuestExp) {
					chat.log('You earned quest experience!', 'chat-exp')
				}
				else {
					chat.log('You earned experience!', 'chat-exp')
				}
				TweenMax.to(query.el('#exp-bar'), .3, {
					startAt: { filter: 'saturate(2) brightness(2)' },
					filter: 'saturate(1) brightness(1)',
					repeat: 1,
				})
			}
			else if (exp < 0) {
				chat.log('You lost experience!', 'chat-exp')
			}

			while (my.exp >= battle.nextLevel()) {
				// you leveled! Wow! (possibly multiple times if you cheated!?)
				leveled = true
				my.level++
				chat.log('You have reached level ' + my.level + '!', 'chat-level')
				stats.clearCache()
				button.updateWeaponPanel() // could be dual wielding now
				button.updatePotionPanel()
				if (bar.windowsOpen.character) {
					ng.html('#char-sheet-level', my.level)
				}
				audio.playSound('ding')
			}
			if (leveled) {
				for (var i=0; i<mob.max; i++) {
					mob.updateMobName(i)
				}
				battle.updateTarget()
				battle.upsertLevel()
			}
			if (exp !== 0) {
				// must be down here in case they leveled
				battle.drawExpBar()
			}

			if (gold !== 0) {
				town.setMyGold(my.gold + gold)
			}
		})
	}
	function upsertLevel() {
		$.post(app.url + 'character/upsert-level.php', {
			level: my.level,
		})
	}
	function getExpBarRatio() {
		const expThisLevel = my.exp - battle.expThreshold[my.level]
		const expNeeded = battle.nextLevel() - battle.expThreshold[my.level]
		return -(1 - (expThisLevel / expNeeded)) * 100
	}
	function nextLevel() {
		return battle.expThreshold[my.level + 1]
	}
	function addGold(gold, isQuestGold) {
		gold = ~~gold
		if (my.gold + gold > MAX_GOLD) {
			gold = MAX_GOLD - my.gold
		}
		if (gold) {
			if (isQuestGold) {
				chat.log('You quest reward is ' + gold + ' gold!', 'chat-gold')
			}
			else {
				chat.log('You found ' + gold + ' gold!', 'chat-gold')
			}
			bar.updateInventoryGold()
			audio.playSound('gold')
		}
		return gold
	}
	function drawExpBar(duration, dur) {
		duration = typeof duration === 'number' ? duration : .3
		// dur = typeof dur === 'number' ? dur : duration * 1.5
		TweenMax.to(query.el('#exp-bar'), duration, {
			x: getExpBarRatio() + '%',
		})
	}
	function getSplashTarget(shift, tgt) {
		shift = shift || 0
		if (tgt) index = _.findIndex(splashOrder, val => val === tgt)
		else index = _.findIndex(splashOrder, val => val === my.target)
		index = splashOrder[index + shift]
		return splashOrder.includes(index) ? index : -1
	}

	/**
	 * Returns an array of valid targets based on original target - spread 5
	 * @param tgt
	 */
	function getConeTargets(tgt = my.target, maxLength = 3) {
		if (typeof tgt === 'undefined') return
		// const splashOrder = [0, 5, 1, 6, 2, 7, 3, 8, 4]

		// _.findIndex(splashOrder, val => val === tgt)
		const mainSplashIndex = splashOrder.findIndex(t => t === tgt) // 4 for center
		// console.info('mainSplashIndex', mainSplashIndex)
		const tgts = []
		if (mob.isAlive(splashOrder[mainSplashIndex])) {
			tgts.push(splashOrder[mainSplashIndex])
		}
		const frontConeTargets = [-2, 2]
		const backConeTargets = [-1, 1]
		for (var i=0; i<2; i++) {
			// get random index and remove it
			let index = _.sample(frontConeTargets)
			_.remove(frontConeTargets, t => t === index)
			// check if alive by splashOrder
			const splashIndex = splashOrder[mainSplashIndex + index]
			// console.info('splashIndex', splashIndex, splashOrder.findIndex(t => t === splashIndex))
			if (mob.isAlive(splashIndex) && tgts.length < maxLength) {
				tgts.push(splashIndex)
			}
		}

		for (var i=0; i<2; i++) {
			// get random index and remove it
			let index = _.sample(backConeTargets)
			_.remove(backConeTargets, t => t === index)
			// check if alive by splashOrder
			const splashIndex = splashOrder[mainSplashIndex + index]
			// console.info('splashIndex', splashIndex, splashOrder.findIndex(t => t === splashIndex))
			if (mob.isAlive(splashIndex) && tgts.length < maxLength) {
				tgts.push(splashIndex)
			}
		}
		console.info('getConeTargets', tgts);
		return tgts
	}
	function getAllAliveMobs() {
		return mobs.reduce((acc, val, ind) => {
			if (mob.isAlive(ind)) acc.push(ind)
			return acc;
		}, [])
	}
	function getRandomTarget() {
		let aliveMobs = getAllAliveMobs()
		return aliveMobs[_.random(0, aliveMobs.length - 1)]
	}
	function targetIsFrontRow(tgt) {
		tgt = tgt || my.target
		return tgt >= 0 && tgt <= 4
	}
	function targetIsBackRow(tgt) {
		tgt = tgt || my.target
		return tgt > 4
	}
	function handleMobClick() {
		// console.info('handleMobClick', this)
		my.setTarget(this.getAttribute('index') * 1)
	}
	function handleMobEnter() {
		index = this.getAttribute('index') * 1
		my.hoverTarget = index
		// if (my.target !== index) querySelector('#mob-details-' + index).classList.add('block-imp')
	}
	function handleMobLeave() {
		index = this.getAttribute('index') * 1
		my.hoverTarget = -1
		// if (my.target !== index) querySelector('#mob-details-' + index).classList.remove('block-imp')
	}
	function go(data, isRespawn = false) {
		dungeon.walkDisabled = false // enable walking
		if (!isRespawn) {
			if (typeof data === 'object') {
				// party member receiving data
			}
			else if (ng.view === 'battle') {
				// huh?
				return
			}
		}
		item.resetDrop()
		mob.init()
		dungeon.killEntityTweens()
		town.closeVarious()
		chat.sizeDungeon()
		TweenMax.to('#scene-battle', .5, {
			startAt: { filter: 'brightness(0)' },
			delay: .5,
			filter: 'brightness(1)'
		});
		TweenMax.to('#sky-wrap', .5, {
			startAt: { filter: 'brightness(0)' },
			delay: .5,
			filter: 'brightness(1)'
		})
		game.showScene('scene-battle')
		if (chat.modeCommand === '/say') {
			chat.modeChange(CHAT.PARTY)
		}

		ng.setScene('battle')
		my.channel = ''
		if (!mob.initialized) {
			// initialization things only
			mob.initialized = 1;
			mob.imageKeys = Object.keys(mobs.images)
			mob.index = mob.imageKeys.length - 1
		}

		party.damage = {}
		party.presence.forEach(member => {
			party.damage[member.row] = 0
		})
		button.setAll()
		initBattleLayer()
		player.updateAllPlayerSprites() // does nothing right now

		// add this to test out mob placement etc;
		// also required to configure the mobs images array properly
		if (typeof data === 'object' &&
			typeof data.config === 'object' &&
			data.config.length) {
			// rx setup
			setupMobs(data.config)
		}
		else {
			// leader tx setup
			setupMobs()
		}

		// set to center target
		console.info('p->goBattle txData!', mob.txData)
		if (my.target === -1 && mob.txData.some(m => m.name)) {
			my.target = 2
			my.targetIsMob = true
			combat.targetChanged()
			my.fixTarget()
		}
		battle.updateTarget()
		party.combatStartLength = party.totalPlayers()

		if (party.presence[0].isLeader &&
			party.hasMoreThanOnePlayer() &&
			!isRespawn) {
			socket.publish('party' + my.partyId, {
				route: 'p->goBattle',
				config: mob.txData // from setupMobs
			}, true)
		}

		if (combat.isBattleOver()) {
			// nothing in this room
			map.inCombat = false
			map.show(1.5)
		}
		else {
			audio.playMusic('battle' + _.random(1, 3))
			map.inCombat = true
			// audio.stopAmbient()
			map.hide()
		}
	}
	function initBattleLayer() {
		if (battleLayerInitialized) return
		battleLayerInitialized = true

		battle.layer = new PIXI.Application({
			width: MAX_WIDTH,
			height: MAX_HEIGHT,
			transparent: true
		});
		/*const defaultIcon = "url('css/cursor/normal.png'), auto"
		const hoverIcon = "url('css/cursor/sword-color.png'), auto"
		battle.layer.renderer.plugins.interaction.cursorStyles.default = defaultIcon
		battle.layer.renderer.plugins.interaction.cursorStyles.hover = hoverIcon*/
		battle.layer.stage.sortableChildren = true
		battle.layer.view.id = 'battle-layer'
		// battle.layer.view.style.pointerEvents = 'none'
		battle.layer.view.style.position = 'absolute'
		battle.layer.view.style.zIndex = 1
		querySelector('#scene-battle').appendChild(battle.layer.view)
		combat.updateCanvasLayer()
	}

	/**
	 * Gets random mob level by quest level
	 * @returns {number}
	 */
	function getMobLevelByQuest(minZoneLevel) {
		const maxLevel = mission.getQuestData(mission.id, mission.questId).level
		let minLevel
		if (maxLevel < 10) {
			minLevel = Math.max(1, ~~(maxLevel * .65))
		}
		else if (maxLevel < 20) {
			minLevel = Math.max(1, ~~(maxLevel * .75))
		}
		else if (maxLevel < 25) {
			minLevel = Math.max(1, ~~(maxLevel * .8))
		}
		else if (maxLevel < 30) {
			minLevel = Math.max(1, ~~(maxLevel * .85))
		}
		else {
			minLevel = Math.max(1, ~~(maxLevel * .9))
		}
		if (minLevel < 1) minLevel = 1
		minLevel = Math.max(minLevel, minZoneLevel)
		// console.info('getMobLevelByQuest', minLevel +'-'+ maxLevel)
		return _.random(minLevel, maxLevel)
	}

	let mobCount = 0
	function setupMobs(config) {
		// console.info('setupMobs', config)
		if (typeof config === 'object') {
			console.warn('FOLLOWER SETUP MOBS', config)
			// followers
			config.forEach((mobData, index) => {
				if (mobData.name) {
					mob.setMob(index, mobData, true)
				}
			})
		}
		else {
			console.warn('LEADER SETUP MOBS')
			// leader
			/*let minLevel = Math.max(~~(mission.getQuestData(mission.id, mission.questId).level * .7), 1)
			*/
			let maxLevel = mission.getQuestData(mission.id, mission.questId).level

			// maps[dungeon.map.id].rooms[map.roomId].mobs
			let totalMobs
			if (map.inRoom && map.roomId === 0 ||
				map.inRoom && !dungeon.map.rooms[map.roomId].isAlive) {
				// starting room always empty - only time a room is empty?
				totalMobs = 0
			}
			else {
				totalMobs = battle.getRandomMobCount()
			}

			// this will limit mobs to front row for early missions
			// let maxMobs = mission.getQuestData(mission.id, mission.questId).level <= 10 ? 5 : mob.max
			let maxMobs = mob.max
			mob.txData = []
			for (var i=0; i<maxMobs; i++) {
				mob.txData.push({})
			}

			// full room for testing
			/*if (!app.isApp && (map.roomId || (!map.inRoom && map.hallwayId))) {
				totalMobs = 9
			}*/
			// console.info('levels', minLevel, maxLevel)
			let mobSlot
			let minZoneLevel = zones.find(z => z.name === zones[mission.id].name).level
			// console.info('totalMobs', totalMobs)
			for (i=0; i<totalMobs; i++) {
				let q = {
					level: battle.getMobLevelByQuest(minZoneLevel)
				}
				if (Config.enableMobTestClass) {
					q.job = JOB.WIZARD
				}
				/* ill-fated idea ... maybe for only first 2 dungeons?
				if (my.level < 2) {
					if (q.level > my.level) q.level = my.level
				}*/
				let tierLotto = _.random(1, 100)

				if (map.inRoom &&
					dungeon.map.rooms[map.roomId].boss &&
					dungeon.map.rooms[map.roomId].isAlive &&
					i === 0) {
					// boss room logic
					q.name = mission.getQuestData(mission.id, mission.questId).bossName
				}
				else {
					if (i === 0) {
						// add hallway query data for main mob only
						if (!map.inRoom) {
							// add hallway query for 0 index only
							const entityProps = getNearestHallwayEntity()
							dungeon.mobKeys.forEach(key => {
								if (key === 'img' ||
									key === 'level' ||
									key === 'tier' && entityProps[key] === MOB_TYPES.unique) {
									// only update the query for these conditions
									q[key] = entityProps[key]
								}
							})
							console.warn('entityProps', entityProps)
						}
					}
					// is it a unique?
					if (mob.isUniqueTier(tierLotto)) {
						q.tier = MOB_TIERS.unique
					}
					// is it a champion?
				}
				// tries to find by name first and then by img
				/*if (Config.testMob && !mobCount) {
					q.name = 'Gyz Tamebeam'
				}*/
				mobCount++
				console.warn('query', q)
				const randomMob = mob.getRandomMobByZone(q)
				// console.info('randomMob', randomMob)
				let mobConfig = {
					traits: {},
					expPerLevel: 3,
					...randomMob,
				}

				// MOB_TIERS - add champion, unique, boss traits
				if (everyMobsNormal()) {
					// only one mob can be non-normal
					if (mob.isUniqueTier(tierLotto) && randomMob.tier === MOB_TIERS.unique) {
						// unique mobs
						mobConfig.tier = MOB_TIERS.unique
						mobConfig.traits = randomMob.traits
					}
					else if (mobConfig.tier === MOB_TIERS.normal &&
						tierLotto >= 97 && tierLotto <= 99 &&
						maxLevel >= 5 || Config.forceChampion) {
						// champion mobs - get random key
						// TODO: For now this only supports one total trait
						mobConfig.tier = MOB_TIERS.champion
						if (_.size(mobConfig.traits) === 0) {
							mobConfig.traits[getChampionKey()] = true
						}
					}
				}
				// slot determination
				if (i === 0) {
					mobSlot = 2
				}
				else {
					mobSlot = getAvailableSlot(mobConfig)
				}

				// console.info('setupMobs', _.cloneDeep(mobConfig))

				if (typeof mobSlot === 'number') {
					// fails to set the mob if there's no room found
					mob.setMob(mobSlot, mobConfig)
				}
			}
		}
	}

	/**
	 * Are any mobs champions, uniques, bosses, etc?
	 * @returns {boolean}
	 */
	function everyMobsNormal() {
		return mobs.every(m => m.tier === 'normal')
	}

	/**
	 * Get available battle slot by mob jobs - try to put casters in the back
	 * @param mobConfig
	 * @param availableSlots
	 * @returns {number}
	 */
	const FRONT_ROW_JOBS = [
		JOB.WARRIOR,
		JOB.MONK,
		JOB.ROGUE,
		JOB.CRUSADER,
		JOB.SHADOW_KNIGHT,
	]
	const BACK_ROW_JOBS = [
		JOB.WIZARD,
		JOB.TEMPLAR,
		JOB.WARLOCK,
		JOB.ENCHANTER,
		JOB.SHADOW_KNIGHT,
	]
	function getAvailableSlot(mobConfig) {
		let extraSlots = Boolean(mobs.images[mobConfig.img].extraSlots)
		let availableSlots = []
		let prevMob, nextMob
		mobs.forEach(processAvailabilityBySlot)
		if (FRONT_ROW_JOBS.includes(mobConfig.job)) {
			if (availableSlots.some(byFrontRow)) {
				availableSlots = availableSlots.filter(byFrontRow)
			}
		}
		else if (BACK_ROW_JOBS.includes(mobConfig.job)) {
			if (availableSlots.some(byBackRow)) {
				availableSlots = availableSlots.filter(byBackRow)
			}
		}
		// console.info('availableSlots', availableSlots)
		return _.sample(availableSlots)
		/////////////////////////
		function processAvailabilityBySlot(_mob, index) {
			prevMob = mobs[index - 1]
			nextMob = mobs[index + 1]
			if (extraSlots) {
				if (!_mob.name) {
					if (index <= 4) {
						if (
							(index === 0 || !_.get(prevMob, 'name')) &&
							(index === 4 || !_.get(nextMob, 'name'))
						) {
							availableSlots.push(index)
						}
					}
					else {
						if (
							(index === 5 || !_.get(prevMob, 'name')) &&
							(index === 8 || !_.get(nextMob, 'name'))
						) {
							availableSlots.push(index)
						}
					}
				}
			}
			else {
				if (!_mob.name) {
					if (index <= 4) {
						if (
							(index === 0 || !_.get(prevMob, 'extraSlots')) &&
							(index === 4 || !_.get(nextMob, 'extraSlots'))
						) {
							availableSlots.push(index)
						}
					}
					else {
						if (
							(index === 5 || !_.get(prevMob, 'extraSlots')) &&
							(index === 8 || !_.get(nextMob, 'extraSlots'))
						) {
							availableSlots.push(index)
						}
					}
				}
			}
		}
	}
	function byFrontRow(v) {
		return v <= 4
	}
	function byBackRow(v) {
		return v >= 5
	}

	function getNearestHallwayEntity() {
		const aliveEntitiesInHallway = dungeon.map.hallways[map.hallwayId].entities.filter(e => e.isAlive)
		if (map.compass < 2) {
			// north/east
			return _.first(aliveEntitiesInHallway)
		} else {
			// south/west
			return _.last(aliveEntitiesInHallway)
		}
	}
	function getChampionKey() {
		return _.sample(Object.keys(MOB_TRAITS))
	}
	function getRandomMobCount() {
		return _.random(battle.getMinMobCount(), battle.getMaxMobCount())
	}

	let questData = {}
	function getMinMobCount() {
		questData = mission.getQuestData(mission.id, mission.questId)
		if (mission.isHeroicQuest) {

		}
		else {
			if (map.inRoom) {
				if (questData.level < 5) return 1
				else if (questData.level < 10) return 1
				else if (questData.level < 20) return 2
				else if (questData.level < 30) return 2
				else return 3
			}
			else {
				// hallways
				if (questData.level < 5) return 1
				else if (questData.level < 10) return 1
				else if (questData.level < 20) return 2
				else if (questData.level < 30) return 2
				else return 2
			}

		}
	}
	function getMaxMobCount() {
		questData = mission.getQuestData(mission.id, mission.questId)
		if (mission.isHeroicQuest) {

		}
		else {
			if (map.inRoom) {
				if (questData.level < 5) return 1
				else if (questData.level < 10) return 2
				else if (questData.level < 15) return 2
				else if (questData.level < 20) return 3
				else if (questData.level < 25) return 3
				else if (questData.level < 30) return 3
				else return 3
			}
			else {
				// hallways
				if (questData.level < 5) return 1
				else if (questData.level < 10) return 2
				else if (questData.level < 15) return 2
				else if (questData.level < 20) return 2
				else if (questData.level < 25) return 2
				else if (questData.level < 30) return 3
				else return 3
			}
		}
	}
	function loadTextures() {
		if (_.size(mob.textures) === 0) {
			zones[mission.id].mobs.forEach(name => {
				console.warn('loading mob', name)
				battle.loadMobTexture(name)
			})
		}
	}
	function loadMobTexture(mobImage) {
		if (typeof mob.textures[mobImage] === 'undefined') {
			mob.textures[mobImage] = []
			for (var i=1; i<=105; i++) {
				mob.textures[mobImage][i] = PIXI.Texture.from('mobs/'+ mobImage +'/'+ i +'.png')
			}
		}
	}
	function showTarget() {
		query.el('#mob-target-wrap').style.display = 'flex'
	}
	function hideTarget() {
		query.el('#mob-target-wrap').style.display = 'none'
	}

	/**
	 * Draws the DOM target based on index and target type
	 * @param drawInstant
	 */
	function updateTarget(drawInstant) {
		if (combat.isValidTarget()) {
			if (my.targetIsMob) {
				tgt = {
					// combat.considerClassBg[combat.getLevelDifferenceIndex(mobs[my.target].level)]
					levelClass: battle.getMobClassNameByLevel(my.target) +' text-shadow3',
					nameClass: battle.getMobClassNameByLevel(my.target) +' '+ battle.getMobClassNameByTier(my.target),
					level: mobs[my.target].level,
					name: mobs[my.target].name,
					tier: mobs[my.target].tier,
					hp: ceil(100 - bar.getRatio(PROP.HP, mobs[my.target])),
					traits: getMobTargetTierAndTraitsHtml(),
					buffs: getMobTargetBuffsHtml(),
					resists: getMobResists(my.target)
				}
			}
			else {
				tgt = {
					levelClass: 'con-white text-shadow3',
					nameClass: 'con-white',
					level: party.presence[party.getIndexByRow(my.target)].level,
					name: party.getNameByRow(my.target),
					tier: MOB_TIERS.normal,
					hp: ceil(100 - bar.getRatio(PROP.HP, party.presence[party.getIndexByRow(my.target)])),
					traits: 'Player',
					mobType: 'humanoid',
					buffs: '',
					resists: '',
				}
			}
			// battle.getMobClassNameByLevel(i) +' '+ battle.getMobClassNameByTier(i)
			// console.info('tgt', tgt)
			// level
			querySelector('#mob-target-level').className = tgt.levelClass
			querySelector('#mob-target-level').textContent = tgt.level
			// name
			querySelector('#mob-target-name').className = tgt.nameClass
			querySelector('#mob-target-name').textContent = tgt.name
			// plate
			querySelector('#mob-target-hp-plate').className = 'mob-plate-' + tgt.tier
			querySelector('#mob-target-hp-plate').src = 'images/ui/bar-' + tgt.tier + '.png'
			// percent, traits, buffs
			querySelector('#mob-target-percent').textContent = tgt.hp + '%'
			querySelector('#mob-target-traits').innerHTML = tgt.traits
			querySelector('#mob-target-buffs').innerHTML = tgt.buffs
			querySelector('#mob-target-resists').innerHTML = tgt.resists
			if (tgt.resists) {

			}
			showTarget()
		}
		else {
			hideTarget()
		}

		if (my.targetIsMob) {
			startBuffTimers()
			mob.drawMobBar(my.target, drawInstant)
		}
	}
	function getMobResists(tgt) {
		let html = []
		for (var key in mobs[tgt].resist) {
			if (mobs[tgt].resist[key] <= 0) {
				html.push(key + ' immune')
			}
			else if (mobs[tgt].resist[key] < 1) {
				html.push(key + ' resistant')
			}
		}
		return html.join(' ')
	}
	function getMobClassNameByLevel(tgt) {
		return combat.considerClass[combat.getLevelDifferenceIndex(mobs[tgt].level)]
	}
	function getMobClassNameByTier(tgt) {
		return 'mob-tier-'+ mobs[tgt].tier
	}
	function getMobTargetTierAndTraitsHtml() {
		// remove trailing s from value
		if (typeof mobs[my.target].img === 'undefined') return
		// mobType + type e.g. Humanoid Champion

		// type and tier
		tierHtml = '<div class="mob-types capitalize">' +
			(mobs[my.target].tier === 'normal' ? '' : ' ' + mobs[my.target].tier) + ' ' +
			mob.type[mobs[my.target].img].mobType +
		'</div>'
		// traits
		traitHtml = []
		// console.info('mobs[my.target].traits', mobs[my.target].traits)
		for (var traitKey in mobs[my.target].traits) {
			traitHtml.push('<div class="mob-trait">' + MOB_TRAITS[traitKey] + '</div>')
		}
		return tierHtml + '<div id="trait-row-wrap">' +
			traitHtml.join('<div class="trait-pipe"></div>') +
			'</div>'
	}
	function getMobTargetBuffsHtml() {
		buffHtml = ''
		for (key in mobs[my.target].buffs) {
			mobBuffData = mobs[my.target].buffs[key]
			buffImage = 'url(images/skills/' + buffs[mobBuffData.key].job + '/' + buffs[mobBuffData.key].img + '.png)'
			mobStackCount = buffs[mobBuffData.key].stacks ?
				mobBuffData.stacks : ''
			buffHtml += '<div id="buff-'+ key + '" class="target-buff popover-icons" style="background-image: '+
				buffImage +
			'">'+ mobStackCount + '</div>'
		}
		return buffHtml
	}
	function updateMobTargetBuffs() {
		querySelector('#mob-target-buffs').innerHTML = getMobTargetBuffsHtml()
	}
	function mobBuffTimerExists(i, key) {
		// kill existing buff timer for player
		return typeof mobs[i] === 'object' &&
			typeof mobs[i].buffs[key] === 'object' &&
			typeof mobs[i].buffs[key].timer === 'object'
	}
	function processBuffs(arrayOfBuffs) {
		let updateTargetBuffs = false
		arrayOfBuffs.forEach(buff => {
			// buff needs i, key, row
			if (my.targetIsMob && my.target === buff.i) updateTargetBuffs = true
			let buffKeyRow = buff.key + '-' + buff.row
			// is duration dynamically specified?
			let duration = buff.duration || buffs[buff.key].duration
			// handle dauntless duration adjustments
			// console.info('processBuffs duration', buff)
			if (mobBuffTimerExists(buff.i, buffKeyRow)) {
				mobs[buff.i].buffs[buffKeyRow].timer.kill()
			}

			if (typeof mobs[buff.i].buffs[buffKeyRow] === 'object'
				&& mobs[buff.i].buffs[buffKeyRow].duration === 0) {
				// this should force re-order to end of the object
				// this makes new debuffs appear at the end
				delete mobs[buff.i].buffs[buffKeyRow]
			}
			mobs[buff.i].buffs[buffKeyRow] = {
				row: buff.row,
				key: buff.key,
				level: buff.level,
				duration: duration,
				stacks: typeof mobs[buff.i].buffs[buffKeyRow] === 'object' ?
					mobs[buff.i].buffs[buffKeyRow].stacks : void 0
			}
			// animate the actual duration down to 0
			mobs[buff.i].buffs[buffKeyRow].timer = TweenMax.to(mobs[buff.i].buffs[buffKeyRow], duration, {
				duration: 0,
				ease: Linear.easeNone,
				onComplete: removeMobBuffFlag,
				onCompleteParams: [buff.i, buff.key],
			})
			mobs[buff.i].buffFlags[buff.key] = true
			// status effects
			// console.info('processBuffs', buff)
			if (buffs[buff.key].stacks) {
				if (typeof mobs[buff.i].buffs[buffKeyRow].stacks === 'number') {
					if (mobs[buff.i].buffs[buffKeyRow].stacks < buffs[buff.key].stacks) {
						mobs[buff.i].buffs[buffKeyRow].stacks++
					}
				}
				else {
					mobs[buff.i].buffs[buffKeyRow].stacks = 1
				}
				// mobs[buff.i].buffs[buffKeyRow] = mobs[buff.i].buffs[buff.key].stacks
				// console.info('stac', mobs[buff.i].buffs[buffKeyRow].stacks)
			}
			if (buff.duration) {
				// console.warn('processBuffs effect found', buff.i, buff.key, buff.duration)
				if (buff.key === 'stun') mobEffects.stun(buff.i, buff.duration)
				else if (buff.key === 'freeze') mobEffects.freeze(buff.i, buff.duration)
				else if (buff.key === 'chill') mobEffects.chill(buff.i, buff.duration)
				else if (buff.key === 'fear') mobEffects.fear(buff.i, buff.duration)
				else if (buff.key === 'paralyze') mobEffects.paralyze(buff.i, buff.duration)
				else if (buff.key === 'stasisField') mobEffects.stasis(buff.i, buff.duration)
			}
		})
		// updates the DOM based on mob buffs
		updateTargetBuffs && updateMobTargetBuffs()
		startBuffTimers()
	}
	function removeMobBuffFlag(i, buffKey) {
		var buffStillActive = false
		for (keyRow in mobs[i].buffs) {
			if (buffKey === mobs[i].buffs[keyRow].key &&
				mobs[i].buffs[keyRow].duration > 0) {
				buffStillActive = true
			}

			if (buffs[buffKey].stacks) {
				if (typeof mobs[i].buffs[keyRow].stacks === 'number') {
					if (mobs[i].buffs[keyRow].duration === 0) {
						mobs[i].buffs[keyRow].stacks = 0
					}
				}
			}
		}
		if (!buffStillActive) mobs[i].buffFlags[buffKey] = false

	}
	function startBuffTimers() {
		if (my.target < 0) return
		let tgt = my.target
		// kill previous
		for (key in battle.buffIconTimers) {
			if (typeof battle.buffIconTimers[key] === 'object') {
				battle.buffIconTimers[key].kill()
				if (typeof battle.buffIconTimers[key + '-remove'] === 'object') {
					battle.buffIconTimers[key + '-remove'].kill()
				}
			}
		}
		battle.buffIconTimers = {}
		// start current
		if (mobs[my.target] !== void 0) {
			for (key in mobs[my.target].buffs) {
				if (mobs[tgt].buffs[key].duration < FLASH_DURATION) {
					flashTargetBuff(key, tgt)
				}
				else {
					// console.info('flashTargetBuff startBuffTimers', key, tgt, mobs[tgt].buffs[key].duration)
					battle.buffIconTimers[key] = delayedCall(
						mobs[tgt].buffs[key].duration - FLASH_DURATION,
						flashTargetBuff, [key, tgt]
					)
				}
				// console.info('startBuffTimers key', key, mobs[my.target].buffs[key].duration)
			}
		}
	}
	function flashTargetBuff(key, tgt) {
		// console.warn('flashTargetBuff startBuffTimers', key, tgt)
		battle.buffIconTimers[key] = TweenMax.to('#buff-' + key, .5, {
			startAt: { opacity: 1 },
			repeat: -1,
			yoyo: true,
			opacity: .5,
			ease: Linear.easeNone,
		})
		battle.buffIconTimers[key + '-remove'] = delayedCall(
			mobs[tgt].buffs[key].duration,
			removeTargetBuff, [key]
		)
		// console.info('startBuffTimers less 10', mobs[my.target].buffs[key].duration)
	}
	function removeTargetBuff(key) {
		// console.info('removeTargetBuff startBuffTimers', key)
		if (typeof battle.buffIconTimers[key] === 'object') {
			battle.buffIconTimers[key].kill()
			if (typeof battle.buffIconTimers[key + '-remove'] === 'object') {
				battle.buffIconTimers[key + '-remove'].kill()
			}
		}
		/*if (battle.buffIconTimers[key] !== null) battle.buffIconTimers[key] = null
		if (battle.buffIconTimers[key + '-remove'] !== null) battle.buffIconTimers[key + '-remove'] = null*/
		buffEl = querySelector('#buff-' + key)
		// console.info('removeTargetBuff', key, battle.buffIconTimers)
		if (buffEl !== null) buffEl.parentNode.removeChild(buffEl)
		if (popover.lastHoverId.startsWith('buff-')) popover.hide()
	}
	///////////////////////// myBuffs
	function addMyBuff(key, keyRow, duration) {
		duration = duration || buffs[key].duration
		// buffs that can only be active once
		if (typeof keyRow === 'undefined') keyRow = key
		// console.info('addMyBuff', key, keyRow)

		// console.info('stack count', my.buffs[key].stacks)
		if (buffs[key].stacks === void 0 ||
			my.buffs[key].stacks === 1) {
			// console.info('ADDING BUFF')
			el = createElement('div')
			el.id = 'mybuff-' + keyRow
			el.className = 'buff-icons popover-icons text-shadow3'
			el.style.backgroundImage = 'url(images/skills/' + buffs[key].job + '/' + buffs[key].img + '.png)'
			if (buffs[key].stacks !== void 0) {
				el.textContent = my.buffs[key].stacks
			}
			query.el('#mybuff-wrap').appendChild(el)
		}
		else {
			// console.info('UPDATING BUFF')
			querySelector('#mybuff-' + keyRow).textContent = my.buffs[key].stacks
			TweenMax.set(querySelector('#mybuff-' + keyRow), {
				opacity: 1
			})
		}

		if (duration > 0) {
			if (typeof my.buffIconTimers[keyRow] === 'object') {
				my.buffIconTimers[keyRow].kill()
				if (typeof my.buffIconTimers[keyRow + '-remove'] === 'object') {
					my.buffIconTimers[keyRow + '-remove'].kill()
				}
			}
			// start timer
			if (duration < FLASH_DURATION) flashMyBuff(key, keyRow)
			else {
				my.buffIconTimers[keyRow] = delayedCall(duration - FLASH_DURATION, flashMyBuff, [key, keyRow])
			}
		}
	}
	function flashMyBuff(key, keyRow) {
		// console.info('flashMyBuff', key)
		my.buffIconTimers[keyRow] = TweenMax.to('#mybuff-' + keyRow, .5, FLASH_BUFF_OBJ)
		my.buffIconTimers[keyRow + '-remove'] = delayedCall(my.buffs[keyRow].duration, removeMyBuffIcon, [key, keyRow])
	}
	function removeMyBuffFlag(keyRow, skipMsgCheck = false) {
		/**
		 * Buff naturally times out via duration
		 */
		// console.info('removeMyBuffFlag', keyRow)
		var startedActive = my.buffFlags[keyRow]
		var buffStillActive = false
		for (var k in my.buffs) {
			if (keyRow === my.buffs[k].key &&
				my.buffs[k].duration > 0) {
				buffStillActive = true
			}
		}
		if (!buffStillActive) {
			my.buffFlags[keyRow] = false
			if (skipMsgCheck) {
				// mob DoTs fade
				// console.info('key 2', keyRow)
				combat.processStatBuffsToMe(getBuffKey(keyRow))
			}
			else {
				// check msg and process stats?
				if (startedActive &&
					buffs[getBuffKey(keyRow)].fadeMsg) {
					if (!battle.lastBuffAlreadyActive) {
						// suppresses remove message in cases where buff is being refreshed
						chat.log(buffs[getBuffKey(keyRow)].fadeMsg, CHAT.HEAL)
					}
					// buff faded and stats post-fade must be processed
					combat.processStatBuffsToMe(getBuffKey(keyRow))
				}
			}
		}
	}
	function getBuffKey(keyRow) {
		if (keyRow.includes('-')) keyRow = keyRow.split('-')[0]
		return keyRow
	}
	function removeMyBuffIcon(key, keyRow) {
		/**
		 * Buff naturally times out via duration
		 */
		// console.info('removeMyBuff', key, keyRow)
		if (typeof keyRow === 'undefined') keyRow = key
		// only when it has DURATION
		if (typeof my.buffIconTimers[keyRow] === 'object') {
			my.buffIconTimers[keyRow].kill()
			if (typeof my.buffIconTimers[keyRow + '-remove'] === 'object') {
				my.buffIconTimers[keyRow + '-remove'].kill()
			}
		}
		if (typeof my.buffs[key] === 'object' &&
			typeof buffs[key] === 'object' &&
			buffs[key].stacks) {
			my.buffs[key].stacks = 0
		}
		buffEl = querySelector('#mybuff-' + keyRow)
		if (buffEl !== null) buffEl.parentNode.removeChild(buffEl)
	}

	/**
	 * Remove the duration and damage if it exists, set the level to 0
	 * Remove the buffFlag and the icon
	 * @param key
	 * @param keyRow
	 */
	function removeBuff(key, keyRow) {
		/**
		 * removes flag and icon - Used for pre-emptive removal before the timer is done
		 */
		if (typeof my.buffs[key] === 'object') {
			if (my.buffs[key].level) my.buffs[key].level = 0
			if (my.buffs[key].duration) {
				if (typeof my.buffs[key].timer === 'object') {
					my.buffs[key].timer.kill()
				}
				my.buffs[key].duration = 0
			}
			if (my.buffs[key].damage) my.buffs[key].damage = 0
		}
		removeMyBuffFlag(key)
		removeMyBuffIcon(key, keyRow)
	}

	function removeAllBuffs() {
		for (var key in my.buffFlags) {
			if (typeof my.buffs[key] === 'object') {
				if (my.buffs[key].duration > 0
					|| my.buffs[key].damage > 0) {
					// console.info('regular key', key)
					removeBuff(key)
				}
				// console.info(key, my.buffs[key])
			}
		}
		// try to remove DoTs
		for (var key in my.buffs) {
			// key is a compound key
			if (my.buffs[key].duration > 0) {
				my.buffs[key].hotTicks.kill()
				removeBuff(key.split('-')[0], key)
			}
		}
		killMobBuffTimers()
	}

	function killAllBattleTimers() {
		removeAllBuffs()
		killTargetBuffTimers()
		killMyBuffTimers()
		querySelector('#mob-target-buffs').innerHTML = ''
		querySelector('#mybuff-wrap').innerHTML = ''
	}
	function killMyBuffTimers() {
		for (key in my.buffIconTimers) {
			if (typeof my.buffIconTimers[key] === 'object') {
				my.buffIconTimers[key].kill()
			}
		}
		for (key in my.buffs) {
			if (typeof my.buffs[key] === 'object' &&
				typeof my.buffs[key].timer === 'object') {
				my.buffs[key].timer.kill()
			}
			my.buffs[key].duration = 0
			if (typeof my.buffs[key].hotTicks === 'object') {
				my.buffs[key].hotTicks.kill()
			}

		}
		for (key in my.buffFlags) {
			my.buffFlags[key] = false
		}
	}
	function killMobBuffTimers() {
		if (!mob.initialized) return
		var i=0
		// mob buff/debuffs
		for (; i<mob.max; i++) {
			for (key in mobs[i].buffs) {
				if (mobBuffTimerExists(i, key)) {
					mobs[i].buffs[key].timer.kill() // tweens duration
					mobs[i].buffs[key].duration = 0 // set duration to 0 so flags update
					//if (typeof mobs[i].buffs[key].dotTicks ===)
					if (typeof mobs[i].buffs[key].dotTicks === 'object') {
						mobs[i].buffs[key].dotTicks.kill()
					}
				}
			}
			for (key in mobs[i].buffFlags) {
				if (mobBuffTimerExists(i, key)) {
					mobs[i].buffFlags[key] = false
				}
			}
			timers.clearMob(i)
		}
	}
	function killTargetBuffTimers() {
		if (!mob.initialized) return
		// mob buff icon flash/remove timers
		for (key in battle.buffIconTimers) {
			if (typeof battle.buffIconTimers[key] === 'object') {
				battle.buffIconTimers[key].kill()
				if (typeof battle.buffIconTimers[key + '-remove'] === 'object') {
					battle.buffIconTimers[key + '-remove'].kill()
				}
			}
		}
	}

	function html() {
		// console.info('target:', my.target)
		var s = '<img id="battle-bg" src="'+ mission.getZoneImg() +'">';

		// s += '<div id="mob-target-wrap" class="text-shadow3"></div>'
		for (var i=0; i<mob.max; i++){
			s += '<div id="mob-wrap-' +i+ '" class="mob-wrap' + (i > 4 ? ' mob-back-row' : ' mob-front-row') +'">' +
				'<div id="mob-details-' +i+ '" class="mob-details" index="' + i + '">' +
					'<div class="flex-row flex-center" style="position: relative; margin-bottom: .25rem">' +
						'<div id="mob-level-'+ i +'"></div>' +
						'<div id="mob-name-' +i+ '" class="mob-name text-shadow3"></div>' +
						'<img id="mob-target-avatar-' +i+ '" class="mob-target-avatar" src="'+ my.avatar +'">' +
					'</div>' +
					'<div class="flex-center">'+
						'<div id="mob-bar-' +i+ '" class="mob-bar">' +
							'<div id="mob-health-' +i+ '" class="mob-health"></div>' +
							'<div class="mob-health-grid"></div>' +
						'</div>' +
					'</div>' +
				'</div>' +
				'<div id="mob-alive-' +i+ '" class="mob-alive" index="' + i + '"></div>' +
				'<div id="mob-dead-' +i+ '" class="mob-dead" index="' + i + '"></div>' +
			'</div>'
		}
		s += '<div id="quest-bg"></div>'
		return s;
	}
	function show() {
		ng.setScene('battle');
		if (battleSceneInitialized) {
			getElementById('scene-battle').style.display = 'block'
			querySelector('#battle-bg').src = mission.getZoneImg()
			battle.layer.stage.removeChildren()

		}
		else {
			getElementById('scene-battle').innerHTML = battle.html()
			battleSceneInitialized = true
		}
	}
})(TweenMax, $, _, PIXI, Linear, Object);
