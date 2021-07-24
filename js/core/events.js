(function(_, $, parseInt, getComputedStyle, undefined) {
	var i
	var key
	let _keyup
	// window

	// document events
	document.addEventListener('DOMContentLoaded', readyFn)
	const bodyFontSize = getComputedStyle(getElementById('body')).fontSize

	//////////////////////////////////////////////
	function readyFn() {
		// console.info("document ready...");
		delayedCall(.1, readyFire)

		$(window)
			.on('resize', resize)
			.on('load', windowResized)
			.on('focus', windowFocus)
			.on('blur', handleWindowBlur)
			.on('contextmenu', handleContextMenu)
			.focus(windowResized)

		$(document)
			.on('mousemove', mousemove)
			.on('click', mousedown)
			.on('keydown', keydown)
			.on('keyup', keyup)

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
			.on('click', '#hearth', map.handleHearthClick)
			.on('dragstart', 'img', dragStart)
			.on('focus', 'input', chatInputFocus) // any input does this
			.on('blur', 'input', chatInputBlur)
			.on('click', '.close-menu', bar.handleCloseMenu)
			.on('mouseenter', '.item-slot, .skill-btn-tooltip', tooltip.handleTooltipEnter)
			.on('mouseleave', '.item-slot, .skill-btn-tooltip', tooltip.handleTooltipLeave)
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
			// bars
			.on('click', '.player-resource-column', bar.handlePlayerClick)

	}
	///////////////////////////
	function handleWindowBlur() {
		// console.info('handleWindowBlur')
		if (ng.view === 'dungeon') {
			if (dungeon.walking) {
				dungeon.walkStop()
			}
		}
	}

	function handleContextMenu(e) {
		console.info('handleContext', e)
		if (app.isApp) return false // disable context menus
	}
	function chatInputFocus() {
		chat.hasFocus = 1;
	}
	function chatInputBlur() {
		chat.hasFocus = 0
	}
	function readyFire() {
		ng.initGame()
		ng.events()
		create.events()
		audio.events()
		TweenMax.to('#scene-title', .5, {
			startAt: {
				filter: 'brightness(0)',
				visibility: 'visible',
				display: 'flex'
			},
			filter: 'brightness(1)',
			ease: Back.easeOut
		})
		// window.onbeforeunload = chat.camp
	}
	function windowFocus() {
		if (ng.view !== 'title') {
			if (!chat.inputHasFocus &&
				querySelector('#chat-input').value.length) {
				// chat.focusChatInput()
			}
		}
		windowResized()
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
		ng.responsiveRatio = parseInt(bodyFontSize, 10) / 20
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
		// console.info('e: ', e)
		if (e.originalEvent.repeat) return
		key = e.key
		// console.info('key: ', key)

		ng.lastKey = key
		// trying to bind a new hotkey
		if (bar.hotkeyId) {
			if (bar.hotkeyWhitelist.includes(key)) {
				bar.setHotkey(key, e)
			}
			else {
				if (key === 'Shift' || key === 'Control' || key === 'Alt') {}
				else ng.msg('You cannot bind to that hotkey!', 1, undefined, COLORS.red)
			}
			return
		}
		// local only
		/*if (!app.isApp) {
			if (!chat.hasFocus && ng.view !== 'title') {
				// key input view router
				if (key === 'PageDown') battle.go()
				else if (key === 'Home') town.go()
				else if (key === 'PageUp') mission.embark()
			}
		}*/
		// console.info('e.metaKey', e.metaKey)
		if (e.altKey) {
			// ALT key functions
			return false
		}
		else if (e.ctrlKey){
			// CTRL key functions
			if (key === 'r') return false
			if (!chat.hasFocus) {
				// no "select all" of webpage elements
				if (key === 'a' || key === 'f') {
					e.preventDefault();
				}
			}
		}
		else {
			// normal key functions
			// literally in any view
			if (key === 'Escape') { // ESC
				if (chat.inputHasFocus) {
					// do nothing... trust me - needs to go to ESC below
				}
				else if (item.dragType) item.resetDrop()
				else if (my.target >= 0) my.targetCleared()
				else {
					bar.toggleOptions()
					return false
				}
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
				// console.info('focus?', chat.hasFocus, chat.inputHasFocus, key)
				if (chat.hasFocus) {
					// always works town, dungeon and combat (focused)
					if (key === 'Escape' &&
						chat.inputHasFocus) {
						query.el('#chat-input').blur()
						return false
					}
					if (chat.modeChange()) {
						// changing chat mode - matches possible mode change
						return false
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
					// ctrl+r refresh
					// console.info(key, chat.inputHasFocus)
					if (key === 'r') {
						chat.reply()
						return false
					}
					else if (key === 't' && !chat.inputHasFocus) {
						chat.focusChatInput()
						return false
					}
					else if (key === ng.config.hotkey.characterStats) bar.toggleCharacterStats()
					else if (key === ng.config.hotkey.inventory) bar.toggleInventory()
					else if (key === ' ') bar.closeAllWindows()

				}

				if (ng.view === 'town') {
					// town specific
					if (!chat.hasFocus) {
						// if no aside, focus on chat input first
						chat.focusKeys.includes(key) && chat.focusChatInput()

						if (guild.hasFocus && key === 'Enter') {
							guild.create();
						}
					}
				}
				else {
					// dungeon & combat specific
					if (!chat.hasFocus) {
						if (chat.focusKeys.includes(key)) chat.focusChatInput()
						else if (key === 'z') dungeon.walkForward()
						else if (key === ng.config.hotkey.walkForward) dungeon.walkForward()
						else if (key === ng.config.hotkey.walkBackward) dungeon.walkBackward()
						else if (key === ' ') spell.cancelSpell()
						else if (key === 'F1') my.partyTarget(0)
						else if (key === 'F2') my.partyTarget(1) // bar-hp-name
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
			if (key === 'Tab' || key === 'F1' || key === 'F2' || key === 'F3' || key === 'F4' || key === 'F5' || key === 'F6') {
				e.preventDefault()
				return false
			}
		}
	}

	function keyup(e) {
		// if (e.originalEvent.repeat) return
		if (e.metaKey) {
			e.preventDefault()
			return false
		}
		if (ng.view === 'dungeon') {
			if (!map.inRoom) {
				if (e.key === ng.config.hotkey.walkForward) dungeon.walkStop()
				else if (e.key === ng.config.hotkey.walkBackward) dungeon.walkStop()
			}
		}
	}
})(_, $, parseInt, getComputedStyle);



