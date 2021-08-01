var bar;
(function(_, $, Draggable, TweenMax, undefined) {
	bar = {
		setWindowSize,
		showBarMenuPopover,
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
		handleDisplaySizeChange,
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
		isValidHotkey,
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
			el.style.display = 'flex'

			bar.dom.lag = getElementById('bar-lag')
			bar.dom.inventory = getElementById('inventory')
			// draw all bars
			// bar events
			$('body')
				.on('click', '#bar-camp', chat.camp)
				.on('click', '#bar-stats', toggleCharacterStats)
				.on('click', '#bar-inventory', toggleInventory)
				.on('click', '#bar-options', toggleOptions)

			$("#bar-wrap")
				.on('click', '.bar-player-wrap', handleClickPartyAvatar)
				.on('contextmenu', '.bar-avatar-wrap', handleContextPartyAvatar)
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

	function handleClickPartyAvatar(e) {
		id = this.id
		arr = id.split('-')
		my.partyTarget(party.getIndexByRow(arr[arr.length - 1] * 1))
	}

	function handleContextPartyAvatar(e) {
		id = this.id
		arr = id.split('-')
		context.player.row = arr[arr.length - 1] * 1
		slot = party.getIndexByRow(context.player.row)
		context.player.name = party.presence[slot].name
		context.setPartyMenuHtml()
	}

	function toggleCharacterStats() {
		if (item.awaitingDrop) return
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
			'<div>Level <span id="char-sheet-level">'+ my.level +'</span> '+ my.race +' '+ my.jobLong +'</div>' +
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
		if (item.awaitingDrop) return
		// open all bags in the bottom-right corner
		bar.windowsOpen.inventory = !bar.windowsOpen.inventory
		tooltip.conditionalHide()
		updateInventoryDOM()
	}

	function updateInventoryDOM(suppressSfx) {
		if (bar.windowsOpen.inventory) {
			bar.dom.inventory.innerHTML = getInventoryHtml()
			bar.dom.inventory.style.display = 'flex'
		}
		else {
			bar.dom.inventory.innerHTML = ''
			bar.dom.inventory.style.display = 'none'
		}
		if (!suppressSfx) {
			audio.playSound('bag-open', '', 1, 250)
		}
	}

	function updateInventoryGold(obj) {
		if (!bar.windowsOpen.inventory) return
		el = querySelector('#inventory-gold')
		if (typeof obj === 'undefined') {
			el.textContent = my.gold
		}
		else {
			el.textContent = ~~obj.value
		}
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

	function updateCharacterDOM(suppressSfx) {
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
			if (!suppressSfx) {
				audio.playSound('click-22', '', 1, 250)
			}
		}
	}

	/**
	 * Sometimes I have to define itemData manually because the dragData was lost
	 * @param itemData
	 */
	function updateItemSwapDOM(itemData) {
		if (itemData) {
			itemData.dragType && bar.updateItemSlotDOM(itemData.dragType, itemData.dragSlot)
			itemData.dropType && bar.updateItemSlotDOM(itemData.dropType, itemData.dropSlot)
		}
		else {
			item.dragType && bar.updateItemSlotDOM(item.dragType, item.dragSlot)
			item.dropType && bar.updateItemSlotDOM(item.dropType, item.dropSlot)
		}
		// console.info('//////////// updateItemSwapDOM', item.dropType, item.dragType)
		if ([item.dropType, item.dragType].includes('eq')) {
			// console.info('update char stats')
			stats.clearCache()
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
			ng.html('#inv-resist-blood', stats.getResistPercent(DAMAGE_TYPE.BLOOD, true))
			ng.html('#inv-resist-poison', stats.getResistPercent(DAMAGE_TYPE.POISON, true))
			ng.html('#inv-resist-arcane', stats.getResistPercent(DAMAGE_TYPE.ARCANE, true))
			ng.html('#inv-resist-lightning', stats.getResistPercent(DAMAGE_TYPE.LIGHTNING, true))
			ng.html('#inv-resist-fire', stats.getResistPercent(DAMAGE_TYPE.FIRE, true))
			ng.html('#inv-resist-ice', stats.getResistPercent(DAMAGE_TYPE.ICE, true))
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
		percent = bar.getRatio(type, data)
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
		ng.html('#root-options', '')
		querySelector('#root-options').style.display = 'none'
	}
	function handleDragMusicEnd() {
		query.el('#bgmusic').volume = ng.config.musicVolume / 100
		query.el('#bgamb1').volume = (ng.config.ambientVolume / 100)
		query.el('#bgamb2').volume = (ng.config.ambientVolume / 100)
	}
	function initDraggableAudioDials() {
		// sfx
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
				maxRotation: MAX_HEIGHT
			}
		})
		el = Draggable.get('#options-knob-sfx')
		TweenMax.set('#options-knob-sfx', {
			rotation: (~~(ng.config.soundVolume / 5) * 54)
		})
		el.update()
		// music
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
				maxRotation: MAX_HEIGHT
			}
		})
		el = Draggable.get('#options-knob-music')
		TweenMax.set('#options-knob-music', {
			rotation: (~~(ng.config.musicVolume / 5) * 54)
		})
		el.update()
		// ambient
		Draggable.create('#options-knob-ambient', {
			type: 'rotation',
			throwProps: true,
			throwResistance: 500,
			overshootTolerance: 0,
			maxDuration: 1,
			snap: volumeSettings,
			onDrag: handleDragAmbient,
			onThrowUpdate: handleDragAmbient,
			onThrowComplete: handleDragAmbient,
			bounds: {
				minRotation: 0,
				maxRotation: MAX_HEIGHT
			}
		})
		el = Draggable.get('#options-knob-ambient')
		TweenMax.set('#options-knob-ambient', {
			rotation: (~~(ng.config.ambientVolume / 5) * 54)
		})
		el.update()
	}


	function handleDragSfx() {
		val = this.x
		if (val > MAX_HEIGHT) val = MAX_HEIGHT
		if (val < 0) val = 0
		val = ~~(val / 54 * 5)
		ng.config.soundVolume = val
		audio.save()
		elSfx = querySelector('#options-sfx-value')
		if (elSfx !== null) {
			elSfx.textContent = val
		}
		// audio.playSound('beep-5')
	}
	function handleDragMusic() {
		val = this.x
		if (val > MAX_HEIGHT) val = MAX_HEIGHT
		if (val < 0) val = 0
		val = ~~(val / 54 * 5)
		ng.config.musicVolume = val
		audio.save()
		elMusic = querySelector('#options-music-value')
		if (elMusic !== null) {
			elMusic.textContent = val
		}
		handleDragMusicEnd()
		// audio.playSound('beep-5')
	}
	function handleDragAmbient() {
		val = this.x
		if (val > MAX_HEIGHT) val = MAX_HEIGHT
		if (val < 0) val = 0
		val = ~~(val / 54 * 5)
		ng.config.ambientVolume = val
		audio.save()
		elMusic = querySelector('#options-ambient-value')
		if (elMusic !== null) {
			elMusic.textContent = val
		}
		handleDragMusicEnd()
		// audio.playSound('beep-5')
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
		html =
		'<div style="position: relative; width: 100%">' +
			'<img data-id="options" class="close-menu" src="images/ui/close.png" ' +
				'style="transform: translate(50%, -50%)">' +
		'</div>' +
		'<div class="flex">' +
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
		'<div id="options-app-controls" class="flex-column space-between text-shadow3" style="'+ css.optionFooter +'">' +
			'<div class="flex-center option-button">'+
				'<div id="options-default" >Default Settings</div>'+
			'</div>' +
			'<div class="flex-center option-button">' +
				'<div id="app-reset">Reset Game</div>' +
			'</div>' +
			'<div class="flex-center option-button">' +
				'<div id="app-exit">Exit Game</div>' +
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
		handleDragMusicEnd()
		audio.playSound('chime-3')
		handleDisplaySizeChange({
			currentTarget: {
				dataset: { id: ng.config.display }
			}
		})
	}

	/**
	 * Sets window size by string input
	 * @param value
	 */
	function setWindowSize(value) {
		if (app.isApp) {
			var gui = require('nw.gui');
			var win = gui.Window.get();
			setTimeout(() => {
				// always do this for some reason???
				if (value === 'Full Screen') {
					!win.isFullscreen && win.enterFullscreen()
				}
				else {
					win.isFullscreen && win.leaveFullscreen()
					if (value === '1920x1080') {
						win.resizeTo(1920, 1080)
					}
					else if (value === '1600x900') {
						win.resizeTo(1600, 900)
					}
					else if (value === '1366x768') {
						win.resizeTo(1366, 768)
					}
					else if (value === '1440x900') {
						win.resizeTo(1440, 900)
					}
					else if (value === '1280x720') {
						win.resizeTo(1280, 720)
					}
				}
			}, 100);
		}
	}

	function handleDisplaySizeChange(event) {
		id = event.currentTarget.dataset.id
		if (id === ng.config.display) return

		console.info('handleDisplaySizeChange', id)
		if (app.isApp) {
			bar.setWindowSize(id)
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
		'<div class="flex align-center space-between">' +
			'<div style="flex: 1">Ambient Volume:</div>' +
			'<div id="options-knob-ambient">'+
				'<div class="options-volume"></div>' +
			'</div>' +
			'<div id="options-ambient-value" style="'+ css.volumeColumns +'">'+ ng.config.ambientVolume +'</div>' +
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
		else if (event.currentTarget.dataset.id === 'patch-notes') patch.close()
		else if (event.currentTarget.dataset.id === 'options') bar.toggleOptions()
		audio.playSound('click-7')
	}

	function closeAllWindows() {
		if (item.awaitingDrop) return
		let anyOpen = false
		_.each(bar.windowsOpen, (val, key) => {
			if (bar.windowsOpen[key]) {
				anyOpen = true
			}
			bar.windowsOpen[key] = false
		})
		updateCharacterDOM(true)
		updateInventoryDOM(true)
		updateOptionsDOM()
		if (town.openVariousWindow !== 'Trade') {
			town.closeVarious()
		}
		toast.hideDestroyToast()
		toast.removeToast()
		item.resetDrop()
		tooltip.hide()
		if (anyOpen) {
			audio.playSound('click-22', '', 1, 250)
		}
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
		if (typeof bar.dom[index] === 'undefined' || Config.mockFullParty) {
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
		let partyIndex = party.presence.findIndex(p => p.row === player.row)
		// job icon
		// console.info('getPlayerBarHtml', player)
		// red background
		// if (my.row === index) html += '<div id="bar-card-bg-'+ index +'" class="bar-card-bg"></div>'
		// party bands
		/*'<div class="flex-row">' +
			'<div class="flex-max party-band" style="background: '+ party.color[partyIndex] +'"></div>' +
		'</div>' +*/
		// console.info('player',player)
		html +=

		// '<div class="party-square"></div>' +
		// name row
		'<div id="bar-name-'+ index +'" '+
			'class="bar-hp-name ellipsis text-shadow3 '+ (player.isLeader ? 'chat-gold' : '') +'" '+
			'style="background: '+ party.color[partyIndex] +'">' +
			(player.name || '') +
		'</div>' +
		// avatar
		'<div id="avatar-wrap-'+ index +'" class="bar-avatar-wrap flex-column flex-center" style="position: relative">' +
			'<img id="bar-avatar-job-'+ index+'" class="bar-job-icon" src="images/ui/job-'+ player.job +'.png">' +
			'<img id="bar-avatar-'+ index +'" class="bar-avatar popover-icons" src="'+ player.avatar +'">' +
		'</div>' +
		// bars
		'<div id="player-resource-'+ index +'" class="flex-column bar-col-data player-resource-column">' +
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
		'</div>'
		return html
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
						'<div id="inv-resist-blood" class="inv-resist-icon popover-icons">' + stats.getResistPercent(DAMAGE_TYPE.BLOOD, true) + '</div>' +
						'<div id="inv-resist-poison" class="inv-resist-icon popover-icons">' + stats.getResistPercent(DAMAGE_TYPE.POISON, true) + '</div>' +
						'<div id="inv-resist-arcane" class="inv-resist-icon popover-icons">' + stats.getResistPercent(DAMAGE_TYPE.ARCANE, true) + '</div>' +
						'<div id="inv-resist-lightning" class="inv-resist-icon popover-icons">' + stats.getResistPercent(DAMAGE_TYPE.LIGHTNING, true) + '</div>' +
						'<div id="inv-resist-fire" class="inv-resist-icon popover-icons">' + stats.getResistPercent(DAMAGE_TYPE.FIRE, true) + '</div>' +
						'<div id="inv-resist-ice" class="inv-resist-icon popover-icons">' + stats.getResistPercent(DAMAGE_TYPE.ICE, true) + '</div>' +
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
			'<div>'+ tooltip.getDamageRange(hit, true) +'</div>' +
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



	var keyCodes = [
		"", // [0]
		"", // [1]
		"", // [2]
		"CANCEL", // [3]
		"", // [4]
		"", // [5]
		"HELP", // [6]
		"", // [7]
		"BACKSPACE", // [8]
		"TAB", // [9]
		"", // [10]
		"", // [11]
		"CLEAR", // [12]
		"ENTER", // [13]
		"ENTER_SPECIAL", // [14]
		"", // [15]
		"SHIFT", // [16]
		"CONTROL", // [17]
		"ALT", // [18]
		"PAUSE", // [19]
		"CAPS_LOCK", // [20]
		"KANA", // [21]
		"EISU", // [22]
		"JUNJA", // [23]
		"FINAL", // [24]
		"HANJA", // [25]
		"", // [26]
		"ESCAPE", // [27]
		"CONVERT", // [28]
		"NONCONVERT", // [29]
		"ACCEPT", // [30]
		"MODECHANGE", // [31]
		"SPACE", // [32]
		"PAGE_UP", // [33]
		"PAGE_DOWN", // [34]
		"END", // [35]
		"HOME", // [36]
		"LEFT ARROW", // [37]
		"UP ARROW", // [38]
		"RIGHT ARROW", // [39]
		"DOWN ARROW", // [40]
		"SELECT", // [41]
		"PRINT", // [42]
		"EXECUTE", // [43]
		"PRINTSCREEN", // [44]
		"INSERT", // [45]
		"DELETE", // [46]
		"", // [47]
		"0", // [48]
		"1", // [49]
		"2", // [50]
		"3", // [51]
		"4", // [52]
		"5", // [53]
		"6", // [54]
		"7", // [55]
		"8", // [56]
		"9", // [57]
		":", // [58]
		";", // [59]
		"<", // [60]
		"EQUALS", // [61]
		">", // [62]
		"?", // [63]
		"@", // [64]
		"A", // [65]
		"B", // [66]
		"C", // [67]
		"D", // [68]
		"E", // [69]
		"F", // [70]
		"G", // [71]
		"H", // [72]
		"I", // [73]
		"J", // [74]
		"K", // [75]
		"L", // [76]
		"M", // [77]
		"N", // [78]
		"O", // [79]
		"P", // [80]
		"Q", // [81]
		"R", // [82]
		"S", // [83]
		"T", // [84]
		"U", // [85]
		"V", // [86]
		"W", // [87]
		"X", // [88]
		"Y", // [89]
		"Z", // [90]
		"OS_KEY", // [91] Windows Key (Windows) or Command Key (Mac)
		"", // [92]
		"CONTEXT_MENU", // [93]
		"", // [94]
		"SLEEP", // [95]
		"NUMPAD0", // [96]
		"NUMPAD1", // [97]
		"NUMPAD2", // [98]
		"NUMPAD3", // [99]
		"NUMPAD4", // [100]
		"NUMPAD5", // [101]
		"NUMPAD6", // [102]
		"NUMPAD7", // [103]
		"NUMPAD8", // [104]
		"NUMPAD9", // [105]
		"MULTIPLY", // [106]
		"ADD", // [107]
		"SEPARATOR", // [108]
		"SUBTRACT", // [109]
		"DECIMAL", // [110]
		"DIVIDE", // [111]
		"F1", // [112]
		"F2", // [113]
		"F3", // [114]
		"F4", // [115]
		"F5", // [116]
		"F6", // [117]
		"F7", // [118]
		"F8", // [119]
		"F9", // [120]
		"F10", // [121]
		"F11", // [122]
		"F12", // [123]
		"F13", // [124]
		"F14", // [125]
		"F15", // [126]
		"F16", // [127]
		"F17", // [128]
		"F18", // [129]
		"F19", // [130]
		"F20", // [131]
		"F21", // [132]
		"F22", // [133]
		"F23", // [134]
		"F24", // [135]
		"", // [136]
		"", // [137]
		"", // [138]
		"", // [139]
		"", // [140]
		"", // [141]
		"", // [142]
		"", // [143]
		"NUM_LOCK", // [144]
		"SCROLL_LOCK", // [145]
		"WIN_OEM_FJ_JISHO", // [146]
		"WIN_OEM_FJ_MASSHOU", // [147]
		"WIN_OEM_FJ_TOUROKU", // [148]
		"WIN_OEM_FJ_LOYA", // [149]
		"WIN_OEM_FJ_ROYA", // [150]
		"", // [151]
		"", // [152]
		"", // [153]
		"", // [154]
		"", // [155]
		"", // [156]
		"", // [157]
		"", // [158]
		"", // [159]
		"CIRCUMFLEX", // [160]
		"EXCLAMATION", // [161]
		"DOUBLE_QUOTE", // [162]
		"HASH", // [163]
		"DOLLAR", // [164]
		"PERCENT", // [165]
		"AMPERSAND", // [166]
		"UNDERSCORE", // [167]
		"OPEN_PAREN", // [168]
		"CLOSE_PAREN", // [169]
		"ASTERISK", // [170]
		"PLUS", // [171]
		"PIPE", // [172]
		"HYPHEN_MINUS", // [173]
		"OPEN_CURLY_BRACKET", // [174]
		"CLOSE_CURLY_BRACKET", // [175]
		"TILDE", // [176]
		"", // [177]
		"", // [178]
		"", // [179]
		"", // [180]
		"VOLUME_MUTE", // [181]
		"VOLUME_DOWN", // [182]
		"VOLUME_UP", // [183]
		"", // [184]
		"", // [185]
		"SEMICOLON", // [186]
		"EQUALS", // [187]
		"COMMA", // [188]
		"MINUS", // [189]
		"PERIOD", // [190]
		"SLASH", // [191]
		"BACK QUOTE", // [192]
		"", // [193]
		"", // [194]
		"", // [195]
		"", // [196]
		"", // [197]
		"", // [198]
		"", // [199]
		"", // [200]
		"", // [201]
		"", // [202]
		"", // [203]
		"", // [204]
		"", // [205]
		"", // [206]
		"", // [207]
		"", // [208]
		"", // [209]
		"", // [210]
		"", // [211]
		"", // [212]
		"", // [213]
		"", // [214]
		"", // [215]
		"", // [216]
		"", // [217]
		"", // [218]
		"OPEN_BRACKET", // [219]
		"BACK_SLASH", // [220]
		"CLOSE_BRACKET", // [221]
		"QUOTE", // [222]
		"", // [223]
		"META", // [224]
		"ALTGR", // [225]
		"", // [226]
		"WIN_ICO_HELP", // [227]
		"WIN_ICO_00", // [228]
		"", // [229]
		"WIN_ICO_CLEAR", // [230]
		"", // [231]
		"", // [232]
		"WIN_OEM_RESET", // [233]
		"WIN_OEM_JUMP", // [234]
		"WIN_OEM_PA1", // [235]
		"WIN_OEM_PA2", // [236]
		"WIN_OEM_PA3", // [237]
		"WIN_OEM_WSCTRL", // [238]
		"WIN_OEM_CUSEL", // [239]
		"WIN_OEM_ATTN", // [240]
		"WIN_OEM_FINISH", // [241]
		"WIN_OEM_COPY", // [242]
		"WIN_OEM_AUTO", // [243]
		"WIN_OEM_ENLW", // [244]
		"WIN_OEM_BACKTAB", // [245]
		"ATTN", // [246]
		"CRSEL", // [247]
		"EXSEL", // [248]
		"EREOF", // [249]
		"PLAY", // [250]
		"ZOOM", // [251]
		"", // [252]
		"PA1", // [253]
		"WIN_OEM_CLEAR", // [254]
		"" // [255]
	];

	function getOptionsHotkeysHtml() {
		str = '<div class="flex-column flex-max" style="justify-content: flex-start;">' +

			// general
			'<div class="hotkey-header">General Hotkeys</div>' +
			'<div class="flex align-center">' +
				'<div style="flex-basis: 50%;">Character Stats</div>' +
				'<div data-id="character-stats" class="options-hotkey flex-max">'+
					keyCodes[ng.config.hotkey.characterStats] +
				'</div>'+
			'</div>' +
			'<div class="flex align-center">' +
				'<div style="flex-basis: 50%;">Inventory</div>' +
				'<div data-id="inventory" class="options-hotkey flex-max">'+
					keyCodes[ng.config.hotkey.inventory] +
				'</div>'+
			'</div>' +
			'<div class="flex align-center">' +
				'<div style="flex-basis: 50%;">Close Windows</div>' +
				'<div data-id="close-windows" class="options-hotkey flex-max">'+
					keyCodes[ng.config.hotkey.closeWindows] +
				'</div>'+
			'</div>' +

			// social
			'<div class="hotkey-header">Social Hotkeys</div>' +
			'<div class="flex align-center">' +
				'<div style="flex-basis: 50%;">Reply</div>' +
				'<div data-id="reply" class="options-hotkey flex-max">'+
					keyCodes[ng.config.hotkey.reply] +
				'</div>'+
			'</div>' +
			'<div class="flex align-center">' +
				'<div style="flex-basis: 50%;">Chat</div>' +
				'<div data-id="chat" class="options-hotkey flex-max">'+
					keyCodes[ng.config.hotkey.chat] +
				'</div>'+
			'</div>' +

			// dungeon
			'<div class="hotkey-header">Dungeon Hotkeys</div>' +
			'<div class="flex align-center">' +
				'<div style="flex-basis: 50%;">Walk Forward</div>' +
				'<div data-id="walk-forward" class="options-hotkey flex-max">'+
					keyCodes[ng.config.hotkey.walkForward] +
				'</div>'+
			'</div>' +
			'<div class="flex align-center">' +
				'<div style="flex-basis: 50%;">Walk Backward</div>' +
				'<div data-id="walk-backward" class="options-hotkey flex-max">'+
					keyCodes[ng.config.hotkey.walkBackward] +
				'</div>'+
			'</div>' +
			'<div class="flex align-center">' +
				'<div style="flex-basis: 50%;">Auto Walk</div>' +
				'<div data-id="auto-walk" class="options-hotkey flex-max">'+
					keyCodes[ng.config.hotkey.autoWalk] +
				'</div>'+
			'</div>' +

			// combat
			'<div class="hotkey-header">Combat Hotkeys</div>' +
			'<div class="flex align-center">' +
				'<div style="flex-basis: 50%;">Auto Attack</div>' +
				'<div data-id="auto-attack" class="options-hotkey flex-max">'+
					keyCodes[ng.config.hotkey.autoAttack] +
				'</div>'+
			'</div>' +
			'<div class="flex align-center">' +
				'<div style="flex-basis: 50%;">Next Target</div>' +
				'<div data-id="next-target" class="options-hotkey flex-max">'+
					keyCodes[ng.config.hotkey.nextTarget] +
				'</div>'+
			'</div>' +
			'<div class="flex align-center">' +
				'<div style="flex-basis: 50%;">Target Self</div>' +
				'<div data-id="target-player-1" class="options-hotkey flex-max">'+
					keyCodes[ng.config.hotkey.targetPlayer1] +
				'</div>'+
			'</div>' +
			'<div class="flex align-center">' +
				'<div style="flex-basis: 50%;">Target Player 2</div>' +
				'<div data-id="target-player-2" class="options-hotkey flex-max">'+
					keyCodes[ng.config.hotkey.targetPlayer2] +
				'</div>'+
			'</div>' +
			'<div class="flex align-center">' +
				'<div style="flex-basis: 50%;">Target Player 3</div>' +
				'<div data-id="target-player-3" class="options-hotkey flex-max">'+
					keyCodes[ng.config.hotkey.targetPlayer3] +
				'</div>'+
			'</div>' +
			'<div class="flex align-center">' +
				'<div style="flex-basis: 50%;">Target Player 4</div>' +
				'<div data-id="target-player-4" class="options-hotkey flex-max">'+
					keyCodes[ng.config.hotkey.targetPlayer4] +
				'</div>'+
			'</div>' +
			'<div class="flex align-center">' +
				'<div style="flex-basis: 50%;">Target Player 5</div>' +
				'<div data-id="target-player-5" class="options-hotkey flex-max">'+
					keyCodes[ng.config.hotkey.targetPlayer5] +
				'</div>'+
			'</div>' +

			// fixed
			'<div class="hotkey-header">Fixed Hotkeys</div>' +
			'<div class="flex align-center">' +
				'<div style="flex-basis: 50%;">Options</div>' +
				'<div class="flex-max" style="color: #fff; text-align: center">ESC</div>'+
			'</div>' +
			'<div class="flex align-center">' +
				'<div style="flex-basis: 50%;">Skill 1</div>' +
				'<div class="flex-max" style="color: #fff; text-align: center">1</div>'+
			'</div>' +
			'<div class="flex align-center">' +
				'<div style="flex-basis: 50%;">Skill 2</div>' +
				'<div class="flex-max" style="color: #fff; text-align: center">2</div>'+
			'</div>' +
			'<div class="flex align-center">' +
				'<div style="flex-basis: 50%;">Skill 3</div>' +
				'<div class="flex-max" style="color: #fff; text-align: center">3</div>'+
			'</div>' +
			'<div class="flex align-center">' +
				'<div style="flex-basis: 50%;">Skill 4</div>' +
				'<div class="flex-max" style="color: #fff; text-align: center">4</div>'+
			'</div>' +
			'<div class="flex align-center">' +
				'<div style="flex-basis: 50%;">Skill 5</div>' +
				'<div class="flex-max" style="color: #fff; text-align: center">5</div>'+
			'</div>' +
			'<div class="flex align-center">' +
				'<div style="flex-basis: 50%;">Skill 6</div>' +
				'<div class="flex-max" style="color: #fff; text-align: center">6</div>'+
			'</div>' +
			'<div class="flex align-center">' +
				'<div style="flex-basis: 50%;">Skill 7</div>' +
				'<div class="flex-max" style="color: #fff; text-align: center">SHIFT + 1</div>'+
			'</div>' +
			'<div class="flex align-center">' +
				'<div style="flex-basis: 50%;">Skill 8</div>' +
				'<div class="flex-max" style="color: #fff; text-align: center">SHIFT + 2</div>'+
			'</div>' +
			'<div class="flex align-center">' +
				'<div style="flex-basis: 50%;">Skill 9</div>' +
				'<div class="flex-max" style="color: #fff; text-align: center">SHIFT + 3</div>'+
			'</div>' +
			'<div class="flex align-center">' +
				'<div style="flex-basis: 50%;">Skill 10</div>' +
				'<div class="flex-max" style="color: #fff; text-align: center">SHIFT + 4</div>'+
			'</div>' +
			'<div class="flex align-center">' +
				'<div style="flex-basis: 50%;">Skill 11</div>' +
				'<div class="flex-max" style="color: #fff; text-align: center">SHIFT + 5</div>'+
			'</div>' +
			'<div class="flex align-center">' +
				'<div style="flex-basis: 50%;">Skill 12</div>' +
				'<div class="flex-max" style="color: #fff; text-align: center">SHIFT + 6</div>'+
			'</div>' +
			'<div class="flex align-center">' +
				'<div style="flex-basis: 50%;">Fast Buy</div>' +
				'<div class="flex-max" style="color: #fff; text-align: center">CTRL + LEFT CLICK</div>'+
			'</div>' +
			'<div class="flex align-center">' +
				'<div style="flex-basis: 50%;">Fast Sell</div>' +
				'<div class="flex-max" style="color: #fff; text-align: center">CTRL + LEFT CLICK</div>'+
			'</div>' +
			'<div class="flex align-center">' +
				'<div style="flex-basis: 50%;">Fast Destroy</div>' +
				'<div class="flex-max" style="color: #fff; text-align: center">CTRL + LEFT CLICK</div>'+
			'</div>' +

		'</div>'

		return str
	}
	let keyCode = 0
	let invalidReason = ''
	function isValidHotkey(event) {
		keyCode = event.keyCode
		if (isValidKeyCode(keyCode)) {
			return {
				isValid: true,
				key: keyCodes[keyCode],
				reason: ''
			}
		}
		else {
			invalidReason = 'You cannot bind to that hotkey!'
			if (keyCode => 16 && keyCode <=18) {
				// alt, shift, ctrl - silently ignore
				invalidReason = ''
			}
			return {
				isValid: false,
				reason: invalidReason
			}
		}
	}

	function isValidKeyCode(keyCode) {
		return keyCode >= 65 && keyCode <= 81 // a-q
			|| keyCode === 83 // s
			|| keyCode >= 84 && keyCode <= 90 // u-z
			|| keyCode >= 48 && keyCode <= 57 // 0-9
			|| keyCode >= 112 && keyCode <= 119 // F1-F8
			|| keyCode === 192 // `
			|| keyCode === 189 // -
			|| keyCode === 187 // =
			|| keyCode === 8 // backspace
			|| keyCode >= 33 && keyCode <= 36 // pageup, pagedown, end, home
			|| keyCode === 45 // insert
			|| keyCode === 46 // delete
			|| keyCode === 32 // space
			|| keyCode >= 37 && keyCode <= 40 // arrows
			|| keyCode >= 219 && keyCode <= 221 // []\
			|| keyCode === 186 // ;
			|| keyCode === 222 // '
			|| keyCode === 188 // ,
			|| keyCode === 190 // .
			|| keyCode >= 96 && keyCode <= 107 // numpad 0-9, * +
			|| keyCode >= 109 && keyCode <= 111 // numpad - . /
	}

	function setHotkey(keyCode) {
		console.info('setHotkey', keyCode)
		if (Object.values(ng.config.hotkey).includes(keyCode)) {
			// this is already mapped!
			var camelKey = _.findKey(ng.config.hotkey, hotkey => hotkey === keyCode)
			// console.info('keys: ', bar.hotkeyId, camelKey)
			if (_.camelCase(bar.hotkeyId) === camelKey) {
				stopListeningForHotkey()
			}
			else {
				ng.msg('This key is already assigned: ' + _.startCase(camelKey), undefined, COLORS.yellow)
			}
			audio.playSound('beep-3')
		}
		else {
			console.info('SETTING', _.camelCase(bar.hotkeyId), 'to', keyCode)
			ng.config.hotkey[_.camelCase(bar.hotkeyId)] = keyCode
			bar.hotkeyElement.textContent = keyCodes[keyCode]
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
})(_, $, Draggable, TweenMax);