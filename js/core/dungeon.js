var dungeon;
(function(TweenMax, $, _, Power0, Sine, undefined) {
	// TODO: broadcast
/*
	- state of entities
	- Move start
	- move end
	- battle won (set index of entities to alive: false)
*/
	const BOTTOM_PLAYER = MaxHeight - 80
	const GRID_SIZE = 1920
	const MAX_TILES = 20
	const HALLWAY_TILE_LENGTH = 5
	const MOB_HALLWAY_INTERVAL = (GRID_SIZE * 5) * .5 // 4800 - length that a mob can spawn in
	const MOB_HALLWAY_MIN = 0 // 1200 - 2400 minimum if first interval (25%)
	const MOB_HALLWAY_MAX = MOB_HALLWAY_INTERVAL * .7
	// player starts in hallway at 1200 (12.5%), but mob on first interval can't appear until 2400 (25%)
	const PLAYER_HALLWAY_START = MOB_HALLWAY_INTERVAL - MOB_HALLWAY_MAX
	const MOB_DISTANCE = [
		{
			min: PLAYER_HALLWAY_START * 2,
			max: MOB_HALLWAY_INTERVAL,
		},
		{
			min: MOB_HALLWAY_INTERVAL + PLAYER_HALLWAY_START,
			max: MOB_HALLWAY_INTERVAL + MOB_HALLWAY_MAX,
		}
	]
	dungeon = {
		initialized: 0,
		isDungeon: true,
		layer: {},
		camera: {},
		bgLayer: {},
		bg: {},
		mainLayer: {},
		groundLayer: {},
		map: {},
		tilesFloor: [],
		tilesCeiling: [],
		tilesLeftWall: [],
		tilesRightWall: [],
		containerFloor: {},
		containerEntities: {},
		containerCeiling: {},
		containerLeftWall: {},
		containerRightWall: {},
		tiling: {},
		floor: {},
		ceiling: {},
		sky: {},
		entities: [[{}]],
		closestEntity: 0, // cached closest alive entity
		closestEntityIndex: -1, // wall or indexed mob
		endWall: {},
		tickUpdate: {},
		hallwayPlayerStart: PLAYER_HALLWAY_START,
		centerX: [960, 1280, 640, 1600, 320],
		bottom: MaxHeight,
		headY: BOTTOM_PLAYER - 200,
		bottomY: BOTTOM_PLAYER,
		gridElementY: {},
		gridSize: GRID_SIZE,
		gridDuration: 2,
		walking: 0,
		distanceStart: 0,
		distanceCurrent: 0,
		hallwayTileLength: HALLWAY_TILE_LENGTH,
		totalTiles: MAX_TILES,
		distanceEnd: GRID_SIZE * MAX_TILES,
		hallwayLength: GRID_SIZE * HALLWAY_TILE_LENGTH,
		distancePerSecond: app.isApp ? (GRID_SIZE * .2) : GRID_SIZE * 3,
		walkTween: TweenMax.to('#body', 0, {}),
		centerY,
		go,
		rxGo,
		init,
		html,
		enterCombat,
		walkForward,
		walkBackward,
		walkStop,
		setGridPosition,
		getWalkDurationEnd,
		getWalkDurationStart,
		animateEntities,
		getWalkProgress,
		getWalkProgressToGo,
		getEntityDistanceFromMe,
		setEndWallDistance,
		setEndWall,
		initCanvas,
		setSrc,
		setDungeonEntities,
		killEntityTweens,
		rxWalkForward,
		rxWalkBackward,
		rxWalkStop,
		createHallwayMobs,
		getRoomMobCount,
		setBossRoom,
		broadcastMapData,
	}
	let blurValue = 0
	const CLOSEST_MOB_DISTANCE = -200
	const MOB_DUNGEON_SIZE = 1
	const MAX_BLUR = 3
	$('#scene-dungeon')
		.on('mousedown', handleClickDungeon)
		.on('mouseup', handleClickDungeonUp)
	///////////////////////////////////////
	function go(force) {
		if (!force && ng.view === 'dungeon') return
		if (party.presence[0].isLeader) {
			delayedCall(.5, preloadCombatAssets)
		}
		goTasks()
	}
	function rxGo() {
		console.info('rxGo')
		goTasks()
		delayedCall(.5, preloadCombatAssets)
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
		dungeon.setGridPosition()

		combat.autoAttackDisable()
		// reset some combat data
		mobs.forEach((m, i) => {
			mobs[i].name = ''
			mobs[i].hp = 0
		})
		combat.resetTimersAndUI()

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
		if (map.inRoom) {
			battle.go()
		}

		ng.unlock()
	}
	function broadcastMapData() {
		socket.publish('party' + my.partyId, {
			route: 'p->goDungeon',
			grid: dungeon.map,
		}, true)
	}
	function getRoomMobCount(h, index) {
		// room zero never has mobs
		h.isAlive = index === 0 ? false : true
	}
	function setBossRoom() {
		let x = dungeon.map.rooms[0].x
		let y = dungeon.map.rooms[0].y
		let maxDiff = 0
		let bossIndex = 0
		dungeon.map.rooms.forEach((r, index) => {
			let xDiff = Math.abs(r.x - x)
			let yDiff = Math.abs(r.y - y)
			let totalDiff = xDiff + yDiff
			if (totalDiff > maxDiff) {
				maxDiff = totalDiff
				bossIndex = index
			}
		})
		dungeon.map.rooms[bossIndex].boss = true
	}
	function preloadCombatAssets() {
		console.info('LOADING ASSETS')
		battle.loadTextures()
		cache.preloadPlayerAsk()
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
			dungeon.entities = [[]]
			map.init(dungeon.map)
			dungeon.initCanvas()
			player.initCanvas()
			combat.updateCanvasLayer()
		}
		setDungeonEntities()
		dungeon.animateEntities()
		button.setAll()
		chat.scrollBottom()
	}
	function killEntityTweens() {
		dungeon.entities.forEach(hallway => {
			hallway.forEach(entity => {
				typeof entity.sprite === 'object' &&
				typeof entity.sprite.tween === 'object' &&
				entity.sprite.tween.kill()
			})
		})
	}
	function initCanvas() {
		if (typeof dungeon.layer.view === 'object') return
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
		dungeon.layer.stage.addChild(dungeon.sky)

		// tiling - takes whole screen, anchor and position are the same as of sprite floor
		dungeon.tiling = new PIXI.projection.TilingSprite2d(
			PIXI.Texture.from('images/dungeon/bg_plane-512.jpg'),
			MaxWidth,
			MaxHeight
		)
		dungeon.tiling.position.set(MaxWidth * .5, MaxHeight)
		dungeon.tiling.height = MaxHeight * .5
		dungeon.tiling.anchor.set(0.5, 1.0)
		dungeon.tiling.tint = 0xff00ff
		dungeon.tiling.zIndex = 1
		dungeon.tiling.tileProj.setAxisY({
			x: 0,
			y: MaxHeight * .5,
		}, -1)
		dungeon.layer.stage.addChild(dungeon.tiling)

		dungeon.tilesCeiling = []
		dungeon.tilesFloor = []
		dungeon.tilesLeftWall = []
		dungeon.tilesRightWall = []
		if (dungeon.isDungeon) {
			addFloorTiles()
			addCeilingTiles()
			addLeftWallTiles()
			addRightWallTiles()
			addEndWall()
			addEntityContainer()
		}
	}
	function addEntityContainer() {
		dungeon.containerEntities = new PIXI.projection.Container2d()
		dungeon.containerEntities.sortableChildren = true
		dungeon.containerEntities.id = 'entities'
		dungeon.containerEntities.zIndex = 3
		dungeon.containerEntities.position.set(MaxWidth * .5, MaxHeight)
		dungeon.containerEntities.proj.setAxisY({
			x: 0,
			y: MaxHeight * .5,
		}, -1)
		dungeon.layer.stage.addChild(dungeon.containerEntities)
	}
	function setEndWallDistance() {
		dungeon.endWall.position.y = (dungeon.distanceEnd - dungeon.distanceCurrent) * -1
	}
	function createHallwayMobs() {
		// up to 2 mobs per 9600 length hallway
		let mobLen = ~~(dungeon.hallwayTileLength / 2.5)
		dungeon.map.hallways.forEach((h, hIndex) => {
			h.entities = []
			for (var i=0; i<mobLen; i++) {
				if (Math.random() > .33) {
					// TODO: Random from zone instead of hard-coded
					h.entities.push({
						isAlive: true,
						img: 'toadlok',
						distance: _.random(MOB_DISTANCE[i].min, MOB_DISTANCE[i].max) * -1
					})
				}
			}
		})
	}
	function setDungeonEntities() {
		// cleanup
		dungeon.killEntityTweens()
		dungeon.containerEntities.removeChildren()
		// setup
		dungeon.entities[map.hallwayId].forEach((entity, index) => {
			if (!entity.isAlive) return
			battle.loadMobTexture(entity.img)
			let ent = dungeon.entities[map.hallwayId][index]
			ent.sprite = new PIXI.projection.Sprite2d(PIXI.Texture.from('mobs/'+ entity.img + '/1.png'))
			ent.sprite.index = index
			ent.sprite.id = 'entity-' + index
			ent.sprite.class = 'entities'
			ent.sprite.anchor.set(0.5, mobs.images[entity.img].anchorY)
			ent.sprite.factor = 1
			ent.sprite.proj.affine = PIXI.projection.AFFINE.AXIS_X
			ent.sprite.y = dungeon.getEntityDistanceFromMe(index)
			ent.sprite.zIndex = 999 - index
			// size and check offset
			// ent.y = mobs.images[img].yPadding * MOB_DUNGEON_SIZE
			TweenMax.set(ent.sprite, {
				pixi: { scale: MOB_DUNGEON_SIZE }
			})
			// idle
			let tween = getIdleTween()
			ent.sprite.tween = TweenMax.to(tween,
				mobs.images[entity.img].frameSpeed * tween.diff * 2, {
				startAt: { frame: tween.start },
				frame: tween.end,
				yoyo: true,
				repeat: -1,
				repeatDelay: mobs.images[entity.img].frameSpeed,
				ease: Sine.easeOut,
				onUpdate: dungeon.setSrc,
				onUpdateParams: [tween, ent],
			})
			dungeon.containerEntities.addChild(ent.sprite)
		})
		setClosestEntity()
	}
	function setClosestEntity() {
		dungeon.closestEntity = dungeon.distanceEnd
		dungeon.closestEntityIndex = -1 // door
		if (dungeon.entities[map.hallwayId].length) {
			dungeon.closestEntity = dungeon.entities[map.hallwayId].reduce((acc, entity, index) => {
				// higher number is closer (confusing)
				// let distance = -dungeon.getEntityDistanceFromMe(index)
				let distance = -entity.distance
				if (map.compass >= 2) {
					distance = dungeon.distanceEnd + entity.distance
				}
				// console.info('setClosestEntity', distance, acc)
				if (entity.isAlive && distance < acc) {
					acc = distance + CLOSEST_MOB_DISTANCE
					dungeon.closestEntityIndex = index
				}
				return acc
			}, dungeon.distanceEnd)
		}
	}
	function setGridPosition() {
		// position updates
		map.updatePosition()

		// animate
		dungeon.animateEntities()
		if (dungeon.isDungeon) {
			dungeon.tilesFloor.forEach(positionGridTile)
			dungeon.tilesCeiling.forEach(positionGridTile)
			dungeon.tilesLeftWall.forEach(positionGridTileWall)
			dungeon.tilesRightWall.forEach(positionGridTileWall)
			setEndWallDistance()
		}
		else {
			dungeon.tiling.tilePosition.y = dungeon.distanceCurrent
		}

		// room/battle checks
		// console.info(dungeon.distanceCurrent, dungeon.distanceEnd, dungeon.closestEntity, -dungeon.getEntityDistanceFromMe(dungeon.closestEntityIndex))
		if (dungeon.distanceCurrent <= 0) {
			// go backwards to roomId
			map.inRoom = true
			dungeon.walkStop()
			battle.go()
		}
		else if (dungeon.distanceCurrent >= Math.min(
			dungeon.distanceEnd,
			dungeon.closestEntity
		)) {
			if (dungeon.distanceCurrent >= dungeon.distanceEnd) {
				// entered room
				map.enterRoom(map.roomToId)
			}
			else {
				// or hallway battle?
				map.inRoom = false
			}
			dungeon.walkStop()
			battle.go()
		}
	}
	function positionGridTile(tile, index) {
		tile.position.y = ((tile.gridIndex * MaxWidth) - dungeon.distanceCurrent) * -1
	}
	function positionGridTileWall(tile, index) {
		tile.position.x = ((tile.gridIndex * MaxWidth * AspectRatio) - (dungeon.distanceCurrent * AspectRatio)) * -1
	}
	function getEntityDistanceFromMe(index) {
		if (index < 0) return
		if (map.compass <= 1) {
			// north/east
			return dungeon.entities[map.hallwayId][index].distance + dungeon.distanceCurrent
		}
		else {
			// south/west
			return ((-dungeon.distanceEnd - dungeon.entities[map.hallwayId][index].distance) + dungeon.distanceCurrent)
		}
	}
	function animateEntities() {
		dungeon.entities[map.hallwayId].forEach(positionEntity)
	}
	function positionEntity(entity, index) {
		if (typeof entity.sprite === 'undefined') return
		entity.sprite.y = dungeon.getEntityDistanceFromMe(index)
	}
	function setSrc(tween, ent) {
		tween.frame = ~~tween.frame
		if (tween.frame !== tween.lastFrame) {
			ent.sprite.texture = mob.textures[ent.img][tween.frame]
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
			if (e.shiftKey || (e.clientY / window.innerHeight > .85)) dungeon.walkBackward()
			else dungeon.walkForward()
		}
	}
	function handleClickDungeonUp() {
		if (party.presence[0].isLeader) {
			dungeon.walkStop()
		}
	}
	// moving functions
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
	function getBlurValue(distance) {
		distance = ((distance * -1) - 1500)
		if (distance < 0) distance = 0
		blurValue = distance / 5000
		if (blurValue > MAX_BLUR) blurValue = MAX_BLUR
		return blurValue
	}
	function walkForward() {
		if (dungeon.getWalkProgress() >= 0 &&
			dungeon.getWalkProgress() < 1) {
			if (party.presence[0].isLeader) {
				if (party.hasMoreThanOnePlayer()) {
					socket.publish('party' + my.partyId, {
						route: 'p->walkForward',
					}, true)
				}
				dungeon.rxWalkForward()
			}
		}
	}
	function rxWalkForward() {
		dungeon.walking = 1
		dungeon.walkTween = TweenMax.to(dungeon, dungeon.getWalkDurationEnd(), {
			distanceCurrent: dungeon.distanceEnd,
			ease: Power0.easeIn,
			onUpdate: dungeon.setGridPosition,
			onComplete: dungeon.walkStop,
		})
	}
	function walkBackward() {
		if (dungeon.getWalkProgress() > 0 && dungeon.getWalkProgress() < 1) {
			if (party.presence[0].isLeader) {
				if (party.hasMoreThanOnePlayer()) {
					socket.publish('party' + my.partyId, {
						route: 'p->walkBackward',
					}, true)
				}
				dungeon.rxWalkBackward()
			}
		}
	}
	function rxWalkBackward() {
		dungeon.walking = -1
		dungeon.walkTween = TweenMax.to(dungeon, dungeon.getWalkDurationStart(), {
			distanceCurrent: dungeon.distanceStart,
			ease: Power0.easeIn,
			onUpdate: dungeon.setGridPosition,
			onComplete: dungeon.walkStop,
		})
	}
	function walkStop() {
		if (party.presence[0].isLeader) {
			if (party.hasMoreThanOnePlayer()) {
				socket.publish('party' + my.partyId, {
					route: 'p->walkStop',
				}, true)
			}
			dungeon.rxWalkStop()
		}
	}
	function rxWalkStop() {
		dungeon.walking = 0
		dungeon.walkTween.pause()
	}
	function addFloorTiles() {
		dungeon.containerFloor = new PIXI.projection.Container2d()
		dungeon.containerFloor.id = 'floor'
		dungeon.containerFloor.zIndex = 3
		dungeon.containerFloor.position.set(MaxWidth * .5, MaxHeight)
		dungeon.containerFloor.proj.setAxisY({
			x: 0,
			y: MaxHeight * .5,
		}, -1)
		dungeon.layer.stage.addChild(dungeon.containerFloor)
		for (var i=0; i<MAX_TILES; i++) {
			let tile = new PIXI.projection.Sprite2d(PIXI.Texture.from('images/dungeon/bg_plane-512.jpg'))
			tile.anchor.set(.5, 1)
			tile.width = MaxWidth
			tile.height = MaxWidth
			tile.position.y = i * MaxWidth * -1
			tile.gridIndex = i
			TweenMax.set(tile, {
				pixi: { tint: '#aaa', }
			})
			dungeon.tilesFloor.push(tile)
			dungeon.containerFloor.addChild(tile)
		}
	}
	function addCeilingTiles() {
		dungeon.containerCeiling = new PIXI.projection.Container2d()
		dungeon.containerCeiling.zIndex = 1
		dungeon.containerCeiling.position.set(MaxWidth * .5, 0)
		dungeon.containerCeiling.proj.setAxisY({
			x: 0,
			y: MaxHeight * .5 * -1,
		}, -1)
		dungeon.layer.stage.addChild(dungeon.containerCeiling)

		for (var i=0; i<MAX_TILES; i++) {
			let tile = new PIXI.projection.Sprite2d(PIXI.Texture.from('images/dungeon/bg_plane-512.jpg'))
			tile.anchor.set(.5, 1)
			tile.width = MaxWidth
			tile.height = MaxWidth
			tile.position.y = i * MaxWidth * -1
			tile.gridIndex = i
			TweenMax.set(tile, {
				pixi: {
					tint: '#aaa',
				}
			})
			dungeon.tilesCeiling.push(tile)
			dungeon.containerCeiling.addChild(tile)
		}
	}
	function addLeftWallTiles() {
		dungeon.containerLeftWall = new PIXI.projection.Container2d()
		dungeon.containerLeftWall.zIndex = 1
		dungeon.containerLeftWall.position.set(0, MaxHeight * .5)
		dungeon.containerLeftWall.proj.setAxisX({
			x: MaxWidth * .5 * -1,
			y: 0,
		}, -1)
		dungeon.layer.stage.addChild(dungeon.containerLeftWall)

		for (var i=0; i<MAX_TILES; i++) {
			let tile = new PIXI.projection.Sprite2d(PIXI.Texture.from('images/dungeon/bg_plane-wall-512.jpg'))
			tile.anchor.set(1, .5)
			tile.width = MaxWidth * AspectRatio
			tile.height = MaxHeight
			tile.position.x = i * MaxWidth * AspectRatio * -1
			tile.gridIndex = i
			TweenMax.set(tile, {
				pixi: {
					tint: '#fda',
				}
			})
			dungeon.tilesLeftWall.push(tile)
			dungeon.containerLeftWall.addChild(tile)
		}
	}
	function addRightWallTiles() {
		dungeon.containerRightWall = new PIXI.projection.Container2d()
		dungeon.containerRightWall.zIndex = 1
		dungeon.containerRightWall.position.set(MaxWidth, MaxHeight * .5)
		dungeon.containerRightWall.proj.setAxisX({
			x: MaxWidth * .5,
			y: 0,
		}, -1)
		dungeon.layer.stage.addChild(dungeon.containerRightWall)

		for (var i=0; i<MAX_TILES; i++) {
			let tile = new PIXI.projection.Sprite2d(PIXI.Texture.from('images/dungeon/bg_plane-wall-512.jpg'))
			tile.anchor.set(1, .5)
			tile.width = MaxWidth * AspectRatio
			tile.height = MaxHeight
			tile.position.x = i * MaxWidth * AspectRatio * -1
			tile.gridIndex = i
			TweenMax.set(tile, {
				pixi: {
					tint: '#fda',
				}
			})
			dungeon.tilesRightWall.push(tile)
			dungeon.containerRightWall.addChild(tile)
		}
	}
	function addEndWall() {
		dungeon.endWall = new PIXI.projection.Sprite2d(PIXI.Texture.from('images/dungeon/bg_plane-512.jpg'))
		dungeon.endWall.anchor.set(.5, 1)
		dungeon.endWall.factor = 1
		dungeon.endWall.proj.affine = PIXI.projection.AFFINE.AXIS_X
		dungeon.endWall.position.x = 0
		dungeon.endWall.width = MaxWidth
		dungeon.endWall.height = MaxHeight
		TweenMax.set(dungeon.endWall, {
			pixi: {
				contrast: 5,
				brightness: .05
			}
		})
		// size and check offset
		setEndWallDistance()
		dungeon.containerFloor.addChild(dungeon.endWall)
	}
	function setEndWall() {
		TweenMax.set(dungeon.endWall, {
			y: -dungeon.distanceEnd
		})
	}
})(TweenMax, $, _, Power0, Sine);