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
		camp,
		reply,
		whisperParse,
		whisperPrefix,
		whisperTo,
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
				toast.confirm($(this).data());
			}).on('click', '.chat-prompt-no', function(e){
				toast.deny($(this).data());
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
		else if (msgLower.startsWith('/motd')) {
			guild.motd(guild.motdParse(msg));
		}
		else if (msgLower.startsWith('/gleader')) {
			guild.leader(party.parse(msg));
		}
		else if (msgLower.startsWith('/gpromote')) {
			guild.promote(party.parse(msg));
		}
		else if (msgLower.startsWith('/gboot')) {
			guild.boot(party.parse(msg));
		}
		else if (msgLower === '/gquit') {
			guild.quit();
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
			played();
		}
		else if (msgLower.startsWith('/join')) {
			chat.joinChannel(joinParse(msg));
		}
		else if (msgLower === '/clear') {
			chat.clearChatLog();
		}
		else if (msgLower === '/who') {
			chat.whoAll();
		}
		else if (msgLower.startsWith('/who ') && msgLower.length > 5) {
			chat.whoClass(chat.whoParse(msg));
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
		else if (msgLower === '/friends' || msgLower === '/flist') {
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
					if (!my.partyId && o.category.startsWith('party')) {
						log("You are not in a party.", 'chat-warning');
					}
					else if (!my.guild.id && o.category.startsWith('guild')) {
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
	function camp() {
		if (ng.view === 'town') {
			log('Camping...', 'chat-warning');
			game.exit();
			if (my.partyId) {
				if (party.presence[0].isLeader) {
					// promote
					party.promotePlayer();
				}
				// disband
				chat.sendMsg('/disband')
			}
			(function repeat(count) {
				if (!my.partyId) {
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
		game.getPresence();
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
			bottom: '0',
			top: 'auto',
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
				top: '0',
				bottom: 'auto',
				height: '50vh',
				width: '50vw'
			});
			TweenMax.set('#chat-log-wrap', {
				flexBasis: '70%'
			});
	}
})();