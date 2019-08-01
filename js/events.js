(function() {
	var i;
	var key;
	var code;
	// window
	window.onbeforeunload = game.exit;
	$(window)
		.on('resize', resize)
		.on('load', windowResized)
		.focus(windowResized);

	// document events
	$(document)
		.on('mousemove', mousemove)
		.on('click', mousedown)
		.on('keydown', keydown)
		.ready(ready);

	// should be delegating no drag start
	$('body').on('dragstart', 'img', dragStart);

	//////////////////////////////////////////////
	function ready() {
		// console.info("Initializing title screen...");
		setTimeout(readyFire, 100);
	}
	function readyFire() {
		ng.initGame();
		game.session.timer = setTimeout(ng.keepAlive, 170000);
		// init events
		var x = 'click';
		ng.events(x);
		create.events(x);
		audio.events();
	}
	function focus(e) {
		windowResized();
	}
	function dragStart(e) {
		console.info('dragstart');
		e.preventDefault();
	}
	function windowResized() {
		// debounce resize
		clearTimeout(ng.resizeTimer);
		ng.resizeTimer = setTimeout(windowResizedTimeout, 50);
		if (context.isOpen) {
			context.hide();
		}
	}
	function windowResizedTimeout() {
			if (chat.initialized) {
				chat.scrollBottom();
			}
			if (ng.view === 'battle') {
				for (i=0; i<mob.max; i++) {
					mob.sizeMob(i);
				}
			}
	}
	function mousedown(e) {
		if (context.isOpen) {
			context.hideCheck();
			e.preventDefault();
			return false;
		}
	}
	function mousemove(e) {
		my.mouse.x = e.clientX;
		my.mouse.y = e.clientY;
	}
	function resize() {
		context.hide();
		clearTimeout(context.resizeTimer);
		windowResized();
	}
	function keydown(e) {
		code = e.keyCode;
		key = e.key;

		ng.lastKey = key;

		// console.info('keydown: ', key, code);
		// local only
		if (!app.isApp) {
			if (!chat.hasFocus && ng.view !== "title") {
				// key input view router
				if (key === 'b') {
					battle.go();
				}
				else if (key === 't') {
					town.go();
				}
				else if (key === 'd') {
					dungeon.go();
				}
			}
		}
		else {
			// not local
			if (code >= 112 && code <= 121) {
				// disable all F keys except F11
				// TODO: Put party targeting in here later
				return false;
			}
		}

		if (e.altKey) {
			return false;
		}
		else if (e.ctrlKey){
			if (code === 82){
				// ctrl+r refresh
				chat.reply();
				return false;
			}
			else if (!chat.hasFocus && !guild.hasFocus) {
				// no select all of webpage elements
				if (code === 65 || code === 70) {
					e.preventDefault();
				}
				// ctrl A, F
			}
		}
		else {
			if (!chat.hasFocus && !guild.hasFocus) {
				if (code === 191) {
					var z = $("#chat-input"),
						text = z.val();
					!text && $("#chat-input").focus();
					return;
				}

			}
			if (ng.view === 'title'){
				if (!ng.isModalOpen){
					$("#create-character-name").focus();
				}
			}
			else {
				// always works town, dungeon and combat
				if (chat.hasFocus) {
					if (chat.modeChange()) {
						// changing chat mode - matches possible mode change
						return false;
					}
					// has chat focus
					if (code === 38) {
						// chat focus history nav up
						if (chat.history[chat.historyIndex - 1] !== undefined) {
							var o = chat.history[--chat.historyIndex];
							chat.dom.chatInput.value = o.msg;
							chat.modeChange(o);
						}
					}
					else if (code === 40) {
						// chat focus history nav down
						if (chat.history.length === chat.historyIndex + 1) {
							chat.historyIndex++;
							chat.clear();
						}
						else if (chat.history[chat.historyIndex + 1] !== undefined) {
							var o = chat.history[++chat.historyIndex];
							chat.dom.chatInput.value = o.msg;
							chat.modeChange(o);
						}
					}
					else if (code === 13) {
						// enter
						my.name && chat.sendMsg();
					}
				}

				if (ng.view === 'town') {
					// town only actions
					if (!chat.hasFocus) {
						// no aside && no chat focus
						!town.aside.selected && chat.dom.chatInput.focus();
						if (guild.hasFocus) {
							if (code === 13) {
								guild.create();
							}
						}
					}
				}
				else {
					// dungeon & combat
					if (!chat.hasFocus && code === 13 || code === 191) {
						chat.dom.chatInput.focus();
					}
					if (code === 9) {
						// tab
						if (!e.shiftKey) {
							my.nextTarget(false);
						} else {
							my.nextTarget(true);
						}
						e.preventDefault();
					}
					else if (code === 86) {
						// v
						if (ng.view === 'game' && !ng.chatOn) {
							game.toggleGameWindows(1);
						}
					}
				}
			}
		}
	}
})();



