var town;
(function($, _, TweenMax, undefined) {
	town = {
		initialized: 0,
		lastAside: {},
		delegated: 0,
		windowsOpen: {
			various: '',
			bank: false,
		},
		isBankInitialized: false,
		isMerchantInitialized: false,
		isBlacksmithInitialized: false,
		isApothecaryInitialized: false,
		go,
		init,
		preload,
		toggleBank,
		closeBank,
		updateBankDOM,
		openVarious,
		closeVarious,
		handleGuildInputFocus,
		handleGuildInputBlur,
		refreshGuildMembers,
		updateVariousDOM,
	}
	var i, len, html, str, msg, startX, startY, endX, endY, itemIndex, rarity
	const merchantSlots = [
		'amulets',
		'rings',
		'cloaks',
		'charms',
		'bows',
		'oneHandBlunts',
		'twoHandBlunts',
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
		'oneHandSlashers',
		'twoHandSlashers',
	]
	const apothecarySlots = [
		'amulets',
		'rings',
		'charms',
		'piercers',
		'focus',
		'staves',
		'shields',
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

				$('#town-bg').remove()
				var el = createElement('img')
				el.id = 'town-bg'
				el.className = 'img-bg'
				el.src = 'images/bg/mausoleum1.png'
				document.getElementById('body').insertBefore(el, document.getElementById('bar-wrap'));

				getElementById('scene-town').innerHTML = getHtml()
				$("#scene-title").remove()
				town.init()
				bar.init();
				// await socket connect
				(function repeat() {
					if (socket.enabled) {
						// stuff to do after the socket wakes up
						party.listen(party.getUniquePartyChannel());
						chat.sendMsg('/join');
						chat.history = [];
						// town
						TweenMax.set('#scene-town', {
							opacity: 1
						})
						TweenMax.to('#body, #town-bg', .5, {
							delay: .5,
							opacity: 1,
							onComplete: ng.unlock
						});
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
	function getHtml() {
		html = '<div id="town-menu" class="text-shadow">'+
			'<div data-id="Academy" id="town-academy" class="ng-btn town-building">Academy</div>' +
			'<div data-id="Apothecary" id="town-apothecary" class="ng-btn town-building">Apothecary</div>' +
			'<div data-id="Blacksmith" id="town-blacksmith" class="ng-btn town-building">Blacksmith</div>' +
			'<div data-id="Guild Hall" id="town-guild" class="ng-btn town-building">Guild Hall</div>' +
			'<div data-id="Merchant" id="town-merchant" class="ng-btn town-building">Merchant</div>' +
			'<div data-id="Tavern" id="town-tavern" class="ng-btn town-building">Tavern</div>' +
			'<div data-id="Bank" id="town-bank" class="ng-btn town-building">Bank</div>' +
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
		if (!town.initialized) {
			town.initialized = 1;
			town.preload();
		}
	}
	function preload() {
		var p = 'images/town/';
		cache.preloadImages([
			p + 'arwen-reinhardt.png',
			p + 'halas.jpg',
			p + 'miranda-crossheart.png',
			p + 'neriak.jpg',
			p + 'poh.jpg',
			p + 'rendo-surefoot.png',
			p + 'surefall.jpg',
			p + 'valeska-windcrest.png',
			'images/dungeon/braxxen1.jpg',
			'images/skills/' + my.job + '.png'
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
		updateBankDOM()
	}

	function toggleBank() {
		if (ng.view === 'town') {
			// open all bags in the bottom-right corner
			town.windowsOpen.bank = !town.windowsOpen.bank
			if (tooltip.bank.isHovering) {
				tooltip.hide()
				tooltip.bank.isHovering = false
			}
			if (!town.isBankInitialized) loadBank()
			updateBankDOM()
		}
	}
	function closeBank() {
		_.each(town.windowsOpen, (val, key) => {
			town.windowsOpen[key] = false
		})
		town.updateBankDOM()
	}

	function updateBankDOM() {
		if (town.windowsOpen.bank) {
			// window may be closed by now
			$('#root-bank').html(getBankHtml()).css('display', 'flex')
			ng.split('bank-description', 'Banked items may be shared with all characters on the same account.')
		}
		else $('#root-bank').html('').css('display', 'none')
	}

	function getBankHtml() {
		html = '<div class="flex" style="'+ css.header +'">' +
			'<div class="flex-column flex-max" style="'+ css.nameWrap +'">' +
				'<div class="stag-blue-top" style="' + css.name + '">Bank</div>' +
			'</div>' +
			'<i data-id="bank" class="close-menu fa fa-times"></i>' +
		'</div>' +
		'<div id="bank-slot-wrap">'

		'<div class="flex">';
		i=0
		len = ng.bankSlots
		for (; i<len; i++) {
			html += bar.getItemSlotHtml('bank', i)
		}
		html += '</div>' +
			'<div id="inv-skill-description-head" style="'+ css.nameWrapFull +'">' +
				'<div class="stag-blue-top" style="' + css.name + '">Bank Details</div>' +
			'</div>' +
			'<div id="bank-footer" class="flex-center flex-max stag-blue-top">' +
				'<div id="bank-description"></div>'
			'</div>' +
		'</div>'
		return html
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
		if (event.currentTarget.dataset.id === 'Bank') toggleBank()
		else {
			if (town.windowsOpen.various !== event.currentTarget.dataset.id) {
				town.windowsOpen.various = event.currentTarget.dataset.id
				updateVariousDOM()
			}
		}
	}
	function closeVarious() {
		town.windowsOpen.various = ''
		querySelector('#root-various').innerHTML = ''
		querySelector('#root-various').style.display = 'none'
	}
	function updateVariousDOM() {
		querySelector('#root-various').innerHTML = getVariousHtml()
		querySelector('#root-various').style.display = 'flex'
		startX = 0
		startY = 0
		endX = '-40%'
		endY = '-5%'

		msg = ''
		if (town.windowsOpen.various === 'Academy') {
			msg = 'Lorem ipsum or something'
		}
		else if (town.windowsOpen.various === 'Apothecary') {
			msg = 'Lorem ipsum or something'
		}
		else if (town.windowsOpen.various === 'Blacksmith') {
			msg = 'Lorem ipsum or something'
		}
		else if (town.windowsOpen.various === 'Guild Hall') {
			if (guild.memberList.length) {
				guild.setGuildList(guild)
				msg = 'Lorem ipsum or something'
			}
			else {
				$('#guild-input').focus()
				guild.getMembers()
				msg = 'Creating a guild is a great way to keep your friends organized. The hordes of darkness fight in organized armies. It would be wise for you to do likewise.'
			}
			startX = '10%'
			startY = '-45%'
			endX = '-40%'
			endY = '-5%'
		}
		else if (town.windowsOpen.various === 'Merchant') {
			!town.isMerchantInitialized && processMerchant()
			startX = '-75%'
			startY = '-25%'
			endX = '-35%'
			endY = '0%'
			msg = 'Good day, ' + my.name + ', what are you looking for? We carry the finest jewelry in all of Vandamor! Be sure to check out the latest shipment of cloaks that we just received! I have a special price just for you, my friend!'
		}
		else if (town.windowsOpen.various === 'Mission Counter') {
			msg = 'Edenburg needs brave adventurers like you to restore peace to our blessed Kingdom! Some missions are more dangerous than others—choose your mission carefully!'
		}
		else if (town.windowsOpen.various === 'Tavern') {
			msg = 'Lorem ipsum or something'
		}
		else {
			msg = 'Lorem ipsum or something'
		}
		ng.split('various-description', msg)
		TweenMax.to('#town-various-bg', 1, {
			startAt: {
				x: startX,
				y: startY
			},
			x: endX,
			y: endY
		})
	}
	function getVariousHtml() {
		html = ''
		if (town.windowsOpen.various === 'Academy') html = academyHtml()
		else if (town.windowsOpen.various === 'Apothecary') html = apothecaryHtml()
		else if (town.windowsOpen.various === 'Blacksmith') html = blacksmithHtml()
		else if (town.windowsOpen.various === 'Guild Hall') html = guildHtml()
		else if (town.windowsOpen.various === 'Merchant') html = merchantHtml()
		else if (town.windowsOpen.various === 'Mission Counter') html = missionCounterHtml()
		else if (town.windowsOpen.various === 'Tavern') html = tavernHtml()
		else html = merchantHtml()
		return html
	}
	function academyHtml() {
		html = '<div class="flex" style="'+ css.header +'">' +
			'<div class="flex-column flex-max" style="'+ css.nameWrap +'">' +
				'<div class="stag-blue-top" style="' + css.name + '">'+ town.windowsOpen.various +'</div>' +
			'</div>' +
			'<i data-id="various" class="close-menu fa fa-times"></i>' +
		'</div>' +
		'<div id="various-body" class="flex-column flex-max">' +
			'Academy body!' +
		'</div>' +
		'<div id="various-footer" class="flex-center flex-max stag-blue-top">' +
			'<div id="various-description" class="flex-max"></div>' +
		'</div>'
		return html
	}
	function apothecaryHtml() {
		html = '<div class="flex" style="'+ css.header +'">' +
			'<div class="flex-column flex-max" style="'+ css.nameWrap +'">' +
				'<div class="stag-blue-top" style="' + css.name + '">'+ town.windowsOpen.various +'</div>' +
			'</div>' +
			'<i data-id="various" class="close-menu fa fa-times"></i>' +
		'</div>' +
		'<div id="various-body" class="flex-column flex-max">' +
			'Apothecary body!' +
		'</div>' +
		'<div id="various-footer" class="flex-center flex-max stag-blue-top">' +
			'<div id="various-description" class="flex-max"></div>' +
		'</div>'
		return html
	}
	function blacksmithHtml() {
		html = '<div class="flex" style="'+ css.header +'">' +
			'<div class="flex-column flex-max" style="'+ css.nameWrap +'">' +
				'<div class="stag-blue-top" style="' + css.name + '">'+ town.windowsOpen.various +'</div>' +
			'</div>' +
			'<i data-id="various" class="close-menu fa fa-times"></i>' +
		'</div>' +
		'<div id="various-body" class="flex-column flex-max">' +
			'Blacksmith body!' +
		'</div>' +
		'<div id="various-footer" class="flex-center flex-max stag-blue-top">' +
			'<div id="various-description" class="flex-max"></div>' +
		'</div>'
		return html
	}
	function missionCounterHtml() {
		html = '<div class="flex" style="'+ css.header +'">' +
			'<div class="flex-column flex-max" style="'+ css.nameWrap +'">' +
				'<div class="stag-blue-top" style="' + css.name + '">'+ town.windowsOpen.various +'</div>' +
			'</div>' +
			'<i data-id="various" class="close-menu fa fa-times"></i>' +
		'</div>' +
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
		html = '<div class="flex" style="'+ css.header +'">' +
			'<div class="flex-column flex-max" style="'+ css.nameWrap +'">' +
				'<div class="stag-blue-top" style="' + css.name + '">'+ town.windowsOpen.various +'</div>' +
			'</div>' +
			'<i data-id="various" class="close-menu fa fa-times"></i>' +
		'</div>' +
		'<div id="various-body" class="flex-column flex-max" style="display: flex; flex-direction: column;">' +
			// new stuff
			'<img id="town-various-bg" src="images/bg/bastille-2.png">' +
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
	function merchantHtml() {
		html = '<div class="flex" style="'+ css.header +'">' +
			'<div class="flex-column flex-max" style="'+ css.nameWrap +'">' +
				'<div class="stag-blue-top" style="' + css.name + '">'+ town.windowsOpen.various +'</div>' +
			'</div>' +
			'<i data-id="various" class="close-menu fa fa-times"></i>' +
		'</div>' +
		'<div id="various-body" class="flex-column flex-max">' +
		'<img id="town-various-bg" src="images/bg/bastille-1.png">' +
		'<div id="various-item-wrap">'+ getMerchantSlotHtml() +'</div>' +
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
		html = '<div class="flex" style="'+ css.header +'">' +
			'<div class="flex-column flex-max" style="'+ css.nameWrap +'">' +
				'<div class="stag-blue-top" style="' + css.name + '">'+ town.windowsOpen.various +'</div>' +
			'</div>' +
			'<i data-id="various" class="close-menu fa fa-times"></i>' +
		'</div>' +
		'<div id="various-body" class="flex-column flex-max">' +
			'Tavern body!' +
		'</div>' +
		'<div id="various-footer" class="flex-center flex-max stag-blue-top">' +
			'<div id="various-description" class="flex-max"></div>' +
		'</div>'
		return html
	}
	function variousFooterHtml(avatar) {
		return '<div id="various-footer" class="flex-center stag-blue-top">' +
			'<div class="town-avatar-wrap">' +
				'<img class="town-avatars" src="images/avatars/'+ avatar +'.png">' +
			'</div>' +
			'<div id="various-description" class="flex-max"></div>' +
		'</div>'
	}
})($, _, TweenMax);