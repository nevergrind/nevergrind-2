var who;
(function() {
	who = {
		listThrottled: false,
		listThrottleExpire: 1000,
		listId: 0,
		results: 0,
		maxResults: 30,
		all,
		allRequest,
		presenceReceived,
		byFilter,
		byFilterRequest,
		byFilterReceived,
	};
	var title;
	var parseObj = {};
	var filters;
	var filterObj;
	var index;
	/////////////////////////////////////////////////////////

	function all() {
		if (who.listThrottled) return;
		// Increment local values
		chat.log('<div class="chat-warning">Checking for other players...</div>');
		who.listThrottled = true;
		who.listId++;
		who.results = 0;
		delayedCall(who.listThrottleExpire, () => {
			who.listThrottled = false;
		});

		// request response from friends
		socket.publish('allbroadcast', {
			name: my.name,
			route: 'all->who'
		})
		title = 'Total players in Vandamor';
		chat.log(chat.divider +
			'<div>' + title + ': <span id="who-all-'+ who.listId + '">0</span></div>',
			CHAT.WARNING
		);
	}
	function allRequest(data) {
		// console.warn('allRequest', data);
		socket.publish('name' + data.name, {
			name: my.name,
			level: my.level,
			race: my.race,
			job: my.job,
			guild: my.guild.name,
			action: 'all->received',
		})
	}
	function presenceReceived(data) {
		who.results++;
		// console.warn('presenceReceived', who.results, data);
		if (who.results < who.maxResults) {
			chat.log(
				'<div class="chat-whisper">[' +
					data.level +' '+ ng.jobLong[data.job] +'] ' +
					data.name + ' (' + data.race + ')' +
					guild.format(data.guild) +
				'</div>'
			)
			getElementById('who-all-' + who.listId).textContent = who.results;
		}
	}
	function parse(msg) {
		// create an array and start looking for props to filter by
		filterObj = {
			nameOrGuild: '',
			race: '',
			job: '',
			minLevel: 0,
			maxLevel: 0
		};
		filters = _.compact(msg.split(' '));
		filters.shift();
		filters.map(filter => filter.toLowerCase());
		// look for job
		ng.jobs.forEach(job => {
			job = job.toLowerCase();
			if (filters.includes(job)) {
				filterObj.job = job;
				index = filters.indexOf(job);
				_.pullAt(filters, [ index ]);
			}
		})
		// look for race
		ng.races.forEach(race => {
			race = race.toLowerCase();
			if (filters.includes(race)) {
				filterObj.race = race;
				index = filters.indexOf(race);
				_.pullAt(filters, [ index ]);
			}
		})
		// look for levels
		ng.levels.forEach(level => {
			if (!filterObj.minLevel) {
				// check for minLevel first
				if (filters.includes(level)) {
					filterObj.minLevel = level;
					index = filters.indexOf(level);
					_.pullAt(filters, [ index ]);
				}
			}
			else {
				if (filters.includes(level)) {
					filterObj.maxLevel = level;
					index = filters.indexOf(level);
					_.pullAt(filters, [ index ]);
				}
			}
		})

		filterObj.nameOrGuild = filters.length ?
			filters.join(' ').toLowerCase() : '';
		// console.warn('filterObj', filterObj)
		return filterObj;
	}
	function byFilter(msgLower) {
		if (who.listThrottled) return;
		// parse for additional constraints
		parseObj = {};
		parseObj = parse(msgLower);

		// Increment local values
		chat.log('<div class="chat-warning">Checking for other players...</div>');
		who.listThrottled = true;
		who.listId++;
		who.results = 0;
		delayedCall(who.listThrottleExpire, () => {
			who.listThrottled = false;
		});

		socket.publish('allbroadcast', _.assign({
			name: my.name,
			route: 'all->byFilter'
		}, parseObj))

		title = 'Checking players by filter:';
		chat.log(chat.divider +
			'<div>' + title + ' <span id="who-all-'+ who.listId + '">0</span></div>',
			CHAT.WARNING
		);
	}
	function byFilterRequest(data) {
		// console.warn('byFilterRequest', data);
		if (matchesFilters(data)) {
			socket.publish('name' + data.name, {
				name: my.name,
				level: my.level,
				race: my.race,
				job: my.job,
				guild: my.guild.name,
				action: 'all->byFilterReceived',
			})
		}
	}
	function byFilterReceived(data) {
		who.results++;
		// console.warn('byFilterReceived', who.results, data);
		if (who.results < who.maxResults) {
			chat.log(
				'<div class="chat-whisper">[' +
					data.level +' '+ ng.jobLong[data.job] +'] ' +
					data.name + ' (' + data.race + ')' +
					guild.format(data.guild) +
				'</div>'
			)
			getElementById('who-all-' + who.listId).textContent = who.results;
		}
	}
	function matchesFilters(data) {
		return (data.job ? (data.job === ng.toJobLong(my.job).toLowerCase()) : true) &&
			(data.race ? (data.race === my.race.toLowerCase()) : true) &&
			// only min level... need exact match
			((data.minLevel && !data.maxLevel) ? (my.level === +data.minLevel) : true) &&
			// both props are specified (ranged)
			((data.minLevel && data.maxLevel) ?
				(my.level >= +data.minLevel && my.level <= +data.maxLevel) : true) &&
			// has my name match exactly or includes my guild name
			(data.nameOrGuild ? (
				my.name.toLowerCase().includes(data.nameOrGuild) ||
				(my.guild.name ?
					my.guild.name.toLowerCase().includes(data.nameOrGuild) : false
				)
			) : true)
	}
})();