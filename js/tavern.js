// audio.js
var tavern;
!function($, _) {
	tavern = {
		activeTab: 'tavern-tips',
		html: '',
		leaders: {
			'ALL': void 0,
			'WAR': void 0,
			'PAL': void 0,
			'SHD': void 0,
			'MNK': void 0,
			'ROG': void 0,
			'RNG': void 0,
			'BRD': void 0,
			'DRU': void 0,
			'CLR': void 0,
			'SHM': void 0,
			'NEC': void 0,
			'ENC': void 0,
			'SUM': void 0,
			'WIZ': void 0,
		},
		getBodyHtml,
	}
	var key, str, html, el, row, index

	let selectedLeaderboard = 'ALL'
	const tips = {
		races: 'Aside from their starting attributes, each race also has a few passive traits that make them unique. Aside from their starting attributes, each race also has a few passive traits that make them unique. Aside from their starting attributes, each race also has passive traits that make them unique. Each race has their own strengths! They all seem quite capable to me, but some maintain a strong preference for certain races for one reason or another!',
		classes: 'LoremIpsum',
		potions: 'LoremIpsum',
		parties: 'LoremIpsum',
		attributes: 'LoremIpsum',
		chat: 'LoremIpsum',
		inventory: 'LoremIpsum',
		missions: 'LoremIpsum',
		academy: 'LoremIpsum',
		merchant: 'LoremIpsum',
		bank: 'LoremIpsum',
		apothecary: 'LoremIpsum',
		guild: 'LoremIpsum',
		blacksmith: 'LoremIpsum',
		health: 'LoremIpsum',
		mana: 'LoremIpsum',
		spirit: 'LoremIpsum',
		passiveSkills: 'LoremIpsum',
		combatSkills: 'LoremIpsum',
		monsterTypes: 'LoremIpsum',
		humanoids: 'LoremIpsum',
		beasts: 'LoremIpsum',
		undead: 'LoremIpsum',
		giants: 'LoremIpsum',
		eldritch: 'LoremIpsum',
		dragonkin: 'LoremIpsum',
		demons: 'LoremIpsum',
		cooldowns: 'LoremIpsum',
		resistances: 'LoremIpsum',
		spellDamage: 'LoremIpsum',
		attack: 'LoremIpsum',
		strength: 'LoremIpsum',
		stamina: 'LoremIpsum',
		agility: 'LoremIpsum',
		dexterity: 'LoremIpsum',
		wisdom: 'LoremIpsum',
		intelligence: 'LoremIpsum',
		charisma: 'LoremIpsum',
		resources: 'LoremIpsum',
		leech: 'LoremIpsum',
		wraith: 'LoremIpsum',
		spellDamageMelee: 'LoremIpsum',
		block: 'LoremIpsum',
		mitigation: 'LoremIpsum',
		enhanceSpellDamage: 'LoremIpsum',
		resistEffects: 'LoremIpsum',
		reduceHealing: 'LoremIpsum',
		restInPeace: 'LoremIpsum',
		slowsTarget: 'LoremIpsum',
		reduceTargetArmor: 'LoremIpsum',
		ignoreTargetArmor: 'LoremIpsum',
		resourcesOnKill: 'LoremIpsum',
	}

	$('#root-various')
		.on('click', '.tavern-tabs', handleClickTab)
		.on('click', '.tavern-jobs', handleClickJob)
		.on('click', '.tavern-tips', handleClickTips)
	///////////////////////////////////////////

	function getBodyHtml() {
		str =
		'<div id="various-body" class="flex-row flex-max">' +
			'<div id="tavern-wrap" class="flex-column flex-max" style="margin: .1rem .2rem">' +
				'<div id="tavern-tab-wrap" class="flex-row" style="border-bottom: 1px solid #025;">'+
					'<div id="tavern-tips" class="tavern-tabs active">Tips</div>' +
					'<div id="tavern-leaderboard" class="tavern-tabs">Leaderboard</div>' +
					'<div id="tavern-heroes" class="tavern-tabs">Heroes</div>' +
				'</div>' +
				'<div id="tavern-body">'+
					tipHtml() +
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

		if (tavern.activeTab === 'tavern-tips') {
			ng.splitText('various-description', 'My knowledge is limited, but I am happy to offer my advice on a variety of topics. What topic interests you?')
			html = tipHtml()
		}
		else if (tavern.activeTab === 'tavern-leaderboard') {
			ng.splitText('various-description', 'Edenburg\'s royal scribes do their best to maintain an updated list of the most accomplished adventurers in the Kingdom. We maintain an overall list and a separate list by class.')
			html = leaderboardHtml()
			if (!tavern.leaders[selectedLeaderboard]) {
				getLeaders()
			}
		}
		else if (tavern.activeTab === 'tavern-heroes') {
			ng.splitText('various-description', 'The King has ordered that we carefully track all weapons and armor in the Kingdom. These records are public knowledge and may be reviewed for legal or educational purposes.')
			html = heroesHtml()
		}
		querySelector('#tavern-body').innerHTML = html
	}

	function handleClickTips(event) {
		key = _.camelCase(_.pick(event.currentTarget.dataset, ['id']).id)
		typeof tips[key] === 'string' && ng.splitText('various-description', tips[key])
	}

	function tipHtml() {
		html = '<div id="tavern-tip-wrap" class="flex-column flex-max">' +
			'<div class="tavern-tip-header">General</div>' +
			'<div data-id="Races" class="tavern-tips">Races</div>' +
			'<div data-id="Classes" class="tavern-tips">Classes</div>' +
			'<div data-id="Potions" class="tavern-tips">Potions</div>' +
			'<div data-id="Parties" class="tavern-tips">Parties</div>' +
			'<div data-id="Attributes" class="tavern-tips">Attributes</div>' +
			'<div data-id="Chat" class="tavern-tips">Chat</div>' +
			'<div data-id="Inventory" class="tavern-tips">Inventory</div>' +
			'<div class="tavern-tip-header">Town</div>' +
			'<div data-id="Missions" class="tavern-tips">Missions</div>' +
			'<div data-id="Academy" class="tavern-tips">Academy</div>' +
			'<div data-id="Merchant" class="tavern-tips">Merchant</div>' +
			'<div data-id="Bank" class="tavern-tips">Bank</div>' +
			'<div data-id="Apothecary" class="tavern-tips">Apothecary</div>' +
			'<div data-id="Guild" class="tavern-tips">Guild</div>' +
			'<div data-id="Blacksmith" class="tavern-tips">Blacksmith</div>' +
			'<div class="tavern-tip-header">Combat</div>' +
			'<div data-id="Health" class="tavern-tips">Health</div>' +
			'<div data-id="Mana" class="tavern-tips">Mana</div>' +
			'<div data-id="Spirit" class="tavern-tips">Spirit</div>' +
			'<div data-id="Passive Skills" class="tavern-tips">Passive Skills</div>' +
			'<div data-id="Combat Skills" class="tavern-tips">Combat Skills</div>' +
			'<div data-id="Monster Types" class="tavern-tips">Monster Types</div>' +
			'<div data-id="Humanoids" class="tavern-tips">Humanoids</div>' +
			'<div data-id="Beasts" class="tavern-tips">Beasts</div>' +
			'<div data-id="Undead" class="tavern-tips">Undead</div>' +
			'<div data-id="Giants" class="tavern-tips">Giants</div>' +
			'<div data-id="Eldritch" class="tavern-tips">Eldritch</div>' +
			'<div data-id="Dragonkin" class="tavern-tips">Dragonkin</div>' +
			'<div data-id="Demons" class="tavern-tips">Demons</div>' +
			'<div data-id="Cooldowns" class="tavern-tips">Cooldowns</div>' +
			'<div class="tavern-tip-header">Item Properties</div>' +
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
		console.info('data', data)
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
	}
	function getLeaders(job) {
		ng.lock(true);
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
		console.info('getLeaders', data)
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