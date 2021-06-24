// audio.js
var tavern;
!function($, _) {
	tavern = {
		activeTab: 'tavern-missions',
		html: '',
		leaders: {
			ALL: void 0,
			[JOB.WARRIOR]: void 0,
			[JOB.CRUSADER]: void 0,
			[JOB.SHADOW_KNIGHT]: void 0,
			[JOB.MONK]: void 0,
			[JOB.ROGUE]: void 0,
			[JOB.RANGER]: void 0,
			[JOB.BARD]: void 0,
			[JOB.DRUID]: void 0,
			[JOB.CLERIC]: void 0,
			[JOB.SHAMAN]: void 0,
			[JOB.WARLOCK]: void 0,
			[JOB.ENCHANTER]: void 0,
			[JOB.TEMPLAR]: void 0,
			[JOB.WIZARD]: void 0,
		},
		getBodyHtml,
		init,
	}
	var key, str, html, el, row, index, avatar

	let selectedLeaderboard = 'ALL'
	let tips = {}

	$('#root-various')
		.on('click', '.tavern-tabs', handleClickTab)
		.on('click', '.tavern-jobs', handleClickJob)
		.on('click', '.tavern-tips', handleClickTips)
	///////////////////////////////////////////
	function init() {
		tips = {
			races: 'Aside from their starting attributes, each race also has a few passive traits that make them unique. Aside from their starting attributes, each race also has a few passive traits that make them unique. Aside from their starting attributes, each race also has passive traits that make them unique. Each race has their own strengths! They all seem quite capable to me, but some maintain a strong preference for certain races for one reason or another!',
			classes: 'There are 14 classes in the game, each with their own specialties. You can group them into four categories: tanks, healers, physical damage, magical damage, and utility. Druids, clerics, and shaman are healers. Warriors, crusaders, and shadowknights are tanks. Monks, rogues, and rangers excel at physical damage. Warlocks, summoners, and wizards are the masters of magic damage. Bards and enchanters are utility classes. They act as "force multipliers" by using skills that make everyone else better. In any case, it is a good idea to focus on the skills that each class excels at! A glance at your Passive Skills on the Character Sheet will give you a general idea what type of skills excels at. Visit the academy to learn more about your skills and to train them to higher levels.',
			potions: 'Potions are a great way to extend your health, mana, and spirit whilst venturing forth on sundry missions outside of the castle walls. Death is rather unpleasant, so you would be wise to stuff your bags at the merchant or the apothecary before heading out on a mission. Be wary that they are not free, so it would be wise to use as few potions as possible, lest you squander your gold. Inventory space is also tight, so you will need to leave room in your bags for items you find along the way.',
			parties: 'Parties are a great way to assure survival and take on greater challenges. There is more safety in numbers! You can bring as many as five other adventurers along in a party. Send other players invites to get the party started! You can also add them to your friend list if you would like to play with them later! Maybe even form your own guild! Try typing /help party for a complete list of party commands.',
			chat: 'There is a robust chat system that you can use whilst in Vandamor. There are dedicated channels for town, party, and even your guild (if applicable). While in town, you can change channels to any channel name using commands in the chat module. Create a private channel and send your friends a private message to have them join you! Each chat room in town even features presence detection so that it\'s easy to see who can see your messages. Chat messages do not retain history, so you must be present in order to see any chat messages. Try typing /help to see a complete list of commands!',
			friends: 'You never know who you\'ll meet in the world of Vandamor. It ranges from the good, bad, and the ugly! When you meet someone that you want to play with again, add them to your friends list and you will receive notifications when they come online! Try typing /help friend to see all friend commands!',
			ignore: 'Some adventurers out there may become a nuisance. Thankfully you can ignore them in your chat module with an ignore command. Try using /help ignore for a complete list of commands.',
			inventory: 'Your inventory has 16 slots for items that you would like to carry. Items, potions, and even gold will take up valuable inventory space. Be mindful of what treasures you loot since you will run out of bag space quickly!',
			missions: 'Edenburg\'s King has a variety of missions, from the trivial to the impossible, for adventurers such as yourself. There is a curious amount of danger afoot outside of our castle walls. Some days it feels as though we are under siege. Thanks to brave adventurers like yourself, '+ my.name +', we have been able to keep our supply routes open to neighboring cities.',
			academy: 'At the academy you can train your spells or skills as you level up. Both warriors and wizards alike will find specialists ready to transfer their specialized knowledge to students of warfare. The training is taxpayer subsidized by the King\'s Warfare Chancellory, though it will still cost you a hefty amount of gold to be trained as independent soldiers of fortune seeking gold and glory under the banner of the King.',
			merchant: 'The merchant carries the widest selection of items among all stores in Edenburg, though it is the only store that sells leather armor. Aside from cloth, mail, and plate armor, the merchant sells all equipment sold at the apothecary and the blacksmith. This could make it more difficult to find specific items you are looking for, but it\'s not a bad idea to check what the merchant has in stock that day.',
			apothecary: 'The apothecary sells potions and a variety of goods designed primarily for spellcasters. It is the only store where you can purchase cloth armor. They also sell amulets, rings, charms, focus items, staves, and cloaks.',
			blacksmith: 'They blacksmith is the only place where you can buy mail and plate armor in Edenburg. Additionally, they also offer a great selection of weapons including shields, swords, maces, bows, and daggers. It\'s certainly the place to go if you want to find a new weapon for your personal armory!',
			bank: 'The bank is where you can store items for use later by you or by any other character on your account. Space in Edenburg\'s bank is limited, but it may be expanded for a modest fee.',
			guild: 'The guild hall is where you can register your new guild or check on the status of your current guild. Guilds have their own communication channel and allow for management of a guild roster. Try the /help guild command for more information about guild commands.',
			health: 'The health resource is the basic unit that sustains life. When you run out of health, you will die. Death should be avoided at all costs because it incurs penalties on your experience bar.',
			mana: 'Mana is a skill resource used for a variety of spells. In general it is used for non-healing spells. Evocation-based skills tend to be the most mana heavy, while alteration-based skills tend to use very little. Conjuration-based skills tend to use a combination of mana and spirit.',
			spirit: 'Spirit is another skill resource used for a variety of spells. In general, it is required for spells that restore health. For that reason, healers will be particularly interested in having high spirit levels. Alteration-based spells tend to use the most spirit. Conjuration-based spells tend to use a balance of mana and spirit.',
			experience: 'Experience is earned in combat. After you earn enough experience your level will increase. Earning experience is important if you want to become a powerful '+ my.jobLong +'! When you level your passive skill caps increase along with your resource caps. When you hit certain levels you can also learn new skills and spells at the academy.',
			death: 'Death should be avoided at all costs! You will lose some experience points when you die, though you will never lose your level. Try to avoid missions that are too difficult and bring other adventurers with you! There is more safety in numbers.',
			passiveSkills: 'Each class has different passive skills, such as piercing, archery, riposte, and evocation. And every class has different skill caps. You can generally tell how good a class is at each skill by checking how much the skill cap increases each time you level up. The most it can possibly increase per level is five.',
			combatSkills: 'Each class starts with a single combat skill or spell. Combat skills are trained at the academy. You will need to acquire gold in order to train these skills. Training your skills to the highest levels can be quite prohibitive! Mastery is not cheap!',
			monsterTypes: 'There are seven different monster types, though some believe that there are more. The seven types are humanoids, beasts, undead, giants, mystical, dragonkin, and demons. The monster type can reveal strengths or weaknesses in terms of resistances. One example is that undead are known to be weak against blunt weapons. If you\'re venturing into a dungeon packed with undead creatures, arming yourself with blunt weapons is a great idea!',
			humanoids: 'Humanoids are bipedal creatures like... humans! They are human-like, but perhaps not quite human. Humans are also humanoids, of course! Every playable race in Nevergrind Online is a humanoid. It\'s a humanoid\'s world and we\'re just living in it.',
			beasts: 'Beasts are wild animals that you would typically find in the forested regions of Vandamor. If you see it at the zoo or on a safari, it\'s probably a beast. Lions, tigers, bears, elephants—and even rhinos!',
			undead: 'Undead creatures are reanimated humanoids that have returned from the realm of the dead for unknown reasons. Some believe that they are back to settle old debts or to torment somebody in particular. Others believe they are controlled by dark, sinister forces from the nether world. I\'m not sure what to think about it. I never see them in the city and I prefer to keep it that way!',
			giants: 'Giants are humanoids of extraordinary height and strength. It is speculated that their strength and spiritual essence are magical or perhaps even divine. For a long time it was rumored that they were completely eradicated, but it seems that their numbers have been bolstered in recent generations. More and more adventurers are returning with stories of them being sighted in greater numbers.',
			mystical: 'Mystical creatures are other-worldly creatures of supernatural origins. The royal scribes\' latest concensus deems them "not of this world", from another dimension, or a result of sorcery. Their actual origin story is a mystery, though it is believed that dark spiritual forces are at work to merge our world with a parallel world full of mystical creatures for nefarious purposes.',
			dragonkin: 'The dragonkin are just that—kin of the dragons. The King believes that the serpents of old, the celestial dragons, have return from their 1,000-year slumber to unleash havoc on our world once again. The dragons are not of this world. In ancient times, Dragons travelled throughout the chambers of the sky, looking down on our world, waiting for their moment to unleash chaos in our world. In recent times it seems that the prophecies are all coming true. The dragons have unleashed their agents of chaos and now we are forced to live huddled inside of walled cities to survive.',
			demons: 'Demons are servants of the dragonkin. You are much more likely to encounter a demon than an actual dragon. They are spiritually manifested entities that walk, live, and breathe on our terrestrial plane. They have complete allegiance to the dragons they serve and only take orders from them. Some consider demons servants or simply dark messengers, though both would seem applicable. Demons thirst for fear and chaos—it is the air that they breathe.',
			cooldowns: 'Some skills are limited by cooldowns, a time-based restriction on how often you can use the skill. Cooldowns prevent you from using the same skill repeatedly.',
			resistances: 'There are six different spell types: blood, poison, arcane, lightning, fire, and ice. Spells may be any of these six types. Note that there are some exceptions to this rule! Some spells may actually be considered physical damage. Physical damage can also be resisted by armor. Some items may even have a Physical Resistance property! In any case, physical damage is not considered to be spell damage.',
			spellDamage: 'The power of your spells is governed by properties such as intelligence, added spell damage, and enhanced spell damage. Other factors such as dexterity and critical hit can help you do more damage, too!',
			attack: 'Your attack rating is the overall measure of the proficiency of your melee attacks. It determines both the damage and the chance to hit. However, many other properties such as strength, dexterity, offense, and weapon skill affect your attack rating.',
			strength: 'Strength governs the power of your melee attacks. Extraordinary strength allows one to break the unbreakable.',
			stamina: 'Stamina determines your maximum health and your health regeneration rate. Stamina measures your toughness and overall resilience in combat.',
			agility: 'Agility affects your ability to dodge and your natural armor. Agility measures your natural ability to balance and maneuver one\'s self.',
			dexterity: 'Dexterity improves your parry and riposte skills, as well as the critical hit rate for melee and spells. Dexterity is the measure of your deft precision and sense of timing and coordination.',
			wisdom: 'Wisdom boosts your maximum spirit, spirit regeneration and the power of conjuration-based spells. Strong wisdom provides the discernment needed to make prudent choices with all manners of spellcraft.',
			intelligence: 'Intelligence boosts your maximum mana, mana regeneration, and the power of evocation-based spells. High intelligence allows you to solve problems in simple ways that seem complicated to others.',
			charisma: 'Charisma boosts the power of alteration-based spells. Adventurers with high charisma seem to manipulate the fabric of reality around them whichever way they go.',
			resources: 'There are three types of resources: health, mana, and spirit. Only health is required, but all of them can help you succeed in battle. You can use potions to keep your resources full, but it will cost you more gold along your journey.',
			leech: 'Items with leech properties help you recover a small amount of health from each melee attack. This can be a great way to boost your survivability on the battlefield.',
			wraith: 'Items with wraith properties allow you to recover mana with each successful melee attack.',
			spellDamageMelee: 'Some items add elemental damage to your weapons. These do not benefit from strength, attack, or anything else. They add elemental damage and are reduced by your target\'s resistances.',
			block: 'Blocking is an important defensive technique that is important for everyone, but especially for tank classes. When you are wearing a shield, you will block a percentage of attacks. Block reduces the damage of an attack to the minimum possible value. For example, physical attacks cannot be reduced more than 75%. If you are hit for 100 damage, a successful block would reduce it to 25 damage.',
			mitigation: 'Physical and magical mitigation reduce all damage received for each type. These item properties are great for surviving attacks that do a high number of small hits. Mitigation is subtracted before armor or resistances are calculated, so it is not effective against powerful attacks. These mitigation properties are most effective against high-frequency low-damage attacks.',
			enhanceSpellDamage: 'There are item properties that enhance all spell damage of each type. For example, you may find a staff with +3% to All Fire Damage. These are very powerful attributes that boost the damage of your spells. Note that "Added Spell Damage" is added after these percentage increases.',
			resistEffects: 'There are four different effects: paralyze, fear, stun, and silence. Paralyze locks out your ability to use any melee attacks. Fear induces a panic in your mind, rendering you unable to use any skills or spells, though you can continue to use basic attacks. Stuns limit your ability to do anything, though these effects tend to have a shorter duration. Silence limits your ability to cast any spells. Your resistance to any effect can not go higher than 50%.',
			//reduceHealing: 'Reduced healing is a special property that reduces your target\'s ability to heal themselves. Any melee attack will reduce your target\'s ability to heal themselves.',
			//restInPeace: 'Rest in peace is a powerful property that prevents a mob from being resurrected in combat. Some monsters may attempt to resurrect the fallen in combat. This will prevent that from ever happening.',
			//slowsTarget: 'An item that slows your target will slow their entire attack cycle down. This is a powerful magical property that is exceedingly rare.',
			reduceTargetArmor: 'Reduce target armor corrodes your target\'s armor lower and lower until it is eventually zero. This makes it much easier to boost your party\'s physical damage as the fight goes on.',
			ignoreTargetArmor: 'Ignore target armor allows you to pierce your target\'s armor with every melee attack, though this confers no benefit to your allies. This will only apply to your own melee attacks.',
			resourcesOnKill: 'You can regain resources after slaying each monster. Health, mana, and spirit can all be recovered each time a monster dies. You do not have to strike the killing blow in order to benefit from this effect.',
		}
	}

	function getBodyHtml() {
		str =
		'<div id="various-body" class="flex-row flex-max">' +
			'<div class="flex-column flex-max" style="margin: .1rem .2rem">' +
				'<div id="tavern-tab-wrap" class="flex-row" style="border-bottom: 1px solid #025;">'+
					'<div id="tavern-missions" class="tavern-tabs active">Missions</div>' +
					'<div id="tavern-tips" class="tavern-tabs">Tips</div>' +
					'<div id="tavern-leaderboard" class="tavern-tabs">Leaderboard</div>' +
				'</div>' +
				'<div id="tavern-body">'+
					mission.getMissionBodyHtml() +
				'</div>' +
			'</div>' +
		'</div>'
		return str
	}
	function handleClickTab() {
		if (this.id === tavern.activeTab) return;
		for (el of querySelectorAll('.tavern-tabs')) {
			el.classList.remove('active')
		}
		this.classList.add('active')
		tavern.activeTab = this.id
		avatar = ''

		if (tavern.activeTab === 'tavern-missions') {
			html = mission.getMissionBodyHtml()
			avatar = 'seraph-male-3'
			ng.splitText('various-description', 'The King has requested the services of brave adventurers like yourself to complete missions in defense of our interests. The chaos grows stronger with each passing day. Make haste and vanquish those who seek to destroy our way of life!')
		}
		else if (tavern.activeTab === 'tavern-tips') {
			ng.splitText('various-description', 'My knowledge is limited, but I am happy to offer my advice on a variety of topics. What topic interests you?')
			html = tipHtml()
			avatar = 'dark-elf-female-0'
		}
		else if (tavern.activeTab === 'tavern-leaderboard') {
			ng.splitText('various-description', 'Edenburg\'s royal scribes do their best to maintain an updated list of the most accomplished adventurers in the Kingdom. We maintain an overall list and a separate list by class.')
			html = leaderboardHtml()
			avatar = 'human-female-3'
			if (!tavern.leaders[selectedLeaderboard]) {
				getLeaders()
			}
		}
		/*ng.splitText('various-description', 'The King has ordered that we carefully track all weapons and armor in the Kingdom. These records are public knowledge and may be reviewed for legal or educational purposes.')*/
		setDescriptionStyle()
		querySelector('#town-avatar').src = 'images/avatars/' + avatar + '.png'
		querySelector('#tavern-body').innerHTML = html
		audio.playSound('click-3')
	}

	function handleClickTips(event) {
		key = _.camelCase(_.pick(event.currentTarget.dataset, KEYS.ID).id)
		setDescriptionStyle()
		typeof tips[key] === 'string' && ng.splitText('various-description', tips[key])
		audio.playSound('click-2')
	}
	function setDescriptionStyle() {
		querySelector('#various-description').scrollTop = 0
	}

	function tipHtml() {
		html = '<div id="tavern-tip-wrap" class="flex-column flex-max">' +
			'<div class="tavern-tip-header text-shadow2">General</div>' +
			'<div data-id="Races" class="tavern-tips">Races</div>' +
			'<div data-id="Classes" class="tavern-tips">Classes</div>' +
			'<div data-id="Potions" class="tavern-tips">Potions</div>' +
			'<div data-id="Parties" class="tavern-tips">Parties</div>' +
			'<div data-id="Chat" class="tavern-tips">Chat</div>' +
			'<div data-id="Friends" class="tavern-tips">Friends</div>' +
			'<div data-id="Ignore" class="tavern-tips">Ignore</div>' +
			'<div data-id="Inventory" class="tavern-tips">Inventory</div>' +
			'<div class="tavern-tip-header text-shadow2">Town</div>' +
			'<div data-id="Missions" class="tavern-tips">Missions</div>' +
			'<div data-id="Academy" class="tavern-tips">Academy</div>' +
			'<div data-id="Merchant" class="tavern-tips">Merchant</div>' +
			'<div data-id="Apothecary" class="tavern-tips">Apothecary</div>' +
			'<div data-id="Blacksmith" class="tavern-tips">Blacksmith</div>' +
			'<div data-id="Bank" class="tavern-tips">Bank</div>' +
			'<div data-id="Guild" class="tavern-tips">Guild</div>' +
			'<div class="tavern-tip-header text-shadow2">Combat</div>' +
			'<div data-id="Health" class="tavern-tips">Health</div>' +
			'<div data-id="Mana" class="tavern-tips">Mana</div>' +
			'<div data-id="Spirit" class="tavern-tips">Spirit</div>' +
			'<div data-id="Experience" class="tavern-tips">Experience</div>' +
			'<div data-id="Death" class="tavern-tips">Death</div>' +
			'<div data-id="Passive Skills" class="tavern-tips">Passive Skills</div>' +
			'<div data-id="Combat Skills" class="tavern-tips">Combat Skills</div>' +
			'<div data-id="Monster Types" class="tavern-tips">Monster Types</div>' +
			'<div data-id="Humanoids" class="tavern-tips">Humanoids</div>' +
			'<div data-id="Beasts" class="tavern-tips">Beasts</div>' +
			'<div data-id="Undead" class="tavern-tips">Undead</div>' +
			'<div data-id="Giants" class="tavern-tips">Giants</div>' +
			'<div data-id="Mystical" class="tavern-tips">Mystical</div>' +
			'<div data-id="Dragonkin" class="tavern-tips">Dragonkin</div>' +
			'<div data-id="Demons" class="tavern-tips">Demons</div>' +
			'<div data-id="Cooldowns" class="tavern-tips">Cooldowns</div>' +
			'<div class="tavern-tip-header text-shadow2">Item Properties</div>' +
			'<div data-id="Resistances" class="tavern-tips">Resistances</div>' +
			'<div data-id="Spell Damage" class="tavern-tips">Add Spell Damage</div>' +
			'<div data-id="Attack" class="tavern-tips">Attack</div>' +
			'<div data-id="Strength" class="tavern-tips">Strength</div>' +
			'<div data-id="Stamina" class="tavern-tips">Stamina</div>' +
			'<div data-id="Agility" class="tavern-tips">Agility</div>' +
			'<div data-id="Dexterity" class="tavern-tips">Dexterity</div>' +
			'<div data-id="Wisdom" class="tavern-tips">Wisdom</div>' +
			'<div data-id="Intelligence" class="tavern-tips">Intelligence</div>' +
			'<div data-id="Charisma" class="tavern-tips">Charisma</div>' +
			'<div data-id="Resources" class="tavern-tips">Resources</div>' +
			'<div data-id="Leech" class="tavern-tips">Leech</div>' +
			'<div data-id="Wraith" class="tavern-tips">Wraith</div>' +
			'<div data-id="Spell Damage Melee" class="tavern-tips">Add Spell Damage to Melee</div>' +
			'<div data-id="Block" class="tavern-tips">Block</div>' +
			'<div data-id="Mitigation" class="tavern-tips">Physical and Magical Mitigation</div>' +
			'<div data-id="Enhance Spell Damage" class="tavern-tips">Enhance Spell Damage</div>' +
			'<div data-id="Resist Effects" class="tavern-tips">Resist Effects</div>' +
			'<div data-id="Reduce Healing" class="tavern-tips">Reduce Healing</div>' +
			'<div data-id="Rest In Peace" class="tavern-tips">Rest In Peace</div>' +
			'<div data-id="Slows Target" class="tavern-tips">Slows Target</div>' +
			'<div data-id="Reduce Target Armor" class="tavern-tips">Reduce Target Armor</div>' +
			'<div data-id="Ignore Target Armor" class="tavern-tips">Ignore Target Armor</div>' +
			'<div data-id="Resources on Kill" class="tavern-tips">Resources on Kill</div>' +
		'</div>'
		return html
	}
	function leaderboardBodyHtml(data) {
		tavern.html = ''
		index = 1
		// console.info('data', data)
		if (data === void 0) {
			tavern.html = '<tr><td colspan="5">Loading...</td></tr>'
		}
		else {
			if (data.length === 0) {
				if (selectedLeaderboard === 'ALL') {
					tavern.html = '<tr><td></td><td colspan="4">No player data found</td></tr>'
				}
				else {
					tavern.html = '<tr><td></td></td><td colspan="4">No '+ ng.toJobLong(selectedLeaderboard) +'s found</td></tr>'
				}
			}
			else {
				for (row of data) {
					tavern.html += '<tr>' +
						'<td>'+ (index++) +'</td>' +
						'<td>'+ (row.name) +'</td>' +
						'<td class="chat-'+ row.job +'">'+ (row.job) +'</td>' +
						'<td>'+ (row.level) +'</td>' +
						'<td>'+ (row.exp) +'</td>' +
					'</tr>';
				}
			}
		}
		return tavern.html
	}
	function handleClickJob() {
		for (el of querySelectorAll('.tavern-jobs')) {
			el.classList.remove('active')
		}
		this.classList.add('active')
		selectedLeaderboard = this.id
		if (typeof tavern.leaders[selectedLeaderboard] === 'undefined') {
			getLeaders(selectedLeaderboard)
		}
		else querySelector('#tavern-leaderboard-body').innerHTML = leaderboardBodyHtml(tavern.leaders[selectedLeaderboard])
		audio.playSound('click-3')
	}
	function getLeaders(job) {
		ng.lock(true)
		if (selectedLeaderboard === 'ALL') {
			$.get(app.url + 'town/leaderboard.php')
				.done(setLeaderboardData)
				.always(ng.unlock)
		}
		else {
			$.get(app.url + 'town/leaderboard.php?job=' + job)
				.done(setLeaderboardData)
				.always(ng.unlock)
		}
	}
	function setLeaderboardData(data) {
		// console.info('getLeaders', data)
		tavern.leaders[selectedLeaderboard] = data.leaderboard
		querySelector('#tavern-leaderboard-body').innerHTML = leaderboardBodyHtml(data.leaderboard)
	}
	function leaderboardHtml() {
		html = '<div id="tavern-leaderboard-job-wrap" class="flex-row">'
		for (key in tavern.leaders) {
			html += '<div id="'+ key +'" class="tavern-jobs ' +
				(key === selectedLeaderboard ? 'active ' : ' ') +
				(key === 'ALL' ? ' ' : 'bg-' + key) +
			'">'+ (key === 'ALL' ? 'All' : '<img class="job-icon" src="images/ui/job-'+ key +'.png">') +'</div>'
		}
		html += '</div>' +
		'<div id="tavern-leaderboard-wrap">' +
			'<table id="tavern-leaderboard" style="display: table; flex: 1">' +
				'<thead id="tavern-leaderboard-header" style="color: gold; text-align: left;">' +
					'<tr>'+
						'<th></th>' +
						'<th width="50%">Name</th>' +
						'<th>Class</th>' +
						'<th>Level</th>' +
						'<th width="30%">Exp</th>' +
					'</tr>' +
				'</thead>' +
				'<tbody id="tavern-leaderboard-body">' +
					leaderboardBodyHtml(tavern.leaders[selectedLeaderboard]) +
				'</tbody>' +
			'</table>' +
		'</div>'
		return html
	}
	function heroesHtml() {
		html = '<div>Heroes Tip Html</div>'
		return html
	}
}($, _);