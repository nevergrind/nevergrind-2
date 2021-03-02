var battle;
(function(TweenMax, $, _, PIXI, Linear, undefined) {
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
			.4,
			.6,
			.8,
			1,
			1.1,
			1.2, // red
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
		addExp,
		addGold,
		upsertGX,
		upsertLevel,
		reckonGXL,
		subtractExpPenalty,
		getDeathPenaltyRatio,
		getMinMobCount,
		getMaxMobCount,
		getRandomMobCount,
	}
	let index, buffHtml, traitHtml, buffEl, key, keyRow, el, i
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
			mob.earnedExp -= penalty
			my.exp -= penalty
			chat.log('You lost experience!', 'chat-exp')
			battle.drawExpBar(0, 4.5)
		}
	}
	function reckonGXL() {
		if (mob.earnedExp !== 0 || mob.earnedGold > 0) battle.upsertGX()
		if (mob.leveledUp) battle.upsertLevel()
	}
	function upsertGX() {
		$.post(app.url + 'character/upsert-gx.php', {
			gold: mob.earnedGold,
			exp: mob.earnedExp,
		})
	}
	function upsertLevel() {
		$.post(app.url + 'character/upsert-level.php', {
			level: my.level,
		})
	}
	function addExp(exp) {
		leveled = false // to determine UI updates
		if (my.exp + exp > battle.expThreshold[MaxHeroLevel]) {
			exp = battle.expThreshold[MaxHeroLevel] - my.exp
		}
		my.exp += exp
		if (exp) {
			chat.log('You earned experience!', 'chat-exp')
			battle.drawExpBar()
		}
		while (my.exp >= nextLevel()) {
			mob.leveledUp = leveled = true
			my.level++
			chat.log('You have reached level ' + my.level + '!', 'chat-level')
			stats.memo = {}
			button.updateWeaponPanel() // could be dual wielding now
			button.updatePotionPanel()
			audio.playSound('levelup')
		}
		if (leveled) {
			for (var i=0; i<mob.max; i++) {
				mob.updateMobName(i)
			}
			battle.updateTarget()
		}
		return exp
	}
	function getExpBarRatio() {
		ratio = -(1 - ((my.exp - battle.expThreshold[my.level]) / nextLevel())) * 100
		return ratio
	}
	function nextLevel() {
		return battle.expThreshold[my.level + 1]
	}
	function addGold(gold) {
		if (my.gold + gold > trade.MAX_GOLD) {
			gold = trade.MAX_GOLD - my.gold
		}
		if (gold) {
			my.gold += gold
			chat.log('You found ' + gold + ' gold!', 'chat-gold')
			bar.updateInventoryGold()
		}
		return gold
	}
	function drawExpBar(duration, dur) {
		duration = typeof duration === 'number' ? duration : .3
		dur = typeof dur === 'number' ? dur : duration * 1.5
		TweenMax.to(query.el('#exp-bar'), duration, {
			x: getExpBarRatio() + '%',
		})
		TweenMax.to(query.el('#exp-bar'), dur, {
			startAt: { filter: 'saturate(2) brightness(2)' },
			filter: 'saturate(1) brightness(1)',
			repeat: 1,
		})
	}
	function getSplashTarget(shift, tgt) {
		shift = shift || 0
		if (tgt) index = _.findIndex(splashOrder, val => val === tgt)
		else index = _.findIndex(splashOrder, val => val === my.target)
		index = splashOrder[index + shift]
		return splashOrder.includes(index) ? index : -1
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
		my.setTarget(this.getAttribute('index') * 1)
	}
	function handleMobEnter() {
		index = this.getAttribute('index') * 1
		my.hoverTarget = index
		if (my.target !== index) querySelector('#mob-details-' + index).classList.add('block-imp')
	}
	function handleMobLeave() {
		index = this.getAttribute('index') * 1
		my.hoverTarget = -1
		if (my.target !== index) querySelector('#mob-details-' + index).classList.remove('block-imp')
	}
	function go(data) {
		if (ng.view === 'battle') return
		town.closeVarious()
		item.resetDrop()
		chat.sizeDungeon()
		mob.init()
		dungeon.killEntityTweens()

		game.showScene('scene-battle')
		if (chat.modeCommand === '/say') {
			chat.modeChange(CHAT.PARTY)
		}

		ng.setScene('battle')
		if (!app.isApp) {
			// setup some mission data
			mission.inProgress = true
			mission.id = 1
		}
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
		player.setPlayers()

		// add this to test out mob placement etc;
		// also required to configure the mobs images array properly
		if (typeof data === 'object' &&
			typeof data.config === 'object' &&
			data.config.length) {
			// rx setup
			setupMobs(data.config)
		}
		else {
			// tx setup
			setupMobs()
		}

		// set to center target
		my.target = 2
		my.targetIsMob = true
		combat.targetChanged()
		my.fixTarget()
		battle.updateTarget()

		if (party.presence[0].isLeader && party.hasMoreThanOnePlayer()) {
			console.info('p->goBattle txData!', mob.txData)
			socket.publish('party' + my.partyId, {
				route: 'p->goBattle',
				config: mob.txData // from setupMobs
			}, true)
		}

		if (combat.isBattleOver()) map.show(1.5) // empty battle room - only in original room
		else map.hide()
	}
	function initBattleLayer() {
		if (battleLayerInitialized) return
		battleLayerInitialized = true

		battle.layer = new PIXI.Application({
			width: MaxWidth,
			height: MaxHeight,
			transparent: true
		});
		battle.layer.stage.sortableChildren = true
		battle.layer.view.id = 'battle-layer'
		battle.layer.view.style.pointerEvents = 'none'
		battle.layer.view.style.position = 'absolute'
		battle.layer.view.style.zIndex = 1
		querySelector('#scene-battle').appendChild(battle.layer.view)
		combat.updateCanvasLayer()
	}
	function setupMobs(config) {
		if (typeof config === 'object') {
			// followers
			config.forEach((mobData, index) => {
				if (mobData.name) {
					mob.setMob(index, mobData, true)
				}
			})
		}
		else {
			// leader
			let minLevel = Math.max(~~(quests[mission.questId].level * .7), 1)
			let maxLevel = quests[mission.questId].level

			let availableSlots = []
			mob.txData = []
			for (var i=0; i<mob.max; i++) {
				mob.txData.push({})
				availableSlots.push(i)
			}
			// maps[dungeon.map.id].rooms[map.roomId].mobs
			let minMobs
			let maxMobs
			if (map.inRoom && map.roomId === 0 ||
				map.inRoom && !dungeon.map.rooms[map.roomId].isAlive) {
				// starting room always empty - only time a room is empty?
				minMobs = 0
				maxMobs = 0
			}
			else {
				minMobs = battle.getMinMobCount()
				maxMobs = battle.getMaxMobCount()
			}

			let totalMobs = _.random(minMobs, maxMobs)
			// totalMobs = 0

			// test data
			/*if (!ng.isApp) {
				totalMobs = 9
				minLevel = 7
				maxLevel = 15
			}*/
			// console.info('levels', minLevel, maxLevel)
			var mobSlot
			for (i=0; i<totalMobs; i++) {
				if (!i) mobSlot = 2 // first is always slot 2 (center)
				else mobSlot = _.random(0, availableSlots.length - 1)
				let imgName = 'toadlok'

				let mobConfig = mob.configMobType({
					img: imgName,
					name: 'gaz toadlok knight',
					minLevel: minLevel,
					maxLevel: maxLevel,
				})
				mob.setMob(availableSlots[mobSlot], mobConfig)
				_.remove(availableSlots, val => val === availableSlots[mobSlot])
			}
		}
	}
	function getRandomMobCount() {
		return _.random(battle.getMinMobCount(), battle.getMaxMobCount())
	}
	function getMinMobCount() {
		return Math.max(~~(quests[mission.questId].level / 12), 1)
	}
	function getMaxMobCount() {
		return Math.min(ceil(quests[mission.questId].level / 7), mob.max)
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

	function updateTarget(drawInstant) {
		if (combat.isValidTarget()) {
			if (my.targetIsMob) {
				tgt = {
					class: combat.considerClass[combat.getDiffIndex(mobs[my.target].level)],
					name: mobs[my.target].name,
					type: mobs[my.target].type,
					hp: ceil(100 - bar.getRatio(PROP.HP, mobs[my.target])),
					traits: getMobTargetTraitsHtml(),
					buffs: getMobTargetBuffsHtml(),
				}
			}
			else {
				tgt = {
					class: 'con-white',
					name: party.getNameByRow(my.target),
					type: MOB_TYPES.normal,
					hp: ceil(100 - bar.getRatio(PROP.HP, party.presence[party.getIndexByRow(my.target)])),
					traits: 'Player',
					buffs: '',
				}

			}
			query.el('#mob-target-name').className = tgt.class
			query.el('#mob-target-name').textContent = tgt.name
			query.el('#mob-target-hp-plate').className = 'mob-plate-' + tgt.type
			query.el('#mob-target-hp-plate').src = 'images/ui/bar-' + tgt.type + '.png'
			query.el('#mob-target-percent').textContent = tgt.hp + '%'
			query.el('#mob-target-traits').innerHTML = tgt.traits
			querySelector('#mob-target-buffs').innerHTML = tgt.buffs
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
	function getMobTargetTraitsHtml() {
		// remove trailing s from value
		if (typeof mobs[my.target].img === 'undefined') return
		traitHtml = ['<div class="mob-trait">' +
			combat.mobType[mobs[my.target].img].replace(/s+$/, '') +
		'</div>']
		mobs[my.target].traits.forEach(trait => {
			traitHtml.push('<div class="mob-trait">' + trait + '</div>')
		})
		return traitHtml.join('<div class="trait-pipe"></div>')
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
		return typeof typeof mobs[i] === 'object' &&
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
		///////////////////////////////////////////////////
		function flashMyBuff(key, keyRow) {
			// console.info('flashMyBuff', key)
			my.buffIconTimers[keyRow] = TweenMax.to('#mybuff-' + keyRow, .5, FLASH_BUFF_OBJ)
			my.buffIconTimers[keyRow + '-remove'] = delayedCall(my.buffs[keyRow].duration, removeMyBuffIcon, [key, keyRow])
		}
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
		///////////////////////////////////////////
		function getBuffKey(keyRow) {
			if (keyRow.includes('-')) keyRow = keyRow.split('-')[0]
			return keyRow
		}
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
		if (typeof my.buffs[key] === 'object'
			&& buffs[key].stacks) {
			my.buffs[key].stacks = 0
		}
		buffEl = querySelector('#mybuff-' + keyRow)
		if (buffEl !== null) buffEl.parentNode.removeChild(buffEl)
	}

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
			console.info()
			if (typeof my.buffs[key] === 'object') {
				if (my.buffs[key].duration > 0) {
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
		killMobBuffTimers()
		killTargetBuffTimers()
		killMyBuffTimers()
		querySelector('#mob-target-buffs').innerHTML = ''
		querySelector('#mybuff-wrap').innerHTML = ''
	}
	function killMyBuffTimers() {
		for (key in my.buffIconTimers) {
			if (my.buffIconTimers[key] === 'object') {
				my.buffIconTimers[key].kill()
				my.buffIconTimers[key + 'remove'].kill()
			}
		}
		for (key in my.buffs) {
			my.buffs[key].timer.kill()
			my.buffs[key].duration = 0

		}
		for (key in my.buffFlags) {
			my.buffFlags[key] = false
		}
	}
	function killMobBuffTimers() {
		if (!mob.initialized) return
		i=0
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
					'<div id="mob-name-' +i+ '" class="mob-name text-shadow3"></div>' +
					'<div class="flex-center">'+
						'<div id="mob-bar-' +i+ '" class="mob-bar">' +
							'<div id="mob-health-' +i+ '" class="mob-health"></div>' +
							'<div class="mob-health-grid"></div>' +
						'</div>' +
						'<img id="mob-target-avatar-' +i+ '" class="mob-target-avatar" src="'+ my.avatar +'">' +
					'</div>' +
				'</div>' +
				'<div id="mob-alive-' +i+ '" class="mob-alive" index="' + i + '"></div>' +
				'<div id="mob-dead-' +i+ '" class="mob-dead" index="' + i + '"></div>' +
			'</div>'
		}
		return s;
	}
	function show() {
		ng.setScene('battle');
		if (battleSceneInitialized) {
			getElementById('scene-battle').style.display = 'block'
			battle.layer.stage.removeChildren()

		}
		else {
			getElementById('scene-battle').innerHTML = battle.html()
			battleSceneInitialized = true
		}
	}
})(TweenMax, $, _, PIXI, Linear);
