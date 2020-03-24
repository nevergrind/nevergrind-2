var context;
(function () {
	var z;
	var isMenuAbove;
	var yAdjust;

	context = {
		id: '',
		timer: new TweenMax.delayedCall(0, ''),
		isOpen: 0,
		player: '',
		padding: 10,
		openDate: 0,
		isInside: 0,
		halfWidth: ~~($("#context-wrap").width() / 2),
		init: init,
		contextBoot,
		show: show,
		hide: hide,
		click: click,
		contextDisband,
		contextPromote,
		hideCheck,
		contextInvite,
		contextWhisper,
		contextAddFriend,
		contextAddIgnore,
		getChatMenu,
		contextRemoveFriend,
		contextRemoveIgnore,
		getPartyMenu,
		setChatMenuHtml,
		setPartyMenuHtml,
	}
	////////////////////////////////////
	function init() {
		$("#context-wrap").on('click', '.context-items', function (e) {
			console.info('context-items clicked: ', $(this).attr('id'));
			context.click($(this).attr('id'));
		}).on('mouseenter', function () {
			context.isInside = 1;
		}).on('mouseleave', function () {
			context.isInside = 0;
			context.timer.kill()
			TweenMax.delayedCall(1, function () {
				if (!context.isInside) {
				}
			})
		})
	}
	function click(id) {
		console.info("click!", id, context.player);
		context[_.camelCase(id)]();
		context.hide();
	}
	function contextWhisper() {
		chat.dom.chatInput.value = '';
		chat.modeChange({
			msg: '',
			mode: '@',
			name: context.player
		});
		chat.dom.chatInput.focus();
	}
	function contextAddFriend() {
		chat.sendMsg('/friend add ' + context.player);
	}
	function contextAddIgnore() {
			chat.sendMsg('/ignore add ' + context.player);
	}
	function contextInvite() {
		chat.sendMsg('/invite ' + context.player);
	}
	function contextRemoveFriend() {
		chat.sendMsg('/friend remove ' + context.player);
	}
	function contextRemoveIgnore() {
		chat.sendMsg('/ignore remove ' + context.player);
	}
	function contextDisband() {
		chat.sendMsg('/disband');
	}
	function contextPromote() {
		chat.sendMsg('/promote ' + context.player);
	}
	function contextBoot() {
			chat.sendMsg('/boot ' + context.player);
	}
	function setPartyMenuHtml() {
		if (!context.player) return;
		console.info('setPartyMenuHtml', context.player);

		var z = ' class="context-items"',
			s = '';

		if (context.player === my.name) {
			// commands only for me
			// disband
			if (party.presence.length > 1) {
				s += '<div id="context-disband" ' + z + '>Disband</div>';
			}
		}
		else {
			// promote
			if (party.presence[0].isLeader) {
				s += '<div id="context-boot" ' + z + '>Boot</div>';
				s += '<div id="context-promote" ' + z + '>Promote</div>';
			}
			// whisper
			s += '<div id="context-whisper" ' + z + '>Whisper</div>';
			// friend list
			if (ng.friends.includes(context.player)) {
				s += '<div id="context-remove-friend" ' + z + '>Unfriend</div>';
			}
			else {
				s += '<div id="context-add-friend" ' + z + '>Friend</div>';
			}
			// ignore list
			if (ng.ignore.includes(context.player)) {
				s += '<div id="context-remove-ignore" ' + z + '>Unignore</div>';
			}
			else {
				s += '<div id="context-add-ignore" ' + z + '>Ignore</div>';
			}
		}
		s && context.show(s);
	}
	function setChatMenuHtml() {
		if (!context.player || context.player === my.name) return;

		var z = ' class="context-items"',
			s = '';
		// is this guy in my party?
		if (!my.getPartyNames().includes(context.player)) {
			s += '<div id="context-invite" ' + z + '>Invite</div>';
		}
		s += '<div id="context-whisper" ' + z + '>Whisper</div>';
		// friend list
		if (ng.friends.includes(context.player)) {
			s += '<div id="context-remove-friend" ' + z + '>Unfriend</div>';
		}
		else {
			s += '<div id="context-add-friend" ' + z + '>Friend</div>';
		}
		// ignore list
		if (ng.ignore.includes(context.player)) {
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
		if (!s) return;
		var e = getById('context-wrap');
		e.innerHTML = s;
		e.style.top = posY() + 'px';
		e.style.left = posX() + 'px';
		e.style.visibility = 'visible';
		context.isOpen = 1;
		context.openDate = Date.now();
	}
	function hide() {
		getById('context-wrap').style.visibility = 'hidden';
		context.isOpen = 0;
	}
	function hideCheck() {
		if (context.isOpen) {
			if (Date.now() - context.openDate > 100 && !context.isInside) {
				context.hide();
			}
		}
	}
	function getChatMenu(name) {
		context.player = name;
		context.setChatMenuHtml();
	}
	function getPartyMenu(name) {
		context.player = name;
		context.setPartyMenuHtml();
	}
})();