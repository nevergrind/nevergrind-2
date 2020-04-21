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

	$('#root-various')
		.on('click', '.tavern-tabs', updateBodyHtml)
		.on('click', '.tavern-jobs', handleClickJob)
	///////////////////////////////////////////

	function getBodyHtml() {
		str =
		'<div id="various-body" class="flex-row flex-max">' +
			'<div id="tavern-wrap" class="flex-column flex-max" style="margin: .1rem .2rem">' +
				'<div id="tavern-tab-wrap" class="flex-row" style="border-bottom: 1px solid #025;">'+
					'<div id="tavern-tips" class="tavern-tabs active">Tips</div>' +
					'<div id="tavern-missions" class="tavern-tabs">Missions</div>' +
					'<div id="tavern-leaderboard" class="tavern-tabs">Leaderboard</div>' +
					'<div id="tavern-heroes" class="tavern-tabs">Heroes</div>' +
				'</div>' +
				'<div id="tavern-body" style="padding: .1rem .1rem 0">'+
					tipHtml() +
				'</div>' +
			'</div>' +
		'</div>'
		return str
	}
	function updateBodyHtml() {
		for (el of querySelectorAll('.tavern-tabs')) {
			el.classList.remove('active')
		}
		console.info('updateBodyHtml', this)
		this.classList.add('active')
		tavern.activeTab = this.id

		if (tavern.activeTab === 'tavern-tips') html = tipHtml()
		else if (tavern.activeTab === 'tavern-missions') html = missionHtml()
		else if (tavern.activeTab === 'tavern-leaderboard') {

			html = leaderboardHtml()
			if (!tavern.leaders[selectedLeaderboard]) {
				getLeaders()
			}
		}
		else if (tavern.activeTab === 'tavern-heroes') html = heroesHtml()
		querySelector('#tavern-body').innerHTML = html
	}
	function tipHtml() {
		html = '<div>Tavern Tip Html</div>'
		return html
	}
	function missionHtml() {
		html = '<div>Mission Tip Html</div>'
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
					tavern.html = '<tr><td colspan="5">No player data found</td></tr>'
				}
				else {
					tavern.html = '<tr><td colspan="5">No '+ ng.toJobLong(selectedLeaderboard) +'s found</td></tr>'
				}
			}
			else {
				for (row of data) {
					var foo = '<tr>' +
						'<td>'+ (index++) +'</td>' +
						'<td>'+ (row.name) +'</td>' +
						'<td class="chat-'+ row.job +'">'+ (row.job) +'</td>' +
						'<td>'+ (row.level) +'</td>' +
						'<td>'+ (row.exp) +'</td>' +
					'</tr>';
					tavern.html += foo + foo + foo + foo + foo
				}
			}
		}
		return tavern.html
	}
	function handleClickJob() {
		selectedLeaderboard = this.id
		console.info('handleClickJob', selectedLeaderboard)
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
				(key === 'ALL' ? 'active' : 'bg-' + key) +
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