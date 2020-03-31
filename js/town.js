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
		asideSelected: '',
		asideCloseHtml: '<i class="close-aside fa fa-times"></i>',
		go,
		getHtml,
		update,
		events,
		init,
		preload,
		getAsideMerchantMenu, // add later
		getAsideTrainerMenu, // add later
		getAsideGuildMenu,
		getAsideMissionMenu,
		toggleBank,
		updateBankDOM,
		openVarious,
		closeVarious,
	}
	var i
	var id
	var len
	var html
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

				getById('scene-town').innerHTML = town.getHtml()
				town.events()
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
						TweenMax.delayedCall(.1, repeat);
					}
				})();
			}).fail(function(data){
				ng.disconnect(data.responseText);
			});
		}
	}
	function getHtml() {
		var s =
			'<div id="town-menu" class="text-shadow">'+
				'<div data-id="Academy" id="town-academy" class="ng-btn town-building">Academy</div>' +
				'<div data-id="Apothecary" id="town-apothecary" class="ng-btn town-building">Apothecary</div>' +
				'<div data-id="Blacksmith" id="town-blacksmith" class="ng-btn town-building">Blacksmith</div>' +
				'<div data-id="Guild Hall" id="town-guild" class="ng-btn town-building">Guild Hall</div>' +
				'<div data-id="Merchant" id="town-merchant" class="ng-btn town-building">Merchant</div>' +
				'<div data-id="Tavern" id="town-tavern" class="ng-btn town-building">Tavern</div>' +
				'<div data-id="Bank" id="town-bank" class="ng-btn town-building">Bank</div>' +
			'</div>' +
			'<div id="town-footer" class="text-shadow2">' +
				'<hr id="town-footer-hr1" class="footer-hr">' +
				'<div id="town-footer-flex">' +
					'<span id="town-mission" class="ng-btn town-building center">Mission Counter</span>' +
				'</div>' +
				'<hr id="town-footer-hr2"  class="footer-hr">' +
			'</div>';

		return s;
	}
	function getAsideMerchantHtml() {
		var s =
		'<div class="aside-text">' +
			'<div class="aside-title-wrap stag-blue">' +
				'<div class="aside-title">Merchant</div>' +
				town.asideCloseHtml +
			'</div>' +
		'</div>' +
		'<img class="aside-bg" src="images/town/halas.jpg">' +
		'<img class="aside-npc" src="images/town/rendo-surefoot.png">';
		return s;
	}
	function getAsideTrainerHtml() {
		var s =
		'<div class="aside-text">' +
			'<div class="aside-title-wrap stag-blue">' +
				'<div class="aside-title">Academy</div>' +
				town.asideCloseHtml +
			'</div>' +
		'</div>' +
		'<img class="aside-bg" src="images/town/surefall.jpg">' +
		'<img class="aside-npc" src="images/town/arwen-reinhardt.png">';
		return s;
	}
	function getAsideGuildHtml() {
		var s =
		'<div class="aside-text">' +
			'<div class="aside-title-wrap stag-blue">' +
				'<div class="aside-title">Guild Hall</div>' +
				town.asideCloseHtml +
			'</div>' +
			'<div id="aside-menu">' +
				town.getAsideGuildMenu() +
			'</div>' +
		'</div>' +
		'<img class="aside-bg" src="images/town/poh.jpg">' +
		'<img class="aside-npc" src="images/town/valeska-windcrest.png">';
		return s;
	}
	function getAsideMissionHtml() {
		var s =
		'<div class="aside-text">' +
			'<div class="aside-title-wrap stag-blue">' +
				'<div class="aside-title">Mission Counter</div>' +
				town.asideCloseHtml +
			'</div>' +
			'<div id="aside-menu">' +
				town.getAsideMissionMenu() +
			'</div>' +
		'</div>' +
		'<img class="aside-bg" src="images/town/neriak.jpg">' +
		'<img class="aside-npc" src="images/town/miranda-crossheart.png">';
		return s;
	}
	function getAsideMerchantMenu() {
		var s = '';
		return s;
	}
	function getAsideTrainerMenu() {
		var s = '';
		return s;
	}
	function getAsideGuildMenu() {
		var s = '';
		if (my.guild.name) {
			s +=
				'<div class="aside-frame">' +
					'<div>Guild: '+ my.guild.name +'</div> ' +
					'<div>Title: '+ guild.ranks[my.guild.rank] +'</div> ' +
					'<div>Total Members: <span id="guild-member-count">'+ guild.memberList.length +'</span></div> ' +
				'</div>' +
				'<div id="guild-member-wrap" class="aside-frame">' +
					'<div id="guild-member-flex">'+
						'<div id="guild-member-label">Guild Members:</div>'+
						'<div id="guild-member-refresh-icon"><i class="fas fa-sync-alt refresh"></i></div>'+
					'</div>'+
					'<table id="aside-guild-members"></table>'+
				'</div>';

				s += '</div>';
		}
		else {
			s +=
			'<input id="guild-input" class="text-shadow" type="text" maxlength="30" autocomplete="off" spellcheck="false">' +
			'<div id="guild-create" class="ng-btn">Create Guild</div> ' +
			'<div class="aside-frame">Only letters A through Z and apostrophes are accepted in guild names. Standarized capitalization will be automatically applied. The guild name must be between 4 and 30 characters. All guild names are subject to the royal statutes regarding common decency in Vandamor.</div>';
		}
		return s;
	}
	function getAsideMissionMenu() {
		mission.init();
		var s = mission.asideHtmlHead();
		// subsequent loads
		s +=
		'<div id="mission-counter" class="aside-frame text-shadow">';
			s += mission.asideHtml();
		s += '</div>';
		if (my.quest.level) {
			s += mission.asideFooter();
		}
		return s;
	}
	function asideOpen(id) {
		/*
		if (id === town.asideSelected) return;
		// remove old aside
		var oldAside = $(".town-aside");
		TweenMax.to(oldAside, .2, {
			scale: 0,
			x: town.lastAside.x + '%',
			y: town.lastAside.y + '%',
			onComplete: function() {
				oldAside.remove()
			}
		});
		town.lastAside = town.data[id].aside;
		// animate town BG
		TweenMax.to('#town-bg', 1.25, {
			scale: 1.5,
			x: town.data[id].bg.x,
			y: town.data[id].bg.y
		});
		if (id === 'town-mission') mission.setMissionMenusAllOpen();
		// set aside HTML
		var html;
		if (id === 'town-academy') html = getAsideTrainerHtml(id);
		else if (id === 'town-merchant') html = getAsideMerchantHtml(id);
		else if (id === 'town-guild') html = getAsideGuildHtml(id);
		else if (id === 'town-mission') html = getAsideMissionHtml(id);

		// create aside
		var e = createElement('div');
		e.className = 'town-aside text-shadow';
		e.innerHTML = html;
		getById('scene-town').appendChild(e);

		// animate aside things
		TweenMax.delayedCall(town.asideSelected ? 0 : .5, function() {
			TweenMax.set('.now-loading', {
				alpha: 0
			});
			TweenMax.to(e, .5, {
				startAt: {
					display: 'block',
					alpha: 1,
					scale: 0,
					x: town.data[id].aside.x + '%',
					y: town.data[id].aside.y + '%'
				},
				x: '2%',
				y: '2%',
				scale: 1,
				onComplete: function() {
					TweenMax.to('.now-loading', .3, {
						alpha: 1
					});
				}
			});
			TweenMax.delayedCall(.1, function () {
				TweenMax.to('.aside-bg', 1, {
					startAt: {
						left: '60%'
					},
					left: '50%'
				});
			});
			TweenMax.to('.aside-npc', 1, {
				left: '-5%'
			});
			TweenMax.delayedCall(.1, function() {
				$(".town-aside:last-child").find("input").focus();
				town.data[id].msg();
			})
		});
		// set aside id
		town.asideSelected = id;
		$('.mission-open-menu').trigger('click')
		// AJAX calls if necessary
		if (id === 'town-guild'){
			if (guild.memberList.length) {
				guild.setGuildList(guild);
			}
			else {
				$("#aside-guild-members").html('Loading...');
				guild.getMembers(0);
			}
		}*/
	}
	function update(id) {
		var type = _.camelCase(id);
		var html;
		if (type === 'townTrainer') html = getAsideTrainerMenu();
		else if (type === 'townMerchant') html = getAsideMerchantMenu();
		else if (type === 'townGuild') html = getAsideGuildMenu();
		else if (type === 'townMission') html = getAsideMissionMenu();
		$("#aside-menu").html(html);
	}
	function events() {
		$("#scene-town")
			.on('click', '#guild-create', guild.create)
			.on('click focus', '#guild-input', handleGuildInputFocus)
			.on('blur', '#guild-input', handleGuildInputBlur)
			.on('click', '#guild-member-refresh-icon', refreshGuildMembers)
			.on('click', '.town-building', handleBuildingClick);
	}
	function handleGuildInputBlur() {
		guild.hasFocus = true;
	}
	function handleGuildInputFocus() {
		guild.hasFocus = false;
	}
	function handleBuildingClick(event) {
		openVarious(event);
	}
	function refreshGuildMembers() {
		guild.loadGuildMsg()
		guild.getMembers(guild.throttleTime);
	}
	function merchantMsg() {
		chat.log('Rendo Surefoot says, "Hello, '+ my.name +'. I have got a once-in-a-lifetime smokin\' deal for you, my friend! Today, we just received a limited edition Lanfeld champion sword from our supply chain!"')
	}
	function trainerMsg() {
		chat.log('Arwen Reinhardt says, "Hail to thee, '+ my.name +'. You had better sharpen up your skills, kiddo, or you\'ll be dead meat out there. Take it from me—a battle-hardened warrior that has seen more than his fair share of death and despair."')
	}
	function guildMsg() {
		chat.log('Valeska Windcrest says, "Good day, '+ my.name +'. What would you ask of me?"')
	}
	function missionMsg() {
		chat.log('Miranda Crossheart says, "Hey, sunshine! Are you itching for a bit of action?! There\'s no shortage of miscreants to dispatch around these parts!"')
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
		// open all bags in the bottom-right corner
		town.windowsOpen.bank = !town.windowsOpen.bank
		if (tooltip.bank.isHovering) {
			tooltip.hide()
			tooltip.bank.isHovering = false
		}
		if (!town.isBankInitialized) loadBank()
		updateBankDOM()
	}

	function updateBankDOM() {
		if (town.windowsOpen.bank) {
			// window may be closed by now
			$('#root-bank').html(getBankHtml())
			$('#root-bank').css('display', 'flex')
			ng.split('bank-description', 'Banked items may be shared with all characters on the same account.');
		}
		else {
			querySelector('#root-bank').innerHTML = ''
			querySelector('#root-bank').style.display = 'none'
		}
	}

	function getBankHtml() {
		html = '<div class="flex" style="'+ css.header +'">' +
			'<div class="flex-column flex-max" style="'+ css.nameWrap +'">' +
				'<div class="stag-blue-top" style="' + css.name + '">Bank</div>' +
			'</div>' +
			'<i data-id="bank" class="close-menu fa fa-times"></i>' +
		'</div>' +
		'<div id="bank-slot-wrap">';

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
		'</div>';
		return html
	}

	function openVarious(event) {
		if (event.currentTarget.dataset.id === 'Bank') {
			toggleBank()
		}
		else {
			town.windowsOpen.various = event.currentTarget.dataset.id
			updateVariousDOM()
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
		ng.split('various-description', 'Lorem ipsum or something');
	}
	function getVariousHtml() {
		html = ''
		if (town.windowsOpen.various === 'town-academy') html = academyHtml()
		else if (town.windowsOpen.various === 'town-apothecary') html = apothecaryHtml()
		else if (town.windowsOpen.various === 'town-blacksmith') html = blacksmithHtml()
		else if (town.windowsOpen.various === 'town-guild') html = guildHtml()
		else if (town.windowsOpen.various === 'town-merchant') html = merchantHtml()
		else if (town.windowsOpen.various === 'town-tavern') html = tavernHtml()
		else html = merchantHtml()
		return html
	}
	function academyHtml() {
		html = '<div class="flex" style="'+ css.header +'">' +
			'<div class="flex-column flex-max" style="'+ css.nameWrap +'">' +
				'<div class="stag-blue-top" style="' + css.name + '">'+ _.capitalize(town.windowsOpen.various) +'</div>' +
			'</div>' +
			'<i data-id="various" class="close-menu fa fa-times"></i>' +
		'</div>' +
		'<div id="various-slot-wrap">';
			'<div id="various-footer" class="flex-center flex-max stag-blue-top">' +
				'<div id="various-description"></div>'
			'</div>' +
		'</div>';
		return html
	}
	function apothecaryHtml() {
		html = '<div class="flex" style="'+ css.header +'">' +
			'<div class="flex-column flex-max" style="'+ css.nameWrap +'">' +
				'<div class="stag-blue-top" style="' + css.name + '">'+ _.capitalize(town.windowsOpen.various) +'</div>' +
			'</div>' +
			'<i data-id="various" class="close-menu fa fa-times"></i>' +
		'</div>' +
		'<div id="various-slot-wrap">';
			'<div id="various-footer" class="flex-center flex-max stag-blue-top">' +
				'<div id="various-description"></div>'
			'</div>' +
		'</div>';
		return html
	}
	function blacksmithHtml() {
		html = '<div class="flex" style="'+ css.header +'">' +
			'<div class="flex-column flex-max" style="'+ css.nameWrap +'">' +
				'<div class="stag-blue-top" style="' + css.name + '">'+ _.capitalize(town.windowsOpen.various) +'</div>' +
			'</div>' +
			'<i data-id="various" class="close-menu fa fa-times"></i>' +
		'</div>' +
		'<div id="various-slot-wrap">';
			'<div id="various-footer" class="flex-center flex-max stag-blue-top">' +
				'<div id="various-description"></div>'
			'</div>' +
		'</div>';
		return html
	}
	function guildHtml() {
		html = '<div class="flex" style="'+ css.header +'">' +
			'<div class="flex-column flex-max" style="'+ css.nameWrap +'">' +
				'<div class="stag-blue-top" style="' + css.name + '">'+ _.capitalize(town.windowsOpen.various) +'</div>' +
			'</div>' +
			'<i data-id="various" class="close-menu fa fa-times"></i>' +
		'</div>' +
		'<div id="various-slot-wrap">';
			'<div id="various-footer" class="flex-center flex-max stag-blue-top">' +
				'<div id="various-description"></div>'
			'</div>' +
		'</div>';
		return html
	}
	function merchantHtml() {
		html = '<div class="flex" style="'+ css.header +'">' +
			'<div class="flex-column flex-max" style="'+ css.nameWrap +'">' +
				'<div class="stag-blue-top" style="' + css.name + '">'+ _.capitalize(town.windowsOpen.various) +'</div>' +
			'</div>' +
			'<i data-id="various" class="close-menu fa fa-times"></i>' +
		'</div>' +
		'<div id="various-body" class="flex-max">' +
			'Do not touch my body!' +
		'</div>' +
		'<div id="various-slot-wrap">' +
			'<div id="various-footer" class="flex-center flex-max stag-blue-top">' +
				'<div id="various-description"></div>'
			'</div>' +
		'</div>';
		return html
	}
	function tavernHtml() {
		html = '<div class="flex" style="'+ css.header +'">' +
			'<div class="flex-column flex-max" style="'+ css.nameWrap +'">' +
				'<div class="stag-blue-top" style="' + css.name + '">'+ _.capitalize(town.windowsOpen.various) +'</div>' +
			'</div>' +
			'<i data-id="various" class="close-menu fa fa-times"></i>' +
		'</div>' +
		'<div id="various-slot-wrap">';
			'<div id="various-footer" class="flex-center flex-max stag-blue-top">' +
				'<div id="various-description"></div>'
			'</div>' +
		'</div>';
		return html
	}
})($, _, TweenMax);