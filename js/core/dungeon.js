var dungeon;
(function(TweenMax, $, _, undefined) {
	const BOTTOM_PLAYER = MaxHeight - 80
	dungeon = {
		initialized: 0,
		layer: {},
		player: {},
		centerX: [960, 1280, 640, 1600, 320],
		bottom: MaxHeight,
		headY: BOTTOM_PLAYER - 200,
		bottomY: BOTTOM_PLAYER,
		centerY,
		go,
		init,
		setPlayers,
		html,
		enterCombat,
	};
	$('#scene-dungeon').on('click', function() {
		if (!app.isApp && party.presence[0].isLeader) battle.go()
	})
	///////////////////////////////////////
	function go(force) {
		if (!force && ng.view === 'dungeon') return
		// cleanup sort of activities when going into dungeon
		town.closeVarious()
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
		chat.sizeDungeon()
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
		// draw players
		dungeon.setPlayers()
		mobSkills.initFilter()

		ng.unlock()
		if (party.presence[0].isLeader && party.hasMoreThanOnePlayer()) {
			socket.publish('party' + my.partyId, {
				route: 'p->goDungeon'
			}, true)
		}
		delayedCall(.5, () => {
			if (_.size(mob.textures) === 0) {
				battle.loadTextures()
				cache.preloadPlayerAsk()
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
			dungeon.layer.stage.removeChildren()
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
	function setPlayers() {
		// init
		let id
		party.presence.forEach((p, index) => {
			if (p.askId) ask.removeImg()(p.askId)
			// adding brand new player
			p.sprite = PIXI.Sprite.from(`images/players/default.png`)
			id = ask.getAskId()
			p.askId = id
			p.sprite.id = 'ask-' + id
			p.sprite.anchor.set(.5, 1)
			p.sprite.x = dungeon.centerX[index]
			p.sprite.y = dungeon.bottomY
			p.sprite.zIndex = ask.DEFAULT_PLAYER_LAYER
			ask.addChild(p.sprite)
			mobSkills.applyEffectFilter(p.row)
		})
	}
	function html() {
		return '<img id="dungeon-bg" class="wh-100" src="images/dungeon/1.jpg">'
	}
	function enterCombat() {
		// console.info("ENTERING COMBAT")
	}
	function centerY(index, race) {
		return BOTTOM_PLAYER - 100
	}
})(TweenMax, $, _);