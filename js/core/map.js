let map;
!function($, _, TweenMax, getComputedStyle, parseInt, window, undefined) {
	map = {
		isDragging: false,
		originX: 0,
		originY: 0,
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
		dot: querySelector('#mini-map-dot'),
		miniMapDrag: querySelector('#mini-map-drag'),
		miniMapParent: querySelector('#mini-map-drag-parent'),
		dragWidth: 0,
		dragHeight: 0,
		dragMap: {},
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
	///////////////////////////////////////////
	$('#mini-map-drag').on('wheel', handleWheel)
	$('#mini-map-party').on('click', handleCenterParty)
	$(map.miniMapDrag).on('click', '.map-room', handleRoomClick)

	function init(mapData) {
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

		// init map data
		map.originX = map.dotX = map.roomX = map.cameraX = dungeon.map.rooms[0].x
		map.originY = map.dotY = map.roomY = map.cameraY = dungeon.map.rooms[0].y

		// map dimensions
		map.width = Math.max(MIN_MAP_WIDTH, dungeon.map.width)
		map.height = Math.max(MIN_MAP_HEIGHT, dungeon.map.height)

		map.setDotPosition()
		// set dynamic style
		map.miniMapDrag.style.width = map.width + 'px'
		map.miniMapDrag.style.height = map.height + 'px'

		mapData.rooms.forEach(createRoom)
		mapData.hallways.forEach(createHallway)

		delayedCall(1.5, () => {
			map.centerCameraAt(map.dotX, map.dotY)
		})
	}
	function createRoom(room) {
		// console.info('room', room)
		let el = createElement('div')
		el.id = 'room-' + room.id
		el.innerHTML = room.id
		el.className = 'mini-map-entity map-room'
		if (room.boss) {
			el.classList.add('boss-room')
		}
		el.style.top = room.y + 'px'
		el.style.left = room.x + 'px'
		map.miniMapDrag.appendChild(el)
	}
	function createHallway(hallway) {
		// console.info('hallway', hallway)
		let el = createElement('div')
		el.id = 'hallway-' + hallway.id
		el.innerHTML = hallway.id
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
	function handleRoomClick(e) {
		let roomId = e.target.id.split('-')[1] * 1
		if (my.isLeader && map.inRoom && combat.isBattleOver()) {
			if (roomId === map.roomId) {
				chat.log('You are already in that room!', CHAT.WARNING)
			}
			else {
				if (dungeon.map.rooms[map.roomId].connects.includes(roomId)) {
					enterHallway(roomId)
				}
				else {
					console.warn('does not connect!', roomId, map.roomId, dungeon.map.rooms[map.roomId].connects)
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
	}
	function setCompass() {
		let room = dungeon.map.rooms[map.roomId]
		let roomTo = dungeon.map.rooms[map.roomToId]
		if (roomTo.y < room.y) map.compass = 0
		else if (roomTo.y > room.y) map.compass = 2
		else if (roomTo.x < room.x) map.compass = 3
		else map.compass = 1
	}
	function endCombat() {
		// map stuff
		if (map.inRoom) {
			// in a room
			dungeon.map.rooms[map.roomId].isAlive = false
			map.show(3)
		}
		else {
			// clear nearest entity and redraw
			dungeon.entities[map.hallwayId][dungeon.closestEntityIndex].isAlive = false
			dungeon.entities[map.hallwayId][dungeon.closestEntityIndex].sprite.alpha = 0
			dungeon.setDungeonEntities()
			// return to dungeon hallway
			delayedCall(4, dungeon.go, [true])
			map.show(4)
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
		TweenMax.to('#mini-map', .6, {
			delay: delay,
			startAt: {
				visibility: 'visible',
			},
			opacity: 1,
			scale: 1,
			ease: Back.easeOut,
		})
	}
	function hide() {
		TweenMax.set('#mini-map', {
			visibility: 'hidden',
			opacity: 0,
			scale: 0,
		})
	}
}($, _, TweenMax, getComputedStyle, parseInt, window);