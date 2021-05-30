let map;
!function($, _, TweenMax, getComputedStyle, parseInt, window, undefined) {
	map = {
		inCombat: false,
		menuPrompt: false,
		isShown: false,
		isDragging: false,
		mouseX: 0, // used for wheel scaling
		mouseY: 0,
		roomX: 0, // coordinate X of origin room
		roomY: 0,// coordinate Y of origin room
		cameraX: 0, // map camera position
		cameraY: 0,
		dotX: 0, // relative to center
		dotY: 0, // relative to center
		inRoom: true,
		hallwayId: 0,
		roomId: 0,
		roomToId: 0,
		compass: 0, // 0-3 clockwise
		scale: 100,
		width: 0,
		height: 0,
		questHeader: querySelector('#quest-header'),
		questName: querySelector('#quest-name'),
		dot: querySelector('#mini-map-dot'),
		// fog: querySelector('#mini-map-fog'),
		miniMapDrag: querySelector('#mini-map-drag'),
		miniMapParent: querySelector('#mini-map-drag-parent'),
		dragWidth: 0,
		dragHeight: 0,
		dragMap: {},
		fogTween: {},
		init,
		setMapScale,
		setCameraPosition,
		setZoomPosition,
		wheelZoomIn,
		wheelZoomOut,
		applyBounds,
		centerMap,
		centerCameraAt,
		updatePosition,
		setCompass,
		setDotPosition,
		enterRoom,
		enterHallway,
		endCombat,
		show,
		hide,
		rxEnterHallway,
		revealRoom,
		revealMap,
		getRoomClearData,
		drawMap,
		setRoom0,
		animateTorch,
	}

	let torch = {
		tween: {},
		lastFrame: 1,
		frame: 1,
	}
	let torchGlow = {
		tween: {},
		lastRadius: 30,
		radius: 30,
	}

	const SCALE_IN_MAX = 50 // ZOOM OUT
	const SCALE_DEFAULT = 100
	const SCALE_OUT_MAX = 150 // ZOOM IN
	const SCALE_INCREMENT = 10
	// must be at least double parent width/height - 600 should be absolute minimum in general
	const PARENT_WIDTH = map.miniMapParent.offsetWidth
	const PARENT_HEIGHT = map.miniMapParent.offsetHeight
	const PARENT_WIDTH_HALF = PARENT_WIDTH * .5
	const PARENT_HEIGHT_HALF = PARENT_HEIGHT * .5
	const MIN_MAP_WIDTH = PARENT_WIDTH * (1 / (SCALE_IN_MAX * .01))
	const MIN_MAP_HEIGHT = PARENT_HEIGHT * (1 / (SCALE_IN_MAX * .01))
	const TURN_INTERVAL = 90
	const DOT_OFFSET = map.dot.offsetWidth * .5
	// const FOG_OFFSET = map.fog.offsetWidth * .5

	/*map.fogTween = TweenMax.to(map.fog, .2, {
		startAt: { scale: 1.007 },
		scale: 1,
		repeat: -1,
		yoyo: true,
		ease: Sine.easeOut,
	})
	map.fogTween.pause()*/
	///////////////////////////////////////////
	$('#mini-map-drag').on('wheel', handleWheel)
	$('#mini-map-party').on('click', handleCenterParty)
	$('#mini-map-leave').on('click', handleLeave)
	$('#quest-completed').on('click', handleQuestCompleted)
	$('#mini-map-prompt-btn-yes').on('click', handleMapYes)
	$('#mini-map-prompt-btn-no').on('click', handleMapNo)
	$(map.miniMapDrag).on('click', '.map-room', handleRoomClick)

	function init() {
		map.dragMap = Draggable.create(map.miniMapDrag, {
			bounds: map.miniMapParent,
			type: 'x,y',
			throwProps: true,
			throwResistance: 250,
			edgeResistance: 1,
			force3D: true,
			allowContextMenu: true,
			onDragStart: handleDragStart,
			onDragEnd: handleDragEnd,
			onThrowUpdate: throwUpdate,
			onThrowComplete: throwUpdate,
		})[0]

		map.setRoom0()

		// map dimensions
		map.width = Math.max(MIN_MAP_WIDTH, dungeon.map.width)
		map.height = Math.max(MIN_MAP_HEIGHT, dungeon.map.height)

		// set dynamic style
		map.drawMap()
		cache.preloadTorch()
		map.animateTorch()
	}
	function setRoom0() {
		// init map data
		map.dotX = map.roomX = map.cameraX = dungeon.map.rooms[0].x
		map.dotY = map.roomY = map.cameraY = dungeon.map.rooms[0].y

		// map state
		map.inRoom = true
		map.hallwayId = map.roomId = map.roomToId = dungeon.distanceCurrent = 0
		map.setDotPosition()

		delayedCall(1.5, () => {
			map.centerCameraAt(map.dotX, map.dotY)
		})
	}
	function drawMap() {
		util.removeElements(querySelectorAll('.map-room, .map-hallway'))
		map.miniMapDrag.style.width = map.width + 'px'
		map.miniMapDrag.style.height = map.height + 'px'
		dungeon.map.rooms.forEach(createRoom)
		dungeon.map.hallways.forEach(createHallway)
	}
	function createRoom(room) {
		// console.info('room', room)
		let el = createElement('img')
		el.id = 'room-' + room.id
		if (Config.showMapNumbers) {
			el.innerHTML = room.id
		}
		el.className = 'mini-map-entity map-room'

		if (room.id === 0) {
			el.style.opacity = 1
			el.src = 'images/map/room-safe.png'
		}
		else if (room.isTreasure) {
			el.src = 'images/map/room-treasure.png'
		}
		else if (room.isRelic) {
			el.src = 'images/map/room-relic.png'
		}
		else if (room.boss) {
			el.classList.add('boss-room')
			el.src = 'images/map/room-boss.png'
			console.warn('BOSS', room.id, room)
		}
		else if (room.isAlive) {
			el.src = 'images/map/room-combat.png'
		}
		else {
			el.src = 'images/map/room-empty.png'
		}
		el.style.top = room.y + 'px'
		el.style.left = room.x + 'px'
		map.miniMapDrag.appendChild(el)
	}
	function createHallway(hallway) {
		// console.info('hallway', hallway)
		let el = createElement('div')
		el.id = 'hallway-' + hallway.id
		if (Config.showMapNumbers) {
			el.innerHTML = hallway.id
		}
		if (hallway.width === 16) el.className = 'mini-map-entity map-hallway map-hallway-y'
		else el.className = 'mini-map-entity map-hallway map-hallway-x'
		el.style.top = hallway.y + 'px'
		el.style.left = hallway.x + 'px'
		el.style.width = hallway.width + 'px'
		el.style.height = hallway.height + 'px'
		map.miniMapDrag.appendChild(el)
	}
	function handleDragStart() {
		map.isDragging = true
	}
	function handleDragEnd() {
		map.isDragging = false
	}
	function updatePosition() {
		if (map.compass === 0) {
			// north
			map.cameraY =
				map.dotY =
					map.roomY - ((100 * dungeon.distanceCurrent) / dungeon.hallwayLength)
		}
		else if (map.compass === 1) {
			// east
			map.cameraX =
				map.dotX = 
					map.roomX + ((100 * dungeon.distanceCurrent) / dungeon.hallwayLength)
		}
		else if (map.compass === 2) {
			// south
			map.cameraY =
				map.dotY =
					map.roomY + ((100 * dungeon.distanceCurrent) / dungeon.hallwayLength)
		}
		else if (map.compass === 3) {
			// west
			map.cameraX =
				map.dotX =
					map.roomX - ((100 * dungeon.distanceCurrent) / dungeon.hallwayLength)
		}
		// console.info('map.camera', map.cameraX, map.cameraY)
		map.setDotPosition()
		map.setCameraPosition(0)
	}
	function handleWheel(e) {
		if (e.originalEvent.deltaY < 0) map.wheelZoomIn(e)
		else map.wheelZoomOut(e)
		typeof e.preventDefault === 'function' && e.preventDefault()
	}
	function wheelZoomIn(e) {
		if (map.scale >= SCALE_OUT_MAX) return
		map.setZoomPosition(e)
		map.scale += SCALE_INCREMENT
		if (map.scale > SCALE_OUT_MAX) map.scale = SCALE_OUT_MAX
		map.setMapScale()
	}
	function wheelZoomOut(e) {
		if (map.scale <= SCALE_IN_MAX) return
		map.setZoomPosition(e)
		map.scale -= SCALE_INCREMENT
		if (map.scale < SCALE_IN_MAX) map.scale = SCALE_IN_MAX
		map.setMapScale()
	}
	function setZoomPosition(e) {
		if (e.target.id === 'mini-map-drag') {
			map.mouseX = e.originalEvent.offsetX
			map.mouseY = e.originalEvent.offsetY
			// constrain for mouse position
			if (e.originalEvent.offsetX > map.width - PARENT_WIDTH_HALF) map.mouseX = map.width - PARENT_WIDTH_HALF
			else if (e.originalEvent.offsetX < PARENT_WIDTH_HALF) map.mouseX = PARENT_WIDTH_HALF
			if (e.originalEvent.offsetY > map.height - PARENT_HEIGHT_HALF) map.mouseY = map.height - PARENT_HEIGHT_HALF
			else if (e.originalEvent.offsetY < PARENT_HEIGHT_HALF) map.mouseY = PARENT_HEIGHT_HALF
		}
		else {
			// zoomed on a room
			map.mouseX = e.target.offsetLeft
			map.mouseY = e.target.offsetTop
		}
	}
	function applyBounds() {
		typeof map.dragMap.applyBounds === 'function' && map.dragMap.applyBounds()
	}
	function throwUpdate() {
		map.applyBounds()
	}
	function centerMap() {
		map.cameraX = (map.width * .5) - PARENT_WIDTH_HALF * -1
		map.cameraY = (map.height * .5) - PARENT_HEIGHT_HALF * -1
		map.scale = SCALE_DEFAULT
		map.setCameraPosition(1)
	}
	/*function setOrigin(t) {
		TweenMax.set(map.miniMapDrag, {
			transformOrigin: t.x + 'px ' + t.y + 'px',
		})
	}*/
	function setMapScale() {
		TweenMax.set(map.miniMapDrag, {
			transformOrigin: map.scale < 100 ?
				map.width * .5 + 'px ' + map.height * .5 + 'px' :
				map.mouseX + 'px ' + map.mouseY + 'px',
		})
		TweenMax.to(map.miniMapDrag, .5, {
			scale: map.scale * .01,
			onUpdate: applyBounds,
			onComplete: applyBounds,
		})
	}
	function setDotPosition() {
		TweenMax.set(map.dot, {
			x: map.dotX - DOT_OFFSET,
			y: map.dotY - DOT_OFFSET,
		})
		/*TweenMax.set(map.fog, {
			x: map.dotX - FOG_OFFSET,
			y: map.dotY - FOG_OFFSET
		})*/
	}
	function setCameraPosition(delay) {
		map.setMapScale()
		TweenMax.to(map.miniMapDrag, delay, {
			x: -map.cameraX + PARENT_WIDTH_HALF,
			y: -map.cameraY + PARENT_HEIGHT_HALF,
			onUpdate: map.applyBounds
		})
	}
	function centerCameraAt(x, y) {
		// constrain x
		if (x < 0) x = 0
		else if (x > map.width) x = map.width
		// constrain y
		if (y < 0) y = 0
		else if (y > map.height) y = map.height
		map.cameraX = x
		map.cameraY = y
		console.warn('centerCameraAt', map.cameraX, map.cameraY)
		map.scale = SCALE_DEFAULT
		map.setCameraPosition(1)
	}
	function handleCenterParty() {
		map.centerCameraAt(map.dotX, map.dotY)
	}
	function handleLeave() {
		if (party.presence[0].isLeader) {
			map.menuPrompt = true
			querySelector('#mini-map-confirm-wrap').style.visibility = 'visible'
			TweenMax.to('#mini-map-confirm-wrap', .3, {
				startAt: { opacity: 0 },
				opacity: 1
			})
			TweenMax.to('#mini-map-prompt-border', .5, {
				startAt: { scale: 0 },
				scale: 1,
				ease: Back.easeOut,
			})
		}
		else {
			ng.msg('Only the party leader can make that decision.')
		}
	}
	function handleMapYes() {
		map.menuPrompt = false
		querySelector('#mini-map-confirm-wrap').style.visibility = 'hidden'
		mission.txReturnToTown()
	}
	function handleMapNo() {
		map.menuPrompt = false
		TweenMax.to('#mini-map-prompt-border', .25, {
			scale: 0,
		})
		TweenMax.to('#mini-map-confirm-wrap', .5, {
			startAt: { opacity: 1 },
			opacity: 0,
			onComplete: () => {
				querySelector('#mini-map-confirm-wrap').style.visibility = 'hidden'
			}
		})
	}
	function handleRoomClick(e) {
		let roomId = e.target.id.split('-')[1] * 1
		if (my.isLeader && map.inRoom && combat.isBattleOver()) {
			if (roomId === map.roomId) {
				chat.log('You are already in that room!', CHAT.WARNING)
				audio.playSound('click-3')
			}
			else {
				if (dungeon.map.rooms[map.roomId].connects.includes(roomId)) {
					enterHallway(roomId)
					audio.playSound('click-20')
				}
				else {
					console.warn('does not connect!', roomId, map.roomId, dungeon.map.rooms[map.roomId].connects)
					audio.playSound('click-3')
				}
			}
		}
	}
	function enterRoom(roomId) {
		map.inRoom = true
		map.roomId = roomId
		map.roomX = dungeon.map.rooms[roomId].x
		map.roomY = dungeon.map.rooms[roomId].y
	}
	function enterHallway(roomId) {
		if (party.presence[0].isLeader) {
			let data = {
				route: 'p->enterHallway',
				id: roomId,
			}
			if (party.hasMoreThanOnePlayer()) {
				socket.publish('party' + my.partyId, data, true)
			}
			map.rxEnterHallway(data)
		}
	}
	function rxEnterHallway(data) {
		map.roomToId = data.id
		map.hallwayId = dungeon.map.hallways.find(h =>
			h.connects.includes(map.roomId) &&
			h.connects.includes(map.roomToId)
		).id
		map.inRoom = false

		if (typeof dungeon.entities[map.hallwayId] === 'object' && !dungeon.entities[map.hallwayId].length ||
			typeof dungeon.entities[map.hallwayId] === 'undefined') {
			dungeon.entities[map.hallwayId] = dungeon.map.hallways[map.hallwayId].entities
		}
		dungeon.distanceCurrent = dungeon.hallwayPlayerStart
		dungeon.distanceEnd = getHallwayDistance(map.hallwayId)
		map.setCompass()
		map.updatePosition()
		console.info('enterHallway', 'room', data.id, 'hallway', map.hallwayId)
		dungeon.go()
		audio.playEnterDoor()
	}
	function revealRoom() {
		let rooms = ['#room-' + map.roomId]
		let halls = []
		dungeon.map.rooms[map.roomId].visible = true
		dungeon.map.rooms[map.roomId].connects.forEach(roomId => {
			rooms.push('#room-' + roomId)
			dungeon.map.rooms[roomId].visible = true
			let hallIndex = dungeon.map.hallways.findIndex(h => {
				return h.connects.includes(roomId) && h.connects.includes(map.roomId)
			})
			dungeon.map.hallways[hallIndex].visible = true
			halls.push('#hallway-' + hallIndex)
		})
		/*console.info('halls', halls)
		console.info('rooms', rooms)*/
		TweenMax.to(halls, 1, {
			startAt: { visibility: 'visible' },
			delay: .5,
			opacity: 1
		})
		TweenMax.to(rooms, 1, {
			startAt: { visibility: 'visible' },
			delay: 1,
			opacity: 1
		})
	}
	function revealMap() {
		let els = []
		dungeon.map.rooms.forEach(r => {
			(r.id === 0 || r.visible) && els.push('#room-' + r.id)
		})
		dungeon.map.hallways.forEach(h => {
			h.visible && els.push('#hallway-' + h.id)
		})

		TweenMax.set('.map-room, .map-hallway', {
			startAt: { visibility: 'hidden' },
			opacity: 0
		})
		TweenMax.to(els, 1, {
			startAt: { visibility: 'visible' },
			opacity: 1
		})
	}
	function setCompass() {
		let room = dungeon.map.rooms[map.roomId]
		let roomTo = dungeon.map.rooms[map.roomToId]
		if (roomTo.y < room.y) map.compass = 0
		else if (roomTo.y > room.y) map.compass = 2
		else if (roomTo.x < room.x) map.compass = 3
		else map.compass = 1
	}
	function endCombat(isRespawn = false) { // clear room or hallway
		// map stuff
		if (map.inRoom) {
			// in a room
			if (!isRespawn) dungeon.map.rooms[map.roomId].isAlive = false
			/*
			// why was this here? I dunno
			TweenMax.set('#room-' + map.roomId, {
				backgroundColor: '#060',
			})*/
			if (mission.isQuestCompleted() &&
				!mission.isCompleted) {
				// quest has been completed! show Dark souls message
				delayedCall(3, () => {
					combat.showQuestMsg()
					!isRespawn && map.show(3)
				})
			}
			else {
				!isRespawn && map.show(3)
			}
			delayedCall(1.5, () => {
				audio.fadeMusic()
				audio.playAmbientLoop()
			})
		}
		else {
			// clear nearest entity and redraw
			if (!isRespawn && dungeon.closestEntityIndex > -1) {
				dungeon.entities[map.hallwayId][dungeon.closestEntityIndex].isAlive = false
				dungeon.entities[map.hallwayId][dungeon.closestEntityIndex].timestamp = Date.now()
				dungeon.entities[map.hallwayId][dungeon.closestEntityIndex].sprite.alpha = 0
			}
			dungeon.setDungeonEntities()
			// return to dungeon hallway
			!isRespawn && delayedCall(4, dungeon.go, [true])
			delayedCall(1.5, () => {
				audio.playAmbientLoop()
			})
			!isRespawn && map.show(4)
		}
	}
	function getHallwayDistance(id) {
		let len
		if (dungeon.map.hallways[id].width === HALLWAY_WIDTH) {
			// vertical
			len = dungeon.map.hallways[id].height * 96
		}
		else {
			// horizontal
			len = dungeon.map.hallways[id].width * 96
		}
		return len
	}
	function show(delay = 0) {
		map.isShown = true
		map.inCombat = false
		TweenMax.to('#mini-map', .6, {
			delay: delay,
			startAt: { visibility: 'visible' },
			opacity: 1,
			scale: 1,
			ease: Back.easeOut,
		})
		// map.fogTween.play()
		querySelector('#quest-log').classList.remove('no-pointer')
		if (mission.isQuestCompleted()) {
			TweenMax.set([map.questHeader, map.questName], CSS.DISPLAY_NONE)
			querySelector('#quest-completed').classList.add('no-pointer')
			if (party.presence[0].isLeader) {
				querySelector('#quest-completed').classList.remove('no-pointer')
			}
			TweenMax.set('#quest-completed', CSS.DISPLAY_BLOCK)
		}
		else {
			TweenMax.set([map.questHeader, map.questName], CSS.DISPLAY_BLOCK)
			TweenMax.set('#quest-completed', CSS.DISPLAY_NONE)
			querySelector('#quest-log').classList.add('no-pointer')
			map.questHeader.textContent = 'Objective:'
			map.questName.textContent = mission.getTitle(mission.questId)
		}
		delayedCall(delay, map.revealRoom)
		animateTorch()
	}
	function hide() {
		map.isShown = false
		TweenMax.set('#mini-map', {
			visibility: 'hidden',
			opacity: 0,
			scale: 0,
		})
		killTorchTween()
	}
	function handleQuestCompleted() {
		console.info('handleQuestCompleted')
		mission.txReturnToTown()
	}
	function getRoomClearData() {
		let data = dungeon.map.rooms.reduce((acc, r) => {
			if (r.id === 0 || r.boss) {
				// don't count these rooms
			}
			else {
				acc.total++
				if (!r.isAlive) {
					acc.cleared++
				}
			}
			return acc
		}, {total: 0, cleared: 0, bossUnlocked: false})
		if (data.cleared / data.total >= .9) {
			data.bossUnlocked = true
		}
		return data
	}
	function animateTorch() {
		killTorchTween()
		torch = {
			lastFrame: 1,
			frame: 1,
		}
		torchGlow = {
			lastRadius: 30,
			radius: 30,
		}
		torch.tween = TweenMax.to(torch, .5, {
			frame: 5.99,
			ease: Power0.easeIn,
			repeat: -1,
			onUpdate: setTorchFrame,
		})
		torchGlow.tween = TweenMax.to(torchGlow, .3, {
			radius: 33.99,
			ease: Power0.easeOut,
			repeat: -1,
			yoyo: true,
			onUpdate: setTorchRadius,
		})
	}
	function killTorchTween() {
		if (typeof torch.tween.kill === 'function') {
			torch.tween.kill()
			torchGlow.tween.kill()
		}
	}
	function setTorchFrame() {
		if (torch.lastFrame !== ~~torch.frame) {
			torch.lastFrame = ~~torch.frame
			map.dot.src = 'images/map/torch-' + torch.lastFrame + '.png'
		}
	}
	function setTorchRadius() {
		if (torchGlow.lastRadius !== ~~torchGlow.radius) {
			torchGlow.lastRadius = ~~torchGlow.radius
			TweenMax.set(map.dot, {
				background: 'radial-gradient('+ torchGlow.lastRadius +'% '+ torchGlow.lastRadius +'% at 50% 40%, #f80, transparent)'
			})
		}
	}
}($, _, TweenMax, getComputedStyle, parseInt, window);