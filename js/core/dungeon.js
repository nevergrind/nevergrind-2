var dungeon;
(function(TweenMax, $, _, undefined) {
	dungeon = {
		initialized: 0,
		go,
		init,
		html,
		enterCombat,
	};
	$('#scene-dungeon').on('click', battle.go)
	///////////////////////////////////////
	function go() {
		if (ng.view === 'dungeon') return
		// cleanup sort of activities when going into dungeon
		town.closeVarious()
		querySelector('#town-footer-wrap').style.display = 'none'
		tavern.leaders = ''
		game.emptyScenesExcept('scene-dungeon')

		// coming out of battle - save!
		// TODO: change this to update gold+exp+level too later
		if (ng.view === 'battle') {
			mob.killAttacks()
			my.saveCharacterData()
		}
		if (ng.view === 'town') chat.publishRemove()
		if (my.channel) socket.unsubscribe(chat.getChannel())

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
		combat.autoAttackDisable()
		// reset some combat data
		mobs.forEach((m,i) => {
			mobs[i].name = ''
			mobs[i].hp = 0
		})

		warn("DUNGEON GO")
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
		if (party.presence[0].isLeader) {
			socket.publish('party' + my.partyId, {
				route: 'p->goDungeon'
			})
		}
	}
	function init() {
		if (zones[mission.id].mobs.length) {
			zones[mission.id].mobs.forEach(function(v){
				cache.preloadMob(_.kebabCase(v))
			});
		}
		if (dungeon.initialized) {
			getElementById('scene-dungeon').style.display = 'block'
		}
		else {
			button.setAll()
			dungeon.initialized = true
		}
		getElementById('scene-dungeon').innerHTML = dungeon.html()
		chat.scrollBottom()
	}
	function html() {
		return '<img id="dungeon-bg" class="wh-100" src="images/dungeon/1.jpg">'
	}
	function enterCombat() {
		console.info("ENTERING COMBAT")
	}
})(TweenMax, $, _);