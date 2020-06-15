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
	}

	let index, splashTgt, buffHtml, traitHtml, buffEl
	let buffTimers = []
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
				minLevel = 33
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

	let targetHtml = ''
	function updateTarget(drawInstant) {
		if (combat.isValidTarget()) {
			console.info('updateTarget', my.target)
			targetHtml = '<div id="mob-target-name" class="' + combat.getDiffClass(mobs[my.target].level) + '">' + mobs[my.target].name + '</div>' +
				'<div id="mob-target-bar-wrap">' +
				'<div id="mob-target-hp-wrap">' +
				'<div id="mob-target-hp"></div>' +
				'<div class="mob-health-grid"></div>' +
				'</div>' +
				'<img id="mob-target-hp-plate" class="mob-plate-' + mobs[my.target].type + '" src="images/ui/bar-' + mobs[my.target].type + '.png">' +
				'</div>' +
				//'<div id="mob-target-level">'+ mobs[my.target].level +'</div>' +
				'<div id="mob-target-percent">' +
				ceil(100 - bar.getRatio('hp', mobs[my.target])) +
				'%</div>' +
				'<div id="mob-target-details">' +
				'<div id="mob-target-traits">' + getMobTargetTraitsHtml() + '</div>' +
				'<div id="mob-target-buffs">' + getMobTargetBuffsHtml() + '</div>' +
				'</div>'
			querySelector('#mob-target-wrap').innerHTML = targetHtml
			mob.drawMobBar(my.target, drawInstant)
			startBuffTimers()
		}
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
		for (var key in mobs[my.target].buffs) {
			let buffData = mobs[my.target].buffs[key]
			buffHtml += '<img id="buff-'+ key + '" class="target-buff popover-icons" src="images/skills/' + buffs[buffData.key].job + '/' + buffs[buffData.key].img + '.png">'
		}
		return buffHtml
	}
	function updateMobTargetBuffs() {
		querySelector('#mob-target-buffs').innerHTML = getMobTargetBuffsHtml()
	}
	function processBuffs(arrayOfBuffs) {
		arrayOfBuffs.forEach(buff => {
			let idKey = buff.key + '-' + buff.row
			if (typeof mobs[buff.i].buffs[idKey] === 'object' &&
				typeof mobs[buff.i].buffs[idKey].timer === 'object') {
				mobs[buff.i].buffs[idKey].timer.kill()
			}
			console.info('processBuffs', buff)
			mobs[buff.i].buffs[idKey] = {
				row: buff.row,
				key: buff.key,
				duration: buffs[buff.key].duration,
			}
			mobs[buff.i].buffs[idKey].timer = TweenMax.to(
				mobs[buff.i].buffs[idKey],
				buffs[buff.key].duration, {
				duration: 0,
				ease: Linear.easeNone
			})
		})
		updateMobTargetBuffs()
		startBuffTimers()
	}
	function startBuffTimers() {
		// flashDuration = 10
		buffTimers.forEach(b => {
			b.kill()
		})
		buffTimers = []
		for (var key in mobs[my.target].buffs) {
			if (mobs[my.target].buffs[key].duration < flashDuration) {
				// flash and remove
				let newBuff = TweenMax.to('#buff-' + key)
				buffTimers.push(newBuff)
				console.info('startBuffTimers less 10', mobs[my.target].buffs[key].duration)
			}
			else {
				// delay into flash and remove
				console.info('startBuffTimers over 10', mobs[my.target].buffs[key].duration)
			}
			console.info('startBuffTimers key', key, mobs[my.target].buffs[key].duration)
		}
	}
	function flashBuff(index, key) {
		let el = '#buff-' + key
		mobs[index].buffs[key] = delayedCall(10, removeBuff, [el, index, key])
		TweenMax.to(el, .5, {
			startAt: { opacity: 1 },
			repeat: -1,
			yoyo: true,
			opacity: .3,
			ease: Linear.easeOut,
			onComplete: removeBuff,
			onCompleteParams: [el, index, key]
		})
	}
	function removeBuff(el, index, key) {
		mobs[index].buffs[key].kill()
		if (mobs[index].buffs[key] !== null) {
			mobs[index].buffs[key] = null
		}
		buffEl = querySelector(el)
		console.info('removeBuff', el, buffEl)
		if (buffEl !== null) buffEl.parentNode.removeChild(buffEl)
	}

	function html() {
		//info('target:', my.target)
		var s =
			'<img id="battle-bg" src="'+ mission.getZoneImg() +'">' +
			'<img id="battle-fg" src="images/battle/tendolin-hollow-2-fg.png" class="no-pointer">';

		s += '<div id="mob-target-wrap" class="text-shadow3"></div>'
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
