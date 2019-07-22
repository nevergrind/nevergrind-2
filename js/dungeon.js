var dungeon;
(function() {
	dungeon = {
		initialized: 0,
		go: go,
		init: init,
		html: html,
		enterCombat: enterCombat,
	};
	///////////////////////////////////////
	function go() {
		if (ng.view === 'dungeon') return;
		game.emptyScenesExcept('scene-dungeon');
		// remove from town chat
		chat.broadcastRemove();
		my.channel && socket.unsubscribe(chat.getChannel());
		// set new channel data
		my.channel = '';
		// force change to party chat if in town chat
		chat.modeCommand === '/say' &&
			chat.modeChange({
				mode: '/party'
			});
		chat.sizeSmall();
		ng.setScene('dungeon');
		dungeon.init();
		console.info("DUNGEON GO");
		TweenMax.to('#scene-dungeon', .5, {
			delay: 1,
			opacity: 1
		});
	}
	function init() {
		my.zoneMobs.length && my.zoneMobs.forEach(function(v){
			cache.preloadMob(v);
		});
		if (dungeon.initialized) {
			getById('scene-dungeon').style.display = 'block';
		}
		else {
			getById('scene-dungeon').innerHTML = dungeon.html();
			battle.events();
			button.init();
		}
		chat.scrollBottom();
		// delegate
	}
	function html() {
		var s =
		'<img id="dungeon-bg" class="img-bg" src="img2/dungeon/braxxen1.jpg">';

		return s;
	}
	function enterCombat() {
		console.info("ENTERING COMBAT");
	}
})();