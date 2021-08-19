var patch;
!function($, _, TweenMax, undefined) {
	patch = {
		open,
		close,
	}
	const notes = [
		{text: 'Version 0.3.5', date: 'August 18, 2021', isHeader: true},
		{text: "Animated the guild flags in town."},

		{text: 'Version 0.3.5', date: 'August 18, 2021', isHeader: true},
		{text: "CRU's Zealous Slam tooltip no longer indicates that it has a cooldown."},
		{text: "Finished the waterfall animation in town for all times of day."},
		{text: "The auto attack now properly turns off immediately when combat ends."},
		{text: "Added rain and lightning environment effects to the town."},
		{text: "Improved the mob respawn multiplayer logic which maybe prevented some bugs 🤷‍"},

		{text: 'Version 0.3.4', date: 'August 16, 2021', isHeader: true},
		{text: "Added new server-side checks that make cheating much more difficult."},
		{text: "Added ambient sound to town."},

		{text: 'Version 0.3.3', date: 'August 15, 2021', isHeader: true},
		{text: "The blacksmith's furnace in town is now animated."},
		{text: "Fixed the town's afternoon clouds so they wrap properly."},
		{text: "Fixed the displayed hotkey for Character Sheet and Inventory. It now shows the proper hotkey instead of the keyCode number."},
		{text: "The town no longer continues animating while you're in a dungeon."},
		{text: "Added a brief loading screen to help prevent asset-related bugs upon zoning into a dungeon. There are also some terrible loading screen tips that probably lie to you about how the game works."},
		{text: "CLR's Smite bonus now works correctly with Deliverance only."},
		{text: "CLR's cone targeting now works correctly with Sacred Revelation and Condemnation."},
		{text: "Fixed several CLR and DRU spells that hit your current target instead of the target when you started casting."},
		{text: "Most beneficial spells such as buffs or heals will now automatically target yourself when you have no target or when targeting a mob."},
		{text: "Made the targeting much more helpful. The targeting system will attempt to automatically target a mob for a mob-targeting spell and will attempt to target yourself for a player-targeting spell. This targeting assistance will only happen when you're targeting an invalid target for that given spell."},
		{text: "I think MNK's occasional Spirit Barrier bug was fixed. Probably!"},


		{text: 'Version 0.3.2', date: 'August 14, 2021', isHeader: true},
		{text: "Fixed the academy's train button. It's visible now!"},
		{text: "Adjusted the town windows' font size down a bit."},
		{text: "Adjusted the town windows' position down a bit so it fits into all resolutions⁉"},
		{text: "Updated the style of the town's chat header and modals (delete character)."},



		{text: 'Version 0.3.1', date: 'August 14, 2021', isHeader: true},
		{text: "Completely redesigned the title screen! WOW! 🤯"},
		{text: "Completely redesigned the town scene! WOW! 🤯💥💣🧨"},
		{text: "The town menu screens are completely different now. I'm still waiting on two assets for the Tavern and the Academy, so those are using placeholders for now."},
		{text: "TONS of UI stuff was reworked."},
		{text: "Fixed a bug with DRU Moss Breath. It now only targets your target as intended."},
		{text: "Fixed the positioning of spells in relation to player cards."},
		{text: "ESC will now cancel setting a new hotkey in the Options."},
		{text: "Parties will no longer automatically disband after returning to town."},
		{text: "Deleted guild members will now also be removed from any guild they were a member of."},
		{text: "Mobs and players can no longer dodge, parry, or riposte while stunned."},
		{text: "Fixed the appearance of shoulder items. This fix is not retroactive."},
		{text: "You can no longer login twice with the same character. It will now boot you to the title screen."},
		{text: "Town NPCs can no longer sell rare items."},
		{text: "Town NPCs can no longer sell rings, amulets, or charms."},
		{text: "Several DRU cone spells had their spread widened."},
		{text: "Fixed MANY cases where a player could cast a spell with delayed damage and then inflict damage values from spells that were cast subsequently."},
		{text: "Strength and dexterity now both affect your attack rating."},
		{text: "Updated the map's Center Map icon."},
		{text: "Fixed the infamous \"toxic sports\" tooltip."},
		{text: "Fixed canceling spells with the Close Windows hotkey."},
		{text: "The chat input can now be blurred with Enter when the input value is blank."},
		{text: "Your potion panel now properly updates after trading a potion."},
		{text: "Updated the room cleared icon."},
		{text: "There is now a slight delay until you can walk when returning to a hallway from combat."},
		{text: "Improved dynamic styling of damage value on the character sheet."},
		{text: "The infamous misplaced room clear map icon has been fixed. Probably."},
		{text: "Completely re-designed the town windows to be much larger and features amazing artwork of each NPC."},
		{text: "Using new assets throughout the user interface. WOW!"},
		{text: "Improved form handling for the guild create form."},
		{text: "Made some uhhh... adjustments... uh, to the uh, local save data. Should work great now!"},

		{text: 'Version 0.2.12', date: 'July 31, 2021', isHeader: true},
		{text: "Nerfed mobs' Magic Missile damage a bit."},
		{text: "Disabled the single thread node-webkit mode which seemed to cause more harm than good."},
		{text: "Made slight adjustments to the player card design."},

		{text: 'Version 0.2.11', date: 'July 31, 2021', isHeader: true},
		{text: "If you're targeting a player when you die, the border around the player card will now properly clear."},
		{text: "All classes now start with four skills unlocked. This should make it easier to experiment with classes to get an idea of what to expect."},
		{text: "ROG's Mirage Strike buff icon now properly updates the stack count when you take a physical hit."},
		{text: "Fixed a bug that caused traits to not be assigned to unique mobs."},
		{text: "Made an adjustment that might help the Steam Overlay play nice with my software. 🤞"},
		{text: "The character create input now transforms your input to make it clear that only the first letter can be capitalized."},
		{text: "Fixed a bug that caused a console error when casting a player-targetable spell on a mob."},
		{text: "BRD songs should no longer cancel if you're casting a song that isn't targeting a mob."},
		{text: "Fixed a bug that was causing certain mob skills to hit much lower than intended (often hitting for 1)."},
		{text: "Improved Smart Saving™ of character data when leveling up skills in a hallway."},
		{text: "Adjusted the layout so that you can click through that rectangular area above the inventory window when a merchant window is open."},
		{text: "The way key events are processed has been improved. For example, CAPS LOCK will no longer make all of your hotkeys stop working."},
		{text: "Added several new configurable hotkeys and broke them down by category in the options."},
		{text: "Added a Fixed Hotkeys section for non-configurable hotkeys."},
		{text: "Hitting space bar will no longer scroll any scrollable container."},
		{text: "Added ambient volume controls to the options."},
		{text: "Redesigned the Options menu a little bit."},

		{text: 'Version 0.2.10', date: 'July 28, 2021', isHeader: true},
		{text: "Fixed getting and setting of local user settings. There were a bunch of issues with my first attempt with that API. Should be much better now! 🐛🐜"},
		{text: "Fixed the camp functionality which was previously broken by my failed attempts to make things better."},

		{text: 'Version 0.2.9', date: 'July 28, 2021', isHeader: true},
		{text: "You can no longer open the Delete Character modal when you have no characters."},
		{text: "Improved the create screen by keeping the class the same if you click a race that also has that class. This makes it easier to compare classes by race."},
		{text: "Adjusted the default music and sound effect volume to 50. 🎺"},
		{text: "Full Screen mode can now go up to 3840x2160 mode. I have no idea what that will look like so have fun with that."},
		{text: "Made improvements to the local settings data which should improve the ability to save data to disk."},
		{text: "The display size should now change to your preferred display size on launch."},
		{text: "Moved the skill tooltip so that it doesn't block your potions."},

		{text: 'Version 0.2.8', date: 'July 27, 2021', isHeader: true},
		{text: "Fixed the resizing behavior of the window. Sometimes it would unintentionally resize to non-standard dimensions."},
		{text: "Threat on most Bard songs has been reduced."},
		{text: "Threat on several tank class skills has been increased."},
		{text: "MANY spells had their targeting fixed so that the spell hits the target when you started casting, not your current target."},
		{text: "Fixed a dungeon hallway bug that was causing all kinds of mis-rendering of hallway textures. They now load properly upon subsequent missions in different zones."},
		{text: "You will now see resist messages in the log when you resist a status effect."},
		{text: "Fixed a bug that caused DoT messages to appear twice."},
		{text: "Added a spell cooldown to SHD's Ravanging Plague and Decaying Doom."},
		{text: "Fixed the on death effect of Profane Spirit and buffed its damage up a bit."},
		{text: "Added a damage penalty for melee damage on higher level mobs."},
		{text: "You can no longer buff or heal dead party members. Sorry! 😎"},
		{text: "Sooo, if you die and then the rest of your party leaves, you will no longer be teleported to town while still dead. From now on the mission will be abandoned and you will revive in town."},
		{text: "Bard's Consonant Chain now debuffs healing by 50% while active on its target."},
		{text: "Bard's spirit-based songs had their duration boosted to 45 seconds."},

		{text: 'Version 0.2.7', date: 'July 27, 2021', isHeader: true},
		{text: "Reduced RNG Shimmering Orb cast time from 4 to 1.5 seconds. Increased its cooldown from 5 to 15 seconds. This will allow them to use it in combat buff more effectively."},
		{text: "Fixed the tooltips for items with double attack and dual wield properties."},
		{text: "TMP's Primeval Withering now reduces your target's healing by 65%. This gives Templars a unique ability that other classes don't have! Templars are so cool! Hype!"},
		{text: "The group experience range is now much more forgiving. You will also receive a message if someone in your party has a player whose level is too high for you to gain experience."},
		{text: "You will no longer get a Mission Abandoned message upon disbanding a party in town."},
		{text: "Fixed a bug that caused dungeon hallway textures to not update when you go to a dungeon a second time."},
		{text: "Maxed skill rows at the academy now have a gold font color."},
		{text: "Fixed a bug that allowed you to train skills at the academy earlier than intended and made slight adjustments to the levels at which you can level up each rank."},
		{text: "Reduced the amount of health that champions and unique mobs have."},
		{text: "When you change chat channels in town, you will now see a message that validates that you successfully changed channels in the chat log."},
		{text: "The chat input placeholder now indicates what channel you are sending."},
		{text: "Debuffed the power of mobs' Harm Touch and made the spell blood-based. Thus you can actually resist it to as well!"},
		{text: "Buffed the power of mobs' Magic Missile spell a little bit."},
		{text: "Mobs' riposte now has an internal 8-second cooldown."},
		{text: "Fixed a display bug that cause the mob unique and champion plates to overlap the target's level."},

		{text: 'Version 0.2.6', date: 'July 26, 2021', isHeader: true},
		{text: "Mobs were stunning way more often than intended."},

		{text: "You can now move items and destroy them during combat. Previously this was not allowed. This should make it easier to make rooms for items you want to loot during combat."},
		{text: "Fixed a bug that caused you to loot negative gold. This only affected characters with an extreme amount of gold beyond the gold limit."},
		{text: "Your inventory now properly updates with the correct amount of gold after killing a mob. There's even a fancy animation of the number up to its new value. Wow!"},

		{text: 'Version 0.2.5', date: 'July 25, 2021', isHeader: true},
		{text: "Changed the color of unique items and mobs to purple."},
		{text: "Skills now level much faster. Especially at lower levels."},
		{text: "Spells now properly indicate their ranked up spell damage in the tooltip whilst deciding to train at the academy."},
		{text: "Made an adjustment that should help prevent mis-matches between hallway mobs and the center mob you actually see."},
		{text: "Auto attack damage on the balance sheet now matches what is shown when you hover via the primary attack tooltip."},
		{text: "Fixed a bug that caused your attack rating to not work correctly if using hand-to-hand weapons. I think this was affecting Monks also?"},
		{text: "Cleaned up the list of characters that a hotkey may be bound to."},
		{text: "If a mob dies while you're casting a buff or a heal on a friendly target, your spell will no longer automatically cancel."},
		{text: "Fixed a bug where targeting party members was not automatically drawing the correct width of the target health bar."},
		{text: "Fixed the gray screen of doom. Maybe?"},
		{text: "Fixed a bug where your game would sometimes bug out if you deleted an item while walking into a new room."},
		{text: "The /help command's output was moved back to the chat log since it scrolls, again. You can also use basic filtering on it like /help group."},
		{text: "It's now totally impossible to die outside of combat from a DoT. You will soldier on with one hit point. Similarly, mobs cannot die if no party members are alive."},
		{text: "Adjusted the look and feel of the mob bars for maximum sexiness."},
		{text: "I think I fixed the 0 gold bug. Let me know if you were affected."},

		{text: 'Version 0.2.4', date: 'July 24, 2021', isHeader: true},
		{text: 'Greatly reduced the cost of all skills!'},
		{text: 'You can now click the Train button repeatedly at the academy to level up a skill multiple times in a row without re-clicking the skill.'},
		{text: 'The chat log will now report when your whisper to an offline player is not successful.'},
		{text: 'SHD\'s Astral Blade no longer has its damage type changed by spells cast immediately afterward. A few other spells were also affect by this same bug such as Druid\'s Fissure.'},
		{text: "Fixed the secondary auto attack one-hand blunt image name which was causing it to not appear."},
		{text: "Removed the element on tooltips for skills were primarily physical with a DoT side effect of an element type such as Lacerate, Widow Strike, Doom Thrust, and Tiger Strike."},
		{text: "Fixed several melee-based skills which were not getting a benefit from +added damage items."},
		{text: "Slightly reduced the skill costs again."},
		{text: "Added chat log messages when mobs hit you!"},
		{text: "Your level on your character sheet will now update if you level while your character sheet is open."},
		{text: "The maximum number of mobs that can appear on a quest is now 3. Fighting more than 3 at once will only be possible in future Party quests. Some quests will allow you to fight 9 at once."},
		{text: "Fixed a bug that caused resists on your character sheet to not update properly when you swapped items."},
		{text: "Added cooldowns to all mob heal skills and all skills that cause status effects such as stun, fear, paralyze, and silence. Mob harm touch ALSO has a cooldown across ALL mobs due to how severe its damage spike can be with multiple mobs which is a bit unfair. Now players will have a chance to react."},
		{text: "Adjusted duration of several mob skill effect durations such as Panic Strike, which only fears you for 15 seconds instead 24."},
		{text: "Adjusted WIZ's Ice Bolt cast time back up from 1.5 to 2.2. It was too fast for a spell with no cooldown."},
		{text: "The chat log no longer clears when embarking on a mission."},
		{text: "Redesigned the mob target names for level and tiers."},

		{text: 'Version 0.2.3', date: 'July 23, 2021', isHeader: true},
		{text: 'Made the unique item color a bit brighter and more distinctive.'},
		{text: 'Fixed a bug that caused champion traits to retain from fight to fight. Mob data in general is being sanitized much better from battle to battle.'},

		{text: 'Version 0.2.2', date: 'July 22, 2021', isHeader: true},
		{text: 'Reworked Trolls\' racial text on the create screen.'},
		{text: 'Fixed all races\' base resist values in accord with the new grand re-scaling of resist values.'},
		{text: 'You no longer lose your target bar when you leave a room.'},
		{text: 'Fixed assignment dual wield and double attack properties on newly rolled magic and rare items. This fix is not retroactive.'},
		{text: 'Fixed DRU\'s Branch Spirit buff. It can no longer give you infinite attack power.'},
		{text: 'Back by popular demand—we put back all of the spell cooldowns!'},

		{text: 'Version 0.2.1', date: 'July 22, 2021', isHeader: true},
		{text: 'Hitting ESC while focused on the chat input will blur it.'},
		{text: 'Added T as a chat focus hotkey.'},
		{text: 'You can now reply to whispers by simply hitting R.'},
		{text: 'Fixed a bug that caused the leaderboard to not load initially if it was previously set to a specific class filter.'},
		{text: 'Changed the party self-boot attempt to yellow instead of white.'},
		{text: 'If you attempt to quit a guild whilst not being in one, you will not get an error message.'},
		{text: 'The friends list now has a warning message to indicate its internal cooldown has not expired.'},
		{text: 'The friends list can now be used every 15 seconds (to prevent unnecessary network bloat).'},
		{text: 'Added a new admin command that enables me to boot users before an update.'},
		{text: 'Fixed RNG\'s Suppressing Volley which had an extremely wrong hit bonus.'},
		{text: 'Whilst at the academy you may now view the tooltip for your skill at the current and next level.'},
		{text: 'Three skills had their tooltips adjusted to say "ice" instead of cold damage.'},
		{text: 'Adjusted the cast time of WIZ\'s deep freeze from 3 to 2.5.'},
		{text: 'Adjusted the cast time of WIZ\'s ice bolt from 2.5 to 1.5.'},
		{text: 'Your target is no longer automatically changed when entering combat.'},
		{text: 'Fixed a bug that caused your target to show NaN and undefined in certain circumstances when you walk into a room while targeting yourself.'},
		{text: 'Heal popups for players now indicate the amount heal for all party members.'},
		{text: 'Fixed a bug that caused map room clear icons to be positioned incorrectly.'},
		{text: 'A new hotkey, z, will auto-walk.'},
		{text: 'W and S now walk while they are held down.'},
		{text: 'You can now walk by clicking and holding in the center part of the screen while in a dungeon hallway. Clicking around the edge of the screen will not work. Sometimes mis-clicks around the corners of the UI may cause you to walk accidentally.'},
		{text: 'Fixed a bug that caused the mob\'s name to continue flashing despite not actually being targeted.'},
		{text: 'Unique mob traits now appear on the target correctly.'},
		{text: 'Mob names are now colored by rarity, e.g., normal, champion, unique, etc.'},
		{text: 'Target and mob levels are now indicated as a number next to its name. The background colors of the number indicate the mob\'s "consider color" relative to your level.'},
		{text: 'Fixed a bug that prevented mobs from parrying or riposting while you were casting a spell.'},
		{text: 'Auto attack cycles are no longer paused by stun or casting. This will allow casters to make better use of their weapons in battle.'},
		{text: 'Tuned up the colors of the mob tier names. Normal mobs now have a light aqua appearance instead of white. Champions are blue. Uniques are gold. Bosses are red.'},
		{text: 'Henceforth, only bloodlusted mobs regenerate health. This should make AoE spells more effective in general.'},
		{text: 'WLK\'s Icing Death chill duration has been boosted from 6 to 20 seconds.'},
		{text: 'WIZ\'s Chain Lightning had its cast time reduced from 3.5 to 3 seconds. Its target behavior also changed from a row to a cone of up to five targets.'},
		{text: 'The targeting behavior of all cone spells has been changed so that they can hit a width of five total valid targets instead of three. This should make almost all AoE skills more effective.'},
		{text: 'Fixed a broken link to a harpy sound effect.'},
		{text: 'Your monitor will not longer attempt to maximize its size when entering 1920x1080 video mode.'},
		{text: 'Changed all mob classes\' casting rates for all skills. Only three mob classes, WAR, SHD, and CRU have the ability to Slam and it\'s at a much lower frequency.'},
		{text: 'Mob stun duration from Slam has been reduced from 3 to 2 seconds.'},
		{text: 'Stun, fear, silence, and paralyze all had their diminishing returns fixed on players. Previously the diminishing returns and the buff animations were not working as intended.'},
		{text: 'When you return to town, buffs without duration such as Mirror Images will now properly clear.'},
		{text: 'Fixed a bug that causes your inventory, bank, or character sheet to visually lock up when swapping items and then immediately closing the window.'},
		{text: 'Guilds will now delete themselves if no members exist.'},
		{text: 'Fixed a few bugs related to the guild menu in town. Sometimes you would get a text parsing error that would force you to reset.'},
		{text: 'You can no longer whisper a blank message to someone.'},
		{text: 'Changed all party member colors to more subdued colors and completely redesigned the party bars to use less horizontal space.'},
		{text: 'The Hearth button is now on the main button panel instead of on the mini-map.'},
		{text: 'Fixed a bug that caused incorrect mobs to spawn in certain circumstances when less than level 3.'},
		{text: 'The Mirror Images buff no longer affects the damage values in tooltips.'},
		{text: 'When you press space bar to close all windows it will only do so if one was actually open.'},
		{text: 'The amount of armor mobs have has been reduced. This should help melee damage classes across the board.'},
		{text: 'Many mobs have had their base resists adjusted by type. For example fungoids now have strong natural poison resistances regardless of tier.'},
		{text: 'Skills that make you invulnerable to damage now properly work against DoT spells as well.'},
		{text: 'Mob DoT spells no longer incorrectly show a popup when they do no damage.'},
		{text: 'Staves, orbs, and charms now have an associated sound effect on drop.'},
		{text: 'DRU\'s Branch Spirit now properly buffs total attack bonus by 25%.'},
		{text: 'Players are now immune to status effects such as stun and fear while invulnerable.'},
		{text: 'Life drain spells such as WLK\'s Soul Drain will now heal the same amount as damage done while feared. You may notice that fear affects all damage in a different way due to it being calculated early in the algorithm.'},
		{text: 'Adjusted quest rewards bonuses and restricted the maximum exp earned from a mob.'},
		{text: 'Added a total characters indicator on the title screen.'},
		{text: 'Made it a bit more obvious which gender you have selected on the character create screen.'},
		{text: 'CLR now has a 50% damage bonus to stunned targets with Deliverance.'},
		{text: 'Spells now have a minimum cast time of 0.5 seconds.'},
		{text: 'Spells with the minimum cast time of 0.5 seconds cannot fizzle.'},
		{text: 'Each completed cast of CLR Smite now reduces subsequent casts of Deliverance by 0.5 seconds.'},
		{text: 'The Reset and Exit Game buttons have been re-designed to be more prominent.'},
		{text: 'The inventory will open if you right-click to move an item from your bank to your inventory.'},
		{text: 'Changed all future item resists to percentage based instead of rating based. This means that 30 literally means 30% resist percentage. All of the new item resist values are now 25% of their old values. Your old resist items are now overpowered! Have fun with that!'},
		{text: 'Made a slight adjustment to how the title screen fades in. Instead of showing a blank screen it will at least load the background image.'},
		{text: 'Heals cast on mobs in a Stasis Field are now affected by its mitigation.'},
		{text: 'Fixed a bug that allows you to pick a race and a class would not be highlighted.'},
		{text: 'Leech and wraith have been significantly improved. They now work regardless of damage done, thus they are more effective with rapid-hit attacks.'},
		{text: 'Damage Taken to Mana/Spirit have both been changed. They restore resources based on how often you are hit without regard to damage.'},
		{text: 'Leech no longer affected by any buffs effects.'},
		{text: 'ENC\'s Stasis Field had its cast time reduced from 3 to 1.5 and its mitigation against players boosted roughly 50%.'},
		{text: 'ENC\'s Serene Sigil and Color Shift both had their cast times reduced to 4.5 to 4 and 3 to 1.5 respectively.'},
		{text: 'Mob generation has been changed so that only one non-normal mob can spawn per fight.'},
		{text: 'ENC Stasis Field can now be used to reduce your target\'s heal power also.'},
		{text: 'Fixed many mob-related healing bugs that caused animations to appear at the wrong locations and chat messages to indicate the incorrect healing message.'},
		{text: 'Identified items will now always cover the costs of an Identify Scroll.'},
		{text: 'ROG\'s Backstab hit bonus has been significantly increased.'},
		{text: 'ROG\'s Rising Furor buff duration has been buffed from 30 to 45 seconds.'},
		{text: 'If a a player closes the app during a trade, the trade window will now close automatically.'},
		{text: 'RNG\'s Shimmer Orb now displays its absorb values on its tooltip. You are also immune to silence while the buff is active.'},
		{text: 'Ranger skills now display the correct tooltip values when displaying bow-related skills while not equipping a bow.'},
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