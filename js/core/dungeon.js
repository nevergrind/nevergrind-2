var dungeon;
(function(TweenMax, $, _, undefined) {
	dungeon = {
		initialized: 0,
		layer: {},
		go,
		init,
		html,
		enterCombat,
	};
	$('#scene-dungeon').on('click', function() {
		if (party.presence[0].isLeader) battle.go()
	})
	///////////////////////////////////////
	function go(force) {
		if (!force && ng.view === 'dungeon') return
		// cleanup sort of activities when going into dungeon
		town.closeVarious()
		querySelector('#town-footer-wrap').style.display = 'none'
		tavern.leaders = ''
		game.sceneCleanup('scene-dungeon')

		// coming out of battle - save!
		// TODO: change this to update gold+exp+level too later
		if (ng.view === 'battle') {
			mob.killAttacks()
			my.saveCharacterData()
		}
		if (ng.view === 'town') {
			expanse.killAllTweens()
			chat.publishRemove()
		}
		if (my.channel) socket.unsubscribe(chat.getChannel())

		// set new channel data
		my.channel = ''
		// force change to party chat if in town chat
		if (chat.modeCommand === '/say') {
			chat.modeChange(CHAT.PARTY)
		}
		chat.sizeSmall()
		ng.setScene('dungeon')
		dungeon.init()
		combat.autoAttackDisable()
		// reset some combat data
		mobs.forEach((m, i) => {
			mobs[i].name = ''
			mobs[i].hp = 0
		})
		combat.endCombat()

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
		battle.reckonGXL()
		mob.earnedExp = 0
		mob.earnedGold = 0
		mob.leveledUp = false
		ng.unlock()
		if (party.presence[0].isLeader && party.hasMoreThanOnePlayer()) {
			socket.publish('party' + my.partyId, {
				route: 'p->goDungeon'
			}, true)
		}
		delayedCall(1, () => {
			if (_.size(mob.textures) === 0) {
				battle.loadTextures()
			}
		})
	}
	function init() {
		if (zones[mission.id].mobs.length) {
			zones[mission.id].mobs.forEach(function(v){
				cache.preloadMob(_.kebabCase(v))
			});
		}
		if (dungeon.initialized) {
			querySelector('#scene-dungeon').style.display = 'block'
		}
		else {
			dungeon.initialized = true
			querySelector('#scene-dungeon').innerHTML = dungeon.html()
			// dungeon layer for ooc buffs
			dungeon.layer = new PIXI.Application({
				width: MaxWidth,
				height: MaxHeight,
				// backgroundColor: 0x103322
				transparent: true
			});
			dungeon.layer.stage.sortableChildren = true
			dungeon.layer.view.id = 'dungeon-layer'
			dungeon.layer.view.style.pointerEvents = 'none'
			dungeon.layer.view.style.position = 'absolute'
			dungeon.layer.view.style.top = '0px';
			dungeon.layer.view.style.left = '0px';
			dungeon.layer.view.style.zIndex = 1
			querySelector('#scene-dungeon').appendChild(dungeon.layer.view)
			combat.updateCanvasLayer()
		}
		button.setAll()
		chat.scrollBottom()
	}
	function html() {
		return '<img id="dungeon-bg" class="wh-100" src="images/dungeon/1.jpg">'
	}
	function enterCombat() {
		// console.info("ENTERING COMBAT")
	}
})(TweenMax, $, _);