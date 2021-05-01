var town;
(function($, _, TweenMax, Linear, RoughEase, Power0, Power1, Power2, Expo, undefined) {
	town = {
		go,
		init,
		preload,
		openVarious,
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
		isInitialized: {
			'apothecary': false,
			'blacksmith': false,
			'merchant': false,
		},
		firstLoad: true,
		lastAside: {},
		delegated: 0,
		openVariousWindow: '',
		isBankInitialized: false,
	}
	var i, key, id, len, html, str, foo, msg, itemIndex, rarity, townConfig, labelConfig, label, npc, obj, goldEl, labelObj, goldConfig, goldEl, myGoldEl, type, potionItems, potLevel, scrollItems

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
			ITEM_TYPE.AMULETS,
			ITEM_TYPE.RINGS,
			ITEM_TYPE.CHARMS,
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
		mob.textures = {}
		my.target = -1
		my.targetIsMob = true
		battle.hideTarget()
		mob.killAttacks()
		dungeon.map = {} // reset map data so it can be initialized next embark
		dungeon.killEntityTweens()
		audio.stopAmbient()
		map.hide()
		map.inCombat = false
		if (!create.selected) return

		audio.playMusic('intro', 'wav')
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

		$.post(app.url + 'character/load-character.php', {
			row: create.selected
		}).done((data) => {
			if (town.firstLoad) {
				town.firstLoad = false;
				chat.log('Welcome to Broken.net!')
				chat.log('You have entered Vandamor.')
				chat.log('Type /help or /h for a list of chat commands.', 'chat-warning')
			}
			chat.sizeTown();
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

			if (typeof my.handToHand === 'undefined') {
				my.handToHand = 1
				my.saveCharacterData()
			}
			// skills
			my.initSkills()

			stats.setAllResources()
			my.set(PROP.HP, my.hpMax)
			my.set(PROP.MP, my.mpMax)
			my.set(PROP.SP, my.spMax)

			// init party member values
			ng.setScene('town')
			chat.init()

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
			expanse.startSkyPhase()
			town.init()
			bar.init()
			tavern.init()
			skills.init()
			battle.removeAllBuffs()
			button.setAll()
		}).fail(function(data){
			ng.disconnect(data.responseText);
		});
	}
	function socketReady() {
		// stuff to do after the socket wakes up
		party.listen(party.getUniquePartyChannel())
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
		TweenMax.to('#town-wrap, #sky-wrap', .5, {
			startAt: { filter: 'brightness(0)' },
			overwrite: 1,
			delay: .5,
			filter: 'brightness(1)',
			onComplete: ng.unlock
		})
		// console.warn('town.socketReady!')
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

			for (i = 0; i<item.MAX_SLOTS[type]; i++) {
				rarity = _.random(0, 7) < 7 ? 'magic' : 'rare'
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
		html = '<div id="town-wrap">' +
			'<div id="town-building-wrap" class="wh-100">' +
				'<img data-id="Academy" id="town-academy" class="town-building" src="images/town/town-academy.png">' +
				'<img id="town-background" class="town-bg" src="images/town/town-bg-3.png">' +
				'<img data-id="Apothecary" id="town-apothecary" class="town-building" src="images/town/town-apothecary.png">' +
				'<img data-id="Merchant" id="town-merchant" class="town-building" src="images/town/town-merchant.png">' +
				'<img data-id="Bank" id="town-bank" class="town-building" src="images/town/town-bank.png">' +
				'<img data-id="Tavern" id="town-tavern" class="town-building" src="images/town/town-tavern.png">' +
				'<img data-id="Guild Hall" id="town-guild" class="town-building" src="images/town/town-guild.png">' +
				'<img data-id="Blacksmith" id="town-blacksmith" class="town-building" src="images/town/town-blacksmith.png">' +
			'</div>' +
			'<div id="town-building-label-wrap" class="text-shadow2">'+
				'<div id="town-building-label-header"></div>' +
				'<div id="town-build-label-description"></div>' +
			'</div>' +
		'</div>'

		return html
	}
	function handleGuildInputBlur() {
		guild.hasFocus = true;
	}
	function handleGuildInputFocus() {
		guild.hasFocus = false;
	}
	function refreshGuildMembers() {
		guild.loadGuildMsg()
		guild.getMembers(guild.throttleTime);
	}
	function init() {
		town.preload();
	}
	function preload() {
		cache.preloadImages([])
	}

	function loadBank() {
		$.get(app.url + 'town/load-bank.php')
			.done(processBank)
	}

	function processBank(data) {
		// console.info('bank data', data)
		ng.bankSlots = data.bankSlots
		for (var i=0; i<ng.bankSlots; i++) {
			items.bank[i] = {}
		}
		for (var key in data.bank) {
			items.bank[key] = JSON.parse(data.bank[key].data)
			items.bank[key].row = data.bank[key].row
			items.bank[key].name = data.bank[key].name
		}
		town.isBankInitialized = true
		querySelector('#bank-slot-wrap').innerHTML = bankSlotHtml()
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
		id = this.dataset.id
		label = id
		msg = ''
		labelConfig = {
			left: -1000,
			top: -1000
		}

		if (id === 'Academy') {
			msg = 'Train your skills and spells to achieve mastery'
			labelConfig = {
				left: ng.toPercentWidth(488),
				top: ng.toPercentHeight(232)
			}
		}
		else if (id === 'Apothecary') {
			msg = 'Buy potions, jewelry, and various arcane items to help assure your survival'
			labelConfig = {
				left: ng.toPercentWidth(1178),
				top: ng.toPercentHeight(434)
			}
		}
		else if (id === 'Bank') {
			msg = 'Banked items may be shared with all characters on the same account'
			labelConfig = {
				left: ng.toPercentWidth(950),
				top: ng.toPercentHeight(386)
			}
		}
		else if (id === 'Blacksmith') {
			msg = 'Choose from the finest selection of weapons and armor in all of Edenburg'
			labelConfig = {
				left: ng.toPercentWidth(1495),
				top: ng.toPercentHeight(555)
			}
		}
		else if (id === 'Guild Hall') {
			msg = 'Start a guild, invite friends, and build your roster for ultimate readiness'
			labelConfig = {
				left: ng.toPercentWidth(1519),
				top: ng.toPercentHeight(192)
			}
		}
		else if (id === 'Merchant') {
			msg = 'Buy weapons, armor, and jewelry from the largest variety of items in all of Edenburg'
			labelConfig = {
				left: ng.toPercentWidth(719),
				top: ng.toPercentHeight(429)
			}
		}
		else if (id === 'Tavern') {
			msg = 'Select missions, seek wisdom from the innkeeper, and view the leaderboard'
			labelConfig = {
				left: ng.toPercentWidth(302),
				top: ng.toPercentHeight(467)
			}
		}
		if (!town.openVariousWindow) {
			var e = querySelector('#town-building-label-header');
			e.textContent = id;
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
	}
	function hideLabel() {
		TweenMax.to('#town-building-label-wrap', .5, {
			opacity: 0
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
		if (town.openVariousWindow === 'Academy') {
			npc = 'Magda: '
			msg = 'All of your skills may be trained here. You will never reach your full potential without diligence! Each skill must be trained individually.'
			townConfig = {
				duration: 1,
				scale: 1.5,
				x: 280,
				y: 230
			}
			bar.openInventory()
			audio.playSound('door-academy', 'town')
		}
		else if (town.openVariousWindow === 'Apothecary') {
			npc = 'Briza: '
			initStoreData()
			msg = 'Fill your bag full of potions if you want to survive! I have a selection of items ranging from the deadly to the arcane!.'
			townConfig = {
				duration: 1,
				scale: 1.4,
				x: -100,
				y: -50
			}
			bar.openInventory()
			audio.playSound('door-apothecary', 'town')
		}
		else if (town.openVariousWindow === 'Bank') {
			npc = 'Ingmar: '
			msg = 'If you have any special items that you would like to share with other heroes, you have come to the right place. I take an interest to collecting rare treasures as well!'
			if (!town.isBankInitialized) loadBank()
			townConfig = {
				duration: 1,
				scale: 1.4,
				x: 100,
				y: 20
			}
			bar.openInventory()
			audio.playSound('door-bank', 'town')
		}
		else if (town.openVariousWindow === 'Blacksmith') {
			npc = 'Kalamin: '
			initStoreData()
			msg = 'Need armor or a weapon? You have come to the right place, lad. We offer the best iron and steel in all of Edenburg.'
			townConfig = {
				duration: 1,
				scale: 1.2,
				x: -130,
				y: -100
			}
			bar.openInventory()
			audio.playSound('door-blacksmith', 'town')
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
				scale: 1.3,
				x: -180,
				y: 120
			}
			audio.playSound('door-guild', 'town')
		}
		else if (town.openVariousWindow === 'Merchant') {
			npc = 'Roland: '
			initStoreData()
			msg = 'Good day, ' + my.name + ', what are you looking for? We carry the finest jewelry in all of Vandamor! Be sure to check out the latest shipment of cloaks that we just received! I have a special price just for you, my friend!'
			townConfig = {
				duration: 1,
				scale: 1.4,
				x: 250,
				y: -30
			}
			bar.openInventory()
			audio.playSound('door-merchant', 'town')
		}
		else if (town.openVariousWindow === 'Tavern') {
			npc = 'Eber: '
			zones = zones.map(z => {
				z.isOpen = 0
				return z;
			})
			msg = 'Welcome to the Edenburg Tavern, '+ my.name +'. The King has requested the services of brave adventurers like yourself to complete missions in defense of our interests. How do you choose to serve?'
			townConfig = {
				duration: 1,
				scale: 1.2,
				x: 100,
				y: -100
			}
			tavern.activeTab = 'tavern-missions'
			audio.playSound('door-tavern', 'town')
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
		TweenMax.to('#town-wrap, #sky-wrap', o.duration, {
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
	}
	function setMyGold(newGold) {
		goldConfig = {
			value: _.clone(my.gold)
		}
		TweenMax.to(goldConfig, .3, {
			value: newGold,
			onUpdate: bar.updateInventoryGold,
		})
		my.gold = newGold
	}
	function setStoreGold(newV) {
		if (!item.lastDragEvent.ctrlKey) {
			console.info('animating to:', newV)
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
		console.info('updateStoreGold', obj)
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
	function getStoreBodyHtml() {
		return '<div id="various-body" class="flex-column flex-max">' +
			'<div id="various-item-wrap">'+ getStoreItemHtml() +'</div>' +
			'<div id="buy-sell-row" class="flex-row align-center">' +
				'<div id="town-value-wrap" class="flex-row">'+
					'<i style="align-self: center;" class="ra ra-gold-bar"></i>' +
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
		getStoreBodyHtml() +
		variousFooterHtml('images/town/npc-apothecary')
		return html
	}
	function blacksmithHtml() {
		html = variousHeaderHtml() +
		getStoreBodyHtml() +
		variousFooterHtml('images/town/npc-blacksmith')
		return html
	}
	function bankHtml() {
		html = variousHeaderHtml() +
		'<div id="various-body" class="flex-column flex-max">' +
			'<div id="bank-slot-wrap">' +
				bankSlotHtml() +
			'</div>' +
		'</div>' +
		'<div id="inv-skill-description-head" style="'+ css.nameWrapFull +'">' +
			'<div class="stag-blue-top" style="' + css.name + '">Bank Details</div>' +
		'</div>' +
		variousFooterHtml('images/town/npc-bank')
		return html
	}
	function guildHtml() {
		html = variousHeaderHtml() +
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
						'<div class="stag-blue-top" style="' + css.name + '">Guild Members</div>' +
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
					'<div class="aside-frame" style="margin-top: 1rem">Only letters A through Z and apostrophes are accepted in guild names. Standarized capitalization will be automatically applied. The guild name must be between 4 and 30 characters. All guild names are subject to the royal statutes regarding common decency in Vandamor.</div>'
				'</div>'
			}
			html += '</div>' +
		'</div>' +
		variousFooterHtml('images/town/npc-guild')
		return html
	}
	function merchantHtml() {
		html = variousHeaderHtml() +
		getStoreBodyHtml() +
		variousFooterHtml('images/town/npc-merchant')
		return html
	}
	function getStoreItemHtml() {
		str = ''
		type = town.openVariousWindow.toLowerCase()
		len = storeItems.length || item.MAX_SLOTS[type]
		for (i=0; i<len; i++) {
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
				'<div class="stag-blue-top" style="' + css.name + '">'+ town.openVariousWindow +'</div>' +
			'</div>' +
			'<img data-id="various" class="close-menu" src="images/ui/close.png">' +
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
})($, _, TweenMax, Linear, RoughEase, Power0, Power1, Power2, Expo);