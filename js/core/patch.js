var patch;
!function($, _, TweenMax, undefined) {
	patch = {
		open,
		close,
	}
	const notes = [
		{text: 'Version 0.1.3', isHeader: true},
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
		{text: ''},
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
				html += '<div class="patch-note patch-note-header">'+ note.text +'</div>'
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