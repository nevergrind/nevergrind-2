var dungeon;
(function(TweenMax, $, _, Power0, Sine, undefined) {
	const BOTTOM_PLAYER = MaxHeight - 80
	dungeon = {
		initialized: 0,
		entityTweens: [],
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
		direction: 0, // 0 is north, 90 east, 180 south, 270 west
		centerX: [960, 1280, 640, 1600, 320],
		bottom: MaxHeight,
		headY: BOTTOM_PLAYER - 200,
		bottomY: BOTTOM_PLAYER,
		gridElementY: {},
		gridSize: 640,
		gridDuration: 2,
		walking: 0,
		distanceStart: 0,
		distanceCurrent: 0,
		distanceEnd: 6400,
		distancePerSecond: 320,
		walkTween: TweenMax.to('#body', 0, {}),
		getCompass,
		centerY,
		go,
		rxGo,
		init,
		html,
		enterCombat,
		walkForward,
		moveEnd,
		walkBackward,
		setGridPosition,
		getWalkDurationEnd,
		getWalkDurationStart,
		animateEntities,
		getWalkProgress,
		getWalkProgressToGo,
		getEntityDistance,
		turnRight,
		turnLeft,
		initCanvas,
		setSrc,
		killEntityTweens,
	}
	let blurValue = 0
	const CLOSEST_MOB_DISTANCE = 200
	const MOB_DUNGEON_SIZE = 1
	const MAX_BLUR = 3
	const TURN_SPEED = 1
	const TURN_INTERVAL = 90
	const TURN_DISABLED = false
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
		entityCleanup()
		setDungeonEntity('toadlok')
		dungeon.animateEntities()
		button.setAll()
		chat.scrollBottom()
	}
	function killEntityTweens() {
		dungeon.entityTweens.forEach(t => {
			t.kill()
		})
		dungeon.entityTweens = []
	}
	function initCanvas() {
		if (typeof dungeon.layer.view === 'object') return
		let pos = {
			x: 0,
			y: MaxHeight * .5,
		}
		dungeon.layer = new PIXI.Application({
			width: MaxWidth,
			height: MaxHeight,
			backgroundColor: 0x000000,
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

		// create a new Sprite from an image path
		dungeon.container = new PIXI.projection.Container2d()
		dungeon.container.position.set(MaxWidth / 2, MaxHeight)
		dungeon.container.zIndex = 1
		dungeon.container.proj.setAxisY(pos, -1)

		// tiling - takes whole screen, anchor and position are the same as of sprite floor
		dungeon.tiling = new PIXI.projection.TilingSprite2d(
			PIXI.Texture.from('images/dungeon/bg_plane.jpg'),
			MaxWidth,
			MaxHeight
		)
		dungeon.tiling.position.set(MaxWidth * .5, MaxHeight)
		dungeon.tiling.height = MaxHeight * .5
		dungeon.tiling.anchor.set(0.5, 1.0)
		dungeon.tiling.tint = 0xff00ff
		dungeon.tiling.zIndex = 1
		dungeon.tiling.tileProj.setAxisY(pos, -1)

		// dungeon.orc
		// set yFloor of dungeon.orc

		dungeon.layer.stage.addChild(dungeon.sky)
		dungeon.layer.stage.addChild(dungeon.tiling)
		dungeon.layer.stage.addChild(dungeon.container)
		// dungeon.container.addChild(dungeon.ceiling)
	}
	function setDungeonEntity(img) {
		// parent container?
		/*dungeon.mobParent = new PIXI.projection.Sprite2d(PIXI.Texture.EMPTY)
		dungeon.mobParent.tint = 0x00ffff
		dungeon.mobParent.factor = 1
		dungeon.mobParent.proj.affine = PIXI.projection.AFFINE.AXIS_X
		dungeon.mobParent.anchor.set(0.5, 1)
		dungeon.mobParent.position.set(0, (dungeon.distanceEnd + CLOSEST_MOB_DISTANCE) * -1)*/
		// child container - check texture is loaded
		battle.loadMobTexture(img)
		dungeon.orc = new PIXI.projection.Sprite2d(PIXI.Texture.from('mobs/'+ img + '/1.png'))
		dungeon.orc.anchor.set(0.5, 1.0)
		dungeon.orc.factor = 1
		dungeon.orc.proj.affine = PIXI.projection.AFFINE.AXIS_X
		dungeon.orc.position.set(0, (dungeon.distanceEnd + CLOSEST_MOB_DISTANCE) * -1)
		// size and check offset
		dungeon.orc.y = mobs.images.orc.yPadding * MOB_DUNGEON_SIZE
		TweenMax.set(dungeon.orc, {
			pixi: { scale: MOB_DUNGEON_SIZE }
		})
		// idle
		let tween = getIdleTween()
		dungeon.entityTweens.push(TweenMax.to(tween, mobs.images[img].frameSpeed * tween.diff * 2, {
			startAt: { frame: tween.start },
			frame: tween.end,
			yoyo: true,
			repeat: -1,
			repeatDelay: mobs.images[img].frameSpeed,
			ease: Sine.easeOut,
			onUpdate: dungeon.setSrc,
			onUpdateParams: [tween, img],
		}))
		// dungeon.container.addChild(dungeon.mobParent)
		dungeon.container.addChild(dungeon.orc)
	}
	function setGridPosition() {
		// dungeon.tiling.tileProj.pivot.y = -dungeon.distanceCurrent
		dungeon.tiling.tilePosition.y = dungeon.distanceCurrent
		// console.info('dungeon.distanceCurrent', dungeon.distanceCurrent)
		dungeon.animateEntities()
	}
	function getCompass() {
		return dungeon.direction % TURN_INTERVAL
	}
	function getEntityDistance() {
		return (dungeon.getWalkProgressToGo() * dungeon.distanceEnd) + CLOSEST_MOB_DISTANCE
	}
	function animateEntities() {
		let distance = -dungeon.getEntityDistance()
		TweenMax.set(dungeon.orc, {
			pixi: {
				blur: getBlurValue(distance)
			}
		})
		dungeon.orc.position.y = distance
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
	function entityCleanup() {
		console.info('needs development - remove entities')
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
			if (e.shiftKey) dungeon.walkBackward()
			else dungeon.walkForward()
		}
	}
	function getWalkProgress() {
		return dungeon.distanceCurrent / dungeon.distanceEnd
	}
	function getWalkProgressToGo() {
		return 1 - (dungeon.distanceCurrent / dungeon.distanceEnd)
	}
	function getWalkDurationEnd() {
		// return dungeon.gridSize / dungeon.distancePerSecond
		return (dungeon.distanceEnd - dungeon.distanceCurrent) / dungeon.distancePerSecond
	}
	function getWalkDurationStart() {
		return dungeon.distanceCurrent / dungeon.distancePerSecond
	}
	function walkForward() {
		if (dungeon.walking || dungeon.distanceCurrent >= dungeon.distanceEnd) {
			// nothing
		}
		else {
			dungeon.walking = 1
			dungeon.walkTween = TweenMax.to(dungeon, dungeon.getWalkDurationEnd(), {
				distanceCurrent: dungeon.distanceEnd,
				ease: Power0.easeIn,
				onUpdate: dungeon.setGridPosition,
				onComplete: dungeon.moveEnd,
			})
		}
	}
	function walkBackward() {
		if (dungeon.walking || dungeon.distanceCurrent <= dungeon.distanceStart) {
			// nothing
		}
		else {
			if (dungeon.getWalkProgress() < 1) {
				dungeon.walking = -1
				dungeon.walkTween = TweenMax.to(dungeon, dungeon.getWalkDurationStart(), {
					distanceCurrent: dungeon.distanceStart,
					ease: Power0.easeIn,
					onUpdate: dungeon.setGridPosition,
					onComplete: dungeon.moveEnd,
				})
			}
		}
	}
	function moveEnd() {
		dungeon.walking = 0
		dungeon.walkTween.pause()
		if (dungeon.distanceCurrent >= dungeon.distanceEnd) {
			battle.go()
		}
	}
	function getBlurValue(distance) {
		distance = ((distance * -1) - 1500)
		if (distance < 0) distance = 0
		blurValue = distance / 5000
		if (blurValue > MAX_BLUR) blurValue = MAX_BLUR
		return blurValue
	}
	function turnLeft() {
		if (dungeon.walking || TURN_DISABLED) return
		dungeon.walking = 1
		let x = dungeon.orc.x
		let y = dungeon.orc.y
		let xEnd = 0
		let yEnd = 0
		let alphaEnd = 1
		let distance = dungeon.getEntityDistance()
		let yEase = Power0.easeNone
		if (x === 0) {
			if (y <= -CLOSEST_MOB_DISTANCE) {
				// front
				xEnd = distance
				yEnd = 0
				alphaEnd = 0
				yEase = Circ.easeIn
			}
			else {
				// back
				xEnd = -distance
				yEnd = 0
			}
		}
		else {
			if (x > 0) {
				// right
				xEnd = 0
				yEnd = distance
				alphaEnd = 0
				dungeon.orc.alpha = 0
			}
			else {
				// left
				xEnd = 0
				yEnd = -distance
				yEase = Circ.easeOut
				dungeon.orc.alpha = 1
			}
		}
		TweenMax.to(dungeon.tiling.tileTransform, TURN_SPEED, {
			pixi: { rotation: '+=' + TURN_INTERVAL },
			ease: Power0.easeIn,
		})
		TweenMax.to(dungeon.orc, TURN_SPEED, {
			x: xEnd,
			ease: Power0.easeNone,
		})
		TweenMax.to(dungeon.orc, TURN_SPEED, {
			y: yEnd,
			ease: yEase,
			onComplete: () => {
				dungeon.orc.alpha = alphaEnd
				dungeon.moveEnd()
			}
		})
		dungeon.direction -= TURN_INTERVAL
	}
	function turnRight() {
		if (dungeon.walking || TURN_DISABLED) return
		dungeon.walking = 1
		let x = dungeon.orc.x
		let y = dungeon.orc.y
		let xEnd = 0
		let yEnd = 0
		let alphaStart = 1
		let alphaEnd = 1
		let distance = dungeon.getEntityDistance()
		let yEase = Power0.easeNone

		if (x === 0) {
			if (y <= -CLOSEST_MOB_DISTANCE) {
				// front
				xEnd = -distance
				yEnd = 0
				alphaEnd = 0
				yEase = Circ.easeIn
			}
			else {
				// back
				xEnd = distance
				yEnd = 0
			}
		}
		else {
			if (x > 0) {
				// right
				xEnd = 0
				yEnd = -distance
				yEase = Circ.easeOut
				dungeon.orc.alpha = 1
			}
			else {
				// left
				xEnd = 0
				yEnd = distance
				alphaEnd = 0
				dungeon.orc.alpha = 0
			}
		}

		TweenMax.to(dungeon.tiling.tileTransform, TURN_SPEED, {
			pixi: { rotation: '-=' + TURN_INTERVAL },
			ease: Power0.easeIn,
		})
		TweenMax.to(dungeon.orc, TURN_SPEED, {
			x: xEnd,
			ease: Power0.easeNone,
		})
		TweenMax.to(dungeon.orc, TURN_SPEED, {
			y: yEnd,
			ease: yEase,
			onComplete: () => {
				dungeon.orc.alpha = alphaEnd
				dungeon.moveEnd()
			}
		})
		dungeon.direction += TURN_INTERVAL
	}
})(TweenMax, $, _, Power0, Sine);