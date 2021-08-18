var dungeon;
(function(TweenMax, $, _, Power0, Sine, Power2, undefined) {
	// TODO: broadcast
/*
	- state of entities
	- Move start
	- move end
	- battle won (set index of entities to alive: false)
*/
	const BOTTOM_PLAYER = MAX_HEIGHT
	const GRID_SIZE = 1920
	const MAX_TILES = 20
	const HALLWAY_TILE_LENGTH = 5
	const MOB_HALLWAY_INTERVAL = (GRID_SIZE * 5) * .5 // 4800 - length that a mob can spawn in
	const MOB_HALLWAY_MIN = 0 // 1200 - 2400 minimum if first interval (25%)
	const MOB_HALLWAY_MAX = MOB_HALLWAY_INTERVAL * .7
	// player starts in hallway at 1200 (12.5%), but mob on first interval can't appear until 2400 (25%)
	const PLAYER_HALLWAY_START = MOB_HALLWAY_INTERVAL * .25
	// first and second mob min/max positions
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
		suppressDoorNoise: false,
		mobKeys: [
			'name',
			'img',
			'level',
			'tier',
			'size'
		],
		walkSoundInterval: 0,
		initialized: false,
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
		closestEntity: {}, // for sfx reference
		closestEntityDistance: 0, // cached closest alive entity
		closestEntityIndex: -1, // wall or indexed mob
		endWall: {},
		tickUpdate: {},
		hallwayPlayerStart: PLAYER_HALLWAY_START,
		// centerX: [960, 1248, 672, 1536, 384],
		centerX: [960, 1090, 830, 1220, 700],
		headY: BOTTOM_PLAYER - 280,
		bottomY: BOTTOM_PLAYER,
		gridElementY: {},
		gridSize: GRID_SIZE,
		gridDuration: 2,
		walking: 0,
		walkDisabled: false,
		walkTransitionDisabled: false,
		distanceStart: 0,
		distanceCurrent: 0,
		hallwayTileLength: HALLWAY_TILE_LENGTH,
		totalTiles: MAX_TILES,
		distanceEnd: GRID_SIZE * MAX_TILES,
		hallwayLength: GRID_SIZE * HALLWAY_TILE_LENGTH,
		distancePerSecond: GRID_SIZE * 3,
		walkTween: TweenMax.to('#body', 0, {}),
		centerY,
		go,
		rxGo,
		init,
		html,
		walkForward,
		walkBackward,
		walkStop,
		setGridPosition,
		getWalkDurationEnd,
		getWalkDurationStart,
		updateEntityPositions,
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
		setRoomType,
		setBossRoom,
		preloadCombatAssets,
		rxEnterRoomForward,
		rxEnterRoomBackward,
		setRunSpeed,
	}
	let blurValue = 0
	const CLOSEST_MOB_DISTANCE = -200
	const MOB_DUNGEON_SIZE = 1.6 // this should equate to about scale 1 in combat (?)
	const MAX_BLUR = 3
	$('#scene-dungeon').on('mousedown', handleClickDungeon)
		.on('mouseup', handleClickDungeonUp)
	///////////////////////////////////////
	function go(force) {
		if (!force && ng.view === 'dungeon') return
		if (party.presence[0].isLeader) {
			delayedCall(.5, preloadCombatAssets)
		}
		dungeon.walkTransitionDisabled = true
		goTasks()
	}

	/**
	 * Only called upon entering dungeon
	 */
	function rxGo() {
		dungeon.suppressDoorNoise = true
		const zoneName = mission.getZoneKey()
		updateDungeonTextures(zoneName)
		town.closeVarious()
		chat.log('You have entered ' + zones[mission.id].name + '.')
		delayedCall(.5, preloadCombatAssets)
		goTasks()
	}
	function goTasks() {
		// cleanup sort of activities when going into dungeon
		audio.fadeMusic()
		audio.playAmbientLoop()
		game.showScene('scene-dungeon')

		// coming out of battle - save!
		if (ng.view === 'battle') {
			mob.killAllAttacks()
			if (combat.skillLeveledUpCount) {
				my.saveCharacterData()
				combat.skillLeveledUpCount = 0
			}
		}
		if (ng.view === 'town') {
			// expanse.killAllTweens()
			chat.publishRemove()
			// clear any town-based channels
			for (var key in socket.subs) {
				if (key.startsWith('ng2')) {
					console.info('unsubscribed from', key)
					socket.unsubscribe(key)
				}
			}
		}

		// set new channel data
		my.channel = ''
		// force change to party chat if in town chat
		if (chat.modeCommand === '/say') {
			chat.modeChange(CHAT.PARTY)
		}
		/////////////////////////// scene change
		chat.sizeDungeon()
		ng.setScene('dungeon')
		audio.stopAmbient()
		audio.playAmbientLoop()
		dungeon.init()
		dungeon.setGridPosition()

		combat.autoAttackDisable()
		// reset some combat data
		mob.initMobData()
		combat.resetTimersAndUI(true)

		TweenMax.to('#scene-dungeon', .5, {
			startAt: { filter: 'brightness(0)' },
			delay: .5,
			filter: 'brightness(1)'
		})
		/*TweenMax.to('#sky-wrap', .5, {
			startAt: { filter: 'brightness(0)' },
			delay: .5,
			filter: 'brightness(1)'
		})*/
		// draw players
		player.show()
		mobSkills.initFilter()
		if (map.inRoom) {
			battle.go()
		}
		delayedCall(ROOM_TRANSITION_DURATION, () => {
			dungeon.walkTransitionDisabled = false
		})

		ng.unlock()
	}
	function setRoomType(room, index) {
		// room zero never has mobs
		if (index === 0) {
			room.isAlive = false
		}
		else {
			if (!room.boss) {
				let roll = Math.random()
				room.isAlive = false
				if (roll > .95) {
					room.isTreasure = true
				}
				else if (roll > .9) {
					room.isRelic = true
				}
				else if (roll > .8) {
					room.isAlive = false
				}
				else {
					// 80% chance for combat room
					room.isAlive = true
				}
			}
		}
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
		dungeon.map.rooms[bossIndex].isAlive = true
	}
	function preloadCombatAssets() {
		battle.loadTextures()
		cache.preloadPlayerAsk()
	}
	function init() {
		dungeon.setRunSpeed()
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
			map.init()
			dungeon.initCanvas()
			player.initCanvas() // abandoned idea
			combat.updateCanvasLayer()
		}
		setDungeonEntities()
		dungeon.updateEntityPositions()
		button.setAll()
		chat.scrollBottom()
	}
	function initDungeonTextures() {
		const zoneName = mission.getZoneKey()
		addFloorTiles(zoneName)
		addCeilingTiles(zoneName)
		addLeftWallTiles(zoneName)
		addRightWallTiles(zoneName)
		addEndWall(zoneName)
		addEntityContainer()
		// console.warn('initDungeonTextures')
	}
	function setRunSpeed() {
		dungeon.distancePerSecond = Config.walkFast ? GRID_SIZE * 3 : GRID_SIZE * .4
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
			width: MAX_WIDTH,
			height: MAX_HEIGHT,
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

		/*dungeon.sky = PIXI.Sprite.from('images/dungeon/bg-test-sky.jpg')
		dungeon.sky.zIndex = 1
		dungeon.layer.stage.addChild(dungeon.sky)

		// tiling - takes whole screen, anchor and position are the same as of sprite floor
		dungeon.tiling = new PIXI.projection.TilingSprite2d(
			PIXI.Texture.from('images/dungeon/bg_plane-512.jpg'),
			MAX_WIDTH,
			MAX_HEIGHT
		)
		dungeon.tiling.position.set(MAX_WIDTH * .5, MAX_HEIGHT)
		dungeon.tiling.height = MAX_HEIGHT * .5
		dungeon.tiling.anchor.set(0.5, 1.0)
		dungeon.tiling.tint = 0xff00ff
		dungeon.tiling.zIndex = 1
		dungeon.tiling.tileProj.setAxisY({
			x: 0,
			y: MAX_HEIGHT * .5,
		}, -1)
		dungeon.layer.stage.addChild(dungeon.tiling)*/

		initDungeonTextures()
	}
	function addEntityContainer() {
		dungeon.containerEntities = new PIXI.projection.Container2d()
		dungeon.containerEntities.sortableChildren = true
		dungeon.containerEntities.id = 'entities'
		dungeon.containerEntities.zIndex = 3
		dungeon.containerEntities.position.set(MAX_WIDTH * .5, MAX_HEIGHT)
		dungeon.containerEntities.proj.setAxisY({
			x: 0,
			y: MAX_HEIGHT * .5,
		}, -1)
		dungeon.layer.stage.addChild(dungeon.containerEntities)
	}
	function setEndWallDistance() {
		dungeon.endWall.position.y = (dungeon.distanceEnd - dungeon.distanceCurrent) * -1
	}
	function createHallwayMobs() {
		// up to 2 mobs per 9600 length hallway
		let mobLen = ~~(dungeon.hallwayTileLength / 2.5)
		let minZoneLevel = zones.find(z => z.name === zones[mission.id].name).level
		dungeon.map.hallways.forEach((h, hIndex) => {
			h.entities = []
			for (var i=0; i<mobLen; i++) {
				if (Math.random() > .33) {
					let query = {
						level: battle.getMobLevelByQuest(minZoneLevel)
					}
					if (mob.isUniqueTier(_.random(1, 100))) {
						query.tier = MOB_TIERS.unique
					}
					const randomMob = mob.getRandomMobByZone(query, zones[mission.id].name)
					let mobData = _.pick(randomMob, dungeon.mobKeys)
					h.entities.push({
						isAlive: true,
						distance: _.random(MOB_DISTANCE[i].min, MOB_DISTANCE[i].max) * -1,
						...mobData
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

			// This should layer mobs correctly when going north, south, east, or west
			// it should be reversed for south/west
			if (map.compass < 2) {
				// north or east
				ent.sprite.zIndex = 999 - index
			}
			else {
				ent.sprite.zIndex = 999 + index
			}
			// size and check offset
			// ent.y = mobs.images[img].yPadding * MOB_DUNGEON_SIZE
			TweenMax.set(ent.sprite, {
				pixi: { scale: MOB_DUNGEON_SIZE * entity.size }
			})
			function getEntityScale() {
				const aliveEntitiesInHallway = dungeon.map.hallways[map.hallwayId].entities.filter(e => e.isAlive)
				let entity = {}
				if (map.compass < 2) {
					// north/east
					entity = _.first(aliveEntitiesInHallway)
				} else {
					// south/west
					entity = _.last(aliveEntitiesInHallway)
				}
				return entity
			}
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
		dungeon.closestEntity = {}
		dungeon.closestEntityDistance = dungeon.distanceEnd
		dungeon.closestEntityIndex = -1 // door
		if (dungeon.entities[map.hallwayId].length) {
			// distance
			dungeon.closestEntityDistance = dungeon.entities[map.hallwayId].reduce((acc, entity, index) => {
				// higher number is closer (confusing)
				let distance = -entity.distance
				if (map.compass >= 2) {
					distance = dungeon.distanceEnd + entity.distance
				}
				// console.info('setClosestEntity', distance, acc)
				if (entity.isAlive && distance < acc) {
					acc = distance + CLOSEST_MOB_DISTANCE
					dungeon.closestEntity = entity
					dungeon.closestEntityIndex = index
				}
				return acc
			}, dungeon.distanceEnd)
		}
	}

	let roomTransitionTimestamp = Date.now()
	function setGridPosition() {
		if (map.menuPrompt) {
			map.handleMapNo()
		}
		if (dungeon.walkDisabled) return
		// position updates
		map.updatePosition()

		// animate
		dungeon.updateEntityPositions()
		dungeon.tilesFloor.map(positionGridTile)
		dungeon.tilesCeiling.map(positionGridTile)
		dungeon.tilesLeftWall.map(positionGridTileWall)
		dungeon.tilesRightWall.map(positionGridTileWall)
		setEndWallDistance()
		// console.info("WALKING FORWARD...", performance.now())

		// room/battle checks
		if (dungeon.distanceCurrent <= 0) {
			// go backwards to roomId
			if (allowSceneTransition()) {
				dungeon.walkDisabled = true // to prevent walking
				roomTransitionTimestamp = Date.now()
				dungeon.walkStop()
				if (party.presence[0].isLeader) {
					rxEnterRoomBackward()
					socket.publish('party' + my.partyId, {
						route: 'p->enterRoomBackward',
					}, true)
					battle.go()
				}
			}
		}
		else if (dungeon.distanceCurrent >= Math.min(
			dungeon.distanceEnd,
			dungeon.closestEntityDistance
		)) {
			// going forwards to room or hall battle
			if (allowSceneTransition()) {
				// console.warn("TRANSIT...", performance.now())
				dungeon.walkDisabled = true // to prevent walking
				roomTransitionTimestamp = Date.now()
				dungeon.walkStop()
				if (party.presence[0].isLeader) {
					map.inRoom = dungeon.distanceCurrent >= dungeon.distanceEnd
					rxEnterRoomForward({
						roomToId: map.roomToId,
						inRoom: map.inRoom,
					})
					socket.publish('party' + my.partyId, {
						route: 'p->enterRoomForward',
						inRoom: map.inRoom,
						roomToId: map.roomToId,
					}, true)
					delayedCall(ROOM_TRANSITION_DURATION, battle.go)
				}
			}
		}
	}

	const SCENE_CHANGE_DURATION = 500
	function allowSceneTransition() {
		return (Date.now() - roomTransitionTimestamp) > SCENE_CHANGE_DURATION
	}

	const ROOM_TRANSITION_DURATION = .8
	function rxEnterRoomBackward() {
		audio.playEnterDoor()
		map.inRoom = true
		map.enterRoom(map.roomId)
	}
	function rxEnterRoomForward(data) {
		if (data.inRoom) {
			// entered room
			TweenMax.to('#scene-dungeon', ROOM_TRANSITION_DURATION, {
				startAt: { transformOrigin: '50% 50%' },
				scale: 1.5,
				filter: 'brightness(0)',
				ease: Power2.easeOut,
				onComplete: () => {
					TweenMax.set('#scene-dungeon', {
						startAt: { transformOrigin: '50% 50%' },
						scale: 1,
						filter: 'brightness(1)'
					})
					map.enterRoom(data.roomToId)
				}
			})
			audio.playEnterDoor()
		}
		else {
			// or hallway battle?
			TweenMax.to('#scene-dungeon', ROOM_TRANSITION_DURATION, {
				filter: 'brightness(0)',
				ease: Power2.easeOut,
			})
			TweenMax.to('#scene-dungeon', ROOM_TRANSITION_DURATION, {
				startAt: { transformOrigin: '50% 80%' },
				scale: 1.25,
				ease: Power2.easeOut,
				onComplete: () => {
					TweenMax.set('#scene-dungeon', {
						transformOrigin: '50% 50%',
						scale: 1,
						filter: 'brightness(1)'
					})
				}
			})
			map.inRoom = false
			map.hide(ROOM_TRANSITION_DURATION * .5)
			const mobData = mob.type[dungeon.closestEntity.img]
			if (mobData) {
				audio.playSound(mobData.sfxSpecial || mobData.sfxIdle || mobData.sfxAttack, 'mobs')
			}
			// audio.playSound('sword-sharpen', 'combat')
		}
	}
	function positionGridTile(tile) {
		tile.position.y = ((tile.gridIndex * MAX_WIDTH) - dungeon.distanceCurrent) * -1
	}
	function positionGridTileWall(tile) {
		tile.position.x = ((tile.gridIndex * MAX_WIDTH * ASPECT_RATIO) - (dungeon.distanceCurrent * ASPECT_RATIO)) * -1
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
	function updateEntityPositions() {
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
	function centerY(index, race) {
		return BOTTOM_PLAYER - 220
	}
	function isWithinWalkClickRegion(e) {
		return e.clientY / window.innerHeight > .2 &&
				e.clientY / window.innerHeight < .8 &&
				e.clientX / window.innerWidth > .2 &&
				e.clientX / window.innerWidth < .8
	}
	function handleClickDungeon(e) {
		if (party.presence[0].isLeader) {
			if (isWithinWalkClickRegion(e)) {
				dungeon.walkForward()
			}
		}
	}
	function handleClickDungeonUp(e) {
		if (party.presence[0].isLeader) {
			if (isWithinWalkClickRegion(e)) {
				dungeon.walkStop()
			}
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
	function walkForward() {
		if (ng.view !== 'dungeon' || map.menuPrompt || !party.presence[0].isLeader || dungeon.walkTransitionDisabled) {
			return
		}
		if (dungeon.walking === 0) {
			dungeon.walking = 1
			if (dungeon.getWalkProgress() >= 0 &&
				dungeon.getWalkProgress() < 1) {
				if (party.hasMoreThanOnePlayer()) {
					socket.publish('party' + my.partyId, {
						route: 'p->walkForward',
					}, true)
				}
				dungeon.rxWalkForward()
			}
		}
		else {
			dungeon.walkStop()
		}

	}
	function rxWalkForward() {
		dungeon.walking = 1
		audio.startWalk()
		dungeon.walkTween = TweenMax.to(dungeon, dungeon.getWalkDurationEnd(), {
			distanceCurrent: dungeon.distanceEnd,
			ease: Power0.easeIn,
			onUpdate: dungeon.setGridPosition,
			onComplete: dungeon.walkStop,
		})
	}
	function walkBackward() {
		if (ng.view !== 'dungeon' || map.menuPrompt || !party.presence[0].isLeader || dungeon.walkTransitionDisabled) {
			return
		}
		if (dungeon.walking === 0) {
			dungeon.walking = -1
			if (dungeon.getWalkProgress() > 0 && dungeon.getWalkProgress() < 1) {
				audio.startWalk()
				if (party.hasMoreThanOnePlayer()) {
					socket.publish('party' + my.partyId, {
						route: 'p->walkBackward',
					}, true)
				}
				dungeon.rxWalkBackward()
			}
		}
		else {
			walkStop()
		}
	}
	function rxWalkBackward() {
		dungeon.walking = -1
		audio.startWalk()
		dungeon.walkTween = TweenMax.to(dungeon, dungeon.getWalkDurationStart(), {
			distanceCurrent: dungeon.distanceStart,
			ease: Power0.easeIn,
			onUpdate: dungeon.setGridPosition,
			onComplete: dungeon.walkStop,
		})
		// console.info('//////rxWalkBackward', dungeon.walking)
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
		// console.info('rxWalkStop')
		dungeon.walking = 0
		dungeon.walkTween.pause()
		clearInterval(dungeon.walkSoundInterval)
	}
	function addFloorTiles(zoneName) {
		dungeon.containerFloor = new PIXI.projection.Container2d()
		dungeon.containerFloor.id = 'floor'
		dungeon.containerFloor.zIndex = 3
		dungeon.containerFloor.position.set(MAX_WIDTH * .5, MAX_HEIGHT)
		dungeon.containerFloor.proj.setAxisY({
			x: 0,
			y: MAX_HEIGHT * .5,
		}, -1)
		dungeon.layer.stage.addChild(dungeon.containerFloor)

		for (var i=0; i<MAX_TILES; i++) {
			let tile = new PIXI.projection.Sprite2d(
				PIXI.Texture.from('images/dungeon/'+ zoneName +'-floor.jpg'))
			tile.anchor.set(.5, 1)
			tile.width = MAX_WIDTH
			tile.height = MAX_WIDTH
			tile.position.y = i * MAX_WIDTH * -1
			tile.gridIndex = i
			/*TweenMax.set(tile, {
				pixi: { tint: '#aaa', }
			})*/
			dungeon.tilesFloor.push(tile)
			dungeon.containerFloor.addChild(tile)
		}
	}
	function addCeilingTiles(zoneName) {
		dungeon.containerCeiling = new PIXI.projection.Container2d()
		dungeon.containerCeiling.zIndex = 1
		dungeon.containerCeiling.position.set(MAX_WIDTH * .5, 0)
		dungeon.containerCeiling.proj.setAxisY({
			x: 0,
			y: MAX_HEIGHT * .5 * -1,
		}, -1)
		dungeon.layer.stage.addChild(dungeon.containerCeiling)

		for (var i=0; i<MAX_TILES; i++) {
			let tile = new PIXI.projection.Sprite2d(
				PIXI.Texture.from('images/dungeon/'+ zoneName +'-ceiling.jpg'))
			tile.anchor.set(.5, 1)
			tile.width = MAX_WIDTH
			tile.height = MAX_WIDTH
			tile.position.y = i * MAX_WIDTH * -1
			tile.gridIndex = i
			/*TweenMax.set(tile, {
				pixi: {
					tint: '#aaa',
				}
			})*/
			dungeon.tilesCeiling.push(tile)
			dungeon.containerCeiling.addChild(tile)
		}
	}
	function addLeftWallTiles(zoneName) {
		dungeon.containerLeftWall = new PIXI.projection.Container2d()
		dungeon.containerLeftWall.zIndex = 1
		dungeon.containerLeftWall.position.set(0, MAX_HEIGHT * .5)
		dungeon.containerLeftWall.proj.setAxisX({
			x: MAX_WIDTH * .5 * -1,
			y: 0,
		}, -1)
		dungeon.layer.stage.addChild(dungeon.containerLeftWall)

		for (var i=0; i<MAX_TILES; i++) {
			let tile = new PIXI.projection.Sprite2d(
				PIXI.Texture.from('images/dungeon/'+ zoneName +'-wall.jpg'))
			tile.anchor.set(1, .5)
			tile.width = MAX_WIDTH * ASPECT_RATIO
			tile.height = MAX_HEIGHT
			tile.position.x = i * MAX_WIDTH * ASPECT_RATIO * -1
			tile.gridIndex = i
			/*TweenMax.set(tile, {
				pixi: {
					tint: '#fda',
				}
			})*/
			dungeon.tilesLeftWall.push(tile)
			dungeon.containerLeftWall.addChild(tile)
		}
	}
	function addRightWallTiles(zoneName) {
		dungeon.containerRightWall = new PIXI.projection.Container2d()
		dungeon.containerRightWall.zIndex = 1
		dungeon.containerRightWall.position.set(MAX_WIDTH, MAX_HEIGHT * .5)
		dungeon.containerRightWall.proj.setAxisX({
			x: MAX_WIDTH * .5,
			y: 0,
		}, -1)
		dungeon.layer.stage.addChild(dungeon.containerRightWall)

		for (var i=0; i<MAX_TILES; i++) {
			let tile = new PIXI.projection.Sprite2d(
				PIXI.Texture.from('images/dungeon/'+ zoneName +'-wall-right.jpg'))
			tile.anchor.set(1, .5)
			tile.width = MAX_WIDTH * ASPECT_RATIO
			tile.height = MAX_HEIGHT
			tile.position.x = i * MAX_WIDTH * ASPECT_RATIO * -1
			tile.gridIndex = i
			dungeon.tilesRightWall.push(tile)
			dungeon.containerRightWall.addChild(tile)
		}
	}
	function addEndWall(zoneName) {
		dungeon.endWall = new PIXI.projection.Sprite2d(
			PIXI.Texture.from('images/dungeon/'+ zoneName +'-door.jpg'))
		dungeon.endWall.anchor.set(.5, 1)
		dungeon.endWall.factor = 1
		dungeon.endWall.proj.affine = PIXI.projection.AFFINE.AXIS_X
		dungeon.endWall.position.x = 0
		dungeon.endWall.width = MAX_WIDTH
		dungeon.endWall.height = MAX_HEIGHT
		// size and check offset
		setEndWallDistance()
		dungeon.containerFloor.addChild(dungeon.endWall)
	}
	function setEndWall() {
		TweenMax.set(dungeon.endWall, {
			y: -dungeon.distanceEnd
		})
	}

	function updateDungeonTextures(zoneName) {
		if (dungeon.initialized) {
			console.warn('updateDungeonTextures')
			// floor
			dungeon.tilesFloor.map(tile => {
				tile.texture = PIXI.Texture.from('images/dungeon/' + zoneName +'-floor.jpg')
			})
			// ceiling
			dungeon.tilesCeiling.map(tile => {
				tile.texture = PIXI.Texture.from('images/dungeon/' + zoneName +'-ceiling.jpg')
			})
			// left wall
			dungeon.tilesLeftWall.map(tile => {
				tile.texture = PIXI.Texture.from('images/dungeon/' + zoneName +'-wall.jpg')
			})
			// right wall
			dungeon.tilesRightWall.map(tile => {
				tile.texture = PIXI.Texture.from('images/dungeon/' + zoneName +'-wall-right.jpg')
			})
			// end wall
			dungeon.endWall.texture = PIXI.Texture.from('images/dungeon/'+ zoneName +'-door.jpg')
		}
	}

})(TweenMax, $, _, Power0, Sine, Power2);