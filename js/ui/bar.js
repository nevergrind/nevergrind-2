var bar;
(function(_, $, Draggable, TweenMax, undefined) {
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
		hotkeyId: '',
		hotkeyElement: {},
		hotkeyWhitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz`~1234567890!@#$%^&*()-_=+[{]}\\|;:\'",<.>/?InsertDeleteHomeEndPageUpPageDownF1F2F3F4F5F6F7F8F9F10F11F12ArrowUpArrowDownArrowLeftArrowRightTab',
		optionSelected: 'General',
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
		updateInventorySlotDOM,
		updateDOM,
		getItemSlotImage,
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
		stopListeningForHotkey,
	};
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
		twoHandSlash: 'Two-hand slash boosts the attack power of all two-hand slash weapons like giant axes and bastard swords. Critical hits with two-hand weapons do more damage than one-hand weapons. Jump into the fray and cleave a path in front of you! Leave a trail of death in your wake!',
		twoHandBlunt: 'Two-hand blunt boosts the attack power of all two-hand blunt weapons like staves, mauls, and sledgehammers. Critical hits with two-hand weapons do more damage than one-hand weapons. And as with all blunt weapons, two-hand blunt weapons are stronger against the undead.',
		dualWield: 'Dual wield boosts your chance to attack with an off-hand weapon. The only thing more deadly than one weapon is two! Mastery of this skill allows you to hold your own against even the most powerful two-hand weapons.',
		doubleAttack: 'Double attack boosts your chance to double attack with your standard attack. Though double attack only applies to your standard attacks, this technique remains a fundamental skill to master for all melee classes.',
		alteration: 'Alteration enhances the power of all alteration-based magic. Bend reality to your will by healing allies, summoning magical barriers, or fortifying your defenses.',
		evocation: 'Evocation enhances the power of all evocation-based magic. Summon a fireball, lightning bolts, or even an impressive ice comet to destroy all who dare to oppose you!',
		conjuration: 'Conjuration enhances the power of all conjuration-based magic. Why get your hands dirty when you can summon an ally to do the dirty work for you?! Summon a fire-breathing hydra to melt your enemies! Or summon an army of angry bees to seek and destroy! The only limit is your imagination!',
	}
	var index;
	var player; // temp bar data
	var pingTimer = new delayedCall(0, '')
	var barRatio
	var html
	var str
	var el
	var elSfx
	var elMusic
	var id
	var arr
	var slot
	var resp
	var i
	var val
	var percent
	var delay
	var max
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
			html = getBarHeader()
			// party bars
			html += '<div id="bar-all-player-wrap">'
			/*for (var i=0; i<party.maxPlayers; i++) {
				html += getPlayerBarHtml({}, i, true);
			}*/
			html += '</div>'
			el.innerHTML = html
			el.style.display = 'block'

			bar.dom.lag = getElementById('bar-lag')
			bar.dom.inventory = getElementById('inventory')
			bar.dom.inventoryWrap = getElementById('inventory-wrap')
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
				.on('mouseleave', '.popover-icons', popover.hide)
		}
	}
	function appExit() {
		ng.lock()
		ng.msg('Saving game data...')
		if (app.isApp) {
			delayedCall(ng.getExitTime(), () => {
				nw.App.closeAllWindows();
			})
		}
		else appReset()
	}
	function appReset() {
		ng.lock()
		ng.msg('Saving game data...')
		delayedCall(ng.getExitTime(), ng.reloadGame)
	}

	function handleClickPartyContextMenu() {
		id = $(this).attr('id')
		arr = id.split("-")
		slot = _.findIndex(party.presence, { row: arr[3] * 1 })

		context.getPartyMenu(party.presence[slot].name)
		console.info(id, slot, party.presence[slot].name)
	}

	function toggleCharacterStats() {
		bar.windowsOpen.character = !bar.windowsOpen.character
		if (bar.windowsOpen.character) bar.activeTab = 'character'
		if (tooltip.eq.isHovering) {
			tooltip.hide()
			tooltip.eq.isHovering = false
		}
		updateCharacterDOM()
	}

	function setCharActiveTab(event) {
		id = event.currentTarget.dataset.id
		if (bar.activeTab !== id) {
			bar.activeTab = id
			updateCharacterDOM()
		}
	}
	function showBarText() {
		updateAllBars()
		querySelectorAll('.bar-text').forEach(el => {
			el.style.visibility = 'visible'
		})
	}
	function hideBarText() {
		querySelectorAll('.bar-text').forEach(el => {
			el.style.visibility = 'hidden'
		})
	}

	function getCharacterStatsHtml() {
		html =
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
		html = '<div>&nbsp;</div>'
		if (my.guild.name) html = 'Guild ' + guild.ranks[my.guild.rank] + ' of ' + my.guild.name
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
			my.jobLong === 'Summoner' ||
			my.jobLong === 'Wizard') {
			bar.defaultImage[12] = 'piercers0'
		}
	}

	function getItemSlotHtml(type, i) {
		return '<div id="' + type + '-slot-'+ i +'" class="'+ getInvItemClass(type, i) +'">' +
			'<img id="' + type + '-slot-img-'+ i +'" data-index="'+ i +
			'" data-type="'+ type +
			'" '+ (type === 'eq' ? ' data-eq-type="' + item.eqSlotKeys[i] +'"' : '') +
			' src="'+ getItemSlotImage(type, i) +'" class="item-slot item-slot-'+ type +'">' +
		'</div>';
	}

	function getItemSlotImage(type, slot) {
		resp = type === 'eq' ? bar.defaultImage[slot] : 'item-bg-1'
		if (_.get(items[type][slot], 'name') && _.get(items[type][slot], 'itemType')) {
			resp = items[type][slot].itemType + items[type][slot].imgIndex
		}
		return 'images/items/' + resp + '.png'
	}

	function getInvItemClass(type, slot) {
		resp = 'item-slot-wrap item-slot-type-none'
		if (_.get(items[type][slot], 'name') && _.get(items[type][slot], 'rarity')) {
			resp = 'item-slot-wrap item-slot-type-' + items[type][slot].rarity
		}
		return resp
	}

	function toggleInventory() {
		// open all bags in the bottom-right corner
		bar.windowsOpen.inventory = !bar.windowsOpen.inventory
		if (tooltip.inv.isHovering) {
			tooltip.hide()
			tooltip.inv.isHovering = false
		}
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
	}

	function getInventoryHtml() {
		i = 0
		html =
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
		/*'<div id="inv-footer" class="flex-center flex-max stag-blue-top">' +
		'</div>' +*/
		'</div>';

		return html
	}

	function updateInventorySlotDOM(type, slot) {
		console.warn('updateInventorySlotDOM', type, slot)
		querySelector('#'+ type +'-slot-' + slot).className = getInvItemClass(type, slot)
		querySelector('#'+ type +'-slot-img-' + slot).src = getItemSlotImage(type, slot)
	}

	function updateCharacterDOM() {
		if (bar.windowsOpen.character) {
			querySelector('#bar-character-stats').innerHTML = getCharacterStatsHtml()
			querySelector('#bar-character-stats').style.display = 'flex'
			if (bar.activeTab === 'skills') {
				ng.split('inv-skill-description', skillDescriptions['offense']);
			}
			showBarText()
		}
		else {
			querySelector('#bar-character-stats').innerHTML = ''
			querySelector('#bar-character-stats').style.display = 'none'
			hideBarText()
		}
	}

	function updateDOM() {
		item.dragType && bar.updateInventorySlotDOM(item.dragType, item.dragSlot)
		item.dropType && bar.updateInventorySlotDOM(item.dropType, item.dropSlot)
		console.info('//////////// updateDOM', item.dropType, item.dragType)
		if ([item.dropType, item.dragType].includes('eq')) {
			console.info('update char stats')
			updateCharStatPanels()
		}
	}

	function updateCharStatPanels() {
		querySelector('#inv-resist-blood').innerHTML = stat.resistBlood()
		querySelector('#inv-resist-poison').innerHTML = stat.resistPoison()
		querySelector('#inv-resist-arcane').innerHTML = stat.resistArcane()
		querySelector('#inv-resist-lightning').innerHTML = stat.resistLightning()
		querySelector('#inv-resist-fire').innerHTML = stat.resistFire()
		querySelector('#inv-resist-ice').innerHTML = stat.resistIce()
		querySelector('#char-stat-col-1').innerHTML = charStatColOneHtml()
		querySelector('#char-stat-col-2').innerHTML = charStatColTwoHtml()
		stat.setResources()
		if (ng.view === 'town') {
			my.hp = my.maxHp
			my.mp = my.maxMp
			my.sp = my.maxSp
		}
		updateAllBars()
	}
	function updateAllBars() {
		updateBar('hp', my.row)
		updateBar('mp', my.row)
		updateBar('sp', my.row)
	}
	function updateBar(type, slot) {
		barRatio = ((1 - my.hp / my.maxHp) * 100)
		querySelector('#bar-' + type + '-fg-' + slot).style.transform = 'translateX(-' + barRatio + '%)'
		querySelector('#bar-' + type + '-text-' + slot).textContent = my[type] + '/' + getMaxType(type)
	}
	function getMaxType(type) {
		return (type === 'hp' ? my.maxHp : type === 'mp' ? my.maxMp : my.maxSp)
	}

	function toggleOptions() {
		bar.windowsOpen.options = !bar.windowsOpen.options;
		updateOptionsDOM();
	}

	function updateOptionsDOM() {
		el = getElementById('root-options')
		if (bar.windowsOpen.options) {
			el.innerHTML = getOptionsHtml()
			el.style.display = 'flex'
			initDraggableAudioDials()
		}
		else {
			el.innerHTML = ''
			el.style.display = 'none'
		}
	}
	function handleDragSfxEnd() {
		audio.playSound('frog_att')
		//audio.playSound('flshhit2')
	}
	function handleDragMusicEnd() {
		dom.bgmusic.volume = ng.config.musicVolume / 100;
	}

	function handleDragSfx() {
		val = this.x
		if (val > 1080) val = 1080
		if (val < 0) val = 0
		val = ~~(val / 54 * 5)
		ng.config.soundVolume = val
		audio.save()
		elSfx = querySelector('#options-sfx-value')
		if (elSfx !== null) {
			elSfx.textContent = val
		}
		_.debounce(handleDragSfxEnd, 1000)
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
			onDragEnd: handleDragSfxEnd,
			onThrowUpdate: handleDragSfx,
			onThrowComplete: handleDragSfx,
			bounds: {
				minRotation: 0,
				maxRotation: 1080
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
				maxRotation: 1080
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
		if (val > 1080) val = 1080
		if (val < 0) val = 0
		val = ~~(val / 54 * 5)
		ng.config.musicVolume = val
		audio.save()
		elMusic = querySelector('#options-music-value')
		if (elMusic !== null) {
			elMusic.textContent = val
		}
		handleDragMusicEnd()
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
			'<div style="font-size: .9rem; line-height: 1.5; flex-basis: 30%; '+ css.optionColumns +'">'+
				'<div id="option-general" class="option-category active" style="'+ css.optionCategory +'">General</div>' +
				'<div id="option-ui" class="option-category" style="'+ css.optionCategory +'">User Interface</div>' +
				'<div id="option-hotkeys" class="option-category" style="'+ css.optionCategory +'">Hotkeys</div>' +
			'</div>' +
			'<div id="options-content" class="flex-column flex-max" style="'+ css.optionColumns +'">' +
				// TODO: content goes here!!
				getOptionsGeneralHtml() +
			'</div>' +
		'</div>' +
		'<div class="flex space-between" style="'+ css.optionFooter +'">'+
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
		updateOptionsDOM()
		audio.save()
		dom.bgmusic.volume = ng.config.musicVolume / 100
		setWindowSize({
			currentTarget: {
				dataset: { id: ng.config.display }
			}
		})
	}

	function setWindowSize(event) {
		id = event.currentTarget.dataset.id
		console.info('setWindowSize', id)
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
					win.resizeTo(1920, 1080);
					win.maximize();
				}
				else if (id === '1600x900') {
					win.isFullscreen && win.leaveFullscreen();
					win.resizeTo(1600, 900);
				}
				else if (id === '1360x768') {
					win.isFullscreen && win.leaveFullscreen();
					win.resizeTo(1360, 768);
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
					'<i class="far fa-caret-square-down ng-dropdown-caret"></i>' +
				'</div>' +
				'<div id="window-size-select" class="ng-dropdown">'+
					'<div data-id="Full Screen" class="ng-dropdown-select window-select">Full Screen</div>' +
					'<div data-id="1920x1080" class="ng-dropdown-select window-select">1920x1080</div>' +
					'<div data-id="1600x900" class="ng-dropdown-select window-select">1600x900</div>' +
					'<div data-id="1360x768" class="ng-dropdown-select window-select">1360x768</div>' +
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

	function setHotkey(key, e) {
		console.info('setHotkey', e)
		if (_.values(ng.config.hotkey).includes(key)) {
			var camelKey = _.findKey(ng.config.hotkey, hotkey => hotkey === key)
			console.info('keys: ', bar.hotkeyId, camelKey)
			if (_.camelCase(bar.hotkeyId) === camelKey) stopListeningForHotkey()
			else ng.msg('This key is already assigned: ' + _.startCase(camelKey))
		}
		else {
			ng.config.hotkey[_.camelCase(bar.hotkeyId)] = key
			bar.hotkeyElement.textContent = key
			stopListeningForHotkey()
			audio.save()
		}
	}
	function listenForHotkey() {
		bar.hotkeyId = this.dataset.id
		bar.hotkeyElement = this;
		querySelectorAll('.options-hotkey').forEach(el => {
			el.classList.remove('active')
		})
		this.classList.add('active')
	}
	function stopListeningForHotkey() {
		bar.hotkeyId = ''
		bar.hotkeyElement.classList.remove('active')
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
			'<div style="flex-basis: 50%">Bank</div>' +
			'<div data-id="bank" class="options-hotkey flex-max">'+ ng.config.hotkey.bank +'</div>'+
		'</div>' +
		'</div>'

		return str
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

	function toggleFastDestroy() {
		ng.config.fastDestroy = !ng.config.fastDestroy
		this.textContent = ng.config.fastDestroy ? 'On' : 'Off'
		audio.save()
	}

	function toggleShowNetwork() {
		console.warn('toggleShowNetwork')
		ng.config.showNetwork = !ng.config.showNetwork
		this.textContent = ng.config.showNetwork ? 'On' : 'Off'
		updateDynamicStyles()
		audio.save()
	}

	function updateDynamicStyles() {
		html = '#bar-lag { visibility: '+ (ng.config.showNetwork ? 'visible' : 'hidden') + '; }'
		querySelector('#dynamic-styles').innerHTML = html
	}

	function handleCloseMenu(event) {
		if (event.currentTarget.dataset.id === 'character-stats') bar.toggleCharacterStats()
		else if (event.currentTarget.dataset.id === 'inventory') bar.toggleInventory()
		else if (event.currentTarget.dataset.id === 'bank') town.toggleBank()
		else if (event.currentTarget.dataset.id === 'various') town.closeVarious()
	}

	function closeAllWindows() {
		_.each(bar.windowsOpen, (val, key) => {
			bar.windowsOpen[key] = false
		})
		updateCharacterDOM()
		updateInventoryDOM()
		updateOptionsDOM()
		town.closeVarious()
		town.closeBank()

		item.dropReset()
	}

	function showBarMenuPopover() {
		id = $(this).attr('id');
		popover.setMainMenuHtml(id);
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
			getElementById('bar-all-player-wrap').appendChild(el);
			cachePlayerBars(index);
		}
	}
	function getBarHeader() {
		html = '';
		html +=
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
		return html;
	}
	function getPlayerBarHtml(player, index) {
		player = player || {};
		html = '';
		// job icon
		console.info('getPlayerBarHtml', player)
		html +=
		// avatar
		'<img id="bar-col-icon-'+ index +'" class="bar-col-icon" src="'+ player.avatar +'">' +
		// bars
		'<div class="flex-column '+ (!index ? 'bar-col-data' : 'bar-col-data-sm') +'" style="justify-content: space-around">' +
			'<i id="bar-is-leader-'+ index +'" class="ra ra-crown bar-is-leader '+ (player.isLeader ? 'block' : 'none') +' no-pointer"></i>' +
			'<div id="bar-name-'+ index +'" class="bar-hp-name ellipsis">'+ (player.name || '') +'</div>' +
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
				getElementById('bar-is-leader-' + data.row).classList.remove('none');
			}
			else {
				getElementById('bar-is-leader-' + data.row).classList.add('none');
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
		if (ping < 150) index = 0;
		else if (ping < 350) index = 1;
		else index = 2;
		return pingColors[index];
	}
	function setHp(index, delay) {
		if (typeof party.presence[index] === 'undefined' ||
			!party.presence[index].name) {
			console.warn("NOT DRAWING BAR");
		}
		else {
			percent = ~~((party.presence[index].hp / party.presence[index].maxHp) * 100) + '%';
			delay = delay === undefined ? .3 : delay;
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
				percent = ~~((party.presence[index].mp / party.presence[index].maxMp) * 100) + '%';
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
			if (i) getElementById('bar-player-wrap-' + i).style.display = 'none'
		});
	}
	function linkdead(data) {
		chat.log(data.name + ' has gone linkdead.', 'chat-warning');
	}

	function getSkillDescription(event) {
		id = event.currentTarget.dataset.id
		ng.split('inv-skill-description', skillDescriptions[id]);
	}

	function getPropSkillHtml(prop) {
		if (!my[prop]) return ''
		max = stat.getPropMax(prop)
		html = '<div data-id="'+ prop +'" class="inv-skill-row">' +
				'<div class="inv-skill-bar" style="width: '+ (my[prop] / max * 100) +'%"></div>' +
				'<div class="inv-skill-label-wrap">' +
					'<div class="inv-skill-label">'+ (item.specialPropLabels[prop] || _.capitalize(prop)) + '</div>' +
					'<div>'+ my[prop] +'/' + max +'</div>' +
				'</div>' +
			'</div>';
		return html
	}

	function getSkillsHtml() {
		html = '<div id="inv-skills-wrap">';
		item.allProps.forEach(function(prop) {
			html += getPropSkillHtml(prop)
		})
		html += '</div>' +
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
					'<img id="inv-avatar-img" src="'+ my.getAvatarUrl() +'">' +
					'<div id="inv-resist-wrap" class="text-shadow">'+
						'<div id="inv-resist-blood" class="inv-resist-icon flex-center" style="background: #500">' + stat.resistBlood() + '</div>' +
						'<div id="inv-resist-poison" class="inv-resist-icon flex-center" style="background: #090">' + stat.resistPoison() + '</div>' +
						'<div id="inv-resist-arcane" class="inv-resist-icon flex-center" style="background: #808">' + stat.resistArcane() + '</div>' +
						'<div id="inv-resist-lightning" class="inv-resist-icon flex-center" style="background: #aa0">' + stat.resistLightning() + '</div>' +
						'<div id="inv-resist-fire" class="inv-resist-icon flex-center" style="background: #840">' + stat.resistFire() + '</div>' +
						'<div id="inv-resist-ice" class="inv-resist-icon flex-center" style="background: #28c">' + stat.resistIce() + '</div>' +
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
		'</div>'
	}
	function charStatColTwoHtml() {
		return '<div class="flex space-between">' +
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
		'</div>'
	}
})(_, $, Draggable, TweenMax);