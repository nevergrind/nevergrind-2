var town;
(function($, _, TweenMax, Power0, Power1, Power2, window,  undefined) {
	town = {
		go,
		addLightning,
		animateTown,
		openVarious,
		killAllTweens,
		openVariousConfirmed,
		closeVarious,
		handleGuildInputFocus,
		handleGuildInputBlur,
		refreshGuildMembers,
		updateVariousDOM,
		showLabel,
		hideLabel,
		isMerchantMode,
		buyItem,
		sellItem,
		showMerchantMsg,
		setStoreGold,
		setMyGold,
		socketReady,
		initItemData,
		isRaining: false,
		isLightning: false,
		isInitialized: {
			'apothecary': false,
			'blacksmith': false,
			'merchant': false,
		},
		tweens: [],
		firstLoad: true,
		lastAside: {},
		delegated: 0,
		openVariousWindow: '',
		isBankInitialized: false,
	}
	var i, key, id, len, html, str, foo, msg, itemIndex, rarity, townConfig, labelConfig, label, npc, obj, goldEl, labelObj, goldEl, type, potionItems, potLevel, scrollItems

	const apothecarySmokeInterval = 3
	const apothecarySmokeDuration = 24
	var storeItems = []
	const buyTypes = [
		'merchant',
		'apothecary',
		'blacksmith',
	]
	const merchants = [
		'Merchant',
		'Apothecary',
		'Blacksmith',
	]
	const hasArmorType = [
			ITEM_TYPE.HELMS,
			ITEM_TYPE.SHOULDERS,
			ITEM_TYPE.CHESTS,
			ITEM_TYPE.BRACERS,
			ITEM_TYPE.GLOVES,
			ITEM_TYPE.BELTS,
			ITEM_TYPE.LEGS,
			ITEM_TYPE.BOOTS
	]
	const itemTypesForSale = {
		// plate & mail
		blacksmith: [
			...hasArmorType,
			ITEM_TYPE.SHIELDS,
			ITEM_TYPE.ONE_HAND_BLUNTS,
			ITEM_TYPE.TWO_HAND_BLUNTS,
			ITEM_TYPE.ONE_HAND_SLASHERS,
			ITEM_TYPE.TWO_HAND_SLASHERS,
			ITEM_TYPE.BOWS,
			ITEM_TYPE.PIERCERS,
		],
		// cloth
		apothecary: [
			...hasArmorType,
			/*ITEM_TYPE.AMULETS,
			ITEM_TYPE.RINGS,
			ITEM_TYPE.CHARMS,*/
			ITEM_TYPE.FOCUS,
			ITEM_TYPE.STAVES,
			ITEM_TYPE.CLOAKS,
		]
	}
	const armorTypesByStore = {
		apothecary: ['cloth'],
		merchant: ['cloth', 'leather'],
		blacksmith: ['mail', 'plate'],
	}
	// leather
	itemTypesForSale.merchant = [
		...itemTypesForSale.blacksmith,
		...itemTypesForSale.apothecary,
	]
	////////////////////////////////////////////
	function go() {
		if (ng.view === 'town') return

		cache.preloadImages(Object.values(academy.npcImg))
		mob.textures = {}
		my.target = -1
		my.targetIsMob = true
		battle.hideTarget()
		mob.killAllAttacks()
		dungeon.map = {} // reset map data so it can be initialized next embark
		dungeon.killEntityTweens()
		audio.stopAmbient()
		map.hide()
		map.inCombat = false
		if (!create.selected) return

		audio.playMusic('eq-training', .5, 1500)
		$('#version, #patch-notes').remove()
		clearTimeout(game.session.timer)
		game.showScene('scene-town');
		ng.lock(1);
		if (ng.view === 'dungeon') {
			TweenMax.set('#body', {
				opacity: 0
			})
		}
		for (key in town.isInitialized) {
			// reset stores
			town.isInitialized[key] = false
		}
		TweenMax.set('#button-wrap', CSS.DISPLAY_NONE)
		loading.setRandomImage()
		dungeon.suppressDoorNoise = true
		map.killTorchTween()

		$.post(Config.url + 'character/load-character.php', {
			row: create.selected
		}).done((data) => {
			if (town.firstLoad) {
				town.firstLoad = false;
				chat.log('Welcome to Broken.net!')
				chat.log('You have entered Vandamor.')
				chat.log('Type /help or /h for a list of chat commands.', 'chat-warning')
			}
			chat.sizeTown()
			TweenMax.set(['#bar-main-menu'], CSS.DISPLAY_FLEX)
			// console.info('load-character: ', data)
			// my processing
			Object.assign(my, _.omit(data.characterData, KEYS.DATA))
			data.characterData.data = JSON.parse(data.characterData.data)
			for (key in data.characterData.data) {
				my[key] = data.characterData.data[key]
			}
			my.jobLong = ng.toJobLong(my.job)
			my.avatar = my.getAvatarUrl()
			Object.assign(my, my.getResistObject())
			// other things
			bar.setDefaultInvWeaponImage()
			guild.setGuildData(data)
			initItemData(data.inv, 'inv')
			initItemData(data.eq, 'eq')

			// temporary solution from long ago?
			if (typeof my.handToHand === 'undefined') {
				my.handToHand = 1
				my.saveCharacterData()
			}
			// skills
			my.initSkills()

			// sets max values only because hp isn't defined yet
			stats.setAllResources()
			// yes this is needed - hp not defined yet
			my.set(PROP.HP, my.hpMax)
			my.set(PROP.MP, my.mpMax)
			my.set(PROP.SP, my.spMax)

			// init party member values
			ng.setScene('town')

			chat.init()

			game.setPhase(data)
			getElementById('scene-town').innerHTML = getTownHtml()

			if (socket.enabled) {
				town.socketReady()
			}
			else {
				// calls socket.init -> connectionSuccess
				socket.init()
				friend.init()
				ignore.init()
				game.initPlayedCache()
			}
			//!expanse.initialized && expanse.startSkyPhase()
			// expanse.startSkyPhase()
			town.animateTown()
			bar.init()
			tavern.init()
			skills.init()
			battle.removeAllBuffs()
			button.setAll()
		}).fail(data => {
			ng.disconnect(data.responseText);
		});
	}
	function socketReady() {
		// stuff to do after the socket wakes up
		if (!Object.keys(socket.subs).some(channel => channel.startsWith('party'))) {
			party.listen(party.getUniquePartyChannel())
		}
		chat.sendMsg('/join')
		chat.history = [];
		// town
		TweenMax.set('#scene-town', {
			opacity: 1,
			filter: 'brightness(1)',
		})
		TweenMax.to('#body', .5, {
			overwrite: 1,
			delay: .5,
			opacity: 1,
			onComplete: ng.unlock
		})
		TweenMax.to('#town-wrap', .5, {
			startAt: { filter: 'brightness(0)' },
			overwrite: 1,
			delay: .5,
			filter: 'brightness(1)',
			onComplete: ng.unlock
		})
	}

	function animateTown() {
		// clouds
		const cloudDuration = _.random(333, 1000)
		const cloudTween = TweenMax.to('#town-layer-clouds', cloudDuration, {
			startAt: { x: '0%' },
			x: '-100%',
			repeat: -1,
			ease: Power0.easeNone
		})
		town.tweens.push(cloudTween)
		// furnace
		const furnaceDuration = 1
		const furnaceTween = TweenMax.to('#town-blacksmith-furnace', furnaceDuration, {
			startAt: { filter: 'brightness(.8)' },
			repeat: -1,
			yoyo: true,
			ease: ANIMATE_CANDLE,
			filter: 'brightness(1.2)'
		})
		town.tweens.push(furnaceTween)
		// furnace glow
		const glowTween = TweenMax.to('#town-blacksmith-furnace-glow', furnaceDuration, {
			startAt: { scale: .8 },
			repeat: -1,
			yoyo: true,
			ease: ANIMATE_CANDLE,
			scale: .9
		})
		town.tweens.push(glowTween)

		// apothecary smoke
		for (var i=1; i<8; i++) {
			addApothecarySmoke((apothecarySmokeInterval * i) / apothecarySmokeDuration)
		}
		const smokeTween = TweenMax.to(EMPTY_OBJECT, apothecarySmokeInterval, {
			repeat: -1,
			onRepeat: addApothecarySmoke,
		})
		town.tweens.push(smokeTween)

		const waterfallTweenConfig = {
			totalFrames: 21,
			lastFrame: -1,
			frame: 20.99
		}
		const waterfallTween = TweenMax.to(waterfallTweenConfig, 1.4, {
			frame: 0,
			ease: Power0.easeIn,
			repeat: -1,
			yoyo: true,
			onUpdate: setWaterfallFrame,
			onUpdateParams: [waterfallTweenConfig]
		})
		town.tweens.push(waterfallTween)

		// town-academy-flag-1
		const flagDuration = 1.6
		const academyFlagTween1Config = {
			id: '#town-academy-flag-1',
			totalFrames: 48,
			lastFrame: -1,
			frame: 47.99
		}
		const flagTween1 = TweenMax.to(academyFlagTween1Config, flagDuration, {
			frame: 0,
			ease: Power0.easeIn,
			repeat: -1,
			onUpdate: setAcademyFlagFrame,
			onUpdateParams: [academyFlagTween1Config]
		})
		flagTween1.progress(.333)
		town.tweens.push(flagTween1)
		const academyFlagTween2Config = {
			id: '#town-academy-flag-2',
			totalFrames: 48,
			lastFrame: -1,
			frame: 47.99
		}
		const flagTween2 = TweenMax.to(academyFlagTween2Config, flagDuration, {
			frame: 0,
			ease: Power0.easeIn,
			repeat: -1,
			onUpdate: setAcademyFlagFrame,
			onUpdateParams: [academyFlagTween2Config]
		})
		flagTween2.progress(.666)
		town.tweens.push(flagTween2)
		const academyFlagTween3Config = {
			id: '#town-academy-flag-3',
			totalFrames: 48,
			lastFrame: -1,
			frame: 47.99
		}
		town.tweens.push(TweenMax.to(academyFlagTween3Config, flagDuration, {
			frame: 0,
			ease: Power0.easeIn,
			repeat: -1,
			onUpdate: setAcademyFlagFrame,
			onUpdateParams: [academyFlagTween3Config]
		}))
		// guild flags
		const guildFlagDuration = 2.5
		const guildFlagLeftConfig = {
			id: '#town-guild-flag-left',
			totalFrames: 48,
			lastFrame: -1,
			frame: 47.99
		}
		const guildFlagRightTween = TweenMax.to(guildFlagLeftConfig, guildFlagDuration, {
			frame: 0,
			ease: Power0.easeIn,
			repeat: -1,
			yoyo: true,
			onUpdate: setGuildFlagFrame,
			onUpdateParams: [guildFlagLeftConfig]
		})
		town.tweens.push(guildFlagRightTween)
		const guildFlagRightConfig = {
			id: '#town-guild-flag-right',
			totalFrames: 48,
			lastFrame: -1,
			frame: 47.99
		}
		const guildFlagLeftTween = TweenMax.to(guildFlagRightConfig, guildFlagDuration, {
			frame: 0,
			ease: Power0.easeIn,
			repeat: -1,
			yoyo: true,
			onUpdate: setGuildFlagFrame,
			onUpdateParams: [guildFlagRightConfig]
		})
		town.tweens.push(guildFlagLeftTween)

		// rain
		town.isRaining = false
		town.isLightning = false
		if (game.phase === 'morning' || game.phase === 'afternoon' || game.phase === 'night') {
			town.isRaining = _.random(100) > 70
			town.isLightning = town.isRaining && Math.random() > .5
		}
		if (town.isRaining || Config.forceRain || Config.forceLightning) {
			town.isRaining = true
			triggerRain({
				drops: 7
			})
			if (town.isLightning || Config.forceLightning) {
				triggerLightning()
			}
		}
		audio.playAmbientLoop()
	}

	let guildFlagWidth = 0
	let guildFlagHeight = 0
	function setGuildFlagFrame(tween) {
		if (tween.lastFrame !== ~~tween.frame) {
			tween.lastFrame = ~~tween.frame
			guildFlagWidth = (window.innerWidth * .1458) * tween.totalFrames
			guildFlagHeight = window.innerHeight * .2593
			querySelector(tween.id).style.backgroundSize = guildFlagWidth +'px '+ guildFlagHeight + 'px'
			querySelector(tween.id).style.backgroundPosition = (tween.lastFrame * 100) + '% 0%'
		}
	}

	let academyFlagWidth = 0
	let academyFlagHeight = 0
	function setAcademyFlagFrame(tween) {
		if (tween.lastFrame !== ~~tween.frame) {
			tween.lastFrame = ~~tween.frame
			academyFlagWidth = (window.innerWidth * .1458) * tween.totalFrames
			academyFlagHeight = window.innerHeight * .2593
			querySelector(tween.id).style.backgroundSize = academyFlagWidth +'px '+ academyFlagHeight + 'px'
			querySelector(tween.id).style.backgroundPosition = (tween.lastFrame * 100) + '% 0%'
		}
	}

	function triggerLightning() {
		town.tweens.push(TweenMax.to(EMPTY_OBJECT, 1, {
			onRepeat: addLightning,
			ease: Power0.easeIn,
			repeat: -1,
		}))
	}

	function addLightning(override = false) {
		if (Math.random() > .93 || override) {
			let flashDuration = .2
			if (Math.random() > .75) {
				flashDuration = _.random(.4, .8)
			}
			const lightningEl = querySelector('#town-layer-lightning')
			TweenMax.to(EMPTY_OBJECT, flashDuration, {
				ease: Power0.easeIn,
				onUpdate: lightningOn,
				onComplete: lightningOff
			})
			const townEls = querySelectorAll('#town-layer-clouds, #town-layer-bg, #town-layer-people, #town-rain-container')
			let brightRoll = 0
			TweenMax.to(EMPTY_OBJECT, flashDuration, {
				ease: Power0.easeIn,
				onUpdate: animateFg,
				onComplete: resetFg
			})
			audio.playSound('thunder-' + _.random(1, 2), 'ambient')
			///////////////
			function lightningOn() {
				lightningEl.style.opacity = Math.random() > .5 ? _.random(.5, 1) : 0
			}
			function lightningOff() {
				lightningEl.style.opacity = 0
			}
			function animateFg() {
				brightRoll = Math.random()
				if (brightRoll > .66) {
					TweenMax.set(townEls, {
						filter: 'brightness(2)'
					})
				}
				else if (brightRoll > .33) {
					TweenMax.set(townEls, {
						filter: 'brightness(.15)'
					})
				}
				else {
					TweenMax.set(townEls, {
						filter: 'brightness(1.2)'
					})
				}
			}
			function resetFg() {
				TweenMax.set(townEls, {
					filter: 'brightness(1)'
				})
			}

		}
	}

	function addRain(i, config) {
		const rainDuration = .4
		const rainDelay = rainDuration / config.drops
		const offsetX = -20
		const rainMarginX = 20 / config.drops
		const el = createElement('img')
		el.className = 'town-rain'
		el.src = 'images/town/rain.png'
		el.style.left = offsetX + (i * rainMarginX) + '%'

		querySelector('#town-rain-container').appendChild(el)
		town.tweens.push(TweenMax.to(el, rainDuration, {
			delay: i * rainDelay,
			repeat: -1,
			y: 0,
			ease: Power0.easeIn,
		}))
	}
	function triggerRain(config) {
		for (let i=0; i<config.drops; i++) {
			addRain(i, config)
		}
	}

	let waterfallWidth = 0
	let waterfallHeight = 0
	function setWaterfallFrame(tween) {
		if (tween.lastFrame !== ~~tween.frame) {
			tween.lastFrame = ~~tween.frame
			waterfallWidth = (window.innerWidth * .1458) * tween.totalFrames
			waterfallHeight = window.innerHeight * .2593
			querySelector('#town-waterfall').style.backgroundSize = waterfallWidth +'px '+ waterfallHeight + 'px'
			querySelector('#town-waterfall').style.backgroundPosition = (tween.lastFrame * 100) + '% 0%'
		}
	}
	function addApothecarySmoke(progress) {
		const el = createElement('img')
		const scaleX = _.random(.8, 1)
		const scaleY = _.random(.9, 1)
		el.className = 'apothecary-smoke'
		el.src = 'images/town/apothecary-smoke.png'
		if (game.phase === 'night') {
			el.style.filter = 'brightness(.5)'
		}
		querySelector('#town-layer-smoke').appendChild(el)
		const scaleTween = TweenMax.to(el, apothecarySmokeDuration, {
			startAt: { x: 10 },
			x: 0,
			scaleX: scaleX,
			scaleY: scaleY,
			ease: Power0.easeOut
		})
		const opacityTween = TweenMax.to(el, apothecarySmokeDuration, {
			opacity: 0,
			ease: Power2.easeIn,
			onComplete: () => {
				el.parentNode.removeChild(el)
			}
		})
		if (typeof progress === 'number') {
			scaleTween.progress(progress)
			opacityTween.progress(progress)
		}
	}
	function initItemData(obj, type) {
		for (i=0; i<item.MAX_SLOTS[type]; i++) {
			items[type][i] = {}
		}
		for (key in obj) {
			items[type][key] = JSON.parse(obj[key].data)
			items[type][key].row = obj[key].row
			items[type][key].name = obj[key].name
		}
	}

	function initStoreData() {
		type = town.openVariousWindow.toLowerCase()
		if (!town.isInitialized[type]) {
			potionItems = []
			storeItems = []
			scrollItems = []
			// console.info('itemTypesForSale', itemTypesForSale[type])
			if (type === 'apothecary') {
				potLevel = ~~(my.level / 8)
				if (potLevel > 4) potLevel = 4
				for (i = 0; i<2; i++) {
					potionItems.push(item.getPotion(potLevel + i, PROP.HP))
				}
				for (i = 0; i<2; i++) {
					potionItems.push(item.getPotion(potLevel + i, PROP.MP))
				}
				for (i = 0; i<2; i++) {
					potionItems.push(item.getPotion(potLevel + i, PROP.SP))
				}
				scrollItems.push(item.getIdentifyScroll())
			}

			const maxItems = _.random(16, item.MAX_SLOTS[type])
			for (i = 0; i<maxItems; i++) {
				rarity = ITEM_RARITY.magic
				// rarity = _.random(0, 7) < 7 ? ITEM_RARITY.magic : ITEM_RARITY.rare
				itemIndex = _.random(0, itemTypesForSale[type].length - 1)
				storeItems[i] = item.getItem({
					store: true,
					mobLevel: (Math.random() > .9 ? (my.level + 5) : my.level + 20),
					bonus: 0,
					rarity: rarity,
					itemSlot: itemTypesForSale[type][itemIndex],
					armorTypes: armorTypesByStore[type]
				})
				// console.info('item', storeItems[i])
			}
			storeItems = _.sortBy(storeItems, ['itemType'])
			storeItems = [
				...potionItems,
				...scrollItems,
				...storeItems
			]
			/*potionItems = potionItems.concat(scrollItems)
			storeItems = potionItems.concat(potionItems)*/

			// console.info('storeItems', storeItems)

			// sorted
			for (i=0; i<storeItems.length; i++) {
				items[type][i] = storeItems[i]
			}
			town.isInitialized[type] = true
		}
		$('#various-item-wrap').html(getStoreItemHtml())
	}

	function getTownHtml() {
		if (Config.forceTownPhase) {
			// game.phase = 'afternoon'
		}
		const hazeOpacity = Math.random() > .5 ? 1 : 0
		html = '<div id="town-wrap">' +
			'<div id="town-building-wrap" class="wh-100">' +
				// background - sky clouds etc
				'<img id="town-layer-sky" class="town-layer" src="images/town/'+ game.phase +'-sky.jpg">' +
				// lightning
				'<div id="town-layer-lightning" class="town-layer"></div>' +
				// clouds
				'<div id="town-layer-clouds" class="flex-row town-layer">' +
					'<img id="town-layer-clouds-1" src="images/town/'+ game.phase +'-clouds.png" class="town-clouds">' +
					'<img id="town-layer-clouds-2" src="images/town/'+ game.phase +'-clouds.png" class="town-clouds">' +
				'</div>' +

				'<img id="town-layer-bg" class="town-layer" src="images/town/'+ game.phase +'-bg.png">' +
				// waterfall layer
				'<div id="town-waterfall" class="town-layer" style="background: url(images/town/town-waterfall-'+ game.phase +'.png)"></div>"' +

				// smoke layer - dynamic
				'<div id="town-layer-smoke" class="town-layer"></div>' +
				// buildings
				'<img data-id="Bank" id="town-bank" class="town-building" src="images/town/'+ game.phase +'-bank.png">' +
				'<img data-id="Guild Hall" id="town-guild" class="town-building" src="images/town/'+ game.phase +'-guild-crop.png">' +
				'<img data-id="Tavern" id="town-tavern" class="town-building" src="images/town/'+ game.phase +'-tavern.png?v=1">' +
				'<img data-id="Apothecary" id="town-apothecary" class="town-building" src="images/town/'+ game.phase +'-apothecary.png">' +
				'<img data-id="Academy" id="town-academy" class="town-building" src="images/town/'+ game.phase +'-academy-crop.png">' +
				'<img data-id="Blacksmith" id="town-blacksmith" class="town-building" src="images/town/'+ game.phase +'-blacksmith.png">' +
				'<img id="town-blacksmith-furnace-glow" class="town-layer" src="images/town/blacksmith-furnace-glow.png">' +
				'<img id="town-blacksmith-furnace" class="town-layer" src="images/town/blacksmith-furnace.png">' +
				'<img data-id="Merchant" id="town-merchant" class="town-building" src="images/town/'+ game.phase +'-merchant.png">' +

				// academy flags layer
				'<div id="town-academy-flag-1" class="town-layer town-academy-flag" style="background: url(images/town/town-academy-flags-'+ game.phase +'.png)"></div>"' +
				'<div id="town-academy-flag-2" class="town-layer town-academy-flag" style="background: url(images/town/town-academy-flags-'+ game.phase +'.png)"></div>"' +
				'<div id="town-academy-flag-3" class="town-layer town-academy-flag" style="background: url(images/town/town-academy-flags-'+ game.phase +'.png)"></div>"' +

				// guild flags
				'<div id="town-guild-flag-left" class="town-layer town-guild-flag" style="background: url(images/town/town-guild-flag-left-'+ game.phase +'.png)"></div>"' +
				'<div id="town-guild-flag-right" class="town-layer town-guild-flag" style="background: url(images/town/town-guild-flag-right-'+ game.phase +'.png)"></div>"' +

				// foreground layers
				'<img id="town-layer-haze" class="town-layer" src="images/town/'+ game.phase +'-haze.png" style="opacity: '+ hazeOpacity +'">' +
				'<img id="town-layer-people" class="town-layer" src="images/town/'+ game.phase +'-people.png">' +
				// rain container
				'<div id="town-rain-container" class="town-layer"></div>' +
			'</div>' +

			'<div id="town-building-label-wrap" class="text-shadow2">'+
				'<div id="town-building-label-header"></div>' +
				'<div id="town-build-label-description"></div>' +
			'</div>' +
		'</div>'

		return html
	}
	function handleGuildInputFocus() {
		guild.hasFocus = true
	}
	function handleGuildInputBlur() {
		guild.hasFocus = false
	}
	function refreshGuildMembers() {
		guild.loadGuildMsg()
		guild.getMembers(guild.throttleTime)
	}

	function loadBank() {
		$.get(Config.url + 'town/load-bank.php')
			.done(processBank)
	}

	function processBank(data) {
		for (var i=0; i<ng.bankSlots; i++) {
			items.bank[i] = {}
		}
		for (var key in data.bank) {
			items.bank[key] = JSON.parse(data.bank[key].data)
			items.bank[key].row = data.bank[key].row
			items.bank[key].name = data.bank[key].name
		}
		town.isBankInitialized = true
		ng.html('#bank-slot-wrap', bankSlotHtml())
	}

	function openVarious(event) {
		if (trade.data.name) chat.log('You are currently trading with ' + trade.data.name + '.', CHAT.WARNING)
		else openVariousConfirmed(event)
	}
	function openVariousConfirmed(event) {
		item.resetDrop()
		if (event.currentTarget.dataset.id === town.openVariousWindow) closeVarious()
		else {
			town.openVariousWindow = event.currentTarget.dataset.id
			updateVariousDOM()
		}
	}
	function closeVarious() {
		if (item.awaitingDrop) return
		if (town.openVariousWindow === 'Trade' &&
			trade.data.name) {
			chat.log('You closed the trade window.')
			trade.txCloseTradeWindow()
		}
		town.openVariousWindow && tooltip.conditionalHide(town.openVariousWindow.toLowerCase())
		town.openVariousWindow = ''
		querySelector('#root-various').innerHTML = ''
		querySelector('#root-various').style.display = 'none'
		animateBuilding({
			duration: .5,
			scale: 1,
			x: 0,
			y: 0
		})
	}
	function showLabel() {
		id = this.id
		msg = ''
		labelConfig = {
			left: -1000,
			top: -1000
		}

		if (id === 'town-academy') {
			msg = 'Train your skills and spells to achieve mastery'
			labelConfig = {
				left: ng.toPercentWidth(1152),
				top: ng.toPercentHeight(255)
			}
		}
		else if (id === 'town-apothecary') {
			msg = 'Buy potions, jewelry, and various arcane items to help assure your survival'
			labelConfig = {
				left: ng.toPercentWidth(815),
				top: ng.toPercentHeight(434)
			}
		}
		else if (id === 'town-bank') {
			msg = 'Banked items may be shared with all characters on the same account'
			labelConfig = {
				left: ng.toPercentWidth(589),
				top: ng.toPercentHeight(194)
			}
		}
		else if (id === 'town-blacksmith') {
			msg = 'Choose from the finest selection of weapons and armor in all of Edenburg'
			labelConfig = {
				left: ng.toPercentWidth(1255),
				top: ng.toPercentHeight(432)
			}
		}
		else if (id === 'town-guild') {
			msg = 'Start a guild, invite friends, and build your roster for ultimate readiness'
			labelConfig = {
				left: ng.toPercentWidth(292),
				top: ng.toPercentHeight(102)
			}
		}
		else if (id === 'town-merchant') {
			msg = 'Buy weapons, armor, and jewelry from the largest variety of items in all of Edenburg'
			labelConfig = {
				left: ng.toPercentWidth(1560),
				top: ng.toPercentHeight(375)
			}
		}
		else if (id === 'town-tavern') {
			msg = 'Select missions, seek wisdom from the innkeeper, and view the leaderboard'
			labelConfig = {
				left: ng.toPercentWidth(366),
				top: ng.toPercentHeight(366)
			}
		}
		if (!town.openVariousWindow) {
			var e = querySelector('#town-building-label-header');
			e.textContent = this.dataset.id;
			var split = new SplitText(e, {
				type: 'words,chars'
			});
			TweenMax.staggerFromTo(split.chars, .5, {
				immediateRender: true,
				alpha: 0,
				filter: 'saturate(2) brightness(10)',
			}, {
				delay: .1,
				alpha: 1,
				filter: 'saturate(1) brightness(1)',
			}, .03)

			ng.splitText('town-build-label-description', msg, .2, .01)
			TweenMax.killTweensOf(labelObj)
			TweenMax.to('#town-building-label-wrap', .2, {
				startAt: {
					left: labelConfig.left + '%',
					top: labelConfig.top + '%'
				},
				opacity: 1
			})
		}
		const els = getTownBuildingElements(this)
		TweenMax.to(els, 0, {
			filter: 'brightness(1.25) saturate(1.2) drop-shadow(0 0 2px #ffa) drop-shadow(0 0 4px #ffa)'
		})
	}
	function getTownBuildingElements(that) {
		let els = '#' + that.id
		if (that.id === 'town-guild') {
			els += ', .town-guild-flag'
		}
		else if (that.id === 'town-academy') {
			els += ', .town-academy-flag'
		}
		return els
	}

	function hideLabel() {
		id = this.dataset.id
		TweenMax.to('#town-building-label-wrap', .5, {
			opacity: 0
		})
		const els = getTownBuildingElements(this)
		TweenMax.to(els, 0, {
			filter: 'brightness(1) saturate(1) drop-shadow(0 0 0px #ffa) drop-shadow(0 0 0px #ffa)',
			onComplete: () => {
				TweenMax.set(els, {
					filter: 'none'
				})
			}
		})
	}

	function updateVariousDOM() {
		querySelector('#root-various').innerHTML = getVariousHtml()
		querySelector('#root-various').style.display = 'flex'
		townConfig = {
			duration: 1,
			scale: 1,
			x: 0,
			y: 0
		}

		msg = ''
		npc = ''
		if (town.openVariousWindow === 'Tavern') {
			npc = 'Eber: '
			zones = zones.map(z => {
				z.isOpen = 0
				return z;
			})
			msg = 'Welcome to the Edenburg Tavern, '+ my.name +'. The King has requested the services of brave adventurers like yourself to complete missions in defense of our interests. How do you choose to serve?'
			townConfig = {
				duration: 1,
				scale: 1.8,
				x: 650,
				y: -30
			}
			tavern.activeTab = 'tavern-missions'
			audio.playSound('door-tavern', 'town')
		}
		else if (town.openVariousWindow === 'Guild Hall') {
			npc = 'Charlotte: '
			if (guild.memberList.length) {
				guild.setGuildList(guild)
				msg = 'You\'ll find a motley cross-section of adventurers out there! Don\'t be hesitant to make friends out there! After all—it\'s not so much what you know—it\'s who you know!'
			}
			else {
				$('#guild-input').focus()
				guild.getMembers()
				msg = 'Creating a guild is a great way to keep your friends organized. The hordes of darkness fight in organized armies. It would be wise for you to do likewise.'
			}
			townConfig = {
				duration: 1,
				scale: 2.1,
				x: 1000,
				y: 200
			}
			audio.playSound('door-guild', 'town')
		}
		else if (town.openVariousWindow === 'Bank') {
			npc = 'Ingmar: '
			msg = 'If you have any special items that you would like to share with other heroes, you have come to the right place. I take an interest to collecting rare treasures as well!'
			if (!town.isBankInitialized) loadBank()
			townConfig = {
				duration: 1,
				scale: 2,
				x: 860,
				y: 160
			}
			bar.openInventory()
			audio.playSound('door-bank', 'town')
		}
		else if (town.openVariousWindow === 'Apothecary') {
			npc = 'Briza: '
			initStoreData()
			msg = 'Fill your bag full of potions if you want to survive! I have a selection of items ranging from the deadly to the arcane!.'
			townConfig = {
				duration: 1,
				scale: 1.9,
				x: 530,
				y: -130
			}
			bar.openInventory()
			audio.playSound('door-apothecary', 'town')
		}
		else if (town.openVariousWindow === 'Academy') {
			npc = 'Magda: '
			msg = 'All of your skills may be trained here. You will never reach your full potential without diligence! Each skill must be trained individually.'
			townConfig = {
				duration: 1,
				scale: 1.75,
				x: -140,
				y: 80
			}
			bar.openInventory()
			audio.playSound('door-academy', 'town')
		}
		else if (town.openVariousWindow === 'Blacksmith') {
			npc = 'Kalamin: '
			initStoreData()
			msg = 'Need armor or a weapon? You have come to the right place, lad. We offer the best iron and steel in all of Edenburg.'
			townConfig = {
				duration: 1,
				scale: 1.6,
				x: -235,
				y: 40
			}
			bar.openInventory()
			audio.playSound('door-blacksmith', 'town')
		}
		else if (town.openVariousWindow === 'Merchant') {
			npc = 'Roland: '
			initStoreData()
			msg = 'Good day, ' + my.name + ', what are you looking for? We carry the finest cloth and leather goods in all of Vandamor! Be sure to check out the latest shipment of cloaks that we just received! I have a special price just for you, my friend!'
			townConfig = {
				duration: 1,
				scale: 1.5,
				x: -290,
				y: -30
			}
			bar.openInventory()
			audio.playSound('door-merchant', 'town')
		}
		else if (town.openVariousWindow === 'Trade') {
			npc = ''
			msg = trade.data.name + ' says: "Let\'s make a deal, '+ my.name + '?"'
			townConfig = {
				duration: 1,
				scale: 1,
				x: 0,
				y: 0
			}
			bar.openInventory()
		}
		ng.splitText('various-description', npc + msg)
		hideLabel()
		animateBuilding(townConfig)
		tooltip.conditionalHide()
		TweenMax.to('#town-avatar-bg', 3.3, {
			startAt: {
				scale: 1
			},
			scale: 1.1,
			repeat: -1,
			yoyo: true,
			ease: ANIMATE_CANDLE,
		});
	}
	function animateBuilding(o) {
		TweenMax.to('#town-wrap', o.duration, {
			scale: o.scale,
			x: o.x,
			y: o.y,
			ease: Power1.easeInOut,
		});
	}
	function buyItem() {
		// console.warn('buyItem', item.dragType, item.dragSlot, item.dragData.name)
		if (town.openVariousWindow === 'Academy') {
			academy.trainSkill()
		}
		else {
			if (!item.dragData.name) {
				ng.splitText('various-description', 'Select an item to buy first!')
			}
			else if (!buyTypes.includes(item.dragType)) {
				ng.splitText('various-description', 'What?! Why are you trying to buy items you already own?! Did you mean to sell it?')
			}
			else item.buy()
		}
		audio.playSound('click-7')
	}
	function sellItem() {
		// console.warn('sellItem', item.dragType, item.dragSlot, item.dragData.name)
		if (!item.dragData.name) {
			ng.splitText('various-description', 'Select an item to sell first!')
		}
		else if (buyTypes.includes(item.dragType)) {
			ng.splitText('various-description', 'You want to sell MY items? That\'s not how this works, buddy.')
		}
		else item.sell()
		audio.playSound('click-7')
	}
	function setMyGold(newGold) {
		let goldConfig = {
			value: _.clone(my.gold)
		}
		TweenMax.to(goldConfig, .3, {
			value: newGold,
			onUpdate: bar.updateInventoryGold,
			onUpdateParams: [goldConfig]
		})
		my.gold = newGold
	}
	function setStoreGold(newV) {
		if (!item.lastDragEvent.ctrlKey) {
			// console.info('animating to:', newV)
			obj = {
				value: _.clone(item.goldValue)
			}
			TweenMax.to(obj, .3, {
				value: _.clone(newV),
				onUpdate: updateStoreGold,
				onUpdateParams: [obj]
			})
		}
		item.goldValue = tooltip.goldValue
	}
	function updateStoreGold(obj) {
		goldEl = querySelector('#town-value')
		// console.info('updateStoreGold', obj)
		if (goldEl !== null) goldEl.textContent = floor(obj.value)
	}
	function showMerchantMsg() {
		if (buyTypes.includes(town.openVariousWindow.toLowerCase())) {
			// is viewing a store
			if (buyTypes.includes(item.dragType)) {
				// clicked a store item
				querySelector('#various-description').innerHTML = 'Would you like to buy ' + item.getItemNameString(item.dragData) + ' for ' + tooltip.goldValue + ' gold?'
			}
			else {
				// clicked my item
				querySelector('#various-description').innerHTML = 'Would you like to sell ' + item.getItemNameString(item.dragData) + ' for ' + tooltip.goldValue + ' gold?'
			}
			setStoreGold(tooltip.goldValue)
			TweenMax.to('#town-value-wrap', .3, {
				startAt: { filter: 'saturate(3) brightness(4)' },
				filter: 'saturate(1) brightness(1)'
			})
		}
	}
	function bankSlotHtml() {
		i=0
		len = ng.bankSlots
		foo = ''
		for (; i<len; i++) {
			foo += bar.getItemSlotHtml('bank', i)
		}
		return foo
	}
	function getVariousHtml() {
		html = ''
		const el = querySelector('#root-various')
		if (town.openVariousWindow === 'Trade') {
			el.style.width = '23rem'
			el.style.height = '28rem'
		}
		else {
			el.style.width = '56rem'
			el.style.height = '40rem'
		}
		if (town.openVariousWindow === 'Academy') html = academyHtml()
		else if (town.openVariousWindow === 'Apothecary') html = apothecaryHtml()
		else if (town.openVariousWindow === 'Bank') html = bankHtml()
		else if (town.openVariousWindow === 'Blacksmith') html = blacksmithHtml()
		else if (town.openVariousWindow === 'Guild Hall') html = guildHtml()
		else if (town.openVariousWindow === 'Merchant') html = merchantHtml()
		else if (town.openVariousWindow === 'Tavern') html = tavernHtml()
		else if (town.openVariousWindow === 'Trade') html = tradeHtml()
		return html
	}
	function getStoreBodyHtml(building) {
		return '<div id="various-body" class="flex-column flex-max" style="min-height: 0">' +
			'<div class="flex-row flex-max" style="min-height: 0">' +
				academy.getTownNpcHtml(building) +
				'<div id="various-item-wrap">'+ getStoreItemHtml() +'</div>' +
			'</div>' +
			'<div id="buy-sell-row" class="flex-row align-center">' +
				'<div id="town-value-wrap" class="flex-row">'+
					'<img class="store-gold-bar" src="images/ui/gold-bar.png">' +
					'<div id="town-value">0</div>' +
				'</div>' +
				'<div class="flex-row" style="height: 100%">' +
					'<div id="town-buy" class="ng-btn merchant-btn">Buy</div>' +
					'<div id="town-sell" class="ng-btn merchant-btn">Sell</div>' +
				'</div>' +
			'</div>' +
		'</div>'
	}
	function academyHtml() {
		html = variousHeaderHtml() +
		academy.getBodyHtml() +
		variousFooterHtml('images/town/npc-academy')
		return html
	}
	function apothecaryHtml() {
		html = variousHeaderHtml() +
		getStoreBodyHtml('apothecary') +
		variousFooterHtml('images/town/npc-apothecary')
		return html
	}
	function blacksmithHtml() {
		html = variousHeaderHtml() +
		getStoreBodyHtml('blacksmith') +
		variousFooterHtml('images/town/npc-blacksmith')
		return html
	}
	function bankHtml() {
		html = variousHeaderHtml() +
		'<div id="various-body" class="flex-row flex-max">' +
			'<div class="flex-row flex-max">' +
				academy.getTownNpcHtml('bank') +
				'<div id="bank-slot-wrap">' +
					bankSlotHtml() +
				'</div>' +
			'</div>' +
		'</div>' +
		'<div id="inv-skill-description-head" style="'+ css.nameWrapFull +'">' +
			'<div class="stag-blue-top" style="' + css.name + '">'+
				css.gildedHeader +
				'Bank Details'+
			'</div>' +
		'</div>' +
		variousFooterHtml('images/town/npc-bank')
		return html
	}
	function guildHtml() {
		html = variousHeaderHtml() +
		'<div class="flex-row flex-max">' +
			academy.getTownNpcHtml('guild') +
			'<div id="various-body" class="flex-column flex-max" style="display: flex; flex-direction: column;">' +
				// new stuff
				'<div id="various-wrap">';
				if (my.guild.name) {
					html += '<div class="aside-frame">' +
						'<div>Guild: '+ my.guild.name +'</div> ' +
						'<div>Title: '+ guild.ranks[my.guild.rank] +'</div> ' +
						'<div>Total Members: <span id="guild-member-count">'+ guild.memberList.length +'</span></div> ' +
					'</div>' +
					'<div class="flex" style="'+ css.header +'">' +
						'<div class="flex-column flex-max" style="'+ css.nameWrapFull +'">' +
							'<div class="stag-blue-top" style="' + css.name + '">'+
								css.gildedHeader +
								'Guild Members'+
							'</div>' +
						'</div>' +
						'<div id="guild-member-refresh-btn" class="ng-btn">Update</div>'+
					'</div>' +
					'<div id="guild-member-wrap" class="aside-frame">' +
						'<table id="aside-guild-members"></table>'+
					'</div>' +
					'</div>'
				}
				else {
					html += '<div id="guild-create-wrap" class="flex-column flex-max">' +
						'<input id="guild-input" class="text-shadow" type="text" maxlength="30" autocomplete="off" spellcheck="false">' +
						'<div id="guild-create" class="ng-btn">Create Guild</div> ' +
						'<div class="aside-frame" style="margin-top: 1rem">'+
							'Only letters A through Z and apostrophes are accepted in guild names. Standarized capitalization will be automatically applied. The guild name must be between 4 and 30 characters. All guild names are subject to the royal statutes regarding common decency in Vandamor.'+
						'</div>' +
					'</div>'
				}
				html += '</div>' +
			'</div>' +
		'</div>' +
		variousFooterHtml('images/town/npc-guild')
		return html
	}
	function merchantHtml() {
		html = variousHeaderHtml() +
		getStoreBodyHtml('merchant') +
		variousFooterHtml('images/town/npc-merchant')
		return html
	}
	function getStoreItemHtml() {
		str = ''
		type = town.openVariousWindow.toLowerCase()
		len = storeItems.length || item.MAX_SLOTS[type]
		for (i=0; i<64; i++) {
			str += bar.getItemSlotHtml(type, i)
		}
		return str
	}
	function tavernHtml() {
		html = variousHeaderHtml() +
		tavern.getBodyHtml() +
		variousFooterHtml('images/town/npc-tavern')
		return html
	}
	function tradeHtml() {
		// for trading to PCs
		html = variousHeaderHtml() +
		trade.getBodyHtml() +
		variousFooterHtml('images/avatars/' + trade.getTradeAvatar())
		return html
	}
	function variousHeaderHtml() {
		return '<div class="flex" style="'+ css.header +'">' +
			'<div class="flex-column flex-max" style="'+ css.nameWrap +'">' +
				'<div class="stag-blue-top" style="' + css.name + '">'+
					css.gildedHeader +
					town.openVariousWindow +
				'</div>' +
			'</div>' +
			'<img data-id="various" class="close-menu" src="images/ui/close-6.png">' +
		'</div>'
	}
	function variousFooterHtml(path) {
		return '<div id="various-footer" class="flex-center">' +
			'<div id="town-avatar-col">' +
				'<div id="town-avatar-wrap">' +
					'<div id="town-avatar-bg"></div>' +
					'<img id="town-avatar" class="town-avatars" src="'+ path +'.png">' +
				'</div>' +
			'</div>' +
			'<div id="various-description" class="flex-max""></div>' +
		'</div>'
	}
	function isMerchantMode() {
		return merchants.includes(town.openVariousWindow)
	}
	function killAllTweens() {
		town.tweens.forEach(t => {
			t.kill()
		})
	}
})($, _, TweenMax, Power0, Power1, Power2, window);