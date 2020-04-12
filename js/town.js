var town;
(function($, _, TweenMax, Linear, RoughEase, Power0, Power1, undefined) {
	town = {
		lastAside: {},
		delegated: 0,
		windowsOpen: {
			various: ''
		},
		isBankInitialized: false,
		isMerchantInitialized: false,
		isBlacksmithInitialized: false,
		isApothecaryInitialized: false,
		go,
		init,
		preload,
		openVarious,
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
	}
	var i, id, len, html, str, foo, msg, bgConfig, itemIndex, rarity, townConfig, labelConfig, label, value, obj, goldEl, labelObj
	const merchants = [
		'Merchant',
		'Apothecary',
		'Blacksmith',
	]
	const blacksmithSlots = [
		'helms',
		'shoulders',
		'chests',
		'bracers',
		'gloves',
		'belts',
		'legs',
		'boots',
		'oneHandBlunts',
		'twoHandBlunts',
		'oneHandSlashers',
		'twoHandSlashers',
	]
	const apothecarySlots = [
		'amulets',
		'rings',
		'charms',
		'cloaks',
		'bows',
		'piercers',
		'focus',
		'staves',
		'shields',
	]
	const merchantSlots = [
		...blacksmithSlots,
		...apothecarySlots
	]
	////////////////////////////////////////////
	function go() {
		if (ng.view === 'town') return;
		if (create.selected) {
			game.session.timer.kill()
			game.emptyScenesExcept('scene-town');
			ng.lock(1);
			if (ng.view === 'dungeon') {
				TweenMax.set('#body', {
					opacity: 0
				})
			}
			town.isMerchantInitialized = false
			town.isBlacksmithInitialized = false
			town.isApothecaryInitialized = false
			chat.sizeLarge();
			TweenMax.set(button.wrap, {
				bottom: '-5rem'
			});
			$.post(app.url + 'character/load-character.php', {
				row: create.selected
			}).done(function(data) {
				console.info('load-character: ', data)
				// my processing
				Object.assign(my, _.omit(data.characterData, ['data']))
				data.characterData.data = JSON.parse(data.characterData.data)
				for (var key in data.characterData.data) {
					my[key] = data.characterData.data[key]
				}
				my.jobLong = ng.toJobLong(my.job)
				my.avatar = my.getAvatarUrl()
				Object.assign(my, my.getResistObject())
				// other things

				bar.setDefaultInvWeaponImage()

				guild.setGuildData(data)

				my.processInv(data.inv)
				my.processEq(data.eq)

				stat.setResources()
				my.hp = my.maxHp
				my.mp = my.maxMp
				my.sp = my.maxSp

				// init party member values
				ng.setScene('town')
				chat.init()
				socket.init()
				friend.init()
				ignore.init()
				game.initPlayedCache()

				getElementById('scene-town').innerHTML = getTownHtml()
				animateClouds()
				animateSky()
				$("#scene-title").remove()
				town.init()
				bar.init();
				// await socket connect
				(function repeat() {
					if (socket.enabled) {
						// stuff to do after the socket wakes up
						party.listen(party.getUniquePartyChannel())
						chat.sendMsg('/join')
						chat.history = [];
						// town
						TweenMax.to('#scene-town', .2, {
							opacity: 1
						})
						TweenMax.to('#body, #town-wrap', .5, {
							delay: .5,
							opacity: 1,
							onComplete: ng.unlock
						})
					}
					else {
						delayedCall(.1, repeat);
					}
				})();
			}).fail(function(data){
				ng.disconnect(data.responseText);
			});
		}
	}
	function animateSky() {
		var duration = 1200
		TweenMax.to('#sun', duration, {
			startAt: { top: '50vw', y: '0%' },
			top: '-80vw',
			force3D: true,
			ease: Power2.easeOut
		})
		TweenMax.to('#sun', 1/60, {
			rotation: 360,
			repeat: -1,
			force3D: true,
			ease: Linear.easeOut
		})
		var skyProps = {
			top: 50,
			left: 66,
			innerR: 92,
			innerG: 32,
			innerB: 160,
			outerR: 16,
			outerG: 0,
			outerB: 48,
		}
		var el = querySelector('#town-sky')
		TweenMax.to(skyProps, duration, {
			top: -80,
			innerR: 80,
			innerG: 192,
			innerB: 255,
			outerR: 0,
			outerG: 80,
			outerB: 192,
			onUpdate: setSky,
			onUpdateParams: [el, skyProps],
			ease: Power2.easeOut
		})

		TweenMax.to('#town-building-wrap', duration / 2, {
			startAt: {
				filter: 'saturate(.5) brightness(.5)'
			},
			filter: 'saturate(1) brightness(1)',
			ease: Power2.easeOut
		})

		TweenMax.to('.town-clouds', duration / 2, {
			startAt: {
				filter: 'saturate(.1) brightness(.1) opacity(.6)'
			},
			filter: 'saturate(1) brightness(1) opacity(.85)',
			ease: Power2.easeOut
		})
	}
	function setSky(el, obj) {
		TweenMax.set(el, {
			background: 'radial-gradient('+
				'farthest-side at '+ obj.left +'vw '+ obj.top +'vw,'+
				'rgb('+ obj.innerR +', ' + obj.innerG + ', ' + obj.innerB + '),'+
				'rgb('+ obj.outerR +', ' + obj.outerG + ', ' + obj.outerB + ')' +
			')'
		})
	}
	function animateClouds() {
		var duration = 777
		/*TweenMax.set('#cloud-1', {
			transformOrigin: '50% 0%',
			transformPerspective: 200,
			rotationX: -25,
		})*/
		TweenMax.to('#cloud-1', duration / 2, {
			left: '-100%',
			force3D: true,
			ease: Linear.easeNone,
			onComplete: function() {
				TweenMax.to('#cloud-1', duration, {
					startAt: { left: '100%' },
					left: '-100%',
					force3D: true,
					ease: Linear.easeNone,
					repeat: -1
				})
			}
		})
		TweenMax.to('#cloud-2', duration, {
			left: '-100%',
			force3D: true,
			ease: Linear.easeNone,
			repeat: -1
		})
	}
	function getTownHtml() {
		html = '<div id="town-wrap">' +
			'<div id="town-sky" class="img-bg town-bg"></div>' +
			'<img id="sun" class="celestial" src="images/env/sun-4.png">' +
			'<img id="cloud-1" class="town-clouds" src="images/town/town-clouds-1.png">' +
			'<img id="cloud-2" class="town-clouds" src="images/town/town-clouds-1.png">' +
			'<div id="town-building-wrap" class="img-bg">' +
				'<img data-id="Academy" id="town-academy" class="town-building" src="images/town/town-academy.png">' +
				'<img id="town-background" class="town-bg" src="images/town/town-bg-2.png">' +
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
		'</div>' +
		'<div id="town-footer" class="text-shadow2">' +
			'<div id="town-footer-flex">' +
				'<div class="flex-center flex-max">'+
					'<div data-id="Mission Counter" id="town-mission" class="ng-btn town-building">Mission Counter</div>' +
				'</div>' +
				'<div id="town-footer-gold-wrap">'+
					'<div id="town-gold" style="margin: 0 .2rem; ">'+ my.gold +'</div>' +
					'<i style="margin: 0 .2rem; color: gold" class="ra ra-gold-bar"></i>' +
				'</div>' +
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
		cache.preloadImages([
			'images/bg/bastille-1.png',
			'images/bg/bastille-2.png'
		])
	}

	function loadBank() {
		$.get(app.url + 'town/load-bank.php')
			.done(processBank)
	}

	function processBank(data) {
		console.info('bank data', data)
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

	function processMerchant() {
		len = merchantSlots.length - 1
		for (var i=0; i<item.MAX_MERCHANT; i++) {
			rarity = _.random(0, 7) < 7 ? 'magic' : 'rare'
			itemIndex = _.random(0, len)
			items.merchant[i] = item.getItem({
				mobLevel: my.level,
				bonus: 0,
				rarity: rarity,
				itemSlot: merchantSlots[itemIndex]
			})
		}
		town.isMerchantInitialized = true
		$('#various-item-wrap').html(getMerchantSlotHtml())
	}

	function openVarious(event) {
		if (event.currentTarget.dataset.id === town.windowsOpen.various) closeVarious()
		else {
			town.windowsOpen.various = event.currentTarget.dataset.id
			updateVariousDOM()
		}
	}
	function closeVarious() {
		town.windowsOpen.various && tooltip.conditionalHide(town.windowsOpen.various.toLowerCase())
		town.windowsOpen.various = ''
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
			left: 0,
			top: 0
		}

		if (id === 'Academy') {
			msg = 'Train your skills and spells to achieve mastery'
			labelConfig = {
				left: ng.toPercentWidth(488),
				top: ng.toPercentHeight(232)
			}
		}
		else if (id === 'Apothecary') {
			msg = 'Buy potions and arcane items to prolong survival'
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
			msg = 'Buy, sell and repair your weapons and armor'
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
			msg = 'Buy and sell from the largest selector of items in Edenburg'
			labelConfig = {
				left: ng.toPercentWidth(719),
				top: ng.toPercentHeight(429)
			}
		}
		else if (id === 'Tavern') {
			msg = 'View the leaderboard, seek advice from the innkeeper, and swap information with other heroes'
			labelConfig = {
				left: ng.toPercentWidth(302),
				top: ng.toPercentHeight(467)
			}
		}
		if (!town.windowsOpen.various) {
			ng.splitText('town-building-label-header', id, .5, .05)
			ng.splitText('town-build-label-description', msg, .2, .015)
			TweenMax.killTweensOf(labelObj)
			TweenMax.to('#town-building-label-wrap', .2, {
				startAt: {
					left: labelConfig.left + '%',
					top: labelConfig.top + '%'
				},
				opacity: 1
			})
			labelObj = {
				brightness: 1.5
			}
			TweenMax.set('#town-building-label-wrap', {
				backdropFilter: 'sepia(1) hue-rotate(180deg) saturate(4) brightness(1.5)',
			})
			TweenMax.to(labelObj, .4, {
				delay: .3,
				brightness: 10,
				onUpdate: setLabelBg,
				onUpdateParams: [labelObj],
				yoyo: true,
				repeat: 1,
				ease: Power1.easeInOut
			})
		}
	}
	function setLabelBg(obj) {
		TweenMax.set('#town-building-label-wrap', {
			backdropFilter: 'sepia(1) hue-rotate(180deg) saturate(6) brightness('+ obj.brightness +')'
		})
	}
	function hideLabel() {
		TweenMax.to('#town-building-label-wrap', .5, {
			opacity: 0
		})

	}
	function updateVariousDOM() {
		querySelector('#root-various').innerHTML = getVariousHtml()
		querySelector('#root-various').style.display = 'flex'
		bgConfig = {
			startX: '0%',
			startY: '0%',
			endX: '-40%',
			endY: '-5%'
		}

		msg = ''
		if (town.windowsOpen.various === 'Academy') {
			msg = 'Your skills and spells may be trained here. You will never reach your full potential without diligence! Each skill or spell must be trained individually.'
			townConfig = {
				duration: 1,
				scale: 1.5,
				x: 400,
				y: 250
			}
		}
		else if (town.windowsOpen.various === 'Apothecary') {
			msg = 'Make sure you stock up on our potions to survive to the end of your mission. We also offer items from the practical to the arcane.'
			townConfig = {
				duration: 1,
				scale: 1.4,
				x: -100,
				y: -50
			}
		}
		else if (town.windowsOpen.various === 'Bank') {
			msg = 'If you have any special items that you would like to share with other heroes, you have come to the right place. I take an interest to collecting rare treasures as well!'
			if (!town.isBankInitialized) loadBank()
			townConfig = {
				duration: 1,
				scale: 1.4,
				x: 200,
				y: 20
			}
		}
		else if (town.windowsOpen.various === 'Blacksmith') {
			msg = 'Need armor or a weapon? You have come to the right place, lad. We offer the best iron and steel in all of Edenburg.'
			townConfig = {
				duration: 1,
				scale: 1.2,
				x: -180,
				y: -100
			}
		}
		else if (town.windowsOpen.various === 'Guild Hall') {
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
		}
		else if (town.windowsOpen.various === 'Merchant') {
			!town.isMerchantInitialized && processMerchant()
			msg = 'Good day, ' + my.name + ', what are you looking for? We carry the finest jewelry in all of Vandamor! Be sure to check out the latest shipment of cloaks that we just received! I have a special price just for you, my friend!'
			bgConfig = {
				startX: '-20%',
				startY: '-40%',
				endX: '-43%',
				endY: '-2%'
			}
			townConfig = {
				duration: 1,
				scale: 1.4,
				x: 250,
				y: -30
			}
		}
		else if (town.windowsOpen.various === 'Mission Counter') {
			msg = 'Edenburg needs brave adventurers like you to restore peace to our blessed Kingdom! Some missions are more dangerous than others—choose your mission carefully!'
			townConfig = {
				duration: .5,
				scale: 1,
				x: 0,
				y: 0
			}
		}
		else if (town.windowsOpen.various === 'Tavern') {
			msg = 'Tell me your story, adventurer. What brings you to Edenburg? Many adventurers come to this city seeking fame and fortune. I am happy to share the wisdom and knowledge I have acquired.'
			townConfig = {
				duration: 1,
				scale: 1.2,
				x: 150,
				y: -100
			}
		}
		ng.splitText('various-description', msg)
		hideLabel()
		animateBuilding(townConfig)
		TweenMax.to('#town-various-bg', 1, {
			startAt: {
				x: bgConfig.startX,
				y: bgConfig.startY
			},
			x: bgConfig.endX,
			y: bgConfig.endY
		})
		tooltip.conditionalHide()
	}
	function animateBuilding(o) {
		TweenMax.to('#town-wrap', o.duration, {
			scale: o.scale,
			x: o.x,
			y: o.y
		});
	}
	function getVariousHtml() {
		html = ''
		if (town.windowsOpen.various === 'Academy') html = academyHtml()
		else if (town.windowsOpen.various === 'Apothecary') html = apothecaryHtml()
		else if (town.windowsOpen.various === 'Bank') html = bankHtml()
		else if (town.windowsOpen.various === 'Blacksmith') html = blacksmithHtml()
		else if (town.windowsOpen.various === 'Guild Hall') html = guildHtml()
		else if (town.windowsOpen.various === 'Merchant') html = merchantHtml()
		else if (town.windowsOpen.various === 'Mission Counter') html = missionCounterHtml()
		else if (town.windowsOpen.various === 'Tavern') html = tavernHtml()
		return html
	}
	function academyHtml() {
		html = variousHeaderHtml() +
		'<div id="various-body" class="flex-column flex-max">' +
			'Academy body!' +
		'</div>' +
		variousFooterHtml('human-female-0')
		return html
	}
	function apothecaryHtml() {
		html = variousHeaderHtml() +
		'<div id="various-body" class="flex-column flex-max">' +
			'Apothecary body!' +
		'</div>' +
		variousFooterHtml('seraph-male-2')
		return html
	}
	function blacksmithHtml() {
		html = variousHeaderHtml() +
		'<div id="various-body" class="flex-column flex-max">' +
			'Blacksmith body!' +
		'</div>' +
		variousFooterHtml('barbarian-male-2')
		return html
	}
	function bankSlotHtml() {
		i=0
		len = ng.bankSlots
		foo = '<div id="bank-slot-wrap">'
		for (; i<len; i++) {
			foo += bar.getItemSlotHtml('bank', i)
		}
		foo += '</div>'
		return foo
	}
	function bankHtml() {
		html = variousHeaderHtml() +
		bankSlotHtml() +
		'<div id="inv-skill-description-head" style="'+ css.nameWrapFull +'">' +
			'<div class="stag-blue-top" style="' + css.name + '">Bank Details</div>' +
		'</div>' +
		variousFooterHtml('dwarf-male-0')
		return html
	}
	function missionCounterHtml() {
		html = variousHeaderHtml() +
		'<div id="various-body" class="flex-column flex-max">' +
			mission.asideHtmlHead() +
			'<div id="mission-counter" class="aside-frame text-shadow">' +
				mission.asideHtml() +
			'</div>' +
			(my.quest.level ? mission.asideFooter() : '') +
		'</div>' +
		variousFooterHtml('human-female-0')
		return html
	}
	function guildHtml() {
		html = variousHeaderHtml() +
		'<div id="various-body" class="flex-column flex-max" style="display: flex; flex-direction: column;">' +
			// new stuff
			'<img id="town-various-bg" src="images/bg/bastille-2.png" style="display: none">' +
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
				html += '<div class="flex-column" style="margin: .5rem">' +
					'<input id="guild-input" class="text-shadow" type="text" maxlength="30" autocomplete="off" spellcheck="false">' +
					'<div id="guild-create" class="ng-btn">Create Guild</div> ' +
					'<div class="aside-frame" style="margin-top: 1rem">Only letters A through Z and apostrophes are accepted in guild names. Standarized capitalization will be automatically applied. The guild name must be between 4 and 30 characters. All guild names are subject to the royal statutes regarding common decency in Vandamor.</div>'
				'</div>'
			}
			html += '</div>' +
		'</div>' +
		variousFooterHtml('seraph-female-1')
		return html
	}
	const buyTypes = [
		'merchant',
		'apothecary',
		'blacksmith',
	]
	function buyItem() {
		console.warn('buyItem', item.dragType, item.dragSlot, item.dragData.name)
		if (!item.dragData.name) {
			ng.splitText('various-description', 'Select an item to buy first!')
		}
		else if (!buyTypes.includes(item.dragType)) {
			ng.splitText('various-description', 'What?! Why are you trying to buy items you already own?! Did you mean to sell it?')
		}
		else {
			// TODO: ensure we have inventory space, gold validation
			var slot = item.getFirstAvailableInvSlot()
			if (slot === -1) {
				ng.splitText('various-description', 'You have no room in your inventory! Come back when you have room.')
				return
			}
			if (item.goldValue > my.gold) {
				ng.splitText('various-description', 'Sorry, friend! We don\'t offer financing! You\'re gonna need more gold than that!')
				return
			}
			ng.splitText('various-description', 'Thank you for buying ' + item.dragData.name + ' for ' + item.goldValue + ' gold!')
			// insert item to inventory


			// sets target price to zero
			tooltip.goldValue = 0
			setStoreGold()
			item.dropReset()
		}
	}
	function sellItem() {
		console.warn('sellItem', item.dragType, item.dragSlot, item.dragData.name)
		if (!item.dragData.name) {
			ng.splitText('various-description', 'Select an item to sell first!')
		}
		else if (buyTypes.includes(item.dragType)) {
			ng.splitText('various-description', 'You want to sell MY items? That\'s not how this works, buddy.')
		}
		else {
			ng.splitText('various-description', 'Thank you for selling ' + item.dragData.name + ' for ' + item.goldValue + ' gold!')
			tooltip.goldValue = 0
			setStoreGold()
			item.dropReset()
		}
	}
	function showMerchantMsg() {
		if (buyTypes.includes(town.windowsOpen.various.toLowerCase())) {
			// is viewing a store
			if (buyTypes.includes(item.dragType)) {
				// clicked a store item
				ng.splitText('various-description', 'Do you want to buy ' + item.dragData.name + ' for ' + tooltip.goldValue + ' gold?')
			}
			else {
				// clicked my item
				ng.splitText('various-description', 'Do you want to sell ' + item.dragData.name + ' for ' + tooltip.goldValue + ' gold?')
			}
			setStoreGold()
			TweenMax.to('#town-value-wrap', .5, {
				startAt: { filter: 'saturate(3) brightness(3)' },
				filter: 'saturate(1) brightness(1)'
			})
		}
	}
	function setStoreGold() {
		obj = {
			value: _.clone(item.goldValue)
		}
		TweenMax.to(obj, .5, {
			value: _.clone(tooltip.goldValue),
			onUpdate: updateStoreGold,
			onUpdateParams: [obj]
		})
		item.goldValue = tooltip.goldValue
	}
	function updateStoreGold(obj) {
		goldEl = querySelector('#town-value')
		if (goldEl !== null) goldEl.textContent = ~~obj.value

	}
	function merchantHtml() {
		html = variousHeaderHtml() +
		'<div id="various-body" class="flex-column flex-max">' +
			'<img id="town-various-bg" src="images/bg/bastille-1.png" style="display: none">' +
			'<div id="various-item-wrap">'+ getMerchantSlotHtml() +'</div>' +
			'<div id="buy-sell-row" class="flex-row align-center">' +
				'<div id="town-value-wrap" class="flex-row">'+
					'<i style="margin-top: .2rem" class="ra ra-gold-bar"></i>' +
					'<div id="town-value">0</div>' +
				'</div>' +
				'<div class="flex-row" style="height: 100%">' +
					'<div id="town-buy" class="ng-btn merchant-btn">Buy</div>' +
					'<div id="town-sell" class="ng-btn merchant-btn">Sell</div>' +
				'</div>' +
			'</div>' +
		'</div>' +
		variousFooterHtml('gnome-male-0')
		return html
	}
	function getMerchantSlotHtml() {
		str = ''
		for (i=0; i<item.MAX_MERCHANT; i++) {
			str += bar.getItemSlotHtml('merchant', i)
		}
		return str
	}
	function tavernHtml() {
		html = variousHeaderHtml() +
		'<div id="various-body" class="flex-column flex-max">' +
			'Tavern body!' +
		'</div>' +
		variousFooterHtml('dark-elf-female-0')
		return html
	}
	function variousHeaderHtml() {
		return '<div class="flex" style="'+ css.header +'">' +
			'<div class="flex-column flex-max" style="'+ css.nameWrap +'">' +
				'<div class="stag-blue-top" style="' + css.name + '">'+ town.windowsOpen.various +'</div>' +
			'</div>' +
			'<i data-id="various" class="close-menu fa fa-times"></i>' +
		'</div>'

	}
	function variousFooterHtml(avatar) {
		return '<div id="various-footer" class="flex-center stag-blue-top">' +
			'<div class="town-avatar-wrap">' +
				'<img class="town-avatars" src="images/avatars/'+ avatar +'.png">' +
			'</div>' +
			'<div id="various-description" class="flex-max"></div>' +
		'</div>'
	}
	function isMerchantMode() {
		return merchants.includes(town.windowsOpen.various)
	}
})($, _, TweenMax, Linear, RoughEase, Power0, Power1);