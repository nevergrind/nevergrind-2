var bar;
(function() {
	bar = {
		dom: {},
		initialized: 0,
		init,
		disband,
		linkdead,
		getPresence,
		hideParty,
		partyJoin,
		partyBoot,
		updatePlayerBar,
		setAjaxPing,
		partyDisband,
		partyPromote,
		addPlayerBar,
	};
	var index;
	var player; // temp bar data
	//////////////////////////////////////////////
	function init() {
		if (!bar.initialized) {
			bar.initialized = 1;
			var e = getById('bar-wrap');
			// my bar
			var html = getBarHeader();
			// party bars
			html += '<div id="bar-all-player-wrap">';
			for (var i=0; i<party.maxPlayers; i++) {
				html += getPlayerBarHtml({}, i, true);
			}
			html += '</div>';
			e.innerHTML = html;
			e.style.display = 'block';

			bar.dom.ping = getById('bar-ping');
			bar.dom.socket = getById('bar-socket');
			// draw all bars
			// bar events
			$("#bar-wrap").on('click contextmenu', '.bar-col-icon', function (e) {
				var id = $(this).attr('id'),
					arr = id.split("-"),
					slot = arr[3] * 1;

				console.info(id, slot, party.presence[slot].name);
				context.getPartyMenu(party.presence[slot].name);
			}).on('click', '#bar-camp', chat.camp)
				.on('click', '#bar-stats', function () {
				console.info($(this).attr('id'));
			}).on('click', '#bar-inventory', function () {
				console.info($(this).attr('id'));
			}).on('click', '#bar-options', function () {
				console.info($(this).attr('id'));
			}).on('click', '#bar-mission-abandon', mission.abandon)
				.on('mouseenter', '.bar-icons', function() {
				var id = $(this).attr('id');
				popover.setMainMenuHtml(id);
			}).on('mouseleave', '.bar-icons', popover.hide);
		}
	}
	function cachePlayerBars(index) {
		bar.dom[index] = {
			playerWrap: getById('bar-player-wrap-' + index),
			name: getById('bar-name-' + index),
			hpFg: getById('bar-hp-fg-' + index),
			// hpBg: getById('bar-hp-bg-' + index),
			mpWrap: getById('bar-mp-wrap-' + index),
			mpFg: getById('bar-mp-fg-' + index),
			isLeader: getById('bar-is-leader-' + index),
		}
	}
	function getBarHeader() {
		var s = '';
		s +=
		'<div id="bar-lag">' +
			'<span id="bar-ping"><i class="fa fa-exchange"></i></span>' +
			'<span id="bar-socket"><i class="fa fa-exchange"></i></span>' +
		'</div>' +
		'<div id="bar-main-menu">' +
			'<i id="bar-camp" class="fa fa-power-off bar-icons"></i>' +
			'<i id="bar-stats" class="fa fa-user-circle-o bar-icons"></i>' +
			'<i id="bar-inventory" class="fa fa-suitcase bar-icons"></i>' +
			'<i id="bar-options" class="fa fa-gear bar-icons"></i>' +
			'<i id="bar-mission-abandon" class="fa fa-flag bar-icons"></i>' +
		'</div>';
		return s;
	}
	function getPlayerBarHtml(player, index, includeWrapper) {
		player = player || {};
		var s = '';
		if (includeWrapper) {
			s += '<div id="bar-player-wrap-' + index + '" '+ 'class="bar-player-wrap' + (!index ? ' bar-player-wrap-me' : '') + '" ' + 'style="display: '+ (index === 0 ? 'flex' : 'none') +'">';
		}
		// job icon
		s += '<div id="bar-col-icon-'+ index +'" class="bar-col-icon player-icon-'+ (player.job || "WAR") +'">' +
			//'<div id="bar-level-'+ i +'" class="bar-level no-pointer">'+ player.level +'</div>' +
			'<div id="bar-is-leader-'+ index +'" class="bar-is-leader '+ (player.isLeader ? 'block' : 'none') +' no-pointer"></div>' +
		'</div>' +
		// bars
		'<div class="'+ (!index ? 'bar-col-data' : 'bar-col-data-sm') +'">' +
			'<div id="bar-name-'+ index +'" class="bar-hp-name ellipsis">'+ (player.name || '') +'</div>' +
			'<div id="bar-hp-wrap-'+ index +'" class="bar-any-wrap">' +
				'<div id="bar-hp-fg-'+ index +'" class="bar-hp-fg"></div>' +
				//'<div id="bar-hp-bg-'+ i +'" class="bar-any-bg"></div>' +
			'</div>' +
			'<div id="bar-mp-wrap-'+ index +'" class="bar-any-wrap">' +
				'<div id="bar-mp-fg-'+ index +'" class="bar-mp-fg"></div>' +
			'</div>' +
		'</div>';
		if (includeWrapper) {
			s += '</div>';
		}
		return s;
	}
	function updatePlayerBar(data) {
		index = _.findIndex(party.presence, { row: data.row });
		if (index === -1) return;
		player = party.presence[index];
		if (data.hp !== player.hp || data.maxHp !== player.maxHp) {
			player.hp = data.hp;
			player.maxHp = data.maxHp;
			setHp(index);
		}
		if (data.mp !== player.mp || data.maxMp !== player.maxMp) {
			player.mp = data.mp;
			player.maxMp = data.maxMp;
			setMp(index);
		}
		if (data.isLeader !== player.isLeader) {
			player.isLeader = data.isLeader;
			// set UI helmet
			if (player.isLeader) {
				getById('bar-is-leader-' + index).classList.remove('none');
			}
			else {
				getById('bar-is-leader-' + index).classList.add('none');
			}

			console.warn('isLeader', data.row, index, player.isLeader);
		}
		if (data.job !== player.job) {
			player.job = data.job;
			// set UI job
		}
		if (data.level !== player.level) {
			player.level = data.level;
			// set UI level
		}
		if (data.row !== player.row) {
			player.row = data.row;
		}
		if (data.name !== player.name) {
			player.name = data.name;

		}
	}
	function addPlayerBar(index) {
		if (typeof bar.dom[index] === 'undefined') {
			cachePlayerBars(index);
		}
		bar.dom[index].playerWrap.style.display = 'flex';
		bar.dom[index].playerWrap.innerHTML = getPlayerBarHtml(party.presence[index], index);
	}
	function setHp(index, delay) {
		if (typeof party.presence[index] === 'undefined' ||
			!party.presence[index].name) {
			console.warn("NOT DRAWING BAR");
		}
		else {
			var percent = ~~((party.presence[index].hp / party.presence[index].maxHp) * 100) + '%',
					delay = delay === undefined ? .3 : delay;
			TweenMax.to(bar.dom[index].hpFg, delay, {
				width: percent
			});
			/*TweenMax.to(bar.dom[index].hpBg, .5, {
				width: percent
			});*/

		}
	}
	function setMp(index, delay) {
		if (typeof party.presence[index] === 'undefined' ||
			!party.presence[index].name) {
			console.warn("NOT DRAWING BAR");
		}
		else {
			if (party.presence[index].maxMp) {
				var percent = ~~((party.presence[index].mp / party.presence[index].maxMp) * 100) + '%',
					delay = delay === undefined ? .3 : delay;
				TweenMax.to(bar.dom[index].mpFg, delay, {
					width: percent
				});
			}
			else {
				bar.dom[index].mpWrap.style.display = 'none';
			}
		}
	}

	/**
	 * Member has joined the party; send party data immediately
	 * @param data
	 */
	function partyJoin(data) {
		console.info('bar.party.join ', data);
		chat.log(data.msg, 'chat-warning');
		// refresh party bars
		bar.getPresence();
	}
	function partyDisband(data) {
		var index = 0,
			name = '',
			electNewLeader = 0;
		// did the leader disband or somehow get booted?
		party.presence.forEach(function(v, i) {
			if (data.row === v.id) {
				index = i;
				name = v.name;
				if (v.isLeader) {
					electNewLeader = 1;
				}
			}
		});
		// disbanded player found
		if (index) {
			// reset client data to default
			party.presence[index] = my.Party();
			getById('bar-player-wrap-' + index).style.display = 'none';
			chat.log(name + " has disbanded the party.", 'chat-warning');
			// elect new leader if client's id is lowest
			if (electNewLeader && my.isLowestPartyIdMine()) {
				party.promote(my.getNewLeaderName(), 1);
			}
		}
		// disband if it's me
		// console.info('disband: ', data.row, my.id);
		data.row === my.row && chat.sendMsg('/disband');
	}
	function partyPromote(data) {
		chat.log(data.name + " has been promoted to party leader.", 'chat-warning');
		// refresh party bars
		bar.getPresence();
	}
	function partyBoot(data) {
		console.info('bar.party.boot ', data);
		chat.log(_.capitalize(data.name) + " has been booted from the party.", 'chat-warning');
		// refresh party bars
		data.row *= 1;
		bar.partyDisband(data);
		bar.getPresence();
	}
	function setAjaxPing() {
		var ping = ~~((game.ajax.receiveTime - game.ajax.sendTime) / 2);
		bar.dom.ping.innerHTML =
			'<span class="'+ game.getPingColor(ping) +'">' + (ping) + 'ms</span>';

	}
	function getPresence() {
		socket.publish('party' + my.partyId, {
			route: 'party->getPresence',
		});
	}
	function disband() {
		party.presence.forEach(function(v, i){
			if (i) {
				// set client value
				party.presence[i] = my.Party();
			}
		});
		bar.hideParty();
		// update server
		socket.unsubscribe('party'+ my.partyId);
		my.partyId = my.row;
		party.presence[0].isLeader = false;
		getById('bar-is-leader-0').style.display = 'none';
	}
	function hideParty() {
		party.presence.forEach(function(v, i){
			if (i) {
				getById('bar-player-wrap-' + i).style.display = 'none';
			}
		});
	}
	function linkdead(data) {
			chat.log(data.name + ' has gone linkdead.', 'chat-warning');
	}
})();