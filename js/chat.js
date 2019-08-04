var chat;
(function() {
	/** public */
	chat = {
		prefix: 'ng2',
		default: 'town',
		initialized: 0,
		isClicked: false,
		hasFocus: false,
		count: 1, // total msgs in chat; used to count messages in memory instead of by DOM
		players: [],
		lastWhisper: {
			name: ''
		},
		dom: {},
		historyIndex: 0,
		history: [],
		divider: '<div class="chat-emote">========================================</div>',
		whispers: {},
		presence: [],
		modeTypes: [
			'/say',
			'/party',
			'/guild'
		],
		modeCommand: '/say',
		modeName: '',
		log,
		init,
		html,
		getChannel,
		modeChange,
		modeSet,
		updateHistory,
		help,
		sendMsg,
		parseMsg,
		getMsgObject,
		clear,
		clearChatLog,
		emote,
		ignoreInit,
		ignoreList,
		ignoreAdd,
		ignoreRemove,
		promote,
		disband,
		boot,
		invite,
		camp,
		reply,
		promptAdd,
		promptConfirm,
		promptDeny,
		partyJoin,
		partyParse,
		whisperParse,
		whisperPrefix,
		whisperTo,
		friendParse,
		friendInit,
		friendList,
		friendAdd,
		friendRemove,
		friendNotify,
		toPlaytime,
		toCreateString,
		played,
		whoParse,
		whoAll,
		whoClass,
		scrollBottom,
		setHeader,
		joinParse,
		joinChannel,
		joinDefault,
		joinChangeCallback,
		publishRemove,
		clearLog,
		sizeSmall,
		sizeLarge,
	}
	/** private */

	/** public */
	function getChannel() {
		return _.toLower(chat.prefix + my.channel);
	}
	function html() {
	// receives channel prop from index.php
		var s =
			'<div id="chat-present-wrap" class="no-select">' +
				'<div id="chat-header">&nbsp;</div>' +
				'<div id="chat-room"></div>' +
			'</div>' +
			'<div id="chat-log-wrap">' +
				'<div id="chat-log">' +
					'<div>Welcome to Broken.net!</div>' +
					'<div>You have entered Vandamor.</div>' +
					'<div class="chat-warning">Type /help or /h for a list of chat commands.</div>' +
				'</div>' +
				'<div id="chat-prompt" class="no-select">'+
				'</div>' +
				'<div id="chat-input-wrap">' +
					'<div id="chat-input-mode" class="chat-white no-select">'+
						'<span id="chat-mode-msg" class="ellipsis">To town:</span>' +
					'</div>' +
					'<input id="chat-input" type="text" maxlength="240" autocomplete="off" spellcheck="false" />' +
				'</div>' +
			'</div>';
		return s;
	}
	function modeChange(h) {
		// only trim leading spaces
		var mode = h === undefined ? (chat.dom.chatInput.value + ng.lastKey) : h.mode,
			mode = mode.replace(/^\s+/g, '');

		if (mode === '/say' && !my.channel) {
			log("You cannot communicate in town while in a dungeon", "chat-warning");
			setTimeout(function() {
				// wipe input after keyup to get rid of /say
				$("#chat-input").val('');
			});
			return false;
		}

		// known standard mode
		if (chat.modeTypes.indexOf(mode) > -1) {
			chat.modeCommand = mode;
			chat.modeSet(mode);
			if (!h) {
				chat.dom.chatInput.value = '';
			}
			return true;
		}
		// it's a whisper
		else if ( (h && mode[0]) === '@' ||
			(!h && mode[0] === '@' && ng.lastKey === ' ') ) {
			// history mode and mode is @
			// or not history mode and mode is @ and just hit space!
			if (h) {
				name = h.name;
			}
			else {
				var parse = chat.parseMsg(mode),
					name = parse.first.substr(1);

				name = name.toLowerCase();
				name = name[0].toUpperCase() + name.substr(1);
			}
			chat.modeCommand = '@';
			chat.modeName = name;
			chat.modeSet(chat.modeCommand);
			if (!h) {
				chat.dom.chatInput.value = '';
			}
			return true;
		}
		else {
			return false;
		}
	}
	function modeSet(mode) {
		if (mode === '/say') {
			chat.dom.chatInputMode.className = 'chat-white';
			chat.dom.chatModeMsg.textContent = 'To ' + my.channel + ':';
		}
		else if (mode === '/party') {
			chat.dom.chatInputMode.className = 'chat-party';
			chat.dom.chatModeMsg.textContent = 'To party:';
		}
		else if (mode === '/guild') {
			chat.dom.chatInputMode.className = 'chat-guild';
			chat.dom.chatModeMsg.textContent = 'To guild:';
		}
		else if (mode === '@') {
			chat.dom.chatInputMode.className = 'chat-whisper';
			chat.dom.chatModeMsg.textContent = 'To '+ chat.modeName +':';
		}
	}
	function init() {
		// default initialization of chat
		if (!chat.initialized) {
			var e = getById('chat-wrap');
			e.innerHTML = '';
			e.style.display = 'flex';
			e.innerHTML = chat.html();

			chat.initialized = 1;
			// show
			// prevents auto scroll while scrolling
			$("#chat-log").on('click', function(){
				chat.isClicked = 1;
			}).on('mouseup', function(){
				chat.isClicked = 0;
			});
			$("#chat-input").on('focus', function(){
				chat.hasFocus = 1;
			}).on('blur', function(){
				chat.hasFocus = 0;
			});

			$("#chat-prompt").on('click', '.chat-prompt-yes', function(e){
				chat.promptConfirm($(this).data());
			}).on('click', '.chat-prompt-no', function(e){
				chat.promptDeny($(this).data());
			});

			$("#chat-room").on('click contextmenu', '.chat-player', function() {
				var id = $(this).parent().attr('id'),
					text = $(this).text(),
					a2 = text.split(":"),
					name = a2[1].replace(/\]/g, '').trim();

				// console.info('id name ', playerId, name);
				context.getChatMenu(name);
			});
			// dom cache
			chat.dom.chatRoom = getById('chat-room');
			chat.dom.chatHeader = getById('chat-header');
			chat.dom.chatLog = getById('chat-log');
			chat.dom.chatInput = getById('chat-input');
			chat.dom.chatInputMode = getById('chat-input-mode');
			chat.dom.chatModeMsg = getById('chat-mode-msg');
			chat.dom.chatPrompt = getById('chat-prompt');
		}
		else {
			// returned from dungeon
			chat.clearChatLog();
		}
	}
	function log(msg, route) {
		// report to chat-log
		if (msg){
			while (chat.dom.chatLog.childElementCount >= 500) {
				chat.dom.chatLog.removeChild(chat.dom.chatLog.firstChild);
			}
			var z = createElement('div');
			if (route){
				z.className = route;
			}
			z.innerHTML = msg;
			chat.dom.chatLog.appendChild(z);
			chat.scrollBottom();
		}
	}
	function updateHistory(msg) {
		var o = {
			msg: msg,
			mode: chat.modeCommand
		};
		if (chat.modeCommand === '@') {
			o.name = chat.modeName;
		}
		chat.history.push(o);
		chat.historyIndex = chat.history.length;
	}
	function help() {
		var z = 'class="chat-emote"',
			h = 'class="chat-help-header"',
			s = [
				chat.divider,
				'<div '+ h +'>Main Chat Channels:</div>',
				'<div '+ z +'>/say : Say a message in your current chat channel : /say hail</div>',
				'<div '+ z +'>/party : Message your party : /party hail</div>',
				'<div '+ z +'>/guild : Message your guild : /guild hail</div>',
				'<div '+ z +'>@ : Send a private message by name : @bob hi</div>',
				'<div '+ h +'>Guild Commands</div>',
				'<div '+ z +'>/ginvite: Invite a player to your guild: /ginvite Bob</div>',
				'<div '+ z +'>/gpromote: Promote a guild member to Officer: /gpromote Bob</div>',
				'<div '+ z +'>/gleader: Promote a guild member to Leader: /gleader Bob</div>',
				'<div '+ z +'>/gboot: Boot a member from the guild: /gboot Bob</div>',
				'<div '+ z +'>/motd: Set a new message of the day for your guild: /motd message</div>',
				'<div '+ z +'>/gquit: Leave your guild: /gquit</div>',
				'<div '+ z +'>/ginvite: Invite a player to your guild: /ginvite Bob</div>',
				'<div '+ z +'>/ginvite: Invite a player to your guild: /ginvite Bob</div>',
				'<div '+ h +'>Party Commands</div>',
				'<div '+ z +'>/invite: Invite a player to your party : /invite Bob</div>',
				'<div '+ z +'>/disband: Leave your party</div>',
				'<div '+ z +'>/promote: Promote a player in your party to leader : /promote Bob</div>',
				'<div '+ z +'>/boot: Boot a player from the party: /boot Bob</div>',
				'<div '+ h +'>Social Commands:</div>',
				'<div '+ z +'>/flist or /friends : Show your friends\' online status</div>',
				'<div '+ z +'>/friend add : Add a friend : /friend add Bob</div>',
				'<div '+ z +'>/friend remove : Remove a friend : /friend remove Bob</div>',
				'<div '+ z +'>/ignore : Show your ignore list</div>',
				'<div '+ z +'>/ignore add : Add someone to your ignore list</div>',
				'<div '+ z +'>/ignore remove : Remove someone from your ignore list</div>',
				'<div '+ z +'>/who : Show all players currently playing</div>',
				'<div '+ z +'>/who class : Show current players by class : /who warrior</div>',
				'<div '+ h +'>Miscellaneous Commands:</div>',
				'<div '+ z +'>/join channel : Join a channel : /join bros</div>',
				'<div '+ z +'>/clear: clear the chat log</div>',
				'<div '+ z +'>/played: Show character creation, session duration, and total playtime</div>',
				'<div '+ z +'>/me : Send an emote to your current chat channel : /me waves</div>',
				'<div '+ z +'>/camp: Exit the game.</div>',
			];
		for (var i=0, len=s.length; i<len; i++) {
			log(s[i]);
		}
	}
	function sendMsg(input) {
		var msg = input || chat.dom.chatInput.value.trim(),
			msgLower = msg.toLowerCase();

		// bypass via ENTER or chat has focus
		if (msg === '?' || msg === '/h' || msg === '/help') {
			chat.updateHistory(msg);
			chat.help();
		}
		/*
		/random
		/surname
		allow to form parties
			invite
			disband
			leader
			boot
		allow to form guilds
			invite
			disband
			leader
			boot
		 */
		else if (msgLower.indexOf('/motd') === 0) {
			guild.motd(guild.motdParse(msg));
		}
		else if (msgLower.indexOf('/gleader') === 0) {
			guild.leader(chat.partyParse(msg));
		}
		else if (msgLower.indexOf('/gpromote') === 0) {
			guild.promote(chat.partyParse(msg));
		}
		else if (msgLower.indexOf('/gboot') === 0) {
			guild.boot(chat.partyParse(msg));
		}
		else if (msgLower === '/gquit') {
			guild.quit();
		}
		else if (msgLower.indexOf('/ginvite') === 0) {
			guild.invite(chat.partyParse(msg));
		}
		else if (msgLower.indexOf('/promote') === 0) {
			chat.promote(chat.partyParse(msg));
		}
		else if (msgLower.indexOf('/boot') === 0) {
			chat.boot(chat.partyParse(msg));
		}
		else if (msgLower === '/disband') {
			chat.disband();
		}
		else if (msgLower.indexOf('/invite') === 0) {
			chat.invite(chat.partyParse(msg));
		}
		else if (msgLower === '/camp') {
			chat.camp();
		}
		else if (msgLower === '/played') {
			played();
		}
		else if (msgLower.indexOf('/join') === 0) {
			chat.joinChannel(joinParse(msg));
		}
		else if (msgLower === '/clear') {
			chat.clearChatLog();
		}
		else if (msgLower === '/who') {
			chat.whoAll();
		}
		else if (msgLower.indexOf('/who ') === 0 && msgLower.length > 5) {
			chat.whoClass(chat.whoParse(msg));
		}
		else if (msgLower === '/ignore') {
			chat.ignoreList();
		}
		else if (msgLower.indexOf('/ignore remove') === 0) {
			chat.ignoreRemove(chat.friendParse(msg));
		}
		else if (msgLower.indexOf('/ignore add') === 0) {
			chat.ignoreAdd(chat.friendParse(msg));
		}
		else if (msgLower === '/friends' || msgLower === '/flist') {
			chat.friendList();
		}
		else if (msgLower.indexOf('/friend remove') === 0) {
			chat.friendRemove(chat.friendParse(msg));
		}
		else if (msgLower.indexOf('/friend add') === 0) {
			chat.friendAdd(chat.friendParse(msg));
		}
		else if (msgLower.indexOf('/me') === 0 || msgLower.indexOf('/em') === 0) {
			chat.emote(msg);
		}
		else if (chat.modeCommand === '@'){
			// whisper
			if (my.name !== chat.modeName) {
				if (~ng.ignore.indexOf(chat.modeName)) {
					log('You sent ' + chat.modeName + ' a whisper, but you are currently ignoring him.', 'chat-warning');
				}
				$.post(app.url + 'chat/send.php', {
					action: 'send',
					msg: msg,
					class: 'chat-whisper',
					category: 'name' + _.toLower(chat.modeName)
				});
			}
		}
		else {
			if (msg) {
				var o = chat.getMsgObject(msg);
				if (o.msg[0] !== '/') {
					console.info(o);
					if (!my.p_id && o.category.indexOf('party') === 0) {
						log("You are not in a party.", 'chat-warning');
					}
					else if (!my.guild.id && o.category.indexOf('guild') === 0) {
						log("You are not in a guild.", 'chat-warning');
					}
					else {
						if (o.category === 'ng2') {
							log("You cannot communicate in town while in a dungeon", "chat-warning");
						}
						else {
							$.post(app.url + 'chat/send.php', {
								msg: o.msg,
								class: o.class,
								category: _.toLower(o.category)
							});
						}
					}
				}
			}
		}
		chat.updateHistory(msg);
		chat.clear();
	}
	function parseMsg(msg) {
		var arr = msg.replace(/ +/g, " ").split(" ");
		var o = {
			first: arr[0].trim().toLowerCase()
		}
		arr.shift();
		o.command = arr.join(' ');
		return o;
	}
	function getMsgObject(msg) {
		var o = {
			category: chat.getChannel(),
			msg: msg,
			class: 'chat-normal'
		};
		var parse = chat.parseMsg(msg);
		var a = msg.split(" ");

		a.shift();
		var shortCommandMsg = a.join(" ");

		// is it a command?
		if (parse.first === '/s') {
			o.category = chat.getChannel();
			o.msg = shortCommandMsg;
			o.class = 'chat-normal';
		}
		else if (parse.first === '/p') {
			o.category = 'party' + my.p_id;
			o.msg = shortCommandMsg;
			o.class = 'chat-party';
		}
		else if (chat.modeCommand === '/party'){
			o.category = 'party' + my.p_id;
			o.msg = msg;
			o.class = 'chat-party';
		}
		else if (parse.first === '/g') {
			o.category = 'guild' + my.guild.id;
			o.msg = shortCommandMsg;
			o.class = 'chat-guild';
		}
		else if (chat.modeCommand === '/guild'){
			o.category = 'guild' + my.guild.id;
			o.msg = msg;
			o.class = 'chat-guild';
		}
		else if (parse.first === '/broadcast'){
			o.category = 'adminbroadcast';
			o.msg = parse.command;
			o.class = 'chat-broadcast';
		}
		return o;
	}
	function clear() {
		chat.dom.chatInput.value = '';
	}
	function clearChatLog() {
		chat.dom.chatLog.innerHTML = '';
	}
	function emote(msg) {
		var a = msg.split(" ");
		a.shift();
		msg = a.join(" ");
		if (msg[0] !== '/') {
			$.post(app.url + 'chat/send.php', {
				msg: msg,
				class: 'chat-emote',
				category: chat.getChannel()
			});
		}
	}
	function ignoreInit() {
			ng.ignore = JSON.parse(localStorage.getItem('ignore')) || ng.ignore;
	}
	function ignoreList() {
			if (ng.ignore.length) {
				var s = chat.divider + '<div class="chat-warning">Checking ignore list...</div>';
				ng.ignore.forEach(function(v) {
					s += '<div class="chat-emote">' + v + '</div>';
				});
				log(s);
			}
			else {
				log("Nobody is on your friends list yet.", 'chat-warning');
			}
	}
	function ignoreAdd(o) {
			if (o !== my.name) {
				ng.ignore.push(o);
				localStorage.setItem('ignore', JSON.stringify(ng.ignore));
				log('You have added ' + o + ' to your ignore list.', 'chat-warning');
			}
	}
	function ignoreRemove(o) {
			while (ng.ignore.indexOf(o) > -1) {
				var index = ng.ignore.indexOf(o);
				ng.ignore.splice(index, 1);
			}
			localStorage.setItem('ignore', JSON.stringify(ng.ignore));
			log('You have removed ' + o + ' from your ignore list.', 'chat-warning');
	}
	function promote(name, bypass) {
		console.info('/promote ', name, bypass);
		// must be leader or bypass by auto-election when leader leaves
		var id = my.getPartyMemberIdByName(name);
		if ((my.party[0].isLeader || bypass) && my.p_id && id) {
			$.post(app.url + 'chat/promote.php', {
				name: _.toLower(name),
				leaderId: id
			}).done(function (data) {
				// console.info('promote ', data);
			}).fail(function (r) {
				log(r.responseText, 'chat-warning');
			});
		}
	}
	function disband() {
		if (ng.view === 'battle') {
			log("You cannot disband the party during battle!", "chat-warning");
		}
		else {
			var count = my.partyCount();
			$.post(app.url + 'chat/disband.php', {
				count: count
			}).done(function(r){
				// console.info('disband ', r);
				if (count > 1) {

				}
				if (my.p_id) {
					my.quest.level && ng.msg('Mission abandoned: '+ my.quest.title);
				}
				mission.initQuest();
				bar.disband();
				mission.abort();
			}).fail(function(r) {
				log(r.responseText, 'chat-warning');
			}).always(function() {
				ng.unlock();
			});
		}
	}
	function boot(name, bypass) {
		console.info('/promote ', name, bypass);
		// must be leader or bypass by auto-election when leader leaves
		var id = my.getPartyMemberIdByName(name);
		if ((my.party[0].isLeader || bypass) && my.p_id && id) {
			$.post(app.url + 'chat/boot.php', {
				name: _.toLower(name),
				id: id
			}).done(function (data) {
				console.info('boot ', data);
			}).fail(function (r) {
				log(r.responseText, 'chat-warning');
			});
		}
	}
	function invite(p) {
		if (my.name === p) {
			log("You can't invite yourself to a party.", "chat-warning");
		}
		else if (my.p_id && !my.party[0].isLeader) {
			log("Only the party leader may send invites.", "chat-warning");
		}
		else if (my.quest.level) {
			log("You cannot invite adventurers to the party after starting the mission.", "chat-warning");
		}
		else if (!my.channel) {
			log("You cannot invite adventurers from the depths of a dungeon.", "chat-warning");
		}
		else {
			if (p) {
				log('Sent party invite to '+ p +'.', 'chat-warning');
				console.info('p', p);
				$.post(app.url + 'chat/invite.php', {
					player: _.toLower(p)
				}).done(function(r){
					console.info('invite ', r);
					if (r.newParty) {
						my.party[0].isLeader = 1;
						bar.updatePlayerBar(0);
					}
					socket.listenParty(r.p_id);
				}).fail(function(r){
					log(r.responseText, 'chat-warning');
				});
			}
			else {
				log("Syntax: /invite [player_name]", "chat-warning");
			}
		}
	}
	function camp() {
		if (ng.view === 'town') {
			log('Camping...', 'chat-warning');
			game.exit();
			if (my.p_id) {
				if (my.party[0].isLeader) {
					// promote
					party.promotePlayer();
				}
				// disband
				chat.sendMsg('/disband')
			}
			(function repeat(count) {
				if (!my.p_id) {
					// successfully disbanded
					setTimeout(function() {
						location.reload();
					}, 500);
				}
				else {
					if (count < 30) {
						setTimeout(repeat, 100, ++count);
					}
					else {
						log("Failed to camp successfully.", "chat-warning");
					}
				}
			})(0);
		}
		else {
			log("You can only camp in town!", "chat-warning");
		}
	}
	function reply() {
		console.info('chat.lastWhisper.name', chat.lastWhisper.name);
		if (chat.lastWhisper.name) {
			var o = {
				mode: '@',
				name: chat.lastWhisper.name
			}
			chat.modeChange(o);
			chat.dom.chatInput.focus();
		}
	}
	function promptAdd(data) {
		var s = '',
			e = createElement('div'),
			id = ng.getId();

		console.info('prompt.add', data);
		e.id = data.action +'-'+ data.row;
		e.className = 'prompt-row prompt-row-' + id + ' ' + data.css;
		// write innerHTML
		s +=
			'<div class="chat-prompt-msg stag-blue">'+ data.msg +'</div>' + // col 1
			'<div class="chat-prompt-options stag-blue">'+ // col 2
				'<span data-row="'+ data.row +'" '+
					'data-id="'+ id +'" '+
					'data-action="'+ data.action +'" '+
					'data-c-id="'+ data.cId +'" '+
					'data-guild-name="'+ data.guildName +'" '+
					'class="chat-prompt-btn chat-prompt-yes">'+
					'<i class="fa fa-check chat-prompt-yes-icon"></i>&thinsp;Confirm'+
				'</span>' +
				'<span data-row="'+ data.row +'" '+
					'data-id="'+ id +'" '+
					'data-name="'+ data.name +'"'+
					'data-action="'+ data.action +'" '+
					'class="chat-prompt-btn chat-prompt-no">'+
					'<i class="fa fa-times chat-prompt-no-icon"></i>&thinsp;Deny'+
				'</span>' +
			'</div>';

		e.innerHTML = s;
		// remove double invites?
		$('#'+ data.action +'-' + data.row).remove();
		chat.dom.chatPrompt.appendChild(e);
		setTimeout(function() {
			$("#" + e.id).remove();
		}, 30000);

		log(data.msg, 'chat-warning');
	}
	function promptConfirm(data) {
		// join party by player id?
		$("#"+ data.action +"-"+ data.row).remove();
		/*
		action: "party-invite"
		id: 2
		row: 188
		 */
		// use data.row to join ng2parties
		// actually add me to the party and ZMQ msg on callback success
		// and call a method to draw the whole party including hp, mp, names etc
		// party table needs extra values... hp, mp, buffs, etc
		console.info('Prompt confirmed: ', data.action, data.row, data);
		if (data.action === 'party-invite') {
			chat.partyJoin(data);
		}
		else if (data.action === 'guild-invite') {
			guild.join(data);
		}
	}
	function promptDeny(data) {
		console.info('deny ', data);
		$("#"+ data.action +"-"+ data.row).remove();
		socket.publish("name"+ data.name, {
			action: data.action + '-deny',
			name: my.name
		});
	}
	function partyJoin(z) {
		// clicked CONFIRM
		console.info('party.join: ', z);
		$.post(app.url + 'chat/party-join.php', {
			row: z.row,
			cId: z.cId
		}).done(function(data){
			console.info("party-join.php ", data);
			log("You have joined the party.", "chat-warning");
			socket.listenParty(z.row);
			bar.getParty();
		}).fail(function(data){
			console.info("Oh no", data);
			log(data.responseText, 'chat-warning');
		});
	}
	function partyParse(msg) { // 2-part upper case
		var a = msg.replace(/ +/g, " ").split(" ");
		return a[1] === undefined ?
			'' : (a[1][0].toUpperCase() + a[1].substr(1).toLowerCase()).trim();
	}
	function whisperParse(msg) {
		// 2-part parse lower case
		var a = msg.split("whispers: ");
		return a[1];
	}
	function whisperPrefix() {
		return '[' + my.level +':<span class="chat-'+ my.job +'">'+ my.name + '</span>]';
	}
	function whisperTo(data) {
		return 'You whispered to ' + data.name + ': ';
	}
	function friendParse(o) {
		// 3-part parse
		var a = o.replace(/ +/g, " ").split(" ");
		return a[2][0].toUpperCase() + a[2].substr(1).toLowerCase().trim();
	}
	function friendInit() {
		ng.friends = ng.friends || [];
		$.get(app.url + 'chat/friend-get.php').done(function(data){
			ng.friends = data;
		});
	}
	function friendList() {
		log('<div class="chat-warning">Checking friends list...</div>');
		if (ng.friends.length){
			$.get(app.url + 'chat/friend-status.php').done(function(r){
				ng.friends = r.friends;
				console.info(r);
				var str = chat.divider + '<div>Friend List ('+ r.friends.length +')</div>';

				ng.friends.forEach(function(name, i){
					var index = r.players.indexOf(name);
					if (index > -1){
						var s = r.stats[index];
						// online
						str +=
							'<div class="chat-whisper">[' +
							s.level +' '+ ng.jobLong[s.job] +'] '+ ng.friends[i] + ' ('+ s.race +
							')' + guild.format(s) + '</div>';
					} else {
						// offline
						str += '<div class="chat-emote">[Offline] ' + name +'</div>';
					}
				});

				log(str);
			});
		}
		else {
			log("<div>You don't have any friends!</div>");
			log("<div class='chat-emote'>Use /friend [name] to add a new friend.</div>");
		}
	}
	function friendAdd(o) {
		if (ng.friends.includes(o)) {
			log(o + " is already your friend.", 'chat-warning');
		}
		else if (o.length > 1 && o !== my.name) {
			$.post(app.url + 'chat/friend-add.php', {
				friend: _.toLower(o)
			}).done(function(data){
				if (data.error) {
					log(data.error, 'chat-warning');
				}
				else {
					log('You have added ' + o + ' to your friend list.', 'chat-warning');
					socket.subscribe('friend'+ o, chat.friendNotify);
					if (!ng.friends.includes(o)) {
						socket.publish('name' + o, {
							name: my.name,
							route: "friend>addedMe"
						});
					}

					ng.friends.push(o);
				}
			});
		}
	}
	function friendRemove(o) {
		if (o.length > 1 && o !== my.name && ng.friends.indexOf(o) > -1) {
			$.post(app.url + 'chat/friend-remove.php', {
				friend: _.toLower(o)
			}).done(function(data){
				if (data.error) {
					log(data.error, 'chat-warning');
				}
				else {
					log('You have removed ' + o + ' from your friend list.', 'chat-warning');
					while (ng.friends.indexOf(o) > -1) {
						var index = ng.friends.indexOf(o);
						ng.friends.splice(index, 1);
					}
					socket.unsubscribe('friend'+ o);
				}
			});
		}
	}
	function friendNotify(data, obj) {
		data = typeof data[0] === 'object' ?
			data[0] : obj;
		if (data.route === 'on') {
			log(data.name + ' has come online.', 'chat-warning');
		}
		else {
			log(data.name + ' has gone offline.', 'chat-warning');
		}
	}
	function toPlaytime(minLeft) {
		var d = 0,
			h = 0;

		if (minLeft >= 1440) {
			d = floor(minLeft / 1440);
			minLeft = (minLeft % 1440);
		}
		if (minLeft >= 60) {
			h = floor(minLeft / 60);
			minLeft = (minLeft % 60);
		}
		var m = minLeft,
			dayStr = '',
			hourStr = '',
			minStr = '';
		if (d) {
			dayStr += d + (d > 1 ? ' days' : ' day');
		}
		if (h) {
			hourStr += h + (h > 1 ? ' hours' : ' hour');
		}
		// minutes
		minStr = m;
		if (m !== 1) {
			minStr += ' minutes';
		}
		else {
			minStr += ' minute';
		}

		if (d && h && m) {
			dayStr += ', ';
		}
		else if (d) {
			dayStr += ' ';
		}

		if (h) {
			hourStr += ', ';
		}

		if (d || h) {
			minStr = 'and ' + minStr;
		}
		return dayStr + hourStr + minStr;
	}
	function toCreateString(d) {
		d = new Date(d);
		return d.toDateString() + ' ' + d.toLocaleTimeString();
	}
	function played() {
		$.get(app.url + 'chat/played.php').done(function(r) {
			var sessionLen = Date.now() - JSON.parse(sessionStorage.getItem('startTime')),
				durationStr = chat.toPlaytime(~~(sessionLen / 100000));
			log("Character created: " + chat.toCreateString(r.created), 'chat-warning');
			log("Current session duration: " + durationStr, 'chat-whisper');
			log("Total character playtime: " + chat.toPlaytime(r.playtime), 'chat-whisper');
		});
	}
	function whoParse(msg) {
			// complex parse for class names
		var a = msg.replace(/ +/g, " ").split(" "),
			job = a[1],
			longJob = job[0].toUpperCase() + job.substr(1).toLowerCase().trim();

		// long name?
		if (ng.jobs.indexOf(longJob) > -1) {
			// convert to short
			return ng.jobShort[longJob];
		}
		else {
			var shortJobs = _.keys(ng.jobLong),
				job = job.toUpperCase();
			if (shortJobs.indexOf(job)) {
				// is it on the short job list?
				return job;
			}
			else {
				return '';
			}
		}
	}
	function whoAll() {
		$.get(app.url + 'chat/who-all.php').done(function(r){
			console.info('who ', r);
			if (r.len) {
				log(chat.divider + "There " + (r.len > 1 ? "are" : "is") +" currently "+
					r.len + " "+ (r.len > 1 ? "players" : "players") +" in Vandamor.", "chat-warning");
				// online
				var str = '';
				r.players.forEach(function(v, i){
					str +=
						'<div class="chat-whisper">[' +
						v.level +' '+ ng.jobLong[v.job] +'] '+ v.name + ' ('+ v.race +
						')' + guild.format(v) +'</div>';
				});
				log(str, 'chat-whisper');
			}
			else {
				log("Nobody is currently in Vandamor.", "chat-warning");
			}
		});
	}
	function whoClass(job) {
		console.info('who.class ', job);
		$.post(app.url + 'chat/who-class.php', {
			job: job
		}).done(function(r){
			console.info('r ', r);
			var jobLong = ng.toJobLong(job);
			if (r.len) {
				log(chat.divider + "There " + (r.len > 1 ? "are" : "is") +" currently "+
					r.len + " "+ (r.len > 1 ? jobLong + 's' : jobLong) +" in Vandamor.", "chat-warning");
				// online
				var str = '';
				r.players.forEach(function(v, i){
					str +=
						'<div class="chat-whisper">[' +
						v.level +' '+ ng.jobLong[v.job] +'] '+ v.name + ' ('+ v.race +
						')' + guild.format(v) +'</div>';
				});
				log(str, 'chat-whisper');
			}
			else if (!jobLong) {
				log("No results found. Try searching by a class name /who cleric.", "chat-warning");
			}
			else {
				log("Currently there are no " + jobLong + "s in Vandamor.", "chat-warning");
			}
		});
	}
	function scrollBottom() {
		if (!chat.isClicked && chat.initialized){
			chat.dom.chatLog.scrollTop = chat.dom.chatLog.scrollHeight;
		}
	}
	function clearLog() {
		chat.dom.chatLog.innerHTML = '';
	}
	function setHeader() {
		// or chat.presence.length ?
		chat.dom.chatHeader.innerHTML =
			my.channel + '&thinsp;(' + chat.presence.length + ')';
	}
	function joinParse(msg) {
		// 2 part parse lower case
		var c = msg.replace(/ +/g, " ").split(" ");
		return c[1] === undefined ?
			'' : c[1].toLowerCase().trim();
	}
	function joinChannel(channel, bypass) {
		if (ng.view === 'town' || bypass) {
			if (channel) {
				// remove from channel
				if (channel !== my.channel) {
					$.post(app.url + 'chat/set-channel.php', {
						channel: channel
					}).done(function (data) {
						clearLog();
						log('<span class="chat-warning">Joined channel: ' + data.channel + '</span>');
						console.info('joinChannel', data);
						joinChangeCallback(data);
					});
				}
			}
			else {
				chat.joinDefault();
			}
		}
	}
	function joinDefault() {
		if (my.channel !== chat.default) {
			$.post(app.url + 'chat/set-channel.php', {
				channel: chat.default
			}).done(joinChangeCallback);
		}
	}
	function joinChangeCallback(data) {
		publishRemove();
		console.info("You have changed channel to: ", data.channel);
		// unsub prior channel
		my.channel && socket.unsubscribe(chat.getChannel());
		// set new channel data
		my.channel = data.channel;
		socket.subscribe('ng2' + data.channel, socket.routeMainChat); // main chat channel
		// add to chat channel
		chat.presence = [];
		$('#chat-room').empty();
		game.upsertRoom({
			row: my.row,
			level: my.level,
			job: my.job,
			name: my.name,
			time: Date.now()
		});
		game.requestPresence();
		chat.setHeader();
		game.heartbeatSend();
	}
	function publishRemove() {
		socket.publish(chat.getChannel(), {
			route: 'chat->remove',
			row: my.row
		});
	}
	function sizeSmall() {
		TweenMax.set('#chat-present-wrap', {
			display: 'none'
		});
		TweenMax.set('#chat-wrap', {
			height: '25vh',
			width: '35vw'
		});
		TweenMax.set('#chat-log-wrap', {
			flexBasis: '100%'
		});
	}
	function sizeLarge() {
			TweenMax.set('#chat-present-wrap', {
				display: 'flex'
			});
			TweenMax.set('#chat-wrap', {
				height: '50vh',
				width: '50vw'
			});
			TweenMax.set('#chat-log-wrap', {
				flexBasis: '70%'
			});
	}
})();