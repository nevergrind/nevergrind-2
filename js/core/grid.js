let Grid;
!function($, _, TweenMax, undefined) {
	const HORIZONTAL_HALL = {width: HALLWAY_LENGTH, height: HALLWAY_WIDTH}
	const VERTICAL_HALL = {width: HALLWAY_WIDTH, height: HALLWAY_LENGTH}
	const ROOM_DISTANCE = 100
	Grid = {
		config: {
			small: {
				width: 600,
				height: 600, // 5x5 = 25
				totalRooms: 16,
			},
			medium: {
				width: 800,
				height: 800, // 7x7 = 49
				totalRooms: 30,
			},
			long: {
				width: 1000,
				height: 1000, // 9x9 = 81
				totalRooms: 44,
			},
		},
		createMap,
	}
	///////////////////////////////////////////
	function createMap(size) {
		let grid = {}
		if (typeof size === 'undefined' ||
			typeof Grid.config[size] === 'undefined') {
			grid = Grid.config.small
		}
		else {
			grid = Grid.config[size]
		}
		const MAX_ROOMS = ~~((((grid.width - ROOM_DISTANCE) / 100) * ((grid.height - ROOM_DISTANCE) / 100)) * .66)
		grid.totalRooms = Math.min(grid.totalRooms, MAX_ROOMS)
		let xRange = (grid.width - (ROOM_DISTANCE * 2)) / 100
		let yRange = (grid.height - (ROOM_DISTANCE * 2)) / 100
		let xStart = _.random(1, 1 + xRange) * 100
		let yStart = _.random(1, 1 + yRange) * 100

		grid.rooms = [{
			id: 0,
			x: xStart,
			y: yStart,
			connects: []
		}]
		grid.hallways = []

		while (grid.rooms.length < grid.totalRooms) {
			let validRoomIds = grid.rooms.filter(roomHasLessThanThreeHallways).map(getRoomIds)
			let fromId = validRoomIds[_.random(0, validRoomIds.length - 1)]
			let direction = getDirection(fromId)
			if (direction >= 0) {
				addRoom(grid, { from: fromId, to: direction })
			}
		}
		return grid
		//////////////////////////////////
		function getDirection(fromId) {
			let validDirections = []
			if (grid.rooms[fromId].y > ROOM_DISTANCE &&
				!grid.hallways.some(hallwayFoundNorth)) {
				// must be > 100 and have no hallway north of it
				validDirections.push(0)
			}
			if (grid.rooms[fromId].x < grid.width - ROOM_DISTANCE &&
				!grid.hallways.some(hallwayFoundEast)) {
				validDirections.push(1)
			}
			if (grid.rooms[fromId].y < grid.height - ROOM_DISTANCE &&
				!grid.hallways.some(hallwayFoundSouth)) {
				validDirections.push(2)
			}
			if (grid.rooms[fromId].x > ROOM_DISTANCE &&
				!grid.hallways.some(hallwayFoundWest)) {
				validDirections.push(3)
			}
			if (!validDirections.length) {
				// no valid directions hmmmmm - this shouldn't happen :((
				return -1
			}
			let dirLen = validDirections.length - 1

			return validDirections[_.random(0, dirLen)]
			//////////////////////////////
			function hallwayFoundNorth(h) {
				return h.x === grid.rooms[fromId].x &&
					h.y === grid.rooms[fromId].y - ROOM_DISTANCE &&
					h.height === HALLWAY_LENGTH
			}
			function hallwayFoundEast(h) {
				return h.x === grid.rooms[fromId].x &&
					h.y === grid.rooms[fromId].y &&
					h.width === HALLWAY_LENGTH
			}
			function hallwayFoundSouth(h) {
				return h.x === grid.rooms[fromId].x &&
					h.y === grid.rooms[fromId].y &&
					h.height === HALLWAY_LENGTH
			}
			function hallwayFoundWest(h) {
				return h.x === grid.rooms[fromId].x - ROOM_DISTANCE &&
					h.y === grid.rooms[fromId].y &&
					h.width === HALLWAY_LENGTH
			}
		}
		function roomHasLessThanThreeHallways(r) {
			return r.connects.length < 3
		}
		function getRoomIds(r) {
			return r.id
		}
	}
	function addRoom(grid, room) {
		let addedRoomId = grid.rooms.length
		let hallId = grid.hallways.length
		let origin = grid.rooms[room.from]
		// determine relational position
		// console.info('room.from', room.from)
		room.x = origin.x
		room.y = origin.y
		// set new coordinates based on direction
		if (room.to === 0) room.y -= ROOM_DISTANCE
		else if (room.to === 1) room.x += ROOM_DISTANCE
		else if (room.to === 2) room.y += ROOM_DISTANCE
		else if (room.to === 3) room.x -= ROOM_DISTANCE
		// room already exists at room coordinates?
		let findRoomId = grid.rooms.findIndex(r => r.x === room.x && r.y === room.y)
		if (findRoomId === -1) {
			// VALID - room with these coordinates does not exist yet
			grid.rooms.push({
				id: addedRoomId,
				x: room.x,
				y: room.y,
				connects: [room.from]
			})
		}
		else {
			// INVALID - room exists - connect hallways only
			addedRoomId = findRoomId
			let connects = grid.rooms[addedRoomId].connects.length
			if (connects >= 2 && Math.random() > .33) return
			else if (connects >= 1 && Math.random() > .66) return
			if (!grid.rooms[addedRoomId].connects.includes(room.from)) {
				grid.rooms[addedRoomId].connects.push(room.from)
			}
		}
		if (addedRoomId !== origin.id) {
			// new hallway - rooms cannot connect to themselves... this shouldn't be possible
			grid.hallways.push({
				id: hallId,
				x: room.x > origin.x ? origin.x : room.x,
				y: room.y > origin.y ? origin.y : room.y,
				connects: [addedRoomId, origin.id],
				...(room.x !== origin.x ? HORIZONTAL_HALL : VERTICAL_HALL),
			})
			origin.connects.push(addedRoomId)
		}
	}
}($, _, TweenMax);