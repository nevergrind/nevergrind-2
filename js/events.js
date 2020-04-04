(function(_, $, parseInt, getComputedStyle, undefined) {
	var i;
	var key;
	// window

	// document events
	$(document).ready(ready)

	//////////////////////////////////////////////
	function ready() {
		// console.info("Initializing title screen...");
		delayedCall(.1, readyFire);

		$(window)
			.on('resize', resize)
			.on('load', windowResized)
			.on('focus', focus)
			.on('contextmenu', handleContextMenu)
			.focus(windowResized)

		$(document)
			.on('mousemove', mousemove)
			.on('click', mousedown)
			.on('keydown', keydown)

		$('#root-options')
			.on('click', '#app-exit', bar.appExit)
			.on('click', '#app-reset', bar.appReset)
			.on('click', '.window-select', bar.setWindowSize)
			.on('click', '#options-okay', bar.toggleOptions)
			.on('click', '#options-default', bar.setDefaultOptions)
			.on('click', '#options-fast-destroy', bar.toggleFastDestroy)
			.on('click', '#options-show-network', bar.toggleShowNetwork)
			.on('click', '.options-hotkey', bar.listenForHotkey)

		// delegated events
		$('body')
			.on('dragstart', 'img', dragStart)
			.on('click', '#toast-accept', toast.accept)
			.on('click', '#toast-decline', toast.decline)
			.on('click', '#toast-accept-destroy', toast.acceptDestroy)
			.on('click', '#toast-decline-destroy', toast.declineDestroy)
			.on('focus', 'input', chatInputFocus)
			.on('blur', 'input', chatInputBlur)
			.on('click', '.close-menu', bar.handleCloseMenu)
			.on('mouseenter', '.item-slot', tooltip.handleItemEnter)
			.on('mouseleave', '.item-slot', tooltip.handleItemLeave)
			.on('contextmenu', '.item-slot-inv', item.handleItemSlotContextClick)
			.on('contextmenu', '.item-slot-bank', item.handleItemSlotContextClick)
			.on('click', '.item-slot', item.toggleDrag)
			.on('click', '.inv-tabs', bar.setCharActiveTab)
			.on('click', '.inv-skill-row', bar.getSkillDescription)
			.on('click', '#scene-town, #scene-dungeon, #scene-battle', item.dropItem)
			// options
			.on('click', '.option-category', bar.selectOptionCategory)
			.on('click', '.ng-dropdown-btn', dropdown.toggle)
			.on('click', '.ng-dropdown-select', dropdown.hideMenu)
			// town
			.on('click', '#guild-create', guild.create)
			.on('click focus', '#guild-input', town.handleGuildInputFocus)
			.on('blur', '#guild-input', town.handleGuildInputBlur)
			.on('click', '#guild-member-refresh-btn', town.refreshGuildMembers)
			.on('click', '.town-building', town.handleBuildingClick);

	}

	function handleContextMenu(event) {
		if (app.isApp) return false // disable context menus
	}
	function chatInputFocus() {
		chat.hasFocus = 1;
	}
	function chatInputBlur() {
		chat.hasFocus = 0;
	}
	function readyFire() {
		ng.initGame()
		ng.events()
		create.events()
		audio.events()
		// window.onbeforeunload = chat.camp
	}
	function focus() {
		windowResized();
	}
	function dragStart(e) {
		e.preventDefault()
	}
	function windowResized() {
		// debounce resize
		ng.resizeTimer.kill()
		ng.resizeTimer = delayedCall(.05, windowResizedTimeout)
		if (context.isOpen) {
			context.hide()
		}
	}
	function windowResizedTimeout() {
		if (chat.initialized) {
			chat.scrollBottom()
		}
		if (ng.view === 'battle') {
			for (i=0; i<mob.max; i++) {
				mob.sizeMob(i)
			}
		}
		ng.responsiveRatio = parseInt(getComputedStyle(getElementById('body')).fontSize, 10) / 20
	}
	function mousedown(e) {
		if (context.isOpen) {
			context.hideCheck()
			e.preventDefault()
			return false
		}
		if (dropdown.isOpen) {
			dropdown.hide()
			return false
		}
	}
	function mousemove(e) {
		//console.info('mousemove', e.clientX, e.clientY)
		my.mouse.x = e.clientX
		my.mouse.y = e.clientY
		if (item.isDragging) item.updateCursorImgPosition()
	}
	function resize() {
		context.hide()
		context.timer.kill()
		windowResized()
	}
	function keydown(e) {
		key = e.key;

		ng.lastKey = key;
		console.info('key: ', key)
		if (bar.hotkeyId) {
			if (bar.hotkeyWhitelist.includes(key)) {
				bar.setHotkey(key, e)
			}
			else {
				if (key === 'Shift' || key === 'Control' || key === 'Alt') {}
				else ng.msg('You cannot bind to that hotkey!', 1)
			}
			return
		}
		// local only
		if (!app.isApp) {
			if (!chat.hasFocus && ng.view !== 'title') {
				// key input view router
				if (key === 'PageDown') battle.go()
				else if (key === 'Home') town.go()
				else if (key === 'PageUp') dungeon.go()
			}
		}

		if (e.altKey) {
			// ALT key functions
			return false;
		}
		else if (e.ctrlKey){
			// CTRL key functions
			if (key === 'r'){
				// ctrl+r refresh
				chat.reply();
				return false;
			}
			else if (!chat.hasFocus) {
				// no select all of webpage elements
				if (key === 'a' || key === 'f') {
					e.preventDefault();
				}
			}
		}
		else {
			// normal key functions


			// literally in any view
			if (key === 'Escape') {
				console.warn('toggleOptions', key)
				bar.toggleOptions()
			}

			if (ng.view === 'title'){
				// title specific
				if (!ng.isModalOpen){
					// any key press focuses on input first
					create.whitelist.includes(key) && getElementById('create-character-name').focus();
				}
			}
			else {
				/*if (ng.view !== 'title' && chat.typingKeys.includes(key)) {
					if (!chat.hasFocus && !guild.hasFocus && chat.focusKeys.includes(key)) {
						var z = $("#chat-input");
						var text = z.val();
						!text && chat.dom.chatInput.focus();
						console.warn('canceling', key)
						return;
					}
				}*/

				if (chat.hasFocus) {
					// always works town, dungeon and combat (focused)
					if (chat.modeChange()) {
						// changing chat mode - matches possible mode change
						return false;
					}
					// has chat focus
					if (key === 'ArrowUp') {
						// chat focus history nav up
						if (chat.history[chat.historyIndex - 1] !== undefined) {
							var o = chat.history[--chat.historyIndex];
							chat.dom.chatInput.value = o.msg;
							chat.modeChange(o);
						}
					}
					else if (key === 'ArrowDown') {
						// chat focus history nav down
						if (chat.history.length === chat.historyIndex + 1) {
							chat.historyIndex++;
							chat.clearInput();
						}
						else if (chat.history[chat.historyIndex + 1] !== undefined) {
							var o = chat.history[++chat.historyIndex];
							chat.dom.chatInput.value = o.msg;
							chat.modeChange(o);
						}
					}
					else if (key === 'Enter') {
						// enter
						my.name && chat.sendMsg();
					}
				}
				else {
					// always works town, dungeon and combat (non-focused)
					if (key === ng.config.hotkey.characterStats) bar.toggleCharacterStats()
					else if (key === ng.config.hotkey.inventory) bar.toggleInventory()
					else if (key === ng.config.hotkey.bank) town.toggleBank()
					else if (key === ' ') bar.closeAllWindows()

				}

				if (ng.view === 'town') {
					// town specific
					if (!chat.hasFocus) {
						// if no aside, focus on chat input first
						!town.asideSelected && chat.focusKeys.includes(key) && chat.dom.chatInput.focus();

						if (guild.hasFocus && key === 'Enter') {
							guild.create();
						}
					}
				}
				else {
					// dungeon & combat specific
					if (!chat.hasFocus && chat.focusKeys.includes(key)) {
						chat.dom.chatInput.focus();
					}

					if (key === 'Tab') {
						// tab
						if (!e.shiftKey) {
							my.nextTarget(false);
						} else {
							my.nextTarget(true);
						}
						e.preventDefault();
					}
					else if (key === 'v') {
						// v
						if (ng.view === 'game' && !ng.chatOn) {
							game.toggleGameWindows(1); // ???
						}
					}
				}
			}
		}
	}
})(_, $, parseInt, getComputedStyle);



