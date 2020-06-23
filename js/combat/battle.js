var battle;
(function(TweenMax, $, _, PIXI, Linear, undefined) {
	battle = {
		initialized: 0,
		getSplashTarget,
		go,
		show,
		html,
		targetIsFrontRow,
		targetIsBackRow,
		updateTarget,
		loadTextures,
		updateMobTargetBuffs,
		processBuffs,
		addMyBuff,
		removeMyBuff,
		removeMyBuffFlag,
		setTargetHtml,
		hideTarget,
		showTarget,
		killAllBattleTimers,
	}
	var mobTargetWrap = querySelector('#mob-target-wrap')
	var show
	let index, buffHtml, traitHtml, buffEl, key, keyRow, el, i
	let buffIconTimers = {}
	let tgt = {}
	let mobBuffData = {}
	const flashDuration = 10
	const splashOrder = [0, 5, 1, 6, 2, 7, 3, 8, 4]
	init()
	//////////////////////////////////////
	function getSplashTarget(shift) {
		shift = shift || 0
		index = _.findIndex(splashOrder, val => val === my.target)
		index = splashOrder[index + shift]
		return splashOrder.includes(index) ? index : -1
	}
	function init() {
		$('#scene-battle')
			.on('click', '.mob-alive, .mob-details', handleMobClick)
			.on('mouseenter', '.mob-alive, .mob-details', handleMobEnter)
			.on('mouseleave', '.mob-alive, .mob-details', handleMobLeave)
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
		chat.sizeSmall()
		mob.init()
		game.emptyScenesExcept('scene-battle')
		if (chat.modeCommand === '/say') {
			chat.modeChange({ mode: '/party' })
		}

		querySelector('#town-footer-wrap').style.display = 'none'
		ng.setScene('battle')
		if (!ng.isApp) {
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
		combat.initCombatTextLayer() // must come after battle

		// add this to test out mob placement etc;
		// also required to configure the mobs images array properly
		if (typeof data === 'object' &&
			typeof data.config === 'object' &&
			data.config.length) {
			warn('p->goBattle data in from goBattle', data.config)
			setupMobs(data.config)
		}
		else setupMobs()

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
				config: mob.txData
			}, true)
		}
	}
	function initBattleLayer() {
		battle.layer = new PIXI.Application({
			width: 1920,
			height: 1080,
			transparent: true
		});
		battle.layer.stage.sortableChildren = true
		battle.layer.view.id = 'battle-layer'
		battle.layer.view.style.pointerEvents = 'none'
		battle.layer.view.style.position = 'absolute'
		battle.layer.view.style.zIndex = 1
		querySelector('#scene-battle').appendChild(battle.layer.view)
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
			let minLevel = ~~(quests[mission.questId].level * .7)
			if (minLevel < 1) minLevel = 1
			let maxLevel = quests[mission.questId].level

			let availableSlots = []
			mob.txData = []
			for (var i=0; i<mob.max; i++) {
				mob.txData.push({})
				availableSlots.push(i)
			}
			let minMobs = 1
			let maxMobs = ceil(quests[mission.questId].level / 7)
			if (maxMobs > mob.max) maxMobs = mob.max

			let totalMobs = _.random(minMobs, maxMobs)

			if (!ng.isApp) {
				totalMobs = 9
				minLevel = 25
				maxLevel = 53
			}
			console.info('levels', minLevel, maxLevel)
			var mobSlot
			for (i=0; i<totalMobs; i++) {
				if (!i) mobSlot = 2
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
	function loadTextures() {
		zones[mission.id].mobs.forEach(name => {
			console.warn('loading mob', name)
			mob.textures[name] = []
			for (var i=1; i<=105; i++) {
				mob.textures[name][i] = PIXI.Texture.from('mobs/'+ name +'/'+ i +'.png')
			}
		})
	}
	function setTargetHtml(html) {
		mobTargetWrap.innerHTML = html
	}
	function showTarget() {
		mobTargetWrap.style.display = 'flex'
	}
	function hideTarget() {
		mobTargetWrap.style.display = 'none'
	}
	let targetHtml = ''
	function updateTarget(drawInstant) {
		if (combat.isValidTarget()) {
			if (my.targetIsMob) {
				tgt = {
					class: combat.getDiffClass(mobs[my.target].level),
					name: mobs[my.target].name,
					type: mobs[my.target].type,
					hp: ceil(100 - bar.getRatio('hp', mobs[my.target])),
					traits: getMobTargetTraitsHtml(),
					buffs: getMobTargetBuffsHtml(),
				}
				startBuffTimers()
			}
			else {
				tgt = {
					class: 'con-white',
					name: party.getNameByRow(my.target),
					type: 'normal',
					hp: ceil(100 - bar.getRatio('hp', party.presence[party.getIndexByRow(my.target)])),
					traits: 'Player',
					buffs: '',
				}

			}
			targetHtml = '<div id="mob-target-name" class="' + tgt.class + '">' + tgt.name + '</div>' +
				'<div id="mob-target-bar-wrap">' +
				'<div id="mob-target-hp-wrap">' +
				'<div id="mob-target-hp"></div>' +
				'<div class="mob-health-grid"></div>' +
				'</div>' +
				'<img id="mob-target-hp-plate" class="mob-plate-' + tgt.type + '" src="images/ui/bar-' + tgt.type + '.png">' +
				'</div>' +
				//'<div id="mob-target-level">'+ mobs[my.target].level +'</div>' +
				'<div id="mob-target-percent">' + tgt.hp + '%</div>' +
				'<div id="mob-target-details">' +
				'<div id="mob-target-traits">' + tgt.traits + '</div>' +
				'<div id="mob-target-buffs">' + tgt.buffs + '</div>' +
			'</div>'
			mob.drawMobBar(my.target, drawInstant)
			showTarget()
			console.info('updateTarget', my.target)
		}
		else {
			hideTarget()
		}
		setTargetHtml(targetHtml)
	}
	function getMobTargetTraitsHtml() {
		// remove trailing s from value
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
			buffHtml += '<img id="buff-'+ key + '" class="target-buff popover-icons" src="images/skills/' + buffs[mobBuffData.key].job + '/' + buffs[mobBuffData.key].img + '.png">'
		}
		return buffHtml
	}
	function updateMobTargetBuffs() {
		querySelector('#mob-target-buffs').innerHTML = getMobTargetBuffsHtml()
	}
	function mobBuffTimerExists(i, key) {
		// kill existing buff timer for player
		return typeof mobs[i].buffs[key] === 'object' &&
				typeof mobs[i].buffs[key].timer === 'object'
	}
	function processBuffs(arrayOfBuffs) {
		let updateTargetBuffs = false
		arrayOfBuffs.forEach(buff => {
			if (my.target === buff.i) updateTargetBuffs = true
			let buffKeyRow = buff.key + '-' + buff.row
			if (mobBuffTimerExists(buff.i, buffKeyRow)) {
				mobs[buff.i].buffs[buffKeyRow].timer.kill()
			}
			// console.info('processBuffs', buff)
			mobs[buff.i].buffs[buffKeyRow] = {
				row: buff.row,
				key: buff.key,
				duration: buffs[buff.key].duration,
			}
			// animate the actual duration down to 0
			mobs[buff.i].buffs[buffKeyRow].timer = TweenMax.to(
				mobs[buff.i].buffs[buffKeyRow],
				buffs[buff.key].duration, {
				duration: 0,
				ease: Linear.easeNone,
				onComplete: removeMobBuffFlag,
				onCompleteParams: [buff.i, buff.key],
			})
			mobs[buff.i].buffFlags[buff.key] = true
		})
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
		}
		if (!buffStillActive) mobs[i].buffFlags[buffKey] = false
	}
	function startBuffTimers() {
		if (my.target < 0) return
		let tgt = my.target
		for (key in buffIconTimers) {
			if (buffIsTimer(key)) {
				buffIconTimers[key].kill()
				buffIconTimers[key + '-remove'].kill()
			}
		}
		buffIconTimers = {}
		for (key in mobs[my.target].buffs) {
			if (mobs[tgt].buffs[key].duration < flashDuration) flashTargetBuff(key, tgt)
			else {
				buffIconTimers[key] = delayedCall(
					mobs[tgt].buffs[key].duration - flashDuration,
					flashTargetBuff, [key, tgt]
				)
			}
			// console.info('startBuffTimers key', key, mobs[my.target].buffs[key].duration)
		}
	}
	function flashTargetBuff(key, tgt) {
		buffIconTimers[key] = TweenMax.to('#buff-' + key, .5, {
			startAt: { opacity: 1 },
			repeat: -1,
			yoyo: true,
			opacity: .5,
			ease: Linear.easeNone,
		})
		buffIconTimers[key + '-remove'] = delayedCall(
			mobs[tgt].buffs[key].duration,
			removeTargetBuff, [key]
		)
		// console.info('startBuffTimers less 10', mobs[my.target].buffs[key].duration)
	}
	function removeTargetBuff(key) {
		if (buffIsTimer(key)) {
			buffIconTimers[key].kill()
			buffIconTimers[key + '-remove'].kill()
		}
		/*if (buffIconTimers[key] !== null) buffIconTimers[key] = null
		if (buffIconTimers[key + '-remove'] !== null) buffIconTimers[key + '-remove'] = null*/
		buffEl = querySelector('#buff-' + key)
		// console.info('removeTargetBuff', key, buffIconTimers)
		if (buffEl !== null) buffEl.parentNode.removeChild(buffEl)
	}
	function buffIsTimer(key) {
		return buffIconTimers[key] === 'object'
	}
	///////////////////////// myBuffs
	function myBuffHasTimer(key) {
		return my.buffIconTimers[key] === 'object'
	}
	function removeMyBuffFlag(keyRow) {
		var buffStillActive = false
		for (var k in my.buffs) {
			if (keyRow === my.buffs[k].key &&
				my.buffs[k].duration > 0) {
				buffStillActive = true
			}
		}
		if (!buffStillActive) my.buffFlags[keyRow] = false
	}
	function addMyBuff(key, keyRow) {
		console.info('addMyBuff', key, keyRow)
		el = createElement('img')
		el.id = 'mybuff-' + keyRow
		el.className = 'buff-icons popover-icons'
		el.src = 'images/skills/' + buffs[key].job + '/' + buffs[key].img + '.png'
		querySelector('#mybuff-wrap').appendChild(el)
		// kill if exists
		if (myBuffHasTimer(keyRow)) my.buffIconTimers[keyRow].kill()
		// start timer
		if (buffs[key].duration < flashDuration) flashMyBuff(key, keyRow)
		else {
			my.buffIconTimers[keyRow] = delayedCall(
				buffs[key].duration - flashDuration,
				flashMyBuff, [key, keyRow]
			)
		}
	}
	function flashMyBuff(key, keyRow) {
		console.info('flashMyBuff', key)
		my.buffIconTimers[keyRow] = TweenMax.to('#mybuff-' + keyRow, .5, {
			startAt: { opacity: 1 },
			repeat: -1,
			yoyo: true,
			opacity: .5,
			ease: Linear.easeNone,
		})
		my.buffIconTimers[keyRow + '-remove'] = delayedCall(
			my.buffs[keyRow].duration,
			removeMyBuff, [key, keyRow]
		)
	}
	function removeMyBuff(key, keyRow) {
		console.info('removeMyBuff', key, keyRow)
		my.buffIconTimers[keyRow].kill()
		my.buffIconTimers[keyRow + '-remove'].kill()
		/*if (my.buffIconTimers[keyRow] !== null) my.buffIconTimers[keyRow] = null
		if (my.buffIconTimers[keyRow + '-remove'] !== null) my.buffIconTimers[keyRow + '-remove'] = null*/
		buffEl = querySelector('#mybuff-' + keyRow)
		if (buffEl !== null) buffEl.parentNode.removeChild(buffEl)
	}

	function killAllBattleTimers() {
		i=0
		// mob buff/debuffs
		for (; i<mob.max; i++) {
			for (key in mobs[i].buffs) {
				if (mobBuffTimerExists(i, key)) {
					mobs[i].buffs[key].timer.kill() // tweens duration
					mobs[i].buffs[key].duration = 0 // set duration to 0 so flags update
				}
			}
			for (key in mobs[i].buffFlags) {
				if (mobBuffTimerExists(i, key)) {
					mobs[i].buffFlags[key] = false
				}
			}
		}
		// mob buff icon flash/remove timers
		for (key in buffIconTimers) {
			if (buffIsTimer(key)) {
				buffIconTimers[key].kill()
				buffIconTimers[key + '-remove'].kill()
			}
		}
		// my buff icon flash/remove timers
		for (key in my.buffIconTimers) {
			if (myBuffHasTimer(key)) {
				my.buffIconTimers[key].kill()
				my.buffIconTimers[key + 'remove'].kill()
			}
		}
		for (key in my.buffFlags) {
			my.buffFlags[key] = false
		}
		querySelector('#mob-target-buffs').innerHTML = ''
		querySelector('#mybuff-wrap').innerHTML = ''
	}

	function html() {
		//info('target:', my.target)
		var s =
			'<img id="battle-bg" src="'+ mission.getZoneImg() +'">' +
			'<img id="battle-fg" src="images/battle/tendolin-hollow-2-fg.png" class="no-pointer">';

		// s += '<div id="mob-target-wrap" class="text-shadow3"></div>'
		for (var i=0; i<mob.max; i++){
			s += '<div id="mob-wrap-' +i+ '" class="mob-wrap' + (i > 4 ? ' mob-back-row' : ' mob-front-row') +'">' +
				'<div id="mob-details-' +i+ '" class="mob-details" index="' + i + '">' +
					'<div id="mob-name-' +i+ '" class="mob-name text-shadow3"></div>' +
					'<div id="mob-bar-' +i+ '" class="mob-bar">' +
						'<div id="mob-health-' +i+ '" class="mob-health"></div>' +
						'<div class="mob-health-grid"></div>' +
					'</div>' +
				'</div>' +
				'<div id="mob-shadow-' +i+ '" class="mob-shadow"></div>' +
				'<div id="mob-alive-' +i+ '" class="mob-alive" index="' + i + '"></div>' +
				'<div id="mob-dead-' +i+ '" class="mob-dead" index="' + i + '"></div>' +
			'</div>'
		}
		return s;
	}
	function show() {
		ng.setScene('battle');
		if (battle.initialized) {
			getElementById('scene-battle').style.display = 'block'
		}
		else {
			getElementById('scene-battle').innerHTML = battle.html()
			battle.isInit = 1;
		}
	}
})(TweenMax, $, _, PIXI, Linear);
