var bar;
(function() {
	bar = {
		defaultImage: [
			'helms1',
			'amulets0',
			'rings0',
			'rings0',
			'shoulders0',
			'cloaks0',
			'chests0',
			'bracers0',
			'gloves0',
			'belts0',
			'legs0',
			'boots0',
			'oneHandBlunts0',
			'shields0',
			'charms0',
		],
		dom: {},
		averagePing: 100,
		initialized: 0,
		windowsOpen: {
			character: false,
			inventory: false,
			options: false,
		},
		init,
		linkdead,
		hideParty,
		updatePlayerBar,
		addPlayer,
		updatePing,
		toggleCharacterStats,
		toggleInventory,
		toggleOptions,
		handleCloseMenu,
		closeAllWindows,
		setDefaultInvWeaponImage,
	};
	var index;
	var player; // temp bar data
	var pingTimer = new delayedCall(0, '')
	var pingColors = [
		'',
		'chat-warning',
		'chat-alert'
	];
	//////////////////////////////////////////////
	function init() {
		if (!bar.initialized) {
			bar.initialized = 1
			var e = getById('bar-wrap')
			// my bar
			var html = getBarHeader()
			// party bars
			html += '<div id="bar-all-player-wrap">'
			/*for (var i=0; i<party.maxPlayers; i++) {
				html += getPlayerBarHtml({}, i, true);
			}*/
			html += '</div>'
			e.innerHTML = html
			e.style.display = 'block'

			bar.dom.lag = getById('bar-lag')
			bar.dom.character = getById('bar-window-character')
			bar.dom.inventory = getById('inventory')
			bar.dom.inventoryWrap = getById('inventory-wrap')
			// draw all bars
			// bar events
			$("#bar-wrap")
				.on('click contextmenu', '.bar-col-icon', handleClickPartyContextMenu)
				.on('click', '#bar-camp', chat.camp)
				.on('click', '#bar-stats', toggleCharacterStats)
				.on('click', '#bar-inventory', toggleInventory)
				.on('click', '#bar-options', toggleOptions)
				.on('click', '#bar-mission-abandon', mission.abandon)
				.on('mouseenter', '.popover-icons', showBarMenuPopover)
				.on('mousemove', '.popover-icons', popover.setPosition)
				.on('mouseleave', '.popover-icons', popover.hide);
		}
	}

	function handleClickPartyContextMenu() {
		var id = $(this).attr('id'),
			arr = id.split("-"),
			slot = _.findIndex(party.presence, { row: arr[3] * 1 });

		context.getPartyMenu(party.presence[slot].name);
		console.info(id, slot, party.presence[slot].name);
	}

	function toggleCharacterStats() {
		bar.windowsOpen.character = !bar.windowsOpen.character;
		setCharacterDOM()
	}

	function setCharacterDOM() {
		if (bar.windowsOpen.character) {
			bar.dom.character.innerHTML = getCharacterStatsHtml()
			bar.dom.character.style.display = 'flex'
		}
		else {
			bar.dom.character.innerHTML = ''
			bar.dom.character.style.display = 'none'
		}
	}

	function getCharacterStatsHtml() {
		var html =
		'<div class="flex" style="'+ css.header +'">' +
			'<div class="flex-column flex-max" style="'+ css.nameWrap +'">' +
				'<div class="stag-blue-top" style="' + css.name + '">' + my.name + '</div>' +
			'</div>' +
			'<i data-id="character-stats" class="close-menu fa fa-times"></i>' +
		'</div>' +
		// race class level guild
		'<div class="text-center" style="font-size: .8rem; line-height: 1.2; color: #ffd700">' +
			'<div>Level '+ my.level +' '+ my.race +' '+ my.jobLong +'</div>' +
			getPlayerGuildDescription() +
		'</div>' +
		'<div id="inv-wrap">'+
			'<div class="inv-column-items flex-column flex-max">';
			for (var i=0; i<=5; i++) {
				html += getItemSlotHtml('eq', i)
			}
			html += '</div>' +
			'<div id="inv-column-avatar" class="bg-dark-' + my.job + '">'+
				'<div id="inv-avatar-wrap" class="bg-' + my.job + '">' +
					'<img id="inv-avatar-img" src="'+ my.getAvatarUrl() +'">' +
					'<div id="inv-resist-wrap" class="text-shadow">'+
						'<div class="inv-resist-icon flex-center" style="background: #500">' + my.resistBlood + '</div>' +
						'<div class="inv-resist-icon flex-center" style="background: #090">' + my.resistPoison + '</div>' +
						'<div class="inv-resist-icon flex-center" style="background: #808">' + my.resistArcane + '</div>' +
						'<div class="inv-resist-icon flex-center" style="background: #aa0">' + my.resistLightning + '</div>' +
						'<div class="inv-resist-icon flex-center" style="background: #840">' + my.resistFire + '</div>' +
						'<div class="inv-resist-icon flex-center" style="background: #28c">' + my.resistIce + '</div>' +
					'</div>' +
				'</div>' +
				'<div class="flex" style="font-size: .8rem">'+
					'<div class="flex-column flex-max" style="'+ css.invStatColumn +'">'+
						'<div class="flex space-between">' +
							'<div style="color: gold">Armor:</div><div>'+ stat.armor() +'</div>' +
						'</div>' +
						'<div class="flex space-between">' +
							'<div style="color: gold">Strength:</div><div>'+ stat.str() +'</div>' +
						'</div>' +
						'<div class="flex space-between">' +
							'<div style="color: gold">Stamina:</div><div>'+ stat.sta() +'</div>' +
						'</div>' +
						'<div class="flex space-between">' +
							'<div style="color: gold">Agility:</div><div>'+ stat.agi() +'</div>' +
						'</div>' +
						'<div class="flex space-between">' +
							'<div style="color: gold">Dexterity:</div><div>'+ stat.dex() +'</div>' +
						'</div>' +
					'</div>' +
					'<div class="flex-column flex-max" style="'+ css.invStatColumn +'">' +
						'<div class="flex space-between">' +
							'<div style="color: gold">Attack:</div><div>'+ stat.attack() +'</div>' +
						'</div>' +
						'<div class="flex space-between">' +
							'<div style="color: gold">Damage:</div><div>'+ stat.damageString(stat.damage()) +'</div>' +
						'</div>' +
						'<div class="flex space-between">' +
							'<div style="color: gold">Wisdom:</div><div>'+ stat.wis() +'</div>' +
						'</div>' +
						'<div class="flex space-between">' +
							'<div style="color: gold">Intelligence:</div><div>'+ stat.intel() +'</div>' +
						'</div>' +
						'<div class="flex space-between">' +
							'<div style="color: gold">Charisma:</div><div>'+ stat.cha() +'</div>' +
						'</div>' +
					'</div>' +
				'</div>' +
			'</div>' +
			'<div class="inv-column-items flex-column flex-max">';
			for (var i=6; i<=11; i++) {
				html += getItemSlotHtml('eq', i)
			}
			html += '</div>' +
		'</div>' +
		'<div class="inv-row-items flex" style="'+ css.statFooter +'">';
		for (var i=12; i<=14; i++) {
			html += getItemSlotHtml('eq', i)
		}
		html += '</div>'
		;return html
	}

	function getPlayerGuildDescription() {
		var html = '<div>&nbsp;</div>'
		if (my.guild.name) {
			html = 'Guild ' + guild.ranks[my.guild.rank] + ' of ' + my.guild.name
		}
		return html
	}

	function setDefaultInvWeaponImage() {
		if (my.jobLong === 'Ranger') {
			bar.defaultImage[12] = 'bows0'
		}
		else if (my.jobLong === 'Warrior' ||
			my.jobLong === 'Paladin' ||
			my.jobLong === 'Shadow Knight') {
			bar.defaultImage[12] = 'oneHandSlashers0'
		}
		else if (my.jobLong === 'Rogue' ||
			my.jobLong === 'Necromancer' ||
			my.jobLong === 'Enchanter' ||
			my.jobLong === 'Magician' ||
			my.jobLong === 'Wizard') {
			bar.defaultImage[12] = 'piercers0'
		}
	}

	function getItemSlotHtml(type, i) {
		return '<div class="item-slot-wrap '+ getInvItemBorderClass(type, i) +'">' +
					'<img data-index="'+ i +'" data-type="'+ type +'" src="images/items/'+ getItemSlotImage(type, i) +'.png" class="item-slot">' +
				'</div>';
	}

	function getItemSlotImage(type, slot) {
		var resp
		if (type === 'eq') {
			resp = bar.defaultImage[slot]
			if (eq[slot].name && eq[slot].itemType) {
				resp = eq[slot].itemType + eq[slot].imgIndex
			}
		}
		else {
			resp = 'item-bg-1'
			if (type === 'inv') {
				console.info(slot, inv[slot].name, inv[slot].itemType)
				if (inv[slot].name && inv[slot].itemType) {
					resp = inv[slot].itemType + inv[slot].imgIndex
				}
			}
			else if (type === 'bank') {

			}
		}
		return resp
	}

	function getInvItemBorderClass(type, slot) {
		var resp = 'item-slot-type-none'
		if (type === 'eq') {
			if (eq[slot].name && eq[slot].rarity) {
				resp = 'item-slot-type-' + eq[slot].rarity
			}
		}
		else if (type === 'inv') {
			if (inv[slot].name && inv[slot].rarity) {
				resp = 'item-slot-type-' + inv[slot].rarity
			}
		}
		else if (type === 'bank') {
			if (bank[slot].name && bank[slot].rarity) {
				resp = 'item-slot-type-' + bank[slot].rarity
			}
		}
		return resp
	}


	function toggleInventory() {
		// open all bags in the bottom-right corner
		bar.windowsOpen.inventory = !bar.windowsOpen.inventory;
		setInventoryDOM();
	}

	function getInventoryHtml() {
		var i = 0
		var html =
		'<div class="flex" style="'+ css.header +'">' +
			'<div class="flex-column flex-max" style="'+ css.nameWrap +'">' +
				'<div class="stag-blue-top" style="' + css.name + '">Inventory</div>' +
			'</div>' +
			'<i data-id="inventory" class="close-menu fa fa-times"></i>' +
		'</div>' +
		'<div id="inventory-slot-wrap">' +
		'<div class="inventory-slot-row">';
		for (; i<=2; i++) {
			html += getItemSlotHtml('inv', i)
		}
		html += '</div><div class="inventory-slot-row">';
		for (i=3; i<=5; i++) {
			html += getItemSlotHtml('inv', i)
		}
		html += '</div><div class="inventory-slot-row">';
		for (i=6; i<=8; i++) {
			html += getItemSlotHtml('inv', i)
		}
		html += '</div><div class="inventory-slot-row">';
		for (i=9; i<=11; i++) {
			html += getItemSlotHtml('inv', i)
		}
		html += '</div>' +
		'</div>';

		return html
	}

	function setInventoryDOM() {
		if (bar.windowsOpen.inventory) {
			bar.dom.inventory.innerHTML = getInventoryHtml()
			bar.dom.inventory.style.display = 'flex'
		}
		else {
			bar.dom.inventory.innerHTML = ''
			bar.dom.inventory.style.display = 'none'
		}
	}

	function toggleOptions() {
		bar.windowsOpen.options = !bar.windowsOpen.options;
		setOptionsDOM();
	}

	function setOptionsDOM() {
		var el = getById('options-wrap')
		if (bar.windowsOpen.options) {
			el.innerHTML = 'OPTIONS'
			el.style.display = 'flex'
		}
		else {
			el.innerHTML = ''
			el.style.display = 'none'
		}
	}

	function handleCloseMenu(event) {
		if (event.currentTarget.dataset.id === 'character-stats') bar.toggleCharacterStats()
		else if (event.currentTarget.dataset.id === 'inventory') bar.toggleInventory()

	}

	function closeAllWindows() {
		_.each(bar.windowsOpen, function(val, key) {
			bar.windowsOpen[key] = false
		})
		setCharacterDOM()
		setInventoryDOM()
		setOptionsDOM()
	}

	function showBarMenuPopover() {
		var id = $(this).attr('id');
		popover.setMainMenuHtml(id);
	}

	function cachePlayerBars(index) {
		bar.dom[index] = {
			playerWrap: getById('bar-player-wrap-' + index),
			name: getById('bar-name-' + index),
			hpFg: getById('bar-hp-fg-' + index),
			// hpBg: getById('bar-hp-bg-' + index),
			mpWrap: getById('bar-mp-wrap-' + index),
			mpFg: getById('bar-mp-fg-' + index),
			isLeader: getById('bar-is-leader-' + index),
		}
	}
	function addPlayer(player, index) {
		if (typeof bar.dom[index] === 'undefined') {
			var el = createElement('div');
			el.id = 'bar-player-wrap-' + index;
			el.className = 'bar-player-wrap';
			el.innerHTML = getPlayerBarHtml(player, index);
			getById('bar-all-player-wrap').appendChild(el);
			cachePlayerBars(index);
		}
	}
	function getBarHeader() {
		var s = '';
		s +=
		'<div id="bar-lag">' +
			'<span class="popover-icons">0ms</span>' +
			'<span class="popover-icons">0ms</span>' +
		'</div>' +
		'<div id="bar-main-menu">' +
			'<i id="bar-camp" class="ra ra-campfire popover-icons bar-icons"></i>' +
			'<i id="bar-stats" class="ra ra-knight-helmet popover-icons bar-icons"></i>' +
			'<i id="bar-inventory" class="ra ra-vest popover-icons bar-icons"></i>' +
			'<i id="bar-options" class="ra ra-gear-hammer popover-icons bar-icons"></i>' +
			'<i id="bar-mission-abandon" class="ra ra-player-shot popover-icons bar-icons"></i>' +
		'</div>';
		return s;
	}
	function getPlayerBarHtml(player, index) {
		player = player || {};
		var s = '';
		// job icon
		console.info('getPlayerBarHtml', player)
		s +=
		// avatar
		'<img id="bar-col-icon-'+ index +'" class="bar-col-icon" src="'+ player.avatar +'">' +
		// bars
		'<div class="'+ (!index ? 'bar-col-data' : 'bar-col-data-sm') +'">' +
			'<i id="bar-is-leader-'+ index +'" class="ra ra-crown bar-is-leader '+ (player.isLeader ? 'block' : 'none') +' no-pointer"></i>' +
			'<div id="bar-name-'+ index +'" class="bar-hp-name ellipsis">'+ (player.name || '') +'</div>' +
			'<div id="bar-hp-wrap-'+ index +'" class="bar-any-wrap">' +
				'<div id="bar-hp-fg-'+ index +'" class="bar-hp-fg"></div>' +
				//'<div id="bar-hp-bg-'+ i +'" class="bar-any-bg"></div>' +
			'</div>' +
			'<div id="bar-mp-wrap-'+ index +'" class="bar-any-wrap">' +
				'<div id="bar-mp-fg-'+ index +'" class="bar-mp-fg"></div>' +
			'</div>' +
		'</div>';
		return s;
	}

	/**
	 * Update every part of one player's bar; only updates if there is a difference in the data
	 * @param data
	 */
	function updatePlayerBar(data) {
		index = _.findIndex(party.presence, { row: data.row });
		if (index === -1) return;
		player = party.presence[index];
		if (data.hp !== player.hp || data.maxHp !== player.maxHp) {
			player.hp = data.hp;
			player.maxHp = data.maxHp;
			setHp(index);
		}
		if (data.mp !== player.mp || data.maxMp !== player.maxMp) {
			player.mp = data.mp;
			player.maxMp = data.maxMp;
			setMp(index);
		}
		if (data.isLeader !== player.isLeader) {
			player.isLeader = data.isLeader;
			// set UI helmet
			if (player.isLeader && party.presence.length >= 2) {
				getById('bar-is-leader-' + data.row).classList.remove('none');
			}
			else {
				getById('bar-is-leader-' + data.row).classList.add('none');
			}
			console.warn('isLeader', data.row, index, player.isLeader);
		}
		if (data.job !== player.job) {
			player.job = data.job;
			// set UI job
		}
		if (data.level !== player.level) {
			player.level = data.level;
			// set UI level
		}
		if (data.row !== player.row) {
			player.row = data.row;
		}
		if (data.name !== player.name) {
			player.name = data.name;

		}
	}
	function updatePing(ping) {
		pingTimer.kill()
		pingTimer = delayedCall(.1, updatePingDone, [ping])
	}
	function updatePingDone(ping) {
		game.pingHistory.push(ping);
		if (game.pingHistory.length > 20) {
			game.pingHistory.shift();
		}
		bar.averagePing = ~~_.meanBy(game.pingHistory, val => val);
		// dom
		bar.dom.lag.innerHTML =
			'<span class="popover-icons" id="bar-last-ping" class="'+ getPingColor(ping) +'">' + (ping) + 'ms</span>' +
			'<span class="popover-icons" id="bar-average-ping" class="'+ getPingColor(bar.averagePing) +'">' + (bar.averagePing) + 'ms</span>';
	}
	function getPingColor(ping) {
		index;
		if (ping < 150) {
			index = 0;
		}
		else if (ping < 350) {
			index = 1;
		}
		else {
			index = 2;
		}
		return pingColors[index];
	}
	function setHp(index, delay) {
		if (typeof party.presence[index] === 'undefined' ||
			!party.presence[index].name) {
			console.warn("NOT DRAWING BAR");
		}
		else {
			var percent = ~~((party.presence[index].hp / party.presence[index].maxHp) * 100) + '%';
			var delay = delay === undefined ? .3 : delay;
			TweenMax.to(bar.dom[index].hpFg, delay, {
				width: percent
			});
			/*TweenMax.to(bar.dom[index].hpBg, .5, {
				width: percent
			});*/

		}
	}
	function setMp(index, delay) {
		if (typeof party.presence[index] === 'undefined' ||
			!party.presence[index].name) {
			console.warn("NOT DRAWING BAR");
		}
		else {
			if (party.presence[index].maxMp) {
				var percent = ~~((party.presence[index].mp / party.presence[index].maxMp) * 100) + '%',
					delay = delay === undefined ? .3 : delay;
				TweenMax.to(bar.dom[index].mpFg, delay, {
					width: percent
				});
			}
			else {
				bar.dom[index].mpWrap.style.display = 'none';
			}
		}
	}
	function hideParty() {
		party.presence.forEach(function(v, i){
			if (i) {
				getById('bar-player-wrap-' + i).style.display = 'none';
			}
		});
	}
	function linkdead(data) {
			chat.log(data.name + ' has gone linkdead.', 'chat-warning');
	}
})();