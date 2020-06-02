var context;
(function ($, _, undefined) {
	context = {
		id: '',
		timer: new delayedCall(0, ''),
		isOpen: 0,
		player: {},
		padding: 10,
		openDate: 0,
		isInside: 0,
		halfWidth: ~~($("#context-wrap").width() / 2),
		init,
		contextBoot,
		show,
		hide,
		hideCheck,
		contextInvite,
		contextTrade,
		contextWhisper,
		contextAddFriend,
		contextAddIgnore,
		contextRemoveFriend,
		contextRemoveIgnore,
		contextDisband,
		contextPromote,
		setChatMenuHtml,
		setPartyMenuHtml,
	}
	var el, z, isMenuAbove, yAdjust, id
	////////////////////////////////////
	function init() {
		$("#context-wrap").on('click', '.context-items', handleContextClick)
			.on('mouseenter', handleMouseEnter)
			.on('mouseleave', handleMouseLeave)
	}

	function contextTrade() {
		warn('contextTrade', context.player)
		if (!trade.canTrade()) chat.log('You are already trading with ' + trade.data.name +'.', 'chat-warning')
		else trade.init()
	}

	function handleContextClick() {
		console.info('context-items clicked: ', this.id);
		id = this.id
		if (id === 'context-invite') context.contextInvite()
		else if (id === 'context-trade') context.contextTrade()
		else if (id === 'context-whisper') context.contextWhisper()
		else if (id === 'context-add-friend') context.contextAddFriend()
		else if (id === 'context-add-ignore') context.contextAddIgnore()
		else if (id === 'context-remove-friend') context.contextRemoveFriend()
		else if (id === 'context-remove-ignore') context.contextRemoveIgnore()
		else if (id === 'context-boot') context.contextBoot()
		else if (id === 'context-promote') context.contextPromote()
		else if (id === 'context-disband') context.contextDisband()
		context.hide()
	}
	function handleMouseEnter() {
		context.isInside = 1;
	}

	function handleMouseLeave() {
		context.isInside = 0;
		context.timer.kill()
		delayedCall(1, function () {
			if (!context.isInside) {}
		})
	}
	function contextWhisper() {
		chat.dom.chatInput.value = '';
		chat.modeChange({
			msg: '',
			mode: '@',
			name: context.player.name
		});
		chat.dom.chatInput.focus();
	}
	function contextAddFriend() {
		chat.sendMsg('/friend add ' + context.player.name);
	}
	function contextAddIgnore() {
		chat.sendMsg('/ignore add ' + context.player.name);
	}
	function contextInvite() {
		chat.sendMsg('/invite ' + context.player.name);
	}
	function contextRemoveFriend() {
		chat.sendMsg('/friend remove ' + context.player.name);
	}
	function contextRemoveIgnore() {
		chat.sendMsg('/ignore remove ' + context.player.name);
	}
	function contextDisband() {
		chat.sendMsg('/disband');
	}
	function contextPromote() {
		chat.sendMsg('/promote ' + context.player.name);
	}
	function contextBoot() {
		chat.sendMsg('/boot ' + context.player.name);
	}
	function setPartyMenuHtml() {
		if (!context.player.name) return;
		console.info('setPartyMenuHtml', context.player.name);

		var z = ' class="context-items"',
			s = '';

		if (context.player.name === my.name) {
			// commands only for me
			// disband
			if (party.hasMoreThanOnePlayer()) {
				s += '<div id="context-disband" ' + z + '>Disband</div>';
			}
		}
		else {
			// promote
			if (party.presence[0].isLeader) {
				s += '<div id="context-boot" ' + z + '>Boot</div>'
				s += '<div id="context-promote" ' + z + '>Promote</div>'
			}
			// whisper
			s += '<div id="context-whisper" ' + z + '>Whisper</div>' +
				'<div id="context-trade" ' + z + '>Trade</div>'
			// friend list
			if (ng.friends.includes(context.player.name)) {
				s += '<div id="context-remove-friend" ' + z + '>Unfriend</div>'
			}
			else {
				s += '<div id="context-add-friend" ' + z + '>Friend</div>'
			}
			// ignore list
			if (ng.ignore.includes(context.player.name)) {
				s += '<div id="context-remove-ignore" ' + z + '>Unignore</div>'
			}
			else {
				s += '<div id="context-add-ignore" ' + z + '>Ignore</div>'
			}
		}
		s && context.show(s);
	}
	function setChatMenuHtml() {
		if (!context.player.name || context.player.name === my.name) return;

		var z = ' class="context-items"',
			s = '';
		// is this guy in my party?
		if (!my.getPartyNames().includes(context.player.name)) {
			s += '<div id="context-invite" ' + z + '>Invite</div>'
		}
		s +=  '<div id="context-trade" ' + z + '>Trade</div>' +
			'<div id="context-whisper" ' + z + '>Whisper</div>';
		// friend list
		if (ng.friends.includes(context.player.name)) {
			s += '<div id="context-remove-friend" ' + z + '>Unfriend</div>';
		}
		else {
			s += '<div id="context-add-friend" ' + z + '>Friend</div>';
		}
		// ignore list
		if (ng.ignore.includes(context.player.name)) {
			s += '<div id="context-remove-ignore" ' + z + '>Unignore</div>';
		}
		else {
			s += '<div id="context-add-ignore" ' + z + '>Ignore</div>';
		}
		context.show(s);
	}
	function posX() {
		if (my.mouse.x < context.halfWidth) {
			// too small
			my.mouse.x += context.halfWidth / 2;
			if (my.mouse.x < 80) {
				my.mouse.x = 80;
			}
		}
		else if (my.mouse.x > window.innerWidth - context.halfWidth) {
			// too big
			my.mouse.x -= context.halfWidth / 2;
			z = window.innerWidth - 80;
			if (my.mouse.x > z) {
				my.mouse.x = z;
			}

		}
		return my.mouse.x;
	}
	function posY() {
		// determine Y adjustment
		isMenuAbove = my.mouse.y < window.innerHeight / 2;
		yAdjust = isMenuAbove ? 15 : (~~$("#context-wrap").height() + 15) * -1;
		return my.mouse.y + yAdjust;
	}
	function show(s) {
		if (!s) return
		context.isOpen = 1
		context.openDate = Date.now()
		el = getElementById('context-wrap')
		el.innerHTML = s
		el.style.top = posY() + 'px'
		el.style.left = posX() + 'px'
		el.style.visibility = 'visible'
	}
	function hide() {
		context.isOpen = 0;
		el = getElementById('context-wrap')
		if (el !== null) el.style.visibility = 'hidden'
	}
	function hideCheck() {
		if (context.isOpen) {
			if (Date.now() - context.openDate > 100 && !context.isInside) {
				context.hide();
			}
		}
	}
})($, _);