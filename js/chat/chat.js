var chat;
(function(TweenMax, _, $, undefined) {
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
		historyIndex: 0,
		history: [],
		divider: '<div class="chat-help">======================================</div>',
		whispers: {},
		presence: [],
		modeTypes: [
			'/say',
			'/s ',
			'/town', // alias for say
			'/party',
			'/p ', // alias
			'/guild',
			'/g ', // alias
		],
		modeCommand: '/say',
		modeName: '',
		focusKeys: ['/', 'Enter', 't'],
		inputHasFocus: false,
		chatLogEl: querySelector('#chat-log'),
		log,
		init,
		getChannel,
		modeChange,
		modeSet,
		updateHistory,
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
		sizeDungeon,
		sizeTown,
		prepare,
		getPrefix,
		focusChatInput,
		clearChatLog,
		help,
		handleChatInputFocus,
		handleChatInputBlur,
	}
	const maxLogMessages = 400
	var el;
	/*
	border: 1px solid #048;
	background: rgba(0,0,0,.6);
	 */
	$('#chat-input').on('blur', chat.handleChatInputBlur)
		.on('focus', chat.handleChatInputFocus)

	$('#chat-input-wrap').on('mouseenter', handleChatInputEnter)
		.on('mouseleave focus', handleChatInputLeave)

	function handleChatInputBlur() {
		if (querySelector('#chat-input').value.length) {
			// do nothing
		}
		else {
			/*TweenMax.to('#chat-input-wrap', 0, {
				opacity: 0
			})
			TweenMax.to('#chat-input', 0, {
				background: 'rgba(0,0,0,0)',
				border: '1px solid #0000'
			})*/
		}
		chat.inputHasFocus = false
	}

	/**
	 * force user's focus to input
	 */
	function focusChatInput() {
		query.el('#chat-input').focus()
	}
	function handleChatInputFocus() {
		/*TweenMax.set('#chat-input-wrap', {
			opacity: 1
		})
		TweenMax.set('#chat-input', {
			background: '#000a',
			border: '1px solid #048',
		})*/
		chat.inputHasFocus = true
	}
	// opacity
	function handleChatInputEnter() {
		if (!chat.inputHasFocus) {
			/*TweenMax.to('#chat-input-wrap', .1, {
				opacity: 1
			})
			TweenMax.to('#chat-input', .1, {
				background: '#0006'
			})*/
		}
	}
	function handleChatInputLeave() {
		if (chat.inputHasFocus || querySelector('#chat-input').value.length) {
			// do nothing
		}
		else {
			/*TweenMax.to('#chat-input-wrap', .15, {
				opacity: 0
			})*/
		}
	}

	/** public */
	function getChannel() {
		return _.toLower(chat.prefix + my.channel);
	}
	function modeChange(h) {
		// only trim leading spaces
		var mode = h === void 0 ? (query.el('#chat-input').value + ng.lastKey) : h.mode;
		// replace all spaces?
		mode = mode.replace(/^\s+/g, '');

		if (mode === '/say' && !my.channel) {
			console.warn("You cannot communicate to town while in a dungeon", CHAT.WARNING);
			delayedCall(0, () => {
				// wipe input after keyup to get rid of /say
				query.el('#chat-input').value = ''
			});
			return false;
		}
		// known standard mode
		else if (chat.modeTypes.includes(mode)) {
			chat.modeCommand = mode;
			chat.modeSet(mode);
			if (!h) {
				query.el('#chat-input').value = '';
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
				query.el('#chat-input').value = '';
			}
			return true;
		}
		else {
			return false;
		}
	}
	function modeSet(mode) {
		if (mode === '/town' || mode === '/s ') mode = '/say'
		else if (mode === '/p ') mode = '/party'
		else if (mode === '/g ') mode = '/guild'
		chat.modeCommand = mode
		if (mode === '/say') {
			query.el('#chat-input-mode').className = 'chat-pink'
			query.el('#chat-mode-msg').textContent = 'To ' + my.channel + ':'
		}
		else if (mode === '/party') {
			query.el('#chat-input-mode').className = 'chat-party'
			query.el('#chat-mode-msg').textContent = 'To party:'
		}
		else if (mode === '/guild') {
			query.el('#chat-input-mode').className = 'chat-guild'
			query.el('#chat-mode-msg').textContent = 'To guild:'
		}
		else if (mode === '@') {
			query.el('#chat-input-mode').className = 'chat-whisper'
			query.el('#chat-mode-msg').textContent = 'To '+ chat.modeName +':'
		}
	}
	function init() {
		// default initialization of chat
		if (!chat.initialized) {
			querySelector('#footer-ui-component').style.display = 'flex'
			chat.initialized = 1;
			// show
			// prevents auto scroll while scrolling
			/*$('#chat-log')
				.on('mousedown', handleMousedownChatLog)
				.on('mouseup', handleMouseupChatLog);*/

			$("#chat-room")
				.on('click contextmenu', '.chat-player', handlePlayerClick);
		}
	}
	/*function handleMousedownChatLog() {
		chat.isClicked = true
	}
	function handleMouseupChatLog() {
		chat.isClicked = false;
	}*/
	function handlePlayerClick(event) {
		var {row, name} = _.pick(event.currentTarget.dataset, KEYS.PLAYER_CLICK)
		context.player.name = name
		context.player.row = row * 1
		// console.info(this)
		// console.info(event)
		context.setChatMenuHtml()
	}

	function log(msg, className) {
		// report to chat-log
		if (msg){
			// console.info('childElementCount', chat.chatLogEl.childElementCount)
			while (chat.chatLogEl.childElementCount >= maxLogMessages) {
				chat.chatLogEl.removeChild(chat.chatLogEl.firstChild)
			}
			var el = createElement('div')
			el.classList.add('chat-all')
			if (className) {
				el.classList.add(className)
			}
			el.innerHTML = msg
			chat.chatLogEl.appendChild(el)
			chat.scrollBottom()
			/*if (ng.view !== 'town') {
				TweenMax.to(el, .2, {
					delay: 20,
					opacity: 0
				})
			}*/

		}
	}
	function updateHistory(msg) {
		var o = {
			msg: msg,
			mode: chat.modeCommand
		}
		if (chat.modeCommand === '@') {
			o.name = chat.modeName
		}
		chat.history.push(o)
		chat.historyIndex = chat.history.length
	}
	const helpArray = [
		'<div data-id="general" class="chat-help-header">General Chat Channels:</div>',
		'<div data-id="general chat" class="chat-help">/say or /s : Say a message in your current town channel : /say hail</div>',
		'<div data-id="general town chat" class="chat-help">/town : An alias for /say : /town hail</div>',
		'<div data-id="general chat private whisper send receive" class="chat-help">@ : Send a private message by name : @bob hi</div>',
		////////////////////////////
		'<div data-id="guild" class="chat-help-header">Guild Commands</div>',
		'<div data-id="guild organize clan" class="chat-help">/guild or /g: Message your guild : /guild hail</div>',
		'<div data-id="guild" class="chat-help">/ginvite: Invite a player to your guild: /ginvite Bob</div>',
		'<div data-id="guild boot" class="chat-help">/gpromote: Promote a member to Officer: /gpromote Bob</div>',
		'<div data-id="guild fire" class="chat-help">/gdemote: Demote an officer to a member: /gdemote Bob</div>',
		'<div data-id="guild dictator" class="chat-help">/gleader: Promote a guild member to leader: /gleader Bob</div>',
		'<div data-id="guild kick" class="chat-help">/gboot: Boot a member from the guild: /gboot Bob</div>',
		'<div data-id="guild" class="chat-help">/motd: Set a new message of the day: /motd message</div>',
		'<div data-id="guild" class="chat-help">/gquit: Leave your guild: /gquit</div>',
		////////////////////////////
		'<div data-id="party group" class="chat-help-header">Party Commands</div>',
		'<div data-id="party group" class="chat-help">/party or /p : Message your party : /party hail</div>',
		'<div data-id="party group" class="chat-help">/invite: Invite a player to your party : /invite Bob</div>',
		'<div data-id="party group" class="chat-help">/disband: Leave your party</div>',
		'<div data-id="party group" class="chat-help">/promote: Promote a player in your party to leader (in town) : /promote Bob</div>',
		'<div data-id="party group" class="chat-help">/boot: Boot a player from the party: /boot Bob</div>',
		////////////////////////////
		'<div data-id="social" class="chat-help-header">Social Commands:</div>',
		'<div data-id="social friend fren buddy" class="chat-help">/flist or /friends : Show your friends\' online status</div>',
		'<div data-id="social friend fren buddy" class="chat-help">/friend add : Add a friend : /friend add Bob</div>',
		'<div data-id="social friend fren buddy" class="chat-help">/friend remove : Remove a friend : /friend remove Bob</div>',
		'<div data-id="social ignore" class="chat-help">/ignore : Show your ignore list</div>',
		'<div data-id="social ignore" class="chat-help">/ignore add : Add someone to your ignore list</div>',
		'<div data-id="social ignore" class="chat-help">/ignore remove : Remove someone from your ignore list</div>',
		'<div data-id="social" class="chat-help">/who or / : Show all players currently playing</div>',
		'<div data-id="social" class="chat-help">/who filters : Show current players by class, race, level range, name : /who 5 10 dwarf cleric</div>',
		'<div data-id="misc" class="chat-help-header">Miscellaneous Commands:</div>',
		'<div data-id="misc private" class="chat-help">/join channel : Join a channel : /join bros</div>',
		'<div data-id="misc" class="chat-help">/clear: clear the chat log</div>',
		'<div data-id="misc" class="chat-help">/played: Show character creation, session duration, and total playtime</div>',
		'<div data-id="misc" class="chat-help">/me : Send an emote to your current chat channel : /me waves</div>',
		'<div data-id="misc" class="chat-help">/camp: Exit the game.</div>',
	]
	function help(filter = '') {
		chat.log(helpArray.filter(h => h.includes(filter)).join(''))
	}
	function sendMsg(input) {
		var msg = input || query.el('#chat-input').value.trim(),
			msgLower = msg.toLowerCase();

		// bypass via ENTER or chat has focus
		if (msg === '/h' || msg.startsWith('/help')) {
			var filter = msg.split(' ')
			if (filter[1] && filter[1].length) chat.help(filter[1].toLowerCase())
			else chat.help()
		}
		else if (msgLower.startsWith('/motd')) guild.motd(guild.motdParse(msg))
		else if (msgLower.startsWith('/gleader')) guild.leader(party.parse(msg))
		else if (msgLower.startsWith('/gpromote')) guild.promote(party.parse(msg))
		else if (msgLower.startsWith('/gdemote')) guild.demote(party.parse(msg))
		else if (msgLower.startsWith('/gboot')) guild.boot(party.parse(msg))
		else if (msgLower === '/gquit') guild.disband()
		else if (msgLower.startsWith('/ginvite')) guild.invite(party.parse(msg))
		else if (msgLower.startsWith('/promote')) party.promote(party.parse(msg))
		else if (msgLower.startsWith('/boot')) party.boot(party.parse(msg))
		else if (msgLower === '/disband') party.disband()
		else if (msgLower.startsWith('/invite')) party.invite(party.parse(msg))
		else if (msgLower === '/camp') chat.camp({bypass: false})
		else if (msgLower === '/played') game.played()
		else if (msgLower.startsWith('/join')) chat.joinChannel(joinParse(msg))
		else if (msgLower === '/clear') chat.clearChatLog()
		else if (msgLower === '/who' || msgLower === '/') who.all()
		else if (msgLower.startsWith('/who ') && msgLower.length > 5 ||
			msgLower.startsWith('/ ') && msgLower.length > 2) {
			who.byFilter(msgLower);
		}
		else if (msgLower === '/ignore') ignore.list()
		else if (msgLower.startsWith('/ignore remove')) ignore.remove(friend.parse(msg))
		else if (msgLower.startsWith('/ignore add')) ignore.add(friend.parse(msg))
		else if (msgLower === '/friends' || msgLower === '/flist' || msgLower === '/friend') friend.list()
		else if (msgLower.startsWith('/friend remove')) friend.remove(friend.parse(msg))
		else if (msgLower.startsWith('/friend add')) friend.add(friend.parse(msg))
		else if (msgLower.startsWith('/me') || msgLower.startsWith('/em')) chat.emote(msg)
		else if (chat.modeCommand === '@'){
			// whisper
			if (my.name !== chat.modeName) {
				if (ng.ignore.includes(chat.modeName)) {
					chat.log('You sent ' + chat.modeName + ' a whisper, but you are currently ignoring them.', CHAT.WARNING)
				}
				if (msg) {
					socket.publish('name' + _.toLower(chat.modeName), {
						job: my.job,
						name: my.name,
						level: my.level,
						action: 'send',
						msg: msg,
						route: 'chat->log',
						class: 'chat-whisper'
					})
					whisper.sendTimer = delayedCall(1.5, () => {
						chat.log('Your message to ' + chat.modeName + ' was not delivered successfully.', CHAT.WARNING)
					})
				}
				else {
					chat.log('You whispered too quietly! Don\'t be shy!', CHAT.WARNING)
				}
			}
			else {
				chat.log('You feel your grip on sanity weaken. Was I just whispering to myself?', CHAT.WARNING)
			}
		}
		else if (msgLower.startsWith('/') &&
			( !msgLower.startsWith('/broadcast') && !msgLower.startsWith('/campall') )
		) {
			// no idea why this is here
			chat.log('Command not found. Try /h or /help to check the list of valid commands.', CHAT.WARNING)
		}
		else {
			if (msg) {
				// console.info('msgLower', msg, msgLower)
				var o = chat.getMsgObject(msg);
				if (o.msg[0] !== '/') {
					// console.info(o)
					if (!my.guild.id && o.category.startsWith('guild')) {
						chat.log('You are not in a guild. You can create one at the Guild Hall in town.', CHAT.WARNING)
					}
					else {
						if (o.category === 'ng2') {
							chat.log('You cannot communicate to town while in a dungeon.', CHAT.WARNING)
						}
						else {
							// console.info('asdf', o)
							socket.publish(o.category, {
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
		chat.updateHistory(msg)
		chat.clearInput()
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
		// console.info('parse', parse)
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
		else if (parse.first === '/campall'){
			o.category = 'allbroadcast'
			o.msg = ''
			o.class = 'chat-camp'
		}
		return o;
	}
	function clearInput() {
		query.el('#chat-input').value = '';
	}
	function clearChatLog() {
		chat.chatLogEl.innerHTML = '';
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

	/**
	 * called via exit game, reset game, camp
	 * @param event
	 */
	function camp(event = {}) {
		if (chat.isCamped) return;
		if (!event.bypass && map.inCombat) {
			chat.log('You cannot camp while in battle!')
		}
		else {
			chat.isCamped = true;
			if (ng.view !== 'title') {
				console.log('Camping...', CHAT.WARNING);
			}
			// from town
			if (ng.view === 'town') {
				chat.publishRemove()
			}
			if (party.hasMoreThanOnePlayer()) {
				// boot from party
				party.disband()
			}
			if (trade.data.name) {
				town.closeVarious()
			}
			// notify friends
			socket.publish('friend' + my.name, {
				name: my.name,
				route: 'off'
			}, true);
			var minutes = game.getCachedMinutes();
			if (minutes) {
				$.post(app.url + 'camp.php', {
					minutes: game.getCachedMinutes()
				}).done(() => {
					localStorage.setItem(game.storageId, 0)
					ng.lock()
					delayedCall(.5, ng.reloadGame)
				});
			}
			else {
				ng.lock()
				delayedCall(.5, ng.reloadGame)
			}
		}
	}
	function reply() {
		// console.info('chat.lastWhisper.name', chat.lastWhisper.name);
		if (chat.lastWhisper.name) {
			var o = {
				mode: '@',
				name: chat.lastWhisper.name
			}
			chat.modeChange(o)
			chat.focusChatInput()
		}
	}
	function scrollBottom() {
		if (!chat.isClicked && chat.initialized){
			chat.chatLogEl.scrollTop = chat.chatLogEl.scrollHeight;
		}
	}
	function setHeader() {
		// or chat.presence.length ?
		query.el('#chat-header').innerHTML =
			'<span class="ellipsis">' + my.channel + '</span>' + '<span id="chat-header-count">&thinsp;(' + chat.presence.length + ')</span>';
	}
	function joinParse(msg) {
		// 2 part parse lower case
		var c = msg.replace(/ +/g, " ").split(" ");
		return c[1] === void 0 ?
			'' : c[1].toLowerCase().trim();
	}
	function joinChannel(channel, bypass, keepLog) {
		if (ng.view === 'town' || bypass) {
			if (channel) {
				console.info('joinChannel', channel)
				// remove from channel
				if (channel !== my.channel) {
					$.post(app.url + 'chat/set-channel.php', {
						channel: channel
					}).done(data => {
						!keepLog && clearChatLog()
						// console.log('<span class="chat-warning">Joined channel: ' + data.channel + '</span>')
						joinChangeCallback(data)
					});
				}
			}
			else {
			console.info('joinChannel joinDefault')
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
		// console.info("You have changed channel to: ", data.channel);
		// unsub prior channel
		my.channel && socket.unsubscribe(chat.getChannel())
		// set new channel data
		my.channel = data.channel
		if (chat.modeCommand !== '/say') {
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
		game.updateChat()
	}
	function publishRemove() {
		socket.publish(chat.getChannel(), {
			route: 'chat->remove',
			row: my.row
		});
	}
	function sizeDungeon() {
		TweenMax.set('#chat-present-wrap', CSS.DISPLAY_NONE)
	}
	function sizeTown() {
		TweenMax.set('#chat-present-wrap', CSS.DISPLAY_FLEX)
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

})(TweenMax, _, $);