var dungeon = {
	go: function() {
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
	},
	initialized: 0,
	init: function() {
		my.zoneMobs.length && my.zoneMobs.forEach(function(v){
			cache.preloadMob(v);
		});
		if (dungeon.initialized) {
			document.getElementById('scene-dungeon').style.display = 'block';
		}
		else {
			document.getElementById('scene-dungeon').innerHTML = dungeon.html();
			battle.events();
			button.init();
		}
		chat.scrollBottom();
		// delegate
	},
	html: function() {
		var s =
		'<img id="dungeon-bg" class="img-bg" src="img2/dungeon/braxxen1.jpg">';

		return s;
	},
	enterCombat: function() {
		console.info("ENTERING COMBAT");
	}
}