var bar;
(function() {
	bar = {
		dom: {},
		initialized: 0,
		init: init,
		html: html,
		setHp: setHp,
		setMp: setMp,
		header: header,
		disband: disband,
		setBars: setBars,
		linkdead: linkdead,
		getParty: getParty,
		hideParty: hideParty,
		partyJoin: partyJoin,
		setEvents: setEvents,
		partyBoot: partyBoot,
		setAllBars: setAllBars,
		updateBars: updateBars,
		partyDisband: partyDisband,
		partyPromote: partyPromote,
		getPlayerHtml: getPlayerHtml,
		updatePlayerBar: updatePlayerBar,
		heartbeatReceive: heartbeatReceive,
		getPlayerInnerHtml: getPlayerInnerHtml,
	}
	//////////////////////////////////////////////
	function init() {
		if (!bar.initialized) {
			bar.initialized = 1;
			var e = getById('bar-wrap');
			e.innerHTML = bar.html();
			/*$(".bar-icons").tooltip({
				animation: false
			});*/
			e.style.display = 'block';

			for (var i = 0; i < game.maxPlayers; i++) {
				bar.setEvents(i);
			}
			// draw all bars
			bar.setAllBars();
			// bar events
			$("#bar-wrap").on('click contextmenu', '.bar-col-icon', function (e) {
				var id = $(this).attr('id'),
					arr = id.split("-"),
					slot = arr[3] * 1;

				console.info(id, slot, my.party[slot].name);
				context.getPartyMenu(my.party[slot].name);
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
			}).on('mouseleave', '.bar-icons', function() {
				console.info('mouse leave');
				popover.hide();
			});
		}
	}
	function setEvents(i) {
		bar.dom[i] = {
			playerWrap: getById('bar-player-wrap-' + i),
			name: getById('bar-name-' + i),
			hpFg: getById('bar-hp-fg-' + i),
			// hpBg: getById('bar-hp-bg-' + i),
			mpWrap: getById('bar-mp-wrap-' + i),
			mpFg: getById('bar-mp-fg-' + i),
		}

		bar.dom.ping = getById('bar-ping');
		bar.dom.socket = getById('bar-socket');
	}
	function getPlayerHtml(player, index, ignoreWrap) {
		// get bar for one player
		var s = '';
		if (!ignoreWrap) {
			s += '<div id="bar-player-wrap-' + index + '" '+
			'class="bar-player-wrap' + (!index ? ' bar-player-wrap-me' : '') + '" ' +
				'style="display: '+ (index === 0 ? 'flex' : 'none') +'">';
		}
		s += bar.getPlayerInnerHtml(player, index);
		if (!ignoreWrap) {
			s += '</div>';
		}
		return s;
	}
	function header() {
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
	function getPlayerInnerHtml(player, index) {
		// inner portion of getPlayerHtml
		var s =
		'<div id="bar-col-icon-'+ index +'" class="bar-col-icon player-icon-'+ player.job +'">' +
			//'<div id="bar-level-'+ i +'" class="bar-level no-pointer">'+ player.level +'</div>' +
			'<div id="bar-is-leader-'+ index +'" class="bar-is-leader '+ (player.isLeader ? 'block' : 'none') +' no-pointer"></div>' +
		'</div>' +
		'<div class="'+ (!index ? 'bar-col-data' : 'bar-col-data-sm') +'">' +
			'<div id="bar-name-'+ index +'" class="bar-hp-name ellipsis">'+ player.name +'</div>' +
			'<div id="bar-hp-wrap-'+ index +'" class="bar-any-wrap">' +
				'<div id="bar-hp-fg-'+ index +'" class="bar-hp-fg"></div>' +
				//'<div id="bar-hp-bg-'+ i +'" class="bar-any-bg"></div>' +
			'</div>' +
			'<div id="bar-mp-wrap-'+ index +'" class="bar-any-wrap">' +
				'<div id="bar-mp-fg-'+ index +'" class="bar-mp-fg"></div>' +
			'</div>' +
		'</div>';
		return s;
	}
	function html() {
		// my bar
		var s = bar.header();
		// party bars
		s += '<div id="bar-all-player-wrap">';
		for (var i=0; i<game.maxPlayers; i++) {
			s += bar.getPlayerHtml(my.party[i], i);
		}
		s += '</div>';
		return s;
	}
	function updatePlayerBar(index) {
		bar.dom[index].playerWrap.style.display = 'flex';
		bar.dom[index].playerWrap.innerHTML = bar.getPlayerInnerHtml(my.party[index], index);
		bar.setEvents(index);
		bar.setBars(index, 0);
	}
	function setAllBars() {
		// draw all hp/mp values using my.party data
		for (var i=0; i<game.maxPlayers; i++) {
			bar.setHp(i);
			bar.setMp(i);
		}
	}
	function setBars(index, delay) {
		bar.setHp(index, delay);
		bar.setMp(index, delay);
	}
	function updateBars(data) {
		for (var i=0, len=my.party.length; i<len; i++) {
			if (data.name === my.party[i].name) {
				if (data.hp) {
					my.party[i].hp = data.hp;
					bar.setHp(i);
				}
				if (data.mp) {
					my.party[i].mp = data.mp;
					bar.setMp(i);
				}
			}
		}
	}
	function setHp(index, delay) {
		if (!my.party[index].name) return;
		var percent = ~~((my.party[index].hp / my.party[index].maxHp) * 100) + '%',
				delay = delay === undefined ? .3 : delay;
		TweenMax.to(bar.dom[index].hpFg, delay, {
			width: percent
		});
		/*TweenMax.to(bar.dom[index].hpBg, .5, {
			width: percent
		});*/
	}
	function setMp(index, delay) {
		if (!my.party[index].name) return;
		if (my.party[index].maxMp) {
			var percent = ~~((my.party[index].mp / my.party[index].maxMp) * 100) + '%',
				delay = delay === undefined ? .3 : delay;
			TweenMax.to(bar.dom[index].mpFg, delay, {
				width: percent
			});
		}
		else {
			bar.dom[index].mpWrap.style.display = 'none';
		}
	}
	function partyJoin(data) {
		console.info('bar.party.join ', data);
		chat.log(data.msg, 'chat-warning');
		// refresh party bars
		bar.getParty();
	}
	function partyDisband(data) {
		var index = 0,
			name = '',
			electNewLeader = 0;
		// did the leader disband or somehow get booted?
		my.party.forEach(function(v, i) {
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
			my.party[index] = my.Party();
			getById('bar-player-wrap-' + index).style.display = 'none';
			chat.log(name + " has disbanded the party.", 'chat-warning');
			// elect new leader if client's id is lowest
			if (electNewLeader && my.isLowestPartyIdMine()) {
				chat.promote(my.getNewLeaderName(), 1);
			}
		}
		// disband if it's me
		// console.info('disband: ', data.row, my.id);
		data.row === my.row && chat.sendMsg('/disband');
	}
	function partyPromote(data) {
		chat.log(data.name + " has been promoted to party leader.", 'chat-warning');
		// refresh party bars
		bar.getParty();
	}
	function partyBoot(data) {
		console.info('bar.party.boot ', data);
		chat.log(_.capitalize(data.name) + " has been booted from the party.", 'chat-warning');
		// refresh party bars
		data.row *= 1;
		bar.partyDisband(data);
		bar.getParty();
	}
	function getParty() {
		console.info("Drawing all bars!");
		if (my.p_id) {
			$.get(app.url + 'chat/party-get-all.php').done(function (data) {
				console.info('getParty ', data);
				var npIndex = 1;
				data.party.forEach(function(v, i){
					console.info('SET BARS ', i, v);
					if (v.name === my.name) {
						my.party[0] = v;
						my.resetClientPartyValues(0);
						bar.updatePlayerBar(0);
					}
					else {
						my.party[npIndex] = v;
						my.resetClientPartyValues(npIndex);
						bar.updatePlayerBar(npIndex++);
					}
				});
				// hide empty rows
				var len = data.party.length;
				for (var i=len; i<game.maxPlayers; i++) {
					if (i) {
						// never overwrite self
						getById('bar-player-wrap-' + i).style.display = 'none';
						my.party[i] = my.Party();
					}
				}
			});
		}
	}
	function disband() {
		my.party.forEach(function(v, i){
			if (i) {
				// set client value
				my.party[i] = my.Party();
			}
		});
		bar.hideParty();
		// update server
		socket.unsubscribe('party'+ my.p_id);
		my.p_id = 0;
		my.party[0].isLeader = 0;
		getById('bar-is-leader-0').style.display = 'none';
	}
	function hideParty() {
		my.party.forEach(function(v, i){
			if (i) {
				getById('bar-player-wrap-' + i).style.display = 'none';
			}
		});
	}
	function heartbeatReceive(data) {
		console.info('%c party heartbeat.receive id:', "background: #0ff", data.id);
		var index = 0;
		// check everyone except me
		for (var i=1; i<6; i++) {
			if (data.id === my.party[i].id) {
				index = i;
			}
		}
		if (index) {
			my.resetClientPartyValues(index);
		}
	}
	function linkdead(data) {
			chat.log(data.name + ' has gone linkdead.', 'chat-warning');
	}
})();