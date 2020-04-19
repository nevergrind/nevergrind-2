var dungeon;
(function() {
	dungeon = {
		initialized: 0,
		go,
		init,
		html,
		enterCombat,
	};
	///////////////////////////////////////
	function go() {
		if (ng.view === 'dungeon') return
		town.closeVarious()
		game.emptyScenesExcept('scene-dungeon')
		// remove from town chat
		if (ng.view === 'town') {
			chat.publishRemove()
		}
		if (my.channel) {
			socket.unsubscribe(chat.getChannel())
		}
		// set new channel data
		my.channel = ''
		// force change to party chat if in town chat
		if (chat.modeCommand === '/say') {
			chat.modeChange({
				mode: '/party'
			})
		}
		chat.sizeSmall()
		ng.setScene('dungeon')
		dungeon.init()
		console.info("DUNGEON GO")
		TweenMax.to('#scene-dungeon', .5, {
			startAt: { filter: 'brightness(0)' },
			delay: .5,
			filter: 'brightness(1)'
		})
		TweenMax.to('#sky-wrap', .5, {
			startAt: { filter: 'brightness(0)' },
			delay: .5,
			filter: 'brightness(1)'
		})
		ng.unlock()
	}
	function init() {
		if (my.zoneMobs.length) {
			my.zoneMobs.forEach(function(v){
				cache.preloadMob(v)
			});
		}
		if (dungeon.initialized) {
			getElementById('scene-dungeon').style.display = 'block'
		}
		else {
			getElementById('scene-dungeon').innerHTML = dungeon.html()
			battle.events()
			button.init()
		}
		chat.scrollBottom()
		// delegate
	}
	function html() {
		return '<img id="dungeon-bg" class="wh-100" src="images/battle/lanfeld.png">'
	}
	function enterCombat() {
		console.info("ENTERING COMBAT")
	}
})();