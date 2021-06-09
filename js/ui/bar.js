var bar;
(function(_, $, Draggable, TweenMax, undefined) {
	bar = {
		updateInventoryGold,
		updateInventoryDOM,
		openInventory,
		closeInventory,
		init,
		updatePlayerBar,
		addPlayer,
		updatePing,
		toggleCharacterStats,
		toggleInventory,
		toggleOptions,
		handleCloseMenu,
		optionsClose,
		closeAllWindows,
		setDefaultInvWeaponImage,
		setCharActiveTab,
		getSkillDescription,
		updateItemSlotDOM,
		updateItemSwapDOM,
		getItemSlotImage,
		getItemIconFileNameByObj,
		getItemSlotHtml,
		selectOptionCategory,
		setWindowSize,
		setDefaultOptions,
		toggleFastDestroy,
		toggleShowNetwork,
		updateDynamicStyles,
		appExit,
		appReset,
		setHotkey,
		listenForHotkey,
		updateBar,
		getRatio,
		getSkillBarHtml,
		updateCharStatPanels,
		charStatColOneHtml,
		charStatColTwoHtml,
		updateAllResistsDOM,
		handlePlayerClick,
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
		hotkeyId: '',
		hotkeyElement: {},
		hotkeyWhitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz`~1234567890!@#$%^&*()-_=+[{]}\\|;:\'",<.>/?InsertDeleteHomeEndPageUpPageDownF1F2F3F4F5F6F7F8F9F10F11F12ArrowUpArrowDownArrowLeftArrowRightTab',
		optionSelected: 'General',
		activeTab: 'character',
	};
	let ratio = 0
	let percent = 0
	var pingColors = [
		'',
		CHAT.WARNING,
		CHAT.ALERT
	];
	var skillDescriptions = {
		offense: 'Offense boosts attack power with all melee weapons. A strong offense helps assure that your weapons strike with precision and power regardless weapon type.',
		defense: 'Defense boosts your natural armor which helps you survive melee attacks. Strong defensive skills can also make your foes completely miss their mark. ',
		oneHandSlash: 'One-hand slash boosts your attack power with one-hand slashing weapons such as swords and axes. A pair of deft hands with a firm grip on powerful blades can create problems for any adversary.',
		oneHandBlunt: 'One-hand blunt boosts your attack power with one-hand blunt weapons such as maces and clubs. Due to their ease of use, blunt weapons may be equipped by any class. Heroes have long favored them due to their utility and power against undead foes.',
		twoHandSlash: 'Two-hand slash boosts the attack power of all two-hand slash weapons like giant axes and bastard swords. Critical hits with two-hand weapons do more damage than one-hand weapons. Jump into the fray and cleave a path in front of you! Leave a trail of death in your wake!',
		twoHandBlunt: 'Two-hand blunt boosts the attack power of all two-hand blunt weapons like staves, mauls, and sledgehammers. Critical hits with two-hand weapons do more damage than one-hand weapons. And as with all blunt weapons, two-hand blunt weapons are stronger against the undead.',
		piercing: 'Piercing boosts your attack power with all piercing weapons such as daggers and dirks. A perfectly placed dagger can bring even the most deadly foes to their knees. Rogues are feared and hated for their prowess with piercing weapons.',
		archery: 'Archery boosts your attack power with all bow weapons from simple hunting bows to powerful siege bows. Archery is a powerful, but specialized, skill typically relegated to rangers, though other adventurers have taken a bemusing casual interest in them as well.',
		handToHand: 'Hand-to-hand boosts the attack power of your fists in combat. Who needs fancy weapons when you have honed your very fists into martial weapons of death? Jab, hook, and uppercut your way to victory! Monks are renowned for their mastery of hand-to-hand combat.',
		dodge: 'Dodge prevents physical and magical attacks from hitting you. When a dodge is successful, you will avoid all damage completely. Skills that pierce cannot be dodged.',
		parry: 'Parry deflects a physical attack which reduces the incoming attack\'s damage to zero. A successful parry also restarts your auto attack swing timer. Skills that pierce cannot be parried.',
		riposte: 'Riposte deflects a physical attack and counters with your own physical attack. Ripostes are considered piercing strikes, which cannot be dodged, parried, or riposted. A riposte also restarts your auto attack swing. Skills that pierce cannot be riposted.',
		dualWield: 'Dual wield boosts your chance to attack with an off-hand weapon. The only thing more deadly than one weapon is two! Mastery of this skill allows you to hold your own against even the most powerful two-hand weapons.',
		doubleAttack: 'Double attack boosts your chance to double attack with your standard attack. Though double attack only applies to your standard attacks, this technique remains a fundamental skill to master for all melee classes.',
		alteration: 'Alteration enhances the power of all alteration-based magic. Bend reality to your will by healing allies, summoning magical barriers, or fortifying your defenses.',
		evocation: 'Evocation enhances the power of all evocation-based magic. Summon a fireball, lightning bolts, or even an impressive ice comet to destroy all who dare to oppose you!',
		conjuration: 'Conjuration enhances the power of all conjuration-based magic. Why get your hands dirty when you can summon an ally to do the dirty work for you?! Summon a fire-breathing hydra to melt your enemies! Or summon an army of angry bees to seek and destroy! The only limit is your imagination!',
	}

	var fileName, index, player, html, str, el, elSfx, elMusic, id, arr, slot, resp, i, val, max

	var pingTimer = new delayedCall(0, '')
	const volumeSettings = []

	for (i=0; i<21; i++) {
		volumeSettings[i] = i*54
	}
	//////////////////////////////////////////////
	function init() {

		if (!bar.initialized) {
			bar.initialized = 1
			el = getElementById('bar-wrap')
			// my bar
			// party bars
			// html = '<div id="bar-all-player-wrap">'
			/*for (var i=0; i<party.maxPlayers; i++) {
				html += getPlayerBarHtml({}, i, true);
			}*/
			// html += '</div>'
			// el.innerHTML = html
			el.style.display = 'block'

			bar.dom.lag = getElementById('bar-lag')
			bar.dom.inventory = getElementById('inventory')
			// draw all bars
			// bar events
			$('body')
				.on('mouseenter', '.popover-icons', showBarMenuPopover)
				.on('mousemove', '.popover-icons', popover.setPosition)
				.on('mouseleave', '.popover-icons', popover.hide)
				.on('click', '#bar-camp', chat.camp)
				.on('click', '#bar-stats', toggleCharacterStats)
				.on('click', '#bar-inventory', toggleInventory)
				.on('click', '#bar-options', toggleOptions)

			$("#bar-wrap")
				.on('click contextmenu', '.bar-avatar', handleClickPartyContextMenu)
		}
	}
	function appExit() {
		ng.lock()
		ng.msg('Saving game data...')
		if (app.isApp) {
			delayedCall(ng.getExitTime(), nw.App.closeAllWindows)
		}
		else appReset()
	}
	function appReset() {
		ng.lock()
		delayedCall(ng.getExitTime(), () => {
			chat.camp({bypass: true})
		})
	}

	function handleClickPartyContextMenu() {
		id = this.id
		arr = id.split("-")
		context.player.row = arr[arr.length - 1] * 1
		slot = party.getIndexByRow(context.player.row)
		context.player.name = party.presence[slot].name
		context.setPartyMenuHtml()
	}

	function toggleCharacterStats() {
		bar.windowsOpen.character = !bar.windowsOpen.character
		if (bar.windowsOpen.character) bar.activeTab = 'character'
		tooltip.conditionalHide()
		if (popover.lastHoverId.startsWith('inv-')) popover.hide()
		updateCharacterDOM()
	}

	function setCharActiveTab(event) {
		id = event.currentTarget.dataset.id
		if (bar.activeTab !== id) {
			bar.activeTab = id
			updateCharacterDOM()
		}
	}
	function hideBarText() {
		/*querySelectorAll('.bar-text').forEach(el => {
			el.style.visibility = 'hidden'
		})*/
	}

	function getCharacterStatsHtml() {
		html =
		'<div class="flex" style="'+ css.header +'">' +
			'<div class="flex-column flex-max" style="'+ css.nameWrap +'">' +
				'<div class="stag-blue-top" style="' + css.name + '">' + my.name + '</div>' +
			'</div>' +
			'<img data-id="character-stats" class="close-menu" src="images/ui/close.png">' +
		'</div>' +
		'<div class="text-center" style="'+ css.raceJobRow +'">' +
			'<div>Level '+ my.level +' '+ my.race +' '+ my.jobLong +'</div>' +
			getPlayerGuildDescription() +
		'</div>';
		if (bar.activeTab === 'character') html += getCharacterHtml()
		else if (bar.activeTab === 'passiveSkills') html += getSkillsHtml()
		html += '<div id="inv-tab-wrap">' +
			'<div data-id="character" class="inv-tabs'+ getActiveTabStatus('character') +'">Character</div>' +
			'<div data-id="passiveSkills" class="inv-tabs'+ getActiveTabStatus('passiveSkills') +'">Passive Skills</div>' +
		'</div>';
		return html
	}

	function getActiveTabStatus(id) {
		return id === bar.activeTab ? ' active' : ''
	}

	function getPlayerGuildDescription() {
		html = '<div>&nbsp;</div>'
		if (my.guild.name) {
			html = '<div class="ellipsis">Guild ' +
				guild.ranks[my.guild.rank] + ' of ' + my.guild.name +
			'</div>'
		}
		return html
	}

	function setDefaultInvWeaponImage() {
		if (my.jobLong === CLASS.WARRIOR ||
			my.jobLong === CLASS.RANGER ||
			my.jobLong === CLASS.CRUSADER ||
			my.jobLong === CLASS.SHADOW_KNIGHT) {
			bar.defaultImage[12] = 'oneHandSlashers0'
		}
		else if (my.jobLong === CLASS.ROGUE ||
			my.jobLong === CLASS.WARLOCK ||
			my.jobLong === CLASS.ENCHANTER ||
			my.jobLong === CLASS.TEMPLAR ||
			my.jobLong === CLASS.WIZARD) {
			bar.defaultImage[12] = 'piercers0'
		}
	}

	function getItemSlotHtml(type, i) {
		return '<div id="' + type + '-slot-'+ i +'" class="'+ getInvItemClass(type, i) +'">' +
			'<img id="' + type + '-slot-img-'+ i +'" data-index="'+ i +
			'" data-type="'+ type +
			'" '+ (type === 'eq' ? ' data-eq-type="' + item.eqSlotKeys[i] +'"' : '') +
			' src="'+ bar.getItemSlotImage(type, i) +'" class="item-slot item-slot-'+ type +'">' +
		'</div>';
	}

	function getItemSlotImage(type, slot, showH2h) {
		if (type === 'eq') {
			resp = bar.defaultImage[slot]
			if (showH2h) {
				if (slot === 12) {
					if (!items.eq[12].name) resp = 'Hand-to-hand'
				}
				else if (slot === 13) {
					if (!items.eq[13].name) resp = 'Hand-to-hand'
				}
			}
		}
		else {
			resp = 'blank-item'
		}
		// if an item exists it always returns that
		if (_.get(items[type][slot], 'name') && _.get(items[type][slot], 'itemType')) {
			resp = getItemIconFileNameByObj(items[type][slot])
		}
		return 'images/items/' + resp + '.png'
	}
	function getItemIconFileNameByObj(data) {
		if (data.use) {
			if (data.itemType === 'potion') {
				// potions
				fileName = data.itemType + '/' + data.itemSubType + data.imgIndex
			}
			else {
				// scrolls
				fileName = data.itemType + '/' + data.imgIndex
			}

		}
		// normal items
		else fileName = data.itemType + data.imgIndex
		return fileName
	}

	function getInvItemClass(type, slot) {
		resp = 'item-slot-wrap item-slot-type-none'
		if (_.get(items[type][slot], 'name')) {
			if (_.get(items[type][slot], 'cost')) {
				resp = 'item-slot-wrap item-slot-type-normal'
			}
			else if (_.get(items[type][slot], 'rarity')) {
				resp = 'item-slot-wrap item-slot-type-' + items[type][slot].rarity
			}
			if (_.get(items[type][slot], 'isTrading')) {
				resp += ' item-trading'
			}
		}
		return resp
	}

	function openInventory() {
		if (!bar.windowsOpen.inventory) bar.toggleInventory()
	}
	function closeInventory() {
		if (bar.windowsOpen.inventory) bar.toggleInventory()
	}

	function toggleInventory() {
		// open all bags in the bottom-right corner
		bar.windowsOpen.inventory = !bar.windowsOpen.inventory
		tooltip.conditionalHide()
		updateInventoryDOM()
	}

	function updateInventoryDOM() {
		if (bar.windowsOpen.inventory) {
			bar.dom.inventory.innerHTML = getInventoryHtml()
			bar.dom.inventory.style.display = 'flex'
		}
		else {
			bar.dom.inventory.innerHTML = ''
			bar.dom.inventory.style.display = 'none'
		}
		audio.playSound('bag-open', '', 1, 250)
	}

	function updateInventoryGold() {
		if (!bar.windowsOpen.inventory) return
		el = querySelector('#inventory-gold')
		el.textContent = my.gold
		TweenMax.to('#inventory-gold-row', 1, {
			startAt: { filter: 'saturate(3) brightness(3)' },
			filter: 'saturate(1) brightness(1)'
		})
	}

	function getInventoryHtml() {
		i = 0
		html =
		'<div class="flex" style="'+ css.header +'">' +
			'<div class="flex-column flex-max" style="'+ css.nameWrap +'">' +
				'<div class="stag-blue-top" style="' + css.name + '">Inventory</div>' +
			'</div>' +
			'<img data-id="inventory" class="close-menu" src="images/ui/close.png">' +
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
		'<div id="inventory-gold-row" class="flex-row flex-max">'+
			'<div id="inventory-gold">'+ my.gold +'</div>' +
			'<img class="gold-img" src="images/ui/gold-bar.png">' +
		'</div>'+
		'<div id="inventory-footer" class="flex-row flex-max">'+
			//'<div id="inventory-identify" class="ng-btn text-shadow inv-btn">Identify</div>' +
			'<div id="inventory-destroy" class="ng-btn text-shadow inv-btn">Destroy</div>' +
		'</div>'
		'</div>'

		return html
	}

	function updateCharacterDOM() {
		if (bar.windowsOpen.character) {
			querySelector('#bar-character-stats').innerHTML = getCharacterStatsHtml()
			querySelector('#bar-character-stats').style.display = 'flex'
			if (bar.activeTab === 'passiveSkills') {
				ng.splitText('inv-skill-description', skillDescriptions[PROP.OFFENSE]);
			}
			updateAllMyBars()
			audio.playSound('click-2', '', 1, 250)
		}
		else {
			querySelector('#bar-character-stats').innerHTML = ''
			querySelector('#bar-character-stats').style.display = 'none'
			hideBarText()
			audio.playSound('click-22', '', 1, 250)
		}
	}

	function updateItemSwapDOM() {
		item.dragType && bar.updateItemSlotDOM(item.dragType, item.dragSlot)
		item.dropType && bar.updateItemSlotDOM(item.dropType, item.dropSlot)
		// console.info('//////////// updateItemSwapDOM', item.dropType, item.dragType)
		if ([item.dropType, item.dragType].includes('eq')) {
			// console.info('update char stats')
			stats.memo = {}
			updateCharStatPanels()
			game.updateParty()
		}
	}

	function updateItemSlotDOM(type, slot) {
		// console.warn('trade updateItemSlotDOM', '#'+ type +'-slot-' + slot, type, slot)
		el = querySelector('#'+ type +'-slot-' + slot)
		if (el !== null) {
			el.className = getInvItemClass(type, slot)
			querySelector('#'+ type +'-slot-img-' + slot).src = bar.getItemSlotImage(type, slot)
		}
	}

	function updateAllResistsDOM() {
		if (bar.windowsOpen.character) {
			ng.html('#inv-resist-blood', stats.resistBlood())
			ng.html('#inv-resist-poison', stats.resistPoison())
			ng.html('#inv-resist-arcane', stats.resistArcane())
			ng.html('#inv-resist-lightning', stats.resistLightning())
			ng.html('#inv-resist-fire', stats.resistFire())
			ng.html('#inv-resist-ice', stats.resistIce())
		}
	}

	function updateCharStatPanels() {
		if (bar.windowsOpen.character) {
			updateAllResistsDOM()
			ng.html('#char-stat-col-1', charStatColOneHtml())
			ng.html('#char-stat-col-2', charStatColTwoHtml())
		}
		stats.setAllResources()

		/*if (ng.view === 'town') {
			// max out health automatically
			my.hp = my.hpMax
			my.mp = my.mpMax
			my.sp = my.spMax
		}*/
		updateAllMyBars()
	}
	function updateAllMyBars() {
		bar.updateBar(PROP.HP, my)
		bar.updateBar(PROP.MP, my)
		bar.updateBar(PROP.SP, my)
	}
	function getRatio(type, data) {
		data = data || my
		ratio = (1 - data[type] / data[type + 'Max'])
		if (ratio > 1) ratio = 1
		return ratio * 100
	}
	function updateBar(type, data) {
		percent = getRatio(type, data)
		if (type === PROP.HP) {
			TweenMax.to(querySelector('#bar-hp-fg-' + data.row), .1, { x: '-' + percent + '%' })
			querySelector('#bar-hp-text-' + data.row).textContent = ~~data.hp + '/' + data.hpMax

			if (type === PROP.HP &&
				typeof data === 'object' &&
				(!my.targetIsMob && my.target === data.row) ||
				(my.targetIsMob && my.target === data.row)
			) {
				mob.drawTargetBar(percent)
			}
		}
		else if (type === PROP.MP) {
			TweenMax.to(querySelector('#bar-mp-fg-' + data.row), .1, { x: '-' + percent + '%' })
			querySelector('#bar-mp-text-' + data.row).textContent = ~~data.mp + '/' + data.mpMax
		}
		else if (type === PROP.SP) {
			TweenMax.to(querySelector('#bar-sp-fg-' + data.row), .1, { x: '-' + percent + '%' })
			querySelector('#bar-sp-text-' + data.row).textContent = ~~data.sp + '/' + data.spMax
		}
	}
	function getMaxType(type, data) {
		return (type === PROP.HP
			? data.hpMax
			: type === PROP.MP
				? data.mpMax
				: data.spMax)
	}

	function toggleOptions() {
		bar.windowsOpen.options = !bar.windowsOpen.options;
		bar.hotkeyId = ''
		bar.hotkeyElement = undefined;
		audio.playSound('click-4')
		updateOptionsDOM();
	}

	function updateOptionsDOM() {
		if (bar.windowsOpen.options) optionsOpen()
		else optionsClose()
	}
	function optionsOpen() {
		querySelector('#root-options').innerHTML = getOptionsHtml()
		querySelector('#root-options').style.display = 'flex'
		initDraggableAudioDials()
	}
	function optionsClose() {
		querySelector('#root-options').innerHTML = ''
		querySelector('#root-options').style.display = 'none'
	}
	function handleDragMusicEnd() {
		query.el('#bgmusic').volume = ng.config.musicVolume / 100
		query.el('#bgamb1').volume = (ng.config.musicVolume / 100) * audio.ambientVolume
		query.el('#bgamb2').volume = (ng.config.musicVolume / 100) * audio.ambientVolume
	}

	function handleDragSfx() {
		val = this.x
		if (val > MaxHeight) val = MaxHeight
		if (val < 0) val = 0
		val = ~~(val / 54 * 5)
		ng.config.soundVolume = val
		audio.save()
		elSfx = querySelector('#options-sfx-value')
		if (elSfx !== null) {
			elSfx.textContent = val
		}
		audio.playSound('beep-5')
	}
	function initDraggableAudioDials() {
		Draggable.create('#options-knob-sfx', {
			type: 'rotation',
			throwProps: true,
			throwResistance: 500,
			overshootTolerance: 0,
			maxDuration: 1,
			snap: volumeSettings,
			onDrag: handleDragSfx,
			onThrowUpdate: handleDragSfx,
			onThrowComplete: handleDragSfx,
			bounds: {
				minRotation: 0,
				maxRotation: MaxHeight
			}
		})
		el = Draggable.get('#options-knob-sfx')
		TweenMax.set('#options-knob-sfx', {
			rotation: (~~(ng.config.soundVolume / 5) * 54)
		})
		el.update()
		Draggable.create('#options-knob-music', {
			type: 'rotation',
			throwProps: true,
			throwResistance: 500,
			overshootTolerance: 0,
			maxDuration: 1,
			snap: volumeSettings,
			onDrag: handleDragMusic,
			onThrowUpdate: handleDragMusic,
			onThrowComplete: handleDragMusic,
			bounds: {
				minRotation: 0,
				maxRotation: MaxHeight
			}
		})
		el = Draggable.get('#options-knob-music')
		TweenMax.set('#options-knob-music', {
			rotation: (~~(ng.config.musicVolume / 5) * 54)
		})
		el.update()
	}

	function handleDragMusic() {
		val = this.x
		if (val > MaxHeight) val = MaxHeight
		if (val < 0) val = 0
		val = ~~(val / 54 * 5)
		ng.config.musicVolume = val
		audio.save()
		elMusic = querySelector('#options-music-value')
		if (elMusic !== null) {
			elMusic.textContent = val
		}
		handleDragMusicEnd()
		audio.playSound('beep-5')
	}

	function selectOptionCategory(event) {
		html = ''
		if (event.currentTarget.id === 'option-general') {
			querySelector('#options-content').innerHTML = getOptionsGeneralHtml()
			initDraggableAudioDials()
		}
		else if (event.currentTarget.id === 'option-ui') {
			querySelector('#options-content').innerHTML = getOptionsUiHtml()
		}
		else if (event.currentTarget.id === 'option-hotkeys') {
			bar.hotkeyId = ''
			querySelector('#options-content').innerHTML = getOptionsHotkeysHtml()
		}
		querySelectorAll('.option-category').forEach(el => {
			el.className = 'option-category'
		})
		this.className = 'option-category active'
		audio.playSound('beep-2')
	}

	function getOptionsHtml() {
		html = '<div class="flex">' +
			'<div class="flex-column flex-max">' +
				'<div style="'+ css.optionsHeader +'">'+
					'<div style="'+ css.optionsSubHead +'">Options</div>' +
				'</div>' +
			'</div>' +
		'</div>' +
		'<div class="flex flex-max" style="'+ css.bodyWrap +'">' +
			'<div id="options-tab-column" class="options-column">'+
				'<div id="option-general" class="option-category active" style="'+ css.optionCategory +'">General</div>' +
				'<div id="option-ui" class="option-category" style="'+ css.optionCategory +'">User Interface</div>' +
				'<div id="option-hotkeys" class="option-category" style="'+ css.optionCategory +'">Hotkeys</div>' +
			'</div>' +
			'<div id="options-content" class="flex-column flex-max options-column">' +
				// TODO: content goes here!!
				getOptionsGeneralHtml() +
			'</div>' +
		'</div>' +
		'<div id="options-footer" class="flex space-between" style="'+ css.optionFooter +'">'+
			'<div id="options-default" class="option-button">'+
				'<div style="'+ css.optionBtnLabel +'">Default Settings</div>'+
			'</div>' +
			'<div class="flex">' +
				'<div id="options-okay" class="option-button">'+
					'<div style="'+ css.optionBtnLabel +'">Okay</div>'+
				'</div>' +
			'</div>' +
		'</div>'
		return html
	}

	function setDefaultOptions() {
		ng.config = ng.getDefaultOptions()
		bar.hotkeyId = ''
		bar.hotkeyElement = undefined
		updateOptionsDOM()
		audio.save()
		query.el('#bgmusic').volume = ng.config.musicVolume / 100
		audio.playSound('chime-3')
		setWindowSize({
			currentTarget: {
				dataset: { id: ng.config.display }
			}
		})
	}

	function setWindowSize(event) {
		id = event.currentTarget.dataset.id
		// console.info('setWindowSize', id)
		if (app.isApp) {
			var gui = require('nw.gui');
			var win = gui.Window.get();
			// ??????? reasons
			setTimeout(() => {
				if (id === 'Full Screen') {
					!win.isFullscreen && win.enterFullscreen();
				}
				else if (id === '1920x1080') {
					win.isFullscreen && win.leaveFullscreen();
					win.resizeTo(MaxWidth, MaxHeight);
					win.maximize();
				}
				else if (id === '1600x900') {
					win.isFullscreen && win.leaveFullscreen();
					win.resizeTo(1600, 900);
				}
				else if (id === '1366x768') {
					win.isFullscreen && win.leaveFullscreen();
					win.resizeTo(1366, 768);
				}
				else if (id === '1440x900') {
					win.isFullscreen && win.leaveFullscreen();
					win.resizeTo(1440, 900);
				}
				else if (id === '1280x720') {
					win.isFullscreen && win.leaveFullscreen();
					win.resizeTo(1280, 720);
				}
				else {
					// just in case do this
					id = 'Full Screen';
					!win.isFullscreen && win.enterFullScreen();
				}
				// always do this
			}, 100);
		}
		$('#window-size-value').text(id);
		ng.config.display = id
		audio.save()
	}

	function getOptionsGeneralHtml() {
		str = '<div class="flex-column flex-max" style="justify-content: space-around;">' +
		'<div class="flex-center">' +
			'<div style="flex-basis: 50%">Window Size</div>' +
			'<div class="flex-max ng-drop-wrap">' +
				'<div id="window-size-btn" class="ng-dropdown-btn flex-center">' +
					'<div id="window-size-value" class="ng-dropdown-value">'+ ng.config.display + '</div>' +
					'<span class="ng-dropdown-caret">▼</span>' +
				'</div>' +
				'<div id="window-size-select" class="ng-dropdown">'+
					'<div data-id="Full Screen" class="ng-dropdown-select window-select">Full Screen</div>' +
					'<div data-id="1920x1080" class="ng-dropdown-select window-select">1920x1080</div>' +
					'<div data-id="1600x900" class="ng-dropdown-select window-select">1600x900</div>' +
					'<div data-id="1440x900" class="ng-dropdown-select window-select">1440x900</div>' +
					'<div data-id="1366x768" class="ng-dropdown-select window-select">1366x768</div>' +
					'<div data-id="1280x720" class="ng-dropdown-select window-select">1280x720</div>' +
				'</div>' +
			'</div>' +
		'</div>' +
		'<div class="flex align-center space-between">' +
			'<div style="flex: 1">Sound Volume:</div>' +
			'<div id="options-knob-sfx">'+
				'<div class="options-volume"></div>' +
			'</div>' +
			'<div id="options-sfx-value" style="'+ css.volumeColumns +'">'+ ng.config.soundVolume +'</div>' +
		'</div>' +
		'<div class="flex align-center space-between">' +
			'<div style="flex: 1">Music Volume:</div>' +
			'<div id="options-knob-music">'+
				'<div class="options-volume"></div>' +
			'</div>' +
			'<div id="options-music-value" style="'+ css.volumeColumns +'">'+ ng.config.musicVolume +'</div>' +
		'</div>' +
		'<div class="flex-center">' +
			'<div id="app-reset">Reset Game</div>' +
		'</div>' +
		'<div class="flex-center">' +
			'<div id="app-exit">Exit Game</div>' +
		'</div>' +
		'</div>'

		return str
	}

	function setHotkey(key) {
		// console.info('setHotkey', e)
		if (_.values(ng.config.hotkey).includes(key)) {
			var camelKey = _.findKey(ng.config.hotkey, hotkey => hotkey === key)
			// console.info('keys: ', bar.hotkeyId, camelKey)
			if (_.camelCase(bar.hotkeyId) === camelKey) stopListeningForHotkey()
			else ng.msg('This key is already assigned: ' + _.startCase(camelKey))
			audio.playSound('beep-3')
		}
		else {
			ng.config.hotkey[_.camelCase(bar.hotkeyId)] = key
			bar.hotkeyElement.textContent = key
			stopListeningForHotkey()
			audio.save()
			audio.playSound('click-4')
		}
	}
	function listenForHotkey() {
		bar.hotkeyId = this.dataset.id
		bar.hotkeyElement = this;
		querySelectorAll('.options-hotkey').forEach(el => {
			el.classList.remove('active')
		})
		this.classList.add('active')
		audio.playSound('click-7')
	}
	function stopListeningForHotkey() {
		bar.hotkeyId = ''
		bar.hotkeyElement.classList.remove('active')
	}

	function getOptionsUiHtml() {
		str = '<div class="flex-column flex-max" style="justify-content: flex-start;">' +
		'<div class="flex align-center">' +
			'<div style="flex-basis: 66%;">Fast Destroy</div>' +
			'<div id="options-fast-destroy" class="ng-boolean">'+ (ng.config.fastDestroy ? 'On' : 'Off') +'</div>' +
		'</div>' +
		'<div class="flex align-center">' +
			'<div style="flex-basis: 66%;">Show Network Speed</div>' +
			'<div id="options-show-network" class="ng-boolean">'+ (ng.config.showNetwork ? 'On' : 'Off') +'</div>' +
		'</div>' +
		'</div>'
		return str
	}

	function getOptionsHotkeysHtml() {
		str = '<div class="flex-column flex-max" style="justify-content: flex-start;">' +
		'<div class="flex align-center">' +
			'<div style="flex-basis: 50%;">Character Stats</div>' +
			'<div data-id="character-stats" class="options-hotkey flex-max">'+ ng.config.hotkey.characterStats +'</div>'+
		'</div>' +
		'<div class="flex align-center">' +
			'<div style="flex-basis: 50%;">Inventory</div>' +
			'<div data-id="inventory" class="options-hotkey flex-max">'+ ng.config.hotkey.inventory +'</div>'+
		'</div>' +
		'<div class="flex align-center">' +
			'<div style="flex-basis: 50%;">Auto Attack</div>' +
			'<div data-id="auto-attack" class="options-hotkey flex-max">'+ ng.config.hotkey.autoAttack +'</div>'+
		'</div>' +
		'<div class="flex align-center">' +
			'<div style="flex-basis: 50%;">Walk Forward</div>' +
			'<div data-id="auto-attack" class="options-hotkey flex-max">'+ ng.config.hotkey.walkForward +'</div>'+
		'</div>' +
		'<div class="flex align-center">' +
			'<div style="flex-basis: 50%;">Walk Backward</div>' +
			'<div data-id="auto-attack" class="options-hotkey flex-max">'+ ng.config.hotkey.walkBackward +'</div>'+
		'</div>' +
		'</div>'

		return str
	}

	function toggleFastDestroy() {
		ng.config.fastDestroy = !ng.config.fastDestroy
		this.textContent = ng.config.fastDestroy ? 'On' : 'Off'
		audio.save()
		audio.playSound('click-7')
	}

	function toggleShowNetwork() {
		// console.warn('toggleShowNetwork')
		ng.config.showNetwork = !ng.config.showNetwork
		this.textContent = ng.config.showNetwork ? 'On' : 'Off'
		updateDynamicStyles()
		audio.save()
		audio.playSound('click-7')
	}

	function updateDynamicStyles() {
		html = '#bar-lag { visibility: '+ (ng.config.showNetwork ? 'visible' : 'hidden') + '; }'
		querySelector('#dynamic-styles').innerHTML = html
	}

	function handleCloseMenu(event) {
		if (event.currentTarget.dataset.id === 'character-stats') bar.toggleCharacterStats()
		else if (event.currentTarget.dataset.id === 'inventory') bar.toggleInventory()
		else if (event.currentTarget.dataset.id === 'various') town.closeVarious()
		audio.playSound('click-7')
	}

	function closeAllWindows() {
		_.each(bar.windowsOpen, (val, key) => {
			bar.windowsOpen[key] = false
		})
		updateCharacterDOM()
		updateInventoryDOM()
		updateOptionsDOM()
		if (town.openVariousWindow !== 'Trade') {
			town.closeVarious()
		}
		toast.hideDestroyToast()
		toast.removeToast()
		item.resetDrop()
		tooltip.hide()
	}

	function showBarMenuPopover() {
		popover.setPopoverHtml(this.id);
	}

	function cachePlayerBars(index) {
		bar.dom[index] = {
			playerWrap: getElementById('bar-player-wrap-' + index),
			name: getElementById('bar-name-' + index),
			hpFg: getElementById('bar-hp-fg-' + index),
			mpWrap: getElementById('bar-mp-wrap-' + index),
			mpFg: getElementById('bar-mp-fg-' + index),
			spWrap: getElementById('bar-sp-wrap-' + index),
			spFg: getElementById('bar-sp-fg-' + index),
			isLeader: getElementById('bar-is-leader-' + index),
		}
	}

	function addPlayer(player, index) {
		if (typeof bar.dom[index] === 'undefined') {
			var el = createElement('div');
			el.id = 'bar-player-wrap-' + index;
			el.className = 'bar-player-wrap';
			el.innerHTML = getPlayerBarHtml(player, index);
			getElementById('bar-wrap').appendChild(el);
			cachePlayerBars(index);
		}
	}
	function getPlayerBarHtml(player, index) {
		player = player || {};
		html = '';
		// job icon
		// console.info('getPlayerBarHtml', player)
		// red background
		if (my.row === index) html += '<div id="bar-card-bg-'+ index +'" class="bar-card-bg"></div>'
		let partyIndex = party.presence.findIndex(p => p.row === player.row)
		html +=
		// party bands
		'<div class="flex-row">' +
			'<div id="bar-is-leader-'+ index +'" class="flex-max party-band bar-is-leader '+ (player.isLeader ? 'block' : 'none') +'"></div>' +
			'<div class="flex-max party-band" style="background: '+ party.color[partyIndex] +'"></div>' +
		'</div>' +
		// avatar
		'<div class="flex-column flex-center">' +
			'<img id="bar-avatar-'+ index +'" class="bar-avatar" src="'+ player.avatar +'">' +
		'</div>' +
		// bars
		'<div id="player-resource-'+ index +'" '+
			'class="flex-column '+ (!index ? 'bar-col-data' : 'bar-col-data-sm') +' player-resource-column">' +
			'<div id="bar-name-'+ index +'" class="bar-hp-name ellipsis text-shadow3 '+ (player.isLeader ? 'chat-gold' : '') +'">'+
				(player.name || '') +
			'</div>' +
			'<div>' +
			'<div id="bar-hp-wrap-'+ index +'" class="bar-any-wrap">' +
				'<div id="bar-hp-fg-'+ index +'" class="bar-hp-fg"></div>' +
				'<div id="bar-hp-text-'+ index +'" class="flex-center bar-text text-shadow3">0/0</div>' +
				//'<div id="bar-hp-bg-'+ i +'" class="bar-any-bg"></div>' +
			'</div>' +
			'<div id="bar-mp-wrap-'+ index +'" class="bar-any-wrap">' +
				'<div id="bar-mp-fg-'+ index +'" class="bar-mp-fg"></div>' +
				'<div id="bar-mp-text-'+ index +'" class="flex-center bar-text text-shadow3">0/0</div>' +
			'</div>' +
			'<div id="bar-sp-wrap-'+ index +'" class="bar-any-wrap">' +
				'<div id="bar-sp-fg-'+ index +'" class="bar-sp-fg"></div>' +
				'<div id="bar-sp-text-'+ index +'" class="flex-center bar-text text-shadow3">0/0</div>' +
			'</div>' +
			'</div>' +
		'</div>';
		return html;
	}

	/**
	 * Update every part of one player's bar; only updates if there is a difference in the data
	 * @param data
	 */
	function updatePlayerBar(data) {
		index = party.getIndexByRow(data.row)
		if (index === -1) return
		player = party.presence[index];

		player.hp = data.hp;
		player.hpMax = data.hpMax;
		bar.updateBar(PROP.HP, data)

		player.mp = data.mp;
		player.mpMax = data.mpMax;
		bar.updateBar(PROP.MP, data)

		player.sp = data.sp;
		player.spMax = data.spMax;
		bar.updateBar(PROP.SP, data)

		if (data.isLeader !== player.isLeader) {
			player.isLeader = data.isLeader;
			// set UI helmet
			if (player.isLeader && party.hasMoreThanOnePlayer()) {
				getElementById('bar-name-' + data.row).classList.add('chat-gold')
			}
			else {
				getElementById('bar-name-' + data.row).classList.remove('chat-gold')
			}
			// console.warn('isLeader', data.row, index, player.isLeader);
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
			'<span class="popover-icons" id="bar-msg-sec" class="'+ getPingColor(ping) +'">' + (socket.msgPerSec) + ' pkt/sec</span>' +
			'<span class="popover-icons" id="bar-average-ping" class="'+ getPingColor(ping) +')">Ping: ' + ping +
				' Avg: '+ bar.averagePing + '</span>'
		/*
		game.pingHistory.push(ping);
		if (game.pingHistory.length > 20) {
			game.pingHistory.shift();
		}
		bar.averagePing = ~~_.meanBy(game.pingHistory, val => val);
		 */
	}
	function getPingColor(ping) {
		if (ping < 150) index = 0;
		else if (ping < 350) index = 1;
		else index = 2;
		return pingColors[index];
	}

	function hideParty() {
		party.presence.forEach((v, i) => {
			if (i) getElementById('bar-player-wrap-' + i).style.display = 'none'
		})
	}
	function linkdead(data) {
		chat.log(data.name + ' has gone linkdead.', CHAT.WARNING);
	}

	function getSkillDescription(event) {
		id = event.currentTarget.dataset.id
		ng.splitText('inv-skill-description', skillDescriptions[id]);
	}

	function getPropSkillHtml(prop) {
		// console.info('prop', prop, my[prop])
		if (!skills[prop][my.job].level) return ''
		// dynamic cap for current race/job/level
		max = stats.getPropMax(prop)
		let width = my.level < skills[prop][my.job].level ? 0 : my[prop] / max * 100
		if (width > 100) width = 100
		html = '<div data-id="'+ prop +'" class="inv-skill-row">' +
			'<div class="inv-skill-bar" style="width: '+ width +'%"></div>' +
			'<div class="inv-skill-label-wrap">' +
				'<div class="inv-skill-label">'+ skills.getName(prop) + '</div>' +
				'<div class="flex-center">'
				if (my.level < skills[prop][my.job].level) {
					html += '<img class="skill-lock" src="images/ui/academy-lock.png">Level '+ skills[prop][my.job].level
				}
				else html += my[prop] +'/' + max
				html += '</div>' +
			'</div>' +
		'</div>'
		return html
	}

	function getSkillBarHtml() {
		let html = ''
		item.allProps.forEach(prop => {
			html += getPropSkillHtml(prop)
		})
		return html
	}

	function getSkillsHtml() {
		html = '<div id="inv-skills-wrap">' +
			getSkillBarHtml() +
		'</div>' +
		'<div id="inv-skill-description-wrap">' +
			'<div id="inv-skill-description-head" style="'+ css.nameWrapFull +'">' +
				'<div class="stag-blue-top" style="' + css.name + '">Description</div>' +
			'</div>' +
			'<div id="inv-skill-description" class="flex-max stag-blue"></div>' +
		'</div>'
		return html
	}
	function getCharacterHtml() {
		// race class level guild
		html =
		'<div id="inv-wrap">'+
			'<div class="inv-column-items flex-column flex-max">';
			for (var i=0; i<=5; i++) {
				html += getItemSlotHtml('eq', i)
			}
			html += '</div>' +
			'<div id="inv-column-avatar" class="bg-dark-' + my.job + '">'+
				'<div id="inv-avatar-wrap" class="bg-' + my.job + '">' +
					'<img class="inv-avatar-bg" src="images/avatar-bg/'+ my.job +'.png">' +
					// '<img id="inv-avatar-bg2" class="inv-avatar-bg" src="images/avatar-bg/'+ my.job +'.png">' +
					'<img id="inv-avatar-img" src="'+ my.getAvatarUrl() +'">' +
					'<div id="inv-resist-wrap" class="text-shadow3">'+
						'<div id="inv-resist-blood" class="inv-resist-icon popover-icons">' + + stats.resistBlood() + '</div>' +
						'<div id="inv-resist-poison" class="inv-resist-icon popover-icons">' + stats.resistPoison() + '</div>' +
						'<div id="inv-resist-arcane" class="inv-resist-icon popover-icons">' + stats.resistArcane() + '</div>' +
						'<div id="inv-resist-lightning" class="inv-resist-icon popover-icons">' + stats.resistLightning() + '</div>' +
						'<div id="inv-resist-fire" class="inv-resist-icon popover-icons">' + stats.resistFire() + '</div>' +
						'<div id="inv-resist-ice" class="inv-resist-icon popover-icons">' + stats.resistIce() + '</div>' +
					'</div>' +
				'</div>' +
				'<div class="flex" style="font-size: .8rem">'+
					'<div id="char-stat-col-1" class="flex-column flex-max" style="'+ css.invStatColumn +'">'+
						charStatColOneHtml() +
					'</div>' +
					'<div id="char-stat-col-2" class="flex-column flex-max" style="'+ css.invStatColumn +'">' +
						charStatColTwoHtml() +
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
	function charStatColOneHtml() {
		return '<div class="flex space-between">' +
			'<div style="color: gold">Armor:</div>'+
			'<div style="'+ stats.armor().color +'">'+ stats.armor().value +'</div>' +
		'</div>' +
		'<div class="flex space-between">' +
			'<div style="color: gold">Strength:</div>'+
			'<div style="'+ stats.str().color +'">'+ stats.str().value +'</div>' +
		'</div>' +
		'<div class="flex space-between">' +
			'<div style="color: gold">Stamina:</div>'+
			'<div style="'+ stats.sta().color +'">'+ stats.sta().value +'</div>' +
		'</div>' +
		'<div class="flex space-between">' +
			'<div style="color: gold">Agility:</div>'+
			'<div style="'+ stats.agi().color +'">'+ stats.agi().value +'</div>' +
		'</div>' +
		'<div class="flex space-between">' +
			'<div style="color: gold">Dexterity:</div>'+
			'<div style="'+ stats.dex().color +'">'+ stats.dex().value +'</div>' +
		'</div>'
	}
	function charStatColTwoHtml() {
		let hit = stats.primaryAutoAttackDamage(0, true)
		return '<div class="flex space-between">' +
			'<div style="color: gold">Attack:</div>'+
			'<div style="'+ stats.attack().color +'">'+ stats.attack().value +'</div>' +
		'</div>' +
		'<div class="flex space-between">' +
			'<div style="color: gold">Damage:</div>'+
			'<div>'+ round(hit.min) + '–' + round(hit.max) +'</div>' +
		'</div>' +
		'<div class="flex space-between">' +
			'<div style="color: gold">Wisdom:</div>'+
			'<div style="'+ stats.wis().color +'">'+ stats.wis().value +'</div>' +
		'</div>' +
		'<div class="flex space-between">' +
			'<div style="color: gold">Intelligence:</div>'+
			'<div style="'+ stats.intel().color +'">'+ stats.intel().value +'</div>' +
		'</div>' +
		'<div class="flex space-between">' +
			'<div style="color: gold">Charisma:</div>'+
			'<div style="'+ stats.cha().color +'">'+ stats.cha().value +'</div>' +
		'</div>'
	}

	/**
	 * player clicked
	 */
	function handlePlayerClick() {
		if (ng.view === 'dungeon' ||
			ng.view === 'battle') {
			const id = +this.id.split('-')[2]
			const index = party.getIndexByRow(id)
			my.partyTarget(index, false)
		}

	}
})(_, $, Draggable, TweenMax);