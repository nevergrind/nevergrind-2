var chat;
(function() {
	/** public */
	chat = {
		prefix: 'ng2',
		isCamped: false,
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
		divider: '<div class="chat-emote">======================================</div>',
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
		clearInput,
		emote,
		camp,
		reply,
		scrollBottom,
		setHeader,
		joinChannel,
		joinDefault,
		joinChangeCallback,
		publishRemove,
		clearLog,
		sizeSmall,
		sizeLarge,
		prepare,
		getPrefix,
	}
	var el;
	var resp;
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
				'<div id="chat-input-wrap">' +
					'<div id="chat-input-mode" class="chat-pink no-select">'+
						'<span id="chat-mode-msg" class="ellipsis">To town:</span>' +
					'</div>' +
					'<input id="chat-input" type="text" maxlength="240" autocomplete="off" spellcheck="false" />' +
				'</div>' +
			'</div>';
		return s;
	}
	function modeChange(h) {
		// only trim leading spaces
		var mode = h === undefined ? (chat.dom.chatInput.value + ng.lastKey) : h.mode;
		var mode = mode.replace(/^\s+/g, '');

		if (mode === '/say' && !my.channel) {
			log("You cannot communicate in town while in a dungeon", 'chat-warning');
			delayedCall(0, function() {
				// wipe input after keyup to get rid of /say
				$("#chat-input").val('');
			});
			return false;
		}
		// known standard mode
		else if (chat.modeTypes.includes(mode)) {
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
				var parse = chat.parseMsg(mode);
				var name = _.capitalize(parse.first.substr(1));
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
			chat.dom.chatInputMode.className = 'chat-pink';
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
			$("#chat-log").on('mousedown', function(){
				chat.isClicked = true;
			}).on('mouseup', function(){
				chat.isClicked = false;
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
		}
	}
	function log(msg, className) {
		// report to chat-log
		if (msg){
			while (chat.dom.chatLog.childElementCount >= 500) {
				chat.dom.chatLog.removeChild(chat.dom.chatLog.firstChild);
			}
			var el = createElement('div');
			if (className){
				el.className = className;
			}
			console.info('msg', msg)
			el.innerHTML = msg;
			chat.dom.chatLog.appendChild(el);
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
				'<div '+ z +'>/gpromote: Promote a member to Officer: /gpromote Bob</div>',
				'<div '+ z +'>/gdemote: Demote an officer to a member: /gdemote Bob</div>',
				'<div '+ z +'>/gleader: Promote a guild member to leader: /gleader Bob</div>',
				'<div '+ z +'>/gboot: Boot a member from the guild: /gboot Bob</div>',
				'<div '+ z +'>/motd: Set a new message of the day: /motd message</div>',
				'<div '+ z +'>/gdisband: Leave your guild: /gdisband</div>',
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
				'<div '+ z +'>/who or / : Show all players currently playing</div>',
				'<div '+ z +'>/who filters : Show current players by class, race, level range, name : /who 5 10 dwarf cleric</div>',
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
		allow to form guilds
			invite
			disband
			leader
			boot
		 */
		else if (msgLower.startsWith('/motd')) {
			guild.motd(guild.motdParse(msg));
		}
		else if (msgLower.startsWith('/gleader')) {
			guild.leader(party.parse(msg));
		}
		else if (msgLower.startsWith('/gpromote')) {
			guild.promote(party.parse(msg));
		}
		else if (msgLower.startsWith('/gdemote')) {
			guild.demote(party.parse(msg));
		}
		else if (msgLower.startsWith('/gboot')) {
			guild.boot(party.parse(msg));
		}
		else if (msgLower === '/gdisband') {
			guild.disband();
		}
		else if (msgLower.startsWith('/ginvite')) {
			guild.invite(party.parse(msg));
		}
		else if (msgLower.startsWith('/promote')) {
			party.promote(party.parse(msg));
		}
		else if (msgLower.startsWith('/boot')) {
			party.boot(party.parse(msg));
		}
		else if (msgLower === '/disband') {
			party.disband();
		}
		else if (msgLower.startsWith('/invite')) {
			party.invite(party.parse(msg));
		}
		else if (msgLower === '/camp') {
			chat.camp();
		}
		else if (msgLower === '/played') {
			game.played();
		}
		else if (msgLower.startsWith('/join')) {
			chat.joinChannel(joinParse(msg));
		}
		else if (msgLower === '/clear') {
			clearChatLog();
		}
		else if (msgLower === '/who' || msgLower === '/') {
			who.all();
		}
		else if (
			msgLower.startsWith('/who ') && msgLower.length > 5 ||
			msgLower.startsWith('/ ') && msgLower.length > 2
		) {
			who.byFilter(msgLower);
		}
		else if (msgLower === '/ignore') {
			ignore.list();
		}
		else if (msgLower.startsWith('/ignore remove')) {
			ignore.remove(friend.parse(msg));
		}
		else if (msgLower.startsWith('/ignore add')) {
			ignore.add(friend.parse(msg));
		}
		else if (msgLower === '/friends' || msgLower === '/flist' || msgLower === '/friend') {
			friend.list();
		}
		else if (msgLower.startsWith('/friend remove')) {
			friend.remove(friend.parse(msg));
		}
		else if (msgLower.startsWith('/friend add')) {
			friend.add(friend.parse(msg));
		}
		else if (msgLower.startsWith('/me') || msgLower.startsWith('/em')) {
			chat.emote(msg);
		}
		else if (chat.modeCommand === '@'){
			// whisper
			if (my.name !== chat.modeName) {
				if (ng.ignore.includes(chat.modeName)) {
					log('You sent ' + chat.modeName + ' a whisper, but you are currently ignoring him.', 'chat-warning');
				}
				info('@ send', msg)
				socket.publish('name' + _.toLower(chat.modeName), {
					job: my.job,
					name: my.name,
					level: my.level,
					action: 'send',
					msg: msg,
					route: 'chat->log',
					class: 'chat-whisper'
				})
			}
		}
		else if (msgLower.startsWith('/')) {
			chat.log('Command not found. Try /h or /help to check the list of valid commands.', 'chat-warning')
		}
		else {
			if (msg) {
				var o = chat.getMsgObject(msg);
				if (o.msg[0] !== '/') {
					console.info(o)
					if (!my.guild.id && o.category.startsWith('guild')) {
						log("You are not in a guild.", 'chat-warning')
					}
					else {
						if (o.category === 'ng2') {
							log("You cannot communicate in town while in a dungeon", 'chat-warning')
						}
						else {
							socket.publish(_.toLower(o.category), {
								job: my.job,
								name: my.name,
								level: my.level,
								msg: o.msg,
								class: o.class,
								route: 'chat->log',
							})
						}
					}
				}
			}
		}
		chat.updateHistory(msg);
		chat.clearInput();
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
			o.category = 'party' + my.partyId;
			o.msg = shortCommandMsg;
			o.class = 'chat-party';
		}
		else if (chat.modeCommand === '/party'){
			o.category = 'party' + my.partyId;
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
			o.category = 'allbroadcast';
			o.msg = parse.command;
			o.class = 'chat-broadcast';
		}
		return o;
	}
	function clearInput() {
		chat.dom.chatInput.value = '';
	}
	function clearChatLog() {
		chat.dom.chatLog.innerHTML = '';
	}
	function emote(msg) {
		var a = msg.split(' ');
		a.shift();
		msg = a.join(' ');
		if (msg[0] !== '/') {
			socket.publish(chat.getChannel(), {
				job: my.job,
				name: my.name,
				level: my.level,
				msg: msg,
				route: 'chat->log',
				class: 'chat-emote',
			})
		}
	}
	function camp() {
		if (chat.isCamped) return;
		chat.isCamped = true;
		if (ng.view === 'battle') {
			chat.log('You cannot camp while in battle!')
		}
		else {
			if (ng.view !== 'title') {
				log('Camping...', 'chat-warning');
			}
			// from town
			if (ng.view === 'town') {
				chat.publishRemove()
			}
			if (party.presence.length > 1) {
				// boot from party
				party.disband()
			}
			// notify friends
			socket.publish('friend' + my.name, {
				name: my.name,
				route: 'off'
			});
			var minutes = game.getCachedMinutes();
			if (minutes) {
				$.post(app.url + 'camp.php', {
					minutes: game.getCachedMinutes()
				}).done(() => {
					localStorage.setItem(game.storageId, 0)
					location.reload();
				});
			}
			else {
				location.reload();
			}
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
			'<span class="ellipsis">' + my.channel + '</span>' + '<span id="chat-header-count">&thinsp;(' + chat.presence.length + ')</span>';
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
		my.channel && socket.unsubscribe(chat.getChannel())
		// set new channel data
		my.channel = data.channel
		if (chat.modeCommand === '/say') {
			chat.modeSet('/say')
		}
		socket.subscribe('ng2' + data.channel, socket.routeMainChat) // main chat channel
		// add to chat channel
		chat.presence = [];
		$('#chat-room').empty()
		game.upsertRoom({
			row: my.row,
			level: my.level,
			job: my.job,
			name: my.name,
			time: Date.now()
		})
		game.getPresence()
		chat.setHeader()
		game.heartbeatSend()
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
			bottom: '50px',
			height: '24%',
			width: '28%'
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
			bottom: '50px',
			height: '24%',
			width: '35%'
		});
		TweenMax.set('#chat-log-wrap', {
			flexBasis: '70%'
		});
	}

	/**
	 * takes in data object; returns msg string with formatted msg prefix
	 * @param data
	 * @returns {string}
	 */
	function prepare(data) {
		if (data.class === 'chat-whisper') {
			return getPrefix(data) + ' whispers: ' + stripTags(data.msg)
		}
		else {
			if (data.class === 'chat-normal') {
				return getPrefix(data) + ' says: ' + stripTags(data.msg)
			}
			else {
				return getPrefix(data) + ': ' + stripTags(data.msg)
			}
		}
	}

	function getPrefix(data) {
		return '[' + data.level + ':<span class="chat-' + data.job + '">' +
				data.name + '</span>]'
	}

	function stripTags(html) {
		el = createElement('div');
		el.innerHTML = html;
		return el.textContent || el.innerText || '';
	}

})();