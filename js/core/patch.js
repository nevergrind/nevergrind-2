var patch;
!function($, _, TweenMax, undefined) {
	patch = {
		open,
		close,
	}
	const notes = [
		{text: 'Version 0.1.5', date: 'July 15, 2021', isHeader: true},
		{text: 'Auto-walk in dungeon hallways is now in the game by design. You can also left-click to toggle walking forward.'},
		{text: 'Removed the short-lived multi-key restriction, so you should be able to cast while walking again.'},
		{text: 'Fixed the /promote command which allows you to change the party leader in town.'},
		{text: 'Fixed a bug that sometimes caused a mob to drop more loot than intended.'},
		{text: 'The /who command now has a sensible cooldown of 5 seconds.'},
		{text: 'The who parse is now much smarter and can parse for two-word values such as half elf or shadow knight.'},
		{text: 'Unique mobs now drop 2 items instead of 1. We\'ll see how that feels for a while.'},
		{text: 'You can no longer accidentally consume potions in town.'},
		{text: 'Fixed a sound effect reference for WIZ\'s Frozen Barrier.'},
		{text: 'You can now identify items in a bank slot using a scroll from your inventory.'},
		{text: 'SHD\'s Life Tap and Vampiric Feast are now blood damage type instead of arcane.'},
		{text: 'WLK\'s Drain Soul and Blood Fire are now blood damage type instead of arcane and fire respectively.'},
		{text: 'Many WLK spells have had their cast time reduced.'},
		{text: 'WLK\'s Lich Form now adds knockback protection and reduces all physical damage and increases by rank.'},
		{text: 'Many buff spells that require an update to the maximum resource values have been fixed including CLR\'s Seal of Redemption and Zealous Resolve, DRU\'s Branch Spirit, TMP\'s Conviction and Celestial Frenzy, WLK\'s Vampiric Allure, and ENC\'s Clarity.'},
		{text: 'The center popup text now comes in various colors depending on what kind of message it is.'},
		{text: 'You will now automatically blur the chat input after sending a message.'},
		{text: 'All skills and spells now have a much slower ramp-up in resource requirements at lower levels.'},
		{text: 'Made many adjustments to skill threat. All healing skills now cause much less threat and healing friends in combat should be much more manageable. Threat was also adjusted on many other skills, so be sure to check out the new threat values.'},
		{text: 'Silence and knockback values are now highlighted on skill tooltips.'},
		{text: 'Increased the respawn timer for hallway mobs.'},
		{text: 'The potion cooldown is actually 15 seconds. For real this time!'},
		{text: 'Regular mob level should now be restricted by your current quest level. Only uniques and bosses can break this rule.'},
		{text: 'Boosted beast item drop rate slightly.'},
		{text: 'Fixed a bug that made low-level mobs have max HP that is way too low.'},
		{text: 'WAR, SHD, and CRU all start with a shield now.'},
		{text: ''},

		{text: 'Version 0.1.4', date: 'July 13, 2021', isHeader: true},
		{text: 'Added a date to the patch notes.'},
		{text: 'You can now open the developer console by hitting F12 and view errors in the console.'},
		{text: 'You can no longer use potions in town or while dead.'},
		{text: 'Keydown events are handled differently now. Glitched auto-walking in hallways shouldn\'t be possible anymore. You also stop walking when you blur the window.'},
		{text: 'Fixed town text that said to buy a scroll from the merchant to the apothecary instead.'},
		{text: 'Shaman\'s Boreal Talisman now properly updates their maximum health value.'},
		{text: 'NPC crusaders can now only use Lay Hands once.'},
		{text: 'Removed B as a default bank hotkey.'},
		{text: 'Fixed a bug that caused the window size to not resize correctly in some cases.'},
		{text: 'Greatly improved the "intelligence" of the chat input\'s focus, blur, enter, and leave behavior.'},
		{text: 'Updated the room combat background, hallway combat background, and the hallway textures in Fahlnir Citadel.'},
		{text: 'You can now right-click an item in the bank to move it to your inventory.'},
		{text: 'You can no longer use expendable items in your bank.'},
		{text: 'Charms can no longer have the Archery skill property.'},
		{text: 'Fixed Celestial Frenzy\'s casting message.'},
		{text: 'Reduced the potion cooldown from 60 to 15.'},
		{text: 'Boosted the effectiveness of all potions.'},
		{text: 'Boosted out-of-combat health and mana regeneration by a large amount.'},
		{text: 'Mobs with Soul Drain and Spirit Drain traits now drain far less mana and spirit than they did previously.'},
		{text: '<i>Probably</i> fixed a bug where subsequent mobs after a champion would also be a mob with the same trait.'},
		{text: 'Skill tooltips now indicate a cone of three targets instead of saying "up to three targets".'},
		{text: 'Beast-type mobs now drop loot more often than other mob types which offsets the fact that they don\'t drop gold.'},
		{text: 'You can now get exp from a much wider ranger of mobs. This is especially true at lower levels.'},
		{text: 'SK Crescent Cleave and WAR Furious Slash now trigger the global cooldown.'},
		{text: 'RNG Burning Embers, Faerie Flame, and SHD Mark of Remphan spells now have a short cooldown.'},
		{text: 'Tooltips now read "1 minute and 30 seconds" instead of "1 minute, 30 seconds".'},
		{text: 'Gave unique items a more distinctive border in the inventory.'},
		{text: 'Reduced WIZ Frozen Barrier\'s cooldown from 90 to 60 seconds.'},
		{text: 'Fixed hobgoblins\' "enter combat" sound effect.'},
		{text: 'Mobs now have less health than before.'},
		{text: 'Version 0.1.3', date: 'July 12, 2021', isHeader: true},
		{text: 'Added a new patch notes feature so players can learn about what has changed!'},
		{text: 'Made spell "not ready" messages more obvious such as when you try to cast a spell without a target. The error popup message is now slightly animated. Many messages that went to the log, now go to the popup instead to avoid excessive spam'},
		{text: 'Fixed a bug that caused a boss to spawn multiple times after you already defeated the boss.'},
		{text: 'NPC Harm Touch skill was nerfed. It was doing way more damage than intended.'},
		{text: 'All mob skills and spells have had their values re-scaled by level. All skills, including heals, will be weaker at low levels and stronger at higher levels. This fix made NPC skills like harm touch and shaman\'s mystical glow more balanced at lower levels.'},
		{text: 'The leaderboard now updates in real-time and the leaderboard tabs no longer disappear after returning from town.'},
		{text: 'Each party member now has a hover tooltip indicating their level and class which makes it easier to quickly determine party composition.'},
		{text: 'Removed a fake news tip in the tavern that claimed gold occupied inventory space.'},
		{text: 'The /help command now opens Chat Commands text in the Options menu.'},
		{text: 'The boss room no longer has the wrong map icon in some circumstances.'},
		{text: 'Maybe fixed the duplicate town chat message bug when returning from town.'},
		{text: 'The map now sends out a single red pulse when you hit a dead-end room with no new rooms revealed.'},
		{text: 'The guild member table now scrolls properly.'},
		{text: 'The guild hall table now shows the short-hand version of class names to make it easier to squeeze everything on one line.'},
		{text: 'It\'s no longer possible for mobs to heal themselves above their max health value.'},
		{text: 'Templar\'s Conviction now properly adjusts your spirit regeneration.'},
		{text: 'Added tooltips to the character creation screen for each attribute.'},
		{text: 'Wisdom now affects your maximum spirit value in addition to charisma.'},
		{text: 'Boosted the sale values for all items that need to be identified. Identified items will always cover the cost of an identification scroll.'},
		{text: 'Rings, amulets, and charms now sell for more value than before.'},
		{text: 'Added new assets for Riven Grotto including room combat background, hallway combat background, and hallway textures.'},
		{text: 'Made a slight adjustment to how soon the player can start walking after loading a hallway when leaving a room you just cleared.'},
		{text: 'Beast type mobs no longer drop gold.'},
		{text: 'Leaving or entering rooms no longer resets your map scaling to the default making it easier to play with your map zoomed in or out.'},
	]

	$('#version').on('click', open)
	$('body').on('mouseenter', '.popover-icons', bar.showBarMenuPopover)
		.on('mousemove', '.popover-icons', popover.setPosition)
		.on('mouseleave', '.popover-icons', popover.hide)
	const $patchNotes = querySelector('#patch-notes')
	const $patchNotesContent = querySelector('#patch-notes-content')

	///////////////////////////////////////////
	function open() {
		let html = ''
		let listStarted = false
		notes.forEach(note => {
			if (note.isHeader) {
				if (listStarted) {
					html += '</ul>'
				}
				html += '<div class="patch-note patch-note-header">'+ note.text +' - ' + note.date +'</div>'
				html += '<ul>'
				listStarted = true
			}
			else {
				if (note.text) {
					html += '<li class="patch-note">'+ note.text +'</li>'
				}
			}
		})
		html += '</ul>'
		$patchNotes.style.display = 'flex'
		$patchNotesContent.innerHTML = html
		audio.playSound('click-4')
	}
	function close() {
		$patchNotes.style.display = 'none'
	}
}($, _, TweenMax);