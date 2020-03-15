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
		activeTab: 'character',
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
		setCharActiveTab,
		getSkillDescription,
	};
	var index;
	var player; // temp bar data
	var pingTimer = new delayedCall(0, '')
	var pingColors = [
		'',
		'chat-warning',
		'chat-alert'
	];
	var skillDescriptions = {
		offense: 'Offense boosts attack power with all melee weapons. A strong offense helps assure that your weapons strike with precision and power regardless weapon type.',
		defense: 'Defense boosts your natural armor which helps you survive melee attacks. Strong defensive skills can also make your foes completely miss their mark. ',
		oneHandSlash: 'One-hand slash boosts your attack power with one-hand slashing weapons such as swords and axes. A pair of deft hands with a firm grip on powerful blades can create problems for any adversary.',
		oneHandBlunt: 'One-hand blunt boosts your attack power with one-hand blunt weapons such as maces and clubs. Due to their ease of use, blunt weapons may be equipped by any class. Heroes have long favored them due to their utility and power against undead foes.',
		piercing: 'Piercing boosts your attack power with all piercing weapons such as daggers and dirks. A perfectly placed dagger can bring even the most deadly foes to their knees. Rogues are feared and hated for their prowess with piercing weapons.',
		archery: 'Archery boosts your attack power with all bow weapons from simple hunting bows to powerful siege bows. Archery is a powerful, but specialized, skill typically relegated to rangers, though other adventurers have taken a bemusing casual interest in them as well.',
		handToHand: 'Hand-to-hand boosts the attack power of your fists in combat. Who needs fancy weapons when you have honed your very fists into martial weapons of death? Jab, hook, and uppercut your way to victory! Monks are renowned for their mastery of hand-to-hand combat.',
		twoHandSlash: 'Two-hand slash boosts the attack power of all two-hand slash weapons like giant axes and bastard swords. Jump into the fray and cleave a path in front of you! Leave a trail of death in your wake!',
		twoHandBlunt: 'Two-hand blunt boosts the attack power of all two-hand blunt weapons like staves, mauls, and sledgehammers. Whether you are wielding a wizard\'s staff or a warrior\'s mighty mallet, two-hand blunt helps give you the edge on the battlefield. As with all blunt weapons, two-hand blunt weapons are stronger against the undead.',
		alteration: 'Alteration enhances the power of all alteration-based magic. Bend reality to your will by healing allies, summoning magical barriers, or fortifying your defenses.',
		evocation: 'Evocation enhances the power of all evocation-based magic. Summon a fireball, lightning bolts, or even an impressive ice comet to destroy all who dare to oppose you!',
		conjuration: 'Conjuration enhances the power of all conjuration-based magic. Why get your hands dirty when you can summon an ally to do the dirty work for you?! Summon a fire-breathing hydra to melt your enemies! Or summon an army of angry bees to seek and destroy! The only limit is your imagination!',

	}
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
		var id = $(this).attr('id')
		var arr = id.split("-")
		var slot = _.findIndex(party.presence, { row: arr[3] * 1 })

		context.getPartyMenu(party.presence[slot].name)
		console.info(id, slot, party.presence[slot].name)
	}

	function toggleCharacterStats() {
		bar.windowsOpen.character = !bar.windowsOpen.character
		if (bar.windowsOpen.character) bar.activeTab = 'character'
		if (tooltip.isHoveringEq) {
			tooltip.hide()
			tooltip.isHoveringEq = false
		}
		setCharacterDOM()
	}

	function setCharActiveTab(event) {
		var id = event.currentTarget.dataset.id
		if (bar.activeTab !== id) {
			bar.activeTab = id
			setCharacterDOM()
		}
	}

	function setCharacterDOM() {
		if (bar.windowsOpen.character) {
			bar.dom.character.innerHTML = getCharacterStatsHtml()
			bar.dom.character.style.display = 'flex'
			if (bar.activeTab === 'skills') ng.split('inv-skill-description', skillDescriptions['offense']);
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
		'<div class="text-center" style="'+ css.raceJobRow +'">' +
			'<div>Level '+ my.level +' '+ my.race +' '+ my.jobLong +'</div>' +
			getPlayerGuildDescription() +
		'</div>';
		if (bar.activeTab === 'character') html += getCharacterHtml()
		else if (bar.activeTab === 'skills') html += getSkillsHtml()
		html += '<div id="inv-tab-wrap">' +
			'<div data-id="character" class="inv-tabs'+ getActiveTabStatus('character') +'">Character</div>' +
			'<div data-id="skills" class="inv-tabs'+ getActiveTabStatus('skills') +'">Skills</div>' +
		'</div>';
		return html
	}

	function getActiveTabStatus(id) {
		return id === bar.activeTab ? ' active' : ''
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
		return '<div class="item-slot-wrap '+ getInvItemClass(type, i) +'">' +
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
				if (inv[slot].name && inv[slot].itemType) {
					resp = inv[slot].itemType + inv[slot].imgIndex
				}
			}
			else if (type === 'bank') {
				if (bank[slot].name && bank[slot].itemType) {
					resp = bank[slot].itemType + bank[slot].imgIndex
				}
			}
		}
		return resp
	}

	function getInvItemClass(type, slot) {
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
		bar.windowsOpen.inventory = !bar.windowsOpen.inventory
		if (tooltip.isHoveringInv) {
			tooltip.hide()
			tooltip.isHoveringInv = false
		}
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
		for (; i<=3; i++) {
			html += getItemSlotHtml('inv', i)
		}
		html += '</div><div class="inventory-slot-row">';
		for (i=4; i<=7; i++) {
			html += getItemSlotHtml('inv', i)
		}
		html += '</div><div class="inventory-slot-row">';
		for (i=8; i<=11; i++) {
			html += getItemSlotHtml('inv', i)
		}
		html += '</div><div class="inventory-slot-row">';
		for (i=12; i<=15; i++) {
			html += getItemSlotHtml('inv', i)
		}
		html += '</div>' +
		'<div id="inv-footer" class="flex-center flex-max stag-blue-top">' +
			'<div id="inv-footer-gold-wrap">'+
				'<div id="inv-gold" style="margin: 0 .2rem; ">'+ my.gold +'</div>' +
				'<i style="margin: 0 .2rem; color: gold" class="ra ra-gold-bar"></i>' +
			'</div>' +
		'</div>' +
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

	function getSkillDescription(event) {
		var id = event.currentTarget.dataset.id
		ng.split('inv-skill-description', skillDescriptions[id]);
	}

	function getPropSkillHtml(prop) {
		if (!my[prop]) return ''
		var html =
			'<div data-id="'+ prop +'" class="inv-skill-row">' +
				'<div class="inv-skill-bar" style="width: '+ (my[prop] / 5 * 100) +'%"></div>' +
				'<div class="inv-skill-label-wrap">' +
					'<div class="inv-skill-label">'+ (item.specialPropLabels[prop] || _.capitalize(prop)) + '</div>' +
					'<div>'+ my[prop] +'/5</div>' +
				'</div>' +
			'</div>';
		return html
	}

	function getSkillsHtml() {
		var html = '<div id="inv-skills-wrap">';
		item.allProps.forEach(function(prop) {
			html += getPropSkillHtml(prop)
		})
		html += '</div>' +
		'<div id="inv-skill-description-wrap">' +
			'<div id="inv-skill-description-head" style="'+ css.nameWrap +'">' +
				'<div class="stag-blue-top" style="' + css.name + '">Description</div>' +
			'</div>' +
			'<div id="inv-skill-description" class="flex-max stag-blue"></div>' +
		'</div>'
		return html
	}

	function getCharacterHtml() {
		// race class level guild
		var html =
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
						'<div class="inv-resist-icon flex-center" style="background: #500">' + stat.resistBlood() + '</div>' +
						'<div class="inv-resist-icon flex-center" style="background: #090">' + stat.resistPoison() + '</div>' +
						'<div class="inv-resist-icon flex-center" style="background: #808">' + stat.resistArcane() + '</div>' +
						'<div class="inv-resist-icon flex-center" style="background: #aa0">' + stat.resistLightning() + '</div>' +
						'<div class="inv-resist-icon flex-center" style="background: #840">' + stat.resistFire() + '</div>' +
						'<div class="inv-resist-icon flex-center" style="background: #28c">' + stat.resistIce() + '</div>' +
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
		return html
	}
})();