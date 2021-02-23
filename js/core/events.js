(function(_, $, parseInt, getComputedStyle, undefined) {
	var i;
	var key;
	// window

	// document events
	document.addEventListener('DOMContentLoaded', readyFn)

	//////////////////////////////////////////////
	function readyFn() {
		// console.info("document ready...");
		delayedCall(.1, readyFire);

		$(window)
			.on('resize', resize)
			.on('load', windowResized)
			.on(ITEM_TYPE.FOCUS, focus)
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
			.on(ITEM_TYPE.FOCUS, 'input', chatInputFocus)
			.on('blur', 'input', chatInputBlur)
			.on('click', '.close-menu', bar.handleCloseMenu)
			.on('mouseenter', '.item-slot, .skill-btn-tooltip', tooltip.handleEnter)
			.on('mouseleave', '.item-slot, .skill-btn-tooltip', tooltip.handleLeave)
			.on('contextmenu', '.item-slot-inv, .item-slot-bank', item.handleItemSlotContextClick)
			.on('contextmenu', '.potion-slot', button.handlePotionSlotContextClick)
			.on('click', '.item-slot', item.toggleDrag)
			.on('click', '.inv-tabs', bar.setCharActiveTab)
			.on('click', '.inv-skill-row', bar.getSkillDescription)
			// options
			.on('click', '.option-category', bar.selectOptionCategory)
			.on('click', '.ng-dropdown-btn', dropdown.toggle)
			.on('click', '.ng-dropdown-select', dropdown.hideMenu)
			// town
			.on('click', '#guild-create', guild.create)
			.on('click focus', '#guild-input', town.handleGuildInputFocus)
			.on('blur', '#guild-input', town.handleGuildInputBlur)
			.on('click', '#guild-member-refresh-btn', town.refreshGuildMembers)
			.on('click', '.town-building', town.openVarious)
			.on('mouseenter', '.town-building', town.showLabel)
			.on('mouseleave', '.town-building', town.hideLabel)
			.on('click', '#town-buy', town.buyItem)
			.on('click', '#town-sell', town.sellItem)
			// missions
			.on('click', '.mission-zone-headers', mission.toggleZone)
			.on('click', '.mission-quest-item', mission.clickQuest)
			.on('click', '#mission-embark', mission.embark)
			.on('click', '#mission-abandon', mission.abandon)

	}

	function handleContextMenu() {
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
		my.mouse.x = e.clientX
		my.mouse.y = e.clientY
		// console.info(my.mouse.x, my.mouse.y)
		if (item.isDragging) item.updateCursorImgPosition()
	}
	function resize() {
		context.hide()
		context.timer.kill()
		map.applyBounds()
		windowResized()
	}
	function keydown(e) {
		key = e.key;

		ng.lastKey = key;
		// console.info('key: ', key)
		// trying to bind a new hotkey
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
				// no "select all" of webpage elements
				if (key === 'a' || key === 'f') {
					e.preventDefault();
				}
			}
		}
		else {
			// normal key functions
			// literally in any view
			if (key === 'Escape') {
				if (item.dragType) item.resetDrop()
				else bar.toggleOptions()
			}
			else if (key === ' ') bar.optionsClose()

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
						var txt = z.val();
						!txt && query.el('#chat-input').focus();
						// console.warn('canceling', key)
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
							query.el('#chat-input').value = o.msg;
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
							query.el('#chat-input').value = o.msg;
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
					else if (key === ' ') bar.closeAllWindows()

				}

				if (ng.view === 'town') {
					// town specific
					if (!chat.hasFocus) {
						// if no aside, focus on chat input first
						chat.focusKeys.includes(key) && query.el('#chat-input').focus();

						if (guild.hasFocus && key === 'Enter') {
							guild.create();
						}
					}
				}
				else {
					// dungeon & combat specific
					if (!chat.hasFocus) {
						if (chat.focusKeys.includes(key)) query.el('#chat-input').focus()
						else if (key === ' ') spell.cancelSpell()
						else if (key === 'F1') my.partyTarget(0)
						else if (key === 'F2') my.partyTarget(1)
						else if (key === 'F3') my.partyTarget(2)
						else if (key === 'F4') my.partyTarget(3)
						else if (key === 'F5') my.partyTarget(4)
						else if (key === 'F6') my.partyTarget(5)
						else if ('123456'.includes(key)) button.triggerSkill(+key - 1)
						else if (key === '!') button.triggerSkill(6)
						else if (key === '@') button.triggerSkill(7)
						else if (key === '#') button.triggerSkill(8)
						else if (key === '$') button.triggerSkill(9)
						else if (key === '%') button.triggerSkill(10)
						else if (key === '^') button.triggerSkill(11)
						else if (key === 'ArrowRight') dungeon.turnRight()
						else if (key === 'ArrowLeft') dungeon.turnLeft()
					}


					if (ng.view === 'battle') {
						if (!chat.hasFocus) {
							if (key === 'Tab') my.tabTarget(e)
							else if (key === ng.config.hotkey.autoAttack) combat.toggleAutoAttack()
						}
					}
				}
			}

			// prevent default behaviors in all scenes
			if (key === 'Tab') {
				e.preventDefault()
				return false
			}
			else if (key === 'F1') {
				e.preventDefault()
				return false
			}
			else if (key === 'F2') {
				e.preventDefault()
				return false
			}
			else if (key === 'F3') {
				e.preventDefault()
				return false
			}
			else if (key === 'F4') {
				e.preventDefault()
				return false
			}
			else if (key === 'F5') {
				e.preventDefault()
				return false
			}
			else if (key === 'F6') {
				e.preventDefault()
				return false
			}
		}
	}
})(_, $, parseInt, getComputedStyle);



