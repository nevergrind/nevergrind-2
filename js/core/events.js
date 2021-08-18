(function(_, $, parseInt, getComputedStyle, undefined) {
	let key
	let keyCode

	// document events
	document.addEventListener('DOMContentLoaded', readyFn)
	const bodyFontSize = getComputedStyle(getElementById('body')).fontSize
	const skillKeyCodes = [49, 50, 51, 52, 53, 54]

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
			.on('click', '.window-select', bar.handleDisplaySizeChange)
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
			.on('focus', '#guild-input', town.handleGuildInputFocus)
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
		if (Config.isApp) return false // disable context menus
	}
	function chatInputFocus() {
		chat.hasFocus = true
	}
	function chatInputBlur() {
		chat.hasFocus = false
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
		// console.log('coords: ' +my.mouse.x +' '+ my.mouse.y)
		if (item.isDragging) item.updateCursorImgPosition()
	}
	function resize() {
		context.hide()
		context.timer.kill()
		map.applyBounds()
		windowResized()
	}

	function keydown(e) {
		if (e.originalEvent.repeat || loading.isLoading) return
		key = e.key
		keyCode = e.keyCode
		// console.info(key, keyCode, e.shiftKey, e.ctrlKey, e)
		ng.lastKey = key
		// trying to bind a new hotkey
		if (bar.hotkeyId) {
			if (keyCode === 27) {
				bar.stopListeningForHotkey()
				e.preventDefault()
				return false
			}
			let result = bar.isValidHotkey(e)
			if (result.isValid) {
				bar.setHotkey(keyCode)
			}
			else {
				if (result.reason) {
					ng.msg(result.reason, 2, undefined, COLORS.red)
				}
				else {
					// silently fail - shift etc
				}
			}
			if (isPreventDefaultKeys(key) || key === ' ') {
				e.preventDefault()
				return false
			}
			return
		}
		// console.info('e.metaKey', e.metaKey)
		if (e.altKey) {
			// ALT key functions
			return false
		}
		else if (e.ctrlKey) {
			// CTRL key functions
			if (!chat.hasFocus) {
				// no "select all" of webpage elements
				if (keyCode === 65 || keyCode === 70) { // a or f for select all?
					e.preventDefault()
				}
			}
		}
		else {
			// normal key functions
			// literally in any view
			if (keyCode === 27) { // ESC
				if (chat.inputHasFocus) {
					// do nothing... trust me - needs to go to ESC below
				}
				else if (item.dragType) item.resetDrop()
				else if (my.target >= 0) my.clearTarget()
				else {
					bar.toggleOptions()
					return false
				}
			}
			else if (keyCode === ng.config.hotkey.closeWindows) bar.optionsClose()

			if (ng.view === 'title') {
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
					if (keyCode === 27 &&
						chat.inputHasFocus) { // ESC
						const el = querySelector('#chat-input')
						el.value = ''
						el.blur()
						return false
					}
					if (chat.modeChange()) {
						// changing chat mode - matches possible mode change
						return false
					}
					// has chat focus
					if (keyCode === 38) {
						// chat focus history nav up
						if (chat.history[chat.historyIndex - 1] !== undefined) {
							var o = chat.history[--chat.historyIndex];
							query.el('#chat-input').value = o.msg;
							chat.modeChange(o);
						}
					}
					else if (keyCode === 40) {
						// chat focus history nav down
						if (chat.history.length === chat.historyIndex + 1) {
							chat.historyIndex++
							chat.clearInput()
						}
						else if (chat.history[chat.historyIndex + 1] !== undefined) {
							var o = chat.history[++chat.historyIndex]
							query.el('#chat-input').value = o.msg
							chat.modeChange(o)
						}
					}
					else if (key === 'Enter') {
						// enter
						my.name && chat.sendMsg()
					}
				}
				else {
					// always works town, dungeon and combat (non-focused)
					// ctrl+r refresh
					// console.info(key, chat.inputHasFocus)
					if (keyCode === ng.config.hotkey.reply) { // r
						chat.reply()
						return false
					}
					else if (keyCode === ng.config.hotkey.chat // t
						&& !chat.inputHasFocus) {
						chat.focusChatInput()
						return false
					}
					else if (keyCode === ng.config.hotkey.characterStats) bar.toggleCharacterStats()
					else if (keyCode === ng.config.hotkey.inventory) bar.toggleInventory()
					else if (keyCode === ng.config.hotkey.closeWindows) bar.closeAllWindows()
				}

				if (ng.view === 'town') {
					// town specific
					if (!chat.hasFocus) {
						// if no aside, focus on chat input first
						if (chat.focusKeys.includes(keyCode)) {
							chat.focusChatInput()
						}
					}
					else {
						if (guild.hasFocus && key === 'Enter') {
							guild.create()
						}
					}
				}
				else {
					// dungeon & combat specific
					if (!chat.hasFocus) {
						if (!e.shiftKey && !e.ctrlKey) {
							// no shift or ctrl
							if (chat.focusKeys.includes(keyCode)) chat.focusChatInput()
							else if (keyCode === ng.config.hotkey.autoWalk) dungeon.walkForward()
							else if (keyCode === ng.config.hotkey.walkForward) dungeon.walkForward()
							else if (keyCode === ng.config.hotkey.walkBackward) dungeon.walkBackward()
							else if (keyCode === ng.config.hotkey.closeWindows) spell.cancelSpell()
							else if (keyCode === ng.config.hotkey.targetPlayer1) my.partyTarget(0)
							else if (keyCode === ng.config.hotkey.targetPlayer2) my.partyTarget(1)
							else if (keyCode === ng.config.hotkey.targetPlayer3) my.partyTarget(2)
							else if (keyCode === ng.config.hotkey.targetPlayer4) my.partyTarget(3)
							else if (keyCode === ng.config.hotkey.targetPlayer5) my.partyTarget(4)
							else if (skillKeyCodes.includes(keyCode)) button.triggerSkill(+key - 1)
						}
						else if (e.shiftKey && !e.ctrlKey) {
							// shift
							if (keyCode === 49) button.triggerSkill(6)
							else if (keyCode === 50) button.triggerSkill(7)
							else if (keyCode === 51) button.triggerSkill(8)
							else if (keyCode === 52) button.triggerSkill(9)
							else if (keyCode === 53) button.triggerSkill(10)
							else if (keyCode === 54) button.triggerSkill(11)
						}
						else if (!e.shiftKey && e.ctrlKey) {
							// ctrl
						}
					}

					if (ng.view === 'battle') {
						if (!chat.hasFocus) {
							if (keyCode === ng.config.hotkey.nextTarget) my.tabTarget(e)
							else if (keyCode === ng.config.hotkey.autoAttack) combat.toggleAutoAttack()
						}
					}
				}
			}
		}

		// prevent default behaviors in all scenes
		if (isPreventDefaultKeys(key)) {
			e.preventDefault()
			return false
		}
	}

	const preventDefaultKeys = [
		'Tab', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8'
	]
	function isPreventDefaultKeys(key) {
		return preventDefaultKeys.includes(key)
	}

	function keyup(e) {
		// if (e.originalEvent.repeat) return
		if (e.metaKey) {
			/*e.preventDefault()
			return false*/
		}
		if (ng.view === 'dungeon') {
			if (!map.inRoom) {
				if (e.keyCode === ng.config.hotkey.walkForward) dungeon.walkStop()
				else if (e.keyCode === ng.config.hotkey.walkBackward) dungeon.walkStop()
			}
		}
	}
})(_, $, parseInt, getComputedStyle);



