var dungeon;
(function(TweenMax, $, _, Power0, Sine, undefined) {
	const BOTTOM_PLAYER = MaxHeight - 80
	const entityTweens = []
	dungeon = {
		initialized: 0,
		layer: {},
		squareFar: {},
		container: {},
		tiling: {},
		floor: {},
		ceiling: {},
		mobParent: {},
		sky: {},
		orc: {},
		tickUpdate: {},
		centerX: [960, 1280, 640, 1600, 320],
		bottom: MaxHeight,
		headY: BOTTOM_PLAYER - 200,
		bottomY: BOTTOM_PLAYER,
		gridElementY: {},
		walking: 0,
		distanceStart: 0,
		distanceCurrent: 0,
		// distanceEnd: 3000,
		distanceEnd: 4000,
		distancePerSecond: 200,
		walkTween: TweenMax.to('#dungeon-floor-horizontal', 0, {}),
		centerY,
		go,
		rxGo,
		init,
		html,
		enterCombat,
		walkForward,
		walkStop,
		walkBackward,
		getWalkDurationEnd,
		getWalkDurationStart,
		animateGrid,
		animateEntities,
		getWalkProgress,
		initCanvas,
		setSrc,
		killEntityTweens,
	}
	const CLOSEST_MOB_DISTANCE = 200
	const MOB_DUNGEON_SIZE = 1
	$('#scene-dungeon').on('mousedown', handleClickDungeon)
	///////////////////////////////////////
	function go(force) {
		if (!force && ng.view === 'dungeon') return
		goTasks()
		if (party.presence[0].isLeader) {
			if (party.hasMoreThanOnePlayer()) {
				socket.publish('party' + my.partyId, {
					route: 'p->goDungeon',
					config: { age: 35 },
				}, true)
			}
			delayedCall(.5, preloadCombatAssets)
		}
	}
	function rxGo(data) {
		goTasks()
		delayedCall(.5, preloadCombatAssets)
	}
	function preloadCombatAssets() {
		console.info('LOADING ASSETS')
		battle.loadTextures()
		cache.preloadPlayerAsk()
	}
	function goTasks() {
		// cleanup sort of activities when going into dungeon
		town.closeVarious()
		tavern.leaders = ''
		game.showScene('scene-dungeon')

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
		player.setPlayers()
		player.show()
		mobSkills.initFilter()

		ng.unlock()
	}
	function init() {
		if (zones[mission.id].mobs.length) {
			zones[mission.id].mobs.forEach(v => {
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
			dungeon.initCanvas()
			player.initCanvas()
			combat.updateCanvasLayer()
		}
		setDungeonEntity('toadlok')
		setContainerPerspective()
		dungeon.animateGrid()
		button.setAll()
		chat.scrollBottom()
	}
	function killEntityTweens() {
		entityTweens.forEach(t => t.kill)
	}
	function initCanvas() {
		if (typeof dungeon.layer.view !== 'object') {
			dungeon.layer = new PIXI.Application({
				width: MaxWidth,
				height: MaxHeight,
				backgroundColor: 0x103322
				// transparent: true
			})
			dungeon.layer.stage.sortableChildren = true
			dungeon.layer.view.id = 'dungeon-layer'
			dungeon.layer.view.style.position = 'absolute'
			dungeon.layer.view.style.pointerEvents = 'none'
			dungeon.layer.view.style.top = '0px'
			dungeon.layer.view.style.left = '0px'
			dungeon.layer.view.style.zIndex = 1
			querySelector('#scene-dungeon').appendChild(dungeon.layer.view)

			dungeon.sky = PIXI.Sprite.from('images/dungeon/bg-test-sky.jpg')
			dungeon.sky.zIndex = 1

		}


		// create a new Sprite from an image path
		dungeon.container = new PIXI.projection.Container2d()
		dungeon.container.position.set(MaxWidth / 2, MaxHeight)
		dungeon.container.zIndex = 1

		// tiling - takes whole screen, anchor and position are the same as of sprite floor
		dungeon.tiling = new PIXI.projection.TilingSprite2d(
			PIXI.Texture.from('images/dungeon/bg_plane.jpg'),
			MaxWidth,
			MaxHeight
		)
		dungeon.tiling.position.set(MaxWidth * .5, MaxHeight)
		dungeon.tiling.height = MaxHeight
		dungeon.tiling.anchor.set(0.5, 1.0)
		dungeon.tiling.tint = 0xff00ff
		dungeon.tiling.zIndex = 1

		// dungeon.orc
		// set yFloor of dungeon.orc

		dungeon.layer.stage.addChild(dungeon.tiling)
		dungeon.layer.stage.addChild(dungeon.sky)
		dungeon.layer.stage.addChild(dungeon.container)
		// dungeon.container.addChild(dungeon.ceiling)
	}
	function setSrc(tween, img) {
		tween.frame = ~~tween.frame
		if (tween.frame !== tween.lastFrame) {
			dungeon.orc.texture = mob.textures[img][tween.frame]
			tween.lastFrame = tween.frame
		}
	}
	function getIdleTween() {
		return {
			frame: 1,
			lastFrame: 1,
			start: 1,
			end: 5.999,
			diff: 4.999
		}
	}
	function setDungeonEntity(img) {
		// parent container?
		dungeon.mobParent = new PIXI.projection.Sprite2d(PIXI.Texture.EMPTY)
		dungeon.mobParent.tint = 0x00ffff
		dungeon.mobParent.factor = 1
		dungeon.mobParent.proj.affine = PIXI.projection.AFFINE.AXIS_X
		dungeon.mobParent.anchor.set(0.5, 0.0)
		dungeon.mobParent.position.set(0, (dungeon.distanceEnd + CLOSEST_MOB_DISTANCE) * -1)
		// child container - check texture is loaded
		battle.loadMobTexture(img)
		dungeon.orc = new PIXI.projection.Sprite2d(PIXI.Texture.from('mobs/'+ img + '/1.png'))
		dungeon.orc.anchor.set(0.5, 1.0)
		// size and check offset
		dungeon.orc.y = mobs.images.orc.yPadding * MOB_DUNGEON_SIZE
		TweenMax.set(dungeon.orc, {
			pixi: { scale: MOB_DUNGEON_SIZE }
		})
		// idle
		let tween = getIdleTween()
		entityTweens.push(TweenMax.to(tween, mobs.images[img].frameSpeed * tween.diff * 2, {
			startAt: { frame: tween.start },
			frame: tween.end,
			yoyo: true,
			repeat: -1,
			repeatDelay: mobs.images[img].frameSpeed,
			ease: Sine.easeOut,
			onUpdate: dungeon.setSrc,
			onUpdateParams: [tween, img],
		}))
		dungeon.container.addChild(dungeon.mobParent)
		dungeon.mobParent.addChild(dungeon.orc)
	}
	function setContainerPerspective() {
		let pos = {
			x: 0,
			y: MaxHeight * .5,
		}
		dungeon.container.proj.setAxisY(pos, -1)
		dungeon.tiling.tileProj.setAxisY(pos, -1)
		dungeon.mobParent.proj.affine = PIXI.projection.AFFINE.AXIS_X
	}
	function html() {
		return '';
	}
	function enterCombat() {
		// console.info("ENTERING COMBAT")
	}
	function centerY(index, race) {
		return BOTTOM_PLAYER - 100
	}
	function handleClickDungeon(e) {
		if (party.presence[0].isLeader) {
			if (e.shiftKey) {
				if (dungeon.walking === -1) {
					// forward
					dungeon.walkStop()
				}
				else {
					// backwards
					dungeon.walkBackward()
				}
			}
			else {
				if (dungeon.walking !== 0) {
					// forward
					dungeon.walkStop()
				}
				else {
					// stopped
					dungeon.walkForward()
				}
			}
		}
	}
	function getWalkProgress() {
		return dungeon.distanceCurrent / dungeon.distanceEnd
	}
	function getWalkDurationEnd() {
		return (dungeon.distanceEnd - dungeon.distanceCurrent) / dungeon.distancePerSecond
	}
	function getWalkDurationStart() {
		return dungeon.distanceCurrent / dungeon.distancePerSecond
	}
	function setGridPosition() {
		if (dungeon.distanceCurrent <= dungeon.distanceStart) {
			dungeon.distanceCurrent = dungeon.distanceStart
			dungeon.walkStop()
		}
		else if (dungeon.distanceCurrent >= dungeon.distanceEnd) {
			dungeon.distanceCurrent = dungeon.distanceEnd
			dungeon.walkStop()
		}
		// console.info('setGridPosition', dungeon.distanceCurrent)
		dungeon.tiling.tilePosition.y = dungeon.distanceCurrent
		dungeon.animateEntities()
	}
	function walkForward() {
		dungeon.walking = 1
		dungeon.walkTween = TweenMax.to(dungeon, dungeon.getWalkDurationEnd(), {
			distanceCurrent: dungeon.distanceEnd,
			ease: Power0.easeIn,
			onUpdate: setGridPosition,
		})
	}
	function walkStop() {
		dungeon.walking = 0
		dungeon.walkTween.pause()

	}
	function walkBackward() {
		if (dungeon.getWalkProgress() < 1) {
			dungeon.walking = -1
			dungeon.walkTween = TweenMax.to(dungeon, dungeon.getWalkDurationStart(), {
				distanceCurrent: dungeon.distanceStart,
				ease: Power0.easeIn,
				onUpdate: setGridPosition,
			})
		}
	}
	function animateGrid() {
		/*TweenMax.to('#dungeon-stag-black', 0, {
			startAt: { rotationX: 35 },
			rotationX: 1,
			repeat: -1,
			yoyo: true,
			ease: Power1.easeInOut,
		});
		TweenMax.to('#dungeon-stag-black', 0, {
			delay: 1,
			startAt: { scaleX: 0 },
			scaleX: 12,
			ease: Power0.easeIn,
		})*/
	}
	function animateEntities() {
		dungeon.mobParent.position.y = (((1 - dungeon.getWalkProgress()) * dungeon.distanceEnd) * -1) - CLOSEST_MOB_DISTANCE
	}
})(TweenMax, $, _, Power0, Sine);